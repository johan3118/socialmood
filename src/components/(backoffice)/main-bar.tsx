"use client"
import { usePathname } from 'next/navigation';
import UserProfile from "@/components/(backoffice)/user-profile";


export default function MainBar() {
  const pathname = usePathname();

  // Determina el título y la frase basados en la ruta actual
  const getContent = () => {
    switch (pathname) {
      case '/bo/layout/sub-table':
        return {
          title: 'Subscripciones'
        };
      case '/bo/layout/user-table':
        return {
          title: 'Usuarios'
        };

      default:
        return {
          title: 'Hola, Admin'
        };
    }
  };

  const { title } = getContent();

  return (
    <div>
      <header className="mt-16 mb-10 text-[#241F2C] px-6 flex justify-between items-center">
        <div>
          <h1 className="py-3 text-4xl font-semibold">
            {title}
          </h1>
        </div>
        <UserProfile />
      </header>
    </div>
  );
}