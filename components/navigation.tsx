"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { CustomLink } from "@/components/custom-link"
import SteampunkRobot from "./steampunk-robot"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <nav className="flex justify-between items-center">
        <CustomLink href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <SteampunkRobot isLogo={true} section="home" className="relative z-10" />
            <motion.div 
              className="absolute inset-0 bg-white/10 rounded-full -z-0 opacity-0"
              whileHover={{ opacity: 0.5, scale: 1.1 }} 
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-sm font-light tracking-widest"></span>
        </CustomLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
          
          {/* Desktop Contact Button */}
          <CustomLink href="/contact" className="ml-4 px-4 py-2 border border-white/50 hover:border-white transition-colors">
            Get in Touch
          </CustomLink>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden w-10 h-10 relative focus:outline-none z-50" onClick={() => setIsOpen(!isOpen)}>
          <span className="sr-only">Toggle main menu</span>
          <div className="absolute w-5 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <span
              aria-hidden="true"
              className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${isOpen ? "rotate-45" : "-translate-y-1.5"}`}
            ></span>
            <span
              aria-hidden="true"
              className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${isOpen ? "opacity-0" : "opacity-100"}`}
            ></span>
            <span
              aria-hidden="true"
              className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${isOpen ? "-rotate-45" : "translate-y-1.5"}`}
            ></span>
          </div>
        </button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center"
          >
            {navItems.map((item) => (
              <CustomLink key={item.href} href={item.href} className="text-2xl py-2" onClick={() => setIsOpen(false)}>
                {item.label}
              </CustomLink>
            ))}
            <CustomLink href="/contact" className="mt-4 px-4 py-2 border border-white/50 hover:border-white transition-colors">
              Get in Touch
            </CustomLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function NavItem({ href, label }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <CustomLink href={href} className="relative px-3 py-2 group">
      <span className={`relative z-10 transition-colors duration-200 ${isActive ? "text-white font-bold" : "text-white/70 hover:text-white"}`}>
        {label}
      </span>
    </CustomLink>
  )
}
