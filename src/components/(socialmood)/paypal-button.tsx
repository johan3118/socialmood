"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Importar useRouter
import { handleNewSubscription } from "@/app/actions/(socialmood)/get-plans.actions";

declare global {
  interface Window {
    paypal: any;
  }
}

interface PayPalButtonProps {
  paypalPlanId: string;
  planName: string;
  billingType: string; // "Mensual" o "Anual"
  planCost: number;
  userId: number; // ID del usuario autenticado
  planId: number; // ID del plan (mensual o anual)
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  paypalPlanId,
  planName,
  billingType,
  planCost,
  userId,
  planId,
}) => {
  const router = useRouter(); // Inicializar el hook useRouter

  useEffect(() => {
    console.log(paypalPlanId);
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AQEpcxi6zo0JHfCkgJafrgfVG1xeUNwk53-xUepwT2CpcV7_foTYlsxCjp-JngT_stubauCGq07u67Af&vault=true&intent=subscription";
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        window.paypal
          .Buttons({
            style: {
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "pay",
              tagline: false,
            },
            createSubscription: function (data: any, actions: any) {
              return actions.subscription.create({
                plan_id: paypalPlanId,
              });
            },
            onApprove: async function (data: any, actions: any) {
              // Llamar a la server action para crear la suscripción y factura
              const response = await handleNewSubscription({
                subscriptionID: data.subscriptionID,
                planName,
                billingType,
                planCost,
                userId,
                planId,
              });

              if (response.success) {
                router.push("/app/dashboard");
              } else {
                alert("Hubo un problema al procesar la suscripción.");
              }
            },
          })
          .render("#paypal-button-container");
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [paypalPlanId, planName, billingType, planCost, userId, planId, router]);

  return (
    <div className="w-full h-[18vh]">
      <div id="paypal-button-container"></div>
    </div>
  );
};

export default PayPalButton;
