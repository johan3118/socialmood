"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import BlurredContainer from "@/components/(socialmood)/blur-background";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Importación de la función 'cn'
import EstadoLabel from "@/components/(socialmood)/estado-label";
import Modal from "@/components/(socialmood)/modal"; // Componente modal
import AddSocialForm from "@/components/(socialmood)/add-social-form"; // El componente que quieres mostrar en el modal

interface Perfil {
  red_social: string;
  username: string;
  color: string;
  estado: "ACTIVO" | "INACTIVO";
}

interface SocialMediaCardProps {
  perfiles: Perfil[];
}

const socialIconMap: { [key: string]: string } = {
  Instagram: "/instagram.svg",
  Facebook: "/facebook.svg",
  Twitter: "/twitter.svg",
};

const SocialMediaCard: React.FC<SocialMediaCardProps> = ({ perfiles }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <>
      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <AddSocialForm onClose={toggleModal}/>
        </Modal>
      )}
      <BlurredContainer customStyle='h-[30vh] max-w-[56vh]'>
        <div className='flex items-center justify-between w-full mb-3'>
          <h2 className='text-2xl font-bold'>Redes Sociales</h2>
          <div className='options flex items-center'>
            <button
              className='w-6 h-6 bg-[#D24EA6] text-2xl rounded-xl flex items-center justify-center'
              onClick={toggleModal}
            >
              +
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead className="text-left">
            <tr>
              <th className="pb-2">Cuentas</th>
              <th className="pb-2 px-5">Estado</th>
              <th> </th>
            </tr>
          </thead>

          <tbody>
            {perfiles.map((perfil, index) => (
              <tr key={index}>
                <td className="pr-15 pb-2">
                  <span
                    className={cn(buttonVariants({
                      variant:
                        perfil.red_social === "Instagram"
                          ? "blue"
                          : perfil.red_social === "Facebook"
                            ? "orange"
                            : "default",
                      size: "smBold"
                    }), "w-full flex justify-start items-center py-2")}
                  >
                    <img
                      src={socialIconMap[perfil.red_social] || "/default.svg"}
                      alt={`${perfil.red_social} Icon`}
                      className="flex justify-left mr-2"
                    />
                    {perfil.username}
                  </span>
                </td>

                <td className="px-5 pb-2"><EstadoLabel estado={perfil.estado} /></td>
                <td className="pb-2"><X /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </BlurredContainer>
    </>
  );
};
export default SocialMediaCard;
