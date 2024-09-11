"use server";
import { CreateUserSchema } from "@/types";
import db from "@/db";
import { usuariosTable } from "@/db/schema/socialMood";
import { lucia, validateRequest } from "@/lib/lucia/lucia";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";
import * as bcrypt from "bcryptjs"; // Import bcrypt


export const createUser = async (values: {
    nombre: string;
    apellido: string;
    direccion: string,
    correo: string,
    password: string,
    confirmPassword: string,
    tipoUsuario: string
  }) => {
    // Check with Zod if the values are valid
    try {
        CreateUserSchema.parse(values);
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
    console.log(values)
    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(values.password, 10);
    // Generate a random ID for the user
    let userId: number;
    // Insert the user into the database

    try {
      // Find the user in the database
      const existingUser = await db.query.usuariosTable.findFirst({
        where: (table) => and(eq(table.correo_electronico, values.correo)),
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
          correo_electronico: values.correo,
          llave_acceso: hashedPassword,
          id_proveedor_autenticacion: 1,
          id_tipo_usuario: parseInt(values.tipoUsuario, 10)
        })
        .returning({
          id: usuariosTable.id,
          username: usuariosTable.nombre,
        });
  
      userId = newUser[0].id;
 
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