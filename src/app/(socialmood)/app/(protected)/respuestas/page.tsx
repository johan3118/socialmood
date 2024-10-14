"use client"
import React, { useState } from "react";
import ListadoRespuestasTable from '@/components/(socialmood)/listado-respuestas'
import FilterModal from '@/components/(socialmood)/filter-modal'
import SocialButton from '@/components/(socialmood)/social-button'
import SearchBar from '@/components/(socialmood)/searchbar'

function PantallaGestionRespuestasPage() {

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Controla la visibilidad del modal

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    subcategory: [],
    network: [],
    ruleType: [],
  });

  const onSaveFilters = (filter: any) => {
    setSelectedFilters(filter);
    console.log(filter);
  }

  return (

    <div className="space-y-4">
      <div className="flex space-x-4 mx-12">
        <SearchBar />

        <SocialButton
          customStyle="w-32"
          variant="default"
          defaultText="Filtros"
          type="button" // Cambiado a 'button' para evitar enviar un formulario
          onClick={openFilterModal}
        />
        <FilterModal isOpen={isFilterModalOpen} onClose={closeFilterModal} onSave={onSaveFilters} />
      </div>

      <FilterModal isOpen={isFilterModalOpen} onClose={closeFilterModal} onSave={onSaveFilters} />
      <ListadoRespuestasTable
        filter={selectedFilters}
      />
    </div>
  )
}

export default PantallaGestionRespuestasPage