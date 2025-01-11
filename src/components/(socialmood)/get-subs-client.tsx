"use client";

import { useState } from "react";
import BlurredContainer from "@/components/(socialmood)/blur-background";
import Image from "next/image";
import CheckSocialButton from "@/components/(socialmood)/check-social-button";
import HorizontalLine from "@/components/(socialmood)/horizontal-line";
import PayPalButton from "@/components/(socialmood)/paypal-button";
import basic from "/public/basic.png";
import IconContainer from "./check";

export default function GetSubscriptionClient({
  userid,
  plan
}: {
  userid: number;
  plan: any | null;
}) {
  console.log("Plan", plan);
  const [selectedPlan, setSelectedPlan] = useState(plan);

  if (!selectedPlan) {
    return <div>No hay un plan disponible para seleccionar.</div>;
  }

  const planDescription = {
    name: selectedPlan?.nombre || "Plan no disponible",
    price: selectedPlan?.costo || 0,
    description: selectedPlan?.descripcion || "No hay descripción disponible",
    features: [
      `${selectedPlan?.cantidad_interacciones_mes || 0} interacciones por mes`,
      `Administra hasta ${selectedPlan?.cantidad_cuentas_permitidas || 0
      } redes sociales`,
      `Cantidad máxima de ${selectedPlan?.cantidad_usuarios_permitidos || 0
      } usuarios`,
    ],
  };

  return (
    <main className="flex flex-col xl:flex-row items-center justify-center pt-4 space-x-4">
      {/* Información del plan */}
      <BlurredContainer customStyle={`space-y-7 min-h-[75vh]`}>
        <section className="flex flex-col items-center justify-center space-y-3">
          <Image
            src={basic}
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
              {plan.id_tipo_facturacion == 1 ? "Mensual" : "Anual"}
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

          <HorizontalLine color="border-black" width="w-[90%]" />

          <p className="text-justify text-sm font-medium px-4">
            {planDescription.description}
          </p>

          <HorizontalLine color="border-black" width="w-[90%]" />


          <PayPalButton
            paypalPlanId={plan?.paypal_plan_id
            }
            planName={
              plan.nombre
            }
            billingType={plan.id_tipo_facturacion == 1 ? "mensual" : "anual"}
            planCost={
              plan.costo
            }
            userId={userid}
            planId={plan.id}
          />
        </section>
      </BlurredContainer>
    </main>
  );
}
