"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface AnimatedTextRevealProps {
  text: string
  className?: string
  tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  delay?: number
  duration?: number
  staggerDelay?: number
  charDelay?: number
}

export default function AnimatedTextReveal({
  text,
  className = '',
  tagName = 'span',
  delay = 0,
  duration = 0.5,
  staggerDelay = 0.03,
  charDelay = 0.01
}: AnimatedTextRevealProps) {
  const [displayText, setDisplayText] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const characters = text.split('')
  
  // Split the text into individual character spans for animation
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay * 0.001,
      },
    }),
  }
  
  const child = {
    hidden: {
      y: 50,
      opacity: 0,
      filter: "blur(10px)",
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: duration
      },
    },
  }
  
  // Japanese-inspired after-glow effect animation
  const lineVariants = {
    hidden: { 
      scaleX: 0,
      opacity: 0
    },
    visible: { 
      scaleX: 1, 
      opacity: [0, 0.8, 0],
      transition: { 
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        delay: text.length * charDelay + delay * 0.001 + 0.3
      }
    }
  }

  const Tag = tagName;

  return (
    <div className="relative">
      <motion.div
        className={className}
        variants={container}
        initial="hidden"
        animate="visible"
        style={{ 
          display: "inline-block",
          position: "relative",
          overflow: "hidden" 
        }}
      >
        {characters.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={child}
            style={{ 
              display: "inline-block",
              position: "relative",
              whiteSpace: char === " " ? "pre" : "normal"
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
      
      {/* Subtle horizontal line that animates after text appears - Japanese aesthetic */}
      <motion.div 
        className="absolute -bottom-1 left-0 h-px bg-white/40"
        style={{ originX: 0 }}
        variants={lineVariants}
        initial="hidden"
        animate="visible"
      />
    </div>
  )
}
