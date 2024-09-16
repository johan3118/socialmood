 "use client"
import React, { useState } from 'react'
import UserCard from '@/components/(socialmood)/user-card'
import ProfileSettings from '@/components/(socialmood)/profile-settings'

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