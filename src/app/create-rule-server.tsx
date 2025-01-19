// src/app/(socialmood)/CreateRuleWrapper.tsx
import { redirect } from "next/navigation";
import {
  getActiveUserId,
  getSubscription,
} from "@/app/actions/(socialmood)/auth.actions";
import {
  createRule,
  getSocialMediaAccounts,
} from "@/app/actions/(socialmood)/rules.actions";

// Importa tu componente cliente
import CreateRule from "@/components/(socialmood)/create-rule";

interface CreateRuleWrapperProps {
  onOpenChange: (open: boolean) => void;
}

// Este componente es SERVER (no lleva "use client")
export default async function CreateRuleWrapper({
  onOpenChange,
}: CreateRuleWrapperProps) {
  // 1. Verificar usuario
  const userID = await getActiveUserId();
  if (!userID) {
    redirect("/app/sign-in");
  }

  // 2. Verificar suscripción
  const subscriptionID = await getSubscription(parseInt(userID));
  if (!subscriptionID) {
    redirect("/app/get-sub");
  }

  // 3. Cargar cuentas de redes sociales
  const accounts = await getSocialMediaAccounts(subscriptionID);
  const socialMedias = accounts.map((acc) => ({
    id: acc.id.toString(),
    label: acc.usuario_cuenta,
  }));

  // 4. Renderizar el componente cliente, pasándole los datos y la acción
  return (
    <CreateRule
      onOpenChange={onOpenChange}
      socialMedias={socialMedias}
      handleCreateRule={createRule} // Pasar createRule directamente
    />
  );
}
