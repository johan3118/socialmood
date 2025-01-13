"use server";
import db from "@/db";
import { coloresTable, redesSocialesTable, cuentasRedesSocialesTable } from "@/db/schema/socialMood";
import { eq, and } from "drizzle-orm";
import { getActiveUserId, getSubscription} from "./auth.actions";


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


export const getLinkedAccounts = async () => {

  const userid = await getActiveUserId();

    if (!userid) {
        throw new Error("User ID is undefined");
    }

    const subscription = await getSubscription(parseInt(userid));

    if (subscription === null) {
        throw new Error("Subscription is null");
    }

  const linkedAccounts = await db
    .select({
      red_social: redesSocialesTable.nombre,
      username: cuentasRedesSocialesTable.usuario_cuenta,
      color: coloresTable.codigo_hex,
    })
    .from(cuentasRedesSocialesTable)
    .innerJoin(redesSocialesTable, eq(redesSocialesTable.id, cuentasRedesSocialesTable.id_red_social)) // Unión correcta con redes sociales
    .innerJoin(coloresTable, eq(coloresTable.id, cuentasRedesSocialesTable.id_color)) // Unión correcta con colores
    .where(eq(cuentasRedesSocialesTable.id_subscripcion, subscription)); // Filtro por id de suscripción
  
  return JSON.parse(JSON.stringify(linkedAccounts));
};

export const deleteLinkedAccount = async (username: string): Promise<{ message: string }> => {
  try {
    const userId = await getActiveUserId();
    if (!userId) throw new Error("User ID is undefined");

    const subscription = await getSubscription(parseInt(userId));
    if (!subscription) throw new Error("Subscription is null");

    // Intentar eliminar el registro principal
    await db
      .delete(cuentasRedesSocialesTable)
      .where(
        and(
          eq(cuentasRedesSocialesTable.id_subscripcion, subscription),
          eq(cuentasRedesSocialesTable.usuario_cuenta, username)
        )
      )
      .run();

    return { message: "Account deleted successfully." };

  } catch (error: any) {
    // Manejo específico para errores de restricción de clave foránea
    if (error.code === 'SQLITE_CONSTRAINT') {
      console.error("Error deleting linked account: Foreign key constraint failed");
      throw new Error(
        "No se pudo eliminar la cuenta vinculada porque está referenciada en otra tabla. Por favor, verifica las dependencias antes de intentar eliminarla."
      );
    }

    // Otros errores
    console.error("Error deleting linked account:", error);
    throw new Error("An unexpected error occurred while deleting the account.");
  }
};

export const getAccountColor = async (username: string) => {

  const accountColor = await db
    .select({
      color: coloresTable.codigo_hex,
    })
    .from(cuentasRedesSocialesTable)
    .innerJoin(coloresTable, eq(coloresTable.id, cuentasRedesSocialesTable.id_color)) // Unión correcta con colores
    .where(eq(cuentasRedesSocialesTable.usuario_cuenta, username)); // Filtro por id de suscripción
  
  return JSON.parse(JSON.stringify(accountColor));
};




