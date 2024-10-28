import React from 'react'
import GraficoInteracciones from "@/components/(socialmood)/interactions-graph";
import SeguidoresChart from "@/components/(socialmood)/followers-chart";
import EmotionsChart from "@/components/(socialmood)/emotions-chart";


function dashboard() {
  return (
    <div className="flex space-x-6">        
        <GraficoInteracciones />
        <SeguidoresChart />
        <EmotionsChart />

      </div>
  )
}

export default dashboard