"use client"
import React, { useState } from "react";
import ListadoRespuestasTable from '@/components/(socialmood)/listado-respuestas'
import FilterModal from '@/components/(socialmood)/filter-modal-interaction'
import SocialButton from '@/components/(socialmood)/social-button'
import { cn } from "@/lib/utils";


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

  const emojimap: Record<string, string> = {
    "Positivo": "/happy.svg",
    "Negativo": "/angry.svg",
    "Neutral": "/neutral-face.svg",
    "Queja": "/angry.svg",
    "Elogio": "/happy.svg",
    "Recomendación": "/happy.svg",
    "Consulta": "/neutral-face.svg",
    // categorías y subcategorias con sus respectivos emojis
  };

  return (

    <div>
      <div className="space-y-4">
        <div className="flex space-x-4 mx-12">
          <div className="w-full flex flex-wrap">
            {
              //filtros seleccionados

              selectedFilters.category.length > 0
                ? selectedFilters.category.map((category, index) => <span
                  className={cn(
                    "bg-[linear-gradient(108.65deg,_#F0F0F0_-86.91%,_rgba(255,255,255,0)_584.25%)] text-black shadow gap-1",
                    "flex items-center w-fit mr-2 mt-2",
                    "h-8 rounded-lg p-2 text-xs font-bold"
                  )}>
                  <input
                    type="checkbox"
                    checked={true}
                    className="form-checkbox text-blue-500 rounded-full"
                    disabled
                  />
                  {category}
                </span>)
                : null

            }

            {
              selectedFilters.subcategory.length > 0
                ? selectedFilters.subcategory.map((subcategory, index) => <span
                  className={cn(
                    "bg-[linear-gradient(108.65deg,_#F0F0F0_-86.91%,_rgba(255,255,255,0)_584.25%)] text-black shadow gap-1",
                    "flex items-center w-fit mr-2 mt-2",
                    "h-8 rounded-lg p-2 text-xs font-bold"
                  )}>
                  <input
                    type="checkbox"
                    checked={true}
                    className="form-checkbox text-pink-500 rounded-full"
                    disabled
                  />
                  {subcategory}
                </span>)
                : null

            }

            {
              selectedFilters.social_medias.length > 0
                ? selectedFilters.social_medias.map((social_media, index) => <span
                  className={cn(
                    "bg-[linear-gradient(108.65deg,_#F0F0F0_-86.91%,_rgba(255,255,255,0)_584.25%)] text-black shadow gap-1",
                    "flex items-center w-fit mr-2 mt-2",
                    "h-8 rounded-lg p-2 text-xs font-bold"
                  )}>
                  <input
                    type="checkbox"
                    checked={true}
                    className="form-checkbox text-orange-500 rounded-full"
                    disabled
                  />
                  {social_media}
                </span>)
                : null

            }


          </div>


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