"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import Image from "next/image"
import { ChevronRight, ChevronLeft, Code, Eye, Plus, X } from "lucide-react"

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
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // For image animation
  const imageX = useSpring(0, { stiffness: 300, damping: 30 })
  const dragEndRef = useRef(0)
  const dragThreshold = 50

  // Auto-rotate images every 5 seconds if not expanded
  useEffect(() => {
    if (project.images.length <= 1 || isExpanded) return

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % project.images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [project.images.length, isExpanded])

  const handleDragEnd = () => {
    const dragDistance = dragEndRef.current
    if (dragDistance < -dragThreshold) {
      nextImage()
    } else if (dragDistance > dragThreshold) {
      prevImage()
    }
    imageX.set(0)
    dragEndRef.current = 0
  }

  const handleDrag = (_: any, info: any) => {
    dragEndRef.current = info.offset.x
    imageX.set(info.offset.x)
  }

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % project.images.length)
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
  }
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="w-full pb-24">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <ExpandedMobileProject 
            project={project} 
            activeImageIndex={activeImageIndex}
            setActiveImageIndex={setActiveImageIndex}
            toggleExpanded={toggleExpanded}
          />
        ) : (
          <motion.div 
            className="w-full px-5"
            layoutId={`project-mobile-${project.id}`}
          >
            {/* Project header with indicator */}
            <motion.div 
              className="mb-6 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-7xl font-serif text-white/5 mb-4 absolute -left-1 top-0 opacity-50 select-none">
                {String(index + 1).padStart(2, "0")}
              </div>
              
              <div className="pl-12">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-[1px] bg-white/50" />
                  <span className="text-xs uppercase tracking-widest text-white/70">
                    {project.category} — {project.year}
                  </span>
                </div>

                <h2 className="text-3xl font-light mb-4 tracking-tight leading-tight">{project.title}</h2>
                <p className="text-sm text-white/70 leading-relaxed">{project.description}</p>
              </div>
            </motion.div>

            {/* Image gallery with 3D effect */}
            <motion.div 
              className="relative w-full aspect-[4/3] mb-6 rounded-xl overflow-hidden border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Decorative overlays */}
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>

              <motion.div
                className="h-full w-full"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                onDrag={handleDrag}
                style={{ x: imageX }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    className="relative h-full w-full"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={project.images[activeImageIndex]}
                      alt={`${project.title} - Image ${activeImageIndex + 1}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Image navigation */}
              {project.images.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 size-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10"
                    onClick={prevImage}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 size-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10"
                    onClick={nextImage}
                  >
                    <ChevronRight size={16} />
                  </button>

                  {/* Image dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {project.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className="relative"
                      >
                        <span 
                          className={`block size-2 rounded-full transition-all duration-300 ${
                            i === activeImageIndex ? "bg-white" : "bg-white/30"
                          }`}
                        />
                        
                        {i === activeImageIndex && (
                          <motion.span 
                            className="absolute inset-0 -m-1 rounded-full bg-white/0"
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0, 0.5, 0] 
                            }}
                            transition={{ 
                              repeat: Infinity,
                              duration: 2
                            }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            {/* Tags */}
            <motion.div
              className="flex flex-wrap gap-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {project.tags.map((tag, i) => (
                <motion.span 
                  key={i} 
                  className="text-xs px-3 py-1 border border-white/10 rounded-full text-white/80"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 + 0.2 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            {/* Action links */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <Eye size={16} />
                  <span className="text-sm">Live Site</span>
                </motion.a>
              )}
              
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <Code size={16} />
                  <span className="text-sm">Source</span>
                </motion.a>
              )}
              
              <motion.button
                onClick={toggleExpanded}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors ml-auto"
                whileHover={{ x: 5 }}
              >
                <Plus size={16} />
                <span className="text-sm">Details</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Expanded mobile project view
function ExpandedMobileProject({ 
  project, 
  activeImageIndex, 
  setActiveImageIndex, 
  toggleExpanded 
}: { 
  project: ProjectProps["project"];
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
  toggleExpanded: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "features">("overview")
  
  return (
    <motion.div
      className="relative bg-black/90 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      layoutId={`project-mobile-${project.id}`}
    >
      {/* Close button */}
      <motion.button
        className="absolute top-4 right-4 z-50 size-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10"
        onClick={toggleExpanded}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X size={16} />
      </motion.button>
      
      <div className="p-5 pt-12">
        {/* Project header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-[1px] bg-white/50" />
            <span className="text-xs uppercase tracking-widest text-white/70">
              {project.category} — {project.year}
            </span>
          </div>
          
          <h2 className="text-2xl font-light mb-4 tracking-tight">{project.title}</h2>
        </div>
        
        {/* Image gallery */}
        <div className="relative w-full aspect-[4/3] mb-6 rounded-lg overflow-hidden border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImageIndex}
              className="relative h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={project.images[activeImageIndex]}
                alt={`${project.title} - Image ${activeImageIndex + 1}`}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Image navigation */}
          {project.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {project.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className="relative"
                >
                  <span 
                    className={`block size-2 rounded-full transition-all duration-300 ${
                      i === activeImageIndex ? "bg-white" : "bg-white/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Tab navigation */}
        <div className="flex border border-white/10 rounded-lg p-0.5 mb-5 self-start">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-1.5 px-4 text-sm rounded-md transition-colors ${
              activeTab === "overview" 
                ? "bg-white/10 text-white" 
                : "text-white/60 hover:text-white/80"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("features")}
            className={`py-1.5 px-4 text-sm rounded-md transition-colors ${
              activeTab === "features" 
                ? "bg-white/10 text-white" 
                : "text-white/60 hover:text-white/80"
            }`}
          >
            Features
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
              <p className="text-white/70 mb-6 text-sm leading-relaxed">{project.fullDescription}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-xs px-3 py-1 border border-white/10 rounded-full text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Features */}
              <ul className="space-y-3 mb-6">
                {project.features.map((feature, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-3 text-sm text-white/70"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <span className="text-white/40 mt-1">—</span>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Links */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-white/10">
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-2 text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye size={16} />
              <span>View Live</span>
            </motion.a>
          )}
          
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white rounded-lg px-3 py-2 border border-white/10 text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Code size={16} />
              <span>Source</span>
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

