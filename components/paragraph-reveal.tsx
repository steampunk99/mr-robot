"use client"

import React, { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

type ParagraphRevealProps = {
  children: React.ReactNode
  className?: string
  threshold?: number
  delay?: number
  splitParagraphs?: boolean
  staggerAmount?: number
}

export default function ParagraphReveal({
  children,
  className = "",
  threshold = 0.2,
  delay = 0,
  splitParagraphs = true,
  staggerAmount = 0.2,
}: ParagraphRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  
  // Transform text when in view
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: splitParagraphs ? staggerAmount : 0.015,
        delayChildren: delay,
      }
    }
  }
  
  // For line animation
  const lineVariants = {
    hidden: { 
      y: "110%",
      opacity: 0
    },
    visible: { 
      y: "0%",
      opacity: 1,
      transition: { 
        duration: 0.7, 
        ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier for a more natural feel
      }
    }
  }
  
  // Create content based on splitParagraphs option
  const renderContent = () => {
    if (typeof children !== 'string') {
      return <div>{children}</div>
    }
    
    if (splitParagraphs) {
      const paragraphs = children.split('\n\n').filter(Boolean)
      
      return (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {paragraphs.map((paragraph, index) => (
            <motion.div 
              key={index} 
              className="overflow-hidden my-6"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.5,
                    delay: delay + (index * staggerAmount)
                  } 
                }
              }}
            >
              <motion.p variants={lineVariants} className="leading-relaxed">
                {paragraph}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      )
    } else {
      return (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="overflow-hidden">
            <motion.p variants={lineVariants} className="leading-relaxed">
              {children}
            </motion.p>
          </div>
        </motion.div>
      )
    }
  }
  
  return (
    <div ref={ref} className={`${className} font-light`}>
      {renderContent()}
    </div>
  )
}

// For horizontally revealing text with a parallax effect
export function ParallaxText({
  children,
  className = "",
  baseVelocity = 3
}: {
  children: React.ReactNode,
  className?: string,
  baseVelocity?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  // Create parallax effect based on scroll
  const xPos = useTransform(
    scrollYProgress,
    [0, 1],
    [0, baseVelocity * -100]
  )
  
  return (
    <div ref={containerRef} className={`${className} overflow-hidden whitespace-nowrap`}>
      <motion.div
        style={{ x: xPos }}
        className="text-[clamp(3rem,8vw,10rem)] font-medium tracking-tighter"
      >
        {children}
      </motion.div>
    </div>
  )
}

// For large section headlines with masked reveal
export function MaskedText({
  children,
  className = ""
}: {
  children: React.ReactNode,
  className?: string
}) {
  const textRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(textRef, { once: true, amount: 0.3 })
  
  const textVariants = {
    hidden: {
      y: "100%"
    },
    visible: {
      y: "0%",
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }
  
  return (
    <div className={`${className} overflow-hidden relative`} ref={textRef}>
      <motion.div
        variants={textVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {children}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" 
           style={{ mixBlendMode: 'overlay' }}/>
    </div>
  )
}

// For subtle fade-in of content sections
export function ContentFade({
  children,
  className = "",
  direction = "up"
}: {
  children: React.ReactNode,
  className?: string,
  direction?: "up" | "down" | "left" | "right"
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(contentRef, { once: true, amount: 0.2 })
  
  const directionMap = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { y: 0, x: 20 },
    right: { y: 0, x: -20 }
  }
  
  const fadeVariants = {
    hidden: {
      opacity: 0,
      y: directionMap[direction].y,
      x: directionMap[direction].x
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }
  
  return (
    <motion.div
      ref={contentRef}
      className={className}
      variants={fadeVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  )
}
