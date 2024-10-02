import React, { useEffect } from "react";

import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";

import { CreateRuleSchema } from "../../types";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { getRuleSubcategories, getSocialMediaAccounts, getRule, createChildRule } from "@/app/actions/(socialmood)/rules.actions";


import SocialButton from "./social-button";
import { Label } from "../ui/label";

interface EditRuleChildProps {
    ruleID: number;
    onOpenChange: (newOpenValue: boolean) => void;

}

export default function EditRuleChild({ ruleID, onOpenChange }: EditRuleChildProps) {

    const [open, setOpen] = useState(false);

    const [redSocial, setRedSocial] = useState("");

    const items = [
        {
            id: "1",
            label: "Recomendación",
        },
        {
            id: "2",
            label: "Consulta",
        },
        {
            id: "3",
            label: "Queja",
        },
        {
            id: "4",
            label: "Elogio",
        }
    ] as const

    const subscription = 20


    const [isPending, setIsPending] = useState(false);

    const form = useForm<z.infer<typeof CreateRuleSchema>>({
        resolver: zodResolver(CreateRuleSchema),
        defaultValues: {
            alias: "",
            red_social: redSocial,
            tipo: "1",
            instrucciones: "",
            subcategorias: [],
        },
    });

    async function onSubmit(values: z.infer<typeof CreateRuleSchema>) {
        setIsPending(true);
        console.log(values);
        form.reset();
        setIsPending(false);
        onOpenChange(false);
    }

    async function onClose() {
        form.reset();
        onOpenChange(false);
    }

    const [Subcategorias, SetSubcategorias] = useState([
        {
            id: "1",
            label: "Recomendación",
        },
        {
            id: "2",
            label: "Consulta",
        },
        {
            id: "3",
            label: "Queja",
        },
        {
            id: "4",
            label: "Elogio",
        }
    ]);

    const [socialMedias, setSocialMedias] = useState<{ id: string, label: string }[]>([]);


    async function fetchSocialMedia() {
        const socialMedia = await getRule(ruleID);
        const cuenta = (socialMedia?.perfil?.id_cuenta?.toString() || "");
        setRedSocial(cuenta);
        form.setValue("red_social", cuenta);
    }

    const fetchSubcategorias = async () => {
        const subcategorias = await getRuleSubcategories(ruleID);
        SetSubcategorias(subcategorias.map(subcategoria => ({
            ...subcategoria,
            id: subcategoria.id.toString()
        })));
    };

    async function fetchSocialMediaAccounts() {
        const accounts = await getSocialMediaAccounts(subscription);
        setSocialMedias(accounts.map(account => ({ id: account.id.toString(), label: account.usuario_cuenta })));
    }

    const updateData = async () => {
        await fetchSubcategorias();
        await fetchSocialMediaAccounts();
        await fetchSocialMedia();
    }

    useEffect(() => {
        updateData();
    }, [ruleID]);

    return (
        <DialogContent className="flex items-start md:w-[90%] bg-[#2C2436]">
            <Form {...form}>
                <form className="space-y-5 w-full py-5">
                    <DialogHeader className="w-full">
                        <DialogTitle className="flex justify-between w-full mt-6">
                            <div className="flex"><img src="/magic-wand.svg" className="w-[49px] h-[49px]" />
                                <h1 className="ml-2 text-[40px]">Editar Regla Hijo</h1>
                            </div>
                            <SocialButton
                                variant="default"
                                isPending={isPending}
                                defaultText="Guardar"
                                customStyle="text-[20px]"
                                pendingText="Guardando..."
                                type="button"
                                onClick={()=>{onSubmit(form.getValues())}}
                            />
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="w-full">
                        <div className="flex flex-col w-full">

                            <div className="flex w-full space-x-2">
                                <div className="bg-orange-500 text-[20px] text-white rounded-full w-10 h-8 flex items-center justify-center">01</div>
                                <div className="flex-1 ml-2">
                                    <FormField
                                        control={form.control}
                                        name="alias"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Alias de la regla"
                                                        className="w-full px-3 py-2 
                            rounded-[10px] 
                            focus:outline-none focus:ring-2 focus:ring-primary 
                            bg-white text-[#2C2436] "
                                                        autoComplete="alias" {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <hr className="my-3 border-2 bg-white bg-opacity-30" />
                            <div className="flex w-full space-x-28">
                                <div className="w-1/2 space-y-3">
                                    <FormField
                                        control={form.control}
                                        name="red_social"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium">Red Social</FormLabel>
                                                <FormControl>
                                                    <Select name="red_social" onValueChange={field.onChange} value={redSocial}>
                                                        <SelectTrigger disabled className="w-full px-3 py-2 
                            rounded-[10px] 
                            focus:outline-none focus:ring-2 focus:ring-primary 
                            bg-white text-[#2C2436] ">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {socialMedias.map((socialMedia) => (
                                                                <SelectItem key={socialMedia.id} value={socialMedia.id}>
                                                                    {socialMedia.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />{" "}
                                    <FormField
                                        control={form.control}
                                        name="subcategorias"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium">Subcategorias</FormLabel>
                                                {items.map((item) => (
                                                    <FormField
                                                        key={item.id}
                                                        control={form.control}
                                                        name="subcategorias"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={item.id}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, item.id])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== item.id
                                                                                        )
                                                                                    )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">
                                                                        {item.label}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )
                                                        }}
                                                    />
                                                ))}
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="instrucciones"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium">Instrucciones</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Redactar instrucciones..." className="w-full px-3 py-2 
                    rounded-[12px] border-transparent
                    focus:outline-none focus:ring-2 focus:ring-primary
                    bg-[#EBEBEB] text-black " {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-1/2 space-y-3">
                                    <FormField
                                        control={form.control}
                                        name="tipo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium">Tipo</FormLabel>
                                                <FormControl>
                                                    <Select name="tipo" onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger disabled className="w-full px-3 py-2 
                            rounded-[10px] 
                            focus:outline-none focus:ring-2 focus:ring-primary 
                            bg-white text-[#2C2436] ">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1">Padre</SelectItem>
                                                            <SelectItem value="2">Hijo</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />{" "}
                                    <div>
                                        <Label className="text-lg font-semibold">Reglas relacionadas</Label>
                                        <hr className="my-3 border-2 bg-white bg-opacity-30" />
                                        <div className="mt-1">
                                            <div className="space-y-2 mt-2">
                                                {[2, 3, 4].map((num) => (
                                                    <div key={num} className="flex items-center space-x-2">
                                                        <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                                            0{num}
                                                        </div>
                                                        <span>Regla xxxxxxxxxxx</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogDescription>
                </form>
            </Form >
            <button onClick={onClose} className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white">
                <img src="/delete.svg" alt="Close" className="w-6 h-6" />
            </button>
        </DialogContent >
    );
}
