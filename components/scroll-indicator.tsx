"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ScrollIndicatorProps {
  sections: {
    id: string;
    name: string;
  }[];
}

export default function ScrollIndicator({ sections }: ScrollIndicatorProps) {
  const [activeSection, setActiveSection] = useState("")
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage
      const scrollTop = window.scrollY
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      const percentage = (scrollTop / scrollHeight) * 100
      setScrollPercentage(percentage)

      // Determine active section
      sections.forEach(section => {
        const element = document.getElementById(section.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          // If section is in viewport (with some buffer)
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= 0) {
            setActiveSection(section.name)
          }
        }
      })
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [sections])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth"
      })
    }
  }

  return (
    <div 
      className={`fixed ${isMobile ? 'right-2 top-1/2' : 'right-6 top-1/2'} -translate-y-1/2 z-50`}
      style={{ touchAction: "none" }} // Prevent default touch actions
    >
      <div className="flex flex-col items-center">
        {/* Vertical line */}
        <div className="relative h-48 w-px bg-neutral-800/20">
          {/* Animated progress indicator */}
          <motion.div 
            className="absolute top-0 w-px bg-white"
            style={{ 
              height: `${scrollPercentage}%`,
              maxHeight: "100%" 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        
        {/* Current section label - positioned to prevent overlap */}
        <div className={`${isMobile ? 'mt-2' : 'mt-4'} rotate-90 origin-left whitespace-nowrap`}>
          <AnimatePresence mode="wait">
            <motion.span 
              key={activeSection}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
              className={`${isMobile ? 'text-[10px]' : 'text-xs'} uppercase tracking-[0.2em] font-light text-neutral-400`}
            >
              {activeSection || "Home"}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
