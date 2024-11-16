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
    <div className="w-full bg-gradient-to-b from-white/20 via-white/10 to-white/5 text-white border border-white/30 rounded-[28px] p-10">
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
              <p className="font-semibold text-lg">{interaccion.mensaje}</p>
              <p className="font-semibold text-sm text-gray-300">{interaccion.fecha} <span className="text-xs">@{interaccion.emisor}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteraccionesDashboard;