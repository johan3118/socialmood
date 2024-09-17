"use client"
import React, { useState } from 'react'
import { ChevronDown, ChevronUp, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface MenuItem {
  id: string
  label: string
  route: string
  icon?: React.ReactNode
  subItems?: SubMenuItem[]
}

interface SubMenuItem {
  id: string
  label: string
  route: string
  color: string
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Informes y analíticas',
    route: '/app/dashboard',
    icon: <span className="text-xl">📊</span>,
  },
  {
    id: 'interactions',
    label: 'Interacciones',
    route: '/app/listado-interacciones',
    icon: <span className="text-xl">💬</span>,
    subItems: [
      { id: 'interactions', label: 'Interacciones', route: '/app/listado-interacciones', color: '#F59E0B' },
      { id: 'responses', label: 'Respuestas', route: '/app/listado-interacciones', color: '#10B981' },
      { id: 'rules', label: 'Reglas', route: '/app/listado-interacciones', color: '#F59E0B' },
      
    ],
  },
]

export default function Sidebar() {
  const [expandedItem, setExpandedItem] = useState<string | null>('interactions')
  const [selectedItem, setSelectedItem] = useState<string>('responses')
  const router = useRouter()

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id)
  }

  const handleRoute = (route: string) => {
    setSelectedItem(route)
    router.push(route)
  }

  return (
    <div className="w-64 h-screen bg-[#241F2C] text-white p-6 flex flex-col">
      <div className="mb-10 mt-6 pl-5">
        <div className="w-36 h-8 flex items-center justify-center text-sm">
        <Image className="" src={"/socialmood-logo.svg"} width={200} height={100} alt={""} />
        </div>
      </div>

      <nav className="flex-grow">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-2">
            <button
              className={`w-full text-left p-2 rounded flex items-center justify-between ${
                selectedItem === item.id ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
              onClick={() => item.subItems ? toggleExpand(item.id) : handleRoute(item.route)}
            >
              <span className="flex items-center">
                {item.icon && <span className="mr-3">{item.icon}</span>}
                {item.label}
              </span>
              {item.subItems && (
                expandedItem === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />
              )}
            </button>
            {item.subItems && expandedItem === item.id && (
              <div className="ml-6 mt-2 space-y-2">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    className={`w-full text-left p-2 rounded flex items-center ${
                      selectedItem === subItem.id ? 'bg-gray-700' : 'hover:bg-gray-800'
                    }`}
                    onClick={() => handleRoute(subItem.route)}
                  >
                    <span
                      className="w-2 h-2 rounded-full mr-3"
                      style={{ backgroundColor: subItem.color }}
                    ></span>
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <button className="mt-auto p-2 rounded hover:bg-gray-800 flex items-center">
        <LogOut size={18} className="mr-3" />
        Cerrar sesión
      </button>
    </div>
  )
}
