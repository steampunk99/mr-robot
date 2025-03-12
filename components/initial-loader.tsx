"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SteampunkRobot from "./robot/steampunk-robot"
import { useSmoothScroll } from "@/context/smooth-scroll"
import { usePathname } from "next/navigation"

export default function InitialLoader() {
  const pathname = usePathname()
  const isWorkRoute = pathname.startsWith('/work')

  // Don't show loader on work routes
  if (isWorkRoute) return null

  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"loading" | "exit" | "entrance" | "complete">("loading")
  const [exit, setExit] = useState(false)
  const { lenis } = useSmoothScroll()
  const isMounted = useRef(true)

  // Home page color
  const homeColor = "#d9d9d9" // Light gray

  useEffect(() => {
    console.log("Progress:", progress)
  }, [progress])

  useEffect(() => {
    // Lock scroll during loader
    if (lenis) lenis.stop()

    // Start with a small delay to ensure component is fully mounted
    const startDelay = setTimeout(() => {
      // Simple linear progress increment
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = Math.min(100, prev + 2)

          if (newProgress === 100) {
            clearInterval(interval)

            // Show completion state
            setTimeout(() => {
              setPhase("exit")

              // Wait before showing entrance blocks
              setTimeout(() => {
                setPhase("entrance")

                // Finally remove from DOM after all animations
                setTimeout(() => {
                  setPhase("complete")
                  setTimeout(() => {
                    setExit(true)
                    // Unlock scroll when loader is finished
                    if (lenis) lenis.start()
                  }, 300)
                }, 1500)
              }, 1000)
            }, 500)
          }

          return newProgress
        })
      }, 50)

      // Cleanup
      return () => {
        clearInterval(interval)
        if (lenis) lenis.start()
      }
    }, 100)

    return () => {
      clearTimeout(startDelay)
      if (lenis) lenis.start()
    }
  }, [lenis])

  // Simplified grid pattern with fewer elements
  const GridPattern = () => (
    <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10">
      {Array(36)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border-[0.5px] border-white/20"></div>
        ))}
    </div>
  )

  return (
    <AnimatePresence mode="wait">
      {!exit && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => {
            // Force cleanup of DOM element when animation completes
            if (phase === "complete") {
              setExit(true);
              // Ensure scroll is enabled
              if (lenis) lenis.start();
            }
          }}
        >
          <GridPattern />

          {/* Exit Animation Blocks (Left to Right) */}
          {phase === "exit" && (
            <>
              <motion.div
                className="fixed top-0 bottom-2/3 left-0 right-0 z-[10000]"
                style={{ backgroundColor: homeColor }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.div
                className="fixed top-1/3 bottom-1/3 left-0 right-0 z-[10000]"
                style={{ backgroundColor: homeColor }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              />
              <motion.div
                className="fixed top-2/3 bottom-0 left-0 right-0 z-[10000]"
                style={{ backgroundColor: homeColor }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              />
            </>
          )}

          {/* Entrance Animation Blocks (Right to Left) */}
          {(phase === "entrance" || phase === "complete") && (
            <>
              <motion.div
                className="fixed top-0 bottom-2/3 left-0 right-0 z-[10001]"
                style={{ backgroundColor: homeColor }}
                initial={{ scaleX: 1, originX: "100%" }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              />
              <motion.div
                className="fixed top-1/3 bottom-1/3 left-0 right-0 z-[10001]"
                style={{ backgroundColor: homeColor }}
                initial={{ scaleX: 1, originX: "100%" }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 + 0.2 }}
              />
              <motion.div
                className="fixed top-2/3 bottom-0 left-0 right-0 z-[10001]"
                style={{ backgroundColor: homeColor }}
                initial={{ scaleX: 1, originX: "100%" }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 + 0.4 }}
                onAnimationComplete={() => {
                  // Ensure we clean up after animation completes
                  if (phase === "complete") {
                    setExit(true);
                    if (lenis) lenis.start();
                  }
                }}
              />
            </>
          )}

          {/* Central Content */}
          <div className="relative z-10 mb-20">
            <div className="relative">
              {/* Robot logo (shows when loading completes) */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase !== "loading" ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <SteampunkRobot width={580} height={580} section="home" className="" isLogo={true} />
              </motion.div>

              {/* Progress percentage (hides when loading completes) */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: phase === "loading" ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <span className="text-7xl md:text-8xl font-light tabular-nums tracking-tighter">{progress}</span>
                <span className="text-xs tracking-[0.3em] uppercase text-neutral-500 mt-2">Loading</span>
              </motion.div>
            </div>
          </div>

          {/* Loading bar (bottom) */}
          <motion.div
            className="absolute bottom-16 left-0 right-0 flex justify-center items-center px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "loading" ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full max-w-xl h-[2px] bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            <div className="ml-4 text-xs text-neutral-400 tabular-nums w-10">{progress}%</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

