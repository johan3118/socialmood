'use client'
import React from 'react'
import GraficoInteracciones from "@/components/(socialmood)/interactions-graph";
import SeguidoresChart from "@/components/(socialmood)/followers-chart";
import InteraccionesDashboard from "@/components/(socialmood)/interactions-dashboard";
import { useRouter } from 'next/navigation';
import EmotionsChart from "@/components/(socialmood)/emotions-chart";
import CategoryChart from "@/components/(socialmood)/category-chart";

function dashboard() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/app/listado-interacciones');
  };

  return (
    // Contenedor principal con scroll
    
    <div className="space-y-6">
<div className='flex items-center space-x-4 px-6'>
<div className=''>
            <span
              onClick={handleRedirect}
              className="text-[16px] text-white hover:underline font-bold cursor-pointer">
              Hoy
            </span>
        </div>
        <div className='items-center'>
            <span
              onClick={handleRedirect}
              className=" bg-blue rounded-lg text-[16px] text-white hover:underline font-semibold cursor-pointer">
              Ultimos 7 dias
            </span>
        </div>
</div>
        <div className='space-y-6 h-screen overflow-y-auto p-4'>
        <div className='flex space-x-6'>
        <GraficoInteracciones />
        <SeguidoresChart />
        <EmotionsChart />
      </div>

      <div className='w-full h-full flex space-x-10'>
        <div className="w-full h-full space-y-3">
          <div className='w-full flex items-center'>
            <h2 className="text-[20px] text-nowrap text-white text-right font-bold">Resumen de Interacciones</h2>
            <span
              onClick={handleRedirect}
              className="w-full text-right text-[14px] text-[#A6A2B4] hover:underline font-semibold cursor-pointer">
              Ver listado
            </span>
          </div>
          <InteraccionesDashboard />
        </div>
        
        <div className="mt-10 w-full space-y-3">
          <CategoryChart />
        </div>
      </div>
        </div>

    </div>
  );
}

export default dashboard;
