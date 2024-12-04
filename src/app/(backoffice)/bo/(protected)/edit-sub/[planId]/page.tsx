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

  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado de carga
  const [error, setError] = useState<string>(""); // Estado de error

  const router = useRouter();
  const params = useParams<{ planId: string }>();
  const planId = parseInt(params.planId);

  // Cargar los datos del plan al iniciar el componente
  useEffect(() => {
    const fetchPlanData = async () => {
      setIsLoading(true);
      try {
        const [plan] = await getPlanById(planId);
        if (plan) {
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
            descripcion: plan.descripcion || "",
          });
        } else {
          setError("Plan no encontrado");
        }
      } catch (error) {
        setError("Error al obtener los datos del plan");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (planId) {
      fetchPlanData();
    }
  }, [planId]);

  // Manejo del cambio de inputs
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Manejo del cambio de selects
  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Función para regresar a la vista anterior
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

        {/* Mostrar error si ocurre alguno */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Mostrar cargando si estamos esperando la respuesta */}
        {isLoading ? (
          <p>Cargando...</p>
        ) : (
          <FormularioSubscripcion
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            isForUpdate={true}
          />
        )}
      </div>

      <div className="flex-1 bg-backgroundPurple p-8 flex items-center justify-center">
        <VistaPreviaSubscripcion formData={formData} />
      </div>
    </div>
  );
}
