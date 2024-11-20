"use client";
import React, { useState, useEffect } from "react";
import SocialButton from "./social-button";
import { getSocialMediaNameSubscription } from "@/app/actions/(socialmood)/auth.actions"

export default function FilterModal({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (filter: any) => void }) {

  const [socialMedias, setSocialMedias] = useState<string[]>([]);

  const [selectedFilters, setSelectedFilters] = useState<{
    social_medias: string[];
  }>({
    social_medias: [],
  });


  const onSaveFilters = () => {
    onSave(selectedFilters);
    onClose();
  }

  const fetchSocialMedias = async () => {
    try {
      const socialMedias = await getSocialMediaNameSubscription();
      setSocialMedias(socialMedias);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchSocialMedias();
  }, []);

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

        {/* Social Medias */}
        <div className="mb-4">
          <h3 className="block text-lg font-medium">Cuentas de redes sociales:</h3>
          <hr className="border-[#FFF] my-4" />
          <div className="flex space-x-4">
            {socialMedias.map((social) => (
              <label key={social} className="flex items-center space-x-2 text-black font-medium space-x-2 bg-white py-2 px-4 rounded-full">
                <input
                  type="checkbox"
                  checked={selectedFilters.social_medias.includes(social)}
                  onChange={() => handleCheckboxChange("social_medias", social)}
                  className="form-checkbox text-pink-500 rounded-full"
                />
                <span>{social}</span>
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