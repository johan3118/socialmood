import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import {
  getPlansByName,
  getPlanById,
} from "@/app/actions/(socialmood)/get-plans.actions";
import GetSubscriptionClient from "@/components/(socialmood)/GetSubsClient";

export default async function GetSubscription({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/");
  }

  const planId = parseInt(searchParams.id || "0", 10);
  const plan = await getPlanById(planId);

  if (!plan) {
    return <div>Plan no encontrado</div>;
  }

  const planes = await getPlansByName(plan.nombre);
  const planMensual = planes.find((p) => p.id_tipo_facturacion === 1) || null;
  const planAnual = planes.find((p) => p.id_tipo_facturacion === 2) || null;

  return (
    <GetSubscriptionClient
      userid={user.id}
      planMensual={planMensual}
      planAnual={planAnual}
    />
  );
}
