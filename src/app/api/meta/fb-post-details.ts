import { loadFacebookSDK, getFB } from './meta';

/**
 * @param postId 
 */
export const fetchPostDetails = async (postId: string): Promise<any> => {
  await loadFacebookSDK();

  const FB = getFB();
  if (!FB) {
    console.error("Facebook SDK is not loaded");
    return;
  }

  return new Promise((resolve, reject) => {
    FB.api(
      `/${postId}`,
      'GET',
      { fields: 'id,message,created_time,full_picture' }, 
      (response: any) => {
        if (response && !response.error) {
          resolve(response); 
        } else {
          console.error("Error fetching post details:", response.error);
          reject(response.error);
        }
      }
    );
  });
};
