"use client"
import React, { useState, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, BarChart2 } from 'lucide-react'
import Image from 'next/image'
import {cn} from "@/lib/utils"

interface FormData {
  nombre: string;
  tipoFacturacion: string;
  precio: string;
  interacciones: string;
  redesSociales: string;
  usuarios: string;
  descripcion: string;
}

export default function Component() {
  const [formData, setFormData] = useState<FormData>({
    nombre: 'Plan Básico',
    tipoFacturacion: 'Mensual',
    precio: '25',
    interacciones: '500',
    redesSociales: '3',
    usuarios: '1',
    descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.'
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  return (
    <div className="flex min-h-screen">

    {/* Lado Izquierdo */}
      <div className="flex-1 p-20">
        <Button variant="ghost" className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold mb-2">Crear Subscripción</h1>
        <p className="text-gray-500 mb-6">Ingrese los datos del plan de subscripción</p>
        <form className="space-y-6">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" name="nombre" className="bg-gray-100" value={formData.nombre} onChange={handleInputChange} />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="tipoFacturacion">Tipo de facturación</Label>
              <Select name="tipoFacturacion" value={formData.tipoFacturacion} onValueChange={(value) => handleSelectChange('tipoFacturacion', value)}>
                <SelectTrigger className="bg-gray-100">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mensual">Mensual</SelectItem>
                  <SelectItem value="Anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="precio">Precio</Label>
              <Input className="bg-gray-100" id="precio" name="precio" value={formData.precio} onChange={handleInputChange} />
            </div>
          </div>

          <hr className='border'/>
          <p>Límites</p>

          <div>
            <Label htmlFor="interacciones">Cantidad de interacciones procesadas por hora</Label>
            <Input className="bg-gray-100" id="interacciones" name="interacciones" value={formData.interacciones} onChange={handleInputChange} />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="redesSociales">Redes sociales asociadas</Label>
              <Input className="bg-gray-100" id="redesSociales" name="redesSociales" value={formData.redesSociales} onChange={handleInputChange} />
            </div>
            <div className="flex-1">
              <Label htmlFor="usuarios">Usuarios asociados</Label>
              <Input className="bg-gray-100" id="usuarios" name="usuarios" value={formData.usuarios} onChange={handleInputChange} />
            </div>
          </div>
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea className="bg-gray-100 h-32" id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleInputChange} />
          </div>
          <Button className="bg-[#D24EA6] w-1/3">Guardar</Button>
        </form>
      </div>

      {/* Lado Derecho */}
      <div className="flex-1 bg-backgroundPurple p-8 flex items-center justify-center">
        <Card className="w-[450px] bg-gray-400 rounded-3xl ackdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100 text-white p-6">
          <CardHeader className="flex flex-col items-center text-center">
            <Image src="/searchGraphic.svg" width={145} height={145} alt="Imagen" />
            <CardTitle className="text-2xl font-bold">{formData.nombre}</CardTitle>
            <CardDescription className="text-5xl text-white font-bold mt-2">
              ${formData.precio}
              <span className="text-lg font-normal">/ {formData.tipoFacturacion.toLowerCase()}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
 
            <hr className='border-gray-500 border-solid mb-3'/>

            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="w-5 mr-2 text-white bg-orange-500 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                {formData.interacciones} interacciones procesadas por hora
              </li>
              <li className="flex items-center">
                <svg className="w-5 mr-2 text-white bg-orange-500 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Administra hasta {formData.redesSociales} redes sociales
              </li>
              <li className="flex items-center">
                <svg className="w-5 mr-2 text-white bg-orange-500 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Cantidad máxima de {formData.usuarios} usuario{formData.usuarios !== '1' ? 's' : ''}
              </li>
            </ul>

            <hr className='border-gray-500 border-solid mt-3'/>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-sm text-white">{formData.descripcion}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
