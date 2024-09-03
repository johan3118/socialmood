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