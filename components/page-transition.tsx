"use client"

import type { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState, useCallback, useRef } from "react"
import { useSmoothScroll } from "@/context/smooth-scroll"

// Define section types and colors as constants
type Section = "home" | "about" | "work" | "contact"

// Color schemes for different sections using more minimalist and bold color choices
const SECTION_COLORS: Record<Section, { primary: string; accent: string; text: string; background: string }> = {
  home: { 
    primary: "#000000", 
    accent: "#ffffff", 
    text: "#ffffff", 
    background: "#000000" 
  },
  about: { 
    primary: "#152238", 
    accent: "#ECEBE4", 
    text: "#ffffff", 
    background: "#0D1321" 
  },
  work: { 
    primary: "#10151F", 
    accent: "#E9D8A6", 
    text: "#ffffff", 
    background: "#161A23" 
  },
  contact: { 
    primary: "#131515", 
    accent: "#D1D5DE", 
    text: "#ffffff", 
    background: "#0D0D0D" 
  },
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { lenis } = useSmoothScroll()
  const [key, setKey] = useState(pathname)
  const [currentSection, setCurrentSection] = useState<Section>("home")

  // Get current section based on pathname
  const getSection = useCallback((): Section => {
    if (pathname.includes("about")) return "about"
    if (pathname.includes("work")) return "work"
    if (pathname.includes("contact")) return "contact"
    return "home"
  }, [pathname])

  // Update current section when pathname changes
  useEffect(() => {
    const newSection = getSection();
    setCurrentSection(newSection)
    setKey(pathname)
    
    // Set background color immediately
    document.body.style.backgroundColor = SECTION_COLORS[newSection].background
    document.body.style.color = SECTION_COLORS[newSection].text
  }, [pathname, getSection])

  // Reset scroll position on page change
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    }
  }, [lenis, pathname])

  // Simple fade transition for content
  const contentTransition = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={key} className="relative w-full h-full">
        {/* Page content with simple fade transition */}
        <motion.div
          className="relative w-full h-full"
          {...contentTransition}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

