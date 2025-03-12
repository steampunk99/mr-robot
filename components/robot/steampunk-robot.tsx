"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, useMotionValue, AnimatePresence } from "framer-motion"

interface SteampunkRobotProps {
  width?: number
  height?: number
  className?: string
  isLogo?: boolean
  color?: string
  section?: "home" | "about" | "work" | "contact"
  interactive?: boolean
}

const SteampunkRobot: React.FC<SteampunkRobotProps> = ({
  width = 300,
  height = 300,
  className = "",
  isLogo = false,
  color = "",
  section = "home",
  interactive = true,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [eyePositions, setEyePositions] = useState({ leftX: 70, leftY: 85, rightX: 130, rightY: 85 })
  const [isBlinking, setIsBlinking] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number; opacity: number }>>([])
  const [gearRotation, setGearRotation] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const headControls = useAnimation()
  const antennaControls = useAnimation()
  const glowControls = useAnimation()
  const particleInterval = useRef<NodeJS.Timeout | null>(null)

  // Enhanced section-based colors
  const sectionColors = {
    home: "#d9d9d9", // Light gray
    about: "#e2cb9f", // Warm gold
    work: "#a8d8ff", // Bright blue
    contact: "#ffa8ee", // Bright pink
  }

  // Use provided color or the section color
  const robotColor = color || sectionColors[section]
  
  // Generate glowing effect colors based on section
  const glowColor = {
    home: "rgba(255, 255, 255, 0.5)",
    about: "rgba(255, 221, 150, 0.5)",
    work: "rgba(150, 200, 255, 0.5)",
    contact: "rgba(255, 150, 220, 0.5)",
  }

  // Handle hover state
  const handleHover = () => {
    if (!interactive) return
    
    setIsHovered(true)
    headControls.start({
      y: -5,
      transition: { duration: 0.3, type: "spring", stiffness: 500, damping: 15 }
    })
    antennaControls.start({
      y: -8,
      transition: { duration: 0.4, type: "spring", stiffness: 300, damping: 10 }
    })
    glowControls.start({
      opacity: 0.8,
      scale: 1.1,
      transition: { duration: 0.3 }
    })
    
    // Start particle emission
    if (particleInterval.current) clearInterval(particleInterval.current)
    particleInterval.current = setInterval(() => {
      emitParticle()
    }, 100)
  }

  const handleHoverEnd = () => {
    if (!interactive) return
    
    setIsHovered(false)
    headControls.start({
      y: 0,
      transition: { duration: 0.5, type: "spring", stiffness: 300, damping: 15 }
    })
    antennaControls.start({
      y: 0,
      transition: { duration: 0.7, type: "spring", stiffness: 200, damping: 10 }
    })
    glowControls.start({
      opacity: 0,
      scale: 1,
      transition: { duration: 0.5 }
    })
    
    // Stop particle emission
    if (particleInterval.current) {
      clearInterval(particleInterval.current)
      particleInterval.current = null
    }
  }
  
  const handleClick = () => {
    if (!interactive) return
    
    setIsClicked(true)
    // Pulse animation
    headControls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.4, times: [0, 0.5, 1] }
    })
    
    // Emit a burst of particles
    for (let i = 0; i < 10; i++) {
      setTimeout(() => emitParticle(), i * 50)
    }
    
    setTimeout(() => {
      setIsClicked(false)
    }, 500)
  }
  
  // Particle system
  const emitParticle = () => {
    const newParticle = {
      id: Math.random(),
      x: Math.random() * 200,
      y: Math.random() * 200,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.7 + 0.3
    }
    
    setParticles(prev => [...prev, newParticle])
    
    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id))
    }, 1000)
  }

  // Handle mouse movement to track cursor position
  useEffect(() => {
    if (isLogo || !interactive) return // Skip for logo version

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
  }, [isLogo, interactive])

  // Update eye positions based on mouse position
  useEffect(() => {
    if (isLogo || !interactive) return // Skip for logo version

    const eyeMaxMove = 6

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
  }, [mousePosition, isLogo, interactive])

  // Random blinking effect
  useEffect(() => {
    if (!interactive) return
    
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 150)
      }
    }, 3000)

    return () => clearInterval(blinkInterval)
  }, [interactive])
  
  // Rotating gears animation
  useEffect(() => {
    if (!interactive) return
    
    const rotateInterval = setInterval(() => {
      setGearRotation(prev => prev + 1)
    }, 50)
    
    return () => clearInterval(rotateInterval)
  }, [interactive])

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
      width={isLogo ? 56 : width}
      height={isLogo ? 56 : height}
      viewBox="0 0 200 200"
      className={`${className} select-none ${interactive ? 'cursor-pointer' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
      onClick={handleClick}
    >
      {/* Background glow effect */}
      <motion.circle
        cx="100"
        cy="100"
        r="75"
        fill={`url(#${section}Glow)`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={glowControls}
      />
      
      {/* Radial gradient definition */}
      <defs>
        <radialGradient id={`${section}Glow`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor={glowColor[section]} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      
      {/* Particles */}
      <g>
        {particles.map(particle => (
          <motion.circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill={robotColor}
            initial={{ opacity: particle.opacity, scale: 0 }}
            animate={{ 
              opacity: [particle.opacity, 0],
              scale: [0, 1.5],
              y: particle.y - 20 * particle.speed
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}
      </g>

      {/* Robot head group */}
      <motion.g animate={headControls}>
        {/* Robot head shape */}
        <rect x="50" y="60" width="100" height="90" rx="10" stroke={robotColor} strokeWidth="2" fill="none" />
        
        {/* Circuit board pattern inside head */}
        {!isLogo && (
          <g opacity="0.3">
            <path d="M60 70 H140" stroke={robotColor} strokeWidth="0.5" />
            <path d="M60 80 H140" stroke={robotColor} strokeWidth="0.5" />
            <path d="M60 90 H140" stroke={robotColor} strokeWidth="0.5" />
            <path d="M60 100 H140" stroke={robotColor} strokeWidth="0.5" />
            <path d="M60 110 H140" stroke={robotColor} strokeWidth="0.5" />
            <path d="M60 120 H140" stroke={robotColor} strokeWidth="0.5" />
            <path d="M60 130 H140" stroke={robotColor} strokeWidth="0.5" />
            <path d="M60 140 H140" stroke={robotColor} strokeWidth="0.5" />
            
            <path d="M70 70 V140" stroke={robotColor} strokeWidth="0.5" />
            <path d="M90 70 V140" stroke={robotColor} strokeWidth="0.5" />
            <path d="M110 70 V140" stroke={robotColor} strokeWidth="0.5" />
            <path d="M130 70 V140" stroke={robotColor} strokeWidth="0.5" />
          </g>
        )}

        {/* Left eye outline with glowing effect */}
        <motion.circle 
          cx="70" 
          cy="85" 
          r="15" 
          stroke={robotColor} 
          strokeWidth="2" 
          fill="none"
          animate={isHovered ? { stroke: robotColor, strokeWidth: 2.5 } : {}}
        />
        <motion.circle 
          cx="70" 
          cy="85" 
          r="15" 
          stroke={robotColor} 
          strokeOpacity="0.5"
          strokeWidth="4" 
          fill="none"
          animate={isHovered ? { strokeOpacity: 0.5, scale: 1.1 } : { strokeOpacity: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Left eyeball - follows cursor and blinks */}
        <motion.circle
          cx={isLogo ? 70 : safeLeftEyeX}
          cy={isLogo ? 85 : safeLeftEyeY}
          r={isBlinking ? 0.5 : 5}
          fill={robotColor}
          animate={isHovered ? { r: isBlinking ? 0.5 : 6 } : {}}
        />

        {/* Right eye outline with glowing effect */}
        <motion.circle 
          cx="130" 
          cy="85" 
          r="15" 
          stroke={robotColor} 
          strokeWidth="2" 
          fill="none"
          animate={isHovered ? { stroke: robotColor, strokeWidth: 2.5 } : {}}
        />
        <motion.circle 
          cx="130" 
          cy="85" 
          r="15" 
          stroke={robotColor} 
          strokeOpacity="0.5"
          strokeWidth="4" 
          fill="none"
          animate={isHovered ? { strokeOpacity: 0.5, scale: 1.1 } : { strokeOpacity: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Right eyeball - follows cursor and blinks */}
        <motion.circle
          cx={isLogo ? 130 : safeRightEyeX}
          cy={isLogo ? 85 : safeRightEyeY}
          r={isBlinking ? 0.5 : 5}
          fill={robotColor}
          animate={isHovered ? { r: isBlinking ? 0.5 : 6 } : {}}
        />

        {/* Left spinning gear */}
        <motion.g
          animate={{ rotate: interactive ? gearRotation : 0 }}
          style={{ originX: '40px', originY: '85px' }}
        >
          <circle cx="40" cy="85" r="15" stroke={robotColor} strokeWidth="2" fill="none" />
          <line x1="40" y1="63" x2="40" y2="70" stroke={robotColor} strokeWidth="2" />
          <line x1="40" y1="100" x2="40" y2="107" stroke={robotColor} strokeWidth="2" />
          <line x1="18" y1="85" x2="25" y2="85" stroke={robotColor} strokeWidth="2" />
          <line x1="55" y1="85" x2="62" y2="85" stroke={robotColor} strokeWidth="2" />
          <line x1="26" y1="71" x2="31" y2="76" stroke={robotColor} strokeWidth="2" />
          <line x1="26" y1="99" x2="31" y2="94" stroke={robotColor} strokeWidth="2" />
          <line x1="54" y1="71" x2="49" y2="76" stroke={robotColor} strokeWidth="2" />
          <line x1="54" y1="99" x2="49" y2="94" stroke={robotColor} strokeWidth="2" />
        </motion.g>

        {/* Right spinning gear */}
        <motion.g
          animate={{ rotate: interactive ? -gearRotation : 0 }}
          style={{ originX: '160px', originY: '85px' }}
        >
          <circle cx="160" cy="85" r="15" stroke={robotColor} strokeWidth="2" fill="none" />
          <line x1="160" y1="63" x2="160" y2="70" stroke={robotColor} strokeWidth="2" />
          <line x1="160" y1="100" x2="160" y2="107" stroke={robotColor} strokeWidth="2" />
          <line x1="138" y1="85" x2="145" y2="85" stroke={robotColor} strokeWidth="2" />
          <line x1="175" y1="85" x2="182" y2="85" stroke={robotColor} strokeWidth="2" />
          <line x1="146" y1="71" x2="151" y2="76" stroke={robotColor} strokeWidth="2" />
          <line x1="146" y1="99" x2="151" y2="94" stroke={robotColor} strokeWidth="2" />
          <line x1="174" y1="71" x2="169" y2="76" stroke={robotColor} strokeWidth="2" />
          <line x1="174" y1="99" x2="169" y2="94" stroke={robotColor} strokeWidth="2" />
        </motion.g>

        {/* Antenna with enhanced animation */}
        <motion.g animate={antennaControls}>
          <motion.line 
            x1="100" 
            y1="30" 
            x2="100" 
            y2="60" 
            stroke={robotColor} 
            strokeWidth="2"
            animate={isHovered ? { 
              y1: [30, 28, 30],
              transition: { 
                y1: { repeat: Infinity, duration: 0.5, repeatType: "reverse" } 
              }
            } : {}}
          />
          <motion.circle 
            cx="100" 
            cy="25" 
            r="6" 
            stroke={robotColor} 
            strokeWidth="2" 
            fill="none"
            animate={isHovered ? { 
              cy: [25, 23, 25],
              transition: { 
                cy: { repeat: Infinity, duration: 0.5, repeatType: "reverse" } 
              }
            } : {}}
          />
          <motion.circle 
            cx="100" 
            cy="25" 
            r="3" 
            fill={robotColor} 
            fillOpacity="0"
            animate={isHovered ? { 
              fillOpacity: [0, 0.5, 0],
              cy: [25, 23, 25],
              transition: { 
                fillOpacity: { repeat: Infinity, duration: 1, repeatType: "reverse" },
                cy: { repeat: Infinity, duration: 0.5, repeatType: "reverse" }
              }
            } : {}}
          />
        </motion.g>

        {/* Dynamic mouth that changes with hover/click */}
        <motion.path
          d={isClicked ? "M70,130 Q100,120 130,130" : isHovered ? "M70,130 Q100,140 130,130" : "M70,130 L80,125 L90,130 L100,125 L110,130 L120,125 L130,130"}
          stroke={robotColor}
          strokeWidth="2"
          fill="none"
          transition={{ duration: 0.3 }}
        />

        {/* Subtle rivet details for texture with hover effect */}
        {[
          { cx: 50, cy: 60 },
          { cx: 150, cy: 60 },
          { cx: 50, cy: 140 },
          { cx: 150, cy: 140 }
        ].map((rivet, i) => (
          <motion.g key={i}>
            <motion.circle 
              cx={rivet.cx} 
              cy={rivet.cy} 
              r="3" 
              stroke={robotColor} 
              strokeWidth="1.5" 
              fill="none"
              animate={isHovered ? { r: 3.5, strokeWidth: 2 } : {}}
              transition={{ duration: 0.3 }}
            />
            <motion.circle 
              cx={rivet.cx} 
              cy={rivet.cy} 
              r="1" 
              fill={robotColor}
              fillOpacity="0"
              animate={isHovered ? { fillOpacity: 0.7 } : { fillOpacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.g>
        ))}
      </motion.g>
    </motion.svg>
  )
}

export default SteampunkRobot

