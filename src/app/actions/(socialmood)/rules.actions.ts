'use server'
import db from "@/db";
import { reglasTable, categoriasTable, tiposReglaTable, subcategoriasTable, subcategoriasReglasTable, cuentasRedesSocialesTable, redesSocialesTable } from "@/db/schema/socialMood";
import { eq, and, or, inArray } from "drizzle-orm";
import { PropagateToWorkersField } from "next/dist/server/lib/router-utils/types";



interface Perfil {
  red_social: string;
  username: string;
  color: string;
}

interface Reglas {
  id: number;
  perfil: Perfil;
  alias: string;
  subcategorias: string[];
}


export async function getRules(subscriptionId: number, filter: any) {



  let categories = filter.category;
  let subcategories = filter.subcategory;
  let networks = filter.network;
  let ruleTypes = filter.ruleType;

  let rules = [];

  const isCategoryFilter = (categories?.length ?? 0) > 0;
  const isSubcategoryFilter = (subcategories?.length ?? 0) > 0;
  const isNetworkFilter = (networks?.length ?? 0) > 0;
  const isRuleTypeFilter = (ruleTypes?.length ?? 0) > 0;

  if (!isCategoryFilter && !isSubcategoryFilter && !isNetworkFilter && !isRuleTypeFilter) {

    rules = await db
      .select({
        id: reglasTable.id,
        nombre_red_social_receptor: redesSocialesTable.nombre,
        usuario_cuenta_receptor: cuentasRedesSocialesTable.usuario_cuenta,
        alias: reglasTable.alias,
      })
      .from(reglasTable)
      .innerJoin(cuentasRedesSocialesTable, eq(cuentasRedesSocialesTable.id, reglasTable.id_cuenta))
      .innerJoin(redesSocialesTable, eq(redesSocialesTable.id, cuentasRedesSocialesTable.id_red_social))
      .innerJoin(tiposReglaTable, eq(tiposReglaTable.id, reglasTable.id_tipo_regla))
      .innerJoin(subcategoriasReglasTable, eq(subcategoriasReglasTable.id_regla, reglasTable.id))
      .innerJoin(subcategoriasTable, eq(subcategoriasTable.id, subcategoriasReglasTable.id_subcategoria))
      .innerJoin(categoriasTable, eq(categoriasTable.id, subcategoriasTable.id_categoria))
      .where(
        and(
          eq(cuentasRedesSocialesTable.id_subscripcion, subscriptionId)
        ))
      .limit(1);
  }
  else {

    if (!isCategoryFilter) {
      const categoriesResult = await db.select({ nombre: categoriasTable.nombre }).from(categoriasTable);
      categories = categoriesResult.map(category => category.nombre);
    }

    if (!isSubcategoryFilter) {
      const subcategoriesResult = await db.select({ nombre: subcategoriasTable.nombre }).from(subcategoriasTable);
      subcategories = subcategoriesResult.map(subcategory => subcategory.nombre);
    }

    if (!isNetworkFilter) {
      const networksResult = await db.select({ nombre: redesSocialesTable.nombre }).from(redesSocialesTable);
      networks = networksResult.map(network => network.nombre);
    }

    if (!isRuleTypeFilter) {
      const ruleTypesResult = await db.select({ nombre: tiposReglaTable.nombre }).from(tiposReglaTable);
      ruleTypes = ruleTypesResult.map(ruleType => ruleType.nombre);
    }

    rules = await db
      .select({
        id: reglasTable.id,
        nombre_red_social_receptor: redesSocialesTable.nombre,
        usuario_cuenta_receptor: cuentasRedesSocialesTable.usuario_cuenta,
        alias: reglasTable.alias,
      })
      .from(reglasTable)
      .innerJoin(cuentasRedesSocialesTable, eq(cuentasRedesSocialesTable.id, reglasTable.id_cuenta))
      .innerJoin(redesSocialesTable, eq(redesSocialesTable.id, cuentasRedesSocialesTable.id_red_social))
      .innerJoin(tiposReglaTable, eq(tiposReglaTable.id, reglasTable.id_tipo_regla))
      .innerJoin(subcategoriasReglasTable, eq(subcategoriasReglasTable.id_regla, reglasTable.id))
      .innerJoin(subcategoriasTable, eq(subcategoriasTable.id, subcategoriasReglasTable.id_subcategoria))
      .innerJoin(categoriasTable, eq(categoriasTable.id, subcategoriasTable.id_categoria))
      .where(
        and(
          eq(cuentasRedesSocialesTable.id_subscripcion, subscriptionId),
          or(
            isCategoryFilter ? inArray(categoriasTable.nombre, categories) : undefined,
            isSubcategoryFilter ? inArray(subcategoriasTable.nombre, subcategories) : undefined,
            isNetworkFilter ? inArray(redesSocialesTable.nombre, networks) : undefined,
            isRuleTypeFilter ? inArray(tiposReglaTable.nombre, ruleTypes) : undefined
          )
        ))
      .limit(1);
  }

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
      id: rule.id,
      perfil: {
        red_social: rule.nombre_red_social_receptor,
        username: rule.usuario_cuenta_receptor,
        color: "red",
      },
      alias: rule.alias,
      subcategorias: arrayCategories,
    } as Reglas;
  });

  return formattedRules;
}
