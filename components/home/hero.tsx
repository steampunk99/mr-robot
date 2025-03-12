"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionTemplate, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowDown } from 'lucide-react';

// Custom hook for mouse position with smoothing
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const smoothX = useSpring(0, { stiffness: 200, damping: 20 });
  const smoothY = useSpring(0, { stiffness: 200, damping: 20 });
  
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // Calculate mouse position relative to window size (0 to 1)
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      setMousePosition({ x, y });
      smoothX.set(x);
      smoothY.set(y);
    };
    
    window.addEventListener("mousemove", updateMousePosition);
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [smoothX, smoothY]);
  
  return { raw: mousePosition, smooth: { x: smoothX, y: smoothY } };
};

// Types for the components
interface AnimatedCharacterProps {
  character: string;
  index: number;
  isActive: boolean;
  onMouseEnter: () => void;
}

interface DynamicGradientProps {
  mousePosition: ReturnType<typeof useMousePosition>;
}

// Interactive character component for hero text
const AnimatedCharacter = ({ character, index, isActive, onMouseEnter }: AnimatedCharacterProps) => {
  return (
    <motion.span
      className="inline-block relative cursor-default font-thin hover:font-normal text-[clamp(6rem,18vw,25rem)] leading-[0.8] transition-[font-weight,letter-spacing] duration-300"
      initial={{ y: 100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        color: isActive ? "#ffffff" : "rgba(255,255,255,0.4)",
        textShadow: isActive ? "0 0 30px rgba(255,255,255,0.3)" : "none",
      }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.05,
        ease: [0.215, 0.61, 0.355, 1],
        color: { duration: 0.3 },
        textShadow: { duration: 0.3 }
      }}
      onMouseEnter={onMouseEnter}
      style={{ 
        transformOrigin: "bottom left",
      }}
    >
      {character === " " ? "\u00A0" : character}
    </motion.span>
  );
};



// Main hero component
export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();
  const [activeCharIndex, setActiveCharIndex] = useState(-1);
  const heroText = "Lou";
  
  // Split text into characters for animation
  const characters = heroText.split("");
  
  // Scroll-driven animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 600]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  
  return (
    <motion.section 
      ref={containerRef}
      className="relative min-h-[100vh] w-full overflow-hidden bg-black flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
    >
   
      
      {/* Minimal grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff11_1px,transparent_1px),linear-gradient(to_bottom,#ffffff11_1px,transparent_1px)] bg-[size:420px_300px]" />
      
  
      
      {/* Minimalist rotating circles */}
      <motion.div 
        className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[30vw] h-[30vw] opacity-15"
        style={{ 
          rotateX: useTransform(mousePosition.smooth.y, [0, 1], [-5, 5]),
          rotateY: useTransform(mousePosition.smooth.x, [0, 1], [5, -5]),
          transformPerspective: "1000px" 
        }}
      >
        <div className="absolute inset-0 border border-white/40 rounded-full" />
        <div className="absolute inset-[10%] border border-white/50 rounded-full" />
        <div className="absolute inset-[20%] border border-blue-700 rounded-full" />
        <div className="absolute inset-[30%] border border-green-700 rounded-full" />
        <div className="absolute inset-[40%] border border-yellow-700 rounded-full" />
        <motion.div 
          className="absolute inset-[45%] bg-white/30 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      
      {/* Main content */}
      <div className="relative z-10 w-full">
        <motion.div 
          className="container mx-auto px-6 md:px-12"
          style={{ y, opacity, scale }}
        >
          {/* Thin line and subtle tag */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "4rem", opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-px bg-white/50 mb-8"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="ml-1 mb-6 text-sm tracking-[0.3em] uppercase text-white/60"
          >
             Designer & Software Engineer
          </motion.div>
          
          {/* Main headline */}
          <div className="overflow-hidden mb-12 ml-1">
            <div className="flex flex-wrap">
              {characters.map((char, index) => (
                <AnimatedCharacter 
                  key={index}
                  character={char} 
                  index={index} 
                  isActive={index === activeCharIndex}
                  onMouseEnter={() => setActiveCharIndex(index)}
                />
              ))}
            </div>
          </div>
          
          {/* Subtitle with animated reveal */}
          <motion.div
            className="max-w-md ml-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.p 
              className="text-white/60 text-xl md:text-2xl font-extralight leading-relaxed mb-12"
            >
              I create digital experiences with a focus on functionality around visual aesthetics and thoughtful interactions.
            </motion.p>
            
            {/* CTA buttons with hover effect */}
            <motion.div 
              className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-10 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <Link
                href="/work"
                className="group flex items-center text-white/80 hover:text-white transition-colors duration-300"
              >
                <div className="mr-4 h-px w-8 bg-white/50 group-hover:w-12 transition-all duration-300" />
                <span className="text-sm tracking-widest uppercase">
                  View Work
                </span>
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
              
              <Link
                href="/about"
                className="group flex items-center text-white/80 hover:text-white transition-colors duration-300"
              >
                <div className="mr-4 h-px w-8 bg-white/50 group-hover:w-12 transition-all duration-300" />
                <span className="text-sm tracking-widest uppercase">
                  About Me
                </span>
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-xs tracking-[0.2em] text-white/60 mb-2">SCROLL</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4 text-white/60" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
