"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Send } from "lucide-react"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically handle the form submission,
    // such as sending the data to an API
    console.log("Form submitted:", formState)
    // Reset form after submission
    setFormState({ name: "", email: "", message: "" })
  }

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-8 font-display">Get in Touch</h1>
        <p className="mb-8 font-sans">I'm always open to new projects and collaborations. Feel free to reach out!</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 font-sans">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
              className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded font-sans"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 font-sans">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
              className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded font-sans"
            />
          </div>
          <div>
            <label htmlFor="message" className="block mb-2 font-sans">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded font-sans"
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-white text-black rounded-full font-sans flex items-center hover:bg-neutral-200 transition-colors"
          >
            Send Message
            <Send className="ml-2 w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  )
}

