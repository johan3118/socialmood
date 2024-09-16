import OpenAI from 'openai';
import ChatCompletionMessageParam from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION_ID
});

async function response(model: string, messages: any) {
    const completion = await openai.chat.completions.create({
        model: model,
        temperature: 0.3,
        messages: messages
    });

    return completion.choices[0].message.content;
}

export default response;