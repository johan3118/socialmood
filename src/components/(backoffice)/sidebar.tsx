"use client"
import React, { useState } from 'react'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { signOut } from '@/app/actions/(backoffice)/auth.actions'

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dasboard',
    route: '/bo/layout/dashboard',
    icon: <span className="text-xl">📈</span>,
  },
  {
    id: 'users',
    label: 'Usuarios',
    route: '/bo/layout/user-table',
    icon: <span className="text-xl">👤</span>,
  },
  {
    id: 'subscriptions',
    label: 'Subscripciones',
    route: '/bo/layout/sub-table',
    icon: <span className="text-xl">📄</span>,
  },

  
]

export default function Sidebar() {
  const [selectedItem, setSelectedItem] = useState<string>('users')
  const router = useRouter()

  const handleRoute = (route: string) => {
    setSelectedItem(route)
    router.push(route)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/nueva-ruta')  // Cambia '/nueva-ruta' por la ruta deseada
  }

  return (
    <div className="w-64 h-screen bg-[#241F2C] text-white p-6 flex flex-col">
      <div className="mb-10 mt-6 pl-5">
        <div className="w-36 h-8 flex items-center justify-center text-sm">
          <Image src="/socialmood-logo.svg" width={200} height={100} alt="SocialMood Logo" />
        </div>
      </div>

      <nav className="flex-grow">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full text-left p-2 rounded flex items-center justify-between ${
              selectedItem === item.id ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
            onClick={() => handleRoute(item.route)}
          >
            <span className="flex items-center">
              {item.icon && <span className="mr-3">{item.icon}</span>}
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <button className="mt-auto p-2 rounded hover:bg-gray-800 flex items-center" onClick={handleSignOut}>
        <LogOut size={18} className="mr-3" />
        Cerrar sesión
      </button>
    </div>
  )
}
