"use client"
import React from 'react'
import {useRouter} from 'next/navigation';


function ListadoUsuariosPage() {
  const router = useRouter();

  const handleCrearSubscripcion = () => {
    router.push("/bo/create-user");
  };

  return (
    <div>
        <h1> Listado de usuarios </h1>
        <button className="btn w-8 h-8 bg-[#D24EA6] rounded-lg" onClick={handleCrearSubscripcion}>
          <span className="text-white text-2xl">+</span>
        </button>
    </div>
  )
}

export default ListadoUsuariosPage