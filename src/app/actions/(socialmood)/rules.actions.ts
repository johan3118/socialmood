'use server'
import db from "@/db";
import { reglasTable, subcategoriasTable, subcategoriasReglasTable, cuentasRedesSocialesTable, redesSocialesTable } from "@/db/schema/socialMood";
import { eq } from "drizzle-orm";
import { PropagateToWorkersField } from "next/dist/server/lib/router-utils/types";



interface Perfil {
  red_social: string;
  username: string;
  color: string;
}

interface Reglas {
  perfil: Perfil;
  alias: string;
  subcategorias: string[];
}


export async function getRules(subscriptionId: number) {

  const rules = await db
    .select({
      id: reglasTable.id,
      nombre_red_social_receptor: redesSocialesTable.nombre,
      usuario_cuenta_receptor: cuentasRedesSocialesTable.usuario_cuenta,
      alias: reglasTable.alias,
    })
    .from(reglasTable)
    .innerJoin(cuentasRedesSocialesTable, eq(cuentasRedesSocialesTable.id, reglasTable.id_cuenta))
    .innerJoin(redesSocialesTable, eq(redesSocialesTable.id, cuentasRedesSocialesTable.id_red_social))
    .where(eq(cuentasRedesSocialesTable.id_subscripcion, subscriptionId))
    .limit(1);

  // make it compatible with interface Reglas

  const formattedRules = rules.map(async (rule: any) => {
    const categories = await db
      .select({
        subcategorias: subcategoriasTable.nombre
      })
      .from(subcategoriasTable)
      .innerJoin(subcategoriasReglasTable, eq(subcategoriasReglasTable.id_subcategoria, subcategoriasTable.id))
      .where(eq(subcategoriasReglasTable.id_regla, rule.id));

      const arrayCategories = categories.map((category) => category.subcategorias);
    
    return {
      perfil: {
        red_social: rule.nombre_red_social_receptor,
        username: rule.usuario_cuenta_receptor,
        color: "red",
      },
      alias: rule.alias,
      subcategorias: arrayCategories ,
    } as Reglas;
  });

  return formattedRules;
}
