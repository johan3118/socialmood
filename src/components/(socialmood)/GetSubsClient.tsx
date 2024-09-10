"use client";

import { useState } from "react";
import ClientSubscription from "@/components/(socialmood)/ClientSubscription";

export default function GetSubscriptionClient({
  userid,
  planMensual,
  planAnual,
}: {
  userid: number;
  planMensual: any | null;
  planAnual: any | null;
}) {
  const [selectedPlan, setSelectedPlan] = useState(planMensual || planAnual);

  const handleSelectPlan = (tipoFacturacion: number) => {
    if (tipoFacturacion === 1 && planMensual) {
      setSelectedPlan(planMensual);
    } else if (tipoFacturacion === 2 && planAnual) {
      setSelectedPlan(planAnual);
    }
  };

  if (!selectedPlan) {
    return <div>No hay un plan disponible para seleccionar.</div>;
  }

  const planDescription = {
    name: selectedPlan?.nombre || "Plan no disponible",
    price: selectedPlan?.costo || 0,
    description: selectedPlan?.descripcion || "No hay descripción disponible",
    features: [
      `${selectedPlan?.cantidad_interacciones_mes || 0} interacciones por mes`,
      `Administra hasta ${
        selectedPlan?.cantidad_cuentas_permitidas || 0
      } redes sociales`,
      `Cantidad máxima de ${
        selectedPlan?.cantidad_usuarios_permitidos || 0
      } usuarios`,
    ],
  };

  return (
    <ClientSubscription
      userid={userid}
      planDescription={planDescription}
      onSelectPlan={handleSelectPlan}
      planMensual={planMensual}
      planAnual={planAnual}
    />
  );
}
