"use client"
import { ArrowLeft, Edit, Plus, X } from "lucide-react"
import { User } from "lucide-react"
import BlurredContainer from "@/components/(socialmood)/blur-background"
import React, { useEffect, useState } from 'react'
import { getActiveUserName, getActiveUserEmail } from '@/app/actions/(socialmood)/auth.actions'

function UserSettingsCard() {

  const [userName, setUserName] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")

  const fetchUserName = async () => {
    const result = await getActiveUserName()
    if (typeof result === 'string') {
      setUserName(result)
    } else {
      console.error(result.error)
    }

    const email = await getActiveUserEmail()
    if (typeof email === 'string') {
      setUserEmail(email)
    } else {
      console.error(email.error)
    }
  }

  useEffect(() => {
    fetchUserName()
  }, [])

  return (
    <BlurredContainer customStyle='h-[30vh] !m-0'>

<div className='flex gap-x-3 items-center w-full'>

    <div className="w-52 h-32 text-7xl bg-emerald-500 rounded-full flex items-center justify-center mr-1">
        😎
    </div>

            <div className="flex-col items-center w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{userName}</h2>
              <button aria-label="Editar perfil">
                <Edit className="w-5 h-5" />
              </button>
            </div>
              <div>
              <p className="text-sm mb-2">Correo electrónico</p>
              <input
                type="email"
                value={userEmail}
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