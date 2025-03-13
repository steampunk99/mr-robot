"use client"

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Preloader from '@/components/preloader'

export default function PreloaderWrapper() {
  const [showPreloader, setShowPreloader] = useState(true)

  return (
    <AnimatePresence mode="wait">
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
    </AnimatePresence>
  )
} 