"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mediaquery"
import ProjectCard from "@/components/project-card"
import ProjectMobileCard from "@/components/project-mobile-card"
import projects from "@/data/projects.json"

export default function ProjectsPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Touch handling for mobile swipe
  const x = useMotionValue(0)
  const dragEndRef = useRef(0)
  const dragThreshold = 50

  // Handle touch/drag end
  const handleDragEnd = () => {
    const dragDistance = dragEndRef.current
    if (dragDistance < -dragThreshold && activeIndex < projects.projects.length) {
      handleNext()
    } else if (dragDistance > dragThreshold && activeIndex > 0) {
      handlePrev()
    }
    dragEndRef.current = 0
  }

  // Update drag distance on drag
  const handleDrag = (event, info) => {
    dragEndRef.current = info.offset.x
  }

  // Navigation functions
  const handleNext = () => {
    if (activeIndex < projects.projects.length) {
      setDirection(1)
      setActiveIndex((prev) => Math.min(prev + 1, projects.projects.length))
    }
  }

  const handlePrev = () => {
    if (activeIndex > 0) {
      setDirection(-1)
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    }
  }

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
  const progress = activeIndex / projects.projects.length

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

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-black text-white"
      onMouseMove={handleMouseMove}
    >
      {/* Background elements */}
      <video
        className="absolute inset-0 object-cover opacity-10 pointer-events-none"
        autoPlay
        loop
        muted
        playsInline
        src="/bg1.mp4"
      />

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

      {/* Header - Desktop */}
      <div className="fixed top-24 left-0 w-full z-30 p-6 md:p-10 flex justify-between items-center">
        <h1 className="font-serif text-2xl md:text-3xl tracking-tighter">
          <span className="font-light">Selected</span> Works
        </h1>

        {!isMobile && (
          <div className="flex items-center gap-4">
            <div className="h-px w-[100px] bg-white/30"></div>
            <span className="text-sm font-light tracking-widest">
              {String(activeIndex).padStart(2, "0")} / {String(projects.projects.length).padStart(2, "0")}
            </span>
          </div>
        )}

     
      </div>

    

      {/* Navigation controls - Desktop */}
      {!isMobile && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-8">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className={`size-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 ${activeIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"}`}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Progress bar */}
          <div className="w-[200px] h-[2px] bg-white/20 relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-white"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <button
            onClick={handleNext}
            disabled={activeIndex === projects.projects.length}
            className={`size-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 ${activeIndex === projects.projects.length ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Navigation controls - Mobile */}
      {isMobile && (
        <div className="fixed bottom-6 left-0 w-full z-30 px-6">
          <div className="w-full h-[2px] bg-white/20 relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-white"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5 }}
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
              onClick={handleNext}
              disabled={activeIndex === projects.projects.length}
              className={`px-4 py-2 flex items-center gap-2 ${activeIndex === projects.projects.length ? "opacity-30 cursor-not-allowed" : ""}`}
            >
              <span className="text-sm">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Content container with drag support for mobile */}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-3xl px-6 md:px-10">
                <div className="mb-6 md:mb-8 flex items-center gap-4">
                  <div className="w-8 md:w-12 h-[1px] bg-white/50" />
                  <span className="text-xs md:text-sm uppercase tracking-widest text-white/70">About</span>
                </div>

                <h2 className="text-4xl md:text-6xl font-serif font-light mb-8 md:mb-12 tracking-tight leading-tight">
                  Embracing the beauty of <span className="italic">imperfection</span> and asymmetry
                </h2>

                <p className="text-base md:text-lg text-white/70 max-w-xl leading-relaxed mb-6 md:mb-8">
                  My work is guided by the principles of <span className="text-white">wabi-sabi</span> and{" "}
                  <span className="text-white">ma</span> — finding beauty in imperfection and the power of negative
                  space. I believe in creating digital experiences that feel both timeless and contemporary.
                </p>

                <div className="flex items-center gap-4 md:gap-6 mt-10 md:mt-16">
                  <div className="size-[1px] bg-white/30 h-12 md:h-16" />
                  <div>
                    <p className="text-xs md:text-sm uppercase tracking-widest text-white/70 mb-2">Est. 2017</p>
                    <p className="text-xs md:text-sm text-white/50">Kampala - UG</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects */}
        <AnimatePresence mode="wait" custom={direction}>
          {activeIndex > 0 && activeIndex <= projects.projects.length && (
            <motion.div
              key={activeIndex}
              custom={direction}
              initial={(direction) => ({
                x: direction > 0 ? "100%" : "-100%",
                opacity: 0,
              })}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={(direction) => ({
                x: direction > 0 ? "-100%" : "100%",
                opacity: 0,
              })}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 },
              }}
              className="w-full h-full flex items-center justify-center"
            >
              {isMobile ? (
                <ProjectMobileCard project={projects.projects[activeIndex - 1]} index={activeIndex - 1} />
              ) : (
                <ProjectCard project={projects.projects[activeIndex - 1]} index={activeIndex - 1} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Keyboard instructions - Desktop only */}
      {!isMobile && (
        <div className="fixed bottom-10 right-10 z-10 flex items-center gap-3 text-white/40 text-xs">
          <span>Use</span>
          <div className="border border-white/20 rounded px-2 py-1">←</div>
          <div className="border border-white/20 rounded px-2 py-1">→</div>
          <span>to navigate</span>
        </div>
      )}

      {/* Swipe instruction - Mobile only */}
      {isMobile && (
        <div className="fixed bottom-24 left-0 w-full flex justify-center z-10">
          <div className="text-white/40 text-xs px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full">
            Swipe to navigate
          </div>
        </div>
      )}
    </div>
  )
}

