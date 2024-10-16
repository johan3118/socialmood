"use client";
import React, { useEffect, useState } from "react";
import { selectAllUsers} from "@/app/actions/(backoffice)/user.actions";
import {useRouter} from 'next/navigation';

interface Usuarios {
  userId: string;
  nombre: string;
  apellido: string;
  direccion: string;
  tipo_usuario: string;
  correo: string;
}

const UserTable: React.FC = () => {
  // Estado para manejar los planes obtenidos de la base de datos
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const router = useRouter();

  // Efecto para cargar los planes al montar el componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const usuario = await selectAllUsers(); // Llamada a la función para obtener todos los planes
        console.log(usuario);
        setUsuarios(usuario);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleCrearUsuario = () => {
    router.push("/bo/create-user");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Listado de Usuarios</h2>
        <button className="btn w-8 h-8 bg-[#D24EA6] rounded-lg" onClick={handleCrearUsuario}>
          <span className="text-white text-2xl">+</span>
        </button>
      </div>
      

      <table className="min-w-full bg-white rounded-lg overflow-hidden border-t">
        <thead className="bg-[#422EA3] text-white">
          <tr>
            <th className="py-3 px-4 text-left">Id</th>
            <th className="py-3 px-4 text-center">Nombre</th>
            <th className="py-3 px-4 text-center">Apellido</th>
            <th className="py-3 px-4 text-center">Direccion</th>
            <th className="py-3 px-4 text-center">Tipo de usuarios</th>
            <th className="py-3 px-4 text-center">Correo Electronico</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.userId} className="">
              <td className="py-6 px-4">{usuario.userId}</td>
              <td className="py-3 px-4 text-center">{usuario.nombre}</td>
              <td className="py-3 px-4 text-center">{usuario.apellido}</td>
              <td className="py-3 px-4 text-center">{usuario.direccion}</td>
              <td className="py-3 px-4 text-center">{usuario.tipo_usuario}</td>
              <td className="py-3 px-4 text-center">{usuario.correo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
