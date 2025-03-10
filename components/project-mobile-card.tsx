"use client"

import { useState } from "react"
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

export default function ProjectMobileCard({ project, index }: ProjectProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<"overview" | "details">("overview")

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % project.images.length)
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
  }

  return (
    <div className="w-full h-full flex flex-col pt-20 pb-32 px-6 overflow-y-auto">
      {/* Project number */}
      <div className="text-6xl font-serif text-white/10 mb-4">{String(index + 1).padStart(2, "0")}</div>

      {/* Project header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-[1px] bg-white/50" />
          <span className="text-xs uppercase tracking-widest text-white/70">
            {project.category} — {project.year}
          </span>
        </div>

        <h2 className="text-3xl font-serif font-light mb-3 tracking-tight">{project.title}</h2>
        <p className="text-base text-white/70">{project.description}</p>
      </div>

      {/* Image gallery */}
      <div className="relative w-full aspect-[4/3] mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImageIndex}
            className="relative h-full w-full rounded-sm overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
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

        {/* Image navigation */}
        {project.images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-black/50 flex items-center justify-center"
              onClick={prevImage}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-black/50 flex items-center justify-center"
              onClick={nextImage}
            >
              <ChevronRight size={16} />
            </button>

            {/* Image dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {project.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`size-1.5 rounded-full transition-all duration-300 ${
                    i === activeImageIndex ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-white/10 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-2 px-4 text-sm ${activeTab === "overview" ? "text-white border-b border-white" : "text-white/50"}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`py-2 px-4 text-sm ${activeTab === "details" ? "text-white border-b border-white" : "text-white/50"}`}
        >
          Details
        </button>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-white/60 mb-6 text-sm leading-relaxed">{project.fullDescription}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-white/5 px-3 py-1 rounded-full text-white/70">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Features */}
            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-widest text-white/70 mb-3">Features</h3>
              <ul className="grid grid-cols-1 gap-2">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                    <div className="size-1 rounded-full bg-white/30" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

          
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

