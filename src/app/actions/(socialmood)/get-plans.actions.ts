'use server'
import db from "@/db";
import { planesTable, subscripcionesTable, facturasTable, cuentasRedesSocialesTable, reglasTable, subcategoriasReglasTable, subcategoriasTable } from "@/db/schema/socialMood";
import { eq, inArray, and } from "drizzle-orm";

export async function getSubscriptionPlans() {
  const plans = await db.select().from(planesTable).limit(3);
  return plans;
}

export async function getUserSubscription(userId: number) {
  const subscription = await db
    .select({
      planId: subscripcionesTable.id_plan_subscripcion,
      planName: planesTable.nombre,
    })
    .from(subscripcionesTable)
    .leftJoin(planesTable, eq(planesTable.id, subscripcionesTable.id_plan_subscripcion))
    .where(eq(subscripcionesTable.id_propietario, userId))
    .limit(1);

  return subscription[0];
}

export async function getPlanById(planId: number) {
  const plan = await db
    .select()
    .from(planesTable)
    .where(eq(planesTable.id, planId))
    .limit(1);

  return plan[0];
}

export async function getPlansByName(nombre: string) {
  return await db
    .select()
    .from(planesTable)
    .where(eq(planesTable.nombre, nombre));
}


export async function hasSubscription(userId: number) {
  console.log(userId);
  const result = await db
    .select()
    .from(subscripcionesTable)
    .where(eq(subscripcionesTable.id_propietario, userId));
  return result.length > 0;
}

export async function handleNewSubscription({
  userId,
  subscriptionID,
  planId,
  planName,
  planCost,
  billingType,
}: {
  userId: number;
  subscriptionID: string;
  planId: number;
  planName: string;
  planCost: number;
  billingType: string;
}) {
  const fechaAdquisicion = new Date();

  const fechaFacturacion = new Date(fechaAdquisicion);
  fechaFacturacion.setMonth(fechaFacturacion.getMonth() + 1);

  if (fechaFacturacion.getDate() !== fechaAdquisicion.getDate()) {
    fechaFacturacion.setDate(0);
  }

  const fechaUltimoPago = fechaAdquisicion.getTime();

  const fechaProximoPago = fechaFacturacion.getTime();

  const [newSubscription] = await db
    .insert(subscripcionesTable)
    .values({
      referencia_pago: subscriptionID,
      fecha_adquisicion: fechaUltimoPago,
      fecha_ultimo_pago: fechaUltimoPago,
      fecha_proximo_pago: fechaProximoPago,
      costo: planCost,
      nombre_plan: planName,
      tipo_facturacion: billingType,
      id_propietario: userId,
      id_plan_subscripcion: planId,
      id_estado_subscripcion: 1,
      id_metodo_pago: 1, // Método de pago PayPal
    })
    .returning();

  await db.insert(facturasTable).values({
    codigo_transaccion: subscriptionID,
    referencia_pago: subscriptionID,
    monto_total: planCost,
    fecha_facturacion: fechaProximoPago,
    nombre_plan: planName,
    id_metodo_pago: 1, // Método de pago PayPal
    id_estado_factura: 1,
    id_usuario: userId,
    id_plan_subscripcion: planId,
    id_subscripcion: newSubscription.id,
  });

  return { success: true };
}

export const obtenerCuentasRedesSociales = async () => {
  const cuentas = await db
    .select({
      id: cuentasRedesSocialesTable.id,
      llave_acceso: cuentasRedesSocialesTable.llave_acceso,
      codigo_cuenta: cuentasRedesSocialesTable.codigo_cuenta,
      usuario_cuenta: cuentasRedesSocialesTable.usuario_cuenta,
    })
    .from(cuentasRedesSocialesTable);

  return cuentas;
};

export const obtenerSoloReglasDeCuentas = async (id: number, subcategorias: string) => {
  const regla = await db
    .select({
      regla: reglasTable.prompt,
      id: reglasTable.id
    })
    .from(reglasTable)
    .innerJoin(subcategoriasReglasTable, eq(subcategoriasReglasTable.id_regla, reglasTable.id))
    .innerJoin(subcategoriasTable, eq(subcategoriasTable.id, subcategoriasReglasTable.id_subcategoria))
    .where(and(eq(reglasTable.id_cuenta, id), eq(subcategoriasTable.nombre, subcategorias)));

  let descripciones = regla.map((r) => r.regla)

  let ids_reglas_padre = regla.map((r) => r.id)

  for (let i = 0; i < ids_reglas_padre.length; i++) {
    let reglas_hijas = await db
      .select({
        regla: reglasTable.prompt,
      })
      .from(reglasTable)
      .innerJoin(subcategoriasReglasTable, eq(subcategoriasReglasTable.id_regla, reglasTable.id))
      .innerJoin(subcategoriasTable, eq(subcategoriasTable.id, subcategoriasReglasTable.id_subcategoria))
      .where(and(eq(reglasTable.id_regla_padre, ids_reglas_padre[i]), eq(subcategoriasTable.nombre, subcategorias)));

    reglas_hijas.forEach((r) => {
      if (descripciones.indexOf(r.regla) === -1) {
        descripciones.push(r.regla)
      }
    });
  }

  descripciones = descripciones.filter((item, index) => descripciones.indexOf(item) == index)

  return descripciones;
};
