"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
}

export default function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()

    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative h-[400px] rounded-xl group cursor-pointer transition-all duration-300"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0 rounded-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 scale-110 group-hover:scale-125"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <motion.div
          style={{
            transform: "translateZ(75px)",
          }}
          className="absolute inset-0 z-20 p-6 flex flex-col justify-end"
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl font-bold mb-2 text-white"
          >
            {project.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 mb-4 line-clamp-2"
          >
            {project.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-white/10 backdrop-blur-sm text-white border-none">
                {tag}
              </Badge>
            ))}
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: isHovered ? 1 : 0.8,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{
              transform: "translateZ(100px)",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-white text-black p-4 rounded-full">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"
      />
    </motion.div>
  )
}

