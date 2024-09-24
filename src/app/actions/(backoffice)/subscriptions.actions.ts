"use server"
import db from "@/db";
import {planesTable, tiposFacturacionTable, estadosPlanTable} from "@/db/schema/socialMood";
import {eq} from "drizzle-orm";

export const insertPlan = async (plan: {
    nombre: string,
    costo: number,
    cantidad_interacciones_mes: number,
    cantidad_usuarios_permitidos: number,
    cantidad_cuentas_permitidas: number,
    descripcion: string,
    id_estado_plan: number,
    id_tipo_facturacion: number,
    paypal_plan_id: string
  }) => {
   const insertedPlan = await db
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
        paypal_plan_id: plan.paypal_plan_id
      })

      return JSON.parse(JSON.stringify(insertedPlan));
    
    };

export const selectAllPlans = async () => {
  const allPlans = await db
      .select({
        planId: planesTable.id,
        planNombre: planesTable.nombre,
        costo: planesTable.costo,
        cantidad_interacciones_mes: planesTable.cantidad_interacciones_mes,
        cantidad_usuarios_permitidos: planesTable.cantidad_usuarios_permitidos,
        cantidad_cuentas_permitidas: planesTable.cantidad_cuentas_permitidas,
        estado_plan_nombre: estadosPlanTable.nombre,
        tipo_facturacion_nombre: tiposFacturacionTable.nombre,
        
      })
      .from(planesTable)
      .innerJoin(estadosPlanTable, eq(planesTable.id_estado_plan, estadosPlanTable.id))
      .innerJoin(tiposFacturacionTable, eq(planesTable.id_tipo_facturacion, tiposFacturacionTable.id))
      .all();

return JSON.parse(JSON.stringify(allPlans));
  
}

export const activatePlan = async (planId: number) => {
  try {
    // Actualizamos el id_estado_plan a 1 (activo)
    const result = await db
      .update(planesTable)
      .set({ id_estado_plan: 1 })
      .where(eq(planesTable.id, planId));

    if (result.rowsAffected > 0) {
      console.log(`El plan con ID ${planId} ha sido activado exitosamente.`);
      return JSON.parse(JSON.stringify(result));
    } else {
      console.log(`No se encontró el plan con ID ${planId}.`);
    }
  } catch (error) {
    console.error("Error al activar el plan:", error);
  }
}

export const deactivatePlan = async (planId: number) => {
  try {
    // Actualizamos el id_estado_plan a 1 (activo)
    const result = await db
      .update(planesTable)
      .set({ id_estado_plan: 2 })
      .where(eq(planesTable.id, planId));

    if (result.rowsAffected > 0) {
      console.log(`El plan con ID ${planId} ha sido activado exitosamente.`);
      return JSON.parse(JSON.stringify(result));
    } else {
      console.log(`No se encontró el plan con ID ${planId}.`);
    }
  } catch (error) {
    console.error("Error al activar el plan:", error);
  }
}

