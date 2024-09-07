"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { signIn } from "@/app/actions/(backoffice)/auth.actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import FormButton from "@/components/(backoffice)/FormButton";
import { useState } from "react";
import Image from "next/image";
import SocialButton from "./SocialButton";


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
      <Image className="" src={"/socialmood-black-logo.svg"} width={163} height={70} alt={""} />
      <h1 className="text-3xl font-bold text-black">Log In</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full px-20 py-5">
        <FormField
          control={form.control}
          name="correo_electronico"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-black">Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  className="w-full px-3 py-2 
                            rounded-[12px] border-transparent
                            focus:outline-none focus:ring-2 focus:ring-primary
                            bg-[#EBEBEB] text-black "
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
              <FormLabel className="block text-sm font-medium text-black">Contraseña</FormLabel>
              <FormControl>
                <Input
                  className="w-full px-3 py-2 
                  rounded-[12px] border-transparent
                  focus:outline-none focus:ring-2 focus:ring-primary 
                  bg-[#EBEBEB] text-black"
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
            isPending={isPending}
            variant="default"
            defaultText="Log in"
            pendingText="Loging in..."
            customStyle="w-full"
          />
        </div>
      </form>
    </Form>
  );
}
