"use client";
import React, { useState } from "react";
import SocialButton from "./social-button";

export default function FilterModal({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (filter: any ) => void }) {
  const [selectedFilters, setSelectedFilters] = useState<{
    category: string[];
    subcategory: string[];
    network: string[];
    ruleType: string[];
  }>({
    category: [],
    subcategory: [],
    network: [],
    ruleType: [],
  });

  if (!isOpen) return null;

  const onSaveFilters = () => { 
    onSave(selectedFilters);
    onClose();
  }

  const handleCheckboxChange = (type: string, value: string) => {
    setSelectedFilters((prevState) => {
      const updatedFilters = prevState[type as keyof typeof prevState].includes(value)
        ? prevState[type as keyof typeof prevState].filter((item: string) => item !== value)
        : [...prevState[type as keyof typeof prevState], value];

      return {
        ...prevState,
        [type]: updatedFilters,
      };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-white/10 backdrop-blur-lg p-12 rounded-xl shadow-lg m-40 w-full text-white relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-6 text-white text-lg font-bold"
        >
        <img src="/delete.svg" alt="Close" className="w-6 h-6" />

        </button>
        <h2 className="text-2xl font-bold mb-4">Filtrar por</h2>

        {/* Categoría */}
        <div className="mb-4">
          <h3 className="block text-lg font-medium">Categoría:</h3>
          <hr className="border-[#FFF] my-4" />
          <div className="flex space-x-4">
            {["Positivo", "Negativo", "Neutral"].map((category) => (
              <label key={category} className="flex items-center space-x-2 text-black font-medium space-x-2 bg-white py-2 px-4 rounded-full">
                <input
                  type="checkbox"
                  checked={selectedFilters.category.includes(category)}
                  onChange={() => handleCheckboxChange("category", category)}
                  className="form-checkbox text-pink-500 rounded-full"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Subcategoría */}
        <div className="mb-4">
          <h3 className="block text-lg font-medium">Subcategoría:</h3>
          <hr className="border-[#FFF] my-4" />
          <div className="flex space-x-4">
            {["Consulta", "Queja", "Elogio", "Sugerencia"].map((subcategory) => (
              <label key={subcategory} className="flex items-center space-x-2 text-black font-medium space-x-2 bg-white py-2 px-4 rounded-full">
                <input
                  type="checkbox"
                  checked={selectedFilters.subcategory.includes(subcategory)}
                  onChange={() => handleCheckboxChange("subcategory", subcategory)}
                  className="form-checkbox text-orange-500 rounded-full"
                />
                
                <span>{subcategory}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Red Social */}
        <div className="mb-4">
          <h3 className="block text-lg font-medium">Red Social:</h3>
          <hr className="border-[#FFF] my-4" />
          <div className="flex space-x-4">
            {["Instagram", "Facebook"].map((network) => (
              <label key={network} className="flex items-center space-x-2 text-black font-medium space-x-2 bg-white py-2 px-4 rounded-full">
                <input
                  type="checkbox"
                  checked={selectedFilters.network.includes(network)}
                  onChange={() => handleCheckboxChange("network", network)}
                  className="form-checkbox text-orange-500 rounded-full"
                />
                <span>{network}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tipo de Regla */}
        <div className="mb-4">
          <h3 className="block text-lg font-medium">Tipo de Regla:</h3>
          <hr className="border-[#FFF] my-4" />
          <div className="flex space-x-4">
            {["Padre", "Hijo"].map((ruleType) => (
              <label key={ruleType} className="flex items-center text-black font-medium space-x-2 bg-white py-2 px-4 rounded-full">
                <input
                  type="checkbox"
                  checked={selectedFilters.ruleType.includes(ruleType)}
                  onChange={() => handleCheckboxChange("ruleType", ruleType)}
                  className="form-checkbox  text-orange-500 rounded-full"
                />
                <span>{ruleType}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Botón Aplicar Filtros */}
        <div className="flex justify-end">
        <SocialButton
        onClick={onSaveFilters} 
        customStyle="w-32"
        variant="default"
        defaultText="Aplicar filtros"
        />
        </div>
      </div>
    </div>
  );
}