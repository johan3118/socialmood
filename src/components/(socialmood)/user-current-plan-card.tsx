"use client"
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Plus, X } from "lucide-react";
import BlurredContainer from "@/components/(socialmood)/blur-background";
import Image from "next/image";
import { getNextPaymentDate } from '@/app/actions/(backoffice)/subscriptions.actions';

function UserCurrentPlanCard() {

  const [nextPaymentDate, setNextPaymentDate] = useState<string | null>(null);

  const fetchNextPaymentDate = async () => {
    try {
      const nextPaymentTimestamp = await getNextPaymentDate();
      if (nextPaymentTimestamp) {
        const formattedDate = new Date(nextPaymentTimestamp).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        setNextPaymentDate(formattedDate);
      } else {
        setNextPaymentDate("Fecha no disponible");
      }
    } catch (error) {
      console.error("Error fetching next payment date:", error);
      setNextPaymentDate("Error al obtener fecha");
    }
  };

  useEffect(() => {
    fetchNextPaymentDate();
  }, []);

  return (
    <BlurredContainer customStyle='h-[30vh] !mx-0'>
        <div className="flex items-center w-full">

          <div className='payment-info w-full'>

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Plan Actual</h2>
              <button aria-label="Editar plan">
                <Edit className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs mb-2">Próximo pago: {nextPaymentDate ? `$25 el ${nextPaymentDate}` : "Cargando..."}</p>
            <p className="text-sm font-bold mb-4">Plan Básico $25/mensual</p>
            <p className="text-xs mb-1">Método de pago</p>

            <div className="flex items-center">
              <Image src="/paypal-logo.svg" width={15} height={25} alt="credit card"/>
              <span className='text-sm ml-2'>PayPal</span>
              <button aria-label="Editar método de pago">
                <Edit className="w-4 h-5 ml-3" />
              </button>
            </div>

          </div>

          <Image src="/credit-card.svg" width={200} height={100} alt="credit card"/>

        </div>
    </BlurredContainer>
  );
}

export default UserCurrentPlanCard;
