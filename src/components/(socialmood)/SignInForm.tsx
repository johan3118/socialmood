"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInSchema } from "../../types";
import { signIn } from "@/app/actions/(socialmood)/auth.actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import FormButton from "@/components/(socialmood)/FormButton";
import { useState } from "react";
import Link from 'next/link'
import Image from "next/image";


export function SignInForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      correo_electronico: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignInSchema>) {
    setIsPending(true);
    const res = await signIn(values);
    if (res.error) {
      toast({
        variant: "destructive",
        description: res.error,
      });
      setIsPending(false);
    } else if (res.success) {
      toast({
        variant: "default",
        description: "Signed in successfully",
      });
      setTimeout(() => {
        setIsPending(false);
        router.push("/profile");
      }, 5000);
    }
  }

  return (
    <Form {...form}>
      <Image className="" src={"/socialmood-logo.svg"} width={163} height={70} alt={""} />
      <h1 className="text-3xl font-bold text-white">Log In</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
        <FormField
          control={form.control}
          name="correo_electronico"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-white">Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  className="w-full px-3 py-2 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Correo electrónico"
                  autoComplete="correo_electronico" {...field}
                />
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
              <FormLabel className="block text-sm font-medium text-white">Contraseña</FormLabel>
              <FormControl>
                <Input
                  className="w-full px-3 py-2 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  autoComplete="current-password"
                  placeholder="Contraseña"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Link href="#" className="text-sm text-white hover:underline text-[#FFAAE3]">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div>
          <FormButton
            isPending={isPending}
            variant="default"
            defaultText="Log in"
            pendingText="Loging in..."
          />
        </div>
        <p className="text-sm text-white ">
          No tienes una cuenta?{" "}
          <Link href="/sign-up" className="font-medium text-white hover:underline">
            Regístrate
          </Link>
        </p>
      </form>
    </Form>
  );
}
