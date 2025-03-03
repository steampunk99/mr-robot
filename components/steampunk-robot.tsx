"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface SteampunkRobotProps {
  width?: number
  height?: number
  className?: string
  isLogo?: boolean
  color?: string
  section?: 'home' | 'about' | 'work' | 'contact'
}

const SteampunkRobot: React.FC<SteampunkRobotProps> = ({ 
  width = 200, 
  height = 200,
  className = "",
  isLogo = false,
  color = "",
  section = 'home'
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Section-based colors
  const sectionColors = {
    home: "#d9d9d9",     // Light gray
    about: "#e0d5b8",    // Warm cream
    work: "#d6dde2",     // Soft blue-gray
    contact: "#d9cee0"   // Gentle purple-gray
  };
  
  // Use provided color or the section color
  const robotColor = color || sectionColors[section];
  
  // Animation variants for the robot parts
  const gearVariants = {
    idle: {
      rotate: [0, 360],
      transition: { 
        duration: 20, 
        ease: "linear", 
        repeat: Infinity 
      }
    },
    hover: {
      rotate: [0, 360],
      transition: { 
        duration: 10, 
        ease: "linear", 
        repeat: Infinity 
      }
    }
  }

  const antennaVariants = {
    idle: {
      y: [0, -3, 0],
      scale: [1, 1.05, 1],
      transition: { 
        duration: 2, 
        ease: "easeInOut", 
        repeat: Infinity 
      }
    },
    hover: {
      y: [0, -5, 0],
      scale: [1, 1.2, 1],
      transition: { 
        duration: 1, 
        ease: "easeInOut", 
        repeat: Infinity 
      }
    }
  }
  
  const robotVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.1 }
  }
  
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={isLogo ? 48 : width} 
      height={isLogo ? 48 : height} 
      viewBox="0 0 200 200"
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      variants={robotVariants}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <defs>
        {/* Subtle glow filter */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feFlood result="flood" floodColor="#ffffff" floodOpacity="0.3" />
          <feComposite in="flood" in2="SourceGraphic" operator="in" result="mask" />
          <feGaussianBlur in="mask" stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        {/* Inner shadow filter for a subtle 3D effect */}
        <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feOffset result="offOut" in="SourceAlpha" dx="0" dy="3" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>

      {/* Robot head shape - only outline */}
      <rect 
        x="50" 
        y="60" 
        width="100" 
        height="90" 
        rx="10" 
        stroke={robotColor} 
        strokeWidth="1.25" 
        fill="none"
      />
      
      {/* Left eye gear */}
      <motion.g 
        variants={gearVariants} 
        animate={isHovered ? "hover" : "idle"} 
        style={{ originX: "70px", originY: "85px" }}
      >
        <circle cx="70" cy="85" r="12" stroke={robotColor} strokeWidth="1.25" fill="none"/>
        {/* Gear teeth details */}
        <line x1="70" y1="65" x2="70" y2="68" stroke={robotColor} strokeWidth="1.25"/>
        <line x1="70" y1="105" x2="70" y2="108" stroke={robotColor} strokeWidth="1.25"/>
        <line x1="55" y1="85" x2="58" y2="85" stroke={robotColor} strokeWidth="1.25"/>
        <line x1="85" y1="85" x2="88" y2="85" stroke={robotColor} strokeWidth="1.25"/>
      </motion.g>

      {/* Right eye gear */}
      <motion.g 
        variants={gearVariants} 
        animate={isHovered ? "hover" : "idle"} 
        style={{ originX: "130px", originY: "85px" }}
      >
        <circle cx="130" cy="85" r="12" stroke={robotColor} strokeWidth="1.25" fill="none"/>
        {/* Gear teeth details */}
        <line x1="130" y1="65" x2="130" y2="68" stroke={robotColor} strokeWidth="1.25"/>
        <line x1="130" y1="105" x2="130" y2="108" stroke={robotColor} strokeWidth="1.25"/>
        <line x1="115" y1="85" x2="118" y2="85" stroke={robotColor} strokeWidth="1.25"/>
        <line x1="145" y1="85" x2="148" y2="85" stroke={robotColor} strokeWidth="1.25"/>
      </motion.g>

      {/* Antenna for a futuristic touch */}
      <motion.g 
        variants={antennaVariants} 
        animate={isHovered ? "hover" : "idle"}
      >
        <line x1="100" y1="30" x2="100" y2="60" stroke={robotColor} strokeWidth="1.25"/>
        <circle 
          cx="100" 
          cy="25" 
          r="5" 
          stroke={robotColor} 
          strokeWidth="1.25"
          fill="none"
        />
        <circle 
          cx="100" 
          cy="25" 
          r="2" 
          stroke={robotColor} 
          strokeWidth="1"
          fill="none"
        />
      </motion.g>

      {/* Smirking mouth */}
      <path
        d="M70,130 L80,125 L90,130 L100,125 L110,130 L120,125 L130,130"
        stroke={robotColor}
        strokeWidth="1.25"
        fill="none"
      />

      {/* Subtle rivet details for texture */}
      <circle cx="50" cy="60" r="2" stroke={robotColor} strokeWidth="1.25" fill="none"/>
      <circle cx="150" cy="60" r="2" stroke={robotColor} strokeWidth="1.25" fill="none"/>
      <circle cx="50" cy="140" r="2" stroke={robotColor} strokeWidth="1.25" fill="none"/>
      <circle cx="150" cy="140" r="2" stroke={robotColor} strokeWidth="1.25" fill="none"/>
    </motion.svg>
  )
}

export default SteampunkRobot
