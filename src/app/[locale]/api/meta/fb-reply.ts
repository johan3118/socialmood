/**
 * @param commentId 
 * @param message 
 * @param accessToken 
 */
export const replyToComment = async (commentId: string, message: string, accessToken: string): Promise<any> => {
  const url = `https://graph.facebook.com/v20.0/${commentId}/comments`;

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              message: message,
              access_token: accessToken,
          }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
          console.error("Error replying to comment:", data.error);
          throw new Error(data.error.message);
      }

      return data;
  } catch (error) {
      console.error("Error posting to Facebook Graph API:", error);
      throw error;
  }
};
