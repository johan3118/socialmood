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
    
    <div>
        <SearchBar />

        <SocialButton
        customStyle="w-32"
        variant="default"
        defaultText="Filtros"
        type="button" // Cambiado a 'button' para evitar enviar un formulario
        onClick={openFilterModal} 
      />
        <FilterModal isOpen={isFilterModalOpen} onClose={closeFilterModal} onSave={onSaveFilters} />
        <ListadoReglasTable
        filter={selectedFilters}
        />
    </div>
  )
}

export default PantallaGestionReglasPage