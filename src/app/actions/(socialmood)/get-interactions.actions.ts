'use server'
import clientPromise from "@/utils/startMongo"
import { getActiveUserId, getSubscription, getSocialMediaSubscription } from "./auth.actions";
import { replyToComment } from "@/app/api/meta/fb-reply";
import { getSocialMediaToken } from "@/app/actions/(socialmood)/auth.actions";
import { getAccountColor } from "./social.actions";


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
    respondida: boolean;
}

interface Respuestas {
    perfil: Perfil;
    respuesta: string;
    username_emisor: string;
    unique_code: string;
    categoria: string;
    subcategoria: string;
    comment_id: string;
    fecha: string;
}

interface UpdateResult {
    success: boolean;
    message: string;
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

        console.log(socialMediasAccounts);

        // Agregamos el sort para ordenar por fecha_recepcion descendente
        const interactions = await db.collection("Interacciones").find({
            codigo_cuenta_receptor: { $in: socialMediasAccounts }
        }).sort({ fecha_recepcion: -1 }).toArray();

        let formattedInteractions = new Array<Interacciones>();

        // Mapeamos las interacciones y agregamos el campo responseGenerated
        for (const interaction of interactions) {
            const hasResponse = !!interaction.respondida; // Asumimos que el campo "respondida" indica si hay una respuesta
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
                fecha: formattedDate,
                respondida: interaction.respondida
            };

            formattedInteractions.push(formattedInteraction);
        }

        return formattedInteractions;

    } catch (error) {
        console.error("Error al cargar las interacciones:", error);
        return [];
    }
}


export async function getInteractionsFiltered(filter: any) {
    try {
        console.log(filter);

        let categories = filter.category;
        let subcategories = filter.subcategory;

        let social_medias = filter.social_medias;

        const isCategoryFilter = (categories?.length ?? 0) > 0;
        const isSubcategoryFilter = (subcategories?.length ?? 0) > 0;
        const isSocialMediasFilter = (social_medias?.length ?? 0) > 0;

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

        let interactions;

        const socialMediasAccounts = await getSocialMediaSubscription(subscription);




        if (!isCategoryFilter && !isSubcategoryFilter) {
            interactions = await db.collection("Interacciones").find({
                codigo_cuenta_receptor: { $in: socialMediasAccounts },
            })
                .sort({ fecha_recepcion: -1 }) // Ordenar por fecha_recepcion descendente
                .toArray();
        } else {
            if (isCategoryFilter && isSubcategoryFilter) {
                interactions = await db.collection("Interacciones").find({
                    codigo_cuenta_receptor: { $in: socialMediasAccounts },
                    $or: [
                        { categoria: { $in: categories } },
                        { subcategoria: { $in: subcategories } },
                    ],
                })
                    .sort({ fecha_recepcion: -1 }) // Ordenar por fecha_recepcion descendente
                    .toArray();
            } else if (!isCategoryFilter && isSubcategoryFilter) {
                interactions = await db.collection("Interacciones").find({
                    codigo_cuenta_receptor: { $in: socialMediasAccounts },
                    subcategoria: { $in: subcategories },
                })
                    .sort({ fecha_recepcion: -1 }) // Ordenar por fecha_recepcion descendente
                    .toArray();
            } else if (isCategoryFilter && !isSubcategoryFilter) {
                interactions = await db.collection("Interacciones").find({
                    codigo_cuenta_receptor: { $in: socialMediasAccounts },
                    categoria: { $in: categories },
                })
                    .sort({ fecha_recepcion: -1 }) // Ordenar por fecha_recepcion descendente
                    .toArray();
            }
        }

        if (isSocialMediasFilter) {
            interactions = interactions?.filter((interaction) =>
                social_medias.includes(interaction.usuario_cuenta_receptor)
            );
        }

        console.log(interactions);

        let formattedInteractions = new Array<Interacciones>();

        interactions?.forEach(interaction => {
            const date = new Date(interaction.fecha_recepcion);
            const formattedDate = date.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            }).replace(',', '');

            const formattedInteraction = {
                perfil: {
                    red_social: interaction.nombre_red_social_receptor,
                    username: interaction.usuario_cuenta_receptor,
                    color: "#FF0000",
                },
                mensaje: interaction.mensaje,
                emisor: interaction.usuario_cuenta_emisor,
                categoria: interaction.categoria,
                subcategoria: interaction.subcategoria,
                fecha: formattedDate,
                respondida: interaction.respondida
            };
            formattedInteractions.push(formattedInteraction);
        });

        return formattedInteractions;
    } catch (error) {
        console.error("Error al cargar las interacciones:", error);
        return [];
    }
}




export async function getRespuestas() {
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


        const respuestas = await db.collection("Interacciones").find({
            codigo_cuenta_receptor: { $in: socialMediasAccounts },
            respondida: false
        }).toArray();


        let formattedRespuestas = new Array<Respuestas>();

        respuestas.forEach(respuesta => {
            const date = new Date(respuesta.fecha_recepcion);
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
                    red_social: respuesta.nombre_red_social_receptor,
                    username: respuesta.usuario_cuenta_receptor,
                    color: "#FF0000"
                },
                respuesta: respuesta.respuesta,
                username_emisor: respuesta.usuario_cuenta_emisor,
                categoria: respuesta.categoria,
                subcategoria: respuesta.subcategoria,
                unique_code: respuesta.unique_code,
                comment_id: respuesta.comment_id,
                fecha: formattedDate,
            }
            formattedRespuestas.push(formattedInteraction);
        });

        return formattedRespuestas;

    }
    catch (error) {
        console.error("Error al cargar las respuestas:", error);
        return [];
    }


}

export async function getRespuestasFiltered(filter: any) {
    try {
        const client = await clientPromise;
        const db = client.db("socialMood");

        let categories = filter.category;
        let subcategories = filter.subcategory;
        let social_medias = filter.social_medias;

        const isCategoryFilter = (categories?.length ?? 0) > 0;
        const isSubcategoryFilter = (subcategories?.length ?? 0) > 0;
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

        let respuestas;

        if (!isCategoryFilter && !isSubcategoryFilter) {
            respuestas = await db.collection("Interacciones").find({
                codigo_cuenta_receptor: { $in: socialMediasAccounts },
                respondida: false
            })
            .sort({ fecha_recepcion: -1 }) // Ordenar por fecha_recepcion descendente
            .toArray();

        } else {
            if (isCategoryFilter && isSubcategoryFilter) {
                respuestas = await db.collection("Interacciones").find({
                    codigo_cuenta_receptor: { $in: socialMediasAccounts },
                    $or: [
                        { categoria: { $in: categories } },
                        { subcategoria: { $in: subcategories } }
                    ],
                    respondida: false
                })
                .sort({ fecha_recepcion: -1 }) // Ordenar por fecha_recepcion descendente
                .toArray();

            } else if (!isCategoryFilter && isSubcategoryFilter) {
                respuestas = await db.collection("Interacciones").find({
                    codigo_cuenta_receptor: { $in: socialMediasAccounts },
                    subcategoria: { $in: subcategories },
                    respondida: false
                })
                .sort({ fecha_recepcion: -1 }) // Ordenar por fecha_recepcion descendente
                .toArray();

            } else if (isCategoryFilter && !isSubcategoryFilter) {
                respuestas = await db.collection("Interacciones").find({
                    codigo_cuenta_receptor: { $in: socialMediasAccounts },
                    categoria: { $in: categories },
                    respondida: false
                })
                .sort({ fecha_recepcion: -1 }) // Ordenar por fecha_recepcion descendente
                .toArray();
            }
        }

        if (isSocialMediasFilter) {
            respuestas = respuestas?.filter((respuesta) =>
                social_medias.includes(respuesta.usuario_cuenta_receptor)
            );
        }

        let formattedRespuestas = new Array<Respuestas>();

        respuestas?.forEach(respuesta => {
            const date = new Date(respuesta.fecha_recepcion);
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
                    red_social: respuesta.nombre_red_social_receptor,
                    username: respuesta.usuario_cuenta_receptor,
                    color: "#FF0000"
                },
                respuesta: respuesta.respuesta,
                username_emisor: respuesta.usuario_cuenta_emisor,
                categoria: respuesta.categoria,
                subcategoria: respuesta.subcategoria,
                unique_code: respuesta.unique_code,
                comment_id: respuesta.comment_id,
                fecha: formattedDate
            };
            formattedRespuestas.push(formattedInteraction);
        });

        return formattedRespuestas;

    } catch (error) {
        console.error("Error al cargar las respuestas:", error);
        return [];
    }
}




// get the four most repeated emotions in the interactions and its frequency

export async function getEmotions(filter: any = {}) {
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

        let interactions = await db.collection("Interacciones").find({
            codigo_cuenta_receptor: { $in: socialMediasAccounts }
        }).toArray();

        if (filter?.social_medias) {
            if (filter.social_medias.length > 0) {
                interactions = interactions.filter((interaction) => filter.social_medias.includes(interaction.usuario_cuenta_receptor));
            }
        }

        let emotions = new Map<string, number>();

        interactions.forEach(interaction => {
            const emociones = interaction.emociones_predominantes.split(", ");
            emociones.forEach((emocion: string) => {
                if (emocion != "") {
                    if (emotions.has(emocion)) {
                        emotions.set(emocion, emotions.get(emocion)! + 1);
                    } else {
                        emotions.set(emocion, 1);
                    }
                }

            });

        });

        const sortedEmotions = Array.from(emotions.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);

        return sortedEmotions;

    }
    catch (error) {
        console.error("Error al cargar las emociones:", error);
        return [];
    }
}

export async function updateRespuesta(uniqueCode: string, newRespuesta: string): Promise<UpdateResult> {
    try {
        const client = await clientPromise;
        const db = client.db("socialMood");

        const result = await db.collection("Interacciones").updateOne(
            { unique_code: uniqueCode },
            { $set: { respuesta: newRespuesta } }
        );

        if (result.matchedCount === 0) {
            throw new Error("No document found with the specified unique code");
        }

        return { success: true, message: "Respuesta updated successfully" };
    } catch (error) {
        console.error("Error updating respuesta:", error);
        return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
    }
}


export async function commentRepliedTrue(responses: { unique_code: string, comment_id: string, respuesta: string, perfil: { red_social: string, username: string } }[]): Promise<UpdateResult> {
    try {
        const client = await clientPromise;
        const db = client.db("socialMood");

        const successfulResponses = [];

        for (const response of responses) {
            // Obtener el token de acceso de la cuenta de red social asociada
            const accessToken = await getSocialMediaToken(response.perfil.username);

            // Enviar la respuesta a Facebook usando replyToComment
            try {
                await replyToComment(response.comment_id, response.respuesta, accessToken);
                successfulResponses.push(response.unique_code);
            } catch (error) {
                console.error("Error al enviar comentario a Facebook:", error);
            }
        }

        if (successfulResponses.length > 0) {
            // Actualizar el campo respondida en MongoDB solo para los que fueron exitosamente enviados a Facebook
            const result = await db.collection("Interacciones").updateMany(
                { unique_code: { $in: successfulResponses } },
                { $set: { respondida: true } }
            );

            if (result.matchedCount === 0) {
                throw new Error("No se encontraron documentos con los códigos únicos especificados");
            }
        }

        return { success: true, message: "Respuestas actualizadas exitosamente en MongoDB" };
    } catch (error) {
        console.error("Error actualizando respuestas en MongoDB:", error);
        return { success: false, message: error instanceof Error ? error.message : "Error desconocido" };
    }
}

export async function getInteractionsByMonthAndUsername() {
    try {
        const client = await clientPromise;
        const db = client.db("socialMood");

        const userid = await getActiveUserId(); // Obtén el usuario activo

        if (!userid) {
            throw new Error("User ID is undefined");
        }

        const subscription = await getSubscription(parseInt(userid)); // Valida la suscripción

        if (subscription === null) {
            throw new Error("Subscription is null");
        }

        const socialMediasAccounts = await getSocialMediaSubscription(subscription);

        // Define los últimos 6 meses con su año correspondiente
        const now = new Date();
        const last6Months: { label: string, month: number, year: number }[] = [];
        for (let i = 5; i >= 0; i--) { // Cambiado de 11 a 5 para los últimos 6 meses
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last6Months.push({
                label: `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`,
                month: date.getMonth() + 1, // Mes en formato 1-12
                year: date.getFullYear(),
            });
        }

        // Agrupamos por username de red social, mes y año
        const interactions = await db.collection("Interacciones").aggregate([
            {
                $match: {
                    codigo_cuenta_receptor: { $in: socialMediasAccounts },
                },
            },
            {
                $group: {
                    _id: {
                        username: "$usuario_cuenta_receptor",
                        mes: { $month: { $toDate: "$fecha_recepcion" } },
                        año: { $year: { $toDate: "$fecha_recepcion" } },
                    },
                    total_interacciones: { $sum: 1 },
                },
            },
            {
                $project: {
                    username: "$_id.username",
                    mes: "$_id.mes",
                    año: "$_id.año",
                    total_interacciones: 1,
                    _id: 0,
                },
            },
            {
                $sort: { año: 1, mes: 1 }, // Ordena por año y mes
            },
        ]).toArray();

        // Formateamos los datos para el gráfico
        const formattedData: { [key: string]: number[] } = {};
        last6Months.forEach(({ month, year }) => {
            Object.keys(formattedData).forEach(username => {
                formattedData[username] = new Array(6).fill(0); // Cambiado a 6
            });

            interactions.forEach(interaction => {
                if (!formattedData[interaction.username]) {
                    formattedData[interaction.username] = new Array(6).fill(0); // Cambiado a 6
                }

                const index = last6Months.findIndex(
                    date => date.month === interaction.mes && date.year === interaction.año
                );
                if (index !== -1) {
                    formattedData[interaction.username][index] = interaction.total_interacciones;
                }
            });
        });

        // Obtén el color de cada cuenta y construye los datasets
        const datasets = await Promise.all(
            Object.keys(formattedData).map(async (username) => {
                const accountColor = await getAccountColor(username); // Llamamos al método para obtener el color
                const color = accountColor[0]?.color || '#F86A3A'; // Usamos el color obtenido o un valor por defecto

                return {
                    label: username,
                    data: formattedData[username],
                    borderColor: '#fff',
                    pointBackgroundColor: color,
                    tension: 0.4,
                    borderWidth: 2,
                    fill: true,
                };
            })
        );

        // Retorna los datos en el formato para el gráfico
        return {
            labels: last6Months.map(date => date.label), // Cambiado a last6Months
            datasets,
        };

    } catch (error) {
        console.error("Error al cargar las interacciones por mes y username:", error);
        return { labels: [], datasets: [] };
    }
}

export async function countUnansweredInteractions() {
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

        const unansweredCount = await db.collection("Interacciones").countDocuments({
            codigo_cuenta_receptor: { $in: socialMediasAccounts },
            respondida: false
        });

        return unansweredCount;

    } catch (error) {
        console.error("Error al contar interacciones no respondidas:", error);
        return 0;
    }
}

