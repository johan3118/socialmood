"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Importar useRouter
import { handleNewSubscription } from "@/app/actions/(socialmood)/get-plans.actions";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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

  return (
    <div className="w-full h-[18vh]">
      <PayPalScriptProvider options={{
        clientId: "AQEpcxi6zo0JHfCkgJafrgfVG1xeUNwk53-xUepwT2CpcV7_foTYlsxCjp-JngT_stubauCGq07u67Af",
        vault: true,
        intent: "subscription",
      }}>
        <PayPalButtons style={{
          "layout": "vertical",
          "color": "gold",
          "shape": "rect",
          "label": "pay",
        }}
          createSubscription={
            function (data: any, actions: any) {
              return actions.subscription.create({
                plan_id: paypalPlanId,
              });
            }}

          onApprove={
            async function (data: any, actions: any) {
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
            }

          }
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalButton;