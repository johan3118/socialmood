 "use client"
import React, { useState } from 'react'
import UserCard from '@/components/(backoffice)/user-card'
import ProfileSettings from './profile-settings'

export default function UserProfile() {
  const [showSettings, setShowSettings] = useState(false)

  const toggleSettings = () => setShowSettings(!showSettings)

  return (
    <>
      {!showSettings && <UserCard onShowSettings={toggleSettings} />}
      {showSettings && <ProfileSettings onClose={toggleSettings} />}
    </>
  )
}