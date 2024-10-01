"use client"; // Asegúrate de tener esto al principio del archivo si estás usando Next.js

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import ListadoInteraccionesTable from '@/components/(socialmood)/listado-interacciones-table';
import SearchBar from '@/components/(socialmood)/searchbar';
import SocialButton from '@/components/(socialmood)/social-button';
import FilterModal from "@/components/(socialmood)/filter-modal";


//codigo que deberia estar en todas las pages que necesiten el boton de filtros

function ListadoInteraccionesPage() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Controla la visibilidad del modal
  const router = useRouter();

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  return (
    <div className="flex-items">
      <SearchBar />
      <SocialButton
        customStyle="w-32"
        variant="default"
        defaultText="Filtros"
        type="button" // Cambiado a 'button' para evitar enviar un formulario
        onClick={openFilterModal} 
      />
      <ListadoInteraccionesTable />
      <FilterModal isOpen={isFilterModalOpen} onClose={closeFilterModal} />
    </div>
  );
}

export default ListadoInteraccionesPage;