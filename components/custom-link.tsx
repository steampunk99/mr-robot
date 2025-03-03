"use client"

import Link from "next/link"
import { useNavigation } from "@/context/navigation-context"

type CustomLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function CustomLink({ href, children, className = "", onClick }: CustomLinkProps) {
  const { navigate, isNavigating, currentPath } = useNavigation()

  const isExternal = href.startsWith("http")

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick()
    
    if (isNavigating) {
      e.preventDefault()
      return
    }

    // Don't handle navigation for external links or if we're already on the page
    if (isExternal || href === currentPath) return

    e.preventDefault()
    navigate(href)
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
