"use client"

import { createContext, useEffect, useState, useContext, ReactNode } from 'react'
import Lenis from 'lenis'

type SmoothScrollContextType = {
  lenis: Lenis | null
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null
})

export const useSmoothScroll = () => useContext(SmoothScrollContext)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,  
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      
      touchMultiplier: 2, 
      wheelMultiplier: 1.2, 
      
      infinite: false,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    
    requestAnimationFrame(raf)
    setLenis(lenis)
    
    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <SmoothScrollContext.Provider value={{ lenis }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
