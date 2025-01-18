import { EmailTemplate } from '@/components/(socialmood)/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

interface EmailRequest {
  to: string;
  firstName: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    // Obtener los parámetros del cuerpo de la solicitud
    const body: EmailRequest = await req.json();
    const { to, firstName } = body;

    // Validar que los parámetros requeridos estén presentes
    if (!to || !firstName) {
      return new Response(
        JSON.stringify({ error: 'Faltan los parámetros "to" o "firstName"' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Enviar el correo utilizando Resend
    const { data, error } = await resend.emails.send({
      from: 'Social Mood App <onboarding@socialmood.app>',
      to: [to],
      subject: '¡Bienvenido/a a SocialMood!',
      react: EmailTemplate({ firstName }),
    });

    // Manejar errores al enviar el correo
    if (error) {
      return new Response(
        JSON.stringify({ error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Responder con los datos del correo enviado
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    // Manejar errores generales
    return new Response(
      JSON.stringify({ error: error.message || 'Error inesperado' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
