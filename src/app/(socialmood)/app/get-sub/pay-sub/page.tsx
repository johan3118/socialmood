import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import {
  getPlanById
} from "@/app/actions/(socialmood)/get-plans.actions";
import GetSubscriptionClient from "@/components/(socialmood)/get-subs-client";
import { getUserById } from "@/app/actions/(socialmood)/user.actions";

export default async function GetSubscription({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/");
  }
  else {
    const userdata = await getUserById(user?.id);
    if (userdata?.tipo_usuario == "admin") {
      return redirect("/bo");
    }
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
