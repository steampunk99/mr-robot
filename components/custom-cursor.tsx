"use client"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CustomCursor() {
  const [cursorVariant, setCursorVariant] = useState("default")
  const [cursorText, setCursorText] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const cursorVariants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: "#ffffff10",
      border: "1px solid #ffffff30",
      position: "fixed",
      top: 0,
      left: 0,
      transform: "translate(-50%, -50%)",
      x: mousePosition.x,
      y: mousePosition.y,
      pointerEvents: "none"
    },
    text: {
      width: 100,
      height: 100,
      backgroundColor: "#ffffff10",
      border: "1px solid #ffffff30",
      position: "fixed",
      top: 0,
      left: 0,
      transform: "translate(-50%, -50%)",
      x: mousePosition.x,
      y: mousePosition.y,
      pointerEvents: "none"
    }
  }

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    document.body.style.cursor = 'none'
    window.addEventListener('mousemove', updateMousePosition)
    
    return () => {
      document.body.style.cursor = 'auto'
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  return (
    <motion.div
      variants={cursorVariants}
      animate={cursorVariant}
      initial="default"
      className="fixed z-[100] rounded-full pointer-events-none mix-blend-difference"
    >
      {cursorVariant === "text" && (
        <span className="text-xs font-light tracking-wider">{cursorText}</span>
      )}
    </motion.div>
  )
}

export function useCursor() {
  return {
    handleHover: (text?: string) => {
      // Add cursor hover logic here
    },
    handleLeave: () => {
      // Add cursor leave logic here
    }
  }
}
