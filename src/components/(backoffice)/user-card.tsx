import { User } from "lucide-react"
import { getActiveUserName } from '@/app/actions/(backoffice)/auth.actions'
import React, { useEffect, useState } from 'react'



interface UserCardProps {
  onShowSettings: () => void
}

export default function UserCard({ onShowSettings }: UserCardProps) {

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

  return (
    <button className="flex items-center space-x-2" onClick={onShowSettings}>
      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-1">
        <User className="text-white" />
      </div>
      <div className='text-left'>
        <p className="font-medium">{userName}</p>
        <p className="text-xs text-gray-400">Gestor de operaciones</p>
      </div>
    </button>
  )
}