"use client"
import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAccessToken, createSubscriptionPlan } from "@/app/services/paypal";
import { insertPlan } from "@/app/actions/(backoffice)/subscriptions.actions";
import * as Toast from '@radix-ui/react-toast';

interface FormData {
  nombre: string;
  apellido: string;
  direccion: string;
  tipoUsuario: string;
  correo: string;
  password: string;
  confirmPassword: string;
}

interface UserFormProps {
  formData: FormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: keyof FormData, value: string) => void;
}

const UserForm: React.FC<UserFormProps> = ({ formData, handleInputChange, handleSelectChange }) => {
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    try {
      /*
      const subscriptionPlan = await createSubscriptionPlan(accessToken, planData);
      console.log('Plan de suscripción creado:', subscriptionPlan);

      // Guardar el plan de suscripción en la base de datos
      const idTipoFacturacion: number = formData.tipoFacturacion === "MONTH" ? 1 : 0;

      await insertPlan({
        nombre: formData.nombre,
        costo: parseFloat(formData.precio),
        cantidad_interacciones_mes: parseInt(formData.interacciones),
        cantidad_usuarios_permitidos: parseInt(formData.usuarios),
        cantidad_cuentas_permitidas: parseInt(formData.redesSociales),
        descripcion: formData.descripcion,
        id_estado_plan: 0, // INACTIVE
        id_tipo_facturacion: idTipoFacturacion
      });
      */
      // Mostrar toast de éxito
      setToastMessage("El plan de suscripción se ha creado correctamente.");
      setToastOpen(true);

    } catch (error) {

      // Mostrar toast de error
      const errorMessage = error instanceof Error ? error.message : "Error desconocido.";
      console.error('Error al crear el plan de suscripción:', errorMessage);
      setToastMessage(`Ha ocurrido un error: ${errorMessage}`);
      setToastOpen(true);

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="space-y-6">
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" className="w-full px-3 py-2 
                            rounded-[12px] border-transparent
                            focus:outline-none focus:ring-2 focus:ring-primary
                            bg-[#EBEBEB] text-black " value={formData.nombre} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="apellido">Apellido</Label>
          <Input id="apellido" name="apellido" className="w-full px-3 py-2 
                            rounded-[12px] border-transparent
                            focus:outline-none focus:ring-2 focus:ring-primary
                            bg-[#EBEBEB] text-black " value={formData.apellido} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="direccion">Direccion</Label>
          <Input id="direccion" name="direccion" className="w-full px-3 py-2 
                            rounded-[12px] border-transparent
                            focus:outline-none focus:ring-2 focus:ring-primary
                            bg-[#EBEBEB] text-black " value={formData.direccion} onChange={handleInputChange} />
        </div>
        <div className="flex-1">
          <Label htmlFor="tipoUsuario">Tipo de Usuario</Label>
          <Select name="tipoUsuario" value={formData.tipoUsuario} onValueChange={(value) => handleSelectChange("tipoUsuario", value)}>
            <SelectTrigger className="bg-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Gestor de comunidad</SelectItem>
              <SelectItem value="2">Gestor de operaciones</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="correo">Correo electrónico</Label>
          <Input id="correo" name="correo" className="w-full px-3 py-2 
                            rounded-[12px] border-transparent
                            focus:outline-none focus:ring-2 focus:ring-primary
                            bg-[#EBEBEB] text-black " value={formData.correo} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" className="w-full px-3 py-2 
                            rounded-[12px] border-transparent
                            focus:outline-none focus:ring-2 focus:ring-primary
                            bg-[#EBEBEB] text-black " type="password"
            value={formData.password} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Input id="confirmPassword" name="confirmPassword" className="w-full px-3 py-2 
                            rounded-[12px] border-transparent
                            focus:outline-none focus:ring-2 focus:ring-primary
                            bg-[#EBEBEB] text-black " type="password"
            value={formData.confirmPassword} onChange={handleInputChange} />
        </div>
        <Button className="bg-[#D24EA6] w-1/3" onClick={handleSave} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </form>

      <Toast.Provider>
        <Toast.Root open={toastOpen} onOpenChange={setToastOpen}>
          <Toast.Title>{toastMessage}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </>
  );
};

export default UserForm;