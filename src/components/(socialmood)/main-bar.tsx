"use client"
import { usePathname } from 'next/navigation';
import UserProfile from "@/components/(socialmood)/user-profile";
import SearchBar from "@/components/(socialmood)/searchbar"; 
import SocialButton from "@/components/(socialmood)/social-button"; 

export default function MainBar() {
  const pathname = usePathname();

  // Determina el título y la frase basados en la ruta actual
  const getContent = () => {
    switch (pathname) {
      case '/app/listado/respuestas':
        return {
          title: 'Respuestas',
          phrase: 'Revisa las respuestas automaticas de tus interacciones.'
        };
      case '/app/listado-reglas':
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
          title: 'Hola, Allen Silverio',
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
      <div className='flex mx-12 my-8  space-x-4 '>

        <div className='w-full z-[1]'><SearchBar/></div>
      <SocialButton
            customStyle="w-32"
            variant="default"
            defaultText="Filtros"
            type="submit"
          />
      </div>

    </div>
  );
}