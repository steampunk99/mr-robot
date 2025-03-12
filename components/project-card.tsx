"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Image from "next/image"
import { ExternalLink, Github, ChevronRight, ChevronLeft } from "lucide-react"
import { ParallaxElement, ParallaxLayer, ParallaxSection, ParallaxScale } from "@/components/parallax"
import useParallax from "@/hooks/use-parallax"

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
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: false, amount: 0.2 })
  
  // Parallax effects
  const { ref: imageRef, style: imageStyle } = useParallax({
    direction: index % 2 === 0 ? "right" : "left",
    speed: 0.5,
    range: [0, 60]
  })
  
  const { ref: contentRef, style: contentStyle } = useParallax({
    direction: index % 2 === 0 ? "left" : "right",
    speed: 0.3,
    range: [0, 40]
  })

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
    <div 
      ref={cardRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto px-10 h-full items-center"
    >
      {/* Project details with parallax effects */}
      <motion.div 
        ref={contentRef}
        style={contentStyle}
        className={`${index % 2 === 1 ? "md:order-2" : ""}`}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <ParallaxElement direction="up" speed={0.2} className="mb-4">
          <div className="flex items-center space-x-2 text-neutral-400 mb-4">
            <span className="text-sm">{project.year}</span>
            <span className="text-neutral-700">•</span>
            <span className="text-sm">{project.category}</span>
          </div>
        </ParallaxElement>
        
        <ParallaxElement direction="up" speed={0.3} delay={0.1}>
          <h3 className="text-3xl md:text-4xl font-light mb-4">{project.title}</h3>
        </ParallaxElement>
        
        <ParallaxElement direction="up" speed={0.4} delay={0.2}>
          <p className="text-neutral-400 mb-8 leading-relaxed">
            {project.description}
          </p>
        </ParallaxElement>

        <ParallaxElement direction="up" speed={0.5} delay={0.3}>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 border border-neutral-800 text-neutral-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </ParallaxElement>

        <ParallaxElement direction="up" speed={0.6} delay={0.4}>
          <div className="flex items-center space-x-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white hover:text-neutral-300 transition-colors"
              >
                <ExternalLink size={16} />
                <span>Live Site</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white hover:text-neutral-300 transition-colors"
              >
                <Github size={16} />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </ParallaxElement>
      </motion.div>

      {/* Project image with parallax effect */}
      <motion.div 
        ref={imageRef}
        style={imageStyle}
        className={`relative aspect-video overflow-hidden border border-neutral-800 rounded-md ${
          index % 2 === 1 ? "md:order-1" : ""
        }`}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
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
      </motion.div>
    </div>
  )
}

