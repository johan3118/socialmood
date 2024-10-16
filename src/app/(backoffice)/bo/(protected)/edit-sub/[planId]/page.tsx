"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import FormularioSubscripcion from "@/components/(backoffice)/sub-form";
import VistaPreviaSubscripcion from "@/components/(backoffice)/preview-subscription";
import { useRouter, useParams } from "next/navigation";
import { getPlanById, updatePlanById } from "@/app/actions/(backoffice)/subscriptions.actions";

interface FormData {
  nombre: string;
  tipoFacturacion: string;
  precio: string;
  interacciones: string;
  redesSociales: string;
  usuarios: string;
  descripcion: string;
}

export default function EditSubPage() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    tipoFacturacion: "MONTH",
    precio: "",
    interacciones: "",
    redesSociales: "",
    usuarios: "",
    descripcion: "",
  });

  const router = useRouter();
  const params = useParams<{ planId: string }>();
  const planId = parseInt(params.planId);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const [plan] = await getPlanById(planId);
        console.log("Plan data:", plan); 
;// Asegúrate de que los datos del plan se están obteniendo correctamente

        setFormData({
          nombre: plan.planNombre || "",
          tipoFacturacion: plan.tipo_facturacion_nombre === "MENSUAL" ? "MONTH" : "YEAR",
          precio: plan.costo ? plan.costo.toString() : "",
          interacciones: plan.cantidad_interacciones_mes
            ? plan.cantidad_interacciones_mes.toString()
            : "",
          redesSociales: plan.cantidad_cuentas_permitidas
            ? plan.cantidad_cuentas_permitidas.toString()
            : "",
          usuarios: plan.cantidad_usuarios_permitidos
            ? plan.cantidad_usuarios_permitidos.toString()
            : "",
          descripcion: plan.descripcion ? plan.descripcion.toString() : "",
        });
      } catch (error) {
        console.error("Error al obtener los datos del plan:", error);
      }
    };

    fetchPlanData();
  }, [planId]);

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

  const handleBack = () => {
    router.push("/bo/layout/sub-table");
  };

  return (
    <div className="flex min-h-screen bg-white flex-grow">
      <div className="flex-1 p-20">
        <div className="flex">
          <ChevronLeft className="mr-2 h-10 w-10" onClick={handleBack} />
          <h1 className="text-3xl font-bold mb-2">Editar Plan Subscripción</h1>
        </div>

        <p className="text-gray-500 mb-6">
          Ingrese los datos a editar del plan de subscripción
        </p>

        {/* Asegúrate de que los datos están siendo pasados correctamente */}
        <FormularioSubscripcion
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          isForUpdate={true}
        />
      </div>

      <div className="flex-1 bg-backgroundPurple p-8 flex items-center justify-center">
        <VistaPreviaSubscripcion formData={formData} />
      </div>
    </div>
  );
}
