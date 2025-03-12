"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import SteampunkRobot from "./robot/steampunk-robot"
import { ArrowRight, Menu, X, ChevronRight, ExternalLink } from "lucide-react"

// Text split component for animated text
function SplitText({ text, ...props }: { text: string; [key: string]: any }) {
  return (
    <span {...props}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { y: "100%", opacity: 0 },
            visible: (custom: number) => ({
              y: 0,
              opacity: 1,
              transition: { 
                duration: 0.5, 
                ease: [0.16, 1, 0.3, 1],
                delay: custom * 0.03
              }
            })
          }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          custom={i}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}

// Enhanced navigation link with hover effects
function NavLink({ 
  href, 
  label, 
  description,
  isActive,
  index,
  onClick
}: { 
  href: string; 
  label: string; 
  description: string;
  isActive: boolean;
  index: number;
  onClick?: () => void;
}) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link 
        href={href} 
        onClick={onClick}
        className="flex flex-col"
      >
        <motion.div
          className="relative group flex items-center transition ease-linear"
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Active indicator */}
          {isActive && (
            <motion.div 
              layoutId="navActive"
              className="absolute left-0 w-1.5 h-12 rounded-full bg-gradient-to-b from-white via-white/70 to-transparent -ml-3"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          
      <span
            className={`text-3xl font-light tracking-wide transition-colors duration-300 ${
              isActive ? "text-white" : "text-white/50 hover:text-white"
        }`}
      >
        {label}
      </span>
          
          <motion.div
            className="ml-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
          >
            <ArrowRight size={16} className={isActive ? "text-white" : "text-white/50"} />
          </motion.div>
        </motion.div>
        
        {/* Link description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="text-sm text-white/40 mt-1 ml-0.5"
        >
          {description}
        </motion.p>
      </Link>
    </motion.div>
  )
}

// Mobile navigation link with simplified design
function MobileNavLink({ 
  href, 
  label, 
  isActive,
  index,
  onClick
}: { 
  href: string; 
  label: string; 
  isActive: boolean;
  index: number;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link 
        href={href} 
        onClick={onClick}
        className={`flex items-center justify-between py-4 border-b ${
          isActive 
            ? "border-white/30 text-white" 
            : "border-white/10 text-white/60"
        }`}
      >
        <span className="text-xl font-light">{label}</span>
        <ChevronRight size={16} className={isActive ? "text-white" : "text-white/40"} />
    </Link>
    </motion.div>
  )
}

// Enhanced and future-forward navigation
export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  
  // Enhanced navigation items
  const navItems = [
    { href: "/", label: "Home", description: "Welcome to my creative universe" },
    { href: "/work", label: "Projects", description: "Innovative works and experiments" },
    { href: "/about", label: "About", description: "My skills and experiences" },
    { href: "/contact", label: "Contact", description: "Let's create something remarkable" }
  ]
  
  // Set active navigation item
  const getActiveItem = () => {
    return navItems.findIndex(item => {
      if (item.href === "/" && pathname === "/") return true
      if (item.href !== "/" && pathname.startsWith(item.href)) return true
      return false
    })
  }
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    handleResize() // Initialize on mount
    
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <>
      {/* Header - Fully transparent */}
      <motion.header
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500 py-6"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Logo area */}
            <Link href="/" className="z-50 relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <SteampunkRobot 
                  width={100} 
                  height={100} 
                  isLogo={false} 
                  section={pathname === "/" ? "home" : pathname.slice(1) as any} 
                />
              </motion.div>
            </Link>

            {/* Menu toggle button - Only show this on desktop */}
            <motion.button
              className="relative z-50 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
              <div className="flex items-center gap-2">
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 45, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -45, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="hidden md:inline-block text-sm uppercase tracking-widest">
                  {isMenuOpen ? "Close" : "Menu"}
                </span>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Full-screen menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            className="fixed inset-0 z-40 bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Dynamic background pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{ 
                backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500/30 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/30 rounded-full blur-[100px]" />
            </div>

            {/* Menu content */}
            <div className="container mx-auto px-6 h-full flex flex-col pt-32 pb-8">
              {isMobile ? (
                // Mobile menu layout
                <div className="flex-1 flex flex-col">
                  <motion.div 
                    className="text-xs text-white/40 uppercase tracking-widest mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Navigation
                  </motion.div>
                  
                  <div className="space-y-0">
                    {navItems.map((item, index) => (
                      <MobileNavLink
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        isActive={index === getActiveItem()}
                        index={index}
                        onClick={() => setIsMenuOpen(false)}
                      />
                    ))}
                  </div>
                  
                  {/* Social links */}
                  <motion.div
                    className="mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-xs text-white/40 uppercase tracking-widest mb-6">Connect</div>
                    <div className="flex space-x-6">
                      {["Twitter", "GitHub", "LinkedIn"].map((social, index) => (
                        <a 
                          key={social} 
                          href="#" 
                          className="text-white/60 hover:text-white text-sm flex items-center gap-1"
                        >
                          {social}
                          <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                // Desktop menu layout
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                    {/* Main navigation */}
                    <div className="space-y-12">
                      {navItems.map((item, index) => (
                        <NavLink
                          key={item.href}
                          {...item}
                          isActive={index === getActiveItem()}
                          index={index}
                          onClick={() => setIsMenuOpen(false)}
                        />
                      ))}
                    </div>
                    
                    {/* Secondary content area */}
                    <div className="flex flex-col space-y-12">
                      {/* Featured content */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <h3 className="text-sm text-white/40 uppercase tracking-wider mb-6">Lou Later</h3>
                        
                        <Link href="/about" className="block relative group" onClick={() => setIsMenuOpen(false)}>
                          <div className="overflow-hidden rounded-lg mb-3 border border-white/10">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                              className="aspect-video bg-white/5 relative overflow-hidden"
                            >
                              <div className="absolute inset-0  z-10" />
                              <div 
                                className="absolute inset-0 bg-[url('/profilepic.jpg')] bg-fill bg-no-repeat bg-center"
                              />
                            </motion.div>
                          </div>
                        </Link>
                      </motion.div>
                      
                      {/* Contact info */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <h3 className="text-sm text-white/40 uppercase tracking-wider mb-6">Contact</h3>
                        <div className="space-y-3">
                          <a 
                            href="mailto:loulater99@gmail.com" 
                            className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
                          >
                            <span className="text-base">loulater99@gmail.com</span>
                            <ArrowRight size={14} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </a>
                          <a 
                            href="https://github.com/steampunk99" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
                          >
                            <span className="text-base">Github</span>
                            <ArrowRight size={14} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </a>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Footer area */}
              <motion.div
                className="py-6 mt-auto border-t border-white/10 text-sm text-white/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>© {new Date().getFullYear()} | All rights reserved</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

