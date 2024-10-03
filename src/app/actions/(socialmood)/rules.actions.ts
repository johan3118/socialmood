'use server'
import db from "@/db";
import { reglasTable, categoriasTable, tiposReglaTable, subcategoriasTable, subcategoriasReglasTable, cuentasRedesSocialesTable, redesSocialesTable } from "@/db/schema/socialMood";
import { eq, and, or, inArray, isNull, not } from "drizzle-orm";
import { StyledString } from "next/dist/build/swc";
import { PropagateToWorkersField } from "next/dist/server/lib/router-utils/types";
import { CreateRuleSchema } from "@/types";



interface Perfil {
  red_social: string;
  username: string;
  color: string;
  id_cuenta?: number;
}

interface Reglas {
  id: number;
  perfil: Perfil;
  alias: string;
  subcategorias: string[];
  instrucciones?: string;
  id_tipo_regla?: number;
  id_regla_padre?: number;
}

// get all the social media accounts for a given subscription
export async function getSocialMediaAccounts(subscriptionId: number) {
  const accounts = await db
    .select({
      id: cuentasRedesSocialesTable.id,
      usuario_cuenta: cuentasRedesSocialesTable.usuario_cuenta,
    })
    .from(cuentasRedesSocialesTable)
    .innerJoin(redesSocialesTable, eq(redesSocialesTable.id, cuentasRedesSocialesTable.id_red_social))
    .where(eq(cuentasRedesSocialesTable.id_subscripcion, subscriptionId))
    .limit(1);

  return accounts;
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
          eq(cuentasRedesSocialesTable.id_subscripcion, subscriptionId),
          isNull(reglasTable.id_regla_padre)
        ))
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
          isNull(reglasTable.id_regla_padre),
          or(
            isCategoryFilter ? inArray(categoriasTable.nombre, categories) : undefined,
            isSubcategoryFilter ? inArray(subcategoriasTable.nombre, subcategories) : undefined,
            isNetworkFilter ? inArray(redesSocialesTable.nombre, networks) : undefined,
            isRuleTypeFilter ? inArray(tiposReglaTable.nombre, ruleTypes) : undefined
          )
        ))
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

  //only keep unique records from the array
  const uniqueRules = await Promise.all(formattedRules);
  const uniqueRulesSet = new Set(uniqueRules.map(rule => JSON.stringify(rule)));
  const uniqueRulesArray = Array.from(uniqueRulesSet).map(rule => JSON.parse(rule));

  return uniqueRulesArray;
}

export async function getRule(ruleId: number) {
  const rule = await db
    .select({
      id: reglasTable.id,
      nombre_red_social_receptor: redesSocialesTable.nombre,
      usuario_cuenta_receptor: cuentasRedesSocialesTable.usuario_cuenta,
      alias: reglasTable.alias,
      instrucciones: reglasTable.prompt,
      tipo: tiposReglaTable.nombre,
      subcategorias: subcategoriasTable.nombre,
      id_subcategoria: subcategoriasTable.id,
      id_cuenta: cuentasRedesSocialesTable.id,
      id_tipo_regla: tiposReglaTable.id,
      id_regla_padre: reglasTable.id_regla_padre,
    })
    .from(reglasTable)
    .innerJoin(cuentasRedesSocialesTable, eq(cuentasRedesSocialesTable.id, reglasTable.id_cuenta))
    .innerJoin(redesSocialesTable, eq(redesSocialesTable.id, cuentasRedesSocialesTable.id_red_social))
    .innerJoin(tiposReglaTable, eq(tiposReglaTable.id, reglasTable.id_tipo_regla))
    .innerJoin(subcategoriasReglasTable, eq(subcategoriasReglasTable.id_regla, reglasTable.id))
    .innerJoin(subcategoriasTable, eq(subcategoriasTable.id, subcategoriasReglasTable.id_subcategoria))
    .where(eq(reglasTable.id, ruleId))
    .limit(1);

  const formattedRules = rule.map(async (rule: any) => {
    const categories = await db
      .select({
        subcategorias: subcategoriasTable.id
      })
      .from(subcategoriasTable)
      .innerJoin(subcategoriasReglasTable, eq(subcategoriasReglasTable.id_subcategoria, subcategoriasTable.id))
      .where(eq(subcategoriasReglasTable.id_regla, rule.id));

    const arrayCategories = categories.map((category) => category.subcategorias.toString());

    return {
      id: rule.id,
      perfil: {
        red_social: rule.nombre_red_social_receptor,
        username: rule.usuario_cuenta_receptor,
        color: "red",
        id_cuenta: rule.id_cuenta,
      },
      alias: rule.alias,
      id_tipo_regla: rule.id_tipo_regla,
      id_regla_padre: rule.id_regla_padre,
      subcategorias: arrayCategories,
      instrucciones: rule.instrucciones,
    } as Reglas;
  });
  return formattedRules[0];
}

export async function getChildRules(ruleId: number) {
  const rule = await db
    .select({
      id: reglasTable.id,
      nombre_red_social_receptor: redesSocialesTable.nombre,
      usuario_cuenta_receptor: cuentasRedesSocialesTable.usuario_cuenta,
      alias: reglasTable.alias,
      instrucciones: reglasTable.prompt,
      tipo: tiposReglaTable.nombre,
      subcategorias: subcategoriasTable.nombre,
      id_subcategoria: subcategoriasTable.id,
      id_cuenta: cuentasRedesSocialesTable.id,
      id_tipo_regla: tiposReglaTable.id,
    })
    .from(reglasTable)
    .innerJoin(cuentasRedesSocialesTable, eq(cuentasRedesSocialesTable.id, reglasTable.id_cuenta))
    .innerJoin(redesSocialesTable, eq(redesSocialesTable.id, cuentasRedesSocialesTable.id_red_social))
    .innerJoin(tiposReglaTable, eq(tiposReglaTable.id, reglasTable.id_tipo_regla))
    .innerJoin(subcategoriasReglasTable, eq(subcategoriasReglasTable.id_regla, reglasTable.id))
    .innerJoin(subcategoriasTable, eq(subcategoriasTable.id, subcategoriasReglasTable.id_subcategoria))
    .where(eq(reglasTable.id_regla_padre, ruleId))

  const formattedRules = rule.map(async (rule: any) => {
    const categories = await db
      .select({
        subcategorias: subcategoriasTable.id
      })
      .from(subcategoriasTable)
      .innerJoin(subcategoriasReglasTable, eq(subcategoriasReglasTable.id_subcategoria, subcategoriasTable.id))
      .where(eq(subcategoriasReglasTable.id_regla, rule.id));

    const arrayCategories = categories.map((category) => category.subcategorias.toString());

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

  const uniqueRules = await Promise.all(formattedRules);
  const uniqueRulesSet = new Set(uniqueRules.map(rule => JSON.stringify(rule)));
  const uniqueRulesArray = Array.from(uniqueRulesSet).map(rule => JSON.parse(rule));

  return uniqueRulesArray;
}

export async function createRule(rule: {
  red_social: string;
  tipo: string;
  instrucciones: string;
  alias: string;
  subcategorias: string[];
}) {

  try {
    CreateRuleSchema.parse(rule);
  } catch (error: any) {
    return {
      error: "Some fields are missing or invalid",
    };
  }

  try {
    const existingRule = await db
      .select({ alias: reglasTable.alias })
      .from(reglasTable)
      .where(eq(reglasTable.alias, rule.alias))
      .limit(1);

    if (existingRule.length > 0) {
      return {
        error: "Rule with the same alias already exists",
      };
    }

    await db.transaction(async (trx) => {
      const newRule = await trx.insert(reglasTable).values({
        prompt: rule.instrucciones,
        id_tipo_regla: parseInt(rule.tipo),
        id_cuenta: parseInt(rule.red_social),
        alias: rule.alias
      }).returning({
        id: reglasTable.id
      });

      const newRuleId = newRule[0].id;

      const subcategorias = rule.subcategorias;

      for (const subcategoria of subcategorias) {
        await trx.insert(subcategoriasReglasTable).values({
          id_regla: newRuleId,
          id_subcategoria: parseInt(subcategoria),
        }).execute();
      }
    });

    return {
      success: "Rule created successfully",
    };
  } catch (error) {
    console.error("Error creating rule:", error);
    return {
      error: "An error occurred while creating the rule",
    };
  }
}

export async function createChildRule(rule: {
  red_social: string;
  tipo: string;
  instrucciones: string;
  alias: string;
  subcategorias: string[];
}, parentRuleId: number) {

  try {
    CreateRuleSchema.parse(rule);
  } catch (error: any) {
    return {
      error: "Some fields are missing or invalid",
    };
  }

  try {
    const existingRule = await db
      .select({ alias: reglasTable.alias })
      .from(reglasTable)
      .where(eq(reglasTable.alias, rule.alias))
      .limit(1);

    if (existingRule.length > 0) {
      return {
        error: "Rule with the same alias already exists",
      };
    }

    await db.transaction(async (trx) => {
      const newRule = await trx.insert(reglasTable).values({
        prompt: rule.instrucciones,
        id_tipo_regla: parseInt(rule.tipo),
        id_regla_padre: parentRuleId,
        id_cuenta: parseInt(rule.red_social),
        alias: rule.alias
      }).returning({
        id: reglasTable.id
      });

      const newRuleId = newRule[0].id;

      const subcategorias = rule.subcategorias;

      for (const subcategoria of subcategorias) {
        await trx.insert(subcategoriasReglasTable).values({
          id_regla: newRuleId,
          id_subcategoria: parseInt(subcategoria),
        }).execute();
      }
    });

    return {
      success: "Rule created successfully",
    };
  } catch (error) {
    console.error("Error creating rule:", error);
    return {
      error: "An error occurred while creating the rule",
    };
  }
}

export async function ruleHasChildren(ruleId: number) {
  const childRules = await db.select({ id: reglasTable.id }).from(reglasTable).where(eq(reglasTable.id_regla_padre, ruleId));
  return childRules.length > 0;
}

export async function deleteRule(ruleId: number) {

  try {
    await db.transaction(async (trx) => {
      const childRules = await trx.select({ id: reglasTable.id }).from(reglasTable).where(eq(reglasTable.id_regla_padre, ruleId));
      for (const childRule of childRules) {
        await trx.delete(subcategoriasReglasTable).where(eq(subcategoriasReglasTable.id_regla, childRule.id)).execute();
        await trx.delete(reglasTable).where(eq(reglasTable.id, childRule.id)).execute();
      }
      await trx.delete(subcategoriasReglasTable).where(eq(subcategoriasReglasTable.id_regla, ruleId)).execute();
      await trx.delete(reglasTable).where(eq(reglasTable.id, ruleId)).execute();
    });

    return {
      success: "Rule deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting rule:", error);
    return {
      error: "An error occurred while deleting the rule",
    };
  }
}

export async function updateRule(rule: {
  red_social: string;
  tipo: string;
  instrucciones: string;
  alias: string;
  subcategorias: string[];
},ruleId: number) {

  try {

    // check if the alias belongs to another rule, bersides the one being updated
    const existingRule = await db
      .select({ alias: reglasTable.alias })
      .from(reglasTable)
      .where(and(eq(reglasTable.alias, rule?.alias ?? ''), not(eq(reglasTable.id, ruleId))))
      .limit(1);

    if (existingRule.length > 0) {
      return {
        error: "Rule with the same alias already exists",
      };
    }
    
    await db.transaction(async (trx) => {
      await trx.delete(subcategoriasReglasTable).where(eq(subcategoriasReglasTable.id_regla, ruleId)).execute();
      await trx.update(reglasTable).set({
        prompt: rule.instrucciones,
        alias: rule.alias
      }).where(eq(reglasTable.id, ruleId)).execute();
    });

    const subcategorias = rule.subcategorias;

    for (const subcategoria of subcategorias) {
      await db.insert(subcategoriasReglasTable).values({
        id_regla: ruleId,
        id_subcategoria: parseInt(subcategoria),
      }).execute();
    }

    return {
      success: "Rule deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting rule:", error);
    return {
      error: "An error occurred while deleting the rule",
    };
  }
}



export async function getRuleSubcategories(ruleID: number) {
  const subcategories = await db.select({ id: subcategoriasTable.id, label: subcategoriasTable.nombre })
    .from(subcategoriasTable)
    .innerJoin(subcategoriasReglasTable, eq(subcategoriasReglasTable.id_subcategoria, subcategoriasTable.id))
    .where(eq(subcategoriasReglasTable.id_regla, ruleID));
  return subcategories;
}