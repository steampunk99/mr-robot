"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useNavigation } from "@/context/navigation-context"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isNavigating } = useNavigation()

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} className="relative">
        {/* Exit animations - staggered blocks */}
        {/* First block (left) */}
        <motion.div
          className="fixed top-[72px] bottom-0 left-0 right-2/3 z-50 bg-white origin-bottom"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.4, ease: [0.32, 1, 0.46, 1] }}
        />
        
        {/* Second block (middle) */}
        <motion.div
          className="fixed top-[72px] bottom-0 left-1/3 right-1/3 z-50 bg-white origin-bottom"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.4, ease: [0.32, 1, 0.46, 1] }}
        />
        
        {/* Third block (right) */}
        <motion.div
          className="fixed top-[72px] bottom-0 left-2/3 right-0 z-50 bg-white origin-bottom"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.4, ease: [0.32, 1, 0.46, 1], delay: 0.2 }}
        />

        {/* Entrance animations - staggered blocks */}
        {/* First block (left) */}
        <motion.div
          className="fixed top-[72px] bottom-0 left-0 right-2/3 z-50 bg-white origin-top"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.6, ease: [0.32, 1, 0.46, 1] }}
        />
        
        {/* Second block (middle) */}
        <motion.div
          className="fixed top-[72px] bottom-0 left-1/3 right-1/3 z-50 bg-white origin-top"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.6, ease: [0.32, 1, 0.46, 1], delay: 0.1 }}
        />
        
        {/* Third block (right) */}
        <motion.div
          className="fixed top-[72px] bottom-0 left-2/3 right-0 z-50 bg-white origin-top"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.6, ease: [0.32, 1, 0.46, 1], delay: 0.2 }}
        />
        
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
