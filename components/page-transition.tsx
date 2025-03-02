"use client"

import type React from "react"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} className="relative">
        <motion.div
          className="fixed inset-0 z-50 bg-black origin-bottom"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="fixed inset-0 z-50 bg-white origin-top"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
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

