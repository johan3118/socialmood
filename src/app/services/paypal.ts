import axios from 'axios';
import {v4 as uuidv4} from 'uuid';

const clientId = 'AQEpcxi6zo0JHfCkgJafrgfVG1xeUNwk53-xUepwT2CpcV7_foTYlsxCjp-JngT_stubauCGq07u67Af';
const clientSecret = 'ELQQQ82L4aOZ8JSalDsTrKNzCEiAOdBMVZXAPrT4N5x4Gt8IWYf1fOIiCoqsC2uYzH3-2MO-2yXlYTSM';
const paypalBaseUrl = 'https://api-m.sandbox.paypal.com'; 

export const getAccessToken = async (): Promise<string> => {
  const response = await axios.post(
    `${paypalBaseUrl}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: clientId,
        password: clientSecret,
      },
    }
  );

  console.log(response);

  return response.data.access_token;
};

export const createSubscriptionPlan = async (accessToken: string, planData: any): Promise<any> => {
  const uuid = uuidv4();
  const response = await axios.post(
    `${paypalBaseUrl}/v1/billing/plans`,
    planData,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `${uuid}` // Puedes generar un ID único aquí
      }
    }
  );

  return response.data;
};
