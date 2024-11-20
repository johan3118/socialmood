"use client"
import React, { useState, useEffect } from "react";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EditResponseSchema } from "@/types";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { updateRespuesta } from "@/app/actions/(socialmood)/get-interactions.actions";
import { useRouter } from "next/navigation";

interface EditFormProps {
    onClose: () => void;
    onUpdate: () => void;
    defaultValues: {
        red_social: string;
        red_social_username: string;
        categoria: string;
        subcategoria: string;
        emisor: string;
        respuesta: string;
        unique_code: string;
        fecha: string;
    };
}

const EditResponse: React.FC<EditFormProps> = ({ onClose, onUpdate, defaultValues }) => {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const form = useForm<z.infer<typeof EditResponseSchema>>({
        resolver: zodResolver(EditResponseSchema),
        defaultValues: defaultValues // Initial default values
    });

    // Reset the form when defaultValues change
    useEffect(() => {
        form.reset(defaultValues);
    }, [defaultValues, form]);

    async function onSubmit(values: z.infer<typeof EditResponseSchema>) {
        const res = await updateRespuesta(defaultValues.unique_code, values.respuesta);
        setIsPending(true);

        if (res.success) {
            setIsPending(false);
            toast({
                variant: "default",
                description: res.message,
            });
            setTimeout(() => {
                setIsPending(false);
            }, 5000);
            onClose();
            onUpdate();
        } 
    }

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

    return (
        <DialogContent className="md:w-[55%]" aria-describedby="Edit Response Form">
            <div className="flex w-full max-w-3xl space-x-10">
                <div className="flex-1">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold mb-4">Editar respuesta</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Fecha */}
                        <div className="flex items-center justify-between">
                            <p className="text-md text-white">Fecha</p>
                            <div className="bg-[#30BD92] text-white px-4 py-2 rounded-full text-xs font-medium">
                                {defaultValues.fecha}
                            </div>
                        </div>

                        {/* Perfil de red social */}
                        <div>
                            <p className="text-md text-white mb-2">Perfil de red social</p>
                            <div className="flex items-center justify-center space-x-2 w-full">
                                <span className="bg-white -full flex justify-start items-center rounded-lg w-full" >
                                    <img
                                        src={socialIconMap[defaultValues.red_social] || "/default.svg"}
                                        alt={`${defaultValues.red_social} Icon`}
                                        className="flex justify-left mr-2"
                                    />
                                    {defaultValues.red_social_username}
                                </span>
                            </div>
                        </div>

                        {/* Categoría y Subcategoría */}
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <p className="text-md text-white mb-2">Categoría</p>
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={cn(buttonVariants({ variant: "angry", size: "smBold" }))}
                                        style={{ width: "100%", justifyContent: "center", backgroundColor: "white" }}
                                    >
                                        <img
                                            src={emojimap[defaultValues.categoria] || "/default.svg"}
                                            alt="Emoji Icon"
                                            className="w-6 md:w-8 h-6 md:h-8 ml-2"
                                        />
                                        {defaultValues.categoria}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-md text-white mb-2">Subcategoría</p>
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={cn(buttonVariants({ variant: "angry", size: "smBold" }))}
                                        style={{ width: "100%", justifyContent: "center", backgroundColor: "white" }}
                                    >
                                        <img
                                            src={emojimap[defaultValues.subcategoria] || "/default.svg"}
                                            alt="Emoji Icon"
                                            className="w-6 md:w-8 h-6 md:h-8 ml-2"
                                        />
                                        {defaultValues.subcategoria}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Emisor */}
                        <div>
                            <p className="text-md text-white">Emisor</p>
                            <div className="w-full mt-2 px-3 py-2 bg-white rounded-lg border">{defaultValues.emisor}</div>
                        </div>
                    </div>
                </div>

                {/* Respuesta automática */}
                <div className="flex-1">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="respuesta"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-md font-medium text-white">Respuesta automática generada</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="w-full h-64 mt-2 px-3 py-2 bg-white rounded-lg border"
                                                autoComplete="respuesta" {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white">
                                Actualizar
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>

            <button onClick={onClose} className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white">
                <img src="/delete.svg" alt="Close" className="w-6 h-6" />
            </button>

            <DialogDescription></DialogDescription>
        </DialogContent>
    );
};

export default EditResponse;
