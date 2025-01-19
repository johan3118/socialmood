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
import { ChangePasswordSchema } from "@/types";
import { useForm } from "react-hook-form";
import SocialButton from "./social-button";
import { changeUserPasswordById } from "@/app/actions/(backoffice)/user.actions";
import { useRouter } from "next/navigation";

export function ChangePasswordForm({userId}: {userId: number}) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
  });

  async function onSubmit(values: z.infer<typeof ChangePasswordSchema>) {
    setIsPending(true);
    const res = await changeUserPasswordById(userId, values);
    if (res.error) {
      setIsPending(false);
      toast({
        variant: "destructive",
        description: res.error,
      });
    } else if (res.success) {
      toast({
        variant: "default",
        description: "Contraseña actualizada correctamente",
      });
      setTimeout(() => {
        setIsPending(false);
      }, 3000);
      form.reset();
      router.push("/bo/layout/user-table");
    }
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full max-h-[80vh] overflow-y-auto">
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