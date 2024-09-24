// utils/fetchPostComments.ts
import { loadFacebookSDK, getFB, checkLoginState } from './meta'; // Adjust the import path

/**
 * Fetch all comments for a given post using the Facebook SDK.
 * @param postId - The ID of the post to fetch comments for.
 */
export const fetchPostComments = async (postId: string): Promise<any> => {
  // Load the Facebook SDK
  await loadFacebookSDK();

  const FB = getFB();
  if (!FB) {
    console.error("Facebook SDK is not loaded");
    return;
  }

  // Check if the user is logged in
  return new Promise((resolve, reject) => {
    checkLoginState((response: any) => {
      if (response.status === 'connected') {
        // User is logged in, proceed to fetch comments
        FB.api(
          `/${postId}/comments`,
          'GET',
          { fields: 'id,message,from,created_time' },
          (response: any) => {
            if (response && !response.error) {
              resolve(response.data); // Return the list of comments
            } else {
              console.error("Error fetching comments:", response.error);
              reject(response.error);
            }
          }
        );
      } else {
        // User is not logged in, reject the request
        console.error("User is not logged into Facebook.");
        reject("User is not logged in.");
      }
    });
  });
};
