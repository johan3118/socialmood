// utils/fetchPostDetails.ts
import { loadFacebookSDK, getFB } from './meta'; // Adjust the import path

/**
 * Fetch post details using the Facebook SDK.
 * @param postId - The ID of the post to fetch details for.
 */
export const fetchPostDetails = async (postId: string): Promise<any> => {
  await loadFacebookSDK();

  const FB = getFB();
  if (!FB) {
    console.error("Facebook SDK is not loaded");
    return;
  }

  // Make the Graph API call to get the post details
  return new Promise((resolve, reject) => {
    FB.api(
      `/${postId}`,
      'GET',
      { fields: 'id,message,created_time' },
      (response: any) => {
        if (response && !response.error) {
          resolve(response); // Return the post details
        } else {
          console.error("Error fetching post details:", response.error);
          reject(response.error);
        }
      }
    );
  });
};
