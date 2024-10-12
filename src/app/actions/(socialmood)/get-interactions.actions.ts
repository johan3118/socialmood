'use server'
import clientPromise from "@/utils/startMongo"
import { getActiveUserId, getSubscription, getSocialMediaSubscription } from "./auth.actions";

interface Perfil {
    red_social: string;
    username: string;
    color: string;
}

interface Interacciones {
    perfil: Perfil;
    mensaje: string;
    emisor: string;
    categoria: string;
    subcategoria: string;
    fecha: string;
}

export async function getInteractions() {
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
        

        const interactions = await db.collection("Interacciones").find({
            codigo_cuenta_receptor: { $in: socialMediasAccounts }
        }).toArray();

        console.log(interactions);


        let formattedInteractions = new Array<Interacciones>();

        interactions.forEach(interaction => {
            const date = new Date(interaction.fecha_recepcion);
            const formattedDate = date.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).replace(',', '');

            const formattedInteraction = {
                perfil: {
                    red_social: interaction.nombre_red_social_receptor,
                    username: interaction.usuario_cuenta_receptor,
                    color: "#FF0000"
                },
                mensaje: interaction.mensaje,
                emisor: interaction.usuario_cuenta_emisor,
                categoria: interaction.categoria,
                subcategoria: interaction.subcategoria,
                fecha: formattedDate
            }
            formattedInteractions.push(formattedInteraction);
        });

        return formattedInteractions;

    }
    catch (error) {
        console.error("Error al cargar las interacciones:", error);
        return [];
    }


}
