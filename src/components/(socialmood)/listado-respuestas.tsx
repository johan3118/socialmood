"use client"

import React, { useState, useEffect } from "react";
import { getRespuestasFiltered, commentRepliedTrue } from "@/app/actions/(socialmood)/get-interactions.actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import EditForm from "@/components/(socialmood)/edit-response";
import Image from "next/image";
import ApproveResponse from "@/components/(socialmood)/approve-response";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";



interface Perfil {
    red_social: string;
    username: string;
    color: string;
}

interface Respuestas {
    unique_code: string;
    perfil: Perfil;
    respuesta: string;
    username_emisor: string;
    categoria: string;
    subcategoria: string;
    comment_id: string;
    fecha: string;
}

interface ListadoRespuestasTableProps {
    filter: any;
}

const ListadoRespuestasTable: React.FC<ListadoRespuestasTableProps> = ({ filter }) => {
    const [subscriptionID, setSubscriptionID] = useState<number>(0);
    const [respuestas, setRespuestas] = useState<Respuestas[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [action, setAction] = useState<string>("");
    const [selectedResponse, setSelectedResponse] = useState<Respuestas | null>(null);
    const [selectedResponses, setSelectedResponses] = useState<Respuestas[]>([]);

    const socialIconMap: { [key: string]: string } = {
        Instagram: "/instagram.svg",
        Facebook: "/facebook.svg"
    };

    useEffect(() => {
        updateData();
    }, [filter]);

    const updateData = async () => {
        await fetchRespuestas();
    };

    const fetchRespuestas = async () => {
        try {
            const respuestas = await getRespuestasFiltered(filter);
            setRespuestas(respuestas);
            console.log(respuestas);
        } catch (error) {
            console.error("Error al cargar las respuestas:", error);
        }
    };

    const toggleResponseSelection = (respuesta: Respuestas) => {
        setSelectedResponses((prev) =>
            prev.some((r) => r.unique_code === respuesta.unique_code)
                ? prev.filter((r) => r.unique_code !== respuesta.unique_code)
                : [...prev, respuesta]
        );
    };

    const handleOpenDialog = (newOpenValue: boolean) => {
        setOpenDialog(newOpenValue);
        if (!newOpenValue) fetchRespuestas();
    };

    const handleSendResponses = () => {
        setOpenDialog(true);
        setAction("Approve");
    };

    const confirmSendResponses = async () => {
        try {
            await commentRepliedTrue(selectedResponses);
            console.log("Respuestas enviadas y actualizadas correctamente.");
        } catch (error) {
            console.error("Error al enviar y actualizar respuestas:", error);
        }
    };

    const handleEditRespuesta = (respuestaID: string) => {
        const selected = respuestas.find((respuesta) => respuesta.unique_code === respuestaID);
        setSelectedResponse(selected || null);
        setOpenDialog(true);
        setAction("Edit");
    };

    return (
        <Dialog open={openDialog}>
            <div className="bg-gradient-to-b from-white/20 via-white/10 to-white/5 text-white border border-white/30 rounded-[32px] px-10 mx-12 py-8">
                <div className="container mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-[24px] text-white font-bold">Respuestas</h1>
                        <div className="flex gap-x-4">
                            <button
                                type="button"
                                className={`rounded-lg font-semibold px-4 flex items-center gap-x-2 
        transition duration-300 ease-in-out transform group ${selectedResponses.length === 0
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-white text-[#D24EA6] scale-105"
                                    }`}
                                disabled={selectedResponses.length === 0}
                                onClick={handleSendResponses}
                            >
                                Enviar
                                <Image
                                    width={20}
                                    height={20}
                                    src="/send-icon.svg"
                                    alt="send icon"
                                    className={`transition duration-300 ${selectedResponses.length === 0 ? "filter grayscale opacity-50" : "group-active:animate-shake"
                                        }`}
                                />
                            </button>

                            <button className="btn w-8 h-8 bg-[#FFF] rounded-[12px] flex items-center justify-center" onClick={updateData}>
                                <img src="/refresh.svg" alt="Refresh" className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    <hr className="border-[#FFF] mb-6" />
                    <div className="max-h-60 overflow-y-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="text-[16px] md:text-[18px]">
                                    <th className="py-2 px-3 text-left w-1/6">Perfil</th>
                                    <th className="py-2 px-3 text-left w-1/2">Respuesta automática</th>
                                    <th className="py-2 px-3 text-left w-1/6 hidden sm:table-cell"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {respuestas.map((respuesta) => (
                                    <tr key={respuesta.unique_code}>
                                        <td className="px-2 py-2">
                                            <div className="flex items-center justify-center space-x-2 w-full">
                                                <span className={cn(buttonVariants({ variant: respuesta.perfil.red_social === "Instagram" ? "blue" : "orange", size: "smBold" }), "w-full flex justify-start items-center py-2")}>
                                                    <img src={socialIconMap[respuesta.perfil.red_social] || "/default.svg"} alt={`${respuesta.perfil.red_social} Icon`} className="flex justify-left mr-2" />
                                                    {respuesta.perfil.username}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-left w-1/2">{respuesta.respuesta}</td>
                                        <td className="py-4 px-3 font-bold text-left">
                                            <div className="flex items-center justify-center space-x-2">
                                                <DialogTrigger className="btn w-8 h-8 rounded-[12px] flex items-center justify-center" onClick={() => handleEditRespuesta(respuesta.unique_code)}>
                                                    <img src="/edit.svg" alt="Edit" className="w-6 h-6" />
                                                </DialogTrigger>
                                                <input
                                                    type="checkbox"
                                                    className="bg-transparent rounded-md w-5 h-5 border-white"
                                                    onChange={() => toggleResponseSelection(respuesta)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {action === "Approve" && (
                <ApproveResponse
                    onOpenChange={handleOpenDialog}
                    onConfirm={confirmSendResponses}
                />
            )}
            {action === "Edit" && selectedResponse && (
                <EditForm
                    onClose={() => setOpenDialog(false)}
                    onUpdate={updateData}
                    defaultValues={{
                        red_social: selectedResponse.perfil.red_social,
                        red_social_username: selectedResponse.perfil.username,
                        categoria: selectedResponse.categoria,
                        subcategoria: selectedResponse.subcategoria,
                        emisor: selectedResponse.username_emisor,
                        respuesta: selectedResponse.respuesta,
                        unique_code: selectedResponse.unique_code,
                        fecha: selectedResponse.fecha,
                    }}
                />
            )}
        </Dialog>
    );
};

export default ListadoRespuestasTable;
