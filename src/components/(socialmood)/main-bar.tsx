"use client"
import { usePathname } from 'next/navigation';
import UserProfile from "@/components/(socialmood)/user-profile";
import { getActiveUserName } from '@/app/actions/(socialmood)/auth.actions'
import React, { useEffect, useState } from 'react'


export default function MainBar() {

  const [userName, setUserName] = useState<string>("")

  const fetchUserName = async () => {
    const result = await getActiveUserName()
    if (typeof result === 'string') {
      setUserName(result)
    } else {
      console.error(result.error)
    }
  }

  useEffect(() => {
    fetchUserName()
  }, [])

  const pathname = usePathname();

  // Determina el título y la frase basados en la ruta actual
  const getContent = () => {
    switch (pathname) {
      case '/app/listado/respuestas':
        return {
          title: 'Respuestas',
          phrase: 'Revisa las respuestas automaticas de tus interacciones.'
        };
      case '/app/reglas':
        return {
          title: 'Reglas',
          phrase: 'Configura las reglas para tus respuestas automaticas.'
        };
      case '/app/listado-interacciones':
        return {
          title: 'Interacciones',
          phrase: 'Supervisa las interacciones de tus redes sociales.'
        };
      case '/reports':
        return {
          title: 'Informes y Analíticas',
          phrase: 'Analiza los informes y las estadísticas.'
        };
      default:
        return {
          title: 'Hola, ' + userName,
          phrase: 'Supervisa los moods de todas tus redes sociales.'
        };
    }
  };

  const { title, phrase } = getContent();

  return (
    <div>
      <header className="mt-16 mb-10 px-6 text-white flex justify-between items-center">
        <div>
          <h1 className="py-3 text-4xl font-semibold">
            {title}
          </h1>
          <p className="text-lg text-gray-400">
            {phrase}
          </p>
        </div>
        <UserProfile />
      </header>
    </div>
  );
}