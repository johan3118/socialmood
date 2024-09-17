'use server'

export async function getInteractions() {
    const interactions = [
        {
            perfil: {
                red_social: "Instagram",
                username: "@joseph",
                color: "#FF0000"
            },
            mensaje: "Odio esto",
            emisor: "@pablito",
            categoria: "Negativo",
            subcategoria: "Queja",
            fecha: "26/06/2024 3:00 PM"
        },
        {
            perfil: {
                red_social: "Facebook",
                username: "@joseph",
                color: "#FF0000"
            },
            mensaje: "Me encanta este producto",
            emisor: "@pablito",
            categoria: "Positivo",
            subcategoria: "Elogio",
            fecha: "26/06/2024 3:00 PM"
        },
        {
            perfil: {
                red_social: "Instagram",
                username: "@joseph",
                color: "#FF0000"
            },
            mensaje: "Hola, soy Joseph",
            emisor: "@pablito",
            categoria: "Neutral",
            subcategoria: "Consulta",
            fecha: "26/06/2024 3:00 PM"
        },
        {
            perfil: {
                red_social: "Instagram",
                username: "@joseph",
                color: "#FF0000"
            },
            mensaje: "Que horrible App",
            emisor: "@pablito",
            categoria: "Negativo",
            subcategoria: "Queja",
            fecha: "26/06/2024 3:00 PM"
        }
    ]
    return interactions;
}
