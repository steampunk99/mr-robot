"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AnimatedAvatar() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1 },
      }}
      transition={{ duration: 0.5 }}
      className="relative w-24 h-24 md:w-32 md:h-32"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
        animate={{
          scale: isHovered ? 1.1 : 1,
          rotate: isHovered ? 180 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="absolute inset-1 rounded-full bg-black"
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <Avatar className="w-full h-full">
          <AvatarImage src="/profilepic.jpg" alt="Lukwiya Bonnie" />
          <AvatarFallback className="bg-neutral-900 text-white text-lg">LB</AvatarFallback>
        </Avatar>
      </motion.div>
    </motion.div>
  )
}

