"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Instagram, Facebook, X } from "lucide-react";
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

type AddSocialFormValues = z.infer<typeof AddSocialSchema>;

interface AddSocialFormProps {
  onClose: () => void;
}

interface SocialPlatform {
  name: string;
  icon: JSX.Element;
  value: string;
}

interface ColorOption {
  name: string;
  value: string;
}

export default function AddSocialForm({ onClose }: AddSocialFormProps) {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [accounts, setAccounts] = useState<string[]>([]); // Estado para almacenar cuentas simuladas

  // Hook de formulario con zod y react-hook-form
  const form = useForm<AddSocialFormValues>({
    resolver: zodResolver(AddSocialSchema),
    defaultValues: {
      platform: "",
      account: "",
      color: "",
    },
  });

  // Simulación de fetch de plataformas de redes sociales
  useEffect(() => {
    setTimeout(() => {
      const mockPlatforms: SocialPlatform[] = [
        {
          name: "Instagram",
          icon: <Instagram className="mr-2 h-4 w-4" />,
          value: "instagram",
        },
        {
          name: "Facebook",
          icon: <Facebook className="mr-2 h-4 w-4" />, // Cambiar a icono correcto
          value: "facebook",
        },
      ];
      setPlatforms(mockPlatforms);
    }, 2000); // Simula un retraso de 2 segundos
  }, []);

  // Simulación de fetch de colores desde la "base de datos"
  useEffect(() => {
    setTimeout(() => {
      const mockColors: ColorOption[] = [
        { name: "Amarillo", value: "bg-yellow-500" },
        { name: "Naranja", value: "bg-orange-500" },
        { name: "Rosa", value: "bg-pink-500" },
        { name: "Púrpura", value: "bg-purple-500" },
        { name: "Azul", value: "bg-blue-500" },
      ];
      setColors(mockColors);
    }, 1500); // Simula un retraso de 1.5 segundos
  }, []);

  // Simulación de autenticación y selección de cuentas de usuario
  const handlePlatformSelection = (platform: string) => {
    form.setValue("platform", platform);

    // Simula el proceso de autenticación
    toast({
      variant: "default",
      description: `Redirigiendo a la autenticación de ${platform}`,
    });

    // Simula la obtención de cuentas después de la autenticación
    setTimeout(() => {
      const mockAccounts =
        platform === "instagram"
          ? ["@InstaUser1", "@InstaUser2"]
          : ["@FacebookUser1", "@FacebookUser2"];
      setAccounts(mockAccounts);
      toast({
        variant: "default",
        description: `Autenticación de ${platform} completada. Selecciona la cuenta a asociar.`,
      });
    }, 2000); // Simula un retraso de 2 segundos para autenticarse
  };

  // Manejo de la función de envío del formulario
  async function onSubmit(values: AddSocialFormValues) {

    // Agregar logica para guardar la cuenta de red social asociada

    // Agregar logica para guardar la cuenta de red social asociada

    toast({
      variant: "default",
      description: `Red social agregada: Plataforma ${values.platform}, Cuenta ${values.account}, Color ${values.color}`,
    });
    form.reset();
  }

  return (
    <div className="w-[60vh] flex items-center justify-center">
      <BlurredContainer>
        <div className="p-6 relative">
          <button
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <h2 className="text-2xl font-bold mb-6">Agregar Red Social</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Campo de selección de plataforma */}
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seleccionar plataforma</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handlePlatformSelection(value); // Simula la autenticación
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full px-3 py-2 rounded-[12px] border-transparent focus:outline-none focus:ring-2 focus:ring-primary bg-[#FFFFFF] text-black">
                          <SelectValue placeholder="Seleccionar plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.length > 0 ? (
                            platforms.map((platform) => (
                              <SelectItem key={platform.value} value={platform.value}>
                                <div className="flex items-center">
                                  {platform.icon}
                                  {platform.name}
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled value="loading">
                              Cargando plataformas...
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo de selección de cuenta */}
              <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Elegir cuenta</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full px-3 py-2 rounded-[12px] border-transparent focus:outline-none focus:ring-2 focus:ring-primary bg-[#FFFFFF] text-black">
                          <SelectValue placeholder="Elegir cuenta" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.length > 0 ? (
                            accounts.map((account) => (
                              <SelectItem key={account} value={account}>
                                {account}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled value="loading">
                              Selecciona una plataforma primero
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo de selección de color */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personalizar color</FormLabel>
                    <FormControl>
                      <div className="flex space-x-2 px-12">
                        {colors.length > 0 ? (
                          colors.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              className={`w-8 h-8 rounded-full ${color.value} ${
                                field.value === color.value ? "ring-2 ring-white" : ""
                              }`}
                              onClick={() => field.onChange(color.value)}
                            />
                          ))
                        ) : (
                          <p>Cargando colores...</p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <hr className="border-solid border-gray-400"/>

              <p className="text-xs text-center text-gray-300">Usted sera redirigido a la aplicacion de la red social para autorizar el acceso a su cuenta de Instagram</p>



              <Button className="w-full mt-4" type="submit">
                Agregar Red Social
              </Button>
            </form>
          </Form>
        </div>
      </BlurredContainer>
    </div>
  );
}
