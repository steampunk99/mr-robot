"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react"
import projectsData from "@/data/projects.json"

export default function ProjectPage() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [nextProject, setNextProject] = useState(null)

  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -100])

  useEffect(() => {
    // Find the current project
    const projectData = projectsData.projects.find((p) => p.id === id)

    if (projectData) {
      setProject(projectData)

      // Find the next project (or loop back to first)
      const currentIndex = projectsData.projects.findIndex((p) => p.id === id)
      const nextIndex = (currentIndex + 1) % projectsData.projects.length
      setNextProject(projectsData.projects[nextIndex])
    } else {
      // Project not found, redirect to work page
      router.push("/work")
    }

    setLoading(false)
  }, [id, router])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!project) return null

  return (
    <div ref={containerRef} className="bg-black text-white min-h-screen">
   

      {/* Project details */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-3xl font-light mb-8">Overview</h2>
                <div className="text-neutral-300 space-y-6">
                  <p className="text-lg">{project.fullDescription}</p>
                </div>
              </motion.div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-3">Year</h3>
                  <p>{project.year}</p>
                </div>

                <div>
                  <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-3">Category</h3>
                  <p>{project.category}</p>
                </div>

                <div>
                  <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <li key={index} className="text-neutral-300">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col space-y-4 pt-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm hover:text-neutral-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live Site
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm hover:text-neutral-400 transition-colors"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View Source Code
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Project images */}
      <section className="py-24 md:py-32 bg-neutral-950">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl font-light mb-16 md:mb-24"
          >
            Project Gallery
          </motion.h2>

          <div className="grid grid-cols-1 gap-12 md:gap-24">
            {project.images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Next project */}
      {nextProject && (
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-12"
            >
              <span className="text-sm uppercase tracking-widest text-neutral-500">Next Project</span>
            </motion.div>

            <Link href={`/work/${nextProject.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="relative group"
              >
                <div className="relative aspect-[21/9] overflow-hidden">
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500"></div>
                 

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-3xl md:text-5xl font-light mb-4">{nextProject.title}</h3>
                      <p className="text-neutral-300 max-w-xl mx-auto mb-6">{nextProject.description}</p>
                      <span className="inline-flex items-center text-sm border border-white/30 px-4 py-2 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                        <span className="mr-2">View Project</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

