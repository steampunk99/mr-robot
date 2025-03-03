"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { fadeInUp } from "@/animations/fade-in-up"
import ParagraphReveal, { ContentFade } from "@/components/paragraph-reveal"
import SteampunkRobot from "@/components/steampunk-robot"

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
  ],
  "Backend": [
    { name: "Express", level: "Advanced" },
  ],
  "AI & Integration": [
    { name: "ML Integration", level: "Intermediate" },
    { name: "Chatbot Integration", level: "Advanced" },
    { name: "Agent Integration", level: "Intermediate" },
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
    <section className="min-h-screen bg-black text-white flex flex-col justify-center relative py-20">
      {/* Vertical separator line - Japanese design element */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-neutral-800/30" />
      
      {/* Horizontal separator line */}
      <div className="absolute top-1/3 left-0 w-full h-px bg-neutral-800/30" />
      
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 relative z-10">
        {/* Section marker - inspired by Japanese minimalism */}
        <div className="mb-12">
          <div className="w-12 h-px bg-neutral-500/50 mb-6"></div>
          <h2 className="text-2xl font-light tracking-wider">About</h2>
        </div>
        
        {/* Bio section with focus on typography and whitespace - now with ParagraphReveal */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-24">
          <div className="md:col-span-7">
            <ParagraphReveal 
              className="text-lg md:text-xl leading-relaxed font-light text-neutral-300 mb-8"
              staggerAmount={0.4}
            >
              I'm a full-stack web developer specializing in creating immersive 3D experiences for the web. With a focus on TypeScript and React, I build digital experiences that are both visually engaging and functionally robust.
            </ParagraphReveal>
            
            <ParagraphReveal 
              className="text-lg md:text-xl leading-relaxed font-light text-neutral-300 mb-8" 
              delay={0.2}
              staggerAmount={0.4}
            >
              My work is heavily influenced by Japanese minimalist design principles — embracing negative space, asymmetrical balance, and the concept of "Ma" (間) — the powerful interval between elements that creates rhythm and emphasis.
            </ParagraphReveal>
            
            <ParagraphReveal 
              className="text-lg md:text-xl leading-relaxed font-light text-neutral-300" 
              delay={0.4}
              staggerAmount={0.4}
            >
              I've recently expanded my skillset to include ML model integration, building and fine-tuning AI models, and implementing chatbot and agent systems into web applications while maintaining performance and clean design.
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
        
        {/* Skills section - Japanese-inspired minimalist cards, now categorized */}
        <div className="mt-24">
          <motion.h3 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xl font-light tracking-wider mb-12"
          >
            Skills & Expertise
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Render each category */}
            {Object.entries(skillsByCategory).map(([category, skills], categoryIndex) => (
              <div 
                key={category} 
                ref={categoryRefs[categoryIndex]}
                className="border-t border-neutral-800 pt-6"
              >
                <ContentFade direction="up" className="mb-4">
                  <h4 className="text-lg font-light tracking-wider text-neutral-400">{category}</h4>
                </ContentFade>
                
                <ul className="space-y-6">
                  {skills.map((skill, skillIndex) => (
                    <motion.li
                      key={skill.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={categoriesInView[categoryIndex] ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: skillIndex * 0.1 + 0.3,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      className="flex justify-between items-baseline"
                    >
                      <span className="text-base text-neutral-300 font-light">{skill.name}</span>
                      <span className="text-sm text-neutral-500 font-extralight">{skill.level}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
