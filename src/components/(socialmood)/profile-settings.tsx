import React from 'react'
import { ArrowLeft, Edit, Plus, X } from "lucide-react"
import { User } from "lucide-react"

interface ProfileSettingsProps {
  onClose: () => void
}

export default function ProfileSettings({ onClose }: ProfileSettingsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#2D2A37] text-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <header className="flex items-center mb-8">
          <button onClick={onClose} className="mr-4" aria-label="Volver">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Ajustes de Perfil</h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#3D3A47] rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Allen Silverio</h2>
              <button aria-label="Editar perfil">
                <Edit className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <p className="text-sm mb-2">Nombre de usuario</p>
                <input
                  type="text"
                  value="@allensilverio2"
                  className="bg-[#2D2A37] rounded-full px-4 py-2 w-full"
                  readOnly
                />
              </div>
            </div>
            <div>
              <p className="text-sm mb-2">Correo electrónico</p>
              <input
                type="email"
                value="allensilverio@gmail.com"
                className="bg-[#2D2A37] rounded-full px-4 py-2 w-full"
                readOnly
              />
            </div>
          </div>
          <div className="bg-[#3D3A47] rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Plan Actual</h2>
              <button aria-label="Editar plan">
                <Edit className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm mb-2">Próximo pago: $25 el Sep 15, 2024</p>
            <p className="text-xl font-bold mb-4">Plan Básico $25/mensual</p>
            <p className="text-sm mb-2">Método de pago</p>
            <div className="flex items-center justify-between">
              <span>PayPal</span>
              <button aria-label="Editar método de pago">
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="bg-[#3D3A47] rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Redes Sociales</h2>
              <div className="flex items-center">
                <button aria-label="Editar redes sociales">
                  <Edit className="w-5 h-5 mr-2" />
                </button>
                <button aria-label="Añadir red social">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: "@tutienda.do", platform: "Instagram", status: "activo" },
                { name: "@tutienda.do", platform: "Facebook", status: "inactivo" },
                { name: "@tutienda.do", platform: "TikTok", status: "inactivo" },
              ].map((social, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full mr-2 ${
                      social.platform === "Instagram" ? "bg-pink-500" :
                      social.platform === "Facebook" ? "bg-blue-500" : "bg-purple-500"
                    }`}></div>
                    <span>{social.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                      social.status === "activo" ? "bg-green-500" : "bg-red-500"
                    }`}>
                      {social.status}
                    </span>
                    <button aria-label={`Eliminar ${social.platform}`}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#3D3A47] rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Usuarios</h2>
              <div className="flex items-center">
                <button aria-label="Editar usuarios">
                  <Edit className="w-5 h-5 mr-2" />
                </button>
                <button aria-label="Añadir usuario">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: "Paola Saldana", platform: "Instagram", status: "activo" },
                { name: "Pazzis Paulino", platform: "Facebook", status: "inactivo" },
                { name: "Johan Contreras", platform: "TikTok", status: "inactivo" },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{user.name}</span>
                  <div className="flex items-center">
                    <div className={`px-2 py-1 rounded-full text-xs mr-2 ${
                      user.platform === "Instagram" ? "bg-pink-500" :
                      user.platform === "Facebook" ? "bg-blue-500" : "bg-purple-500"
                    }`}>
                      {user.platform}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                      user.status === "activo" ? "bg-green-500" : "bg-red-500"
                    }`}>
                      {user.status}
                    </span>
                    <button aria-label={`Eliminar ${user.name}`}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}