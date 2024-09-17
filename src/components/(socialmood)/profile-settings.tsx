import React from 'react'
import { ArrowLeft, Edit, Plus, X } from "lucide-react"
import { User } from "lucide-react"
import UserSettingsCard from '@/components/(socialmood)/user-settings-card'
import UserCurrentPlanCard from '@/components/(socialmood)/user-current-plan-card'
import SocialMediaCard from '@/components/(socialmood)/social-media-card'
import TeamCard from '@/components/(socialmood)/team-card'

interface ProfileSettingsProps {
  onClose: () => void
}

export default function ProfileSettings({ onClose }: ProfileSettingsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#2D2A37] text-white p-6 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <header className="flex items-center mb-8">
          <button onClick={onClose} className="mr-4" aria-label="Volver">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Ajustes de Perfil</h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Card */}
          <UserSettingsCard/>
          {/* User Card */}

          {/* User Current Plan Card */}
          <UserCurrentPlanCard/>
          {/* User Current Plan Card */}

           {/* Social Media Card */}
          <SocialMediaCard/>
           {/* Social Media Card */}

          <TeamCard/>
        </div>
      </div>
    </div>
  )
}