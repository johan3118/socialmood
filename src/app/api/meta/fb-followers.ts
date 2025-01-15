/**
 * @param pageId 
 * @param accessToken 
 */
export const fetchFacebookFollowers = async (pageId: string, accessToken: string): Promise<{ name: string, followers_count: number }> => {
  const url = `https://graph.facebook.com/v20.0/${pageId}?fields=name,followers_count&access_token=${accessToken}`;

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      const data = await response.json();

      if (!response.ok || data.error) {
          console.error(`Error fetching Page Info for page ${pageId}:`, data.error);
          throw new Error(data.error.message);
      }

      return {
          name: data.name,
          followers_count: data.followers_count,
      };
  } catch (error) {
      console.error("Error fetching data from Facebook Graph API:", error);
      throw error;
  }
};
