"use client"

import React, { useRef, useState, useEffect } from "react"
import { motion, useScroll, useInView, useAnimation, type Variants } from "framer-motion"
import Image from "next/image"

// ======= SHIMMERING TEXT =======
interface ShimmerTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  from?: string
  to?: string
  springConfig?: { stiffness: number; damping: number }
  fontSize?: string
  fontWeight?: string
  as?: React.ElementType
  gradient?: boolean
  gradientColors?: string[]
  onScroll?: boolean
  staggerChildren?: number
  repeat?: boolean | number
}

export const ShimmerText: React.FC<ShimmerTextProps> = ({
  text,
  className = "",
  delay = 0,
  duration = 1.5,
  from = "#9898ba",
  to = "#c9c9f2",
  springConfig = { stiffness: 100, damping: 30 },
  fontSize = "inherit",
  fontWeight = "inherit",
  as: Component = "span",
  gradient = false,
  gradientColors = ["#A78BFA", "#EC4899", "#8B5CF6"],
  onScroll = false,
  staggerChildren = 0.03,
  repeat = false,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: !repeat, amount: 0.3 })
  const controls = useAnimation()

  // For scroll-based animation
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const words = text.split(" ")

  useEffect(() => {
    if (isInView && !onScroll) {
      controls.start("visible")
    }
  }, [isInView, controls, onScroll])

  // Variants for words
  const wordVariants: Variants = {
    hidden: {},
    visible: {},
  }

  // Variants for characters
  const characterVariants: Variants = {
    hidden: {
      opacity: 0,
      color: from,
      y: 20,
    },
    visible: {
      opacity: 1,
      color: to,
      y: 0,
      transition: {
        duration: duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <Component ref={ref} className={`inline-block ${className}`} style={{ fontSize, fontWeight }}>
      {words.map((word, wordIndex) => (
        <motion.span
          key={`word-${wordIndex}`}
          className="inline-block mr-[0.25em] last:mr-0"
          variants={wordVariants}
          initial="hidden"
          animate={onScroll ? undefined : controls}
        >
          {Array.from(word).map((char, charIndex) => (
            <motion.span
              key={`char-${wordIndex}-${charIndex}`}
              className={`inline-block ${gradient ? "shimmer-gradient" : ""}`}
              variants={characterVariants}
              initial="hidden"
              animate={onScroll ? undefined : controls}
              custom={charIndex}
              transition={{
                delay: delay + (wordIndex * words.length + charIndex) * staggerChildren,
                duration: duration,
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: duration * 0.5 },
              }}
              style={
                gradient
                  ? {
                      backgroundImage: `linear-gradient(to right, ${gradientColors.join(", ")})`,
                      backgroundSize: "200% auto",
                      color: "transparent",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                  : {}
              }
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}

      {/* Add gradient animation styles */}
      {gradient && (
        <style jsx global>{`
          .shimmer-gradient {
            animation: shimmer 2s linear infinite;
          }
          
          @keyframes shimmer {
            to {
              background-position: 200% center;
            }
          }
        `}</style>
      )}
    </Component>
  )
}

// ======= IMAGE ANIMATIONS =======
interface RevealImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  revealDirection?: "left" | "right" | "top" | "bottom"
  duration?: number
  delay?: number
  priority?: boolean
  fill?: boolean
  onScroll?: boolean
  threshold?: number
  style?: React.CSSProperties
}

export const RevealImage: React.FC<RevealImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  revealDirection = "left",
  duration = 1.2,
  delay = 0,
  priority = false,
  fill = false,
  onScroll = true,
  threshold = 0.2,
  style = {},
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })

  // Set up reveal animation based on direction
  const getInitialClipPath = () => {
    switch (revealDirection) {
      case "left":
        return "inset(0 100% 0 0)"
      case "right":
        return "inset(0 0 0 100%)"
      case "top":
        return "inset(100% 0 0 0)"
      case "bottom":
        return "inset(0 0 100% 0)"
      default:
        return "inset(0 100% 0 0)"
    }
  }

  const variants: Variants = {
    hidden: {
      clipPath: getInitialClipPath(),
      transition: { duration: 0 },
    },
    visible: {
      clipPath: "inset(0 0 0 0)",
      transition: {
        duration: duration,
        delay: delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={style}>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={variants}
        className="h-full w-full"
      >
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          fill={fill}
          className={`${fill ? "object-cover" : ""}`}
        />
      </motion.div>
    </div>
  )
}

// ======= PARALLAX EFFECT =======
interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
  direction?: "up" | "down" | "left" | "right"
  overflow?: boolean
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  className = "",
  direction = "up",
  overflow = false,
}) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Calculate transform based on direction
  const multiplier = direction === "down" || direction === "right" ? 1 : -1
  const axis = direction === "up" || direction === "down" ? "y" : "x"
  const range = 100 * speed * multiplier

  const transformY = direction === "up" || direction === "down" ? scrollYProgress : null
  const transformX = direction === "left" || direction === "right" ? scrollYProgress : null

  const y = transformY ? transformY.to([0, 1], [0, range]) : 0
  const x = transformX ? transformX.to([0, 1], [0, range]) : 0

  return (
    <div ref={ref} className={`${overflow ? "" : "overflow-hidden"} ${className}`}>
      <motion.div style={{ y, x }}>{children}</motion.div>
    </div>
  )
}

// ======= STAGGERED ITEMS =======
interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  delay?: number
  staggerChildren?: number
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  duration?: number
  once?: boolean
  threshold?: number
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = "",
  delay = 0,
  staggerChildren = 0.1,
  direction = "up",
  distance = 20,
  duration = 0.6,
  once = true,
  threshold = 0.2,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })

  // Get transform based on direction
  const getTransform = () => {
    switch (direction) {
      case "up":
        return { y: distance }
      case "down":
        return { y: -distance }
      case "left":
        return { x: distance }
      case "right":
        return { x: -distance }
      default:
        return { y: distance }
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      ...getTransform(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return (
            <motion.div key={index} variants={itemVariants} custom={index}>
              {child}
            </motion.div>
          )
        }
        return child
      })}
    </motion.div>
  )
}

// ======= TEXT REVEAL =======
interface TextRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: "up" | "down"
  distance?: number
  staggerChildren?: number
  once?: boolean
  threshold?: number
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  direction = "up",
  distance = 20,
  staggerChildren = 0.1,
  once = true,
  threshold = 0.2,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? distance : -distance,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

// ======= MAGNETIC BUTTON =======
interface MagneticProps {
  children: React.ReactNode
  className?: string
  strength?: number
}

export const Magnetic: React.FC<MagneticProps> = ({ children, className = "", strength = 30 }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleMouse = (e: React.MouseEvent) => {
    if (isMobile || !ref.current) return

    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()

    const x = (clientX - (left + width / 2)) / (strength / 10)
    const y = (clientY - (top + height / 2)) / (strength / 10)

    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const { x, y } = position

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  )
}

// ======= SCROLL PROGRESS INDICATOR =======
import { useSpring } from "framer-motion"

interface ScrollProgressProps {
  color?: string
  height?: number
  zIndex?: number
  position?: "top" | "bottom"
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  color = "#8B5CF6",
  height = 4,
  zIndex = 50,
  position = "top",
}) => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      className="fixed left-0 right-0"
      style={{
        top: position === "top" ? 0 : "auto",
        bottom: position === "bottom" ? 0 : "auto",
        height,
        backgroundColor: color,
        transformOrigin: "0%",
        scaleX,
        zIndex,
      }}
    />
  )
}

// ======= MARQUEE TEXT =======
interface MarqueeProps {
  children: React.ReactNode
  direction?: "left" | "right"
  speed?: number
  pauseOnHover?: boolean
  className?: string
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  direction = "left",
  speed = 20,
  pauseOnHover = true,
  className = "",
}) => {
  const [hover, setHover] = useState(false)

  const marqueeVariants: Variants = {
    animate: {
      x: direction === "left" ? [0, -1000] : [-1000, 0],
      transition: {
        x: {
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          duration: 100 / speed,
          ease: "linear",
        },
      },
    },
    pause: {
      x: 0,
    },
  }

  return (
    <div
      className={`overflow-hidden whitespace-nowrap ${className}`}
      onMouseEnter={() => pauseOnHover && setHover(true)}
      onMouseLeave={() => pauseOnHover && setHover(false)}
    >
      <motion.div className="inline-block" variants={marqueeVariants} animate={hover ? "pause" : "animate"}>
        {children}
      </motion.div>
      <motion.div className="inline-block" variants={marqueeVariants} animate={hover ? "pause" : "animate"}>
        {children}
      </motion.div>
    </div>
  )
}

// ======= USAGE EXAMPLES =======
export const AnimationExamples: React.FC = () => {
  return (
    <div className="space-y-24 py-24">
      {/* Shimmer Text Example */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold">Shimmer Text</h2>
        <div className="space-y-4">
          <ShimmerText text="Basic Shimmer Animation" fontSize="2rem" fontWeight="600" />

          <ShimmerText
            text="Gradient Text Animation"
            fontSize="2rem"
            fontWeight="600"
            gradient={true}
            gradientColors={["#A78BFA", "#EC4899", "#8B5CF6"]}
          />

          <ShimmerText
            text="Slower Animation with Delay"
            fontSize="2rem"
            fontWeight="600"
            duration={2.5}
            delay={0.5}
            from="#333333"
            to="#ffffff"
          />
        </div>
      </section>

      {/* Image Animation Example */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold">Image Animations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <RevealImage
            src="/placeholder.svg?height=400&width=600"
            alt="Left reveal"
            width={600}
            height={400}
            revealDirection="left"
          />

          <RevealImage
            src="/placeholder.svg?height=400&width=600"
            alt="Right reveal"
            width={600}
            height={400}
            revealDirection="right"
            delay={0.2}
          />

          <RevealImage
            src="/placeholder.svg?height=400&width=600"
            alt="Bottom reveal"
            width={600}
            height={400}
            revealDirection="bottom"
            delay={0.4}
          />
        </div>
      </section>

      {/* Staggered Items Example */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold">Staggered Items</h2>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Item {item}</h3>
              <p>This item animates with a staggered delay.</p>
            </div>
          ))}
        </StaggerContainer>
      </section>

      {/* Magnetic Button Example */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold">Magnetic Button</h2>
        <div className="flex justify-center">
          <Magnetic>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-medium">
              Hover Me
            </button>
          </Magnetic>
        </div>
      </section>

      {/* Marquee Example */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold">Marquee Text</h2>
        <Marquee className="py-4 bg-gray-800 text-white">
          <span className="text-2xl font-bold mx-4">Scrolling Text •</span>
          <span className="text-2xl font-bold mx-4">Hover to Pause •</span>
          <span className="text-2xl font-bold mx-4">Customizable Speed •</span>
          <span className="text-2xl font-bold mx-4">Awwwards Style •</span>
        </Marquee>
      </section>
    </div>
  )
}

