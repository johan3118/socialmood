import { loadFacebookSDK, getFB, checkLoginState } from './meta';

export const fetchManagedPages = async (): Promise<any> => {
  await loadFacebookSDK();

  const FB = getFB();
  if (!FB) {
    console.error("Facebook SDK is not loaded");
    return;
  }

  return new Promise((resolve, reject) => {
    checkLoginState((response: any) => {
      if (response.status === 'connected') {
        FB.api('/me/accounts', 'GET', { fields: 'id,name,access_token' }, (pagesResponse: any) => {
          if (pagesResponse && !pagesResponse.error) {
            resolve(pagesResponse.data);
          } else {
            console.error("Error fetching pages:", pagesResponse.error);
            reject(pagesResponse.error);
          }
        });
      } else {
        console.error("User is not logged into Facebook.");
        reject("User is not logged in.");
      }
    });
  });
};
