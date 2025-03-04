"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { motion } from "framer-motion"

interface SteampunkRobotFullProps {
  width?: number
  height?: number
  className?: string
  color?: string
  section?: "home" | "about" | "work" | "contact"
  disableMotion?: boolean // Add this prop
}

const SteampunkRobotFull: React.FC<SteampunkRobotFullProps> = ({
  width = 600,
  height = 800,
  className = "",
  color = "",
  section = "home",
  disableMotion = false // Default to false
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [robotPosition, setRobotPosition] = useState({ x: 0, y: 0 })
  const [eyePositions, setEyePositions] = useState({ leftX: 70, leftY: 85, rightX: 130, rightY: 85 })
  const [isBlinking, setIsBlinking] = useState(false)
  const [thrusterIntensity, setThrusterIntensity] = useState(0.5)
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

  // Handle mouse movement to track cursor position - ADD DEPENDENCY ARRAY
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect()
        const svgCenterX = svgRect.left + svgRect.width / 2
        const svgCenterY = svgRect.top + svgRect.height / 2

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
  }, []) // Empty dependency array since we only need to set this up once

  // Memoize these calculations to prevent infinite updates
  const targetPosition = useMemo(() => {
    const safeX = isFinite(mousePosition.x) ? mousePosition.x : 0
    const safeY = isFinite(mousePosition.y) ? mousePosition.y : 0
    const clampedX = Math.max(-1, Math.min(1, safeX))
    const clampedY = Math.max(-1, Math.min(1, safeY))
    
    return {
      x: clampedX * 20, // maxMoveX
      y: clampedY * 10, // maxMoveY
      eyeX: clampedX * 4, // eyeMaxMove
      eyeY: clampedY * 4
    }
  }, [mousePosition.x, mousePosition.y])

  // Update robot position based on mouse position with proper dependency array
  useEffect(() => {
    const ease = 0.05

    const updateFrame = () => {
      setRobotPosition((prev) => ({
        x: prev.x + (targetPosition.x - prev.x) * ease,
        y: prev.y + (targetPosition.y - prev.y) * ease,
      }))

      setEyePositions({
        leftX: 70 + targetPosition.eyeX,
        leftY: 85 + targetPosition.eyeY,
        rightX: 130 + targetPosition.eyeX,
        rightY: 85 + targetPosition.eyeY,
      })

      const movement = Math.sqrt(
        Math.pow(targetPosition.x - robotPosition.x, 2) + 
        Math.pow(targetPosition.y - robotPosition.y, 2)
      )

      setThrusterIntensity(0.5 + Math.min(0.5, movement / 10))
    }

    const animationFrame = requestAnimationFrame(updateFrame)
    return () => cancelAnimationFrame(animationFrame)
  }, [targetPosition, robotPosition.x, robotPosition.y])

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

  // Animation variants for floating effect
  const floatingVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
      },
    },
  }

  // Animation variants for the antenna
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

  // Animation variants for the thrusters
  const thrusterVariants = {
    idle: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 0.9, 0.7],
      transition: {
        duration: 0.8,
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

  // Safe robot position
  const safeRobotX = ensureSafeValue(robotPosition.x)
  const safeRobotY = ensureSafeValue(robotPosition.y)

  return disableMotion ? (
    // Static version without motion wrappers
    <div className={className}>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 400 600"
      >
        {/* Robot head */}
        <g transform="translate(100, 50)">
          {/* Head shape */}
          <rect x="50" y="60" width="100" height="90" rx="10" stroke={robotColor} strokeWidth="2" fill="none" />

          {/* Left eye outline */}
          <circle cx="70" cy="85" r="15" stroke={robotColor} strokeWidth="2" fill="none" />

          {/* Left eyeball - follows cursor and blinks */}
          <circle cx={safeLeftEyeX} cy={safeLeftEyeY} r={isBlinking ? 0.5 : 5} fill={robotColor} />

          {/* Right eye outline */}
          <circle cx="130" cy="85" r="15" stroke={robotColor} strokeWidth="2" fill="none" />

          {/* Right eyeball - follows cursor and blinks */}
          <circle cx={safeRightEyeX} cy={safeRightEyeY} r={isBlinking ? 0.5 : 5} fill={robotColor} />

          {/* Left gear */}
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

          {/* Right gear */}
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

          {/* Antenna */}
          <line x1="100" y1="30" x2="100" y2="60" stroke={robotColor} strokeWidth="2" />
          <circle cx="100" cy="25" r="6" stroke={robotColor} strokeWidth="2" fill="none" />
          <circle cx="100" cy="25" r="3" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Smirking mouth */}
          <path
            d="M70,130 L80,125 L90,130 L100,125 L110,130 L120,125 L130,130"
            stroke={robotColor}
            strokeWidth="2"
            fill="none"
          />

          {/* Subtle rivet details */}
          <circle cx="50" cy="60" r="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="150" cy="60" r="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="50" cy="140" r="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="150" cy="140" r="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
        </g>

        {/* Robot body */}
        <g transform="translate(100, 200)">
          {/* Torso */}
          <rect x="50" y="0" width="100" height="150" rx="5" stroke={robotColor} strokeWidth="2" fill="none" />

          {/* Chest plate details */}
          <rect x="70" y="20" width="60" height="40" rx="3" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Chest gauges */}
          <circle cx="85" cy="40" r="10" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="115" cy="40" r="10" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <path d="M80,40 L90,40 M115,35 L115,45" stroke={robotColor} strokeWidth="1.5" />

          {/* Torso pipes */}
          <path
            d="M50,30 L40,30 L40,60 L50,60 M150,30 L160,30 L160,60 L150,60"
            stroke={robotColor}
            strokeWidth="1.5"
            fill="none"
          />

          {/* Waist gear */}
          <rect x="60" y="120" width="80" height="30" rx="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <line x1="70" y1="135" x2="130" y2="135" stroke={robotColor} strokeWidth="1.5" />
          <circle cx="80" cy="135" r="5" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="100" cy="135" r="5" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="120" cy="135" r="5" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Arms */}
          {/* Left arm */}
          <path d="M50,30 L20,50 L15,120 L40,140" stroke={robotColor} strokeWidth="2" fill="none" />
          <circle cx="20" cy="50" r="8" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="15" cy="120" r="8" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Left hand */}
          <path d="M40,140 L30,160 M40,140 L40,160 M40,140 L50,160" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Right arm */}
          <path d="M150,30 L180,50 L185,120 L160,140" stroke={robotColor} strokeWidth="2" fill="none" />
          <circle cx="180" cy="50" r="8" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="185" cy="120" r="8" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Right hand */}
          <path
            d="M160,140 L150,160 M160,140 L160,160 M160,140 L170,160"
            stroke={robotColor}
            strokeWidth="1.5"
            fill="none"
          />

          {/* Legs */}
          {/* Left leg */}
          <path d="M70,150 L60,220 L70,280" stroke={robotColor} strokeWidth="2" fill="none" />
          <circle cx="60" cy="220" r="10" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Left foot */}
          <path d="M70,280 L50,290 L80,290" stroke={robotColor} strokeWidth="2" fill="none" />

          {/* Right leg */}
          <path d="M130,150 L140,220 L130,280" stroke={robotColor} strokeWidth="2" fill="none" />
          <circle cx="140" cy="220" r="10" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Right foot */}
          <path d="M130,280 L120,290 L150,290" stroke={robotColor} strokeWidth="2" fill="none" />

          {/* Thrusters */}
          {/* Left thruster */}
          <g style={{ originX: "65px", originY: "290px" }}>
            <path d="M65,290 L55,310 L75,310 Z" fill={robotColor} opacity={thrusterIntensity} />
            <path
              d="M65,310 L60,320 L70,320 Z"
              fill={robotColor}
              opacity={thrusterIntensity * 0.7}
            />
          </g>

          {/* Right thruster */}
          <g style={{ originX: "135px", originY: "290px" }}>
            <path d="M135,290 L125,310 L145,310 Z" fill={robotColor} opacity={thrusterIntensity} />
            <path
              d="M135,310 L130,320 L140,320 Z"
              fill={robotColor}
              opacity={thrusterIntensity * 0.7}
            />
          </g>
        </g>
      </svg>
    </div>
  ) : (
    // Original animated version
    <motion.div
      style={{
        display: "inline-block",
        transform: `translate(${safeRobotX}px, ${safeRobotY}px)`,
      }}
      variants={floatingVariants}
      animate="float"
    >
      <motion.svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 400 600"
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Robot head */}
        <g transform="translate(100, 50)">
          {/* Head shape */}
          <rect x="50" y="60" width="100" height="90" rx="10" stroke={robotColor} strokeWidth="2" fill="none" />

          {/* Left eye outline */}
          <circle cx="70" cy="85" r="15" stroke={robotColor} strokeWidth="2" fill="none" />

          {/* Left eyeball - follows cursor and blinks */}
          <circle cx={safeLeftEyeX} cy={safeLeftEyeY} r={isBlinking ? 0.5 : 5} fill={robotColor} />

          {/* Right eye outline */}
          <circle cx="130" cy="85" r="15" stroke={robotColor} strokeWidth="2" fill="none" />

          {/* Right eyeball - follows cursor and blinks */}
          <circle cx={safeRightEyeX} cy={safeRightEyeY} r={isBlinking ? 0.5 : 5} fill={robotColor} />

          {/* Left gear */}
          <g>
            <circle cx="40" cy="85" r="15" stroke={robotColor} strokeWidth="2" fill="none" />
            <line x1="40" y1="63" x2="40" y2="70" stroke={robotColor} strokeWidth="2" />
            <line x1="40" y1="100" x2="40" y2="107" stroke={robotColor} strokeWidth="2" />
            <line x1="18" y1="85" x2="25" y2="85" stroke={robotColor} strokeWidth="2" />
            <line x1="55" y1="85" x2="62" y1="85" stroke={robotColor} strokeWidth="2" />
            <line x1="26" y1="71" x2="31" y2="76" stroke={robotColor} strokeWidth="2" />
            <line x1="26" y1="99" x2="31" y2="94" stroke={robotColor} strokeWidth="2" />
            <line x1="54" y1="71" x2="49" y2="76" stroke={robotColor} strokeWidth="2" />
            <line x1="54" y1="99" x2="49" y2="94" stroke={robotColor} strokeWidth="2" />
          </g>

          {/* Right gear */}
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

          {/* Antenna with animation */}
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

          {/* Subtle rivet details */}
          <circle cx="50" cy="60" r="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="150" cy="60" r="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="50" cy="140" r="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="150" cy="140" r="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
        </g>

        {/* Robot body */}
        <g transform="translate(100, 200)">
          {/* Torso */}
          <rect x="50" y="0" width="100" height="150" rx="5" stroke={robotColor} strokeWidth="2" fill="none" />

          {/* Chest plate details */}
          <rect x="70" y="20" width="60" height="40" rx="3" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Chest gauges */}
          <circle cx="85" cy="40" r="10" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="115" cy="40" r="10" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <path d="M80,40 L90,40 M115,35 L115,45" stroke={robotColor} strokeWidth="1.5" />

          {/* Torso pipes */}
          <path
            d="M50,30 L40,30 L40,60 L50,60 M150,30 L160,30 L160,60 L150,60"
            stroke={robotColor}
            strokeWidth="1.5"
            fill="none"
          />

          {/* Waist gear */}
          <rect x="60" y="120" width="80" height="30" rx="3" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <line x1="70" y1="135" x2="130" y2="135" stroke={robotColor} strokeWidth="1.5" />
          <circle cx="80" cy="135" r="5" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="100" cy="135" r="5" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="120" cy="135" r="5" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Arms */}
          {/* Left arm */}
          <path d="M50,30 L20,50 L15,120 L40,140" stroke={robotColor} strokeWidth="2" fill="none" />
          <circle cx="20" cy="50" r="8" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="15" cy="120" r="8" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Left hand */}
          <path d="M40,140 L30,160 M40,140 L40,160 M40,140 L50,160" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Right arm */}
          <path d="M150,30 L180,50 L185,120 L160,140" stroke={robotColor} strokeWidth="2" fill="none" />
          <circle cx="180" cy="50" r="8" stroke={robotColor} strokeWidth="1.5" fill="none" />
          <circle cx="185" cy="120" r="8" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Right hand */}
          <path
            d="M160,140 L150,160 M160,140 L160,160 M160,140 L170,160"
            stroke={robotColor}
            strokeWidth="1.5"
            fill="none"
          />

          {/* Legs */}
          {/* Left leg */}
          <path d="M70,150 L60,220 L70,280" stroke={robotColor} strokeWidth="2" fill="none" />
          <circle cx="60" cy="220" r="10" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Left foot */}
          <path d="M70,280 L50,290 L80,290" stroke={robotColor} strokeWidth="2" fill="none" />

          {/* Right leg */}
          <path d="M130,150 L140,220 L130,280" stroke={robotColor} strokeWidth="2" fill="none" />
          <circle cx="140" cy="220" r="10" stroke={robotColor} strokeWidth="1.5" fill="none" />

          {/* Right foot */}
          <path d="M130,280 L120,290 L150,290" stroke={robotColor} strokeWidth="2" fill="none" />

          {/* Thrusters */}
          {/* Left thruster */}
          <motion.g variants={thrusterVariants} animate="idle" style={{ originX: "65px", originY: "290px" }}>
            <path d="M65,290 L55,310 L75,310 Z" fill={robotColor} opacity={thrusterIntensity} />
            <motion.path
              d="M65,310 L60,320 L70,320 Z"
              fill={robotColor}
              opacity={thrusterIntensity * 0.7}
              animate={{
                y: [0, 5, 0],
                opacity: [thrusterIntensity * 0.7, thrusterIntensity * 0.4, thrusterIntensity * 0.7],
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </motion.g>

          {/* Right thruster */}
          <motion.g variants={thrusterVariants} animate="idle" style={{ originX: "135px", originY: "290px" }}>
            <path d="M135,290 L125,310 L145,310 Z" fill={robotColor} opacity={thrusterIntensity} />
            <motion.path
              d="M135,310 L130,320 L140,320 Z"
              fill={robotColor}
              opacity={thrusterIntensity * 0.7}
              animate={{
                y: [0, 5, 0],
                opacity: [thrusterIntensity * 0.7, thrusterIntensity * 0.4, thrusterIntensity * 0.7],
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                delay: 0.1, // Slight delay for asynchronous thruster effect
              }}
            />
          </motion.g>
        </g>
      </motion.svg>
    </motion.div>
  )
}

export default SteampunkRobotFull

