'use server'
import clientPromise from "@/utils/startMongo";
import { getActiveUserId, getSubscription, getSocialMediaSubscription } from "./auth.actions";

export async function getSentimentCounts() {
    try {
        const client = await clientPromise;
        const db = client.db("socialMood");

        const userid = await getActiveUserId();

        if (!userid) {
            throw new Error("User ID is undefined");
        }

        const subscription = await getSubscription(parseInt(userid));

        if (subscription === null) {
            throw new Error("Subscription is null");
        }

        const socialMediasAccounts = await getSocialMediaSubscription(subscription);

        // consulta a la base de datos para obtener los conteos por sentimiento
        const sentimentCounts = await db.collection("Interacciones").aggregate([
            {
                $match: {
                    codigo_cuenta_receptor: { $in: socialMediasAccounts }
                }
            },
            {
                $group: {
                    _id: "$categoria", // Agrupa por categoría de sentimiento
                    count: { $sum: 1 } // para el número de documentos en cada grupo
                }
            }
        ]).toArray();

        console.log("Sentiment counts result:", sentimentCounts); // Añadir esta línea

        // para obtener los conteos específicos
        let totalInteractions = 0;
        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;

        sentimentCounts.forEach(item => {
            console.log("Sentiment category:", item._id, "Count:", item.count); // Verifica los datos exactos
            totalInteractions += item.count;
            if (item._id === "Positivo") positiveCount = item.count;
            if (item._id === "Negativo") negativeCount = item.count;
            if (item._id === "Neutral") neutralCount = item.count;
        });

        return {
            totalInteractions,
            positiveCount,
            negativeCount,
            neutralCount
        };

    } catch (error) {
        console.error("Error al cargar los conteos de sentimiento:", error);
        return {
            totalInteractions: 0,
            positiveCount: 0,
            negativeCount: 0,
            neutralCount: 0
        };
    }
}