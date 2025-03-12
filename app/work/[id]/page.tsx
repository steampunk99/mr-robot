"use client"

import { useEffect, useState, useRef } from "react"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ExternalLink, Github, ArrowRight, ArrowLeft } from "lucide-react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import projects from "@/data/projects.json"


export default function ProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const project = projects.projects.find((p) => p.id === params.id)
  const [cursorMode, setCursorMode] = useState<"default" | "view" | "drag" | "link">("default")
  const [cursorText, setCursorText] = useState("")
  const [activeImage, setActiveImage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Handle cursor interactions
  const handleLinkEnter = () => {
    setCursorMode("link")
    setCursorText("")
  }

  const handleLinkLeave = () => {
    setCursorMode("default")
    setCursorText("")
  }

  const handleImageEnter = () => {
    setCursorMode("view")
    setCursorText("View")
  }

  const handleImageLeave = () => {
    setCursorMode("default")
    setCursorText("")
  }

  const handleDragEnter = () => {
    setCursorMode("drag")
    setCursorText("Drag")
  }

  const handleDragLeave = () => {
    setCursorMode("default")
    setCursorText("")
  }

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -50])
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1])
  const contentY = useTransform(scrollYProgress, [0.1, 0.2], [50, 0])

  // Smooth animations
  const smoothHeaderY = useSpring(headerY, { damping: 20, stiffness: 100 })
  const smoothContentY = useSpring(contentY, { damping: 20, stiffness: 100 })

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        if (Number.parseInt(project?.id || "0") > 1) {
          router.push(`/projects/${Number.parseInt(project?.id || "0") - 1}`)
        }
      } else if (e.key === "ArrowRight") {
        if (Number.parseInt(project?.id || "0") < projects.projects.length) {
          router.push(`/projects/${Number.parseInt(project?.id || "0") + 1}`)
        }
      } else if (e.key === "Escape") {
        router.push("/about")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [project?.id, router])

  if (!project) {
    notFound()
  }

  return (
    <main ref={containerRef} className="bg-black text-white min-h-screen overflow-x-hidden">
    

      {/* Hero section */}
      <div className="relative h-screen w-full overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={project.images[0] || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover "
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </motion.div>

        {/* Back button */}
        <motion.div
          className="absolute top-24 left-10 z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link
            href="/work"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            onMouseEnter={handleLinkEnter}
            onMouseLeave={handleLinkLeave}
          >
            <ChevronLeft size={20} />
            <span className="text-sm tracking-wider uppercase">Back to projects</span>
          </Link>
        </motion.div>

        {/* Project title */}
        <motion.div
          className="absolute bottom-0 left-0 w-full p-10 md:p-20"
          style={{ opacity: headerOpacity, y: smoothHeaderY }}
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="w-10 h-[1px] bg-white/50" />
              <span className="text-xs uppercase tracking-widest text-white/70">
                {project.category} — {project.year}
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-8xl font-serif font-light tracking-tight leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {project.title}
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-white/70 mt-6 max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {project.description}
            </motion.p>

            <motion.div
              className="mt-10 flex gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
             
            </motion.div>
          </div>
        </motion.div>

     
      </div>

      {/* Content section */}
      <motion.div
        className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-32"
        style={{ opacity: contentOpacity, y: smoothContentY }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Left column - Main content */}
          <div className="md:col-span-2">
            <motion.h2
              className="text-3xl md:text-4xl font-serif mb-10 relative inline-block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Overview
              <motion.div
                className="absolute -bottom-2 left-0 h-[1px] bg-white/30"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </motion.h2>

            <motion.p
              className="text-xl text-white/70 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {project.fullDescription}
            </motion.p>

            {/* Image gallery */}
            <div className="mt-20">
              <motion.h2
                className="text-3xl md:text-4xl font-serif mb-10 relative inline-block"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Gallery
                <motion.div
                  className="absolute -bottom-2 left-0 h-[1px] bg-white/30"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </motion.h2>

              {/* Featured image */}
              <motion.div
                className="relative aspect-video mb-10 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                onMouseEnter={handleImageEnter}
                onMouseLeave={handleImageLeave}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    className="relative h-full w-full"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={project.images[activeImage] || "/placeholder.svg"}
                      alt={`${project.title} - Featured Image`}
                      fill
                      className="object-cover"
                      priority
                      quality={90}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Image navigation */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                  {project.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`size-2 rounded-full transition-all duration-300 ${
                        i === activeImage ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Thumbnail gallery */}
              <div
                ref={galleryRef}
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                onMouseEnter={handleDragEnter}
                onMouseLeave={handleDragLeave}
              >
                {project.images.map((image, index) => (
                  <motion.div
                    key={index}
                    className="relative aspect-[4/3] rounded-sm overflow-hidden cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setActiveImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${project.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${activeImage === index ? "opacity-0" : "opacity-100"}`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Project details */}
          <div className="space-y-16">
            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-sm uppercase tracking-widest text-white/70 mb-6 relative inline-block">
                Technologies
                <motion.div
                  className="absolute -bottom-2 left-0 h-[1px] bg-white/30"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag, i) => (
                  <motion.span
                    key={i}
                    className="text-xs bg-white/5 px-4 py-2 rounded-full text-white/70"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-sm uppercase tracking-widest text-white/70 mb-6 relative inline-block">
                Features
                <motion.div
                  className="absolute -bottom-2 left-0 h-[1px] bg-white/30"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </h3>
              <ul className="space-y-4">
                {project.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 text-white/60"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  >
                    <div className="size-1.5 rounded-full bg-white/30 mt-2" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Project info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-sm uppercase tracking-widest text-white/70 mb-6 relative inline-block">
                Project Info
                <motion.div
                  className="absolute -bottom-2 left-0 h-[1px] bg-white/30"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Year</span>
                  <span>{project.year}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Category</span>
                  <span>{project.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Client</span>
                  <span>Studio Ghibli</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Role</span>
                  <span>Lead Developer</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Next/Previous project navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          {Number.parseInt(project.id) > 1 && (
            <Link
              href={`/work/${Number.parseInt(project.id) - 1}`}
              className="group"
              onMouseEnter={handleLinkEnter}
              onMouseLeave={handleLinkLeave}
            >
              <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Previous Project</div>
              <div className="flex items-center gap-3 text-xl md:text-2xl font-serif group-hover:text-white/80 transition-colors">
                <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform duration-300" />
                <span>
                  {projects.projects.find((p) => p.id === String(Number.parseInt(project.id) - 1))?.title || ""}
                </span>
              </div>
            </Link>
          )}

          {Number.parseInt(project.id) < projects.projects.length && (
            <Link
              href={`/work/${Number.parseInt(project.id) + 1}`}
              className="group ml-auto"
              onMouseEnter={handleLinkEnter}
              onMouseLeave={handleLinkLeave}
            >
              <div className="text-xs uppercase tracking-widest text-white/50 mb-2 text-right">Next Project</div>
              <div className="flex items-center gap-3 text-xl md:text-2xl font-serif group-hover:text-white/80 transition-colors">
                <span>
                  {projects.projects.find((p) => p.id === String(Number.parseInt(project.id) + 1))?.title || ""}
                </span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Keyboard navigation hint */}
      <div className="fixed bottom-10 right-10 z-10 hidden md:flex items-center gap-3 text-white/40 text-xs">
        <span>Use</span>
        <div className="border border-white/20 rounded px-2 py-1">←</div>
        <div className="border border-white/20 rounded px-2 py-1">→</div>
        <span>to navigate projects</span>
      </div>
    </main>
  )
}

