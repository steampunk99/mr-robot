"use client"

import type { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { useSmoothScroll } from "@/context/smooth-scroll"

// Define section types and colors as constants outside the component
type Section = "home" | "about" | "work" | "contact"

const SECTION_COLORS: Record<Section, string> = {
  home: "#ffffff", // White for home route
  about: "#e0d5b8", // Warm cream
  work: "#d6dde2", // Soft blue-gray
  contact: "#d9cee0", // Gentle purple-gray
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { lenis } = useSmoothScroll()
  const [key, setKey] = useState(pathname)

  // Get current section based on pathname - memoized with useCallback
  const getSection = useCallback((): Section => {
    if (pathname.includes("about")) return "about"
    if (pathname.includes("work")) return "work"
    if (pathname.includes("contact")) return "contact"
    return "home"
  }, [pathname])

  // Ensure we get unique keys on each path change for better mobile animations
  useEffect(() => {
    setKey(pathname + "-" + Date.now())
  }, [pathname])

  // Reset scroll position on page change with proper cleanup
  useEffect(() => {
    if (lenis) {
      // Slight delay to ensure content is ready
      const timer = setTimeout(() => {
        lenis.scrollTo(0, { immediate: true })
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [lenis])

  // Get current section color
  const currentColor = SECTION_COLORS[getSection()]

  // Simplified transition block properties for better performance
  const createTransitionProps = (position: "top" | "middle" | "bottom", isExit: boolean, delay: number) => {
    const positionClasses = {
      top: "top-0 bottom-2/3",
      middle: "top-1/3 bottom-1/3",
      bottom: "top-2/3 bottom-0",
    }

    return {
      className: `fixed ${positionClasses[position]} left-0 right-0 z-50`,
      style: { backgroundColor: currentColor },
      initial: {
        scaleX: isExit ? 0 : 1,
        originX: isExit ? 0 : "100%",
      },
      animate: {
        scaleX: 0,
        originX: isExit ? 0 : "100%",
      },
      exit: isExit
        ? {
            scaleX: 1,
            originX: 0,
          }
        : undefined,
      transition: {
        duration: isExit ? 0.7 : 1,
        ease: "easeInOut", // Simplified easing function
        delay,
      },
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={key} className="relative w-full h-full">
        {/* Apply the same transition to all routes including home */}
        <>
          {/* Exit animations - staggered blocks (left to right) */}
          <motion.div {...createTransitionProps("top", true, 0)} />
          <motion.div {...createTransitionProps("middle", true, 0.15)} />
          <motion.div {...createTransitionProps("bottom", true, 0.3)} />

          {/* Entrance animations - staggered blocks (right to left) */}
          <motion.div {...createTransitionProps("top", false, 0.2)} />
          <motion.div {...createTransitionProps("middle", false, 0.3)} />
          <motion.div {...createTransitionProps("bottom", false, 0.5)} />

          <motion.div
            className="relative z-10 w-full h-full" // Added w-full h-full here too
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.8,
                delay: 1,
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.3,
              },
            }}
          >
            {children}
          </motion.div>
        </>
      </motion.div>
    </AnimatePresence>
  )
}

