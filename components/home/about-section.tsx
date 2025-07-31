"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import ParagraphReveal, { ContentFade, ParallaxText } from "@/components/paragraph-reveal"
import { ParallaxElement, ParallaxLayer, ParallaxSection } from "@/components/parallax"
import Image from "next/image"

// Organize skills into categories
const skillsByCategory = {
  "Design": [
    { name: "UI/UX", level: "Advanced" },
    { name: "Interactive Design", level: "Advanced" },
    { name: "Design Systems", level: "Advanced" },
  ],
  "Languages": [
    { name: "Typescript", level: "Advanced" },
    { name: "Python", level: "Advanced" },
    { name: "HTML & css", level: "Advanced" },
  ],
  "Frontend": [
    { name: "Next.js", level: "Advanced" },
    { name: "Tailwind css", level: "Advanced" },
  
  ],
  "Animation": [
    { name: "Framer Motion", level: "Advanced" },
    { name: "Green sock", level: "Intermediate" },
    { name: "Three.js", level: "Advanced" },
  ],
  "Backend": [
    { name: "Express.js", level: "Advanced" },
    { name: "Nest.js", level: "Advanced" },
    { name: "Database Design", level: "Prisma ORM" },
  ]
}

// Bio paragraphs with line breaks for better spacing
const bioParagraphs = [
  "I craft digital experiences at the intersection of design and technology, blending minimal aesthetics with functional purpose.",
  "With a focus on motion and interaction, I create interfaces that feel alive and responsive, elevating the user experience beyond the static page.",
  "My approach combines technical precision with creative intuition, resulting in work that is both visually compelling and technically sound."
]

const AboutSection = () => {
  const containerRef = useRef(null)
  const headingRef = useRef(null)
  const imageContainerRef = useRef(null)
  const isHeadingInView = useInView(headingRef, { once: false, amount: 0.2 })
  const isImageInView = useInView(imageContainerRef, { once: false, amount: 0.2 })
  
  // Create refs for skill categories with their view states
  const categoryRefs = Object.keys(skillsByCategory).map(() => useRef(null))
  const categoriesInView = categoryRefs.map(ref => useInView(ref, { once: false, amount: 0.3 }))
  
  // Scroll-driven animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -50])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.6])
  
  return (
    <motion.section 
      ref={containerRef}
      className="min-h-screen bg-[#0D1321] text-white overflow-hidden"
    >
      {/* Fixed background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:100px_100px] opacity-30 pointer-events-none" />
      
      {/* Main content container */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-[20vh] pb-[15vh] relative">
        {/* About header with massive typography */}
        <div className="mb-[20vh]">
          <motion.div
            ref={headingRef}
            className="relative overflow-hidden"
            style={{ y: headerY, opacity: headerOpacity }}
          >
            <motion.h1 
              className="text-[clamp(5rem,25vw,20rem)] font-thin leading-[0.85] tracking-tighter mb-10"
              initial={{ y: 200, opacity: 0 }}
              animate={isHeadingInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.2, ease: [0.165, 0.84, 0.44, 1] }}
            >
              About
            </motion.h1>
            
            <motion.div 
              className="w-full h-px bg-white/10 mb-12"
              initial={{ scaleX: 0 }}
              animate={isHeadingInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
              style={{ transformOrigin: "left" }}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-4xl"
            >
              {bioParagraphs.map((paragraph, index) => (
                  <ParallaxElement direction="up" speed={1.9}>
                <motion.p 
                  key={index}
                  className="text-xl md:text-2xl text-white/70 font-light mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 + (index * 0.2) }}
                >
                  {paragraph}
                </motion.p>
                </ParallaxElement>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Two-column layout for skills and image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-10">
          {/* Skills column */}
          <div className="space-y-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="mb-20"
            >
              <motion.p 
                className="uppercase tracking-[0.3em] text-xs text-white/50 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Expertise
              </motion.p>
              
              <div className="space-y-20">
                {Object.entries(skillsByCategory).map(([category, skills], categoryIndex) => (
                  <motion.div
                    key={category}
                    ref={categoryRefs[categoryIndex]}
                    initial={{ opacity: 0, y: 40 }}
                    animate={categoriesInView[categoryIndex] ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                    className="relative"
                  >
                    <motion.div 
                      className="w-12 h-px bg-white/30 absolute -left-16 top-3"
                      initial={{ scaleX: 0 }}
                      animate={categoriesInView[categoryIndex] ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      style={{ transformOrigin: "right" }}
                    />
                    
                    <h3 className="text-2xl font-light mb-6">{category}</h3>
                    
                    <div className="space-y-4">
                      {skills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={categoriesInView[categoryIndex] ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.6, delay: 0.3 + (skillIndex * 0.1) }}
                          className="flex justify-between items-center py-2 border-b border-white/10"
                        >
                          <span className="text-white/80">{skill.name}</span>
                          <span className="text-white/40 text-sm">{skill.level}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Image column with abstract elements */}
       
          <motion.div 
            ref={imageContainerRef}
            className="relative h-[60vh] lg:h-auto"
            initial={{ opacity: 0 }}
            animate={isImageInView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
          >
            <div className="sticky top-[20vh]">
              {/* Abstract image placeholder with decorative elements */}
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-[#162447]/80 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={isImageInView ? { opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 0.3 }}
                />
                
                {/* Image placeholder (replace with your actual image) */}
                <div className="absolute inset-0 opacity-70 mix-blend-luminosity">
               
                  <Image
                    src="/profilepic2.jpg"
                    alt="Designer portrait"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  
                </div>
                
                {/* Decorative elements */}
                <motion.div 
                  className="absolute top-10 left-10 w-1/3 h-1/3 border border-white"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isImageInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
                
                <motion.div 
                  className="absolute bottom-10 right-10 w-1/4 h-1/4 border border-white rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isImageInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                />
                
                {/* Experience label */}
                <motion.div
                  className="absolute bottom-8 left-8 z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isImageInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                   <ParallaxElement direction="up" speed={0.9}>
                  <p className="text-xs uppercase tracking-[0.2em] text-white mb-2">Years Experience</p>
                  <p className="text-6xl font-light text-white mix-blend-difference">8+</p>
                  </ParallaxElement>
                </motion.div>
              </div>
            </div>
          </motion.div>
        
        </div>
      </div>
    </motion.section>
  )
}

export default AboutSection
