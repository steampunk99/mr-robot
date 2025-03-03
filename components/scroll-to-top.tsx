"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSmoothScroll } from '@/context/smooth-scroll'

export function ScrollToTop() {
  const pathname = usePathname()
  const { lenis } = useSmoothScroll()
  
  useEffect(() => {
    if (lenis) {
      // Scroll to top on page change
      lenis.scrollTo(0, { immediate: true })
    }
  }, [pathname, lenis])
  
  return null
}
