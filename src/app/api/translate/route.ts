import { v2 as Translate } from '@google-cloud/translate';

const translate = new Translate.Translate({
  key: process.env.GCS_API_KEY, // Usamos la API Key directamente
});

export async function POST(req: Request) {
  const { text, targetLanguage } = await req.json();

  if (!text || !targetLanguage) {
    return new Response(JSON.stringify({ error: 'Parámetros faltantes' }), {
      status: 400,
    });
  }

  try {
    const [translation] = await translate.translate(text, targetLanguage);

    return new Response(JSON.stringify({ translation }), { status: 200 });
  } catch (error: any) {
    console.error('Error al traducir:', error.message);
    return new Response(JSON.stringify({ error: 'Error en la traducción' }), {
      status: 500,
    });
  }
}
