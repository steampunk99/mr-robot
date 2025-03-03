"use client"

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Enhanced Word component that handles the color transformation with Japanese-inspired aesthetics
function Word({ 
  word, 
  index, 
  progress, 
  totalWords,
  highlightColors = ["#656565", "#a3a3a3", "#f5f5f5", "#ffffff"],
}: { 
  word: string;
  index: number;
  progress: number;
  totalWords: number;
  highlightColors?: string[];
}) {
  // Create a more refined, stylized color transition
  // Progress threshold values determine when the word changes color
  const startThreshold = index / totalWords;
  const endThreshold = (index + 1) / totalWords;
  
  // Determine the current state of the word based on scroll progress
  let currentColor = highlightColors[0]; // default color
  
  if (progress >= startThreshold - 0.05 && progress < startThreshold + 0.05) {
    // Word is beginning to be highlighted
    const localProgress = (progress - (startThreshold - 0.05)) / 0.1;
    currentColor = interpolateColor(highlightColors[0], highlightColors[1], localProgress);
  } else if (progress >= startThreshold + 0.05 && progress < endThreshold - 0.05) {
    // Word is fully highlighted
    currentColor = highlightColors[2];
  } else if (progress >= endThreshold - 0.05 && progress < endThreshold + 0.05) {
    // Word is fading out of highlight
    const localProgress = (progress - (endThreshold - 0.05)) / 0.1;
    currentColor = interpolateColor(highlightColors[2], highlightColors[3], localProgress);
  }
  
  // Apply Karesansui (Japanese zen garden) inspired styling
  // - Clean lines and subtle transitions
  // - Spacing resembling the measured intervals in zen gardens
  return (
    <motion.span
      style={{ 
        color: currentColor,
        display: 'inline-block',
        marginRight: '0.4em',
        letterSpacing: '0.02em',
        textShadow: '0 0 1px rgba(255,255,255,0.05)',
        fontWeight: 400,
        transition: 'color 0.3s ease',
      }}
    >
      {word}
    </motion.span>
  )
}

// Helper function to interpolate between two colors
function interpolateColor(color1: string, color2: string, factor: number) {
  if (factor <= 0) return color1;
  if (factor >= 1) return color2;
  
  // Convert hex to rgb
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  // Parse the hex values to get r, g, b components
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  // Interpolate each component
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  
  // Convert back to hex
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Character component for character-by-character highlighting
function Character({ 
  char, 
  index, 
  progress, 
  totalChars, 
  highlightColors = ["#656565", "#a3a3a3", "#f5f5f5", "#ffffff"],
}: { 
  char: string;
  index: number;
  progress: number;
  totalChars: number;
  highlightColors?: string[];
}) {
  // Similar logic to Word component but for individual characters
  const startThreshold = index / totalChars;
  const endThreshold = (index + 1) / totalChars;
  
  let currentColor = highlightColors[0];
  
  if (progress >= startThreshold - 0.02 && progress < startThreshold + 0.02) {
    const localProgress = (progress - (startThreshold - 0.02)) / 0.04;
    currentColor = interpolateColor(highlightColors[0], highlightColors[1], localProgress);
  } else if (progress >= startThreshold + 0.02 && progress < endThreshold - 0.02) {
    currentColor = highlightColors[2];
  } else if (progress >= endThreshold - 0.02 && progress < endThreshold + 0.02) {
    const localProgress = (progress - (endThreshold - 0.02)) / 0.04;
    currentColor = interpolateColor(highlightColors[2], highlightColors[3], localProgress);
  }
  
  return (
    <motion.span
      style={{ 
        color: currentColor,
        display: 'inline-block',
        transition: 'color 0.2s ease',
        textShadow: '0 0 1px rgba(255,255,255,0.05)',
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  )
}

// Types for all scroll highlight variants
type BaseScrollHighlightProps = {
  children: React.ReactNode
  className?: string
  highlightColors?: string[]
  scrollOffsetStart?: string
  scrollOffsetEnd?: string
}

type ScrollHighlightTextProps = BaseScrollHighlightProps & {
  mode?: 'word' | 'character'
}

export function ScrollHighlightText({ 
  children, 
  className = "", 
  highlightColors = ["#656565", "#a3a3a3", "#f5f5f5", "#ffffff"],
  scrollOffsetStart = "start 85%",
  scrollOffsetEnd = "end 15%",
  mode = 'word'
}: ScrollHighlightTextProps) {
  const textRef = useRef<HTMLDivElement>(null)
  const [words, setWords] = useState<string[]>([])
  const [chars, setChars] = useState<string[]>([])
  const [scrollProgress, setScrollProgress] = useState(0)
  
  // Use Framer Motion's built-in scroll utilities with improved settings
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: [scrollOffsetStart, scrollOffsetEnd]
  })
  
  // Parse children text into words or characters based on mode
  useEffect(() => {
    if (typeof children === 'string') {
      if (mode === 'word') {
        setWords(children.split(' '));
      } else {
        setChars(children.split(''));
      }
    } else if (children && typeof children === 'object') {
      const text = String(children);
      if (mode === 'word') {
        setWords(text.split(' '));
      } else {
        setChars(text.split(''));
      }
    }
  }, [children, mode]);
  
  // Update progress value for rendering optimization
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(setScrollProgress);
    return () => unsubscribe();
  }, [scrollYProgress]);
  
  return (
    <motion.div 
      ref={textRef} 
      className={`${className} font-light leading-relaxed tracking-wide`}
      style={{ lineHeight: 1.8 }}
    >
      {mode === 'word' ? (
        words.map((word, index) => (
          <Word
            key={index}
            word={word}
            index={index}
            progress={scrollProgress}
            totalWords={words.length}
            highlightColors={highlightColors}
          />
        ))
      ) : (
        chars.map((char, index) => (
          <Character
            key={index}
            char={char}
            index={index}
            progress={scrollProgress}
            totalChars={chars.length}
            highlightColors={highlightColors}
          />
        ))
      )}
    </motion.div>
  )
}

// Section-based text highlighting
export function ScrollHighlightSections({
  sections,
  className = "",
  highlightColors = ["#656565", "#a3a3a3", "#f5f5f5", "#ffffff"],
}: {
  sections: string[]
  className?: string
  highlightColors?: string[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  return (
    <div ref={containerRef} className={className}>
      {sections.map((section, index) => (
        <motion.div 
          key={index}
          className="my-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, delay: index * 0.1 }}
        >
          <ScrollHighlightText 
            highlightColors={highlightColors}
            scrollOffsetStart={`start ${85 - index * 5}%`}
            scrollOffsetEnd={`end ${15 + index * 5}%`}
          >
            {section}
          </ScrollHighlightText>
        </motion.div>
      ))}
    </div>
  )
}

export default ScrollHighlightText
