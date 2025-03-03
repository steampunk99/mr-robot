"use client"

import NavigationButton from "@/components/navigation-button"
import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import CustomLink from "@/components/custom-link"
import AboutSection from "@/components/about-section"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, ChevronUp } from "lucide-react"
import AnimatedAvatar from "@/components/animated-avatar"
import MinimalistBackground from "@/components/minimalist-background"
import SocialAvatars from "@/components/social-avatars"
import { fadeInUp } from "@/animations/fade-in-up"
import ScrollIndicator from "@/components/scroll-indicator"
import CustomCursor from "@/components/custom-cursor"
import AnimatedTextReveal from "@/components/animated-text-reveal"
import SteampunkRobot from "@/components/steampunk-robot"
import ParagraphReveal, { ParallaxText, ContentFade } from "@/components/paragraph-reveal"

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
    document.documentElement.style.msOverflowStyle = 'none'; // IE/Edge
    
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
      document.documentElement.style.msOverflowStyle = '';
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

  // Fade-in animation variants with faster timing
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <main className="w-full min-h-screen bg-black text-white">
      {/* Custom cursor component */}
      <CustomCursor />
      
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
      <section 
        id="hero" 
        ref={heroSectionRef} 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background wrapper */}
        <div className="w-full h-full absolute top-0 left-0">
          <MinimalistBackground />
          
          {/* Large Steampunk Robot SVG in background */}
          <div className="absolute right-[5%] bottom-[10%] opacity-20 hidden md:block">
            <SteampunkRobot width={600} height={600} section="home" className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
        </div>
        
        {/* Vertical line - visible only on desktop */}
        <div className="absolute top-0 right-[15%] h-screen w-px bg-neutral-800/30 z-10 hidden md:block" />
        
        {/* Hero content with asymmetrical Japanese-inspired layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left content area - typographic focus */}
          <div className="md:col-span-7 md:col-start-2 mt-20 md:mt-0">
            {/* Subtle indicator line */}
            <div className="w-16 h-px bg-neutral-500/50 mb-8"></div>
            
            {/* Name with horizontal emphasis - with animated text reveal */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wider leading-tight">
              <AnimatedTextReveal 
                text="steampunk99" 
                className="block"
                delay={300}
              />
              <AnimatedTextReveal 
                text="Software Engineer" 
                className="block text-2xl md:text-3xl mt-2 text-neutral-500 font-extralight tracking-widest"
                delay={800}
              />
            </h1>
            
            {/* Minimalist description with ample whitespace - using new ParagraphReveal component */}
            <ParagraphReveal className="mt-12 text-lg font-light text-neutral-400 max-w-md leading-relaxed tracking-wide">
              Creating minimal and thoughtful digital experiences through code and design.
            </ParagraphReveal>
            
            {/* CTA area with asymmetrical layout */}
            <div className="mt-16 inline-flex flex-col items-start">
              <Link
                href="/work"
                className="group flex items-center space-x-2 border-b border-neutral-800 pb-1 hover:border-neutral-500 transition-colors duration-300"
              >
                <span className="text-sm tracking-widest uppercase font-light">View Work</span>
                <ArrowUpRight size={14} className="text-neutral-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
          
          {/* Right content area - visual focus with open space */}
          <div className="md:col-span-3 flex justify-end mt-6 md:mt-0">
            <SocialAvatars />
          </div>
        </div>
        
        {/* Scroll indicator - only on desktop */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center hidden md:flex">
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-light mb-4">Scroll</span>
          <div className="w-[1px] h-16 bg-neutral-700/30 relative">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-white h-1/3"
              animate={{ 
                y: [0, 20, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </section>

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
          <h2 className="text-2xl font-bold">Recent projects and experiments</h2>
        </motion.div>

        <div className="space-y-32">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactSectionRef} className="py-20 border-t border-neutral-800">
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
    </main>
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
