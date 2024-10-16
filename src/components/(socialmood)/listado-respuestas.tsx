"use client"

import React, { useState, useEffect } from "react";
import { getRespuestas } from "@/app/actions/(socialmood)/get-interactions.actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Importación de la función 'cn'
import CreateRule from "@/components/(socialmood)/create-rule";
import { getSubscription, getActiveUserId } from "@/app/actions/(socialmood)/auth.actions";

import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"

import router, { useRouter } from "next/router";

interface Perfil {
    red_social: string;
    username: string;
    color: string;
}

interface Respuestas {
    unique_code: string;
    perfil: Perfil;
    respuesta: string;
}

interface ListadoRespuestasTableProps {
    filter: any;
}

const ListadoRespuestasTable: React.FC<ListadoRespuestasTableProps> = ({ filter }) => {

    const [SubscriptionID, setSubscriptionID] = useState<number>(0);

    const [Respuestas, setRespuestas] = useState<Respuestas[]>([]);
    const [Open, setOpen] = useState<boolean>(false);

    const [action, setAction] = useState<string>("Create");
    const [respuestaID, setRespuestaID] = useState<string>("");

    const socialIconMap: { [key: string]: string } = {
        Instagram: "/instagram.svg",
        Facebook: "/facebook.svg"
    };

    const emojimap: Record<string, string> = {
        "Queja": "/angry.svg",
        "Elogio": "/happy.svg",
        "Recomendación": "/happy.svg",
        "Consulta": "/neutral-face.svg",
        // categorías y subcategorias con sus respectivos emojis
    };


    const fetchRespuestas = async () => {
        try {
            const Respuestas = await Promise.all(await getRespuestas());
            setRespuestas(Respuestas);
        } catch (error) {
            console.error("Error al cargar las Respuestas:", error);
        }
    };

    const handleOpenChange = (newOpenValue: boolean) => {
        setOpen(newOpenValue);
        if (newOpenValue === false) {
            fetchRespuestas();
        }
    };

    const setSubscription = async () => {

        const userID = await getActiveUserId();
        console.log(userID);
        if (userID) {
            const subscription = await getSubscription(parseInt(userID));
            if (subscription) {
                setSubscriptionID(subscription);
                console.log(subscription);
            }
            else {
                await router.push("/app/get-sub");
            }

        }
        else {
            await router.push("/app/sign-in");
        }
    }

    const handleRefreshTable = () => {
        updateData();
    };


    const handleEditRespuesta = (respuestaID: string) => {
        setOpen(true);
        setRespuestaID(respuestaID);
        setAction("");
        setAction("Edit");
    }

    const handleApproveRespuesta = async (respuestaID: string) => {
        setOpen(true);
        setRespuestaID(respuestaID);
        setAction("");
        setAction("Approve");
    }

    const updateData = async () => {
        await setSubscription();
        await fetchRespuestas();
    }

    useEffect(() => {
        updateData();
    }, [filter, SubscriptionID]);

    return (
        <Dialog open={Open}>
            <div className="bg-gradient-to-b from-white/20 via-white/10 to-white/5 text-white border border-white/30 rounded-[32px] px-10 mx-12 py-8">
                <div className="container mx-auto p-6">
                    <div className="flex justify-between mb-6">
                        <h1 className="text-[24px] text-white font-bold">Respuestas</h1>
                        <div className="flex items-center space-x-1">
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

                    </div>
                    <hr className="border-[#FFF] mb-6" />
                    <div className="max-h-60 overflow-y-auto">
                        <table className="min-w-full table-auto ">
                            <thead>
                                <tr className="text-[16px] md:text-[18px]">
                                    <th className="py-2 px-3 text-left">Perfil</th>
                                    <th className="py-2 px-3 text-left w-1/4">Respuesta automática</th>
                                    <th className="py-2 px-3 text-left hidden sm:table-cell"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Respuestas.map((respuesta) => (
                                    <tr key={respuesta.unique_code}>
                                        <td className="py-1 px-3">
                                            <div className="flex items-center justify-center space-x-2 w-full">
                                                <span
                                                    className={cn(
                                                        buttonVariants({
                                                            variant: respuesta.perfil.red_social === "Instagram" ? "blue" : respuesta.perfil.red_social === "Facebook" ? "orange" : "default",
                                                            size: "smBold",
                                                        }),
                                                        "w-full flex justify-start items-center py-2"
                                                    )}
                                                >
                                                    <img
                                                        src={socialIconMap[respuesta.perfil.red_social] || "/default.svg"}
                                                        alt={`${respuesta.perfil.red_social} Icon`}
                                                        className="flex justify-left mr-2"
                                                    />
                                                    {respuesta.perfil.username}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-1 px-3 text-left">{respuesta.respuesta}</td>

                                        <td className="py-1 px-3 font-bold text-left">
                                            <div className="flex items-center justify-center space-x-2">
                                                <DialogTrigger className="btn w-8 h-8 rounded-[12px] flex items-center justify-center" onClick={() => handleEditRespuesta(respuesta.unique_code)}>

                                                    <img
                                                        src="/edit.svg"
                                                        alt="Edit"
                                                        className=" w-6 h-6"
                                                    />
                                                </DialogTrigger>
                                                <DialogTrigger className="btn w-8 h-8 rounded-[12px] flex items-center justify-center" onClick={() => handleApproveRespuesta(respuesta.unique_code)}>
                                                    <img
                                                        src="/delete.svg"
                                                        alt="Delete"
                                                        className=" w-6 h-6"
                                                    />
                                                </DialogTrigger>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {
                action === "Approve" ? <CreateRule onOpenChange={handleOpenChange} /> :
                    action === "Edit" ? <CreateRule onOpenChange={handleOpenChange} /> :
                        null

            }
        </Dialog>
    );
};

export default ListadoRespuestasTable;