import { loadFacebookSDK, getFB } from './meta';

/**
 * @param pageId 
 * @param accessToken 
 */
export const fetchPagePosts = async (pageId: string, accessToken: string): Promise<any> => {
  await loadFacebookSDK();

  const FB = getFB();
  if (!FB) {
    console.error("Facebook SDK is not loaded");
    return;
  }

  return new Promise((resolve, reject) => {
    FB.api(
      `/${pageId}/posts`,
      'GET',
      { fields: 'id,message,created_time', limit: 10, access_token: accessToken },
      (response: any) => {
        if (response && !response.error) {
          resolve(response.data); 
        } else {
          console.error("Error fetching posts:", response.error);
          reject(response.error);
        }
      }
    );
  });
};
