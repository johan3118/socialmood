import React from 'react'
import { User } from "lucide-react"

interface UserCardProps {
  onShowSettings: () => void
}

export default function UserCard({ onShowSettings }: UserCardProps) {
  return (
    <button className="flex items-center space-x-2" onClick={onShowSettings}>
      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-1">
        <User className="text-white" />
      </div>
      <div className='text-left'>
        <p className="font-medium">Allen Silverio</p>
        <p className="text-xs text-gray-400">Usuario</p>
      </div>
    </button>
  )
}