'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import BlurredContainer from "@/components/(socialmood)/blur-background";
import { ChevronLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { ChangePasswordForm } from '@/components/(backoffice)/change-password-form';
import Image from "next/image";

export default function EditUserPage() {

  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const userId = parseInt(params.userId, 10);

  // Función para regresar a la vista anterior
  const handleBack = () => {
    router.push('/bo/layout/user-table'); // Ajusta la ruta según tu aplicación
  };

  return (
    <div className="flex min-h-screen bg-white flex-grow">
      <div className="flex-1 p-20">
        <div className="flex">
          <ChevronLeft className="mr-2 h-10 w-10 cursor-pointer" onClick={handleBack} />
          <h1 className="text-3xl font-bold mb-2">Cambiar contraseña</h1>
        </div>
        <p className="text-gray-500 mb-6">Ingrese la nueva contraseña</p>

        <ChangePasswordForm
          userId={userId}
        />
      </div>
      {/* Lado Derecho */}
      <div className="flex-1 bg-backgroundPurple p-2 flex items-center justify-center">
        <BlurredContainer customStyle="h-[300px]"> <Image className="" src={"/socialmood-logo.svg"} width={400} height={70} alt={""} /></BlurredContainer>
      </div>
    </div>
  );
}

