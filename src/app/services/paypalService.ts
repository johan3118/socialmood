"use server"
import { v4 as uuidv4 } from 'uuid';
import "dotenv/config";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const paypalBaseUrl = process.env.PAYPAL_BASE_URL;

// Verificar que las variables de entorno estén definidas
if (!clientId || !clientSecret || !paypalBaseUrl) {
  throw new Error('PayPal environment variables are not defined.');
}

// Función para obtener el token de acceso
export const getAccessToken = async (): Promise<string> => {
  const authString = `${clientId}:${clientSecret}`;
  const authBase64 = Buffer.from(authString).toString('base64');

  const response = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authBase64}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Error fetching access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
};

// Función para crear el plan de suscripción
export const createSubscriptionPlan = async (accessToken: string, planData: any): Promise<any> => {
  const uuid = uuidv4();

  const response = await fetch(`${paypalBaseUrl}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': uuid, // ID único
    },
    body: JSON.stringify(planData),
  });

  if (!response.ok) {
    throw new Error(`Error creating subscription plan: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
