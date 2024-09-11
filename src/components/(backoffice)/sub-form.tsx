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
import { useRouter } from "next/navigation";

interface FormData {
  nombre: string;
  tipoFacturacion: string;
  precio: string;
  interacciones: string;
  redesSociales: string;
  usuarios: string;
  descripcion: string;
}

interface SubscriptionPlan {
  id: string;
  product_id: string;
  name: string;
  status: string;
  description: string;
  usage_type: string;
  create_time: string;
  links: Array<{
      href: string;
      rel: string;
      method: string;
      encType: string;
  }>;
  payment_preferences: {
      auto_bill_outstanding: boolean;
      setup_fee_failure_action: string;
      payment_failure_threshold: number;
  };
}

interface FormularioSubscripcionProps {
  formData: FormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: keyof FormData, value: string) => void;
}

const FormularioSubscripcion: React.FC<FormularioSubscripcionProps> = ({ formData, handleInputChange, handleSelectChange }) => {
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    try {
      // Crear subscripción en PayPal
      const accessToken: string = await getAccessToken();
      
      const planData = {
        product_id: "1725734723", // Usa el ID del producto adecuado
        name: formData.nombre,
        description: formData.descripcion,
        status: "INACTIVE",
        billing_cycles: [
          {
            frequency: {
              interval_unit: formData.tipoFacturacion.toUpperCase(), // DAY WEEK MONTH YEAR
              interval_count: 1
            },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 0,
            pricing_scheme: {
              fixed_price: {
                value: formData.precio,
                currency_code: "USD"
              }
            }
          }
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee_failure_action: "CONTINUE",
          payment_failure_threshold: 2
        }
      };

      const subscriptionPlan: SubscriptionPlan = await createSubscriptionPlan(accessToken, planData);
      console.log('Plan de suscripción creado:', subscriptionPlan);

      // Guardar el plan de suscripción en la base de datos
      const idTipoFacturacion: number = formData.tipoFacturacion === "MONTH" ? 1 : 2;

      await insertPlan({
        nombre: formData.nombre,
        costo: parseFloat(formData.precio),
        cantidad_interacciones_mes: parseInt(formData.interacciones),
        cantidad_usuarios_permitidos: parseInt(formData.usuarios),
        cantidad_cuentas_permitidas: parseInt(formData.redesSociales),
        descripcion: formData.descripcion,
        id_estado_plan: 2, // INACTIVE
        id_tipo_facturacion: idTipoFacturacion,
        paypal_plan_id: subscriptionPlan.id,
      });

      // Mostrar toast de éxito
      setToastMessage("El plan de suscripción se ha creado correctamente.");
      setToastOpen(true);

      setTimeout(() =>{
        router.push("/bo/sub-table")
      }, 2000)



    } catch (error) {

      // Mostrar toast de error
      const errorMessage = error instanceof Error ? error.message : "Error desconocido.";
      console.error('Error al crear el plan de suscripción:', errorMessage);
      setToastMessage(`Ha ocurrido un error: ${errorMessage}`);
      setIsError(true);
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
        <div className="flex space-x-4">
          <div className="flex-1">
            <Label htmlFor="tipoFacturacion">Tipo de facturación</Label>
            <Select name="tipoFacturacion" value={formData.tipoFacturacion} onValueChange={(value) => handleSelectChange("tipoFacturacion", value)}>
              <SelectTrigger className="bg-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MONTH">Mensual</SelectItem>
                <SelectItem value="YEAR">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="precio">Precio</Label>
            <Input className="w-full px-3 py-2 
                    rounded-[12px] border-transparent
                    focus:outline-none focus:ring-2 focus:ring-primary
                    bg-[#EBEBEB] text-black " id="precio" name="precio" value={formData.precio} onChange={handleInputChange} />
          </div>
        </div>

        <hr className="border" />
        <p>Límites</p>

        <div>
          <Label htmlFor="interacciones">Cantidad de interacciones procesadas por hora</Label>
          <Input className="w-full px-3 py-2 
                    rounded-[12px] border-transparent
                    focus:outline-none focus:ring-2 focus:ring-primary
                    bg-[#EBEBEB] text-black " id="interacciones" name="interacciones" value={formData.interacciones} onChange={handleInputChange} />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <Label htmlFor="redesSociales">Redes sociales asociadas</Label>
            <Input className="w-full px-3 py-2 
                    rounded-[12px] border-transparent
                    focus:outline-none focus:ring-2 focus:ring-primary
                    bg-[#EBEBEB] text-black " id="redesSociales" name="redesSociales" value={formData.redesSociales} onChange={handleInputChange} />
          </div>
          <div className="flex-1">
            <Label htmlFor="usuarios">Usuarios asociados</Label>
            <Input className="w-full px-3 py-2 
                    rounded-[12px] border-transparent
                    focus:outline-none focus:ring-2 focus:ring-primary
                    bg-[#EBEBEB] text-black " id="usuarios" name="usuarios" value={formData.usuarios} onChange={handleInputChange} />
          </div>
        </div>
        <div>
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea className="w-full px-3 py-2 
                    rounded-[12px] border-transparent
                    focus:outline-none focus:ring-2 focus:ring-primary
                    bg-[#EBEBEB] text-black " id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleInputChange} />
        </div>
        <Button className="bg-[#D24EA6] w-1/3" onClick={handleSave} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </form>

      <Toast.Provider>
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`p-4 rounded-lg shadow-lg ${
            isError ? "bg-red-500" : "bg-green-500"
          } transition-opacity duration-300 ease-in-out text-white`}
        >
          <div className="flex items-center">
            <span className="font-bold">{isError ? "Error" : "Éxito"}:</span>
            <Toast.Title className="ml-2">{toastMessage}</Toast.Title>
          </div>
        </Toast.Root>
        <Toast.Viewport className="fixed top-5 right-5 flex flex-col gap-2 p-6" />
      </Toast.Provider>
    </>
  );
};

export default FormularioSubscripcion;