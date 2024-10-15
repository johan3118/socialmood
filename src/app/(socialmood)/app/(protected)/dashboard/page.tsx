import React from 'react'
import GraficoInteracciones from "@/components/(socialmood)/interactions-graph";
import SeguidoresChart from "@/components/(socialmood)/followers-chart";

function dashboard() {
  return (
    <div className="flex space-x-6">        
        <GraficoInteracciones />
        <SeguidoresChart />
      </div>
  )
}

export default dashboard