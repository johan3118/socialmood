import { NextRequest, NextResponse } from "next/server";
import response from "@/lib/openai/model";
import { removeStopwords, spa } from 'stopword'

export const POST = async (req: NextRequest) => {
    try {
        const { message } = await req.json()

        const simplifiedMessage = removeStopwords(message.split(' '), spa).join(' ')

        const context_message = `
        Eres un gestor de comunidad cuyo objetivo es catalogar las interacciones de los usuarios provenientes de las redes sociales de una compañía.  
        
        Reciben mensajes de los usuarios y necesitan clasificarlos en diferentes categorías y subcategorías para poder analizarlos.
        
        Las interacciones pueden tener una "categoria" que se asigna automáticamente según el contenido del mensaje.
        Las categorias disponibles son:
            * "Positivo": si el mensaje tiene un tono positivo.
            * "Negativo": si el mensaje tiene un tono negativo.
            * "Neutral": si el mensaje no tiene un tono positivo o negativo.
        
        A partir de la elección de la "categoría", se procede a asignar una "subcategoría" que representa la intención del mensaje.
        Las subcategorías disponibles son:
            * "Consulta": si el mensaje tiene una pregunta. Solo aplica para categoria "Neutral".
            * "Queja": si el mensaje tiene un reclamo. Solo aplica para categoria "Negativa".
            * "Recomendación": si el mensaje tiene una sugerencia. Solo aplica para categoria "Positiva".
            * "Elogio": si el mensaje tiene un elogio. Solo aplica para categoria "Positiva".
        
        A partir del contenido del mensaje necesito que identifique un mínimo de 1 emocion o un máximo de 3 emociones que se encuentren presentes en el mensaje.
        Las emociones disponibles son:
            * "Alegría": Estado emocional que se experimenta cuando una situación concreta es interpretada como positiva, nos proporciona placer o satisface alguna necesidad.
            * "Enfado": Estado emocional que se manifiesta ante la frustración, las injusticias o cuando algo se interpone en nuestras metas u objetivos..
            * "Miedo": Estado emocional que se manifiesta ante una amenaza o un peligro, sea real o imaginario.
            * "Tristeza": Estado emocional que se experimenta cuando sentimos una pérdida significativa, cuando vivimos una separación importante o cuando experimentamos un fracaso.
            * "Sorpresa": Estado emocional caracterizado por la interrupción del procesamiento mental normal, lo que le permite al individuo responder ante los cambios, estímulos o eventos inesperados.
            * "Asco": Estado emocional que aparecen en el momento en el que el individuo se enfrenta a una situación u elemento que le es percibido como contaminante.
            * "Confianza": Estado emocional regulatorio que se manifiesta ante una situación concreta o luego de realizar una determinada acción, en donde se tiene la certeza de que no habrá perjuicios ni ocurrirán eventos negativos.
            * "Anticipación": Estado emocional íntimamente ligado con el interés y aparece ante las expectativas razonadas sobre algún evento en concreto, una situación o una sensación subjetiva.
        
        Recibiras las interacciones en el siguiente formato:
        {
            "mensaje": "El mensaje del usuario"
        }
        
        Necesito que me proporciones la categoría, la subcategoría y las emociones presentes en el mensaje bajo el siguiente formato:
        {
            "categoria": "categoria del mensaje",
            "subcategoria": "subcategoria del mensaje",
            "emociones": ["emocion1", "emocion2", "emocion3"]
        }

        EJEMPLO PRÁCTICO:
        Entrada
        {
            "mensaje": "Estoy muy contento con el servicio que me han brindado, son los mejores"
        }
        
        Salida
        {
            "categoria": "Positivo",
            "subcategoria": "Elogio",
            "emociones": ["Alegría", "Confianza"]
        }
        `

        const prompt_message = `
        {
            "mensaje": "${simplifiedMessage}"
        }
        `

        const context = {
            role: 'system',
            content: context_message
        }

        const prompt =
        {
            role: 'user',
            content: prompt_message
        }

        const messages = [context, prompt]

        const result = await response('gpt-4o-mini', messages);

        const isValidJson = (str: string) => {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        if (!isValidJson(result?.toString() || '')) {
            return NextResponse.error()
        }

        const interaction = JSON.parse(result?.toString().substring(result?.toString().indexOf('{'), result?.toString().lastIndexOf('}') + 1) || '{}')

        console.log(interaction)

        return NextResponse.json({ interaction, status: 200 });
    }
    catch (e) {
        console.error(e)
        return NextResponse.error()
    }
}