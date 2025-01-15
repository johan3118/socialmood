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
import {
  createGoogleAuthotizationURL,
  signIn,
} from "@/app/actions/(socialmood)/auth.actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SocialButton from "./social-button";
import { useTranslations } from "next-intl";

export function SignInForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const t = useTranslations("auth.signIn");

  const SignInSchema = z.object({
    correo_electronico: z
      .string()
      .email({ message: t("email.error.invalid") })
      .min(10, { message: t("email.error.minLength") })
      .max(100, { message: t("email.error.maxLength") }),
    password: z
      .string()
      .min(8, { message: t("password.error.minLength") })
      .max(20, { message: t("password.error.maxLength") }),
  });

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
        description: t("signInSuccess"),
      });
      setTimeout(() => {
        setIsPending(false);
        router.push("/app/profile");
      }, 5000);
    }
  }

  const onGoogleSignInClicked = async () => {
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
  };

  return (
    <Form {...form}>
      <Image
        className=""
        src={"/socialmood-logo.svg"}
        width={163}
        height={70}
        alt={"SocialMood Logo"}
      />
      <h1 className="text-3xl font-bold text-white">{t("title")}</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 w-full px-20 py-5"
      >
        <FormField
          control={form.control}
          name="correo_electronico"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-white">
                {t("email.label")}
              </FormLabel>
              <FormControl>
                <Input
                  className="w-full px-3 py-2 
                            rounded-[15px] 
                            focus:outline-none focus:ring-2 focus:ring-primary 
                            bg-white/40 text-white"
                  autoComplete="email"
                  placeholder={t("email.placeholder")}
                  {...field}
                />
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
              <FormLabel className="block text-sm font-medium text-white">
                {t("password.label")}
              </FormLabel>
              <FormControl>
                <Input
                  className="w-full px-3 py-2 
                            rounded-[15px] 
                            focus:outline-none focus:ring-2 focus:ring-primary 
                            bg-white/40 text-white"
                  autoComplete="current-password"
                  type="password"
                  placeholder={t("password.placeholder")}
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
            defaultText={t("submit")}
            pendingText={t("signingIn")}
            type="submit"
          />
        </div>
        <div>
          <SocialButton
            customStyle="w-full"
            isPending={isPending}
            variant="google"
            defaultText={t("signInWithGoogle")}
            pendingText={t("signingIn")}
            type="button"
            icon="gg"
            onClick={onGoogleSignInClicked}
          />
        </div>
        <p className="text-sm text-white text-center">
          {t("noAccount")}{" "}
          <Link
            href="/app/sign-up"
            className="font-medium text-white hover:underline"
          >
            {t("signUp")}
          </Link>
        </p>
      </form>
    </Form>
  );
}
