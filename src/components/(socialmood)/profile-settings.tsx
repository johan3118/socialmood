import React from 'react'
import { ArrowLeft, Edit, Plus, X } from "lucide-react"
import { User } from "lucide-react"
import UserSettingsCard from '@/components/(socialmood)/user-settings-card'
import UserCurrentPlanCard from '@/components/(socialmood)/user-current-plan-card'
import SocialMediaCard from '@/components/(socialmood)/social-media-card'
import TeamCard from '@/components/(socialmood)/team-card'
import { IoIosInformationCircle } from "react-icons/io";
import Modal from '@/components/(socialmood)/modal'
import { useState } from 'react'
import BlurredContainer from './blur-background'
import InstructionCard from './instruction-card'



interface ProfileSettingsProps {
  onClose: () => void
}

export default function ProfileSettings({ onClose }: ProfileSettingsProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 px-[25vh]">
      <div className="bg-[#2C2436] text-white p-10 rounded-3xl w-full overflow-y-auto">
        <header className="flex items-center mb-6 pr-4">
          <button onClick={onClose} className="mr-4" aria-label="Volver">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className='flex justify-between items-center w-full'>
            <h1 className="text-3xl font-bold">Ajustes de Perfil</h1>
            <button className='underline flex items-center font-medium' onClick={openModal}>Ayuda<IoIosInformationCircle size={18} className='ml-1' /></button>
          </div>
        </header>

        {isModalOpen && ( // Conditionally render the modal
          <Modal onClose={closeModal}> 
            <InstructionCard closeModal={closeModal} />
          </Modal>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
          {/* User Card */}
          <UserSettingsCard />

          <div className="space-y-4">
            <UserCurrentPlanCard />
            <SocialMediaCard />
          </div>



        </div>
      </div>
    </div>
  )
}