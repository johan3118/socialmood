"use client"
import React from 'react'
import { ArrowLeft, Edit, Plus, X } from "lucide-react"
import { User } from "lucide-react"
import BlurredContainer from "@/components/(socialmood)/blur-background"

function SocialMediaCard() {
  return (
<BlurredContainer>


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
    </BlurredContainer>
    
  )
}

export default SocialMediaCard