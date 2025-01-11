"use client";
import React, { useEffect, useState } from "react";
import BlurredContainer from "@/components/(socialmood)/blur-background";
import Image from "next/image";
import basic from "@/assets/basic.png";
import { useTranslations } from "next-intl";
import { getSubscription } from "@/app/actions/(socialmood)/auth.actions";
import { HorizontalLine } from "@/components/(socialmood)/horizontal-line";
import IconContainer from "@/components/(socialmood)/icon-container";

export default function UserCurrentPlanCard() {
  const t = useTranslations("socialmood.profile.plan");
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      const subscription = await getSubscription();
      setPlan(subscription);
    };
    fetchPlan();
  }, []);

  if (!plan) {
    return <div>{t("loading")}</div>;
  }

  return (
    <BlurredContainer>
      <section className="flex flex-col items-center justify-center space-y-3">
        <Image src={basic} quality={100} alt={`${plan.nombre} plan image`} />
        <h1 className="text-lg font-medium text-white">{plan.nombre}</h1>
        <section className="flex space-x-1">
          <h1 className="text-8xl text-white font-black">${plan.costo}</h1>
          <p className="text-gray-100 font-medium opacity-70 self-end text-base">
            {plan.id_tipo_facturacion === 1 ? t("monthly") : t("yearly")}
          </p>
        </section>
      </section>

      <HorizontalLine width="w-[75%]" />

      <section className="flex flex-col items-start justify-start space-y-2">
        <div className="flex space-x-3">
          <IconContainer
            bgColor={"bg-[#F86A3A]"}
            size={18}
            iconColor={"white"}
          />
          <h2 className="text-xs text-white font-medium">
            {t("interactionsPerMonth", {
              count: plan.cantidad_interacciones_mes,
            })}
          </h2>
        </div>
        <div className="flex space-x-3">
          <IconContainer
            bgColor={"bg-[#F86A3A]"}
            size={18}
            iconColor={"white"}
          />
          <h2 className="text-xs text-white font-medium">
            {t("maxSocialAccounts", {
              count: plan.cantidad_cuentas_permitidas,
            })}
          </h2>
        </div>
        <div className="flex space-x-3">
          <IconContainer
            bgColor={"bg-[#F86A3A]"}
            size={18}
            iconColor={"white"}
          />
          <h2 className="text-xs text-white font-medium">
            {t("maxUsers", { count: plan.cantidad_usuarios_permitidos })}
          </h2>
        </div>
      </section>

      <HorizontalLine width="w-[75%]" />
    </BlurredContainer>
  );
}
