"use client";
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch"; // Importa el switch de shadcn
import { selectAllPlans, activatePlan, deactivatePlan } from "@/app/actions/(backoffice)/subscriptions.actions";
import { useRouter } from "next/navigation";

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
  const [planesSubscripcion, setPlanesSubscripcion] = useState<PlanSubscripcion[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PlanSubscripcion; direction: "asc" | "desc" } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const planes = await selectAllPlans(); // Llamada a la función para obtener todos los planes
        setPlanesSubscripcion(planes);
      } catch (error) {
        console.error("Error al cargar los planes:", error);
      }
    };

    fetchPlanes();
  }, []);

  const handleSwitchChange = async (id: number, isActive: boolean) => {
    try {
      if (isActive) {
        await activatePlan(id);
      } else {
        await deactivatePlan(id);
      }

      setPlanesSubscripcion((prevPlanesSubscripcion) =>
        prevPlanesSubscripcion.map((plan) =>
          parseInt(plan.planId) === id
            ? { ...plan, estado_plan_nombre: isActive ? "ACTIVO" : "INACTIVO" }
            : plan
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado del plan:", error);
    }
  };

  const handleCrearSubscripcion = () => {
    router.push("/bo/create-sub");
  };

  const handleEditPlan = (planId: string) => {
    router.push(`/bo/edit-sub/${planId}`);
  };

  const handleSort = (key: keyof PlanSubscripcion) => {
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig?.key === key && prevSortConfig.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedPlanes = React.useMemo(() => {
    if (!sortConfig) return planesSubscripcion;

    return [...planesSubscripcion].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [planesSubscripcion, sortConfig]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Listado de subscripciones</h2>
        <button className="btn w-8 h-8 bg-[#D24EA6] rounded-lg" onClick={handleCrearSubscripcion}>
          <span className="text-white text-2xl">+</span>
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        <table className="min-w-full bg-white rounded-lg border-t table-auto">
          <thead className="bg-[#422EA3] text-white">
            <tr>
              {[
                { label: "Plan", key: "planNombre" },
                { label: "Límite de usuarios", key: "cantidad_usuarios_permitidos" },
                { label: "Redes sociales", key: "cantidad_cuentas_permitidas" },
                { label: "Interacciones por mes", key: "cantidad_interacciones_mes" },
                { label: "Estado", key: "estado_plan_nombre" },
                { label: "Precio", key: "costo" },
              ].map((header) => (
                <th
                  key={header.key}
                  className="py-3 px-4 text-center cursor-pointer"
                  onClick={() => handleSort(header.key as keyof PlanSubscripcion)}
                >
                  {header.label}
                  {sortConfig?.key === header.key && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
              <th className="py-3 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlanes.map((plan) => (
              <tr key={plan.planId}>
                <td className="py-6 px-4">{plan.planNombre}</td>
                <td className="py-3 px-4 text-center">{plan.cantidad_usuarios_permitidos}</td>
                <td className="py-3 px-4 text-center">{plan.cantidad_cuentas_permitidas}</td>
                <td className="py-3 px-4 text-center">{plan.cantidad_interacciones_mes}</td>
                <td className="py-3 px-4 text-center">
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
                <td className="py-3 px-4 font-bold text-center">{plan.costo}$/{plan.tipo_facturacion_nombre.toLowerCase()}</td>
                <td className="py-3 px-4 flex items-center">
                  <Switch
                    className="data-[state=checked]:bg-[#422EA3]"
                    checked={plan.estado_plan_nombre === "ACTIVO"}
                    onCheckedChange={(checked) => handleSwitchChange(parseInt(plan.planId), checked)}
                  />
                  <button
                    className="ml-4 text-gray-500 hover:text-gray-800"
                    onClick={() => handleEditPlan(plan.planId)}
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanesSubscripcionTable;
