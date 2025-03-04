"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Simple shape component using DOM elements instead of Three.js
const MinimalistShape = ({ 
  size, 
  positionX, 
  positionY, 
  opacity, 
  delay,
  isSquare = false
}: { 
  size: number
  positionX: string
  positionY: string
  opacity: number
  delay: number
  isSquare?: boolean
}) => {
  return (
    <motion.div
      className={`absolute ${isSquare ? 'rounded-none border border-neutral-400/30' : 'rounded-full bg-neutral-400/20'}`}
      style={{
        width: size,
        height: size,
        left: positionX,
        top: positionY,
        opacity: opacity,
      }}
      initial={{ scale: 0 }}
      animate={{ 
        scale: [0, 1, 0.8, 1],
        opacity: [0, opacity, opacity * 0.7, opacity],
        rotate: isSquare ? [0, 90, 180, 270] : 0,
      }}
      transition={{
        duration: isSquare ? 20 : 8,
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
  )
}

// Square outline for Japanese-inspired aesthetic
const SquareLine = ({ size, positionX, positionY }) => {
  return (
    <motion.div 
      className="absolute border border-neutral-500"
      style={{
        width: size,
        height: size,
        left: positionX,
        top: positionY,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: [0.2, 0.4, 0.2],
        scale: [0.9, 1, 0.7],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear"
      }}
    />
  )
}

export default function MinimalistBackground() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  // Generate an array of shapes with various positions and sizes
  const shapes = [
    { size: 60, positionX: '10%', positionY: '20%', opacity: 0.3, delay: 0 },
    { size: 120, positionX: '80%', positionY: '50%', opacity: 0.2, delay: 1 },
    { size: 40, positionX: '30%', positionY: '70%', opacity: 0.15, delay: 2 },
    { size: 90, positionX: '70%', positionY: '15%', opacity: 0.25, delay: 3 },
    { size: 70, positionX: '20%', positionY: '40%', opacity: 0.2, delay: 4 },
    { size: 50, positionX: '60%', positionY: '80%', opacity: 0.15, delay: 2.5 },
    { size: 35, positionX: '40%', positionY: '30%', opacity: 0.3, delay: 1.5, isSquare: true },
    { size: 100, positionX: '85%', positionY: '75%', opacity: 0.2, delay: 3.5, isSquare: true },
  ]

  // Square lines for enhanced Japanese aesthetic
  const squareLines = [
    { size: 200, positionX: '10%', positionY: '10%' },
    { size: 300, positionX: '60%', positionY: '30%' },
    { size: 150, positionX: '30%', positionY: '60%' },
    { size: 250, positionX: '70%', positionY: '70%' },
  ]

  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden">
      {/* Static lines for structure */}
      <div className="absolute top-0 right-[25%] w-px h-screen bg-neutral-500/20" />
      <div className="absolute top-[40%] left-0 w-screen h-px bg-neutral-500/20" />
      
      {/* Animated squares */}
      {squareLines.map((square, index) => (
        <SquareLine key={`square-${index}`} {...square} />
      ))}
      
      {/* Floating shapes */}
      {shapes.map((shape, index) => (
        <MinimalistShape key={`shape-${index}`} {...shape} />
      ))}
    </div>
  )
}
