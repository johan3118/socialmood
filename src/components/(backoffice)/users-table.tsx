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
  const [sortConfig, setSortConfig] = useState<{ key: keyof Usuarios; direction: "asc" | "desc" } | null>(null);
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

  const handleChangePassword = (userId: string) => {
    router.push(`/bo/change-password/${userId}`);
  };

  const handleSort = (key: keyof Usuarios) => {
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig?.key === key && prevSortConfig.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedUsuarios = React.useMemo(() => {
    if (!sortConfig) return usuarios;

    return [...usuarios].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [usuarios, sortConfig]);

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
              {[
                { label: "Id", key: "userId" },
                { label: "Nombre", key: "nombre" },
                { label: "Apellido", key: "apellido" },
                { label: "Dirección", key: "direccion" },
                { label: "Tipo de Usuario", key: "tipo_usuario" },
                { label: "Correo Electrónico", key: "correo" },
              ].map((header) => (
                <th
                  key={header.key}
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort(header.key as keyof Usuarios)}
                >
                  {header.label}
                  {sortConfig?.key === header.key && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsuarios.map((usuario) => (
              <tr key={usuario.userId}>
                <td className="py-3 px-4 text-left">{usuario.userId}</td>
                <td className="py-3 px-4 text-left">{usuario.nombre}</td>
                <td className="py-3 px-4 text-left">{usuario.apellido}</td>
                <td className="py-3 px-4 text-left">{usuario.direccion}</td>
                <td className="py-3 px-4 text-left">{usuario.tipo_usuario}</td>
                <td className="py-3 px-4 text-left">{usuario.correo}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    className="text-gray-500 hover:text-gray-800"
                    onClick={() => handleEditUser(usuario.userId)}
                  >
                    ✏️
                  </button>
                  <button
                    className="text-gray-500 hover:text-gray-800"
                    onClick={() => handleChangePassword(usuario.userId)}
                  >
                    🔒
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
