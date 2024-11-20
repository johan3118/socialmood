"use client";
import React, { useEffect, useState } from "react";
import { getInteractionsFiltered } from "@/app/actions/(socialmood)/get-interactions.actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Perfil {
  red_social: string;
  username: string;
  color: string;
}

interface Interacciones {
  perfil: Perfil;
  mensaje: string;
  emisor: string;
  categoria: string;
  subcategoria: string;
  fecha: string;
}

interface InteraccionesDashboardProps {
  filter: any;
}

const InteraccionesDashboard: React.FC<InteraccionesDashboardProps> = ({ filter = {} }) => {
  const [interacciones, setInteracciones] = useState<Interacciones[]>([]);

  const socialIconMap: { [key: string]: string } = {
    Instagram: "/instagram.svg",
    Facebook: "/facebook.svg",
    Twitter: "/twitter.svg",
  };

  useEffect(() => {
    const fetchInteracciones = async () => {
      try {
        const data = await getInteractionsFiltered(filter);
        console.log(data)
        setInteracciones(data);
      } catch (error) {
        console.error("Error al cargar las interacciones:", error);
      }
    };

    fetchInteracciones();
  }, [filter]);

  return (
    <div className="w-full bg-gradient-to-b from-white/20 via-white/10 to-white/5 text-white border border-white/30 rounded-[28px] p-10 h-[300px]">
      <div className="grid grid-cols-1 gap-4">
        {interacciones.slice(0, 3).map((interaccion, index) => (
          <div key={index} className="flex items-center space-x-4 rounded-lg mb-4">
            <span
              className={cn(
                buttonVariants({
                  variant:
                    interaccion.perfil.red_social === "Instagram"
                      ? "orange"
                      : interaccion.perfil.red_social === "Facebook"
                        ? "blue"
                        : "default",
                  size: "sm",
                })
              )}
            >
              <img
                src={socialIconMap[interaccion.perfil.red_social] || "/default.svg"}
                alt={`${interaccion.perfil.red_social} Icon`}
                className="w-5 h-5"
              />
              <span className="">{interaccion.perfil.username}</span>
            </span>
            <div className="flex-1">
              <p className="font-semibold text-md">{interaccion.mensaje}</p>
              <div className="flex items-center">
                <p className="font-medium text-sm text-gray-300 mr-4">{interaccion.fecha}</p>
                <span className="text-xs font-bold">@{interaccion.emisor}</span>

              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteraccionesDashboard;