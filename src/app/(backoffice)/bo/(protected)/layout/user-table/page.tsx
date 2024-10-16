"use client"
import React from 'react'
import UserTable from '@/components/(backoffice)/users-table'
import {useRouter} from 'next/navigation';


function ListadoUsuariosPage() {
  const router = useRouter();

  const handleCrearSubscripcion = () => {
    router.push("/bo/create-user");
  };

  return (
    <div className='my-10 mx-8 border shadow-lg border-black rounded-lg shadow-3xl'>
      <UserTable />
    </div>
  )
}

export default ListadoUsuariosPage