"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { fadeInUp } from "@/animations/fade-in-up"
import ParagraphReveal, { ContentFade,ParallaxText,parallaxText } from "@/components/paragraph-reveal"
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
    <section className="min-h-screen bg-black text-white flex flex-col justify-center relative py-20">
      {/* Vertical separator line - Japanese design element */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-neutral-800/30" />
      
      {/* Horizontal separator line */}
      <div className="absolute top-1/3 left-0 w-full h-px bg-neutral-800/30" />
      
      <div className="max-w-7xl  mx-auto w-full px-4 md:px-8 relative z-10 my-[150px]">
        {/* Section marker - inspired by Japanese minimalism */}
        <div className="mb-12">
          <div className="w-12 h-px bg-neutral-500/50 mb-6"></div>
          <ParallaxText baseVelocity={-1} className=" font-light tracking-wider p-4">Background</ParallaxText>
        </div>
        
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
        
        {/* Skills section - Japanese-inspired minimalist cards, now categorized */}
        <div className="my-24 ">
          <ParallaxText
            baseVelocity={1}
            className="text-xs font-light p-12 mb-12 ml-8"
          >
            Skillset
          </ParallaxText>
          
          
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
                         <ContentFade direction="up" className="mb-4"> <span className="text-base text-neutral-300 font-light">{skill.name}</span></ContentFade>
                         <ContentFade direction="up" className="mb-4"><span className="text-sm text-neutral-500 font-extralight">{skill.level}</span></ContentFade>
                     
                      
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
