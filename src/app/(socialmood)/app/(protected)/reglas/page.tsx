"use client"
import React, { useState } from "react";
import ListadoReglasTable from '@/components/(socialmood)/listado-reglas'
import FilterModal from '@/components/(socialmood)/filter-modal'
import SocialButton from '@/components/(socialmood)/social-button'
import SearchBar from '@/components/(socialmood)/searchbar'

function PantallaGestionReglasPage() {

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Controla la visibilidad del modal

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  const [selectedFilters, setSelectedFilters] = useState<{
    category: string[],
    subcategory: string[],
    network: string[],
    ruleType: string[],
    alias: string[]
  }>({
    category: [],
    subcategory: [],
    network: [],
    ruleType: [],
    alias: []
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

        <ListadoReglasTable
          filter={selectedFilters}
        />
      </div>

      <FilterModal isOpen={isFilterModalOpen} onClose={closeFilterModal} onSave={onSaveFilters} />

    </div>
  )
}

export default PantallaGestionReglasPage