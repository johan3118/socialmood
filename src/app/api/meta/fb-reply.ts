import { loadFacebookSDK, getFB } from './meta';

/**
 * @param commentId 
 * @param message 
 * @param accessToken 
 */
export const replyToComment = async (commentId: string, message: string, accessToken: string): Promise<any> => {
  await loadFacebookSDK();

  const FB = getFB();
  if (!FB) {
    console.error("Facebook SDK is not loaded");
    return;
  }

  return new Promise((resolve, reject) => {
    FB.api(
      `/${commentId}/comments`,
      'POST',
      { message, access_token: accessToken },
      (response: any) => {
        if (response && !response.error) {
          resolve(response);
        } else {
          console.error("Error replying to comment:", response.error);
          reject(response.error);
        }
      }
    );
  });
};
