"use client"

import type React from "react"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { ParallaxElement, ParallaxLayer, ParallaxSection, ParallaxScale } from "@/components/parallax"
import useParallax from "@/hooks/use-parallax"

export function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  // Use our custom parallax hook for the form
  const { ref: formParallaxRef, style: formStyle } = useParallax({
    direction: "up",
    speed: 0.4,
    range: [0, 60]
  })

  // Use parallax hooks for different sections
  const { ref: titleRef, style: titleStyle } = useParallax({
    direction: "up",
    speed: 0.6,
    range: [0, 80]
  })

  const { ref: infoRef, style: infoStyle } = useParallax({
    direction: "right",
    speed: 0.3,
    range: [0, 40]
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formState)
    // Form submission logic would go here
  }

  return (
    <section id="contact" ref={containerRef} className="min-h-screen py-32 relative">
      {/* Background grid with parallax effect */}
      <ParallaxLayer depth={0.05} className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]">
        <div className="w-full h-full" />
      </ParallaxLayer>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading with parallax effect */}
        <motion.div
          ref={titleRef}
          style={titleStyle}
          className="mb-24"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <ParallaxElement direction="up" speed={0.3} className="mb-4">
            <div className="text-sm uppercase tracking-widest text-neutral-500 mb-8">Contact</div>
          </ParallaxElement>
          
          <h2 className="text-5xl md:text-7xl font-light tracking-tighter">
            Get in touch
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Contact form with parallax effect */}
          <motion.form
            ref={formRef}
            style={formStyle}
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ParallaxElement direction="up" speed={0.2} delay={0.1}>
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm text-neutral-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-none p-3 text-white focus:outline-none focus:ring-1 focus:ring-white"
                  required
                />
              </div>
            </ParallaxElement>

            <ParallaxElement direction="up" speed={0.3} delay={0.2}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm text-neutral-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-none p-3 text-white focus:outline-none focus:ring-1 focus:ring-white"
                  required
                />
              </div>
            </ParallaxElement>

            <ParallaxElement direction="up" speed={0.4} delay={0.3}>
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm text-neutral-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-none p-3 text-white focus:outline-none focus:ring-1 focus:ring-white"
                  required
                />
              </div>
            </ParallaxElement>

            <ParallaxElement direction="up" speed={0.5} delay={0.4}>
              <button
                type="submit"
                className="px-8 py-3 bg-white text-black hover:bg-neutral-900 hover:text-white transition-colors duration-300 uppercase text-sm tracking-wider border border-white flex items-center"
              >
                Send Message
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </button>
            </ParallaxElement>
          </motion.form>

          {/* Contact info with parallax effect */}
          <motion.div
            ref={infoRef}
            style={infoStyle}
            className="space-y-10"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ParallaxElement direction="left" speed={0.3} delay={0.2}>
              <h3 className="text-2xl font-light mb-6">Let's build something together</h3>
              <p className="text-neutral-400 leading-relaxed">
                Have a project in mind or looking for a collaborative opportunity? I'm always open to discussing new ideas or helping you bring your vision to life.
              </p>
            </ParallaxElement>

            <ParallaxElement direction="left" speed={0.4} delay={0.3}>
              <div className="space-y-4">
                <h4 className="text-sm uppercase tracking-wider text-neutral-500">Contact Information</h4>
                <div className="space-y-2">
                  <p className="text-neutral-300">Email: hello@yourdomain.com</p>
                  <p className="text-neutral-300">Location: New York, USA</p>
                </div>
              </div>
            </ParallaxElement>

            <ParallaxElement direction="left" speed={0.5} delay={0.4}>
              <div className="space-y-4">
                <h4 className="text-sm uppercase tracking-wider text-neutral-500">Social</h4>
                <div className="flex flex-col space-y-3">
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-300 hover:text-white transition-colors flex items-center"
                  >
                    Twitter <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                  <Link
                    href="https://dribbble.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-300 hover:text-white transition-colors flex items-center"
                  >
                    Dribbble <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                  <Link
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-300 hover:text-white transition-colors flex items-center"
                  >
                    LinkedIn <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                  <Link
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-300 hover:text-white transition-colors flex items-center"
                  >
                    GitHub <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </ParallaxElement>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

