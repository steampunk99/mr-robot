"use client"

import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

type ParagraphRevealProps = {
  children: React.ReactNode
  className?: string
  threshold?: number
  delay?: number
  splitParagraphs?: boolean
  staggerAmount?: number
}

// Add new hook to detect scroll direction
function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset
      const direction = scrollY > lastScrollY ? 'down' : 'up'
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 10) {
        setScrollDirection(direction)
      }
      setLastScrollY(scrollY > 0 ? scrollY : 0)
    }

    window.addEventListener('scroll', updateScrollDirection)
    return () => window.removeEventListener('scroll', updateScrollDirection)
  }, [scrollDirection, lastScrollY])

  return scrollDirection
}

// Update ContentFade to use scroll direction
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
  const isInView = useInView(contentRef, { amount: 0.6, once: false }) // Changed to false to allow re-animation
  const scrollDirection = useScrollDirection()

  const getInitialDirection = () => {
    if (direction === "left") return { x: 70, y: 0 }
    if (direction === "right") return { x: -60, y: 0 }
    
    // For up/down, reverse based on scroll direction
    const baseY = direction === "up" ? 50 : -60
    return { x: 0, y: scrollDirection === "up" ? -baseY : baseY }
  }

  return (
    <motion.div
      ref={contentRef}
      className={className}
      initial={{ opacity: 0, ...getInitialDirection() }}
      animate={isInView 
        ? { opacity: 1, x: 0, y: 0 }
        : { opacity: 0, ...getInitialDirection() }
      }
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {children}
    </motion.div>
  )
}

// Update ParagraphReveal to use scroll direction
export default function ParagraphReveal({
  children,
  className = "",
  threshold = 0.2,
  delay = 0,
  splitParagraphs = true,
  staggerAmount = 0.2,
}: ParagraphRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: threshold }) // Removed once: true
  const scrollDirection = useScrollDirection()
  
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
      y: scrollDirection === 'up' ? "-110%" : "110%",
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
        className="text-[clamp(2rem,8vw,8rem)] font-medium tracking-tighter"
      >
        {children}
      </motion.div>
    </div>
  )
}
