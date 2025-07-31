"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'


export default function AboutPage() {
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const contactRef = useRef(null)
  
  // Parallax values
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const aboutY = useTransform(scrollYProgress, [0.2, 0.5], [100, 0])
  const aboutOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.5], [0, 1, 1])

  return (
    <div ref={containerRef} className="bg-black relative text-white min-h-screen">
      {/* Background elements */}
      <div className="absolute inset-0">
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_0,transparent_100%)]"></div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        </div>
      
      {/* Hero section */}
      <motion.section
        ref={heroRef}
        className="min-h-screen flex flex-col justify-center  overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
       
        
        <div className="container mx-auto px-4 pt-20 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-8 mb-16 md:mb-0">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="text-xs font-light tracking-widest text-white/60 mb-6"
                >
                  SOFTWARE ENGINEER / DESIGNER
                </motion.div>
                
                <div className="overflow-hidden">
                  <motion.h1
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tighter mb-6"
                  >
                    <span className="block">Myself</span>
                
                  
                  </motion.h1>
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.4 }}
                  className="w-16 h-px bg-white/20 mb-6"
                />
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                  className="text-white/60 text-lg max-w-md mb-8"
                >
                My name is Godwin Lex Sserwada.

                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                  className="text-white/60 text-lg max-w-md mb-8"
                >
           
           I'm a software engineer & designer based in Kampala, Uganda.

                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                  className="text-white/60 text-lg max-w-md mb-8"
                >
           

I've come to find inspiration in the simplicity of lines, the balance of empty space, and the profound impact of what is left unsaid. This appreciation for the subtle interplay of space and form is what fuels my work.


                </motion.p>
              
                
              
              </div>
              
              <div className="col-span-12 md:col-span-4 flex items-end justify-end">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2 }}
                  className="relative"
                >
                  {/* Abstract geometric elements */}
                  <div className="w-40 h-40 md:w-60 md:h-60 border border-white/10 relative">
                    <div className="absolute top-4 left-4 w-full h-full bg-white/5"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1/2 h-1/2 border border-white/20"></div>
                    </div>
                    
                    {/* Animated dot */}
                    <motion.div 
                      className="absolute w-2 h-2 bg-white rounded-full"
                      animate={{ 
                        x: [0, 100, 100, 0, 0],
                        y: [0, 0, 100, 100, 0]
                      }}
                      transition={{ 
                        duration: 10, 
                        ease: "linear", 
                        repeat: Infinity,
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/30 text-xs tracking-widest"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <span className="mb-2">SCROLL</span>
            <div className="w-px h-10 bg-white/10"></div>
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* About section */}
      <motion.section
        ref={aboutRef}
        className="min-h-screen py-24 md:py-32 relative"
        style={{ y: aboutY, opacity: aboutOpacity }}
      >
        {/* Background elements */}
        <div className="absolute inset-0">
          {/* Radial gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#ffffff05_0,transparent_50%)]"></div>
          
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <div className="text-xs font-light tracking-widest text-white/60 mb-2">DESIGN &</div>
              <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">DEVELOPMENT</h2>
            </motion.div>
            
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="aspect-[4/5] relative mb-8 md:mb-0"
                >
                  {/* Abstract portrait representation */}
                  <div className="absolute inset-0 border border-white/10"></div>
                  
                  {/* Animated elements */}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <motion.div 
                      className="w-2/3 h-2/3 bg-white/5 relative"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 120, ease: "linear", repeat: Infinity }}
                    >
                      {/* Abstract lines */}
                      <motion.div 
                        className="absolute top-0 left-0 w-full h-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 120, ease: "linear", repeat: Infinity }}
                      >
                        <div className="absolute top-1/3 left-0 w-full h-px bg-white/20"></div>
                        <div className="absolute top-2/3 left-0 w-full h-px bg-white/20"></div>
                        <div className="absolute top-0 left-1/3 w-px h-full bg-white/20"></div>
                        <div className="absolute top-0 left-2/3 w-px h-full bg-white/20"></div>
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  {/* Floating particles */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white/30 rounded-full"
                      initial={{ 
                        x: Math.random() * 100 + "%", 
                        y: Math.random() * 100 + "%",
                        opacity: 0.3 + Math.random() * 0.7
                      }}
                      animate={{ 
                        x: [
                          Math.random() * 100 + "%", 
                          Math.random() * 100 + "%",
                          Math.random() * 100 + "%"
                        ],
                        y: [
                          Math.random() * 100 + "%", 
                          Math.random() * 100 + "%",
                          Math.random() * 100 + "%"
                        ],
                      }}
                      transition={{ 
                        duration: 15 + Math.random() * 15, 
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  ))}
                </motion.div>
              </div>
              
              <div className="col-span-12 md:col-span-7">
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <h3 className="text-xl font-light tracking-wide mb-4">Philosophy</h3>
                    <p className="text-white/60 leading-relaxed">
                
With a focus on motion and interaction, I create interfaces that feel alive and responsive, elevating the user experience beyond the static page.

My approach combines technical precision with creative intuition, resulting in work that is both visually compelling and technically sound.


                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <h3 className="text-xl font-light tracking-wide mb-4">Expertise</h3>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      {[
                        { label: "FRONTEND", value: "Frontend Architecture" },
                        { label: "DESIGN SYSTEMS", value: "Design Systems" },
                        { label: "MOTION", value: "Motion Design" },
                        { label: "INTERACTION", value: "Interaction Design" },
                        { label: "ACCESSIBILITY", value: "Accessibility" },
                        { label: "PERFORMANCE", value: "Performance Optimization" }
                      ].map((skill, index) => (
                        <motion.div
                          key={index}
                          custom={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                          className="border-b border-white/10 pb-2"
                        >
                          <div className="text-xs text-white/40 mb-1">{skill.label}</div>
                          <div className="text-sm">{skill.value}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="pt-4"
                  >
                    <Button
                      variant="outline"
                      className="rounded-none border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 group"
                    >
                      <span>View Resume</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      
    
   
    </div>
  )
}
