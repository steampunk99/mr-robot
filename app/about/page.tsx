"use client"

import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-8 font-display">About Me</h1>
        <div className="space-y-6 font-sans">
          <p>
            I'm a software engineer based in Kampala, Uganda.
          </p>
          <p>
          I've come to find inspiration in the simplicity of lines, the balance of empty space, and the profound impact of what is left unsaid. This appreciation for the subtle interplay of space and form is what fuels my work.
          </p>
          <p>
          By embracing the principles of negative space, asymmetrical balance, and deliberate simplicity, I aim to craft interfaces that invite reflection and inspire wonder—proving that even in the realm of web development, art can flourish.
          </p>
          <p>
          For me, every new project is more than a task—it’s an invitation to explore uncharted horizons and push the creative boundaries further. Each assignment presents a unique opportunity to experiment with innovative techniques, transforming complex ideas into intuitive digital experiences. The act of creation becomes an exhilarating adventure, where every line of code and every design decision is a step toward capturing a refined blend of beauty and functionality.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

