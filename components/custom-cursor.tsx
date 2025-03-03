"use client"

import { useEffect, useRef } from "react"

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Skip on server or touch devices
    if (typeof window === "undefined") return
    
    const isTouchDevice = () => {
      return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0))
    }
    
    if (isTouchDevice()) {
      if (cursorRef.current) cursorRef.current.style.display = 'none'
      return
    }
    
    // Hide default cursor
    document.documentElement.style.cursor = 'none'
    
    // Simple direct positioning for the plus cursor
    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }
    }
    
    // Interactive states
    const onMouseDown = () => {
      if (cursorRef.current) {
        cursorRef.current.classList.add('scale-75')
      }
    }
    
    const onMouseUp = () => {
      if (cursorRef.current) {
        cursorRef.current.classList.remove('scale-75')
      }
    }
    
    // Hover effects on interactive elements
    const onElementHover = () => {
      if (cursorRef.current) {
        cursorRef.current.classList.add('cursor-expanded')
      }
    }
    
    const onElementLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.classList.remove('cursor-expanded')
      }
    }
    
    // Add event listeners
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, select, textarea, .interactive'
    )
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onElementHover)
      el.addEventListener('mouseleave', onElementLeave)
    })
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onElementHover)
        el.removeEventListener('mouseleave', onElementLeave)
      })
      
      document.documentElement.style.cursor = 'auto'
    }
  }, [])
  
  return (
    <div 
      ref={cursorRef}
      className="pointer-events-none fixed z-[9999] transition-transform duration-150 mix-blend-difference"
      style={{ 
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Plus cursor */}
      <div className="relative">
        {/* Horizontal line */}
        <div className="absolute h-[1px] w-[15px] bg-white top-0 left-[-7.5px]"></div>
        
        {/* Vertical line */}
        <div className="absolute w-[1px] h-[15px] bg-white top-[-7.5px] left-0"></div>
      </div>
      
      <style jsx global>{`
        .cursor-expanded {
          transform: translate(-50%, -50%) scale(2);
        }
      `}</style>
    </div>
  )
}
