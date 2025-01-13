"use server";
import { SignInSchema, SignUpSchema } from "@/types";
import db from "@/db";
import { usuariosTable } from "@/db/schema/socialMood";
import { lucia, validateRequest } from "@/lib/lucia/lucia";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";
import * as bcrypt from "bcryptjs"; // Import bcrypt

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
    where: (table) => and(eq(table.correo_electronico, values.correo_electronico), eq(table.id_tipo_usuario, 2)),
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