"use client"; // Asegúrate de tener esto al principio del archivo si estás usando Next.js

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import ListadoInteraccionesTable from '@/components/(socialmood)/listado-interacciones-table';
import SearchBar from '@/components/(socialmood)/searchbar';
import SocialButton from '@/components/(socialmood)/social-button';
import FilterModal from "@/components/(socialmood)/filter-modal";


//codigo que deberia estar en todas las pages que necesiten el boton de filtros

function ListadoInteraccionesPage() {
  const router = useRouter();

  return (
    <div className="flex-items">

      <ListadoInteraccionesTable />
    </div>
  );
}

export default ListadoInteraccionesPage;