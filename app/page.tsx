"use client"

import { useRef,useState } from "react"
import { motion } from "framer-motion"
import AboutSection from "@/components/home/about-section"
import Link from "next/link"
import { ChevronUp, ChevronRight } from "lucide-react"
import ParagraphReveal, { ParallaxText } from "@/components/paragraph-reveal"
import projects from "@/data/projects.json"
import ProjectCard from "@/components/project-card"
import { ContactSection } from "@/components/home/contact"
import HeroSection from "@/components/home/hero"
import useMousePosition from "@/hooks/use-mouse-position"


export default function Home() {
  const heroSectionRef = useRef(null)
  const aboutSectionRef = useRef(null)
  const workSectionRef = useRef(null)
  const contactSectionRef = useRef(null)

  const [isHovered, setIsHovered] = useState(false);

  const { x, y } = useMousePosition();

  const size = isHovered ? 400 : 40;

  return (
    <main className="w-full min-h-screen relative bg-black text-white overflow-hidden">
      {/* Interactive Robot that responds to scrolling */}
     
     
      
      {/* Hero section */}
      <section id="home" ref={heroSectionRef}>
        <HeroSection />
      </section>

      {/* About section */}
      <section id="about" ref={aboutSectionRef}>
        <AboutSection />
      </section>

      {/* Projects Section */}
      <section id="work" ref={workSectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-2 mb-16"
        >
          <div className="text-neutral-400 text-sm tracking-wider uppercase">Selected Work</div>
          <ParallaxText baseVelocity={-2} className="md:p-12">
            Projects
          </ParallaxText>
        </motion.div>

        {/* Grid pattern background */}
        <div className="absolute inset-0 grid grid-cols-6 pointer-events-none opacity-20">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-l border-white/5 h-full" />
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-6 pointer-events-none opacity-20">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-t border-white/5 w-full" />
          ))}
        </div>

        <div className="space-y-32">
          {projects.projects.slice(3,6).map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
        
        <motion.div 
          className="mt-24 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link href="/work" className="group relative flex items-center justify-center gap-2 px-8 py-3 border border-white/10 rounded-full hover:bg-white/5 transition-all duration-300">
            <span className="text-white/80 group-hover:text-white transition-colors">
              View all projects
            </span>
            <motion.div
              className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
            >
              <ChevronRight size={16} className="text-white" />
            </motion.div>
            
            {/* Hover effect */}
            <motion.div 
              className="absolute inset-0 -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)"
              }}
            />
          </Link>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactSectionRef}>
        <ContactSection />
      </section>
      
      {/* Scroll to top button */}
      <motion.a
        href="#home"
        className="fixed right-8 bottom-8 size-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ y: -5 }}
      >
        <ChevronUp className="size-5" />
      </motion.a>
    </main>
  )
}


