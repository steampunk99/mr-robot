"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, MotionValue } from "framer-motion"
import { ChevronLeft, ChevronRight, Menu, X, Filter, ArrowRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mediaquery"
import ProjectCard from "@/components/project-card"
import ProjectMobileCard from "@/components/project-mobile-card"
import projects from "@/data/projects.json"

// Define project categories
const ALL_CATEGORIES = ["All", ...Array.from(new Set(projects.projects.map(p => p.category)))];

export default function ProjectsPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [view, setView] = useState<"carousel" | "grid">("carousel")
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Filter projects by category
  const filteredProjects = selectedCategory === "All" 
    ? projects.projects 
    : projects.projects.filter(p => p.category === selectedCategory);

  // Touch handling for mobile swipe
  const x = useMotionValue(0)
  const dragEndRef = useRef(0)
  const dragThreshold = 50

  // Handle touch/drag end
  const handleDragEnd = () => {
    const dragDistance = dragEndRef.current
    if (dragDistance < -dragThreshold && activeIndex < filteredProjects.length) {
      handleNext()
    } else if (dragDistance > dragThreshold && activeIndex > 0) {
      handlePrev()
    }
    dragEndRef.current = 0
  }

  // Update drag distance on drag
  const handleDrag = (event: any, info: any) => {
    dragEndRef.current = info.offset.x
  }

  // Navigation functions
  const handleNext = () => {
    if (activeIndex < filteredProjects.length) {
      setDirection(1)
      setActiveIndex((prev) => Math.min(prev + 1, filteredProjects.length))
    }
  }

  const handlePrev = () => {
    if (activeIndex > 0) {
      setDirection(-1)
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  // Reset activeIndex when category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev()
      } else if (e.key === "ArrowRight") {
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex])

  // Progress calculation
  const progress = activeIndex / Math.max(1, filteredProjects.length)

  // Background parallax effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return

    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window

    mouseX.set(clientX / innerWidth - 0.5)
    mouseY.set(clientY / innerHeight - 0.5)
  }

  const backgroundX = useTransform(mouseX, [-0.5, 0.5], ["-5%", "5%"])
  const backgroundY = useTransform(mouseY, [-0.5, 0.5], ["-5%", "5%"])

  const smoothBackgroundX = useSpring(backgroundX, { damping: 50, stiffness: 400 })
  const smoothBackgroundY = useSpring(backgroundY, { damping: 50, stiffness: 400 })

  // Custom scroll handler for grid view
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    // Add scroll-based animations or effects here if needed
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (view === 'grid' && scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [view]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-black text-white"
      onMouseMove={handleMouseMove}
    >
      {/* Background elements */}
      <motion.div
        className="absolute inset-0"
        style={{ 
          x: smoothBackgroundX, 
          y: smoothBackgroundY 
        }}
      >
        <video
          className="absolute inset-0 object-cover opacity-10 pointer-events-none scale-110"
          autoPlay
          loop
          muted
          playsInline
          src="/bg1.mp4"
        />
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/90"></div>
      </motion.div>

      {/* Decorative grain overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

      {/* Decorative grid lines */}
      <div className="absolute inset-0 grid grid-cols-6 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-l border-white/5 h-full" />
        ))}
      </div>
      <div className="absolute inset-0 grid grid-rows-6 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-t border-white/5 w-full" />
        ))}
      </div>

      {/* Header - Desktop & Mobile */}
      <div className="fixed top-24 left-0 w-full z-30 p-6 md:p-10 flex justify-between items-center">
        <motion.h1 
          className="font-serif text-2xl md:text-3xl tracking-tighter"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="font-light">Selected</span> Works
        </motion.h1>

        {!isMobile && (
          <div className="flex items-center gap-8">
            {/* View switcher */}
            <div className="flex items-center gap-3 border border-white/10 rounded-full p-1">
              <button 
                onClick={() => setView("carousel")} 
                className={`px-4 py-1 text-sm rounded-full transition-colors duration-300 ${
                  view === 'carousel' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                Carousel
              </button>
              <button 
                onClick={() => setView("grid")} 
                className={`px-4 py-1 text-sm rounded-full transition-colors duration-300 ${
                  view === 'grid' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                Grid
              </button>
            </div>
            
            {view === 'carousel' && (
              <div className="flex items-center gap-4">
                <div className="h-px w-[100px] bg-white/30"></div>
                <span className="text-sm font-light tracking-widest">
                  {String(activeIndex).padStart(2, "0")} / {String(filteredProjects.length).padStart(2, "0")}
                </span>
              </div>
            )}
            
            {/* Filter button */}
            <motion.button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={16} />
              <span>{selectedCategory}</span>
            </motion.button>
          </div>
        )}
        
        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-full border border-white/20"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {/* Category filter dropdown */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div
            className="fixed top-48 right-10 z-40 bg-black/90 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 flex flex-col min-w-48">
              {ALL_CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setFilterOpen(false);
                  }}
                  className={`py-2 px-4 text-left text-sm hover:bg-white/5 rounded-lg transition-colors ${
                    selectedCategory === category ? 'text-white font-medium' : 'text-white/60'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-95 backdrop-blur-sm flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h2 className="font-serif text-2xl">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full border border-white/20"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4">View Mode</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setView("carousel");
                      setMenuOpen(false);
                    }}
                    className={`px-4 py-2 rounded-lg border ${
                      view === 'carousel' ? 'bg-white/10 border-white/20' : 'border-white/10'
                    }`}
                  >
                    Carousel
                  </button>
                  <button
                    onClick={() => {
                      setView("grid");
                      setMenuOpen(false);
                    }}
                    className={`px-4 py-2 rounded-lg border ${
                      view === 'grid' ? 'bg-white/10 border-white/20' : 'border-white/10'
                    }`}
                  >
                    Grid
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4">Categories</h3>
                <div className="flex flex-col gap-3">
                  {ALL_CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setMenuOpen(false);
                      }}
                      className={`py-2 text-left flex items-center gap-3 border-b border-white/5 ${
                        selectedCategory === category ? 'text-white' : 'text-white/60'
                      }`}
                    >
                      {selectedCategory === category && (
                        <motion.div 
                          className="w-1 h-4 bg-white rounded-full"
                          layoutId="categoryIndicator"
                        />
                      )}
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation controls - Desktop (Carousel View) */}
      {!isMobile && view === 'carousel' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-8">
          <motion.button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className={`size-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 ${
              activeIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"
            }`}
            whileHover={activeIndex !== 0 ? { scale: 1.1 } : {}}
            whileTap={activeIndex !== 0 ? { scale: 0.9 } : {}}
          >
            <ChevronLeft size={20} />
          </motion.button>

          {/* Progress bar */}
          <div className="w-[200px] h-[2px] bg-white/20 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-white"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5 }}
            />
            <motion.div 
              className="absolute top-0 left-0 w-full h-full bg-white/10"
              animate={{ 
                scaleX: [1, 3, 1], 
                opacity: [0, 0.3, 0],
                x: ['-100%', '300%', '300%']
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: 'loop',
                ease: "linear" 
              }}
            />
          </div>

          <motion.button
            onClick={handleNext}
            disabled={activeIndex === filteredProjects.length}
            className={`size-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 ${
              activeIndex === filteredProjects.length ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"
            }`}
            whileHover={activeIndex !== filteredProjects.length ? { scale: 1.1 } : {}}
            whileTap={activeIndex !== filteredProjects.length ? { scale: 0.9 } : {}}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      )}

      {/* Navigation controls - Mobile (Carousel View) */}
      {isMobile && view === 'carousel' && (
        <div className="fixed bottom-6 left-0 w-full z-30 px-6">
          <div className="w-full h-[2px] bg-white/20 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-white"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5 }}
            />
            <motion.div 
              className="absolute top-0 left-0 w-full h-full bg-white/10"
              animate={{ 
                scaleX: [1, 3, 1], 
                opacity: [0, 0.3, 0],
                x: ['-100%', '300%', '300%']
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: 'loop',
                ease: "linear" 
              }}
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className={`px-4 py-2 flex items-center gap-2 ${activeIndex === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
            >
              <ChevronLeft size={16} />
              <span className="text-sm">Previous</span>
            </button>

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 text-sm bg-white/5 px-3 py-1 rounded-full"
            >
              <Filter size={14} />
              <span>{selectedCategory}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={activeIndex === filteredProjects.length}
              className={`px-4 py-2 flex items-center gap-2 ${activeIndex === filteredProjects.length ? "opacity-30 cursor-not-allowed" : ""}`}
            >
              <span className="text-sm">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Carousel View */}
      {view === 'carousel' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          drag={isMobile ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          onDrag={handleDrag}
          style={{ x }}
        >
          {/* About section (first slide) */}
          <AnimatePresence mode="wait">
            {activeIndex === 0 && (
              <motion.div
                key="about"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="max-w-3xl px-6 md:px-10">
                  <motion.div 
                    className="mb-6 md:mb-8 flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="w-8 md:w-12 h-[1px] bg-white/50" />
                    <span className="text-xs md:text-sm uppercase tracking-widest text-white/70">About</span>
                  </motion.div>

                  <motion.h2 
                    className="text-4xl md:text-6xl font-serif font-light mb-8 md:mb-12 tracking-tight leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    Embracing the beauty of <span className="italic">imperfection</span> and asymmetry
                  </motion.h2>

                  <motion.p 
                    className="text-base md:text-lg text-white/70 max-w-xl leading-relaxed mb-6 md:mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    My work is guided by the principles of <span className="text-white">wabi-sabi</span> and{" "}
                    <span className="text-white">ma</span> — finding beauty in imperfection and the power of negative
                    space. I believe in creating digital experiences that feel both timeless and contemporary.
                  </motion.p>

                  <motion.div 
                    className="flex items-center gap-4 md:gap-6 mt-10 md:mt-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <div className="size-[1px] bg-white/30 h-12 md:h-16" />
                    <div>
                      <p className="text-xs md:text-sm uppercase tracking-widest text-white/70 mb-2">Est. 2017</p>
                      <p className="text-xs md:text-sm text-white/50">Kampala - UG</p>
                    </div>
                  </motion.div>
                  
                  <motion.button
                    onClick={handleNext}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-10 group flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <span>Explore Projects</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Project slides */}
            {activeIndex > 0 && activeIndex <= filteredProjects.length && (
              <motion.div
                key={`project-${activeIndex}`}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {isMobile ? (
                  <ProjectMobileCard 
                    project={filteredProjects[activeIndex - 1]} 
                    index={activeIndex - 1} 
                  />
                ) : (
                  <ProjectCard 
                    project={filteredProjects[activeIndex - 1]} 
                    index={activeIndex - 1} 
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Grid View */}
      {view === 'grid' && (
        <div 
          ref={scrollContainerRef}
          className="absolute inset-0 pt-48 pb-20 px-10 overflow-y-auto hide-scrollbar"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto space-y-32 relative z-10"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                {isMobile ? (
                  <ProjectMobileCard project={project} index={index} />
                ) : (
                  <ProjectCard project={project} index={index} />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  )
}

