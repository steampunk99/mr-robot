"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ExternalLink, Github, ChevronRight, ChevronLeft } from "lucide-react"

interface ProjectProps {
  project: {
    id: string
    title: string
    description: string
    fullDescription: string
    image: string
    images: string[]
    tags: string[]
    year: string
    category: string
    liveUrl: string
    githubUrl: string
    features: string[]
  }
  index: number
}

export default function ProjectCard({ project, index }: ProjectProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  // Auto-rotate images every 5 seconds if not hovering
  useEffect(() => {
    if (project.images.length <= 1 || isHovering) return

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % project.images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [project.images.length, isHovering])

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % project.images.length)
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto px-10 h-full items-center">
      {/* Left side - Image */}
      <div
        className="relative h-[70vh] w-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="absolute -top-6 -left-6 text-8xl font-serif text-white/10 select-none">
          {String(index + 1).padStart(2, "0")}
        </div>

        <motion.div
          className="relative h-full w-full overflow-hidden rounded-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeImageIndex}
              className="relative h-full w-full"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src={project.images[activeImageIndex] || "/placeholder.svg"}
                alt={`${project.title} - Image ${activeImageIndex + 1}`}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Image navigation controls */}
          {project.images.length > 1 && (
            <>
              {/* Image navigation dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {project.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`size-2 rounded-full transition-all duration-300 ${
                      i === activeImageIndex ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              {/* Image navigation arrows */}
              <motion.button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/10"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft size={20} />
              </motion.button>

              <motion.button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/10"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight size={20} />
              </motion.button>
            </>
          )}
        </motion.div>
      </div>

      {/* Right side - Content */}
      <motion.div
        className="flex flex-col h-full justify-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-[1px] bg-white/50" />
          <span className="text-xs uppercase tracking-widest text-white/70">
            {project.category} — {project.year}
          </span>
        </div>

        <h2 className="text-5xl font-serif font-light mb-6 tracking-tight">{project.title}</h2>

        <p className="text-lg text-white/70 mb-8">{project.description}</p>

        <p className="text-white/60 mb-10 leading-relaxed">{project.fullDescription}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-white/5 px-3 py-1 rounded-full text-white/70">
              {tag}
            </span>
          ))}
        </div>

        {/* Features */}
        <div className="mb-10">
          <h3 className="text-sm uppercase tracking-widest text-white/70 mb-4">Features</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                <div className="size-1 rounded-full bg-white/30" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

      
      </motion.div>
    </div>
  )
}

