import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Instagram, X } from "lucide-react";
import BlurredContainer from "@/components/(socialmood)/blur-background";


interface AddSocialFormProps {
  onClose: () => void; // Añadimos la función onClose como prop
}

export default function AddSocialForm({ onClose }: AddSocialFormProps) {
  const [selectedColor, setSelectedColor] = useState<string>('bg-yellow-500');

  const colors = [
    'bg-yellow-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-purple-500',
    'bg-blue-500'
  ];

  return (

    <div className='w-[60vh] flex items-center justify-center'>

    <BlurredContainer>

    
      <div className="p-6 relative">
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
          onClick={onClose} // Cerramos el modal al hacer clic en el botón X
        >
          <X className="h-6 w-6 text-white" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Agregar Red Social</h2>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm">Seleccionar plataforma</p>
            <Select>
              <SelectTrigger className="w-full px-3 py-2 
                    rounded-[12px] border-transparent
                    focus:outline-none focus:ring-2 focus:ring-primary
                    bg-[#FFFFFF] text-black">
                <SelectValue placeholder="Seleccionar plataforma">
                  <div className="flex items-center">
                    <Instagram className="mr-2 h-4 w-4" />
                    Instagram
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">
                  <div className="flex items-center">
                    <Instagram className="mr-2 h-4 w-4" />
                    Instagram
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="mb-2 text-sm">Elegir cuenta</p>
            <Select>
              <SelectTrigger className="w-full px-3 py-2 
                    rounded-[12px] border-transparent
                    focus:outline-none focus:ring-2 focus:ring-primary
                    bg-[#FFFFFF] text-black">
                <SelectValue placeholder="Elegir cuenta">@Paosq16</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paosq16">@Paosq16</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className=''>
            <p className="mb-4 text-sm">Personalizar color</p>
            <div className="flex space-x-2 px-12">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full ${color} ${selectedColor === color ? 'ring-2 ring-white' : ''}`}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
        </div>

        <hr className='mt-5 border-gray-300 border-solid'/>

        <div className="mt-6">
          <p className="text-xs text-gray-200 text-center mb-5">
            Usted será redirigido a la aplicación de la red social para autorizar el acceso a su cuenta de Instagram
          </p>
          <Button className={`w-full ${selectedColor} hover:opacity-90`}>
            Continuar
          </Button>
        </div>
      </div>

    </BlurredContainer>

    </div>
  );
}
