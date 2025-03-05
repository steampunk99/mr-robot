"use client"

import type React from "react"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1])
  const scale = useTransform(scrollYProgress, [0, 0.2, 1], [0.8, 1, 1])

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
      <motion.div className="max-w-7xl mx-auto px-6 md:px-12" style={{ opacity, scale }}>
        <motion.h2
          className="text-7xl md:text-7xl font-black tracking-tighter mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0.3 }}
          transition={{type:"spring", duration: 1.8 }}
          viewport={{ once: true, margin: "-200px" }}
        >
          Get in touch
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <motion.p
              className="text-xl leading-relaxed mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              Have a project in mind? I'd love to hear about it. Send a message and I'll get back to you as soon as
              possible.
            </motion.p>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">Email</p>
                <p className="text-xl">loulater99@proton.me</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">Phone</p>
                <p className="text-xl">+256 782 443 845</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">Location</p>
                <p className="text-xl">Kampala, Uganda</p>
              </motion.div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <label htmlFor="name" className="block text-sm uppercase tracking-widest text-gray-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-800 py-4 focus:border-white outline-none transition-colors duration-300"
                  required
                />
              </motion.div>

              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <label htmlFor="email" className="block text-sm uppercase tracking-widest text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-800 py-4 focus:border-white outline-none transition-colors duration-300"
                  required
                />
              </motion.div>

              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <label htmlFor="message" className="block text-sm uppercase tracking-widest text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-transparent border-b border-gray-800 py-4 focus:border-white outline-none transition-colors duration-300"
                  required
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300"
              >
                <span className="mr-2">Message</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </motion.div>
       
            </form>
          </div>
        </div>

        <motion.footer
          className="mt-40 pt-12 border-t border-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} Bonnie. L All rights reserved.
            </p>

            <div className="flex space-x-6">
          
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-300 cursor-hover"
              >
                Github
              </a>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-300 cursor-hover"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </motion.footer>
      </motion.div>
    </section>
  )
}

