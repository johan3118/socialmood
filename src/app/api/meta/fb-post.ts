// utils/fetchLastPosts.ts
import { loadFacebookSDK, getFB, checkLoginState } from './meta'; // Adjust the import path

/**
 * Fetch the last 10 posts from the Facebook page using the Facebook SDK.
 * This function checks the user's login state before attempting to fetch posts.
 */
export const fetchLastPosts = async (): Promise<any> => {
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
        // User is logged in, proceed to fetch posts
        FB.api(
          '/me/posts',
          'GET',
          { fields: 'id,message,created_time', limit: 10 },
          (response: any) => {
            if (response && !response.error) {
              resolve(response.data); // Return the list of posts
            } else {
              console.error("Error fetching posts:", response.error);
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
