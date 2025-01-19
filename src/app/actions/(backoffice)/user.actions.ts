'use server';

import { CreateUserSchema } from "@/types";
import db from "@/db";
import { usuariosTable, tiposUsuarioTable } from "@/db/schema/socialMood";
import { and, eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

export const createUser = async (values: {
  nombre: string;
  apellido: string;
  direccion: string;
  correo: string;
  password: string;
  confirmPassword: string;
  tipoUsuario: string;
}) => {
  try {
    CreateUserSchema.parse(values);

    const hashedPassword = await bcrypt.hash(values.password, 10);

    const existingUser = await db.query.usuariosTable.findFirst({
      where: and(eq(usuariosTable.correo_electronico, values.correo)),
    });

    if (existingUser) {
      return { error: "El correo ya está registrado." };
    }

    const newUser = await db
      .insert(usuariosTable)
      .values({
        nombre: values.nombre,
        apellido: values.apellido,
        direccion: values.direccion,
        correo_electronico: values.correo,
        llave_acceso: hashedPassword,
        id_proveedor_autenticacion: 1,
        id_tipo_usuario: parseInt(values.tipoUsuario, 10),
      })
      .returning({ id: usuariosTable.id });

    return { success: true, userId: newUser[0].id };
  } catch (error: any) {
    return { error: error.message || "Error al crear usuario." };
  }
};

export const selectAllUsers = async () => {
  try {
    const allUsers = await db
      .select({
        userId: usuariosTable.id,
        nombre: usuariosTable.nombre,
        apellido: usuariosTable.apellido,
        direccion: usuariosTable.direccion,
        tipo_usuario: tiposUsuarioTable.nombre,
        correo: usuariosTable.correo_electronico,
      })
      .from(usuariosTable)
      .innerJoin(tiposUsuarioTable, eq(usuariosTable.id_tipo_usuario, tiposUsuarioTable.id))
      .all();

    return allUsers; // Simplificado sin JSON.parse, ya que Drizzle lo maneja
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw new Error("Error al obtener usuarios.");
  }
};

export const getUserById = async (userId: number) => {
  try {
    const user = await db
      .select({
        userId: usuariosTable.id,
        nombre: usuariosTable.nombre,
        apellido: usuariosTable.apellido,
        direccion: usuariosTable.direccion,
        tipo_usuario: tiposUsuarioTable.nombre,
        correo: usuariosTable.correo_electronico,
      })
      .from(usuariosTable)
      .innerJoin(tiposUsuarioTable, eq(usuariosTable.id_tipo_usuario, tiposUsuarioTable.id))
      .where(eq(usuariosTable.id, userId))
      .all();

    return user.length > 0 ? user[0] : null; // Devuelve null si no se encuentra usuario
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw new Error("Error al obtener usuario.");
  }
};

export const updateUserById = async (userId: number, updateData: any) => {
  const filteredData = Object.fromEntries(
    Object.entries(updateData).filter(([_, value]) => value !== undefined)
  );

  if (Object.keys(filteredData).length === 0) {
    throw new Error("No hay campos para actualizar.");
  }

  try {
    const result = await db
      .update(usuariosTable)
      .set(filteredData)
      .where(eq(usuariosTable.id, userId));

    if (result.rowsAffected === 0) {
      throw new Error(`No se encontró usuario con ID ${userId}.`);
    }

    console.log(`Usuario con ID ${userId} actualizado correctamente.`);
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw new Error("Error al actualizar usuario.");
  }
};

export const changeUserPasswordById = async (userId: number, updateData: any) => {
  const filteredData = Object.fromEntries(
    Object.entries(updateData).filter(([_, value]) => value !== undefined)
  );

  if (Object.keys(filteredData).length === 0) {
    throw new Error("No hay campos para actualizar.");
  }

  try {
    const hashedPassword = await bcrypt.hash(updateData.password, 10);

    const result = await db
      .update(usuariosTable)
      .set({llave_acceso: hashedPassword})
      .where(eq(usuariosTable.id, userId));

    if (result.rowsAffected === 0) {
      throw new Error(`No se encontró usuario con ID ${userId}.`);
    }

    console.log(`Contraseña actualizada correctamente.`);
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    return { error: "Error al actualizar la contraseña." };
  }
};
