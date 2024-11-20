'use server'
import clientPromise from "@/utils/startMongo";
import { getActiveUserId, getSubscription, getSocialMediaSubscription } from "./auth.actions";

export async function getSentimentCounts(filter: any) {
    try {
        const client = await clientPromise;
        const db = client.db("socialMood");

        const social_medias = filter.social_medias;

        const isSocialMediasFilter = (social_medias?.length ?? 0) > 0;

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
        let interactions = await db.collection("Interacciones").find({
            codigo_cuenta_receptor: { $in: socialMediasAccounts }
        }).toArray();


        if (isSocialMediasFilter == true) {
            interactions = interactions?.filter(interaction => social_medias.includes(interaction.usuario_cuenta_receptor));
        }


        // para obtener los conteos específicos
        let totalInteractions = 0;
        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;


        interactions.forEach(item => {


            totalInteractions += 1;
            if (item.categoria === "Positivo") positiveCount += 1;
            if (item.categoria === "Negativo") negativeCount += 1;
            if (item.categoria === "Neutral") neutralCount += 1;
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