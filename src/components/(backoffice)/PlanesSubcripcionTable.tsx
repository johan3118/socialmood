"use client";
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch"; // Importa el switch de shadcn
import { selectAllPlans } from "@/app/actions/(backoffice)/subscriptions.actions";

interface PlanSubscripcion {
  planId: string;
  planNombre: string;
  tipo_facturacion_nombre: string;
  costo: number;
  cantidad_interacciones_mes: number;
  cantidad_usuarios_permitidos: number;
  cantidad_cuentas_permitidas: number;
  estado_plan_nombre: string; // 'ACTIVO' o 'INACTIVO'
}

const PlanesSubscripcionTable: React.FC = () => {
  // Estado para manejar los planes obtenidos de la base de datos
  const [planesSubscripcion, setPlanesSubscripcion] = useState<PlanSubscripcion[]>([]);

  // Efecto para cargar los planes al montar el componente
  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const planes = await selectAllPlans(); // Llamada a la función para obtener todos los planes
        console.log(planes);
        setPlanesSubscripcion(planes);
      } catch (error) {
        console.error("Error al cargar los planes:", error);
      }
    };

    fetchPlanes();
  }, []);

  // Manejar el cambio de estado del switch
  const handleSwitchChange = (id: string) => {
    setPlanesSubscripcion((prevPlanesSubscripcion) =>
      prevPlanesSubscripcion.map((plan) =>
        plan.planId === id
          ? {
              ...plan,
              estado_plan_nombre:
                plan.estado_plan_nombre === "ACTIVO"
                  ? "INACTIVO"
                  : "ACTIVO", // Alterna entre 'ACTIVO' y 'INACTIVO'
            }
          : plan
      )
    );
  };

  return (
    <div className="container mx-auto p-6">
        <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Listado de subscripciones</h2>
      <button className="btn w-8 h-8 bg-[#D24EA6] rounded-lg">
        <span className="text-white text-2xl">+</span>
      </button>

        </div>
      
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#422EA3] text-white">
          <tr>
            <th className="py-3 px-4 text-left">Plan</th>
            <th className="py-3 px-4 text-left">Límite de usuarios</th>
            <th className="py-3 px-4 text-left">Redes sociales</th>
            <th className="py-3 px-4 text-left">Interacciones por mes</th>
            <th className="py-3 px-4 text-left">Estado</th>
            <th className="py-3 px-4 text-left">Precio</th>
            <th className="py-3 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {planesSubscripcion.map((plan) => (
            <tr key={plan.planId} className="border-t">
              <td className="py-3 px-4">{plan.planNombre}</td>
              <td className="py-3 px-4">{plan.cantidad_usuarios_permitidos}</td>
              <td className="py-3 px-4">{plan.cantidad_cuentas_permitidas}</td>
              <td className="py-3 px-4">{plan.cantidad_interacciones_mes}</td>
              <td className="py-3 px-4">
                <span
                  className={`${
                    plan.estado_plan_nombre === "ACTIVO"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  } py-1 px-3 rounded-full text-xs font-bold`}
                >
                  {plan.estado_plan_nombre}
                </span>
              </td>
              <td className="py-3 px-4 font-bold">{plan.costo}$/{plan.tipo_facturacion_nombre}</td>
              <td className="py-3 px-4 flex items-center">
                <Switch
                  className="data-[state=checked]:bg-[#422EA3]"
                  checked={plan.estado_plan_nombre === "ACTIVO"}
                  onCheckedChange={() => handleSwitchChange(plan.planId)}
                />
                {/* Icono de edición */}
                <button className="ml-4 text-gray-500 hover:text-gray-800">
                  ✏️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanesSubscripcionTable;
