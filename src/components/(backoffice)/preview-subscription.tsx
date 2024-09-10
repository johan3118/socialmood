"use client"
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface FormData {
  nombre: string;
  tipoFacturacion: string;
  precio: string;
  interacciones: string;
  redesSociales: string;
  usuarios: string;
  descripcion: string;
}

interface VistaPreviaSubscripcionProps {
  formData: FormData;
}

const VistaPreviaSubscripcion: React.FC<VistaPreviaSubscripcionProps> = ({ formData }) => {
  return (
    <Card className="w-[450px] bg-gray-400 rounded-3xl backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100 text-white p-6">
      <CardHeader className="flex flex-col items-center text-center">
        <Image src="/searchGraphic.svg" width={145} height={145} alt="Imagen" />
        <CardTitle className="text-2xl font-bold">{formData.nombre}</CardTitle>
        <CardDescription className="text-5xl text-white font-bold mt-2">
          ${formData.precio}
          <span className="text-lg font-normal">/ {formData.tipoFacturacion.toLowerCase()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <hr className="border-gray-500 border-solid mb-3" />
        <ul className="space-y-2">
          <li className="flex items-center">
            <svg className="w-5 mr-2 text-white bg-orange-500 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {formData.interacciones} interacciones procesadas por hora
          </li>
          <li className="flex items-center">
            <svg className="w-5 mr-2 text-white bg-orange-500 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Administra hasta {formData.redesSociales} redes sociales
          </li>
          <li className="flex items-center">
            <svg className="w-5 mr-2 text-white bg-orange-500 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Cantidad máxima de {formData.usuarios} usuario{formData.usuarios !== "1" ? "s" : ""}
          </li>
        </ul>
        <hr className="border-gray-500 border-solid mt-3" />
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Descripción</h3>
          <p className="text-sm text-white">{formData.descripcion}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VistaPreviaSubscripcion;
