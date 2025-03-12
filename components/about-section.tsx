"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import ParagraphReveal, { ContentFade, ParallaxText } from "@/components/paragraph-reveal"
import SteampunkRobot from "@/components/steampunk-robot"
import { ParallaxElement, ParallaxLayer, ParallaxSection, ParallaxScale } from "@/components/parallax"

// Organize skills into categories
const skillsByCategory = {
  "Frontend": [
    { name: "React", level: "Advanced" },
    { name: "Next.js", level: "Advanced" },
    { name: "Framer Motion", level: "Advanced" },
  ],
  "Languages": [
    { name: "TypeScript", level: "Advanced" },
    { name: "Python", level: "Advanced" },
    { name: "Html, css", level: "Advanced" },
  ],
  "Backend": [
    { name: "Express.js", level: "Advanced" },
    { name: "FastAPI", level: "Advanced" },
    { name: "Prisma ORM", level: "Advanced DB" },
  ],
  "Machine Learning": [
    { name: "Model Fine-tuning", level: "Intermediate" },
    { name: "Chatbot Integration", level: "Advanced" },
    { name: "Agent Orchestration", level: "Advanced" },
  ]
}

// Flatten skills for reference
const allSkills = Object.values(skillsByCategory).flat()

const AboutSection = () => {
  // Create individual refs for each category
  const categoryRefs = Object.keys(skillsByCategory).map(() => useRef(null))
  // Track each category separately for better control
  const categoriesInView = categoryRefs.map(ref => useInView(ref, { once: true, amount: 0.2 }))

  return (
    <ParallaxSection className="min-h-screen bg-black text-white flex flex-col justify-center relative py-20">
      {/* Vertical separator line - Japanese design element */}
      <ParallaxLayer depth={0.1} className="absolute top-0 left-1/4 w-px h-full bg-neutral-800/30">
        <div className="w-full h-full" />
      </ParallaxLayer>
      
      {/* Horizontal separator line */}
      <ParallaxLayer depth={0.15} className="absolute top-1/3 left-0 w-full h-px bg-neutral-800/30">
        <div className="w-full h-full" />
      </ParallaxLayer>
      
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 relative z-10 my-[150px]">
        {/* Section title with parallax effect */}
        <div className="mb-16">
          <ParallaxElement direction="up" speed={0.5} className="mb-8">
            <ParallaxText baseVelocity={-1} className="font-light tracking-wider p-4">Background</ParallaxText>
          </ParallaxElement>
          
          <ParallaxElement direction="left" speed={0.3} className="mb-2 text-sm uppercase tracking-widest text-neutral-500">About Me</ParallaxElement>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ParallaxElement direction="up" speed={0.6}>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8">I craft digital experiences that blend aesthetics with functionality</h2>
            </ParallaxElement>
            
            <ParallaxElement direction="up" speed={0.4} delay={0.1}>
              <ContentFade>
                <ParagraphReveal className="text-neutral-400">
                  As a creative developer, I thrive at the intersection of design and technology. With a background in both visual design and software engineering, I bring a holistic approach to digital product development.
                  
                  My work is characterized by meticulous attention to detail, innovative problem-solving, and a commitment to creating intuitive, engaging user experiences.
                  
                  I specialize in building interactive web applications that not only meet functional requirements but also delight users with subtle animations and thoughtful interactions.
                </ParagraphReveal>
              </ContentFade>
            </ParallaxElement>
          </div>
        </div>
        
        {/* Skills section */}
        <ParallaxScale className="relative mb-32">
          <div className="mt-20 mb-6">
            <ParallaxElement direction="up" speed={0.3} className="uppercase tracking-widest text-neutral-500 text-sm mb-6">Expertise</ParallaxElement>
            <h3 className="text-3xl font-light mb-12">Technical Capabilities</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {Object.entries(skillsByCategory).map(([category, skills], index) => (
              <ParallaxElement 
                key={category} 
                direction={index % 2 === 0 ? "left" : "right"} 
                speed={0.4} 
                delay={index * 0.1}
              >
                <motion.div 
                  ref={categoryRefs[index]}
                  className="mb-10"
                  initial={{ opacity: 0, y: 40 }}
                  animate={categoriesInView[index] ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                >
                  <h4 className="text-xl font-medium mb-4 text-neutral-300">{category}</h4>
                  <div className="space-y-4">
                    {skills.map((skill, skillIndex) => (
                      <div key={skill.name} className="flex justify-between items-center">
                        <motion.div
                          className="text-neutral-400"
                          initial={{ opacity: 0, x: -10 }}
                          animate={categoriesInView[index] ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: (index * 0.1) + (skillIndex * 0.1) }}
                        >
                          {skill.name}
                        </motion.div>
                        <motion.div
                          className="text-xs text-neutral-500"
                          initial={{ opacity: 0, x: 10 }}
                          animate={categoriesInView[index] ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: (index * 0.1) + (skillIndex * 0.1) }}
                        >
                          {skill.level}
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </ParallaxElement>
            ))}
          </div>
        </ParallaxScale>
        
        {/* Bio section with focus on typography and whitespace - now with ParagraphReveal */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-24">
          <div className="md:col-span-7">
            <ParagraphReveal 
              className="text-lg md:text-xl leading-relaxed font-light text-neutral-300 mb-8"
              staggerAmount={0.4}
            >
             I have always been captivated by the quiet elegance of abstract forms and the understated Art in minimalism. This love for the subtle interplay of space and form has guided and now fuels my work as a web developer.
            </ParagraphReveal>
            
          
            
            <ParagraphReveal 
              className="text-lg md:text-xl leading-relaxed font-light text-neutral-300" 
              delay={0.4}
              staggerAmount={0.4}
            >
            Every new project is an invitation to explore new horizons, to push creative boundaries further—an endeavor that makes the act of creation an exhilarating experience. 
            </ParagraphReveal>
          </div>
          
          {/* Large decorative element - asymmetrically placed */}
          <div className="md:col-span-5 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-md">
              {/* Small steampunk robot icon in the background */}
              <motion.div
                className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 opacity-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.2 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <SteampunkRobot width={100} height={100} section="about" />
              </motion.div>
              
              {/* Square outline - inspired by Japanese design */}
              <motion.div 
                className="absolute top-0 left-0 w-3/4 h-3/4 border border-neutral-800"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              />
              
              {/* Offset square outline */}
              <motion.div 
                className="absolute bottom-0 right-0 w-3/4 h-3/4 border border-neutral-800"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
              />
              
              {/* Centered circle */}
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full border border-neutral-700"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                viewport={{ once: true }}
              />
              
              {/* Small dot */}
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                viewport={{ once: true }}
              />
            </div>
          </div>
        </div>
      </div>
    </ParallaxSection>
  )
}

export default AboutSection
