import response from "@/lib/openai/model";

export const generateChatGPTResponse = async (message: string, prompt: string): Promise<any> => {
  try {
    const messages = [
      { role: 'system', content: prompt }, 
      { role: 'user', content: message },   
    ];

    const result = await response('gpt-4o-mini', messages);
    console.log(result)

    return result; 
  } catch (error) {
    console.error('Error generating ChatGPT response:', error);
    throw error; 
  }
};
