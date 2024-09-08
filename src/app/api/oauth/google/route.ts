import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { google } from "@/lib/lucia/oauth";
import db from "@/db";
import { eq } from "drizzle-orm";
import { oauthAccountTable, usuariosTable } from "@/db/schema/socialMood";
import { lucia } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";


interface GoogleUser {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
}

export const GET = async (req: NextRequest) => {
    const url = new URL(req.url)
    const searchParams = url.searchParams

    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!code || !state) {
        return Response.json(
            { error: "Invalid request" },
            { status: 400 }
        )
    }

    const codeVerifier = cookies().get("codeVerifier")?.value
    const savedState = cookies().get("state")?.value

    if (!codeVerifier || !savedState) {
        return Response.json(
            { error: "" },
            { status: 400 }
        )
    }

    if (savedState !== state) {
        return Response.json(
            { error: "State does not match" },
            { status: 400 }
        )
    }

    const { accessToken, idToken, refreshToken, accessTokenExpiresAt } = await google.validateAuthorizationCode(
        code,
        codeVerifier
    )

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

    let userId = 0

    await db.transaction(async (trx) => {
        const user = await trx.query.usuariosTable.findFirst({
            where: (table) => eq(table.correo_electronico, googleData.email),
        });

        if (!user) {
            const createdUserRes = await trx.insert(usuariosTable).values({
                nombre: googleData.given_name,
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
            if (createdUserRes.length === 0) {
                trx.rollback()
                return Response.json(
                    {
                        status: 500,
                        body: "Error creating user"
                    }
                )
            }

            userId = createdUserRes[0].id

            const createdOAthAccountRes = await trx.insert(oauthAccountTable)
                .values({
                    codigoUsuarioProveedor: googleData.id,
                    expira: accessTokenExpiresAt.getTime(),
                    idProveedorAutenticacion: 1,
                    idUsuario: createdUserRes[0].id,
                    tokenAcceso: accessToken?.toString() || "",
                    tokenRefresh: refreshToken?.toString() || "",
                })
                .returning({
                    id: usuariosTable.id,
                    username: usuariosTable.nombre,
                });

            if (createdOAthAccountRes.length === 0) {
                trx.rollback()
                return Response.json(
                    {
                        status: 500,
                        body: "Error creating user"
                    }
                )
            }

        } else {
            userId = user.id
            const oauthAccountUser = await trx.query.oauthAccountTable.findFirst({
                where: (table) => eq(table.idUsuario, userId),
            });

            if (!oauthAccountUser) {
                const createdOAthAccountRes = await trx.insert(oauthAccountTable)
                    .values({
                        codigoUsuarioProveedor: googleData.id,
                        expira: accessTokenExpiresAt.getTime(),
                        idProveedorAutenticacion: 1,
                        idUsuario: userId,
                        tokenAcceso: accessToken?.toString() || "",
                        tokenRefresh: refreshToken?.toString() || "",
                    })
                    .returning({
                        id: usuariosTable.id,
                        username: usuariosTable.nombre,
                    });
                if (createdOAthAccountRes.length === 0) {
                    trx.rollback()
                    return Response.json(
                        {
                            status: 500,
                            body: "Error updating user"
                        }
                    )
                }
            }
            else{
                const updatedOAuthAccountRes = await trx.update(oauthAccountTable).set({
                    tokenAcceso: accessToken?.toString() || "",
                    tokenRefresh: refreshToken?.toString() || "",
                    expira: accessTokenExpiresAt.getTime()
                }).where(eq(oauthAccountTable.codigoUsuarioProveedor, googleData.id));
    
                if (updatedOAuthAccountRes.rowsAffected === 0) {
                    trx.rollback()
                    return Response.json(
                        {
                            status: 500,
                            body: "Error updating user"
                        }
                    )
                }
            }
        }
    })

    // Create a session for the user
    let session = await lucia.createSession(userId, {
        expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );

    return NextResponse.redirect(new URL("/profile", process.env.NEXT_PUBLIC_BASE_URL),
        { status: 302 }
    );

}