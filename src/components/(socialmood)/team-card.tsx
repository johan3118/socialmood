"use client"
import React from 'react'
import { ArrowLeft, Edit, Plus, X } from "lucide-react"
import { User } from "lucide-react"
import BlurredContainer from "@/components/(socialmood)/blur-background"

function TeamCard() {
  return (
    <BlurredContainer customStyle='max-h-[30vh]'>
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
            </BlurredContainer>
  )
}

export default TeamCard