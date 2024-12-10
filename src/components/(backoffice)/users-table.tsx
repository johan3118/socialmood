"use client";
import React, { useEffect, useState } from "react";
import { selectAllUsers } from "@/app/actions/(backoffice)/user.actions";
import { useRouter } from "next/navigation";

interface Usuarios {
  userId: string;
  nombre: string;
  apellido: string;
  direccion: string;
  tipo_usuario: string;
  correo: string;
}

const UserTable: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setIsLoading(true);
        const usuario = await selectAllUsers();
        setUsuarios(usuario.map((u: any) => ({ ...u, userId: u.userId.toString() })));
      } catch (error: any) {
        console.error("Error al cargar los usuarios:", error);
        setError("No se pudo cargar la lista de usuarios. Intente nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const handleCrearUsuario = () => {
    router.push("/bo/create-user");
  };

  const handleEditUser = (userId: string) => {
    router.push(`/bo/edit-user/${userId}`);
  };

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between mb-6 ">
        <h2 className="text-xl font-bold">Listado de Usuarios</h2>
        <button
          className="btn w-8 h-8 bg-[#D24EA6] rounded-lg flex items-center justify-center"
          onClick={handleCrearUsuario}
        >
          <span className="text-white text-2xl">+</span>
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        <table className="min-w-full bg-white rounded-lg border-t table-auto">
          <thead className="bg-[#422EA3] text-white">
            <tr>
              <th className="py-3 px-4 text-left">Id</th>
              <th className="py-3 px-4 text-center">Nombre</th>
              <th className="py-3 px-4 text-center">Apellido</th>
              <th className="py-3 px-4 text-center">Dirección</th>
              <th className="py-3 px-4 text-center">Tipo de Usuario</th>
              <th className="py-3 px-4 text-center">Correo Electrónico</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.userId}>
                <td className="py-3 px-4">{usuario.userId}</td>
                <td className="py-3 px-4 text-center">{usuario.nombre}</td>
                <td className="py-3 px-4 text-center">{usuario.apellido}</td>
                <td className="py-3 px-4 text-center">{usuario.direccion}</td>
                <td className="py-3 px-4 text-center">{usuario.tipo_usuario}</td>
                <td className="py-3 px-4 text-center">{usuario.correo}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    className="text-gray-500 hover:text-gray-800"
                    onClick={() => handleEditUser(usuario.userId)}
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default UserTable;
