'use server'
import clientPromise from "@/utils/startMongo"

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
    const client = await clientPromise;
    const db = client.db("socialMood");

    const interactions = await db.collection("Interacciones").find().toArray();

    console.log(interactions);

    let formattedInteractions = new Array<Interacciones>();

    interactions.forEach(interaction => {
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
            fecha: interaction.fecha_recepcion
        }
        formattedInteractions.push(formattedInteraction);
    });
    

    return formattedInteractions;

}
