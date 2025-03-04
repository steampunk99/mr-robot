"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ParallaxText,MaskedText } from "./paragraph-reveal"
import SteampunkRobot from "./steampunk-robot"
import SteampunkRobotFull from "./steampunk-robotfull"

const SocialAvatars = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [expandedAvatar, setExpandedAvatar] = useState<string | null>(null)

  // Track mouse position for avatar interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    window.addEventListener("mousemove", handleMouseMove)
    
    // Close expanded avatar when clicking outside
    const handleClickOutside = () => {
      if (expandedAvatar) {
        setExpandedAvatar(null)
      }
    }
    
    window.addEventListener("click", handleClickOutside)
    
    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClickOutside)
    }
  }, [expandedAvatar])

  // Calculate distance from avatar to cursor for interactive glow effect
  const getDistanceFromAvatar = (avatarRect: DOMRect) => {
    if (!avatarRect) return 100 // Default value when rect not available
    
    const avatarCenterX = avatarRect.left + avatarRect.width / 2
    const avatarCenterY = avatarRect.top + avatarRect.height / 2
    
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - avatarCenterX, 2) + 
      Math.pow(mousePosition.y - avatarCenterY, 2)
    )
    
    // Normalize distance (closer = higher value)
    const maxDistance = 250
    const normalizedDistance = Math.max(0, 1 - distance / maxDistance)
    return normalizedDistance
  }

  // Avatars with Japanese-inspired minimalist design
  const avatars = [
    {
      id: "personal",
      src: "/profilepic.jpg",
      alt: "Personal Avatar",
      href: "https://twitter.com/bonnie_lukwiya",
      size: isMobile ? 64 : 72,
      expandable: true
    },
    {
      id: "github",
      src: "/github-avatar.svg",
      alt: "GitHub",
      href: "https://github.com/steampunk99",
      size: isMobile ? 34 : 40,
      expandable: false
    },
    {
      id: "instagram",
      src: "/reddit.png",
      alt: "Reddit",
      href: "https://www.reddit.com/user/PureHeroine______/",
      size: isMobile ? 25 : 35,
      expandable: false
    },
  ]

  // Handle tapping on avatar - prevent event propagation to avoid immediate closing
  const handleAvatarClick = (e: React.MouseEvent, avatarId: string) => {
    e.stopPropagation();
    if (avatarId === "personal") {
      setExpandedAvatar(expandedAvatar === avatarId ? null : avatarId);
    }
  };

  return (
    <>
      <div className={`flex ${isMobile ? 'mt-4 justify-center' : 'items-end justify-end'}`}>
        <div className="flex space-x-6">
          {avatars.map((avatar) => (
            <AvatarWithGlow 
              key={avatar.id} 
              avatar={avatar} 
              getDistanceFromAvatar={getDistanceFromAvatar}
              isExpanded={expandedAvatar === avatar.id}
              onAvatarClick={handleAvatarClick}
            />
          ))}
        </div>
      </div>
      
      {/* Full-screen backdrop for expanded avatar */}
      <AnimatePresence>
        {expandedAvatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0  z-50 flex items-center justify-center"
            onClick={() => setExpandedAvatar(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", damping: 5 }}
              className="relative rounded-full overflow-hidden"
              style={{ width: '180px', height: '180px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <SteampunkRobotFull height={400} width={260} section="home" className="relative z-10" />
              <div 
                className="absolute inset-0 rounded-full"
                style={{ 
                  boxShadow: `0 0 40px 20px rgba(255, 255, 255, 0.3)`,
                }}
              />
              
              <div className="absolute inset-0 rounded-sm " />
            </motion.div>
          
          
           
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Individual avatar component with cursor-responsive glow
const AvatarWithGlow = ({ 
  avatar, 
  getDistanceFromAvatar,
  isExpanded,
  onAvatarClick
}: { 
  avatar: any, 
  getDistanceFromAvatar: (rect: DOMRect) => number,
  isExpanded: boolean,
  onAvatarClick: (e: React.MouseEvent, avatarId: string) => void
}) => {
  const [glowIntensity, setGlowIntensity] = useState(0)
  const [avatarRef, setAvatarRef] = useState<HTMLDivElement | null>(null)
  
  // Update glow based on cursor distance
  useEffect(() => {
    if (!avatarRef) return
    
    const updateGlow = () => {
      const rect = avatarRef.getBoundingClientRect()
      const distance = getDistanceFromAvatar(rect)
      setGlowIntensity(distance)
    }
    
    const interval = setInterval(updateGlow, 50)
    return () => clearInterval(interval)
  }, [avatarRef, getDistanceFromAvatar])

  return (
    <div 
      ref={setAvatarRef}
      className="relative cursor-none"
      onClick={(e) => avatar.expandable && onAvatarClick(e, avatar.id)}
    >
      {avatar.expandable ? (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          {/* Glow ring - Japanese-inspired minimal design */}
          <div 
            className="absolute inset-0 rounded-full transition-all duration-200"
            style={{ 
              boxShadow: `0 0 ${10 + glowIntensity * 15}px ${glowIntensity * 10}px rgba(255, 255, 255, ${0.1 + glowIntensity * 0.3})`,
              transform: `scale(${1 + glowIntensity * 0.1})`,
              opacity: 0.2 + glowIntensity * 0.8
            }}
          />
          
          {/* Thin border ring - inspired by Japanese design */}
          <div 
            className="absolute inset-0 rounded-full border border-white/30"
            style={{ 
              opacity: 0.3 + glowIntensity * 0.7,
              transform: `scale(${1.1 + glowIntensity * 0.1})`
            }}
          />
          
          {/* Avatar image - monochrome filter */}
          <div className="rounded-full overflow-hidden relative" style={{ width: avatar.size, height: avatar.size }}>
            <Image
              src={avatar.src}
              alt={avatar.alt}
              width={avatar.size}
              height={avatar.size}
              className="rounded-full filter grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </motion.div>
      ) : (
        <Link href={avatar.href} target="_blank">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            {/* Glow ring - Japanese-inspired minimal design */}
            <div 
              className="absolute inset-0 rounded-full transition-all duration-200"
              style={{ 
                boxShadow: `0 0 ${10 + glowIntensity * 15}px ${glowIntensity * 10}px rgba(255, 255, 255, ${0.1 + glowIntensity * 0.3})`,
                transform: `scale(${1 + glowIntensity * 0.1})`,
                opacity: 0.2 + glowIntensity * 0.8
              }}
            />
            
            {/* Thin border ring - inspired by Japanese design */}
            <div 
              className="absolute inset-0 rounded-full border border-white/30"
              style={{ 
                opacity: 0.3 + glowIntensity * 0.7,
                transform: `scale(${1.1 + glowIntensity * 0.1})`
              }}
            />
            
            {/* Avatar image - monochrome filter */}
            <div className="rounded-full overflow-hidden relative" style={{ width: avatar.size, height: avatar.size }}>
              <Image
                src={avatar.src}
                alt={avatar.alt}
                width={avatar.size}
                height={avatar.size}
                className="rounded-full filter  transition-all duration-300"
              />
            </div>
          </motion.div>
        </Link>
      )}
    </div>
  )
}

export default SocialAvatars
