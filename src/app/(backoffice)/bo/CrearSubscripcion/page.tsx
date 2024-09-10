"use client";
import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import FormularioSubscripcion from "@/components/(backoffice)/FormularioSubscripcion";
import VistaPreviaSubscripcion from "@/components/(backoffice)/VistaPreviaSubscripcion";

interface FormData {
  nombre: string;
  tipoFacturacion: string;
  precio: string;
  interacciones: string;
  redesSociales: string;
  usuarios: string;
  descripcion: string;
}

export default function CrearSubscripcionPage() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "Plan Básico",
    tipoFacturacion: "Mensual",
    precio: "25",
    interacciones: "500",
    redesSociales: "3",
    usuarios: "1",
    descripcion:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado Izquierdo */}
      <div className="flex-1 p-20">
        <Button className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold mb-2">Crear Subscripción</h1>
        <p className="text-gray-500 mb-6">
          Ingrese los datos del plan de subscripción
        </p>
        <FormularioSubscripcion
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
      </div>

      {/* Lado Derecho */}
      <div className="flex-1 bg-backgroundPurple p-8 flex items-center justify-center">
        <VistaPreviaSubscripcion formData={formData} />
      </div>
    </div>
  );
}
