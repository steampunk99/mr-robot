"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Code, Layers, Palette } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-200, 200])

  const skills = [
    {
      icon: <Code className="h-6 w-6 text-purple-400" />,
      title: "Frontend Development",
      description: "Expert in React, Three.js, WebGL, and modern JavaScript frameworks",
    },
    {
      icon: <Layers className="h-6 w-6 text-blue-400" />,
      title: "3D Modeling & Animation",
      description: "Creating immersive 3D experiences and animations for the web",
    },
    {
      icon: <Palette className="h-6 w-6 text-pink-400" />,
      title: "Creative Coding",
      description: "Blending art and technology to create unique interactive experiences",
    },
  ]

  return (
    <section ref={ref} className="relative py-40 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full filter blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-600 rounded-full filter blur-[120px] opacity-20 animate-pulse" />
      </div>

      <motion.div style={{ y }} className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600"
            >
              About Me
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6 text-gray-300"
            >
              <p className="text-lg">
                I'm Lukwiya Bonnie, a 24-year-old 3D Web Developer based in Kampala, Uganda. I specialize in creating
                immersive web experiences using Three.js, WebGL, and modern frontend technologies.
              </p>
              <p className="text-lg">
                With a passion for blending art and technology, I build interactive 3D websites and applications that
                push the boundaries of what's possible on the web.
              </p>
            </motion.div>
          </div>

          <div className="space-y-8">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="backdrop-blur-md bg-white/5 border-white/10 overflow-hidden group">
                  <CardContent className="p-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-start gap-4"
                    >
                      <div className="mt-1 transition-transform duration-300 group-hover:scale-110">{skill.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                        <p className="text-gray-400">{skill.description}</p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

