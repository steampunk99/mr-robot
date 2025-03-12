"use client"

import { useState, useRef, useEffect } from "react"
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useMotionValue, 
  useSpring, 
  MotionValue 
} from "framer-motion"
import Image from "next/image"
import { ArrowUpRight, Code, Eye, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mediaquery"

interface ProjectCardProps {
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
  featured?: boolean
  layout?: "vertical" | "horizontal"
}

export default function ProjectCard({ 
  project, 
  index, 
  featured = false,
  layout = "horizontal" 
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const projectImageRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  // For mouse interaction on the card
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // For image transitions
  const imageControls = {
    x: useMotionValue(0),
    scale: useMotionValue(1)
  }
  
  // For spring physics
  const rotateX = useSpring(0, { stiffness: 100, damping: 30 })
  const rotateY = useSpring(0, { stiffness: 100, damping: 30 })
  const scaleSpring = useSpring(1, { stiffness: 400, damping: 30 })
  
  // For scroll-based reveal effect
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [60, 0, 0, -60])
  
  // For image auto-rotation
  useEffect(() => {
    if (isOpen || project.images.length <= 1) return
    
    const interval = setInterval(() => {
      setImageIndex(prev => (prev + 1) % project.images.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isOpen, project.images.length])
  
  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!projectImageRef.current || isOpen || isMobile) return
    
    const rect = projectImageRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const percentX = (e.clientX - centerX) / (rect.width / 2)
    const percentY = (e.clientY - centerY) / (rect.height / 2)
    
    // Update motion values
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
    
    // Update rotation with springs
    rotateY.set(percentX * 5) // -5 to 5 degrees
    rotateX.set(percentY * -5) // 5 to -5 degrees (inverted)
  }
  
  const handleMouseEnter = () => {
    scaleSpring.set(1.02)
  }
  
  const handleMouseLeave = () => {
    // Reset all values
    mouseX.set(0)
    mouseY.set(0)
    rotateX.set(0)
    rotateY.set(0)
    scaleSpring.set(1)
  }
  
  const nextImage = () => {
    setImageIndex(prev => (prev + 1) % project.images.length)
  }
  
  const prevImage = () => {
    setImageIndex(prev => (prev - 1 + project.images.length) % project.images.length)
  }
  
  // Get gradient angle based on index for unique card styling
  const getGradientAngle = () => {
    return ((index % 4) * 45) + 45
  }

  return (
    <motion.div
      ref={cardRef}
      className={`w-full relative ${featured ? 'mb-40' : 'mb-24 md:mb-32'}`}
      style={{ opacity, y }}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <ProjectDetail 
            project={project}
            imageIndex={imageIndex}
            setImageIndex={setImageIndex}
            onClose={() => setIsOpen(false)}
          />
        ) : (
          <motion.div
            className={`group relative rounded-2xl overflow-hidden ${
              layout === "horizontal" 
                ? "grid md:grid-cols-2 gap-8 items-center" 
                : "flex flex-col"
            } ${featured ? "md:p-6" : "md:p-3"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layoutId={`project-${project.id}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Project image with 3D rotation effect */}
            <motion.div 
              ref={projectImageRef}
              className={`relative rounded-xl overflow-hidden aspect-video ${
                layout === "horizontal" && index % 2 === 1 ? "md:order-2" : ""
              }`}
              style={{
                perspective: 1000,
                rotateX,
                rotateY,
                scale: scaleSpring,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)"
              }}
            >
              {/* Interactive overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10 transition-all duration-300 ease-out group-hover:opacity-60"
              />
              
              {/* Project number */}
              <div className="absolute top-4 left-4 z-30">
                <span className="text-xs font-medium text-white/70 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  {String(index + 1).padStart(2, "0")}/{project.category}
                </span>
              </div>
              
              {/* View project indicator (mobile) */}
              {isMobile && (
                <button
                  onClick={() => setIsOpen(true)}
                  className="absolute right-4 bottom-4 z-20 size-10 rounded-full bg-white flex items-center justify-center"
                >
                  <ArrowUpRight className="size-5 text-black" />
                </button>
              )}
              
              {/* Project images with crossfade transition */}
              <AnimatePresence mode="crossfade">
                <motion.div
                  key={imageIndex}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={project.images[imageIndex]}
                    fill
                    alt={project.title}
                    className="object-cover"
                    priority={featured}
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Image navigation indicators */}
              {project.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {project.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImageIndex(idx)}
                      className="relative"
                    >
                      <span 
                        className={`block size-2 rounded-full transition-all duration-300 ${
                          idx === imageIndex ? "bg-white" : "bg-white/40"
                        }`}
                      />
                      
                      {idx === imageIndex && (
                        <motion.span
                          className="absolute inset-0 -m-1 bg-white/0 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0, 0.2, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "loop"
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
            
            {/* Project content */}
            <div className={`${layout === "horizontal" && index % 2 === 1 ? "md:order-1" : ""}`}>
              <motion.div 
                className="pt-5 pb-2 md:py-0 space-y-4"
                style={{ perspective: 1000 }}
              >
                {/* Project title & year */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-white/30" />
                    <span className="text-xs text-white/60 uppercase tracking-wider">
                      {project.year}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-light tracking-tight">
                    {project.title}
                  </h3>
                </div>
                
                {/* Project description - truncated */}
                <p className="text-white/70 text-sm md:text-base line-clamp-3">
                  {project.description}
                </p>
                
                {/* Project tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, isMobile ? 3 : 5).map(tag => (
                    <span 
                      key={tag}
                      className="text-xs px-3 py-1 border border-white/10 rounded-full text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                  
                  {(isMobile ? project.tags.length > 3 : project.tags.length > 5) && (
                    <span className="text-xs px-3 py-1 border border-white/10 rounded-full text-white/80">
                      +{project.tags.length - (isMobile ? 3 : 5)}
                    </span>
                  )}
                </div>
                
                {/* Project actions */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="text-white group flex items-center gap-1.5 hover:gap-3 transition-all duration-300"
                  >
                    <span className="text-sm">View project</span>
                    <ArrowUpRight className="size-4 transition-all duration-300" />
                  </button>
                </div>
              </motion.div>
            </div>
            
            {/* Featured badge for highlighted projects */}
            {featured && (
              <div className="absolute -top-3 -right-3 z-10 rotate-12">
                <div 
                  className="bg-white/10 backdrop-blur-sm text-white px-4 py-1 text-xs uppercase tracking-wider border border-white/20 rounded-full"
                  style={{
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  Featured
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Detailed project view component
function ProjectDetail({ 
  project, 
  imageIndex, 
  setImageIndex, 
  onClose 
}: {
  project: ProjectCardProps["project"]
  imageIndex: number
  setImageIndex: (index: number) => void
  onClose: () => void
}) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "features">("overview")
  
  // For image swiping on mobile
  const dragX = useMotionValue(0)
  const dragThreshold = 50
  const dragEndRef = useRef(0)
  
  const handleDragEnd = () => {
    const distance = dragEndRef.current
    if (distance < -dragThreshold) {
      nextImage()
    } else if (distance > dragThreshold) {
      prevImage()
    }
    dragX.set(0)
    dragEndRef.current = 0
  }
  
  const handleDrag = (_: any, info: any) => {
    dragEndRef.current = info.offset.x
    dragX.set(info.offset.x)
  }
  
  const nextImage = () => {
    setImageIndex(prev => (prev + 1) % project.images.length)
  }
  
  const prevImage = () => {
    setImageIndex(prev => (prev - 1 + project.images.length) % project.images.length)
  }

  return (
    <motion.div
      layoutId={`project-${project.id}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Project detail container */}
      <motion.div
        ref={containerRef}
        className="relative max-w-6xl w-full max-h-[90vh] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 size-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10"
        >
          <X className="size-5" />
        </button>
        
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} h-full`}>
          {/* Left: Image gallery */}
          <div className="relative bg-black/60 h-[40vh] md:h-[90vh]">
            <motion.div
              drag={isMobile ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              onDrag={handleDrag}
              style={{ x: dragX }}
              className="h-full w-full"
            >
              <AnimatePresence mode="crossfade">
                <motion.div
                  key={imageIndex}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Image
                    src={project.images[imageIndex]}
                    fill
                    alt={project.title}
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
            
            {/* Navigation controls */}
            {project.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10"
                >
                  <ChevronLeft className="size-5" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10"
                >
                  <ChevronRight className="size-5" />
                </button>
              
                {/* Image indicators */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {project.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImageIndex(idx)}
                      className={`size-3 rounded-full transition-all duration-300 ${
                        idx === imageIndex ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Project metadata overlay */}
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-12 bg-white/40" />
                <span className="text-xs text-white/70 uppercase tracking-wider">
                  {project.year} • {project.category}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-1">
                {project.title}
              </h2>
            </div>
          </div>
          
          {/* Right: Project details */}
          <div className="p-6 md:p-8 overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
            {/* Tab navigation - only on mobile */}
            {isMobile && (
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
            )}
            
            {/* Content */}
            <AnimatePresence mode="wait">
              {(!isMobile || activeTab === "overview") && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={isMobile ? "" : "mb-10"}
                >
                  <div className="space-y-4">
                    <p className="text-white/80 text-sm md:text-base leading-relaxed">
                      {project.fullDescription}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags.map(tag => (
                        <span 
                          key={tag}
                          className="text-xs px-3 py-1 border border-white/10 rounded-full text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {(!isMobile || activeTab === "features") && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {!isMobile && (
                    <h3 className="text-xl font-light mb-4">Key Features</h3>
                  )}
                  
                  <ul className="space-y-3">
                    {project.features.map((feature, idx) => (
                      <motion.li 
                        key={idx}
                        className="flex items-start gap-3 text-sm md:text-base text-white/70"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                      >
                        <span className="text-white/40 mt-1">—</span>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
            
          
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

