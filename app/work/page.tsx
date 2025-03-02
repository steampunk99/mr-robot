"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "Immersive Product Experience",
    description: "3D configurator for a luxury brand",
    image: "/placeholder.svg?height=800&width=1200",
    category: "E-commerce",
    year: "2023",
    tags: ["Three.js", "React", "WebGL"],
  },
  {
    id: 2,
    title: "Interactive Data Visualization",
    description: "Real-time 3D data visualization platform",
    image: "/placeholder.svg?height=800&width=1200",
    category: "Data Visualization",
    year: "2023",
    tags: ["D3.js", "Three.js", "React"],
  },
  {
    id: 3,
    title: "Virtual Gallery Experience",
    description: "WebGL-powered virtual art gallery",
    image: "/placeholder.svg?height=800&width=1200",
    category: "Arts & Culture",
    year: "2022",
    tags: ["WebGL", "Three.js", "GLSL"],
  },
]

export default function WorkPage() {
  return (
    <div className="relative min-h-screen bg-black selection:bg-white selection:text-black">
      {/* Background slice */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-neutral-950">
          <div className="absolute inset-y-0 right-[calc(50%-0.5px)] w-px bg-neutral-800" />
        </div>
      </div>

      <main className="relative pt-32 pb-20">
        <div className="max-w-[680px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="text-neutral-400 text-sm tracking-wider uppercase mb-4">Work</div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 text-white">
              Selected projects and experiments
            </h1>
            <p className="text-neutral-400 text-lg">
              A collection of work showcasing interactive 3D experiences and creative web development.
            </p>
          </motion.div>

          <div className="space-y-32">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function ProjectCard({ project, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Link href={`/work/${project.id}`} className="group block">
        <div className="aspect-[16/9] overflow-hidden bg-neutral-900 rounded-lg mb-6">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            width={1200}
            height={800}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-medium text-white group-hover:text-neutral-400 transition-colors mb-1">
                {project.title}
              </h2>
              <p className="text-sm text-neutral-400">{project.description}</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs text-neutral-400 px-2 py-1 rounded-full border border-neutral-800">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span>{project.category}</span>
            <span>•</span>
            <span>{project.year}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

