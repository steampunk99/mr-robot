"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent, useSpring } from "framer-motion"

interface ScrollMarqueeProps {
  largeText: string
  smallTexts: string[]
  largeTextColor?: string
  smallTextColor?: string
  speed?: {
    large: number
    small: number
  }
  baseSpeed?: number // Base speed for autoplay
}

export default function ScrollMarquee({
  largeText,
  smallTexts,
  largeTextColor = "text-white",
  smallTextColor = "text-gray-400",
  speed = { large: 0.5, small: 0.9 },
  baseSpeed = 120, // Base pixels per second for autoplay
}: ScrollMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const largeWrapperRef = useRef<HTMLDivElement>(null)
  const smallWrapperRef = useRef<HTMLDivElement>(null)
  
  const [containerHeight, setContainerHeight] = useState(0)
  const [largeTextWidth, setLargeTextWidth] = useState(0)
  const [smallTextWidth, setSmallTextWidth] = useState(0)

  // Create a duplicated array for small texts with separators
  const smallTextsWithSeparators = smallTexts.map(text => `${text} • `).join(' ')
  
  // Animation values
  const largePosition = useMotionValue(0)
  const smallPosition = useMotionValue(0)
  
  // For smooth scroll influence
  const scrollVelocity = useMotionValue(0)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  })

  // Get the scroll velocity to influence marquee speed
  const { scrollY } = useScroll()
  
  // Track the previous scroll position to calculate velocity
  const prevScrollY = useRef(0)
  
  // Update measurements when the component mounts and on resize
  useEffect(() => {
    const updateMeasurements = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.offsetHeight)
      }
      
      // Get actual text widths
      if (largeWrapperRef.current) {
        const firstChild = largeWrapperRef.current.firstChild as HTMLElement
        if (firstChild) {
          setLargeTextWidth(firstChild.offsetWidth)
        }
      }
      
      if (smallWrapperRef.current) {
        const firstChild = smallWrapperRef.current.firstChild as HTMLElement
        if (firstChild) {
          setSmallTextWidth(firstChild.offsetWidth)
        }
      }
    }
    
    // Initial update
    updateMeasurements()
    
    // Update on window resize
    window.addEventListener('resize', updateMeasurements)
    
    // Run again after a short delay to account for any layout shifts
    const timeoutId = setTimeout(updateMeasurements, 500)
    
    return () => {
      window.removeEventListener('resize', updateMeasurements)
      clearTimeout(timeoutId)
    }
  }, [])
  
  // Update scroll velocity effect
  useMotionValueEvent(scrollY, "change", (current) => {
    // Calculate velocity (positive when scrolling down, negative when scrolling up)
    const velocity = current - prevScrollY.current
    scrollVelocity.set(velocity * 2) // Amplify the effect
    prevScrollY.current = current
  })
  
  // Create continuous animation for large text
  useEffect(() => {
    if (!largeTextWidth) return
    
    let largeAnimationId: number
    let prevLargeTime = 0
    let largeDelta = 0
    
    const animateLargeText = (time: number) => {
      if (prevLargeTime) {
        const timeDelta = time - prevLargeTime
        // Base animation speed (negative direction) - slower for large text
        const basePixelsPerSecond = -baseSpeed * 0.4
        // Add scroll influence - scrolling down speeds up, scrolling up slows/reverses
        const scrollInfluence = smoothVelocity.get() * speed.large * 2
        const totalDelta = (basePixelsPerSecond - scrollInfluence) * (timeDelta / 1000)
        
        // Update position
        largeDelta += totalDelta
        // Reset when we've moved one full width
        if (Math.abs(largeDelta) >= largeTextWidth) {
          largeDelta = largeDelta % largeTextWidth
        }
        
        largePosition.set(largeDelta)
      }
      
      prevLargeTime = time
      largeAnimationId = requestAnimationFrame(animateLargeText)
    }
    
    largeAnimationId = requestAnimationFrame(animateLargeText)
    
    return () => {
      cancelAnimationFrame(largeAnimationId)
    }
  }, [largeTextWidth, speed.large, smoothVelocity, baseSpeed])
  
  // Create continuous animation for small text
  useEffect(() => {
    if (!smallTextWidth) return
    
    let smallAnimationId: number
    let prevSmallTime = 0
    let smallDelta = 0
    
    const animateSmallText = (time: number) => {
      if (prevSmallTime) {
        const timeDelta = time - prevSmallTime
        // Base animation speed (positive direction) - faster for small text
        const basePixelsPerSecond = baseSpeed * 0.6
        // Add scroll influence - scrolling down speeds up, scrolling up slows/reverses
        const scrollInfluence = smoothVelocity.get() * speed.small * 3
        const totalDelta = (basePixelsPerSecond - scrollInfluence) * (timeDelta / 1000)
        
        // Update position
        smallDelta += totalDelta
        // Reset when we've moved one full width
        if (Math.abs(smallDelta) >= smallTextWidth) {
          smallDelta = smallDelta % smallTextWidth
        }
        
        smallPosition.set(smallDelta)
      }
      
      prevSmallTime = time
      smallAnimationId = requestAnimationFrame(animateSmallText)
    }
    
    smallAnimationId = requestAnimationFrame(animateSmallText)
    
    return () => {
      cancelAnimationFrame(smallAnimationId)
    }
  }, [smallTextWidth, speed.small, smoothVelocity, baseSpeed])

  // Create repeated texts with enough copies to ensure seamless looping
  const repeatedLargeText = Array(4).fill(largeText)
  
  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-black py-12">
      {/* Large text marquee */}
      <div className="whitespace-nowrap relative overflow-hidden">
        {/* First copy and duplicate for seamless looping */}
        <motion.div 
          ref={largeWrapperRef}
          className="inline-flex"
          style={{ x: largePosition }}
        >
          {repeatedLargeText.map((text, index) => (
            <h1 
              key={index} 
              className={`text-6xl md:text-8xl font-bold tracking-tighter ${largeTextColor} flex-shrink-0 pr-16`}
            >
              {text}
            </h1>
          ))}
          {/* Duplicate the first set for seamless looping */}
          {repeatedLargeText.map((text, index) => (
            <h1 
              key={`duplicate-${index}`} 
              className={`text-6xl md:text-8xl font-bold tracking-tighter ${largeTextColor} flex-shrink-0 pr-16`}
            >
              {text}
            </h1>
          ))}
        </motion.div>
      </div>

      {/* Small text marquee */}
      <div className="mt-4 whitespace-nowrap relative overflow-hidden">
        <motion.div 
          ref={smallWrapperRef}
          className="inline-flex items-center"
          style={{ x: smallPosition }}
        >
          {/* First copy */}
          <div className={`text-xl md:text-2xl ${smallTextColor} flex items-center`}>
            {Array(8).fill(smallTextsWithSeparators).map((text, index) => (
              <span key={index} className="flex-shrink-0">
                {text}
              </span>
            ))}
          </div>
          {/* Duplicate for seamless looping */}
          <div className={`text-xl md:text-2xl ${smallTextColor} flex items-center`}>
            {Array(8).fill(smallTextsWithSeparators).map((text, index) => (
              <span key={`duplicate-${index}`} className="flex-shrink-0">
                {text}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

