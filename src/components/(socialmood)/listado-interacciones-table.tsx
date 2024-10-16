"use client"
import React, { useEffect, useState } from "react";
import { getInteractions } from "@/app/actions/(socialmood)/get-interactions.actions";
import { useRouter } from 'next/navigation';
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

const ListadoInteraccionesTable: React.FC = () => {
  // Estado para manejar los planes obtenidos de la base de datos
  const [Interacciones, setInteracciones] = useState<Interacciones[]>([]);
  const router = useRouter();


  const socialIconMap: { [key: string]: string } = {
    Instagram: "/instagram.svg",
    Facebook: "/facebook.svg",
    Twitter: "/twitter.svg",
  };

  const emojimap: Record<string, string> = {
    "Positivo": "/happy.svg",
    "Negativo": "/angry.svg",
    "Neutral": "/neutral-face.svg",
    "Queja": "/angry.svg",
    "Elogio": "/happy.svg",
    "Recomendacion": "/happy.svg",
    "Consulta": "/neutral-face.svg",
    // categorías y subcategorias con sus respectivos emojis
  };


  const fetchInteracciones = async () => {
    try {
      const interacciones = await getInteractions(); // Llamada a la función para obtener todos las interacciones de la subscripcion
      setInteracciones(interacciones);
    } catch (error) {
      console.error("Error al cargar las interacciones:", error);
    }
  };

  // Llamar fetchPlanes al montar el componente
  useEffect(() => {
    fetchInteracciones();
  }, []);


  const handleRefreshTable = () => {
    fetchInteracciones();

  };



  return (
    <div className="bg-gradient-to-b from-white/20 via-white/10 to-white/5 text-white border border-white/30 rounded-[32px] px-4 mx-10 py-8">
      <div className="container mx-auto p-6 ">
        <div className="flex justify-between mb-6">
          <h1 className="text-[24px] text-white font-bold">Interacciones Capturadas</h1>

          <button
            className="btn w-8 h-8 bg-[#FFF] rounded-[12px] flex items-center justify-center"
            onClick={handleRefreshTable}
          >
            <img
              src="/refresh.svg"
              alt="Refresh"
              className=" w-6 h-6"
            />
          </button>
        </div>
        <hr className="border-[#FFF] mb-6" />
        <div className="max-h-80 overflow-y-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-[14px] md:text-[16px] lg:text-[18px]">
                <th className="py-3 md:py-4 px-2 md:px-6 lg:px-10 text-left">Perfil</th>
                <th className="py-3 md:py-4 px-2 md:px-6 lg:px-10 text-left">Mensaje</th>
                <th className="py-3 md:py-4 px-2 md:px-6 lg:px-10 text-left">Emisor</th>
                <th className="hidden sm:table-cell py-3 md:py-4 px-2 md:px-6 lg:px-10 text-left ">Categoría</th>
                <th className="hidden sm:table-cell py-3 md:py-4 px-2 md:px-6 lg:px-10 text-left">Subcategoría</th>
                <th className="py-3 md:py-4 px-2 md:px-6 lg:px-10 text-left">Fecha</th>
              </tr>
            </thead>

            <tbody>
              {Interacciones.map((interacciones, index) => (
                <tr key={index}>
                  <td className="py-3 md:py-4 px-4 md:px-8">
                    <div className="flex justify-center items-center space-x-2 w-full">
                      <span
                        className={cn(
                          buttonVariants({
                            variant: interacciones.perfil.red_social === "Instagram" ? "orange" : interacciones.perfil.red_social === "Facebook" ? "blue" : "default",
                            size: "smBold",
                          }),
                          "flex items-center w-full py-2"
                        )}                      >
                        <img
                          src={socialIconMap[interacciones.perfil.red_social] || "/default.svg"}
                          alt={`${interacciones.perfil.red_social} Icon`}
                          className="w-5 h-5"
                        />
                        
            <span className="text-left">{interacciones.perfil.username}</span>
            </span>
                    </div>
                  </td>
                  <td className="py-2 md:py-3 px-2 md:px-4 lg:px-8">{interacciones.mensaje}</td>
                  <td className="py-2 md:py-3 px-2 md:px-4 lg:px-8">{interacciones.emisor}</td>
                  <td className="hidden sm:table-cell py-2 md:py-3 px-2 md:px-4 lg:px-8">
                    <div className="flex items-center space-x-2">
                      <span
                        className={cn(buttonVariants({ variant: "angry", size: "smBold" }))}
                        style={{ width: "100%", justifyContent: "center" }}
                      >
                        <img
                          src={emojimap[interacciones.categoria] || "/default.svg"}
                          alt="Emoji Icon"
                          className="w-6 md:w-8 h-6 md:h-8 ml-2"
                        />
                        {interacciones.categoria}
                      </span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell py-3 px-4 md:px-8 font-bold text-left ">
                    <div className="flex items-center justify-center space-x-2">
                      <span
                        className={cn(buttonVariants({ variant: "angry", size: "smBold" }))}
                        style={{ width: "80%", justifyContent: "center" }}
                      >
                        <img
                          src={emojimap[interacciones.subcategoria] || "/default.svg"}
                          alt="Emoji Icon"
                          className="w-6 md:w-8 h-6 md:h-8 ml-2"
                        />
                        {interacciones.subcategoria}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 md:py-3 px-2 md:px-4 lg:px-8">{interacciones.fecha}</td>
                </tr>
              ))}

            </tbody>
          </table>

        </div>

      </div>
    </div>
  );
};

export default ListadoInteraccionesTable;