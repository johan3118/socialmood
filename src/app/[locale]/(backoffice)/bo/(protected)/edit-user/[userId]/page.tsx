"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  getUserById,
  updateUserById,
} from "@/app/actions/(backoffice)/user.actions";
import UserForm from "@/components/(backoffice)/edit-user-form";
import { useTranslations } from "next-intl";

interface FormData {
  nombre: string;
  apellido: string;
  correo: string;
  direccion: string;
  password: string;
  confirmPassword: string;
  tipoUsuario: string;
}

export default function EditUserPage() {
  const t = useTranslations("editUser");
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    correo: "",
    direccion: "",
    password: "",
    confirmPassword: "",
    tipoUsuario: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const userId = parseInt(params.userId, 10);

  // Cargar los datos del usuario al iniciar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const user = await getUserById(userId);
        if (user) {
          setFormData({
            nombre: user.nombre || "",
            apellido: user.apellido || "",
            correo: user.correo || "",
            direccion: user.direccion || "",
            password: "",
            confirmPassword: "",
            tipoUsuario: user.tipo_usuario || "",
          });
        } else {
          setError(t("errorNotFound"));
        }
      } catch (err) {
        setError(t("errorFetching"));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Manejo del cambio de inputs
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Función para regresar a la vista anterior
  const handleBack = () => {
    router.push("/bo/layout/user-table"); // Ajusta la ruta según tu aplicación
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene la acción por defecto del formulario

    setIsLoading(true);
    setError(null);
    try {
      await updateUserById(userId, formData);
      alert(t("success"));
      router.push("/bo/layout/user-table"); // Redirige a la lista de usuarios tras actualizar
    } catch (err) {
      setError(t("errorUpdating"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white flex-grow">
      <div className="flex-1 p-20">
        <div className="flex">
          <ChevronLeft
            className="mr-2 h-10 w-10 cursor-pointer"
            onClick={handleBack}
          />
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        </div>
        <p className="text-gray-500 mb-6">{t("description")}</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {isLoading ? (
          <p>{t("loading")}</p>
        ) : (
          <UserForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit} // Asegúrate de pasar el handleSubmit aquí
          />
        )}
      </div>
    </div>
  );
}
