"use client";

import React from "react";
import { motion } from "framer-motion";
import useParallax from "@/hooks/use-parallax";

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  speed?: number;
  delay?: number;
  inView?: boolean;
  offset?: [string, string]; // Offset for useScroll
  as?: React.ElementType;
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
};

// Basic parallax component that moves in a direction when scrolling
export function ParallaxElement({
  children,
  className = "",
  direction = "up",
  speed = 1,
  delay = 0,
  inView = false,
  offset = ["start end", "end start"],
  as = "div",
  springConfig = { stiffness: 100, damping: 30, mass: 1 },
}: ParallaxProps) {
  const { ref, style } = useParallax({
    direction,
    speed,
    inView,
    springConfig,
  });

  const MotionComponent = motion[as as keyof typeof motion] || motion.div;

  return (
    <MotionComponent
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
    >
      {children}
    </MotionComponent>
  );
}

// Parallax component with scale effects
export function ParallaxScale({
  children,
  className = "",
  speed = 0.2,
  delay = 0,
  inView = false,
  as = "div",
}: Omit<ParallaxProps, "direction"> & { speed?: number }) {
  const scaleOutputRange = [1, 1 + speed];
  const opacityOutputRange = [1, 1 - speed / 2];

  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useParallax({
    inView,
  });

  const scaleStyle = {
    scale: useParallax({
      outputRange: scaleOutputRange,
    }).springValue,
    opacity: useParallax({
      outputRange: opacityOutputRange,
    }).springValue,
  };

  const MotionComponent = motion[as as keyof typeof motion] || motion.div;

  return (
    <MotionComponent
      ref={containerRef}
      className={className}
      style={scaleStyle}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
    >
      {children}
    </MotionComponent>
  );
}

// Parallax component with depth effect
export function ParallaxLayer({
  children,
  className = "",
  depth = 0.1, // 0 is static, 1 is full parallax effect
  inView = false,
  as = "div",
}: Omit<ParallaxProps, "direction" | "speed"> & { depth?: number }) {
  const { ref, style } = useParallax({
    direction: "up",
    speed: depth,
    range: [0, 50], // Smaller range for subtle effect
    inView,
    springConfig: { stiffness: 50, damping: 30, mass: 1 }, // Softer spring
  });

  const MotionComponent = motion[as as keyof typeof motion] || motion.div;

  return (
    <MotionComponent ref={ref} className={className} style={style}>
      {children}
    </MotionComponent>
  );
}

// Parallax section component that handles child elements with depth
export function ParallaxSection({
  children,
  className = "",
  as = "section",
}: Omit<ParallaxProps, "direction" | "speed" | "delay" | "inView">) {
  const MotionComponent = motion[as as keyof typeof motion] || motion.section;

  return (
    <MotionComponent className={`relative overflow-hidden ${className}`}>
      {children}
    </MotionComponent>
  );
}

// Parallax background component for full-page backgrounds
export function ParallaxBackground({
  children,
  className = "",
  speed = 0.2,
  imageUrl,
}: Omit<ParallaxProps, "direction" | "inView"> & { imageUrl?: string }) {
  const { ref, style } = useParallax({
    direction: "up",
    speed,
    range: [0, 50], // Smaller range for subtle effect
  });

  return (
    <motion.div className="relative w-full h-full overflow-hidden">
      {imageUrl && (
        <motion.div
          ref={ref}
          className={`absolute inset-0 w-full h-[120%] -top-[10%] ${className}`}
          style={{
            ...style,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      {children}
    </motion.div>
  );
}

export default {
  ParallaxElement,
  ParallaxScale,
  ParallaxLayer,
  ParallaxSection,
  ParallaxBackground,
}; 