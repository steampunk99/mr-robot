"use client"

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

type BlendScrollTextProps = {
  children: string
  className?: string
  lightColor?: string
  darkColor?: string
  blendMode?: 'difference' | 'exclusion' | 'screen' | 'overlay'
}

export function BlendScrollText({ 
  children, 
  className = "", 
  lightColor = "#ffffff", 
  darkColor = "#111111", 
  blendMode = "difference" 
}: BlendScrollTextProps) {
  const textRef = useRef<HTMLDivElement>(null)
  
  // Use Framer Motion's scroll utilities
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 85%", "end 15%"]
  })
  
  // Create color transition based on scroll position
  // This creates a Japanese-inspired subtle transition
  const color = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [darkColor, lightColor, darkColor]
  )
  
  // Subtle opacity change for more depth
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.7, 1, 0.7]
  )

  return (
    <motion.div 
      ref={textRef} 
      className={`${className} mix-blend-${blendMode}`}
      style={{ 
        color,
        opacity,
        fontWeight: 300,
        letterSpacing: '0.05em',
        lineHeight: 1.8,
      }}
    >
      {children}
    </motion.div>
  )
}

// A version that works with sections of text rather than the whole text
export function BlendScrollSections({ 
  sections, 
  className = "",
  lightColor = "#ffffff", 
  darkColor = "#111111",
  blendMode = "difference"
}: { 
  sections: string[], 
  className?: string,
  lightColor?: string, 
  darkColor?: string,
  blendMode?: 'difference' | 'exclusion' | 'screen' | 'overlay'
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className={className}>
      {sections.map((section, index) => {
        const isEven = index % 2 === 0
        
        return (
          <motion.div 
            key={index}
            className={`my-24 mix-blend-${blendMode}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
          >
            <BlendScrollText 
              lightColor={isEven ? lightColor : darkColor} 
              darkColor={isEven ? darkColor : lightColor}
              blendMode={blendMode}
            >
              {section}
            </BlendScrollText>
          </motion.div>
        )
      })}
    </div>
  )
}

export default BlendScrollText
