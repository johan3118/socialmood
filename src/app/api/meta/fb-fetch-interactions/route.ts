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

const fetchPageDetails = async (PAGE_ACCESS_TOKEN: string): Promise<FacebookPageDetails | null> => {
  try {
    const response = await fetch(`${GRAPH_API_URL}/me?fields=id,name&access_token=${PAGE_ACCESS_TOKEN}`);
    if (!response.ok) {
      console.error(`Error fetching page details: ${response.status} - ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchPageDetails:', error);
    return null;
  }
};


const fetchPagePosts = async (pageId: string, PAGE_ACCESS_TOKEN: string): Promise<FacebookPost[]> => {
  try {
    const response = await fetch(`${GRAPH_API_URL}/${pageId}/feed?access_token=${PAGE_ACCESS_TOKEN}`);
    if (!response.ok) {
      console.error(`Error fetching page posts: ${response.status} - ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error in fetchPagePosts:', error);
    return [];
  }
};

const fetchAllPostCommentsBatch = async (
  postIds: string[],
  PAGE_ACCESS_TOKEN: string,
  since: string
): Promise<FacebookComment[]> => {
  let allComments: FacebookComment[] = [];
  const commentLimit = 5;

  for (const postId of postIds) {
    let afterPaginationUrl = `${GRAPH_API_URL}/${postId}/comments?limit=${commentLimit}&access_token=${PAGE_ACCESS_TOKEN}`;
    let beforePaginationUrl = `${GRAPH_API_URL}/${postId}/comments?limit=${commentLimit}&access_token=${PAGE_ACCESS_TOKEN}`;
    
    let hasNextAfterPage = true;
    let hasNextBeforePage = true;

    while (hasNextAfterPage) {
      try {
        const response = await fetch(afterPaginationUrl);
        if (!response.ok) {
          console.error(`Error fetching comments for post ${postId}: ${response.status} - ${response.statusText}`);
          break;
        }

        const data = await response.json();
        if (data.error) {
          console.error(`Error in response for comments on post ${postId}:`, data.error);
          break;
        }

        if (data.data) {
          allComments = allComments.concat(data.data as FacebookComment[]);
        }

        if (data.paging && data.paging.cursors && data.paging.cursors.after) {
          afterPaginationUrl = `${GRAPH_API_URL}/${postId}/comments?limit=${commentLimit}&after=${data.paging.cursors.after}&access_token=${PAGE_ACCESS_TOKEN}`;
        } else {
          hasNextAfterPage = false;
        }
      } catch (error) {
        console.error(`Error in fetchAllPostCommentsBatch for post ${postId} (after pagination):`, error);
        break;
      }
    }

    while (hasNextBeforePage) {
      try {
        const response = await fetch(beforePaginationUrl);
        if (!response.ok) {
          console.error(`Error fetching comments for post ${postId}: ${response.status} - ${response.statusText}`);
          break;
        }

        const data = await response.json();
        if (data.error) {
          console.error(`Error in response for comments on post ${postId}:`, data.error);
          break;
        }

        if (data.data) {
          allComments = allComments.concat(data.data as FacebookComment[]);
        }

        if (data.paging && data.paging.cursors && data.paging.cursors.before) {
          beforePaginationUrl = `${GRAPH_API_URL}/${postId}/comments?limit=${commentLimit}&before=${data.paging.cursors.before}&access_token=${PAGE_ACCESS_TOKEN}`;
        } else {
          hasNextBeforePage = false;
        }
      } catch (error) {
        console.error(`Error in fetchAllPostCommentsBatch for post ${postId} (before pagination):`, error);
        break;
      }
    }
  }
  console.log(allComments);
  return allComments;
};


const obtenerUltimaFechaRecepcion = async (cuentaId: string): Promise<string> => {
  const client = await clientPromise;
  const db = client.db('socialMood');
  const lastInteraction = await db
    .collection('Interacciones')
    .find({ id_cuenta_receptor: cuentaId })
    .sort({ fecha_recepcion: -1 })
    .limit(1)
    .toArray();

  return lastInteraction[0]?.fecha_recepcion || new Date(0).toISOString();
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
      throw new Error(`Error sending interaction: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in sendInteraction:', error);
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

    const existingComment = await collection.findOne({ comment_id: comment.id });

    if (!existingComment) {
      let data;
      let responseMessage: string = '';

      try {
        const categoriasResponse = await sendInteraction(sanitizedMessage);
        data = categoriasResponse?.interaction;

        const customizedMessage = createCustomMessage(sanitizedMessage, data, regla);
        responseMessage = await generateChatGPTResponse(customizedMessage, regla);
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
        respondida: responseMessage !== '',
        respuesta: responseMessage,
        usuario_cuenta_receptor: pageName,
        usuario_cuenta_emisor: comment.from?.name || 'Anonymous',
        unique_code: uniqueCode,
        comment_id: comment.id,
      };

      await collection.insertOne(interaccion);
      console.log(`Added new comment with ID: ${comment.id}`);
    } else {
      console.log(`Comment with ID: ${comment.id} already exists`);
    }

    await delay(200);
  }
};

const createCustomMessage = (message: string, interaction: any, regla: string): string => {
  let adjustedMessage = `${regla}\n\n${message}`;

  if (interaction) {
    const emociones = interaction.emociones ? interaction.emociones.join(', ') : '';

    switch (interaction.categoria) {
      case 'Positivo':
        adjustedMessage = `${regla}\n\nComentario positivo identificado: "${message}". Apreciamos las recomendaciones y elogios. Emociones detectadas: ${emociones}.`;
        if (interaction.subcategoria === 'Recomendación') {
          adjustedMessage += " Este mensaje parece una recomendación.";
        } else if (interaction.subcategoria === 'Elogio') {
          adjustedMessage += " Este mensaje parece un elogio.";
        }
        break;

      case 'Negativo':
        adjustedMessage = `${regla}\n\nMensaje negativo detectado: "${message}". Procediendo con atención a la queja. Emociones detectadas: ${emociones}.`;
        if (interaction.subcategoria === 'Queja') {
          adjustedMessage += " Este mensaje es una queja.";
        }
        break;

      case 'Neutral':
        if (interaction.subcategoria === 'Consulta') {
          adjustedMessage = `${regla}\n\nConsulta recibida: "${message}". Responderemos con la información solicitada. Emociones detectadas: ${emociones}.`;
        }
        break;

      default:
        break;
    }
  }

  return adjustedMessage;
};

export async function GET(request: Request) {
  try {
    const cuentas = await obtenerCuentasRedesSociales();

    for (const cuenta of cuentas) {
  const PAGE_ACCESS_TOKEN = cuenta.llave_acceso;
  const pageDetails = await fetchPageDetails(PAGE_ACCESS_TOKEN);

  if (!pageDetails || !pageDetails.id) {
    console.error(`Unable to retrieve Page details for account ${cuenta.usuario_cuenta}`);
    continue;
  }

  const pageId = pageDetails.id;
  const pageName = pageDetails.name;
  const posts = await fetchPagePosts(pageId, PAGE_ACCESS_TOKEN);

      const lastSyncDate = await obtenerUltimaFechaRecepcion(pageId);

      const postIds = posts.map(post => post.id);
      const comments = await fetchAllPostCommentsBatch(postIds, PAGE_ACCESS_TOKEN, lastSyncDate);

      const regla = await obtenerSoloReglasDeCuentas(cuenta.id);

      await saveCommentsToMongo(comments, postIds, pageId, pageName, PAGE_ACCESS_TOKEN, regla);
    }

    return NextResponse.json({ message: 'FUNCIONO' });
  } catch (error) {
    console.error('Error fetching or saving posts and comments:', error);
    return NextResponse.json({ error: 'Failed to fetch or save posts and comments' }, { status: 500 });
  }
}
