"use client"
import React, { useState } from "react";
import ListadoRespuestasTable from '@/components/(socialmood)/listado-respuestas'
import FilterModal from '@/components/(socialmood)/filter-modal-interaction'
import SocialButton from '@/components/(socialmood)/social-button'
import SearchBar from '@/components/(socialmood)/searchbar'

function PantallaGestionRespuestasPage() {

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Controla la visibilidad del modal

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  const [selectedFilters, setSelectedFilters] = useState<{
    category: string[],
    subcategory: string[],
    ruleType: string[],
    alias: string[],
    social_medias: string[]
  }>({
    category: [],
    subcategory: [],
    ruleType: [],
    alias: [],
    social_medias: []
  });

  const onSaveFilters = (filter: any) => {
    setSelectedFilters(filter);
    console.log(filter);
  }

  const setAlias = (text: string) => {
    setSelectedFilters({ ...selectedFilters, alias: [text] });
    console.log(selectedFilters);
  }

  return (

    <div>
      <div className="space-y-4">
        <div className="flex space-x-4 mx-12">
          <SearchBar handleChange={setAlias} />

          <SocialButton
            customStyle="w-32"
            variant="default"
            defaultText="Filtros"
            type="button" // Cambiado a 'button' para evitar enviar un formulario
            onClick={openFilterModal}
          />
        </div>

        <ListadoRespuestasTable
          filter={selectedFilters}
        />

      </div>
      {
        isFilterModalOpen ?
          <FilterModal isOpen={isFilterModalOpen} onClose={closeFilterModal} onSave={onSaveFilters} /> :
          null
      }
    </div>


  )
}

export default PantallaGestionRespuestasPage