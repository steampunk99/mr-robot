"use client"

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useSmoothScroll } from '@/context/smooth-scroll'

export function ScrollProgress() {
  const { lenis } = useSmoothScroll()
  const [scrollProgress, setScrollProgress] = useState(0)
  
  // Create a smooth spring animation for the progress
  const smoothProgress = useSpring(scrollProgress, { 
    damping: 15, 
    stiffness: 100 
  })
  
  useEffect(() => {
    if (!lenis) return
    
    // Update progress on scroll
    const handleScroll = ({ scroll, limit, progress }) => {
      setScrollProgress(progress)
    }
    
    lenis.on('scroll', handleScroll)
    
    return () => {
      lenis.off('scroll', handleScroll)
    }
  }, [lenis])
  
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-[2px] bg-white/10 z-[150] origin-left"
      style={{ 
        scaleX: smoothProgress,
        opacity: scrollProgress > 0 ? 1 : 0
      }}
    />
  )
}
