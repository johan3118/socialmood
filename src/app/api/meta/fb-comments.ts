import { loadFacebookSDK, getFB } from './meta';

/**
 * @param postId 
 * @param accessToken 
 */
export const fetchPostComments = async (postId: string, accessToken: string): Promise<any> => {
  await loadFacebookSDK();

  const FB = getFB();
  if (!FB) {
    console.error("Facebook SDK is not loaded");
    return;
  }

  return new Promise((resolve, reject) => {
    FB.api(
      `/${postId}/comments`,
      'GET',
      { fields: 'id,message,from,created_time', access_token: accessToken },
      (commentsResponse: any) => {
        if (commentsResponse && !commentsResponse.error) {
          resolve(commentsResponse.data); 
        } else {
          console.error("Error fetching comments:", commentsResponse.error);
          reject(commentsResponse.error);
        }
      }
    );
  });
};
