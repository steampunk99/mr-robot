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
            I'm Lukwiya Bonnie, a 3D Web Developer based in Kampala, Uganda. With a passion for blending art and
            technology, I create immersive digital experiences that push the boundaries of what's possible on the web.
          </p>
          <p>
            My expertise lies in using cutting-edge technologies like Three.js, WebGL, and React to build interactive 3D
            web applications and visualizations. I strive to create seamless, performant experiences that captivate
            users and bring ideas to life in the digital realm.
          </p>
          <p>
            With a background in both design and development, I bring a unique perspective to every project. I'm
            constantly exploring new techniques and technologies to stay at the forefront of web development and 3D
            graphics.
          </p>
          <p>
            When I'm not coding, you can find me experimenting with generative art, contributing to open-source
            projects, or mentoring aspiring developers in my community.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

