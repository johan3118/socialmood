"use client"

import React, { useState, useEffect } from "react";
import { getRespuestas } from "@/app/actions/(socialmood)/get-interactions.actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CreateRule from "@/components/(socialmood)/create-rule";
import EditForm from "@/components/(socialmood)/edit-response"; // Import the EditForm component
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
    username_emisor: string;
    categoria: string;
    subcategoria: string;
    fecha: string;
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
    const [selectedResponse, setSelectedResponse] = useState<Respuestas | null>(null); // To store the selected response

    const socialIconMap: { [key: string]: string } = {
        Instagram: "/instagram.svg",
        Facebook: "/facebook.svg"
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
        if (userID) {
            const subscription = await getSubscription(parseInt(userID));
            if (subscription) {
                setSubscriptionID(subscription);
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
        setAction("Edit");

        // Find the selected response by ID
        const selected = Respuestas.find((respuesta) => respuesta.unique_code === respuestaID);
        setSelectedResponse(selected || null);
    }

    const handleApproveRespuesta = async (respuestaID: string) => {
        setRespuestaID(respuestaID);
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
                        <button
                            className="btn w-8 h-8 bg-[#FFF] rounded-[12px] flex items-center justify-center"
                            onClick={handleRefreshTable}
                        >
                            <img src="/refresh.svg" alt="Refresh" className=" w-6 h-6" />
                        </button>
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
                                {Respuestas.map((respuesta) => (
                                    <tr key={respuesta.unique_code} className="">
                                        <td className="px-2 py-2">
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
                                        <td className="py-4 px-4 text-sm text-left w-1/2">
                                            {respuesta.respuesta}
                                        </td>
                                        <td className="py-4 px-3 font-bold text-left">
                                            <div className="flex items-center justify-center space-x-2">
                                                <DialogTrigger className="btn w-8 h-8 rounded-[12px] flex items-center justify-center" onClick={() => handleEditRespuesta(respuesta.unique_code)}>
                                                    <img src="/edit.svg" alt="Edit" className=" w-6 h-6" />
                                                </DialogTrigger>
                                                <DialogTrigger className="btn w-8 h-8 rounded-[12px] flex items-center justify-center" onClick={() => handleApproveRespuesta(respuesta.unique_code)}>
                                                    <input type="checkbox" className="bg-transparent rounded-md w-5 h-5 border-white border-solid border-1"/>
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
                    action === "Edit" && selectedResponse ? (
                        <EditForm
                            onClose={() => setOpen(false)}
                            defaultValues={{
                                red_social: selectedResponse.perfil.red_social,
                                red_social_username: selectedResponse.perfil.red_social,
                                categoria: selectedResponse.categoria, // Example, you might need to adjust based on actual response data
                                subcategoria: selectedResponse.subcategoria,  // Example
                                emisor: selectedResponse.username_emisor,
                                respuesta: selectedResponse.respuesta,
                                unique_code: selectedResponse.unique_code,
                                fecha: selectedResponse.fecha
                            }}
                        />
                    ) : null
            }
        </Dialog>
    );
};

export default ListadoRespuestasTable;
