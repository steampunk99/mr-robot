"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, useMotionTemplate, useTransform, useScroll } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, Copy, Check } from "lucide-react"

export function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  
  const isHeadingInView = useInView(headingRef, { once: false, amount: 0.2 })
  const isFormInView = useInView(formRef, { once: false, amount: 0.2 })
  
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  
  const [copied, setCopied] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  
  // For parallax scrolling effect on heading
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.6])
  
  // Track mouse position for button hover effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    
    // For demo: reset form
    setFormState({
      name: "",
      email: "",
      message: "",
    })
    
    // Show success message
    alert("Message sent successfully! (Demo)")
  }
  
  const copyEmail = () => {
    navigator.clipboard.writeText("loulater99@gmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="min-h-screen bg-[#0D0D0D] overflow-hidden pt-[15vh] pb-[10vh]"
    >
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:120px_120px] opacity-40 pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative">
        {/* Massive heading with parallax effect */}
        <motion.div
          ref={headingRef}
          style={{ y, opacity }}
          className="mb-24 md:mb-40"
        >
          <motion.h1
            className="text-[clamp(3rem,15vw,15rem)] font-thin leading-[0.85] tracking-tighter mb-10"
            initial={{ y: 100, opacity: 0 }}
            animate={isHeadingInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: [0.165, 0.84, 0.44, 1] }}
          >
            Contact
          </motion.h1>
          
          <motion.div 
            className="w-full h-px bg-white/10 mb-12"
            initial={{ scaleX: 0 }}
            animate={isHeadingInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
            style={{ transformOrigin: "left" }}
          />
          
          <motion.p
            className="text-xl md:text-3xl text-white/70 font-extralight max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            I'm currently available for new projects and collaborations. Let's create something exceptional together.
          </motion.p>
        </motion.div>
        
        {/* Two-column layout for contact information and form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-10">
          {/* Contact information column */}
          <div>
            <motion.div
              className="space-y-16"
              initial={{ opacity: 0, y: 40 }}
              animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {/* Email with copy button */}
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-3">Email</p>
                <div className="flex items-center">
                  <p className="text-2xl font-light mr-3">loulater99@gmail.com</p>
                  <motion.button
                    onClick={copyEmail}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-white/50 hover:text-white"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </motion.button>
                </div>
              </div>
              
              {/* Location */}
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-3">Location</p>
                <p className="text-2xl font-light">Kampala, UG</p>
              </div>
              
              {/* Social links */}
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-6">Connect</p>
                <div className="space-y-5">
                  {[
                 
                    
                    { name: "GitHub", url: "https://github.com/steampunk99" },
                    { name: "Instagram", url: "https://github.com/iamvengeance099/" }
                  ].map((social) => (
                    <div key={social.name}>
                      <Link
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center hover:text-white text-white/80 transition-colors duration-300"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                      >
                        <span className="inline-block w-6 h-px bg-white/30 mr-4 group-hover:w-10 transition-all duration-300" />
                        <span className="text-lg">{social.name}</span>
                        <ArrowUpRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={16} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Contact form column */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 40 }}
            animate={isFormInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm uppercase tracking-[0.2em] text-white/50 mb-4">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-xl focus:border-white focus:outline-none transition-colors duration-300 font-light"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm uppercase tracking-[0.2em] text-white/50 mb-4">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-xl focus:border-white focus:outline-none transition-colors duration-300 font-light"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm uppercase tracking-[0.2em] text-white/50 mb-4">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-xl focus:border-white focus:outline-none transition-colors duration-300 font-light resize-none"
                    required
                  />
                </div>
              </div>
              
              <div>
                <motion.button
                  type="submit"
                  className="group relative overflow-hidden border border-white/30 px-8 py-4 mt-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Button background hover effect */}
                  <motion.div 
                    className="absolute inset-0 bg-white"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1, backgroundColor:"#fff" }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  <span className="relative z-10 text-white group-hover:text-gray-200 transition-colors duration-300 flex items-center">
                    <span className="tracking-wider">Send Message</span>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
        
        {/* Footer section */}
        <motion.div
          className="mt-40 pt-12 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col md:flex-row justify-between">
            <p className="text-white/40 text-sm mb-6 md:mb-0">© {new Date().getFullYear()} All rights reserved.</p>
            
            <div className="flex space-x-6">
              <p className="text-white/40 text-sm hover:text-white transition-colors duration-300 cursor-pointer">Privacy Policy</p>
              <p className="text-white/40 text-sm hover:text-white transition-colors duration-300 cursor-pointer">Terms of Service</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

