"use client";
import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import UserForm from "@/components/(backoffice)/user-form";
import BlurredContainer from "@/components/(socialmood)/blur-background";

interface FormData {
  nombre: string;
  apellido: string;
  direccion: string;
  tipoUsuario: string;
  correo: string;
  password: string;
  confirmPassword: string;
}

export default function CreateSubPage() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    direccion: "",
    tipoUsuario: "1",
    correo: "",
    password: "",
    confirmPassword: ""
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
    <div className="flex min-h-screen bg-white">
      {/* Lado Izquierdo */}
      <div className="flex-1 p-20">
        <h1 className="text-3xl font-bold mb-2">Crear Usuario</h1>
        <p className="text-gray-500 mb-6">
          Ingrese los datos del usuario
        </p>
        <UserForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
      </div>

      {/* Lado Derecho */}
      <div className="flex-1 bg-backgroundPurple p-2 flex items-center justify-center">
        <BlurredContainer><div className="h-[500px]"></div></BlurredContainer>
      </div>

    </div>
  );
}
