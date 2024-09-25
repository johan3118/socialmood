import { z } from "zod";
export const SignUpSchema = z
  .object({
    nombre: z
      .string()
      .min(2, { message: "Debe tener como mínimo 2 caracteres" })
      .max(50, { message: "El máximo de caracteres es 50" }),
    apellido: z
      .string()
      .min(2, { message: "Debe tener como mínimo 2 caracteres" })
      .max(50, { message: "El máximo de caracteres es 50" }),
    direccion: z
      .string()
      .min(10, { message: "Debe tener como mínimo 10 caracteres" })
      .max(100, { message: "El máximo de caracteres es 100" }),
    correo_electronico: z
      .string()
      .email({ message: "Correo electrónico no válido" })
      .min(10, { message: "Debe tener como mínimo 2 caracteres" })
      .max(100, { message: "El máximo de caracteres es 100" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener como mínimo 8 caracteres" })
      .max(20, { message: "El máximo de caracteres es 20" }),
    confirmPassword: z
      .string()
      .min(8, { message: "La contraseña debe tener como mínimo 8 caracteres" })
      .max(20, { message: "El máximo de caracteres es 20" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas con coinciden",
    path: ["confirmPassword"],
  });


export const SignInSchema = z.object({
  correo_electronico: z
    .string()
    .email({ message: "Correo electrónico no válido" })
    .min(10, { message: "Debe tener como mínimo 10 caracteres" })
    .max(100, { message: "El máximo de caracteres es 100" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener como mínimo 8 caracteres" })
    .max(20, { message: "El máximo de caracteres es 20" }),
});

export type VariantType =
  | "default"
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "google"
  | "angry"
  | "link"
  | null
  | undefined;

export type SizeType =
  | "default"
  | "defaultBold"
  | "sm"
  | "smBold"
  | "lg"
  | "lgBold"
  | "icon"
  | "gg"
  | "angry"
  | null
  | undefined;

export type IconType = "ig" | "fb" | "gg" | "ag" | "angry";

export type ButtonType = "button" | "submit" | "reset";

export const CreateUserSchema = z
  .object({
    nombre: z
      .string()
      .min(2, { message: "Debe tener como mínimo 2 caracteres" })
      .max(50, { message: "El máximo de caracteres es 50" }),
    apellido: z
      .string()
      .min(2, { message: "Debe tener como mínimo 2 caracteres" })
      .max(50, { message: "El máximo de caracteres es 50" }),
    direccion: z
      .string()
      .min(10, { message: "Debe tener como mínimo 10 caracteres" })
      .max(100, { message: "El máximo de caracteres es 100" }),
    correo: z
      .string()
      .email({ message: "Correo electrónico no válido" })
      .min(10, { message: "Debe tener como mínimo 2 caracteres" })
      .max(100, { message: "El máximo de caracteres es 100" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener como mínimo 8 caracteres" })
      .max(20, { message: "El máximo de caracteres es 20" }),
    confirmPassword: z
      .string()
      .min(8, { message: "La contraseña debe tener como mínimo 8 caracteres" })
      .max(20, { message: "El máximo de caracteres es 20" }),
    tipoUsuario: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas con coinciden",
    path: ["confirmPassword"],
  });

  // Add Social Media Account Schema
export const AddSocialSchema = z.object({
  platform: z.string().min(1, { message: "Debe seleccionar una plataforma" }),
  account: z.string().min(1, { message: "Debe seleccionar una cuenta" }),
  color: z.string().min(1, { message: "Debe seleccionar un color" }),
});

export type Interacciones = {
  fecha_recepcion: string;
  fecha_respuesta: Date | null; 
  mensaje: string; 
  enlace_publicacion: string; 
  codigo_cuenta_emisor: string; 
  enlace_foto_emisor: string;
  codigo_cuenta_receptor: string; 
  id_cuenta_receptor: number; 
  nombre_red_social_receptor: string; 
  categoria: string; 
  subcategoria: string;
  emociones_predominantes: string; 
  respondida: boolean; 
  respuesta: string | null; 
  usuario_cuenta_receptor: string; 
  usuario_cuenta_emisor: string;
};