// src/components/(socialmood)/create-rule.tsx
"use client";

import React, { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateRuleSchema } from "../../types";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/use-toast";

import SocialButton from "./social-button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface SocialMediaOption {
  id: string;
  label: string;
}

interface CreateRuleProps {
  /** Función para abrir/cerrar el diálogo o contenedor padre */
  onOpenChange: (open: boolean) => void;

  /** Lista de redes sociales que el usuario puede elegir */
  socialMedias: SocialMediaOption[];

  /** Server Action para crear la regla */
  handleCreateRule: (data: any) => Promise<any>;
}

export default function CreateRule({
  onOpenChange,
  socialMedias,
  handleCreateRule,
}: CreateRuleProps) {
  const t = useTranslations("createRule");
  const [isPending, setIsPending] = useState(false);

  // Configuración de React Hook Form con Zod
  const form = useForm<z.infer<typeof CreateRuleSchema>>({
    resolver: zodResolver(CreateRuleSchema),
    defaultValues: {
      alias: "",
      red_social: "",
      tipo: "1",
      instrucciones: "",
      subcategorias: [],
    },
  });

  /** Manejo de envío del formulario */
  async function onSubmit(values: z.infer<typeof CreateRuleSchema>) {
    setIsPending(true);

    try {
      // Llamada a la Server Action pasada como prop
      const res = await handleCreateRule(values);

      if (res.error) {
        toast({
          variant: "destructive",
          description: res.error,
        });
      } else if (res.success) {
        toast({
          variant: "default",
          description: t("ruleCreated"),
        });
        form.reset();
        onOpenChange(false); // Cerrar el diálogo o contenedor
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || "Error inesperado.",
      });
    }

    setIsPending(false);
  }

  /** Cerrar el componente/diálogo */
  function onClose() {
    form.reset();
    onOpenChange(false);
  }

  /** Ejemplo de items para subcategorías (puedes ajustarlo a tus traducciones) */
  const items = [
    { id: "1", label: t("recomendacion") },
    { id: "2", label: t("consulta") },
    { id: "3", label: t("queja") },
    { id: "4", label: "Elogio" },
  ] as const;

  return (
    <DialogContent className="flex items-start md:w-[90%]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-full py-5"
        >
          <DialogHeader className="w-full">
            <DialogTitle className="flex justify-between w-full mt-6">
              <div className="flex">
                <img src="/magic-wand.svg" className="w-[49px] h-[49px]" />
                <h1 className="ml-2 text-[40px]">{t("title")}</h1>
              </div>
              <SocialButton
                variant="default"
                isPending={isPending}
                defaultText={t("save")}
                pendingText={t("saving")}
                customStyle="text-[20px]"
                type="submit"
              />
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="w-full">
            <div className="flex flex-col w-full">
              {/* ALIAS */}
              <div className="flex w-full space-x-2">
                <div className="bg-orange-500 text-[20px] text-white rounded-full w-10 h-8 flex items-center justify-center">
                  01
                </div>
                <div className="flex-1 ml-2">
                  <FormField
                    control={form.control}
                    name="alias"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={t("aliasPlaceholder")}
                            className="w-full px-3 py-2 
                              rounded-[10px] 
                              focus:outline-none focus:ring-2 focus:ring-primary 
                              bg-white text-[#2C2436]"
                            autoComplete="alias"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <hr className="my-3" />

              <div className="flex w-full space-x-28">
                {/* SELECCIÓN DE RED SOCIAL */}
                <div className="w-1/2 space-y-3">
                  <FormField
                    control={form.control}
                    name="red_social"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          {t("socialMedia")}
                        </FormLabel>
                        <FormControl>
                          <Select
                            name="red_social"
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger
                              className="w-full px-3 py-2 
                                rounded-[10px] 
                                focus:outline-none focus:ring-2 focus:ring-primary 
                                bg-white text-[#2C2436]"
                            >
                              <SelectValue placeholder={t("selectAccount")} />
                            </SelectTrigger>
                            <SelectContent>
                              {socialMedias.map((socialMedia) => (
                                <SelectItem
                                  key={socialMedia.id}
                                  value={socialMedia.id}
                                >
                                  {socialMedia.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SUBCATEGORÍAS (CheckBox) */}
                  <FormField
                    control={form.control}
                    name="subcategorias"
                    render={() => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          {t("subcategories")}
                        </FormLabel>
                        {items.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="subcategorias"
                            render={({ field }) => {
                              const checked = field.value?.includes(item.id);
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={checked}
                                      onCheckedChange={(isChecked) => {
                                        if (isChecked) {
                                          field.onChange([
                                            ...field.value,
                                            item.id,
                                          ]);
                                        } else {
                                          field.onChange(
                                            field.value.filter(
                                              (val: string) => val !== item.id
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </FormItem>
                    )}
                  />
                </div>

                {/* TIPO (Ejemplo, deshabilitado) */}
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          {t("type")}
                        </FormLabel>
                        <FormControl>
                          <Select
                            name="tipo"
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger
                              disabled
                              className="w-full px-3 py-2 
                                rounded-[10px] 
                                focus:outline-none focus:ring-2 focus:ring-primary 
                                bg-white text-[#2C2436]"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">{t("parent")}</SelectItem>
                              <SelectItem value="2">{t("child")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* INSTRUCCIONES */}
              <div className="flex w-full">
                <div className="w-full mt-5">
                  <FormField
                    control={form.control}
                    name="instrucciones"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium">
                          {t("instructions")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Redactar instrucciones..."
                            className="w-full px-3 py-2 
                              rounded-[12px] border-transparent
                              focus:outline-none focus:ring-2 focus:ring-primary
                              bg-[#EBEBEB] text-black"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </DialogDescription>
        </form>
      </Form>

      {/* Botón para cerrar */}
      <button
        onClick={onClose}
        className="absolute right-6 top-6 rounded-sm opacity-70 
          ring-offset-background transition-opacity hover:opacity-100
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
          disabled:pointer-events-none data-[state=open]:bg-accent
          data-[state=open]:text-muted-foreground text-white"
      >
        <img src="/delete.svg" alt="Close" className="w-6 h-6" />
      </button>
    </DialogContent>
  );
}
