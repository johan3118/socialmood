"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { getColors, getSocialPlatforms, insertSocialAccount } from "@/app/actions/(socialmood)/social.actions";
import Image from "next/image";
import { loginWithFacebook, getFacebookAccounts, exchangeForLongLivedToken, debugToken } from "@/app/api/meta/meta";

type AddSocialFormValues = z.infer<typeof AddSocialSchema>;

interface AddSocialFormProps {
  onClose: () => void;
}

interface SocialPlatform {
  name: string;
  icon: string;
  value: string;
  id: string;
}

interface ColorOption {
  name: string;
  value: string;
  id: string;
}

interface Account {
  id: string;
  name: string;
  access_token: string;
}

const AddSocialForm: React.FC<AddSocialFormProps> = ({ onClose }) => {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [colors, setColors] = useState<ColorOption[]>([]);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null); // Estado para el color seleccionado

  

  // Configuración del formulario
  const form = useForm<AddSocialFormValues>({
    resolver: zodResolver(AddSocialSchema),
    defaultValues: {
      platform: "",
      account: "",
      color: "",
    },
  });

  // Obtener plataformas de redes sociales
  const fetchPlatforms = useCallback(async () => {
    try {
      const fetchedPlatforms = await getSocialPlatforms();
      setPlatforms(fetchedPlatforms);
    } catch {
      toast({
        variant: "destructive",
        description: "Error al cargar las plataformas de redes sociales.",
      });
    }
  }, []);

  const fetchAccounts = async () => {
    try {
      const accountsData = await getFacebookAccounts(); // Obtener cuentas
      setAccounts(accountsData);
    } catch (err) {
      console.log(err);
    }

  }

  // Obtener opciones de colores
  const fetchColors = useCallback(async () => {
    try {
      const fetchedColors = await getColors();

      setColors(fetchedColors);
    } catch {
      toast({
        variant: "destructive",
        description: "Error al cargar los colores.",
      });
    }
  }, []);

  // Manejar la selección del color
const handleColorSelection = (colorValue: string) => {
  form.setValue("color", colorValue); // Actualiza el valor del formulario
  setSelectedColor(colorValue);       // Actualiza el estado del color seleccionado
};


  // Fetch inicial para plataformas y colores
  useEffect(() => {
    fetchPlatforms();
    fetchColors();
  }, [fetchPlatforms, fetchColors]);

  // Manejar la selección de una plataforma y cargar las cuentas asociadas si es Facebook
  const handlePlatformSelection = async (platform: string) => {
    form.setValue("platform", platform);

    if (platform === "Facebook") {
      try {

        loginWithFacebook((authResponse) => {
          if (authResponse) {
            fetchAccounts();
          } else {
            console.log("Error en la autenticación de Facebook");
          }
        });

        toast({
          variant: 'default',
          description: 'La autenticación fue exitosa, selecciona tu cuenta',
        });

      } catch (error) {
        console.error('Error loading Facebook SDK:', error);
        toast({
          variant: 'destructive',
          description: 'Error al cargar el SDK de Facebook.',
        });
      }
    }
  };

// Guardar la cuenta seleccionada
const handleAccountSave = async (account: Account, selectedPlatformId: string, selectedColorId: string) => {
  try {
    // Cambiar el short-lived access token por un long-lived access token y obtener también los segundos restantes
    const { access_token } = await exchangeForLongLivedToken(account.access_token);
    const {data_access_expires_at} = await debugToken(access_token);
    
    
    // Crear el objeto para el insert
    const socialAccount = {
      llave_acceso: access_token,             // El token de larga duración obtenido
      usuario_cuenta: account.name,           // El nombre de usuario de la cuenta
      codigo_cuenta: account.id,              // El ID de la cuenta
      fecha_vencimiento_acceso: data_access_expires_at, // Fecha de vencimiento en timestamp Unix (en segundos)
      id_subscripcion: 19,                     // Suponiendo que ya tienes esta información
      id_red_social: parseInt(selectedPlatformId),      // El ID de la plataforma seleccionada
      id_color: parseInt(selectedColorId),              // El ID del color seleccionado
    };

    console.log(socialAccount);

    // Insertar la cuenta en la base de datos
    const insertedAccount = await insertSocialAccount(socialAccount);
    console.log(insertedAccount);
    
    console.log('Cuenta social guardada con éxito');
  } catch (error) {
    console.error('Error al guardar la cuenta social:', error);
  }
};



 // Envío del formulario
const onSubmit = async (values: AddSocialFormValues) => {
  // Buscar la cuenta seleccionada
  const selectedAccount = accounts.find(acc => acc.id === values.account);
  
  // Buscar la plataforma y color seleccionados por su valor
  const selectedPlatform = platforms.find(plat => plat.value === values.platform);
  const selectedColor = colors.find(col => col.value === values.color);
  
  if (selectedAccount && selectedPlatform && selectedColor) {
    // Guardar la cuenta seleccionada pasando los IDs de plataforma y color
    await handleAccountSave(selectedAccount, selectedPlatform.id, selectedColor.id);

    toast({
      variant: "default",
      description: `Red social agregada: Plataforma ${values.platform}, Cuenta ${selectedAccount.name}, Color ${values.color}`,
    });

    form.reset();
  } else {
    toast({
      variant: "destructive",
      description: "Error al seleccionar plataforma o color.",
    });
  }
};


  return (
    <div className="w-[60vh] flex items-center justify-center">
      <BlurredContainer>
        <div className="p-6 relative">
          <button className="absolute right-4 top-4 text-gray-400 hover:text-white" onClick={onClose}>
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
                          handlePlatformSelection(value);
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
                                  <Image src={platform.icon} width="30" height="30" alt={`${platform.name} icon`} />
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
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selectedAccount = accounts.find(acc => acc.id === value) || null;
                          setSelectedAccount(selectedAccount);
                          console.log("Selected account:", selectedAccount);
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full px-3 py-2 rounded-[12px] border-transparent focus:outline-none focus:ring-2 focus:ring-primary bg-[#FFFFFF] text-black">
                          <SelectValue placeholder="Elegir cuenta" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.length > 0 ? (
                            accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name}
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
                      <div className="flex space-x-2 justify-around px-10">
                        {colors.length > 0 ? (
                          colors.map((color) => (
                            <button
                            key={color.value}
                            type="button"
                            className={`w-8 h-8 rounded-full ${
                              selectedColor === color.value ? 'ring-2 ring-white' : ''
                            }`} // Añadir aro blanco si está seleccionado
                            style={{ backgroundColor: color.value }}
                            onClick={() => handleColorSelection(color.value)}
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

              <hr className="border-solid border-gray-400" />

              <p className="text-xs text-center text-gray-300">
                Usted será redirigido a la aplicación de la red social para autorizar el acceso a su cuenta de Instagram.
              </p>

              <Button className="w-full mt-4" type="submit">
                Agregar Red Social
              </Button>
            </form>
          </Form>
        </div>
      </BlurredContainer>
    </div>
  );
};

export default AddSocialForm;
