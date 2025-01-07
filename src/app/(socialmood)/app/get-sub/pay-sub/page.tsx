import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import {
  getPlansByName,
  getPlanById,
} from "@/app/actions/(socialmood)/get-plans.actions";
import GetSubscriptionClient from "@/components/(socialmood)/get-subs-client";

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

  return (
    <div className="bg-[#2C2436]">
      <GetSubscriptionClient
      userid={user.id}
      plan={plan}
    />

    </div>
    
  );
}
