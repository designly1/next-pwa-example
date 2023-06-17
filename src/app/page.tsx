'use client'
import React, { useState, useEffect } from 'react'
import AddToHomeScreen from '@/components/AddToHomeScreen/AddToHomeScreen'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const Music = dynamic(() => import('@/components/Music'), { loading: () => <p className="animate-bounce">Loading...</p> })

import useUserAgent from '@/hooks/useUserAgent'

export default function Home() {
  const [welcomeMessage, setWelcomeMessage] = useState<string>('Checking device...');
  const { isMobile, userAgentString ,userAgent } = useUserAgent();

  useEffect(() => {
    const welcomeMessage = isMobile ? 'You are on a mobile device.' : 'You are on a desktop device. Please use a mobile device to view this app.';
    setWelcomeMessage(welcomeMessage);
  }, [isMobile]);

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 py-20 px-4">
      <motion.h1
        className="text-4xl font-bold text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >Welcome to Fancy PWA App!</motion.h1>
      <motion.p
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >{welcomeMessage}</motion.p>
      {userAgentString && <p className="text-center text-xs text-gray-400">{userAgentString}</p>}
      <AddToHomeScreen />
      <Music />
    </main>
  )
}
