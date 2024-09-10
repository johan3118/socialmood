"use client";
import { useState } from "react";
import Image from "next/image";
import CheckSocialButton from "@/components/(socialmood)/check-social-button";
import BlurredContainer from "@/components/(socialmood)/blur-background";
import HorizontalLine from "@/components/(socialmood)/horizontal-line";
import PayPalButton from "@/components/(socialmood)/paypal-button";
import basic from "/public/basic.png";
import pro from "/public/pro.png";
import premium from "/public/premium.png";
import IconContainer from "./check";

interface PlanDescriptionProps {
  planDescription: {
    name: string;
    price: number;
    description: string;
    features: string[];
  };
  onSelectPlan: (tipoFacturacion: number) => void;
  planMensual: any;
  planAnual: any;
  userid: number;
}

export default function ClientSubscription({
  userid,
  planDescription,
  onSelectPlan,
  planMensual,
  planAnual,
}: PlanDescriptionProps) {
  const [selectedPlanType, setSelectedPlanType] = useState(1); // Por defecto, mensual

  let planImage = basic;
  if (planDescription.name === "Plan Básico") {
    planImage = basic;
  } else if (planDescription.name === "Plan Intermedio") {
    planImage = pro;
  } else if (planDescription.name === "Plan Avanzado") {
    planImage = premium;
  }

  // Manejar la selección del plan mensual o anual
  const handlePlanClick = (tipoFacturacion: number) => {
    setSelectedPlanType(tipoFacturacion);
    onSelectPlan(tipoFacturacion);
  };

  return (
    <main className="flex flex-col xl:flex-row w-full min-h-screen items-center justify-center lg:px-56 2xl:px-72 xl:space-x-2">
      {/* Información del plan */}
      <BlurredContainer customStyle={`space-y-7 min-h-[75vh]`}>
        <section className="flex flex-col items-center justify-center space-y-3">
          <Image
            src={planImage}
            quality={100}
            alt={`${planDescription.name} plan image`}
          />
          <h1 className="text-lg font-medium text-white">
            {planDescription.name}
          </h1>
          <section className="flex space-x-1">
            <h1 className="text-8xl text-white font-black">
              ${planDescription.price}
            </h1>
            <p className="text-gray-100 font-medium opacity-70 self-end text-base">
              {selectedPlanType === 1 ? "/mensual" : "/anual"}
            </p>
          </section>
        </section>

        <HorizontalLine width="w-[75%]" />
        <section className="flex flex-col items-start justify-start space-y-2">
          {planDescription.features.map((feature, i) => (
            <div key={i} className="flex space-x-3">
              <IconContainer
                bgColor={"bg-[#F86A3A]"}
                size={18}
                iconColor={"white"}
              />
              <h2 className="text-xs text-white font-medium">{feature}</h2>
            </div>
          ))}
        </section>

        <HorizontalLine width="w-[75%]" />
      </BlurredContainer>

      {/* Selección y checkout */}
      <BlurredContainer customStyle="bg-white min-h-[75vh]">
        <section className="items-center justify-center flex flex-col space-y-8 w-full">
          <h1 className="text-4xl font-[1000] self-start">CHECKOUT</h1>

          <section className="flex w-full items-center justify-between space-x-4">
            <CheckSocialButton
              customStyle="w-full"
              variant={
                planMensual &&
                planMensual.id_estado_plan === 1 &&
                selectedPlanType === 1
                  ? "default"
                  : "disable"
              }
              size="lgBold"
              defaultText={
                planMensual && planMensual.id_estado_plan === 1
                  ? "Mensual"
                  : "Desactivado"
              }
              secondaryText={
                planMensual && planMensual.id_estado_plan === 1
                  ? `USD ${planMensual.costo}`
                  : "Desactivado"
              }
              onClick={() =>
                planMensual &&
                planMensual.id_estado_plan === 1 &&
                handlePlanClick(1)
              }
            />
            <CheckSocialButton
              customStyle="w-full"
              variant={
                planAnual &&
                planAnual.id_estado_plan === 1 &&
                selectedPlanType === 2
                  ? "default"
                  : "disable"
              }
              size="lgBold"
              defaultText={
                planAnual && planAnual.id_estado_plan === 1
                  ? "Anual"
                  : "Desactivado"
              }
              secondaryText={
                planAnual && planAnual.id_estado_plan === 1
                  ? `USD ${planAnual?.costo || 0}`
                  : "Desactivado"
              }
              onClick={() =>
                planAnual &&
                planAnual.id_estado_plan === 1 &&
                handlePlanClick(2)
              }
            />
          </section>

          <HorizontalLine color="border-black" width="w-[90%]" />

          <p className="text-justify text-sm font-medium px-4">
            {planDescription.description}
          </p>

          <HorizontalLine color="border-black" width="w-[90%]" />

          {/* Botón de pago */}
          <PayPalButton
            paypalPlanId={
              selectedPlanType === 1
                ? planMensual?.paypal_plan_id
                : planAnual?.paypal_plan_id
            }
            planName={
              selectedPlanType === 1 ? planMensual.nombre : planAnual.nombre
            }
            billingType={selectedPlanType === 1 ? "Mensual" : "Anual"}
            planCost={
              selectedPlanType === 1 ? planMensual.costo : planAnual.costo
            }
            userId={userid}
            planId={selectedPlanType === 1 ? planMensual.id : planAnual.id}
          />
        </section>
      </BlurredContainer>
    </main>
  );
}
