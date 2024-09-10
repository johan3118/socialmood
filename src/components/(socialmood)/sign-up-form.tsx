"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpSchema } from "@/types";
import { createGoogleAuthotizationURL, signUp } from "@/app/actions/(socialmood)/auth.actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from 'next/link'
import Image from "next/image";
import SocialButton from "./social-button";


export function SignUpForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      direccion: "",
      correo_electronico: "",
      password: "",
      confirmPassword: ""
    },
  });

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    console.log(values);
    setIsPending(true);
    const res = await signUp(values);
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
        router.push("/app/profile");
      }, 5000);
    }
  }

  const onGoogleSignUpClicked = async () => {

    setIsPending(true);
    const res = await createGoogleAuthotizationURL();
    if (res.error) {
      toast({
        variant: "destructive",
        description: res.error,
      });
    } else if (res.success) {
      window.location.href = res.data.toString();
    }

    setIsPending(false);

  }
  return (
    <Form {...form}>
      <Image className="" src={"/socialmood-logo.svg"} width={163} height={70} alt={""} />
      <h1 className="text-3xl font-bold text-white">Sign Up</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full px-20">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-white">Nombre</FormLabel>
              <FormControl>
                <Input
                  className="w-full px-3 py-2 
                  rounded-[15px] 
                  focus:outline-none focus:ring-2 focus:ring-primary 
                  bg-white/40 text-white"
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
              <FormLabel className="block text-sm font-medium text-white">Apellido</FormLabel>
              <FormControl>
                <Input
                  className="w-full px-3 py-2 
                  rounded-[15px] 
                  focus:outline-none focus:ring-2 focus:ring-primary 
                  bg-white/40 text-white"
                  autoComplete="apellido"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="direccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-white">Dirección</FormLabel>
              <FormControl>
                <Input
                  className="w-full px-3 py-2 
                  rounded-[15px] 
                  focus:outline-none focus:ring-2 focus:ring-primary 
                  bg-white/40 text-white"
                  autoComplete="direccion"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="correo_electronico"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-white">Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  className="w-full px-3 py-2 
                  rounded-[15px] 
                  focus:outline-none focus:ring-2 focus:ring-primary 
                  bg-white/40 text-white"
                  autoComplete="correo_electronico"
                  {...field}
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
                  className="w-full px-3 py-2 
                  rounded-[15px] 
                  focus:outline-none focus:ring-2 focus:ring-primary 
                  bg-white/40 text-white"
                  autoComplete="current-password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-white">Confirmar contraseña</FormLabel>
              <FormControl>
                <Input
                  className="w-full px-3 py-2 
                  rounded-[15px] 
                  focus:outline-none focus:ring-2 focus:ring-primary 
                  bg-white/40 text-white"
                  autoComplete="current-password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <SocialButton
            customStyle="w-full"
            isPending={isPending}
            variant="default"
            defaultText="Sign up"
            pendingText="Signing up..."
            type="submit"
          />
        </div>
        <div>
          <SocialButton
            customStyle="w-full"
            isPending={isPending}
            variant="google"
            defaultText="Inicia sesión con Google"
            pendingText="Signing un..."
            type="button"
            icon="gg"
            onClick={onGoogleSignUpClicked}
          />
        </div>
        <p className="text-sm text-white text-center">
          Tienes una cuenta?{" "}
          <Link href="/app/sign-in" className="font-medium text-white hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </Form>
  );
}