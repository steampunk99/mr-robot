"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSmoothScroll } from "@/context/smooth-scroll"

type NavigationContextType = {
  isNavigating: boolean
  currentPath: string
  nextPath: string | null
  navigate: (path: string) => void
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  currentPath: "/",
  nextPath: null,
  navigate: () => {},
})

export const useNavigation = () => useContext(NavigationContext)

export function NavigationProvider({ children }) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentPath, setCurrentPath] = useState("/")
  const [nextPath, setNextPath] = useState<string | null>(null)
  const { lenis } = useSmoothScroll()

  // Update current path on client side
  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

  const navigate = useCallback(
    (path: string) => {
      if (path === currentPath) return
      
      // Lock scroll during transitions
      if (lenis) {
        lenis.stop()
      }
      
      setIsNavigating(true)
      setNextPath(path)
      
      // Allow time for exit animations
      setTimeout(() => {
        router.push(path)
        
        // Wait for page to load before allowing scroll again
        setTimeout(() => {
          if (lenis) {
            lenis.start()
          }
          setCurrentPath(path)
          setNextPath(null)
          setIsNavigating(false)
        }, 800) // Adjust timing based on your animation duration
      }, 400) // Adjust timing based on your exit animation duration
    },
    [currentPath, router, lenis]
  )

  return (
    <NavigationContext.Provider value={{ isNavigating, currentPath, nextPath, navigate }}>
      {children}
    </NavigationContext.Provider>
  )
}
