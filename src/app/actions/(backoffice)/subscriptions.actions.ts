"use server"
import db from "@/db";
import {planesTable} from "@/db/schema/socialMood";

export const insertPlan = async (plan: {
    nombre: string,
    costo: number,
    cantidad_interacciones_mes: number,
    cantidad_usuarios_permitidos: number,
    cantidad_cuentas_permitidas: number,
    descripcion: string,
    id_estado_plan: number,
    id_tipo_facturacion: number
  }) => {
    return await db
    .insert(planesTable)
    .values({
        nombre: plan.nombre,
        costo: plan.costo,
        cantidad_interacciones_mes: plan.cantidad_interacciones_mes,
        cantidad_usuarios_permitidos: plan.cantidad_usuarios_permitidos,
        cantidad_cuentas_permitidas: plan.cantidad_cuentas_permitidas,
        descripcion: plan.descripcion,
        id_estado_plan: plan.id_estado_plan,
        id_tipo_facturacion: plan.id_tipo_facturacion,
        paypal_plan_id: ""
      })
  };

