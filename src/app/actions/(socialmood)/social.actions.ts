"use server";
import db from "@/db";
import { coloresTable, redesSocialesTable, cuentasRedesSocialesTable } from "@/db/schema/socialMood";
import { eq } from "drizzle-orm";

interface InsertSocialAccount {
  llave_acceso: string;
  usuario_cuenta: string;
  codigo_cuenta: string;
  fecha_vencimiento_acceso: number;
  id_subscripcion: number;
  id_red_social: number;
  id_color: number;
}

interface Account {
  red_social: string;
  username: string 
  color: string;
  estado: string;
}

export const getColors = async () => {
  const colores = await db
  .select({
    name: coloresTable.nombre,
    value: coloresTable.codigo_hex,
    id: coloresTable.id
  })
  .from(coloresTable)
  .all();
  return JSON.parse(JSON.stringify(colores));
};

export const getSocialPlatforms = async () => {
  const socialPlatforms = await db
  .select({
    name: redesSocialesTable.nombre,
    value: redesSocialesTable.nombre,
    icon: redesSocialesTable.enlace_logo,
    estado: redesSocialesTable.id_estado_red_social,
    id: redesSocialesTable.id
  })
  .from(redesSocialesTable)
  .where(eq(redesSocialesTable.id_estado_red_social, 1)); // Trae las redes social con estado actio
  return JSON.parse(JSON.stringify(socialPlatforms));
};

export const insertSocialAccount = async (values: InsertSocialAccount) => {
  try {
    const socialAccount = await db
      .insert(cuentasRedesSocialesTable)
      .values({
        llave_acceso: values.llave_acceso,
        usuario_cuenta: values.usuario_cuenta,
        codigo_cuenta: values.codigo_cuenta,
        fecha_vencimiento_acceso: values.fecha_vencimiento_acceso,
        id_subscripcion: values.id_subscripcion,
        id_red_social: values.id_red_social,
        id_color: values.id_color,
      });

    return { success: true, data: JSON.parse(JSON.stringify(socialAccount)) };

  } catch (error) {
    console.error('Error inserting social account:', error);
    return { success: false, message: 'Error al insertar la cuenta en la base de datos' };
  }
};


export const getLinkedAccounts = async (idSubcripcion: number) => {
  const linkedAccounts = await db
    .select({
      red_social: redesSocialesTable.nombre,
      username: cuentasRedesSocialesTable.usuario_cuenta,
      color: coloresTable.codigo_hex,
    })
    .from(cuentasRedesSocialesTable)
    .innerJoin(redesSocialesTable, eq(redesSocialesTable.id, cuentasRedesSocialesTable.id_red_social)) // Unión correcta con redes sociales
    .innerJoin(coloresTable, eq(coloresTable.id, cuentasRedesSocialesTable.id_color)) // Unión correcta con colores
    .where(eq(cuentasRedesSocialesTable.id_subscripcion, idSubcripcion)); // Filtro por id de suscripción
  
  return JSON.parse(JSON.stringify(linkedAccounts));
};




