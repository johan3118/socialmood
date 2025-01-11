"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginSchema } from "@/types";
import { login } from "@/app/actions/(socialmood)/auth.actions";
import { toast } from "@/components/ui/use-toast";

export default function Login() {
  const t = useTranslations("socialmood.auth.login");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      await login(values);
      router.push("/app/dashboard");
    } catch (error) {
      toast({
        title: t("errors.loginFailed"),
        description: t("errors.invalidCredentials"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-[#2C2436] p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-6">{t("title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("emailPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {t("signIn")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
