"use client"
import React from 'react'
import { ArrowLeft, Edit, Plus, X } from "lucide-react"
import { User } from "lucide-react"
import BlurredContainer from "@/components/(socialmood)/blur-background"

function UserSettingsCard() {
  return (
    <BlurredContainer customStyle='max-h-[30vh]'>

<div className='flex gap-x-3 items-center w-full'>

    <div className="w-52 h-32 text-7xl bg-emerald-500 rounded-full flex items-center justify-center mr-1">
        😎
    </div>

            <div className="flex-col items-center w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Allen Silverio</h2>
              <button aria-label="Editar perfil">
                <Edit className="w-5 h-5" />
              </button>
            </div>
             
              <div className='mb-2'>
                <p className="text-sm mb-2">Nombre de usuario</p>
                <input
                  type="text"
                  value="@allensilverio2"
                  className="bg-white text-sm text-black rounded-md px-4 py-1 w-full"
                  readOnly
                />
              </div>

              <div>
              <p className="text-sm mb-2">Correo electrónico</p>
              <input
                type="email"
                value="allensilverio@gmail.com"
                className="bg-white text-sm text-black rounded-md px-4 py-1 w-full"
                readOnly
              />
            </div>

            </div>
            </div>
  
        </BlurredContainer>
  )
}

export default UserSettingsCard