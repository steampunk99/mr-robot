"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from "framer-motion"

interface ProjectCursorProps {
  mode?: "default" | "view" | "drag" | "link"
  text?: string
}

export default function ProjectCursor({ mode = "default", text }: ProjectCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  // Use motion values for smooth interpolation
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const scale = useMotionValue(1)

  // Create springs for smooth movement
  const springConfig = { damping: 25, stiffness: 400, mass: 0.2 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)
  const springScale = useSpring(scale, { damping: 20, stiffness: 300 })

  // Rotation based on mouse movement
  const rotateX = useTransform(mouseY, [0, window.innerHeight], [5, -5])
  const rotateY = useTransform(mouseX, [0, window.innerWidth], [-5, 5])

  // Track cursor position with RAF for maximum smoothness
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setVisible(true)
    }

    const handleMouseDown = () => {
      scale.set(0.9)
    }

    const handleMouseUp = () => {
      scale.set(1)
    }

    const handleMouseLeave = () => {
      setVisible(false)
    }

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [mouseX, mouseY, scale])

  // Cursor variants
  const variants = {
    default: {
      height: 40,
      width: 40,
      backgroundColor: "rgba(255, 255, 255, 0)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      mixBlendMode: "difference" as const,
      fontSize: "0px",
    },
    view: {
      height: 80,
      width: 80,
      backgroundColor: "rgba(255, 255, 255, 1)",
      mixBlendMode: "difference" as const,
      border: "none",
      fontSize: "12px",
      letterSpacing: "1px",
      color: "#000",
    },
    drag: {
      height: 60,
      width: 60,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      mixBlendMode: "difference" as const,
      fontSize: "10px",
      letterSpacing: "1px",
      color: "#fff",
    },
    link: {
      height: 50,
      width: 50,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      mixBlendMode: "difference" as const,
      fontSize: "0px",
    },
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={cursorRef}
          className="fixed top-0 left-0 rounded-full pointer-events-none z-50 flex items-center justify-center font-light tracking-widest uppercase"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            scale: springScale,
            rotateX,
            rotateY,
          }}
          variants={variants}
          animate={mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
            mass: 0.5,
          }}
        >
          {/* Inner circle */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: mode === "default" ? "1px solid rgba(255, 255, 255, 0.3)" : "none",
              scale: 0.5,
            }}
          />

          {/* Text */}
          <span className="relative z-10">{text}</span>

          {/* Decorative elements */}
          {mode === "view" && (
            <>
              <motion.div className="absolute w-full h-[1px] bg-black/30" animate={{ rotate: 45 }} />
              <motion.div className="absolute w-full h-[1px] bg-black/30" animate={{ rotate: -45 }} />
            </>
          )}

          {mode === "drag" && (
            <>
              <motion.div className="absolute left-0 w-[10px] h-[1px] bg-white/70" style={{ x: -5 }} />
              <motion.div className="absolute right-0 w-[10px] h-[1px] bg-white/70" style={{ x: 5 }} />
            </>
          )}

          {mode === "link" && (
            <motion.div
              className="absolute w-[10px] h-[10px] border-t border-r border-white/70 rotate-45"
              style={{ x: 2, y: -2 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

