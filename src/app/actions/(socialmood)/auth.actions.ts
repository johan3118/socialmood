"use server";
import { SignInSchema, SignUpSchema } from "@/types";
import { generateId } from "lucia";
import db from "@/db";
import { cuentasRedesSocialesTable, usuariosTable } from "@/db/schema/socialMood";
import { lucia, validateRequest } from "@/lib/lucia/lucia";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";
import * as bcrypt from "bcryptjs"; // Import bcrypt
import { google } from "@/lib/lucia/oauth";
import { generateState, generateCodeVerifier } from "arctic";
import { planesTable, subscripcionesTable, facturasTable } from "@/db/schema/socialMood";
import { CodeIcon } from "lucide-react";


export const signUp = async (values: {
  nombre: string;
  apellido: string;
  direccion: string,
  correo_electronico: string,
  password: string,
  confirmPassword: string,
}) => {
  // Check with Zod if the values are valid
  try {
    SignUpSchema.parse(values);
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
  // Hash the password with bcrypt
  const hashedPassword = await bcrypt.hash(values.password, 10);
  // Generate a random ID for the user
  let userId: number;
  // Insert the user into the database

  try {
    // Find the user in the database
    const existingUser = await db.query.usuariosTable.findFirst({
      where: (table) => and(eq(table.correo_electronico, values.correo_electronico)),
    });

    // If the user is not found, return an error
    if (existingUser) {
      return {
        error: "Email already taken",
      };
    }

    const newUser = await db
      .insert(usuariosTable)
      .values({
        nombre: values.nombre,
        apellido: values.apellido,
        direccion: values.direccion,
        correo_electronico: values.correo_electronico,
        llave_acceso: hashedPassword,
        id_proveedor_autenticacion: 1,
        id_tipo_usuario: 1 // Usuario Gestor de Comunidad
      })
      .returning({
        id: usuariosTable.id,
        username: usuariosTable.nombre,
      });

    userId = newUser[0].id;

    // Create a session for the user
    const session = await lucia.createSession(userId, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    // Create a session cookie
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Set the session cookie
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      data: {
        userId,
      },
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

export const signIn = async (values: {
  correo_electronico: string;
  password: string;
}) => {
  // Check with Zod if the values are valid
  try {
    SignInSchema.parse(values);
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
  // Find the user in the database
  const existingUser = await db.query.usuariosTable.findFirst({
    where: (table) => and(eq(table.correo_electronico, values.correo_electronico), eq(table.id_tipo_usuario, 1)),
  });

  // If the user is not found, return an error
  if (!existingUser || !existingUser.llave_acceso) {
    return {
      error: "User not found",
    };
  }

  // Verify the password with bcrypt
  const isValidPassword = await bcrypt.compare(
    values.password,
    existingUser.llave_acceso
  );

  if (!isValidPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  // Create a session for the user
  const session = await lucia.createSession(existingUser.id, {
    expiresIn: 60 * 60 * 24 * 30,
  });

  // Create a session cookie
  const sessionCookie = lucia.createSessionCookie(session.id);

  // Set the session cookie
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return {
    success: "Logged in successfully",
  };
};

export const signOut = async () => {
  // Validate the request to get the session
  try {
    const { session } = await validateRequest();

    if (!session) {
      return {
        error: "Unauthorized",
      };
    }

    // Invalidate the session
    await lucia.invalidateSession(session.id);

    // Creates a new cookie with a blank value that expires immediately to delete the existing session cookie.
    const sessionCookie = lucia.createBlankSessionCookie();

    // Set the session cookie as blank
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

export const createGoogleAuthotizationURL = async () => {
  try{
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
  
    cookies().set("codeVerifier", codeVerifier, {
      httpOnly: true,
    });

    cookies().set("state", state, {
      httpOnly: true,
    });


    const scopes = ["openid", "profile", "email"]

    const authorizationURL = await google.createAuthorizationURL(state, codeVerifier, { scopes });
  
    return {
      success: true,
      data: authorizationURL
    }
  }
  catch(error: any){
    return {
      error: error?.message
    }
  }
}

export async function getSubscription(userId : number) {
  const result = await db
    .select({id: subscripcionesTable.id})
    .from(subscripcionesTable)
    .where(eq(subscripcionesTable.id_propietario, userId))
    .limit(1);
    if(result.length === 0){
      return null;
    }
    return result[0].id;
}

export async function getSocialMediaSubscription(subscriptionId: number) {
  
  const result = await db
    .select({codigo: cuentasRedesSocialesTable.codigo_cuenta})
    .from(cuentasRedesSocialesTable)
    .where(eq(cuentasRedesSocialesTable.id_subscripcion, subscriptionId))

    return result.map((account) => account.codigo);
}

export async function hasSubscription(userId: number) {
  console.log(userId);
  const result = await db
    .select()
    .from(subscripcionesTable)
    .where(eq(subscripcionesTable.id_propietario, userId));
  return result.length > 0;
}

export async function getActiveUserId() {
  const { user } = await validateRequest();
  return user?.id.toString();
}

export async function getActiveUserName() {
  const { user } = await validateRequest();
  const userid = user?.id;
  if (userid === undefined) {
    return {
      error: "User ID is undefined",
    };
  }
  const result = await db
    .select({nombre: usuariosTable.nombre, apellido: usuariosTable.apellido})
    .from(usuariosTable)
    .where(eq(usuariosTable.id, userid))
    .limit(1);

  return result[0].nombre.toString() + " " + result[0].apellido.toString();
}

export async function getActiveUserEmail() {
  const { user } = await validateRequest();
  const userid = user?.id;
  if (userid === undefined) {
    return {
      error: "User ID is undefined",
    };
  }
  const result = await db
    .select({correo_electronico: usuariosTable.correo_electronico})
    .from(usuariosTable)
    .where(eq(usuariosTable.id, userid))
    .limit(1);

  return result[0].correo_electronico.toString();
}
