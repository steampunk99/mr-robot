"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useSpring, useTransform, useMotionValue } from "framer-motion";

type SectionType = "home" | "about" | "work" | "contact";

interface FutureRobotProps {
  width?: number;
  height?: number;
  section?: SectionType;
  disableMotion?: boolean;
}

export default function FutureRobot({
  width = 400,
  height = 500,
  section = "home",
  disableMotion = false
}: FutureRobotProps) {
  // Animation controls
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // State for interactions
  const [isHovering, setIsHovering] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [particleCount, setParticleCount] = useState(0);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth animations with springs
  const springConfig = { damping: 15, stiffness: 150 };
  const eyeX = useSpring(0, springConfig);
  const eyeY = useSpring(0, springConfig);
  const headRotate = useSpring(0, { damping: 50, stiffness: 400 });
  const bodyY = useSpring(0, { damping: 10, stiffness: 100 });
  
  // Section-based colors
  const sectionColors = {
    home: "#3b82f6",    // Blue
    about: "#10b981",   // Green
    work: "#8b5cf6",    // Purple
    contact: "#f97316"  // Orange
  };
  
  // Particle system for interaction effects
  const particles = useRef<{ x: number; y: number; vx: number; vy: number; life: number; size: number; color: string }[]>([]);
  
  const primaryColor = sectionColors[section];
  const secondaryColor = section === "home" ? "#60a5fa" : 
                         section === "about" ? "#34d399" : 
                         section === "work" ? "#a78bfa" : 
                         "#fb923c";

  // Custom visibility detection without intersection observer
  useEffect(() => {
    const checkVisibility = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isElementVisible = 
          rect.top < window.innerHeight &&
          rect.bottom > 0;
        
        if (isElementVisible !== isVisible) {
          setIsVisible(isElementVisible);
        }
      }
    };

    // Check visibility on mount and on scroll
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [isVisible]);
  
  // Reset idle state timer
  const resetIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    
    setIsIdle(false);
    
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, 3000);
  };
  
  // Handle mouse movement for eye tracking and interactions
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    resetIdleTimer();
    
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center
    const distX = (e.clientX - centerX) / (rect.width / 2);
    const distY = (e.clientY - centerY) / (rect.height / 2);
    
    // Update mouse position for animations
    mouseX.set(distX);
    mouseY.set(distY);
    
    // Eye and head movement
    eyeX.set(distX * 10);
    eyeY.set(distY * 5);
    headRotate.set(distX * 5);
    
    // Emit particles on hover over interactive areas
    if (isHovering && Math.random() > 0.7) {
      emitParticle(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };
  
  // Add a particle at the specified position
  const emitParticle = (x: number, y: number) => {
    if (particleCount > 40) return; // Limit number of particles
    
    setParticleCount(prev => prev + 1);
    
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2;
    const size = 2 + Math.random() * 4;
    
    particles.current.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1, // Upward bias
      life: 30 + Math.random() * 60,
      size,
      color: Math.random() > 0.5 ? primaryColor : secondaryColor
    });
  };
  
  // Handle click event for more dramatic particle emission
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    resetIdleTimer();
    
    // Emit a burst of particles
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        if (svgRef.current) {
          const rect = svgRef.current.getBoundingClientRect();
          emitParticle(
            e.nativeEvent.offsetX + (Math.random() * 30 - 15),
            e.nativeEvent.offsetY + (Math.random() * 30 - 15)
          );
        }
      }, i * 20);
    }
    
    // Animate the robot body
    bodyY.set(10);
    setTimeout(() => bodyY.set(0), 300);
    
    // Trigger a special animation
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.4 }
    });
  };
  
  // Update particles in animation frame
  useEffect(() => {
    let animationFrameId: number;
    
    const updateParticles = () => {
      if (particles.current.length === 0) {
        animationFrameId = requestAnimationFrame(updateParticles);
        return;
      }
      
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // Gravity
        p.life--;
        
        if (p.life <= 0) {
          particles.current.splice(i, 1);
          i--;
          setParticleCount(prev => prev - 1);
        }
      }
      
      // Force a re-render
      if (svgRef.current) {
        const svg = svgRef.current;
        const particleElements = svg.querySelectorAll('.particle');
        
        particles.current.forEach((p, i) => {
          if (particleElements[i]) {
            const element = particleElements[i] as SVGCircleElement;
            element.setAttribute('cx', p.x.toString());
            element.setAttribute('cy', p.y.toString());
            element.setAttribute('r', p.size.toString());
            element.setAttribute('opacity', (p.life / 100).toString());
          }
        });
      }
      
      animationFrameId = requestAnimationFrame(updateParticles);
    };
    
    animationFrameId = requestAnimationFrame(updateParticles);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  // Animate when robot comes into view
  useEffect(() => {
    if (isVisible) {
      controls.start({
        y: [20, 0],
        opacity: [0, 1],
        transition: { duration: 0.8, ease: "easeOut" }
      });
    }
  }, [controls, isVisible]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);
  
  // Transform mouse position into hover glows and ambient animations
  const hoverX = useTransform(mouseX, [-1, 1], [-20, 20]);
  const hoverY = useTransform(mouseY, [-1, 1], [-20, 20]);
  const floatY = useTransform(bodyY, value => value);
  
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="relative"
      style={{ width, height }}
    >
      <motion.svg 
        ref={svgRef}
        width={width} 
        height={height} 
        viewBox="0 0 240 300"
        onMouseMove={disableMotion ? undefined : handleMouseMove}
        onClick={disableMotion ? undefined : handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          y: floatY
        }}
        className="cursor-pointer"
      >
        {/* Base gradient background */}
        <defs>
          <radialGradient id="robotGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="bodyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
          
          <linearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`${primaryColor}33`} />
            <stop offset="100%" stopColor={`${primaryColor}11`} />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <clipPath id="screenClip">
            <rect x="80" y="90" width="80" height="40" rx="5" />
          </clipPath>
        </defs>
        
        {/* Background ambient glow */}
        <motion.circle
          cx="120"
          cy="150"
          r="120"
          fill="url(#robotGlow)"
          style={{ 
            x: hoverX,
            y: hoverY,
            scale: isHovering ? 1.2 : 1
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Robot body */}
        <g>
          {/* Base */}
          <rect 
            x="90" 
            y="220" 
            width="60" 
            height="10" 
            rx="5" 
            fill="#333"
            stroke={primaryColor}
            strokeWidth="1"
          />
          
          {/* Lower body */}
          <rect 
            x="95" 
            y="180" 
            width="50" 
            height="40" 
            rx="5" 
            fill="url(#bodyGradient)" 
            stroke="#444"
            strokeWidth="1"
          />
          
          {/* Body core */}
          <rect 
            x="75" 
            y="130" 
            width="90" 
            height="50" 
            rx="10" 
            fill="url(#bodyGradient)" 
            stroke="#444"
            strokeWidth="1"
          />
          
          {/* Body decorative lines */}
          <line x1="95" y1="140" x2="145" y2="140" stroke={primaryColor} strokeWidth="0.5" />
          <line x1="95" y1="150" x2="145" y2="150" stroke={primaryColor} strokeWidth="0.5" />
          <line x1="95" y1="160" x2="145" y2="160" stroke={primaryColor} strokeWidth="0.5" />
          
          {/* Main screen/display */}
          <rect 
            x="80" 
            y="90" 
            width="80" 
            height="40" 
            rx="5" 
            fill="url(#glassGradient)" 
            stroke={primaryColor}
            strokeWidth="1"
          />
          
          {/* Screen content */}
          <g clipPath="url(#screenClip)">
            <motion.rect
              x="70"
              y="85"
              width="100"
              height="50"
              fill="black"
              initial={{ opacity: 0.7 }}
              animate={{ 
                opacity: [0.7, 0.9, 0.7],
                transition: { 
                  repeat: Infinity, 
                  duration: 3,
                  repeatType: "reverse"
                }
              }}
            />
            
            {/* Visualizer bars */}
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.rect
                key={i}
                x={85 + i * 7}
                y="110"
                width="3"
                height="10"
                fill={i % 3 === 0 ? primaryColor : secondaryColor}
                initial={{ height: 10 }}
                animate={{ 
                  height: [10, 5 + Math.random() * 15, 10],
                  transition: { 
                    repeat: Infinity, 
                    duration: 0.5 + Math.random(),
                    repeatType: "reverse"
                  }
                }}
              />
            ))}
            
            {/* Status text */}
            <text 
              x="120" 
              y="105" 
              textAnchor="middle" 
              fill={primaryColor} 
              fontSize="6"
              fontFamily="monospace"
            >
              STATUS: {section.toUpperCase()}
            </text>
          </g>
          
          {/* Shoulder connectors */}
          <circle cx="75" cy="140" r="10" fill="#333" stroke="#444" strokeWidth="1" />
          <circle cx="165" cy="140" r="10" fill="#333" stroke="#444" strokeWidth="1" />
          
          {/* Arms */}
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ 
              rotate: isIdle ? [0, -5, 0, 5, 0] : 0,
              transition: { 
                repeat: isIdle ? Infinity : 0, 
                duration: 5,
                repeatType: "reverse"
              }
            }}
            style={{ originX: "0", originY: "0.5" }}
          >
            <rect x="45" y="135" width="30" height="10" rx="5" fill="#333" />
            <rect x="30" y="130" width="15" height="20" rx="5" fill="#444" />
            <rect x="15" y="135" width="15" height="10" rx="5" fill="#333" />
            
            {/* Hand */}
            <motion.circle 
              cx="15" 
              cy="140" 
              r="8" 
              fill="#333" 
              stroke={primaryColor}
              strokeWidth="1"
              animate={{ 
                scale: [1, 1.1, 1],
                transition: { 
                  repeat: Infinity, 
                  duration: 2,
                  repeatType: "reverse"
                }
              }}
            />
          </motion.g>
          
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ 
              rotate: isIdle ? [0, 5, 0, -5, 0] : 0,
              transition: { 
                repeat: isIdle ? Infinity : 0, 
                duration: 6,
                repeatType: "reverse"
              }
            }}
            style={{ originX: "1", originY: "0.5" }}
          >
            <rect x="165" y="135" width="30" height="10" rx="5" fill="#333" />
            <rect x="195" y="130" width="15" height="20" rx="5" fill="#444" />
            <rect x="210" y="135" width="15" height="10" rx="5" fill="#333" />
            
            {/* Hand */}
            <motion.circle 
              cx="225" 
              cy="140" 
              r="8"
              fill="#333" 
              stroke={primaryColor}
              strokeWidth="1"
              animate={{ 
                scale: [1, 1.1, 1],
                transition: { 
                  repeat: Infinity, 
                  duration: 2,
                  repeatType: "reverse",
                  delay: 0.5
                }
              }}
            />
          </motion.g>
          
          {/* Neck */}
          <rect x="110" y="70" width="20" height="20" rx="5" fill="#333" />
          
          {/* Head */}
          <motion.g
            style={{ rotate: headRotate }}
          >
            <rect x="90" y="40" width="60" height="30" rx="10" fill="url(#bodyGradient)" stroke="#444" strokeWidth="1" />
            
            {/* Antennas */}
            <motion.g
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                transition: { 
                  repeat: Infinity, 
                  duration: 3,
                  repeatType: "reverse"
                }
              }}
              style={{ originX: "0.5", originY: "1" }}
            >
              <line x1="105" y1="40" x2="105" y2="25" stroke="#444" strokeWidth="2" />
              <circle cx="105" cy="22" r="3" fill={primaryColor} />
            </motion.g>
            
            <motion.g
              animate={{ 
                rotate: [0, -5, 0, 5, 0],
                transition: { 
                  repeat: Infinity, 
                  duration: 4,
                  repeatType: "reverse"
                }
              }}
              style={{ originX: "0.5", originY: "1" }}
            >
              <line x1="135" y1="40" x2="135" y2="25" stroke="#444" strokeWidth="2" />
              <circle cx="135" cy="22" r="3" fill={primaryColor} />
            </motion.g>
            
            {/* Eyes */}
            <g>
              <motion.g style={{ x: eyeX, y: eyeY }}>
                <circle cx="105" cy="55" r="7" fill="black" />
                <motion.circle 
                  cx="105" 
                  cy="55" 
                  r="5" 
                  fill={primaryColor}
                  animate={{ 
                    opacity: [1, 0.7, 1],
                    scale: [1, 0.9, 1],
                    transition: { 
                      repeat: Infinity, 
                      duration: 3,
                      repeatType: "reverse"
                    }
                  }}
                />
              </motion.g>
              
              <motion.g style={{ x: eyeX, y: eyeY }}>
                <circle cx="135" cy="55" r="7" fill="black" />
                <motion.circle 
                  cx="135" 
                  cy="55" 
                  r="5" 
                  fill={primaryColor}
                  animate={{ 
                    opacity: [1, 0.7, 1],
                    scale: [1, 0.9, 1],
                    transition: { 
                      repeat: Infinity, 
                      duration: 3,
                      repeatType: "reverse",
                      delay: 0.5
                    }
                  }}
                />
              </motion.g>
            </g>
            
            {/* Mouth/Speaker */}
            <rect x="110" y="65" width="20" height="3" rx="1" fill="#222" />
            
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.rect
                key={i}
                x={113 + i * 5}
                y="65"
                width="2"
                height="3"
                fill={primaryColor}
                animate={{
                  height: [3, 2, 4, 3],
                  transition: {
                    repeat: Infinity,
                    duration: 0.5 + (i * 0.2),
                    repeatType: "reverse"
                  }
                }}
              />
            ))}
          </motion.g>
          
          {/* Tech details and indicators */}
          <circle 
            cx="160" 
            cy="150" 
            r="5" 
            fill="none" 
            stroke={primaryColor} 
            strokeWidth="1" 
          />
          
          <motion.circle 
            cx="160" 
            cy="150" 
            r="3" 
            fill={primaryColor}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
              transition: { 
                repeat: Infinity, 
                duration: 2,
                repeatType: "reverse"
              }
            }}
          />
          
          <circle 
            cx="80" 
            cy="150" 
            r="5" 
            fill="none" 
            stroke={primaryColor} 
            strokeWidth="1" 
          />
          
          <motion.circle 
            cx="80" 
            cy="150" 
            r="3" 
            fill={primaryColor}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
              transition: { 
                repeat: Infinity, 
                duration: 2,
                repeatType: "reverse",
                delay: 0.5
              }
            }}
          />
          
          {/* Mid-section indicator */}
          <rect 
            x="115" 
            y="175" 
            width="10" 
            height="10" 
            rx="2"
            fill="none" 
            stroke={primaryColor} 
            strokeWidth="1"
          />
          
          <motion.rect 
            x="117" 
            y="177" 
            width="6" 
            height="6" 
            rx="1"
            fill={primaryColor}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1],
              transition: { 
                repeat: Infinity, 
                duration: 1.5,
                repeatType: "reverse"
              }
            }}
          />
        </g>
        
        {/* Particles */}
        {particles.current.map((p, i) => (
          <circle
            key={`particle-${i}`}
            className="particle"
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={p.color}
            opacity={p.life / 100}
          />
        ))}
      </motion.svg>
      
      {/* Mobile-friendly touch indicator */}
      <div className="md:hidden absolute bottom-4 right-4 text-xs text-white/60 flex items-center">
        <div className="mr-2 size-2 bg-white/30 rounded-full animate-ping"></div>
        
      </div>
    </motion.div>
  );
} 