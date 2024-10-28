"use client";
import React, { useEffect, useState } from "react";
import { getInteractions } from "@/app/actions/(socialmood)/get-interactions.actions";
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

const InteraccionesDashboard: React.FC = () => {
  const [interacciones, setInteracciones] = useState<Interacciones[]>([]);

  const socialIconMap: { [key: string]: string } = {
    Instagram: "/instagram.svg",
    Facebook: "/facebook.svg",
    Twitter: "/twitter.svg",
  };

  useEffect(() => {
    const fetchInteracciones = async () => {
      try {
        const data = await getInteractions();
        setInteracciones(data);
      } catch (error) {
        console.error("Error al cargar las interacciones:", error);
      }
    };

    fetchInteracciones();
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-white/20 via-white/10 to-white/5 text-white border border-white/30 rounded-[28px] p-6">
      <div className="grid grid-cols-1 gap-4 mt-4">
        {interacciones.slice(0, 3).map((interaccion, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg">
            <span
              className={cn(
                buttonVariants({
                  variant:
                    interaccion.perfil.red_social === "Instagram"
                      ? "orange"
                      : interaccion.perfil.red_social === "Facebook"
                      ? "blue"
                      : "default",
                  size: "smBold",
                })
              )}
            >
              <img
                src={socialIconMap[interaccion.perfil.red_social] || "/default.svg"}
                alt={`${interaccion.perfil.red_social} Icon`}
                className="w-5 h-5"
              />
              <span className="ml-2">{interaccion.perfil.username}</span>
            </span>
            <div className="flex-1">
              <p className="font-semibold">{interaccion.mensaje}</p>
              <p className="text-sm text-gray-300">{interaccion.fecha}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteraccionesDashboard;