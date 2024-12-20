"use client";

import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToastProvider, Toast, ToastViewport } from "@radix-ui/react-toast";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubscriptionFormSchema } from "@/types";
import { insertPlan, updatePlanById } from "@/app/actions/(backoffice)/subscriptions.actions";
import { createSubscriptionPlan, getAccessToken } from "@/app/services/paypal";

interface FormData {
  nombre: string;
  tipoFacturacion: string;
  precio: string;
  interacciones: string;
  redesSociales: string;
  usuarios: string;
  descripcion: string;
}

interface FormularioSubscripcionProps {
  formData: FormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: keyof FormData, value: string) => void;
  isForUpdate: boolean;
}

const FormularioSubscripcion: React.FC<FormularioSubscripcionProps> = ({ formData, handleInputChange, handleSelectChange, isForUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const params = useParams<{ planId: string }>();
  const planId = parseInt(params.planId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SubscriptionFormSchema),
    defaultValues: formData,
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (isForUpdate) {
        const idTipoFacturacion = data.tipoFacturacion === "MONTH" ? 1 : 2;

        await updatePlanById(planId, {
          nombre: data.nombre,
          costo: parseFloat(data.precio),
          cantidad_interacciones_mes: parseInt(data.interacciones),
          cantidad_usuarios_permitidos: parseInt(data.usuarios),
          cantidad_cuentas_permitidas: parseInt(data.redesSociales),
          descripcion: data.descripcion,
          id_tipo_facturacion: idTipoFacturacion,
        });

        setToastMessage("El plan de suscripción se ha actualizado correctamente.");
      } else {
        const accessToken = await getAccessToken();
        const planData = {
          product_id: "1725734723",
          name: data.nombre,
          description: data.descripcion,
          status: "INACTIVE",
          billing_cycles: [
            {
              frequency: {
                interval_unit: data.tipoFacturacion.toUpperCase(),
                interval_count: 1,
              },
              tenure_type: "REGULAR",
              sequence: 1,
              total_cycles: 0,
              pricing_scheme: {
                fixed_price: {
                  value: data.precio,
                  currency_code: "USD",
                },
              },
            },
          ],
          payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee_failure_action: "CONTINUE",
            payment_failure_threshold: 2,
          },
          links: [],
          usage_type: "",
          create_time: "",
          id: "",
        };

        const subscriptionPlan = await createSubscriptionPlan(accessToken, planData);

        await insertPlan({
          nombre: data.nombre,
          costo: parseFloat(data.precio),
          cantidad_interacciones_mes: parseInt(data.interacciones),
          cantidad_usuarios_permitidos: parseInt(data.usuarios),
          cantidad_cuentas_permitidas: parseInt(data.redesSociales),
          descripcion: data.descripcion,
          id_estado_plan: 2, // INACTIVE
          id_tipo_facturacion: data.tipoFacturacion === "MONTH" ? 1 : 2,
          paypal_plan_id: subscriptionPlan.id,
        });

        setToastMessage("El plan de suscripción se ha creado correctamente.");
      }
      setIsError(false);
      router.push("/bo/layout/sub-table");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido.";
      setToastMessage(`Ha ocurrido un error: ${errorMessage}`);
      setIsError(true);
    } finally {
      setToastOpen(true);
      setLoading(false);
    }
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            className="w-full px-3 py-2 rounded-[12px] border-transparent focus:outline-none focus:ring-2 focus:ring-primary bg-[#EBEBEB] text-black"
            {...register("nombre")}
            disabled={isForUpdate}
            onChange={handleInputChange}
          />
          {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <Label htmlFor="tipoFacturacion">Tipo de facturación</Label>
            <Select
              name="tipoFacturacion"
              value={formData.tipoFacturacion}
              onValueChange={(value) => handleSelectChange("tipoFacturacion", value)}
              disabled={isForUpdate}
            >
              <SelectTrigger className="bg-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MONTH">Mensual</SelectItem>
                <SelectItem value="YEAR">Anual</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipoFacturacion && <p className="text-red-500">{errors.tipoFacturacion.message}</p>}
          </div>
          <div className="flex-1">
            <Label htmlFor="precio">Precio</Label>
            <Input
              id="precio"
              className="w-full px-3 py-2 rounded-[12px] border-transparent focus:outline-none focus:ring-2 focus:ring-primary bg-[#EBEBEB] text-black"
              {...register("precio")}
              onChange={handleInputChange}
            />
            {errors.precio && <p className="text-red-500">{errors.precio.message}</p>}
          </div>
        </div>

        <hr className="border" />
        <p>Límites</p>

        <div>
          <Label htmlFor="interacciones">Cantidad de interacciones procesadas por hora</Label>
          <Input
            id="interacciones"
            className="w-full px-3 py-2 rounded-[12px] border-transparent focus:outline-none focus:ring-2 focus:ring-primary bg-[#EBEBEB] text-black"
            {...register("interacciones")}
            onChange={handleInputChange}
          />
          {errors.interacciones && <p className="text-red-500">{errors.interacciones.message}</p>}
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <Label htmlFor="redesSociales">Redes sociales asociadas</Label>
            <Input
              id="redesSociales"
              className="w-full px-3 py-2 rounded-[12px] border-transparent focus:outline-none focus:ring-2 focus:ring-primary bg-[#EBEBEB] text-black"
              {...register("redesSociales")}
              onChange={handleInputChange}
            />
            {errors.redesSociales && <p className="text-red-500">{errors.redesSociales.message}</p>}
          </div>
          <div className="flex-1">
            <Label htmlFor="usuarios">Usuarios asociados</Label>
            <Input
              id="usuarios"
              className="w-full px-3 py-2 rounded-[12px] border-transparent focus:outline-none focus:ring-2 focus:ring-primary bg-[#EBEBEB] text-black"
              {...register("usuarios")}
              onChange={handleInputChange}
            />
            {errors.usuarios && <p className="text-red-500">{errors.usuarios.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            className="w-full px-3 py-2 rounded-[12px] border-transparent focus:outline-none focus:ring-2 focus:ring-primary bg-[#EBEBEB] text-black"
            {...register("descripcion")}
            onChange={handleInputChange}
          />
          {errors.descripcion && <p className="text-red-500">{errors.descripcion.message}</p>}
        </div>

        <Button className="bg-[#D24EA6] w-1/3" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </form>

      <ToastProvider>
        <Toast
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`p-4 rounded-lg shadow-lg ${isError ? "bg-red-500" : "bg-green-500"} transition-opacity duration-300 ease-in-out text-white`}
        >
          <div className="flex items-center">
            <span className="font-bold">{isError ? "Error" : "Éxito"}:</span>
            <p className="ml-2">{toastMessage}</p>
          </div>
        </Toast>
        <ToastViewport className="fixed top-5 right-5 flex flex-col gap-2 p-6" />
      </ToastProvider>
    </>
  );
};

export default FormularioSubscripcion;

