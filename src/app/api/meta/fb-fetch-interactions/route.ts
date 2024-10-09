import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import clientPromise from '@/utils/startMongo';
import { Interacciones } from '@/types';
import { obtenerCuentasRedesSociales } from '@/app/actions/(socialmood)/get-plans.actions';


export const dynamic = 'force-dynamic';

// API URL de Facebook Graph
const GRAPH_API_URL = 'https://graph.facebook.com/v20.0';

// Función para esperar un cierto tiempo (en milisegundos)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Define interfaces for type safety
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

// Función para obtener los detalles de una página usando el token de acceso
const fetchPageDetails = async (PAGE_ACCESS_TOKEN: string): Promise<FacebookPageDetails> => {
  const response = await fetch(`${GRAPH_API_URL}/me?fields=id,name&access_token=${PAGE_ACCESS_TOKEN}`);
  const data = await response.json();
  return data;
};

// Función para obtener los posts de una página usando el token de acceso
const fetchPagePosts = async (pageId: string, PAGE_ACCESS_TOKEN: string): Promise<FacebookPost[]> => {
  const response = await fetch(`${GRAPH_API_URL}/${pageId}/feed?access_token=${PAGE_ACCESS_TOKEN}`);
  const data = await response.json();
  return data.data || [];
};

// Función para obtener todos los comentarios de múltiples publicaciones usando batch requests
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

// Función para generar un código único basado en el mensaje y el ID de la cuenta
const generateUniqueCode = (message: string, accountId: string) => {
  const hash = crypto.createHash('sha256');
  hash.update(`${message}-${accountId}`);
  return hash.digest('hex');
};

const sanitizeUtf8String = (str: string) => {
  return str.replace(/[^\u0000-\u007F]/g, ""); // Remove non-UTF-8 characters
};

const fetchInteractionClassification = async (message: string) => {
  const baseUrl = 'https://localhost:3000'; 

  console.log(`Sending message to classify: ${message}`); 

  const response = await fetch(`${baseUrl}/api/interactions/catalog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    
    body: JSON.stringify({ message }),
  });

  console.log('Response status:', response.status); // Log response status
  console.log('Response headers:', response.headers); // Log response headers

  if (!response.ok) {
    throw new Error('Failed to classify interaction');
  }

  const result = await response.json();
  console.log('Response from classification API:', result); // Log the API response

  return result.interaction; // Contains category, subcategory, and emotions
};




const saveCommentsToMongo = async (
  comments: FacebookComment[],
  postId: string[],
  pageId: string,
  pageName: string,
  PAGE_ACCESS_TOKEN: string
) => {
  const client = await clientPromise;
  const db = client.db('socialMood');
  const collection = db.collection('Interacciones');

  for (const comment of comments) {
    const sanitizedMessage = sanitizeUtf8String(comment.message); // Sanitize the message
    const uniqueCode = generateUniqueCode(sanitizedMessage, comment.from?.id || '');

    const existingComment = await collection.findOne({ unique_code: uniqueCode });

      let interactionData = { categoria: '', subcategoria: '', emociones: [] };

      try {
        interactionData = await fetchInteractionClassification(sanitizedMessage);
      } catch (error) {
        console.error(`Error classifying interaction: ${error}`);
      }

    if (!existingComment) {
      // Fetch the category, subcategory, and emotions for the message

      const interaccion: Interacciones = {
        fecha_recepcion: comment.created_time,
        fecha_respuesta: null,
        mensaje: sanitizedMessage || '',
        enlace_publicacion: `${GRAPH_API_URL}/${postId}`,
        codigo_cuenta_emisor: comment.from?.id || '',
        enlace_foto_emisor: '',
        codigo_cuenta_receptor: pageId,
        id_cuenta_receptor: Number(pageId),
        nombre_red_social_receptor: 'Facebook',
        categoria: interactionData.categoria, // Category from API
        subcategoria: interactionData.subcategoria, // Subcategory from API
        emociones_predominantes: interactionData.emociones.join(', '), // Emotions from API
        respondida: false,
        respuesta: null,
        usuario_cuenta_receptor: pageName,
        usuario_cuenta_emisor: comment.from?.name || 'Anonymous',
        unique_code: uniqueCode,
      };

      await collection.insertOne(interaccion);
      console.log(`Comment from ${comment.from?.name || 'Anonymous'} saved.`);
    } else {
      console.log(`Comment with unique code ${uniqueCode} already exists in the database.`);
    }

    await delay(200); // Small delay between inserts
  }
};



// Ruta GET principal
export async function GET(request: Request) {
  try {
    const cuentas = await obtenerCuentasRedesSociales();

    for (const cuenta of cuentas) {
      const PAGE_ACCESS_TOKEN = cuenta.llave_acceso;
      const pageDetails: FacebookPageDetails = await fetchPageDetails(PAGE_ACCESS_TOKEN);

      if (!pageDetails || !pageDetails.id) {
        console.error(`Unable to retrieve Page details for account ${cuenta.usuario_cuenta}`);
        continue;
      }

      const pageId = pageDetails.id;
      const pageName = pageDetails.name;
      const posts: FacebookPost[] = await fetchPagePosts(pageId, PAGE_ACCESS_TOKEN);

      const postIds = posts.map(post => post.id);
      const comments = await fetchAllPostCommentsBatch(postIds, PAGE_ACCESS_TOKEN);

      await saveCommentsToMongo(comments, postIds, pageId, pageName, PAGE_ACCESS_TOKEN);
    }

    return NextResponse.json({
      message: 'Posts and comments fetched and saved successfully',
    });
  } catch (error) {
    console.error('Error fetching or saving posts and comments:', error);
    return NextResponse.json({ error: 'Failed to fetch or save posts and comments' }, { status: 500 });
  }
}
