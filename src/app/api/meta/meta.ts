declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

interface LongLivedTokenResponse {
  access_token: string;
}


let sdkLoadingPromise: Promise<void> | null = null;

export const loadFacebookSDK = (): Promise<void> => {
  if (sdkLoadingPromise) {
    return sdkLoadingPromise;
  }

  sdkLoadingPromise = new Promise((resolve, reject) => {
    if (typeof window.FB !== 'undefined') {
      resolve();
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "857764283115548", 
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });
      resolve();
    };

    (function (d, s, id) {
      let js: any, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        resolve();
        return;
      }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs?.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    const fbScript = document.getElementById("facebook-jssdk") as HTMLScriptElement;
    fbScript.onerror = () => reject("Failed to load Facebook SDK.");
  });

  return sdkLoadingPromise;
};

export const checkLoginState = (callback: (response: any) => void) => {
  loadFacebookSDK().then(() => {
    if (typeof window.FB !== 'undefined') {
      window.FB.getLoginStatus(function (response: any) {
        if (response.status === 'connected') {
          console.log("User is logged in and the SDK is managing the session.");
          callback(response);
        } else {
          console.log("User is not logged in.");
        }
      });
    }
  });
};

export const loginWithFacebook = (callback: (authResponse: any | null) => void) => {
  loadFacebookSDK().then(() => {
    if (typeof window.FB !== 'undefined') {
      // Iniciar sesión en Facebook
      window.FB.login(
        function (response: any) {
          if (response.authResponse) {
            console.log("Autenticación Exitosa:", response.authResponse);
            // Devolver la respuesta de autenticación al callback
            callback(response.authResponse);
          } else {
            console.log("La autenticación falló o fue cancelada");
            callback(null);
          }
        },
        { scope: 'public_profile,email,pages_read_engagement,pages_show_list,pages_manage_posts' }
      );
    }
  });
};

// facebookApi.ts
export const getFacebookAccounts = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (typeof window.FB !== 'undefined') {
      // Hacer la llamada a la API de Facebook para obtener las cuentas
      window.FB.api('/me/accounts', { fields: 'name,id,access_token' }, (response: any) => {
        if (response && response.data) {
          // Resolver la promesa con los datos obtenidos
          console.log("Cuentas obtenidas exitosamente:", response.data);
          resolve(response.data);
        } else {
          // Rechazar la promesa si no se encuentran cuentas o hay un error
          reject("No se encontraron cuentas asociadas.");
        }
      });
    } else {
      // Rechazar si el SDK no está disponible
      reject("Facebook SDK no está disponible.");
    }
  });
};

export const exchangeForLongLivedToken = async (shortLivedToken: string): Promise<LongLivedTokenResponse> => {
  const appId = '857764283115548'; // Reemplaza con tu App ID de Facebook
  const appSecret = '12300232b52736bc6b9821dd7ef3dcc2'; // Reemplaza con tu App Secret de Facebook

  // URL para intercambiar el short-lived token por el long-lived token
  const url = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;

  // Realiza la solicitud a la Graph API para obtener el token de larga duración
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Error al obtener el token de larga duración");
  }

  const data = await response.json();

  // Devolver el token y la fecha de expiración
  return {
    access_token: data.access_token,
  };
};

// 1. Obtener el App Access Token
const getAppAccessToken = async () => {
  const appId = '857764283115548'; // Reemplaza con tu App ID de Facebook
  const appSecret = '12300232b52736bc6b9821dd7ef3dcc2'; // Reemplaza con tu App Secret de Facebook
  const response = await fetch(`https://graph.facebook.com/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=client_credentials`);
  const data = await response.json();
  return data.access_token;
};

// 2. Depurar el User Access Token usando /debug_token
export const debugToken = async (userAccessToken:string) => {
  const appId = '857764283115548'; // Reemplaza con tu App ID de Facebook
  const appSecret = '12300232b52736bc6b9821dd7ef3dcc2'; // Reemplaza con tu App Secret de Facebook
  const appAccessToken = await getAppAccessToken();
  const response = await fetch(`https://graph.facebook.com/debug_token?input_token=${userAccessToken}&access_token=${appAccessToken}`);
  const data = await response.json();
  return data.data
  
};

export const getFB = () => {
  if (typeof window.FB !== 'undefined') {
    return window.FB;
  } else {
    console.error("Facebook SDK is not fully loaded yet.");
    return null;
  }
};
