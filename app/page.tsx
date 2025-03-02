"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { AnimatedAvatar } from "@/components/animated-avatar"

const projects = [
  {
    id: 1,
    title: "3D Product Configurator",
    description: "Interactive product visualization with real-time customization",
    image: "/5.png",
    tags: ["Three.js", "React", "WebGL"],
  },
  {
    id: 2,
    title: "Data Visualization Platform",
    description: "Real-time 3D data visualization for financial analytics",
    image: "/overview.png",
    tags: ["WebGL", "D3.js", "Three.js"],
  },
  {
    id: 3,
    title: "Virtual Gallery",
    description: "Immersive virtual art gallery experience",
    image: "/7654.jpg",
    tags: ["Three.js", "React", "GLSL"],
  },
  {
    id: 4,
    title: "Mobile AR Application",
    description: "Augmented reality experiences for mobile devices",
    image: "/mobile.png",
    tags: ["AR.js", "A-Frame", "JavaScript"],
  },
  {
    id: 5,
    title: "Interactive Registration Portal",
    description: "Modern registration system with 3D elements",
    image: "/reg1.png",
    tags: ["React", "NextJS", "Animation"],
  },
  {
    id: 6,
    title: "Video Streaming Platform",
    description: "High-performance video streaming with WebGL effects",
    image: "/video after overview.png",
    tags: ["WebGL", "Three.js", "Streaming"],
  },
]

export default function Home() {
  const containerRef = useRef(null)
  const [decryptedText, setDecryptedText] = useState("")
  const heroText = "I build cool shit"

  useEffect(() => {
    let iteration = 0
    const interval = setInterval(() => {
      setDecryptedText((prevText) => {
        const newText = heroText
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return heroText[index]
            }
            return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
          })
          .join("")

        if (iteration >= heroText.length) {
          clearInterval(interval)
        }
        iteration += 1 / 3
        return newText
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative selection:bg-white selection:text-black bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdjZoLTZ2LTZoNnptNi02djZoNnYtNmgtNnptLTYgMHY2aC02di02aDZ6bS02LTZ2NmgtNnYtNmg2em0xMiAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')]">
      <div className="fixed inset-0 bg-gradient-to-t from-black via-black/90 to-black/50 pointer-events-none"></div>
      <main ref={containerRef} className="relative py-20">
        <div className="max-w-[900px] mx-auto w-full px-4">
          <div className="content-cutout">
            {/* Hero Section */}
            <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="flex justify-center mb-8">
                  <AnimatedAvatar />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-6"
                >
                  <h2 className="text-sm tracking-wider uppercase text-neutral-400">3D Web Developer</h2>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-glow">{decryptedText}</h1>

                  <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                    Hi, I'm Lukwiya Bonnie. I specialize in creating interactive 3D web experiences that push the
                    boundaries of what's possible on the web.
                  </p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex items-center justify-center gap-6 pt-4"
                  >
                    <Link href="/work" className="text-sm hover:text-neutral-200 transition-colors">
                      View Work
                    </Link>
                    <span className="text-neutral-600">•</span>
                    <Link href="/contact" className="text-sm hover:text-neutral-200 transition-colors">
                      Get in Touch
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </section>

            {/* Projects Section */}
            <section className="py-20 border-t border-neutral-800">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-2 mb-16"
              >
                <div className="text-neutral-400 text-sm tracking-wider uppercase">Selected Work</div>
                <h2 className="text-2xl font-bold">Recent projects and experiments</h2>
              </motion.div>

              <div className="space-y-32">
                {projects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 border-t border-neutral-800">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-6 text-center"
              >
                <div className="text-neutral-400 text-sm tracking-wider uppercase">Get in Touch</div>
                <h2 className="text-2xl font-bold">Let's create something amazing together</h2>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-sm text-neutral-200 hover:text-neutral-100 transition-colors"
                >
                  Contact Me
                  <ArrowUpRight className="ml-1 w-4 h-4" />
                </Link>
              </motion.div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

function ProjectCard({ project, index }) {
  // Alternate layout direction for even/odd projects
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1
      }}
      viewport={{ once: true }}
      className="group"
    >
      <div className={`lg:grid lg:grid-cols-2 lg:gap-10 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
        <div className="aspect-video overflow-hidden bg-neutral-900 rounded-none mb-8 lg:mb-0">
          <Image
            src={project.image}
            alt={project.title}
            width={800}
            height={450}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            priority={index < 2}
          />
        </div>
        <div className="space-y-4">
          <Link href={`/work/${project.id}`} className="block">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl md:text-2xl font-bold group-hover:text-neutral-200 transition-colors">
                {project.title}
              </h3>
              <ArrowUpRight className="w-5 h-5 text-neutral-200 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <p className="text-neutral-500 my-4 text-base md:text-lg">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="text-xs text-neutral-500 px-2 py-1 rounded-none border border-neutral-800 group-hover:border-neutral-700 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
