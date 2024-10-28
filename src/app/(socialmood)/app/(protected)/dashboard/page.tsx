'use client'
import React from 'react'
import GraficoInteracciones from "@/components/(socialmood)/interactions-graph";
import SeguidoresChart from "@/components/(socialmood)/followers-chart";
import InteraccionesDashboard from "@/components/(socialmood)/interactions-dashboard";
import { useRouter } from 'next/navigation';
import EmotionsChart from "@/components/(socialmood)/emotions-chart";



function dashboard() {

  const router = useRouter();

  const handleRedirect = () => {
    router.push('/app/listado-interacciones');
  };

  return (
    <div className="space-y-6">
      <div className='flex space-x-6'>
        <GraficoInteracciones />
        <SeguidoresChart />
        <EmotionsChart />

      </div>
      <div className='w-full flex space-x-16'>
      <div className="w-full space-y-3">
        <div className='w-full flex space-x-6' >
          <h2 className="text-[20px] text-white text-right font-bold">Resumen de Interacciones</h2>
          <span
            onClick={handleRedirect}
            className="text-[#A6A2B4] hover:underline font-semibold cursor-pointer">
            Ver listado
          </span>
        </div>
        <InteraccionesDashboard />
      </div>
      </div>

      
    </div>


  )
}

export default dashboard