"use server";
import { SignInSchema, SignUpSchema } from "@/types";
import { generateId } from "lucia";
import db from "@/db";
import { usuariosTable } from "@/db/schema/socialMood";
import { lucia, validateRequest } from "@/lib/lucia/lucia";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs"; // Import bcrypt

export const signUp = async (values: {
  nombre: string;
  apellido: string;
  direccion: string,
  correo_electronico: string,
  password: string
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
    const newUser = await db
      .insert(usuariosTable)
      .values({
        nombre: values.nombre,
        apellido: values.apellido,
        direccion: values.direccion,
        correo_electronico: values.correo_electronico,
        llave_acceso: hashedPassword,
        id_proveedor_autenticacion: 1,
        id_tipo_usuario: 1
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
    where: (table) => eq(table.correo_electronico, values.correo_electronico),
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
