"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowDown, Plus, Minus } from 'lucide-react';

// Custom hook for mouse position
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", updateMousePosition);
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);
  
  return mousePosition;
};



// 3D rotating cube component
const RotatingCube = () => {
  const cubeRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();
  
  // Add scroll-based animation
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);
  
  return (
    <div className="w-full h-full perspective-1000 relative">
      <motion.div 
        ref={cubeRef}
        className="w-full h-full relative transform-style-3d transition-transform duration-300"
        style={{ 
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
          scale,
          opacity
        }}
      >
        {/* Cube faces */}
        <div className="absolute inset-0 border border-white/10 transform translate-z-20" style={{ transform: "translateZ(20px)" }}></div>
        <div className="absolute inset-0 border border-white/10 transform -translate-z-20" style={{ transform: "translateZ(-20px)" }}></div>
        <div className="absolute inset-0 border border-white/10 rotate-y-90 translate-x-20" style={{ transform: "rotateY(90deg) translateX(20px)" }}></div>
        <div className="absolute inset-0 border border-white/10 rotate-y-90 -translate-x-20" style={{ transform: "rotateY(90deg) translateX(-20px)" }}></div>
        <div className="absolute inset-0 border border-white/10 rotate-x-90 translate-y-20" style={{ transform: "rotateX(90deg) translateY(20px)" }}></div>
        <div className="absolute inset-0 border border-white/10 rotate-x-90 -translate-y-20" style={{ transform: "rotateX(90deg) translateY(-20px)" }}></div>
      </motion.div>
    </div>
  );
};

// Magnetic button component
const MagneticButton = ({ children, className = "", ...props }: React.ComponentPropsWithoutRef<typeof motion.button> & { children: React.ReactNode }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  

  
  const strength = 20;
  
  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setPosition({ x: 0, y: 0 });
      }}
      onMouseMove={(e) => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          setPosition({ x, y });
        }
      }}
      animate={{
        x: isHovered ? position.x / strength : 0,
        y: isHovered ? position.y / strength : 0,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      {...props}
    >
      <motion.span
        className="relative z-10 block"
        animate={{
          x: isHovered ? position.x / (strength * 2) : 0,
          y: isHovered ? position.y / (strength * 2) : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

// Split text animation component
const SplitText = ({ text, className = "" }: { text: string, className?: string }) => {
  return (
    <span className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.8 + index * 0.03,
            ease: [0.215, 0.61, 0.355, 1]
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

// Main hero component
export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();
  
  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  


  

  
  // Loading animation
  // if (!isLoaded) {
  //   return (
  //     <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
  //       <motion.div
  //         initial={{ opacity: 0, scale: 0.9 }}
  //         animate={{ opacity: 1, scale: 1 }}
  //         transition={{ duration: 0.5 }}
  //         className="text-white text-2xl font-light tracking-widest"
  //       >
  //         <div className="w-12 h-12 relative">
  //           <motion.div 
  //             className="absolute inset-0 border border-white/20"
  //             animate={{ rotate: 90 }}
  //             transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
  //           />
  //           <motion.div 
  //             className="absolute inset-0 border border-white/40"
  //             initial={{ rotate: 45 }}
  //             animate={{ rotate: -45 }}
  //             transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
  //           />
  //         </div>
  //       </motion.div>
  //     </div>
  //   );
  // }
  
  return (
    <motion.div 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
    
      
   
      
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
        
        {/* Gradient overlay with parallax effect */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_0,transparent_70%)]"
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, -50]),
            scale: useTransform(scrollYProgress, [0, 1], [1, 1.1])
          }}
        ></motion.div>
        
        {/* Animated gradient with enhanced parallax */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, -100]),
            scale: useTransform(scrollYProgress, [0, 1], [1, 1.2])
          }}
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 20%, #ffffff10 0%, transparent 50%)",
              "radial-gradient(circle at 80% 80%, #ffffff10 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, #ffffff10 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, #ffffff10 0%, transparent 50%)",
              "radial-gradient(circle at 20% 20%, #ffffff10 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Grid lines with parallax effect */}
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:100px_100px]"
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, -30]),
            x: useTransform(scrollYProgress, [0, 1], [0, -10])
          }}
        ></motion.div>
      </div>
      
      {/* Main content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 h-screen flex flex-col justify-center"
        style={{ y, opacity }}
      >
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 lg:col-span-7 space-y-8">
            {/* Animated subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center space-x-4"
            >
              <div className="w-10 h-px bg-white/30"></div>
              <div className="text-xs uppercase tracking-[0.3em] text-white/60">Digital Craftsman</div>
            </motion.div>
            
            {/* Main headline with character animation */}
            <div className="overflow-hidden">
              <h1 className="text-5xl md:text-7xl xl:text-9xl font-extralight tracking-tighter leading-none">
                <SplitText text="Creating" className="block" />
                <SplitText text="Digital" className="block" />
                <SplitText text="Experiences" className="block" />
              </h1>
            </div>
            
            {/* Description with staggered animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="max-w-md"
            >
              <motion.p 
                className="text-white/60 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                Crafting minimal, elegant digital solutions with meticulous attention to detail and a focus on user experience.
              </motion.p>
            </motion.div>
            
            {/* CTA buttons with magnetic effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-4"
            >
              <MagneticButton
                className="rounded-none border border-white/20 bg-white text-black px-8 py-3 text-sm tracking-wider hover:bg-transparent hover:text-white transition-all duration-300 group"
              
              >
                <span className="flex items-center">
                  EXPLORE WORK
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </MagneticButton>
              
              <MagneticButton
                className="rounded-none border border-white/20 bg-transparent text-white px-8 py-3 text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-300 group"
              
              >
                <span className="flex items-center">
                  ABOUT ME
                  <Plus className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                </span>
              </MagneticButton>
            </motion.div>
          </div>
          
          {/* 3D visual element */}
          <div className="col-span-12 lg:col-span-5 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 2 }}
              className="relative aspect-square"
           
            >
              {/* Abstract 3D element */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4/5 h-4/5 relative">
                  <RotatingCube />
                  
                  {/* Animated elements inside the cube */}
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-1/2 h-1/2 border border-white/20"></div>
                  </motion.div>
                  
                  {/* Floating dots */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white/50 rounded-full"
                      initial={{ 
                        x: `${Math.random() * 100}%`, 
                        y: `${Math.random() * 100}%`,
                        opacity: 0.3 + Math.random() * 0.7
                      }}
                      animate={{ 
                        x: [
                          `${Math.random() * 100}%`, 
                          `${Math.random() * 100}%`,
                          `${Math.random() * 100}%`
                        ],
                        y: [
                          `${Math.random() * 100}%`, 
                          `${Math.random() * 100}%`,
                          `${Math.random() * 100}%`
                        ],
                      }}
                      transition={{ 
                        duration: 10 + Math.random() * 20, 
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/30 text-xs tracking-widest"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <span className="mb-2">SCROLL</span>
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
