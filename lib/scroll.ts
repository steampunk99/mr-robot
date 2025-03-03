"use client"

import { useSmoothScroll } from "@/context/smooth-scroll"

export const useScrollTo = () => {
  const { lenis } = useSmoothScroll()

  const scrollTo = (target: string | HTMLElement, options: any = {}) => {
    if (!lenis) return
    
    lenis.scrollTo(target, {
      offset: 0,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options
    })
  }

  return { scrollTo }
}
