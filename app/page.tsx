"use client"


import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import AboutSection from "@/components/about-section"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, ChevronUp } from "lucide-react"
import SocialAvatars from "@/components/social-avatars"
import ScrollIndicator from "@/components/scroll-indicator"
import SteampunkRobotFull from "@/components/steampunk-robotfull"
import ParagraphReveal, { ParallaxText, ContentFade } from "@/components/paragraph-reveal"
import projects from "@/data/projects.json"
import AnimatedTextReveal from "@/components/animated-text-reveal"
import ProjectCard from "@/components/project-card"
import { ContactSection } from "@/components/contact"
import HeroSection from "@/components/hero"



export default function Home() {
  const heroSectionRef = useRef(null)
  const aboutSectionRef = useRef(null)
  const workSectionRef = useRef(null)
  const contactSectionRef = useRef(null)
  const pathname = usePathname()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Hide browser scrollbar
  useEffect(() => {
    document.documentElement.style.scrollbarWidth = 'none'; // Firefox

    
    // For Chrome, Safari, etc.
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      ::-webkit-scrollbar {
        display: none;
      }
      body {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Check if on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      document.documentElement.style.scrollbarWidth = '';
      document.head.removeChild(styleElement);
      window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Show scroll to top button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  // Sections for scroll indicator
  const sections = [
    { id: "hero", name: "Home" },
    { id: "about", name: "About" },
    { id: "work", name: "Work" },
    { id: "contact", name: "Contact" }
  ]



  return (
    <main className="w-full min-h-screen relative bg-black text-white ">
    
      {/* Scroll indicator */}
      <ScrollIndicator sections={sections} />
      
      {/* Scroll to top button */}
      <motion.button
        className="fixed right-8 bottom-8 w-10 h-10 flex items-center justify-center border border-neutral-800 rounded-full z-50 bg-black"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0, 
          y: showScrollTop ? 0 : 20,
          pointerEvents: showScrollTop ? "auto" : "none"
        }}
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronUp size={16} className="text-white" />
      </motion.button>

      {/* Hero section */}
     <HeroSection/>

      {/* About section */}
      <section id="about" ref={aboutSectionRef}>
        <AboutSection />
      </section>

      {/* Projects Section */}
      <section id="work" ref={workSectionRef} className="py-32 px-4 md:px-8 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-2 mb-16"
        >
          <div className="text-neutral-400 text-sm tracking-wider uppercase">Selected Work</div>
          <ParallaxText baseVelocity={-2} className="text-2xl p-24 font-bold">Recent projects</ParallaxText>
        </motion.div>

        <div className="space-y-32">
          {projects.projects.slice(0,3).map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactSectionRef} className="py-20 border-t relative border-neutral-800">
         {/* Background wrapper */}
             {/* Background elements */}
             <div className="absolute inset-0">
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff09_0,transparent_100%)]"></div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff09_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        </div>

        <ContactSection/>
      </section>
    </main>
  )
}


