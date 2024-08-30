import { z } from "zod";
export const SignUpSchema = z
  .object({
    nombre: z.string().min(2).max(50),
    apellido: z.string().min(2).max(50),
    direccion: z.string().min(10).max(100),
    correo_electronico: z.string().email().min(10).max(100),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export const SignInSchema = z.object({
  nombre: z.string().min(2).max(50),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});
