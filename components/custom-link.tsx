"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useSmoothScroll } from "@/context/smooth-scroll"

type CustomLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function CustomLink({ href, children, className = "", onClick }: CustomLinkProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { lenis } = useSmoothScroll()
  const [isMobile, setIsMobile] = useState(false)
  
  // Detect mobile on client side
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const isExternal = href.startsWith("http")
  const isHomeLink = href === "/" || href === ""
  
  // Special handling for home link
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick()
    
    // Don't handle navigation for external links
    if (isExternal) return
    
    // Special handling for home button when already on home page
    if (isHomeLink && pathname === "/") {
      e.preventDefault()
      
      // Lock scroll during transition
      if (lenis) lenis.stop()
      
      // Different approach for mobile vs desktop
      if (isMobile) {
        // For mobile: create a more dramatic change to force the animation
        document.body.style.opacity = "0.01"
        setTimeout(() => {
          window.location.href = "/"
        }, 50)
      } else {
        // Desktop approach - change URL and force a refresh
        window.history.pushState({}, "", "/?refresh=" + Date.now())
        router.refresh()
        
        // Reset URL after a moment
        setTimeout(() => {
          window.history.pushState({}, "", "/")
          
          // Re-enable scroll after transition completes
          setTimeout(() => {
            if (lenis) lenis.start()
          }, 1000)
        }, 50)
      }
    } else {
      // For regular navigation, just lock the scroll
      // Next.js Page Transition component will handle the animation
      if (lenis) lenis.stop()
      
      // Re-enable scroll after transition completes
      setTimeout(() => {
        if (lenis) lenis.start()
      }, 1500)
    }
  }

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
