import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { google } from "@/lib/lucia/oauth";
import db from "@/db";
import { eq } from "drizzle-orm";
import { usuariosTable } from "@/db/schema/socialMood";

interface GoogleUser {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

export const GET = async (req: NextRequest) => {

    const url = new URL(req.url)
    const searchParams = url.searchParams

    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!code || !state) {
        return {
            status: 400,
            body: "Invalid request"
        }
    }

    const codeVerifier = cookies().get("code_verifier")?.value
    const savedState = cookies().get("state")?.value

    if (!codeVerifier || !savedState) {
        return {
            status: 400,
            body: "Invalid request"
        }
    }

    if (state !== savedState) {
        return {
            status: 400,
            body: "Invalid request"
        }
    }

    const { accessToken, idToken, refreshToken, accessTokenExpiresAt } = await google.validateAuthorizationCode(code, codeVerifier)

    const googleRes = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            method: "GET"
        },

    )

    const googleData = (await googleRes.json()) as GoogleUser

    db.transaction(async (trx) => {
        // Find the user in the database
        const existingUser = await db.query.usuariosTable.findFirst({
            where: (table) => eq(table.correo_electronico, googleData.email),
        });

        if (!existingUser) {
            const createdUserRes = await trx.insert(usuariosTable).values({
                nombre: googleData.name,
                apellido: googleData.family_name,
                direccion: "",
                correo_electronico: googleData.email,
                llave_acceso: "",
                id_proveedor_autenticacion: 1,
                id_tipo_usuario: 1 // Usuario Gestor de Comunidad
            }).returning({
                id: usuariosTable.id,
                username: usuariosTable.nombre,
            });

            if (!createdUserRes) {
                trx.rollback()
                return Response.json(
                    {
                        status: 500,
                        body: "Error creating user"
                    }
                )

            }

            /* const createdOAthAccountRes = await trx.insert(usuariosTable).values({

            */
        } else {
            // const updatedOAuthAccountRes = await trx.update(usuariosTable).set({
        }

    })

}