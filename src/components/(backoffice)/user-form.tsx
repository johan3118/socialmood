"use client"
import React, { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateUserSchema } from "@/types";
import { useForm } from "react-hook-form";
import SocialButton from "./social-button";
import { createUser } from "@/app/actions/(backoffice)/user.actions";

export function UserForm() {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      direccion: "",
      tipoUsuario: "1",
      correo: "",
      password: "",
      confirmPassword: ""
    },
  });

  async function onSubmit(values: z.infer<typeof CreateUserSchema>) {
    setIsPending(true);
    const res = await createUser(values);
    if (res.error) {
      setIsPending(false);
      toast({
        variant: "destructive",
        description: res.error,
      });
    } else if (res.success) {
      toast({
        variant: "default",
        description: "Account created successfully",
      });
      setTimeout(() => {
        setIsPending(false);
      }, 5000);
      form.reset();
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-black">Nombre</FormLabel>
                <FormControl>
                  <Input
                    className="w-full px-3 py-2 
                    rounded-[12px] border-transparent
                    focus:outline-none focus:ring-2 focus:ring-primary
                    bg-[#EBEBEB] text-black "
                    autoComplete="nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-black">Apellido</FormLabel>
                <FormControl>
                  <Input
                    className="w-full px-3 py-2 
                    rounded-[12px] border-transparent
                    focus:outline-none focus:ring-2 focus:ring-primary
                    bg-[#EBEBEB] text-black "
                    autoComplete="apellido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> {" "}
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-black">Dirección</FormLabel>
                <FormControl>
                  <Input
                    className="w-full px-3 py-2 
                    rounded-[12px] border-transparent
                    focus:outline-none focus:ring-2 focus:ring-primary
                    bg-[#EBEBEB] text-black "
                    autoComplete="direccion" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="tipoUsuario"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-black">Tipo de Usuario</FormLabel>
                <FormControl>
                  <Select name="tipoUsuario" onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="bg-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Gestor de comunidad</SelectItem>
                      <SelectItem value="2">Gestor de operaciones</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="correo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-black">Correo electrónico</FormLabel>
                <FormControl>
                  <Input
                    className="w-full px-3 py-2 
                   rounded-[12px] border-transparent
                   focus:outline-none focus:ring-2 focus:ring-primary
                   bg-[#EBEBEB] text-black "
                    autoComplete="correo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-black">Contraseña</FormLabel>
                <FormControl>
                  <Input
                    className="w-full px-3 py-2 
                    rounded-[12px] border-transparent
                    focus:outline-none focus:ring-2 focus:ring-primary
                    bg-[#EBEBEB] text-black "
                    type="password"
                    autoComplete="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-black">Confirmar contraseña</FormLabel>
                <FormControl>
                  <Input
                    className="w-full px-3 py-2 
                    rounded-[12px] border-transparent
                    focus:outline-none focus:ring-2 focus:ring-primary
                    bg-[#EBEBEB] text-black "
                    type="password"
                    autoComplete="confirmPassword" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SocialButton
            customStyle="w-full"
            isPending={isPending}
            variant="default"
            defaultText="Registrar"
            pendingText="Registrando..."
            type="submit"
          />
        </form>
      </Form>
    </>
  );
};