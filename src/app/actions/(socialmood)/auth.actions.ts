"use server";
import { SignInSchema, SignUpSchema } from "@/types";
import { generateId } from "lucia";
import db from "@/db";
import { cuentasRedesSocialesTable, usuariosTable } from "@/db/schema/socialMood";
import { lucia, validateRequest } from "@/lib/lucia/lucia";
import { cookies } from "next/headers";
import { eq, or } from "drizzle-orm";
import { and } from "drizzle-orm";
import * as bcrypt from "bcryptjs"; // Import bcrypt
import { google } from "@/lib/lucia/oauth";
import { generateState, generateCodeVerifier } from "arctic";
import { planesTable, subscripcionesTable, facturasTable } from "@/db/schema/socialMood";
import { CodeIcon } from "lucide-react";
import {sendEmail} from "@/app/actions/(socialmood)/email.actions"


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

    // Call the sendEmail action to send a welcome email
    try {
      await sendEmail(values.correo_electronico, values.nombre);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Optionally handle this error, e.g., log it or notify admin
    }

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
  try {
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
  catch (error: any) {
    return {
      error: error?.message
    }
  }
}

export async function getSubscription(userId: number) {
  const result = await db
    .select({ id: subscripcionesTable.id })
    .from(subscripcionesTable)
    .where(eq(subscripcionesTable.id_propietario, userId))
    .limit(1);
  if (result.length === 0) {
    return null;
  }
  return result[0].id;
}

export async function getSocialMediaSubscription(subscriptionId: number) {

  const result = await db
    .select({ codigo: cuentasRedesSocialesTable.codigo_cuenta })
    .from(cuentasRedesSocialesTable)
    .where(eq(cuentasRedesSocialesTable.id_subscripcion, subscriptionId))

  return result.map((account) => account.codigo);
}

export async function getSocialMediaNameSubscription() {


  const userid = await getActiveUserId();

  if (!userid) {
    throw new Error("User ID is undefined");
  }

  const subscriptionId = await getSubscription(parseInt(userid));

  if (subscriptionId === null) {
    throw new Error("Subscription is null");
  }

  const result = await db
    .select({ codigo: cuentasRedesSocialesTable.usuario_cuenta })
    .from(cuentasRedesSocialesTable)
    .where(eq(cuentasRedesSocialesTable.id_subscripcion, subscriptionId))

  return result.map((account) => account.codigo);
}

export async function getSocialMediaToken(socialMediaAccount: string) {
  const result = await db
    .select({ token: cuentasRedesSocialesTable.llave_acceso })
    .from(cuentasRedesSocialesTable)
    .where(
      or(
        eq(cuentasRedesSocialesTable.usuario_cuenta, socialMediaAccount),
        eq(cuentasRedesSocialesTable.codigo_cuenta, socialMediaAccount)
      )
    );
  return result[0]?.token.toString();
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
    .select({ nombre: usuariosTable.nombre, apellido: usuariosTable.apellido })
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
    .select({ correo_electronico: usuariosTable.correo_electronico })
    .from(usuariosTable)
    .where(eq(usuariosTable.id, userid))
    .limit(1);

  return result[0].correo_electronico.toString();
}


export async function getActiveUserAddress() {
  // Validar la sesión activa y obtener el usuario autenticado
  const { user } = await validateRequest();

  // Obtener el ID del usuario
  const userId = user?.id;

  // Verificar si el ID del usuario está definido
  if (userId === undefined) {
    return {
      error: "User ID is undefined",
    };
  }

  try {
    const result = await db
      .select({ direccion: usuariosTable.direccion })
      .from(usuariosTable)
      .where(eq(usuariosTable.id, userId))
      .limit(1);

    // Verificar si se obtuvo un resultado
    if (result.length === 0) {
      return {
        error: "Address not found for the user",
      };
    }

    // Retornar la dirección del usuario
    return result[0]?.direccion?.toString() || "";
  } catch (error: any) {
    return {
      error: error?.message || "An error occurred while fetching the address",
    };
  }
}

export async function updateUserProfile(data: {
  name: string;
  lastName: string;
  address: string;
}) {
  // Validar la sesión activa y obtener el usuario autenticado
  const { user } = await validateRequest();

  // Obtener el ID del usuario // en el backoffice filtrar por email
  const userId = user?.id;

  // Verificar si el ID del usuario está definido
  if (userId === undefined) {
    return {
      error: "User ID is undefined",
    };
  }

  // Obtener los datos del usuario
  const { name, lastName, address } = data;

  // Verificar si los datos del usuario están definidos
  if (!name || !lastName  || !address) {
    return {
      error: "Missing user data",
    };
  }

  try {
    // Actualizar los datos del usuario
    await db
      .update(usuariosTable)
      .set({
        nombre: name,
        apellido: lastName,
        direccion: address,
      })
      .where(eq(usuariosTable.id, userId));

    // Retornar una respuesta exitosa
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      error: error?.message || "An error occurred while updating the user profile",
    };
  }
}

export async function updatePassword(data: {
  password: string;
}) {
  // Validar la sesión activa y obtener el usuario autenticado
  const { user } = await validateRequest();

  // Obtener el ID del usuario // en el backoffice filtrar por email
  const userId = user?.id;

  // Verificar si el ID del usuario está definido
  if (userId === undefined) {
    return {
      error: "User ID is undefined",
    };
  }

  // Obtener los datos del usuario
  const { password } = data;

  // Verificar si los datos del usuario están definidos
  if (!password) {
    return {
      error: "Missing user data",
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Actualizar los datos del usuario
    await db
      .update(usuariosTable)
      .set({
        llave_acceso: hashedPassword
      })
      .where(eq(usuariosTable.id, userId));

    // Retornar una respuesta exitosa
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      error: error?.message || "Ocurrio un error al actualizar la contraseña",
    };
  }
}