"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import BlurredContainer from "@/components/(socialmood)/blur-background";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { AddSocialSchema } from "@/types";
import {
  getColors,
  getSocialPlatforms,
  insertSocialAccount,
} from "@/app/actions/(socialmood)/social.actions";
import Image from "next/image";
import {
  loginWithFacebook,
  getFacebookAccounts,
  exchangeForLongLivedToken,
  debugToken,
} from "@/app/api/meta/meta";
import {
  getSubscription,
  getActiveUserId,
} from "@/app/actions/(socialmood)/auth.actions";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type AddSocialFormValues = z.infer<typeof AddSocialSchema>;

interface AddSocialFormProps {
  onClose: () => void;
  onFormSubmit: () => void;
}

export default function AddSocialForm({
  onClose,
  onFormSubmit,
}: AddSocialFormProps) {
  const t = useTranslations("socialmood.profile.social");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const router = useRouter();

  const form = useForm<AddSocialFormValues>({
    resolver: zodResolver(AddSocialSchema),
    defaultValues: {
      platform: "",
      color: "",
    },
  });

  useEffect(() => {
    const loadOptions = async () => {
      const platformsData = await getSocialPlatforms();
      const colorsData = await getColors();
      setPlatforms(platformsData);
      setColors(colorsData);
    };
    loadOptions();
  }, []);

  const onSubmit = async (data: AddSocialFormValues) => {
    try {
      if (data.platform === "Facebook") {
        await loginWithFacebook();
      }
      await insertSocialAccount(data);
      toast({
        title: t("accountAdded"),
        description: t("accountAddedDescription"),
      });
      onFormSubmit();
      onClose();
    } catch (error) {
      console.error("Error adding social account:", error);
      toast({
        title: t("errors.addAccountError"),
        description: t("errors.tryAgain"),
        variant: "destructive",
      });
    }
  };

  return (
    <BlurredContainer customStyle="max-w-md mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">{t("addAccount")}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("selectPlatform")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("selectPlatformPlaceholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("selectColor")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectColorPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{t("common.save")}</Button>
          </div>
        </form>
      </Form>
    </BlurredContainer>
  );
}
