import OpenAI from 'openai';
import ChatCompletionMessageParam from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION_ID
});

async function response(message: string, model: string, context: string) {
    const completion = await openai.chat.completions.create({
        model: model,
        temperature: 0.4,
        messages: [
            {
                role: 'system',
                content: context
            },
            {
                role: 'user',
                content: message
            }
        ]
    });

    return completion.choices[0].message.content;
}

export default response;