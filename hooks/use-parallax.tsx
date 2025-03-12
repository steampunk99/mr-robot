"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

type ParallaxOptions = {
  direction?: "up" | "down" | "left" | "right";
  speed?: number;
  range?: [number, number];
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  inView?: boolean; // Only activate when in view
  inputRange?: [number, number]; // [0, 1] by default
  outputRange?: [number, number]; // Depends on direction
};

export function useParallax(options: ParallaxOptions = {}) {
  const {
    direction = "up",
    speed = 1,
    range = [0, 100], 
    springConfig = { stiffness: 100, damping: 30, mass: 1 },
    inView = false,
    inputRange = [0, 1],
    outputRange
  } = options;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Determine output range based on direction and speed
  const getOutputRange = () => {
    if (outputRange) return outputRange;
    
    const distance = range[1] - range[0];
    const adjustedDistance = distance * speed;
    
    switch (direction) {
      case "up":
        return [range[0] + adjustedDistance, range[0]];
      case "down":
        return [range[0], range[0] + adjustedDistance];
      case "left":
        return [range[0] + adjustedDistance, range[0]];
      case "right":
        return [range[0], range[0] + adjustedDistance];
      default:
        return [range[0] + adjustedDistance, range[0]];
    }
  };
  
  // Create transformed value
  const transformedValue = useTransform(
    scrollYProgress,
    inputRange,
    getOutputRange()
  );
  
  // Apply spring for smoother animation if needed
  const springValue = useSpring(transformedValue, springConfig);
  
  // For measuring element position
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setElementTop(rect.top + window.scrollY || window.pageYOffset);
        setClientHeight(window.innerHeight);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // If inView is true, check if the element is in view
  const getTransformStyle = () => {
    if (!inView) return springValue;
    
    // If the element is in view, return the spring value, otherwise return 0
    if (elementTop < clientHeight) {
      return springValue;
    }
    
    // Create a zero motion value
    return new MotionValue(0);
  };
  
  // Return direction-specific transform style based on the direction
  const getDirectionalTransform = () => {
    const transformStyle = getTransformStyle();
    
    switch (direction) {
      case "up":
      case "down":
        return { y: transformStyle };
      case "left":
      case "right":
        return { x: transformStyle };
      default:
        return { y: transformStyle };
    }
  };
  
  return {
    ref: containerRef,
    style: getDirectionalTransform(),
    scrollYProgress,
    springValue
  };
}

export default useParallax; 