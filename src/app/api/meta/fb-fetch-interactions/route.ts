import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import clientPromise from '@/utils/startMongo';
import { Interacciones } from '@/types';
import { obtenerCuentasRedesSociales, obtenerSoloReglasDeCuentas } from '@/app/actions/(socialmood)/get-plans.actions';
import { generateChatGPTResponse } from "@/lib/openai/generate-response-interactions";

export const dynamic = 'force-dynamic';

const GRAPH_API_URL = 'https://graph.facebook.com/v20.0';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface FacebookBatchResponse {
  code: number;
  headers: { name: string; value: string }[];
  body: string;
}

interface FacebookComment {
  id: string;
  from: { id: string; name: string };
  message: string;
  created_time: string;
}

interface FacebookPost {
  id: string;
}

interface FacebookPageDetails {
  id: string;
  name: string;
}

const fetchPageDetails = async (PAGE_ACCESS_TOKEN: string): Promise<FacebookPageDetails> => {
  const response = await fetch(`${GRAPH_API_URL}/me?fields=id,name&access_token=${PAGE_ACCESS_TOKEN}`);
  const data = await response.json();
  return data;
};

const fetchPagePosts = async (pageId: string, PAGE_ACCESS_TOKEN: string): Promise<FacebookPost[]> => {
  const response = await fetch(`${GRAPH_API_URL}/${pageId}/feed?access_token=${PAGE_ACCESS_TOKEN}`);
  const data = await response.json();
  return data.data || [];
};

const fetchAllPostCommentsBatch = async (
  postIds: string[],
  PAGE_ACCESS_TOKEN: string
): Promise<FacebookComment[]> => {
  const batchRequests = postIds.map(postId => ({
    method: 'GET',
    relative_url: `${postId}/comments?limit=25`
  }));

  const response = await fetch(`${GRAPH_API_URL}`, {
    method: 'POST',
    body: JSON.stringify({ batch: batchRequests, access_token: PAGE_ACCESS_TOKEN }),
    headers: { 'Content-Type': 'application/json' }
  });

  const data: FacebookBatchResponse[] = await response.json();
  let allComments: FacebookComment[] = [];

  data.forEach(batchResponse => {
    if (batchResponse.body) {
      const comments = JSON.parse(batchResponse.body).data as FacebookComment[];
      allComments = allComments.concat(comments);
    }
  });

  return allComments;
};


const generateUniqueCode = (message: string, accountId: string) => {
  const hash = crypto.createHash('sha256');
  hash.update(`${message}-${accountId}`);
  return hash.digest('hex');
};

async function sendInteraction(message: string) {
    try {
        const response = await fetch('https://social-mood-dun.vercel.app/api/interactions/catalog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('Error al enviar la interacción');
        }

        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error al enviar la interacción:', error);
    }
}

const sanitizeUtf8String = (str: string) => {
  return str.replace(/[^\u0000-\u007F]/g, ""); 
};

const saveCommentsToMongo = async (
  comments: FacebookComment[],
  postId: string[],
  pageId: string,
  pageName: string,
  PAGE_ACCESS_TOKEN: string,
  regla: string 
) => {
  const client = await clientPromise;
  const db = client.db('socialMood');
  const collection = db.collection('Interacciones');

  for (const comment of comments) {
    const sanitizedMessage = sanitizeUtf8String(comment.message);
    const uniqueCode = generateUniqueCode(sanitizedMessage, comment.from?.id || '');

    const existingComment = await collection.findOne({ unique_code: uniqueCode });

    if (!existingComment) {
    let data;
    let responseMessage: string = '';
    try {
      const categoriasResponse = await sendInteraction(sanitizedMessage);
      
      console.log('Response from categoriasResponse:', categoriasResponse);
      data = categoriasResponse?.interaction;

      responseMessage = await generateChatGPTResponse(sanitizedMessage, regla); 
    } catch (error) {
      console.error(`Error generating ChatGPT response: ${error}`);
    }

      const interaccion: Interacciones = {
        fecha_recepcion: comment.created_time,
        fecha_respuesta: new Date(),
        mensaje: sanitizedMessage || '',
        enlace_publicacion: `${GRAPH_API_URL}/${postId}`,
        codigo_cuenta_emisor: comment.from?.id || '',
        enlace_foto_emisor: '',
        codigo_cuenta_receptor: pageId,
        id_cuenta_receptor: Number(pageId),
        nombre_red_social_receptor: 'Facebook',
        categoria: data?.categoria || '', 
        subcategoria: data?.subcategoria || '', 
        emociones_predominantes: data?.emociones?.join(', ') || '',
        respondida: false,
        respuesta: responseMessage,
        usuario_cuenta_receptor: pageName,
        usuario_cuenta_emisor: comment.from?.name || 'Anonymous',
        unique_code: uniqueCode,
      };

      await collection.insertOne(interaccion);
      console.log(`.`);
    } else {
      console.log(`.`);
    }

    await delay(200); 
  }
};

export async function GET(request: Request) {
  try {
    const cuentas = await obtenerCuentasRedesSociales();

    // Iterate over each account
    for (const cuenta of cuentas) {
      console.log( cuentas)
      const PAGE_ACCESS_TOKEN = cuenta.llave_acceso;
      const pageDetails = await fetchPageDetails(PAGE_ACCESS_TOKEN);

      if (!pageDetails || !pageDetails.id) {
        console.error(`Unable to retrieve Page details for account ${cuenta.usuario_cuenta}`);
        continue;
      }

      const pageId = pageDetails.id;
      const pageName = pageDetails.name;
      const posts = await fetchPagePosts(pageId, PAGE_ACCESS_TOKEN);

      const postIds = posts.map(post => post.id);
      const comments = await fetchAllPostCommentsBatch(postIds, PAGE_ACCESS_TOKEN);

      const regla = await obtenerSoloReglasDeCuentas(cuenta.id);

      await saveCommentsToMongo(comments, postIds, pageId, pageName, PAGE_ACCESS_TOKEN, regla);
    }

    return NextResponse.json({
      message: 'FUNCIONO',
    });
  } catch (error) {
    console.error('Error fetching or saving posts and comments:', error);
    return NextResponse.json({ error: 'Failed to fetch or save posts and comments' }, { status: 500 });
  }
}
