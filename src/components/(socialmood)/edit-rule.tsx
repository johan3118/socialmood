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
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"

import CreateRuleChild from "@/components/(socialmood)/create-rule-child";
import EditRuleChild from "@/components/(socialmood)/edit-rule-child";
import DeleteRuleChild from "@/components/(socialmood)/delete-rule-child";

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

import SocialButton from "./social-button";
import { Label } from "../ui/label";
import { getSocialMediaAccounts, getRule, getChildRules } from "@/app/actions/(socialmood)/rules.actions";

interface EditRuleProps {
    ruleID: number;
    onOpenChange: (newOpenValue: boolean) => void;

}

interface Perfil {
    red_social: string;
    username: string;
    color: string;
}

interface Reglas {
    id: number;
    perfil: Perfil;
    alias: string;
    subcategorias: string[];
}

export default function EditRule({ ruleID, onOpenChange }: EditRuleProps) {

    const [action, setAction] = useState<string>("Create");

    const [Open, setOpen] = useState<boolean>(false);

    const [ChildReglas, setChildReglas] = useState<Reglas[]>([]);

    const fetchChildRules = async () => {
        try {
            const reglas = await Promise.all(await getChildRules(ruleID));
            setChildReglas(reglas);
        } catch (error) {
            console.error("Error al cargar las reglas:", error);
        }
    };

    const handleAddRule = () => {
        setAction("Create");
    };

    const handleEditRule = (ruleID: number) => {
        setAction("Edit");
    }

    const handleDeleteRule = (ruleID: number) => {
        setAction("Delete");
    }
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

    const [isPending, setIsPending] = useState(false);

    const form = useForm<z.infer<typeof CreateRuleSchema>>({
        resolver: zodResolver(CreateRuleSchema),
        defaultValues: {
            alias: "",
            red_social: "1",
            tipo: "1",
            instrucciones: "",
            subcategorias: [],
        },
    });
    const subscription = 20

    const [socialMedias, setSocialMedias] = useState<{ id: string, label: string }[]>([]);
    useEffect(() => {
        async function fetchSocialMediaAccounts() {
            const accounts = await getSocialMediaAccounts(subscription);
            setSocialMedias(accounts.map(account => ({ id: account.id.toString(), label: account.usuario_cuenta })));
        }
        fetchSocialMediaAccounts();
        async function fetchRuleInfo() {
            const rule = await getRule(ruleID);
            form.setValue("alias", rule.alias);
            form.setValue("red_social", rule.perfil.id_cuenta?.toString() || "");
            form.setValue("tipo", rule.id_tipo_regla?.toString() || "");
            form.setValue("instrucciones", rule.instrucciones || "");
            form.setValue("subcategorias", rule.subcategorias);
        }
        fetchRuleInfo();
        fetchChildRules();

    }, [ruleID]);

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

    const handleOpenChild = (newOpenValue: boolean) => {
        setOpen(newOpenValue);
    }

    return (
        <DialogContent className="flex items-start md:w-[90%]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full py-5">
                    <DialogHeader className="w-full">
                        <DialogTitle className="flex justify-between w-full mt-6">
                            <div className="flex"><img src="/magic-wand.svg" className="w-[49px] h-[49px]" />
                                <h1 className="ml-2 text-[40px]">Editar Regla</h1>
                            </div>
                            <SocialButton
                                variant="default"
                                isPending={isPending}
                                defaultText="Guardar"
                                customStyle="text-[20px]"
                                pendingText="Guardando..."
                                type="submit"
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
                                                    <Select name="red_social" onValueChange={field.onChange} defaultValue={field.value}>
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
                                        <div className="mt-3">
                                            <Dialog open={Open}>
                                                <DialogTrigger>
                                                    <SocialButton
                                                        variant="default"
                                                        isPending={isPending}
                                                        defaultText="Añadir Hijo +"
                                                        customStyle="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white text-[16px]"
                                                        type="button"
                                                        size="sm"
                                                        onClick={handleAddRule}
                                                    />
                                                </DialogTrigger>


                                                <div className="space-y-2 mt-2">
                                                    {ChildReglas.map((regla, index) => (
                                                        <div key={regla.id} className="flex items-center space-x-2">
                                                            <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                                                {index}
                                                            </div>
                                                            <span className="text-[16px]">{regla.alias}</span>
                                                            <div className="flex items-center space-x-2">
                                                                <DialogTrigger className="btn w-8 h-8 rounded-[12px] flex items-center justify-center" onClick={() => { handleEditRule(1) }}>

                                                                    <img
                                                                        src="/edit.svg"
                                                                        alt="Edit"
                                                                        className=" w-6 h-6"
                                                                    />
                                                                </DialogTrigger>
                                                                <DialogTrigger className="btn w-8 h-8 rounded-[12px] flex items-center justify-center" onClick={() => { handleDeleteRule(1) }}>
                                                                    <img
                                                                        src="/delete.svg"
                                                                        alt="Delete"
                                                                        className=" w-6 h-6"
                                                                    />
                                                                </DialogTrigger>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {
                                                    action === "Create" ? <CreateRuleChild onOpenChange={handleOpenChild} parentID={ruleID} /> :
                                                        action === "Edit" ? <EditRuleChild ruleID={ruleID} onOpenChange={handleOpenChild} /> :
                                                            action === "Delete" ? <DeleteRuleChild ruleID={ruleID} onOpenChange={handleOpenChild} /> : null
                                                }

                                            </Dialog>
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
