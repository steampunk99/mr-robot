"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useSmoothScroll } from "@/context/smooth-scroll"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { lenis } = useSmoothScroll()
  const [key, setKey] = useState(pathname)
  
  // Ensure we get unique keys on each path change for better mobile animations
  useEffect(() => {
    setKey(pathname + "-" + Date.now())
  }, [pathname])
  
  // Reset scroll position on page change
  useEffect(() => {
    if (lenis) {
      // Slight delay to ensure content is ready
      setTimeout(() => {
        lenis.scrollTo(0, { immediate: true })
      }, 100)
    }
  }, [pathname, lenis])

  // Determine section based on pathname
  const getSection = () => {
    if (pathname.includes('about')) return 'about'
    if (pathname.includes('work')) return 'work'
    if (pathname.includes('contact')) return 'contact'
    return 'home'
  }
  
  // Section-based colors
  const sectionColors = {
    home: "#d9d9d9",     // Light gray
    about: "#e0d5b8",    // Warm cream
    work: "#d6dde2",     // Soft blue-gray
    contact: "#d9cee0"   // Gentle purple-gray
  };
  
  // Get current section color
  const currentColor = sectionColors[getSection()]

  return (
    <AnimatePresence mode="wait">
      <motion.div key={key} className="relative">
        {/* Exit animations - staggered blocks (left to right) */}
        {/* First block (top) */}
        <motion.div
          className="fixed top-[72px] bottom-2/3 left-0 right-0 z-50"
          style={{ backgroundColor: currentColor }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 0, originX: 0 }}
          exit={{ scaleX: 1, originX: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        
        {/* Second block (middle) */}
        <motion.div
          className="fixed top-1/3 bottom-1/3 left-0 right-0 z-50"
          style={{ backgroundColor: currentColor }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 0, originX: 0 }}
          exit={{ scaleX: 1, originX: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />
        
        {/* Third block (bottom) */}
        <motion.div
          className="fixed top-2/3 bottom-0 left-0 right-0 z-50"
          style={{ backgroundColor: currentColor }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 0, originX: 0 }}
          exit={{ scaleX: 1, originX: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />

        {/* Entrance animations - staggered blocks (right to left) */}
        {/* First block (top) */}
        <motion.div
          className="fixed top-[72px] bottom-2/3 left-0 right-0 z-50"
          style={{ backgroundColor: currentColor }}
          initial={{ scaleX: 1, originX: "100%" }}
          animate={{ scaleX: 0, originX: "100%" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
        
        {/* Second block (middle) */}
        <motion.div
          className="fixed top-1/3 bottom-1/3 left-0 right-0 z-50"
          style={{ backgroundColor: currentColor }}
          initial={{ scaleX: 1, originX: "100%" }}
          animate={{ scaleX: 0, originX: "100%" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        />
        
        {/* Third block (bottom) */}
        <motion.div
          className="fixed top-2/3 bottom-0 left-0 right-0 z-50"
          style={{ backgroundColor: currentColor }}
          initial={{ scaleX: 1, originX: "100%" }}
          animate={{ scaleX: 0, originX: "100%" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
        />
        
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: { 
              duration: 0.8, 
              delay: 1 
            }
          }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 0.3 
            }
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
