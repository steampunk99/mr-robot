"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRight, Plus } from "lucide-react"
import projectsData from "@/data/projects.json"

export default function ProjectsPage() {
  const router = useRouter()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const smoothProgress = useSpring(scrollYProgress, { damping: 15, stiffness: 90 })
  const headerY = useTransform(smoothProgress, [0, 0.1], [0, -50])
  const headerOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0])

  const [selectedCategory, setSelectedCategory] = useState("All")
  const [hoveredProject, setHoveredProject] = useState(null)
  const [filteredProjects, setFilteredProjects] = useState(projectsData.projects)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [cursorText, setCursorText] = useState("")
  const [isMobile, setIsMobile] = useState(true)

  // Get unique categories from projects
  const categories = ["All", ...new Set(projectsData.projects.map((project) => project.category))]

  // Filter projects when category changes
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProjects(projectsData.projects)
    } else {
      setFilteredProjects(projectsData.projects.filter((project) => project.category === selectedCategory))
    }
  }, [selectedCategory])

  // Check if device is mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Update cursor position with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setCursorPosition({ x: e.clientX, y: e.clientY })
      }, 5) // 5ms debounce
    }

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timeoutId)
    }
  }, [isMobile])

  // Handle project hover
  const handleProjectHover = (project: any, isHovering: boolean) => {
    if (isMobile) return
    setHoveredProject(isHovering ? project : null)
    setCursorText(isHovering ? "View" : "")
  }

  // Handle project click with custom routing
  const handleProjectClick = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault()
    router.push(`/work/${projectId}`)
  }

  return (
    <div ref={containerRef} className="bg-black text-white min-h-screen py-16">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 z-10 pointer-events-none opacity-[0.03] bg-[url('/dark.png')] bg-repeat"></div>

      {/* Custom cursor */}
      {!isMobile && (
        <AnimatePresence>
          {hoveredProject && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed z-50 pointer-events-none flex items-center justify-center"
              style={{
                left: cursorPosition.x,
                top: cursorPosition.y,
                x: "-50%",
                y: "-50%",
              }}
            >
              <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center">
                <span className="text-sm font-light">{cursorText}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

   

      {/* Category filter */}
      <section className="py-8 md:py-12 border-b border-neutral-900 overflow-x-auto">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="flex justify-start md:justify-center gap-4 md:gap-8"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm whitespace-nowrap transition-colors duration-300 ${
                  selectedCategory === category
                    ? "text-white border-b border-white"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-24">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                className={index % 3 === 0 ? "md:col-span-2" : ""}
              >
                <Link
                  href={`/work/${project.id}`}
                  onClick={(e) => handleProjectClick(e, project.id)}
                  className="block group"
                  onMouseEnter={() => handleProjectHover(project, true)}
                  onMouseLeave={() => handleProjectHover(project, false)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden mb-4 md:mb-6">
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 z-10"></div>
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    {!isMobile && (
                      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                          <Plus className="w-5 h-5 text-black" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2 mb-2 md:mb-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 border border-neutral-800 text-neutral-400">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-xl md:text-2xl font-light mb-2 group-hover:text-neutral-300 transition-colors duration-300">
                      {project.title}
                    </h2>

                    <p className="text-sm md:text-base text-neutral-400 line-clamp-2">{project.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-neutral-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-light mb-6 md:mb-8">Have a project in mind?</h2>
            <p className="text-base md:text-lg text-neutral-400 mb-8 md:mb-12 max-w-2xl mx-auto">
              I'm always open to discussing new projects and creative ideas.
            </p>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300"
              >
                <span className="mr-2">Get in touch</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

