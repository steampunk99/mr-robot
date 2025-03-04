"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface SteampunkRobotProps {
  width?: number
  height?: number
  className?: string
  isLogo?: boolean
  color?: string
  section?: "home" | "about" | "work" | "contact"
}

const SteampunkRobot: React.FC<SteampunkRobotProps> = ({
  width = 200,
  height = 200,
  className = "",
  isLogo = false,
  color = "",
  section = "home",
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [eyePositions, setEyePositions] = useState({ leftX: 70, leftY: 85, rightX: 130, rightY: 85 })
  const [isBlinking, setIsBlinking] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  // Section-based colors
  const sectionColors = {
    home: "#d9d9d9", // Light gray
    about: "#e0d5b8", // Warm cream
    work: "#d6dde2", // Soft blue-gray
    contact: "#d9cee0", // Gentle purple-gray
  }

  // Use provided color or the section color
  const robotColor = color || sectionColors[section]

  // Handle mouse movement to track cursor position - only for non-logo robots
  useEffect(() => {
    if (isLogo) return // Skip for logo version

    const handleMouseMove = (e: MouseEvent) => {
      if (svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect()
        const svgCenterX = svgRect.left + svgRect.width / 2
        const svgCenterY = svgRect.top + svgRect.height / 2

        // Safeguard against division by zero
        const widthDivisor = svgRect.width > 0 ? svgRect.width / 2 : 1
        const heightDivisor = svgRect.height > 0 ? svgRect.height / 2 : 1

        setMousePosition({
          x: (e.clientX - svgCenterX) / widthDivisor,
          y: (e.clientY - svgCenterY) / heightDivisor,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isLogo])

  // Update eye positions based on mouse position - only for non-logo robots
  useEffect(() => {
    if (isLogo) return // Skip for logo version

    const eyeMaxMove = 4

    // Safeguard against Infinity or NaN values
    const safeX = isFinite(mousePosition.x) ? mousePosition.x : 0
    const safeY = isFinite(mousePosition.y) ? mousePosition.y : 0

    // Clamp values to prevent extreme movements
    const clampedX = Math.max(-1, Math.min(1, safeX))
    const clampedY = Math.max(-1, Math.min(1, safeY))

    setEyePositions({
      leftX: 70 + clampedX * eyeMaxMove,
      leftY: 85 + clampedY * eyeMaxMove,
      rightX: 130 + clampedX * eyeMaxMove,
      rightY: 85 + clampedY * eyeMaxMove,
    })
  }, [mousePosition, isLogo])

  // Random blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 150)
      }
    }, 3000)

    return () => clearInterval(blinkInterval)
  }, [])

  // Animation variant for the antenna only (minimal animation)
  const antennaVariants = {
    idle: {
      y: [0, -3, 0],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
      },
    },
  }

  // Ensure all SVG values are safe
  const ensureSafeValue = (value: number): number => {
    return isFinite(value) ? value : 0
  }

  // Safe eye positions
  const safeLeftEyeX = ensureSafeValue(eyePositions.leftX)
  const safeLeftEyeY = ensureSafeValue(eyePositions.leftY)
  const safeRightEyeX = ensureSafeValue(eyePositions.rightX)
  const safeRightEyeY = ensureSafeValue(eyePositions.rightY)

  return (
    <motion.svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      width={isLogo ? 48 : width}
      height={isLogo ? 48 : height}
      viewBox="0 0 200 200"
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Robot head shape */}
      <rect x="50" y="60" width="100" height="90" rx="10" stroke={robotColor} strokeWidth="2" fill="none" />

      {/* Left eye outline */}
      <circle cx="70" cy="85" r="15" stroke={robotColor} strokeWidth="2" fill="none" />

      {/* Left eyeball - follows cursor and blinks */}
      <circle
        cx={isLogo ? 70 : safeLeftEyeX}
        cy={isLogo ? 85 : safeLeftEyeY}
        r={isBlinking ? 0.5 : 5}
        fill={robotColor}
      />

      {/* Right eye outline */}
      <circle cx="130" cy="85" r="15" stroke={robotColor} strokeWidth="2" fill="none" />

      {/* Right eyeball - follows cursor and blinks */}
      <circle
        cx={isLogo ? 130 : safeRightEyeX}
        cy={isLogo ? 85 : safeRightEyeY}
        r={isBlinking ? 0.5 : 5}
        fill={robotColor}
      />

      {/* Static left gear (no animation) */}
      <g>
        <circle cx="40" cy="85" r="15" stroke={robotColor} strokeWidth="2" fill="none" />
        <line x1="40" y1="63" x2="40" y2="70" stroke={robotColor} strokeWidth="2" />
        <line x1="40" y1="100" x2="40" y2="107" stroke={robotColor} strokeWidth="2" />
        <line x1="18" y1="85" x2="25" y2="85" stroke={robotColor} strokeWidth="2" />
        <line x1="55" y1="85" x2="62" y2="85" stroke={robotColor} strokeWidth="2" />
        <line x1="26" y1="71" x2="31" y2="76" stroke={robotColor} strokeWidth="2" />
        <line x1="26" y1="99" x2="31" y2="94" stroke={robotColor} strokeWidth="2" />
        <line x1="54" y1="71" x2="49" y2="76" stroke={robotColor} strokeWidth="2" />
        <line x1="54" y1="99" x2="49" y2="94" stroke={robotColor} strokeWidth="2" />
      </g>

      {/* Static right gear (no animation) */}
      <g>
        <circle cx="160" cy="85" r="15" stroke={robotColor} strokeWidth="2" fill="none" />
        <line x1="160" y1="63" x2="160" y2="70" stroke={robotColor} strokeWidth="2" />
        <line x1="160" y1="100" x2="160" y2="107" stroke={robotColor} strokeWidth="2" />
        <line x1="138" y1="85" x2="145" y2="85" stroke={robotColor} strokeWidth="2" />
        <line x1="175" y1="85" x2="182" y2="85" stroke={robotColor} strokeWidth="2" />
        <line x1="146" y1="71" x2="151" y2="76" stroke={robotColor} strokeWidth="2" />
        <line x1="146" y1="99" x2="151" y2="94" stroke={robotColor} strokeWidth="2" />
        <line x1="174" y1="71" x2="169" y2="76" stroke={robotColor} strokeWidth="2" />
        <line x1="174" y1="99" x2="169" y2="94" stroke={robotColor} strokeWidth="2" />
      </g>

      {/* Antenna with minimal animation */}
      <motion.g variants={antennaVariants} animate="idle">
        <line x1="100" y1="30" x2="100" y2="60" stroke={robotColor} strokeWidth="2" />
        <circle cx="100" cy="25" r="6" stroke={robotColor} strokeWidth="2" fill="none" />
        <circle cx="100" cy="25" r="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
      </motion.g>

      {/* Smirking mouth */}
      <path
        d="M70,130 L80,125 L90,130 L100,125 L110,130 L120,125 L130,130"
        stroke={robotColor}
        strokeWidth="2"
        fill="none"
      />

      {/* Subtle rivet details for texture */}
      <circle cx="50" cy="60" r="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
      <circle cx="150" cy="60" r="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="140" r="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
      <circle cx="150" cy="140" r="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
    </motion.svg>
  )
}

export default SteampunkRobot

