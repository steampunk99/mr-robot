"use client"
// components/CustomCursor.tsx
import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useAnimation } from "framer-motion";

// Animation parameters that can be easily adjusted
const cursorAnimationConfig = {
  inner: {
    default: { scale: 1 },
    hover: { scale: 1.5 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  outer: {
    default: { scale: 1, opacity: 1 },
    hover: { scale: 2, opacity: 0.6 },
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const CustomCursor: React.FC = () => {
  // Motion values for the cursor
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Smooth delay effect for the outer ring with adjusted stiffness and damping
  // Lower stiffness creates more lag, higher damping makes movement smoother
  const outerX = useSpring(cursorX, { stiffness: 100, damping: 20 });
  const outerY = useSpring(cursorY, { stiffness: 100, damping: 20 });

  // Animation controls for scaling & interactions
  const innerControls = useAnimation();
  const outerControls = useAnimation();
  
  // Ref to track whether mouse interactions are working
  const interactionCounter = useRef(0);

  // Size configurations for cursor elements
  const innerSize = 12;
  const outerSize = 50;

  useEffect(() => {
    console.log("CustomCursor component mounted");

    const moveCursor = (e: MouseEvent) => {
      // Update cursor position with mouse coordinates
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHoverStart = (e: MouseEvent) => {
      // Log for debugging mouse interactions
      interactionCounter.current += 1;
      console.log(`Hover start detected on: ${(e.target as HTMLElement).tagName}, count: ${interactionCounter.current}`);
      
      // Animate the inner cursor with animation config
      innerControls.start({
        ...cursorAnimationConfig.inner.hover,
        transition: cursorAnimationConfig.inner.transition
      });
      
      // Animate the outer cursor with animation config
      outerControls.start({
        ...cursorAnimationConfig.outer.hover,
        transition: cursorAnimationConfig.outer.transition
      });
    };

    const handleHoverEnd = (e: MouseEvent) => {
      // Log for debugging mouse interactions
      console.log(`Hover end detected on: ${(e.target as HTMLElement).tagName}`);
      
      // Return inner cursor to default state
      innerControls.start({
        ...cursorAnimationConfig.inner.default,
        transition: cursorAnimationConfig.inner.transition
      });
      
      // Return outer cursor to default state
      outerControls.start({
        ...cursorAnimationConfig.outer.default,
        transition: cursorAnimationConfig.outer.transition
      });
    };

    // Add mouse move event listener
    window.addEventListener("mousemove", moveCursor);

    // Function to attach event listeners to interactive elements
    const attachInteractionListeners = () => {
      // Select all interactive elements
      const interactiveElements = document.querySelectorAll("a, button, .interactive");
      console.log(`Found ${interactiveElements.length} interactive elements`);
      
      interactiveElements.forEach((el) => {
        // Skip elements that already have listeners
        if (el.hasAttribute("cursor-listener")) return;
        
        // Attach event listeners
        el.addEventListener("mouseenter", handleHoverStart);
        el.addEventListener("mouseleave", handleHoverEnd);
        
        // Mark element to avoid duplicate listeners
        el.setAttribute("cursor-listener", "true");
      });
    };

    // Initial attachment of event listeners
    attachInteractionListeners();

    // Setup MutationObserver to detect new elements
    const observer = new MutationObserver(() => {
      // When DOM changes, check for new interactive elements
      attachInteractionListeners();
    });

    // Start observing document body for added/removed nodes
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup function - runs when component unmounts
    return () => {
      // Remove global mouse move listener
      window.removeEventListener("mousemove", moveCursor);
      
      // Remove all interaction listeners
      document.querySelectorAll("[cursor-listener='true']").forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
        el.removeAttribute("cursor-listener");
      });
      
      // Disconnect mutation observer
      observer.disconnect();
    };
  }, [cursorX, cursorY, innerControls, outerControls]);

  return (
    <>
      {/* Inner Cursor - Small glowing circle */}
      <motion.div
        animate={innerControls}
        style={{
          position: "fixed",
          // Center the element by offsetting half its width and height
          top: -innerSize / 2, 
          left: -innerSize / 2,
          width: innerSize,
          height: innerSize,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.8) 10%, rgba(255,255,255,0) 80%)",
          pointerEvents: "none", // Ensure it doesn't interfere with mouse events
          x: cursorX,
          y: cursorY,
          zIndex: 9999,
          mixBlendMode: "difference",
          // Adding a subtle box shadow for better visibility
          boxShadow: "0 0 5px rgba(255,255,255,0.5)"
        }}
      />

      {/* Outer Cursor - Faintly glowing ring */}
      <motion.div
        animate={outerControls}
        style={{
          position: "fixed",
          // Center the element by offsetting half its width and height
          top: -outerSize / 2,
          left: -outerSize / 2,
          width: outerSize,
          height: outerSize,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.5)",
          pointerEvents: "none", // Ensure it doesn't interfere with mouse events
          x: outerX,
          y: outerY,
          zIndex: 9998,
          mixBlendMode: "exclusion",
          // Making the border slightly more visible
          boxShadow: "0 0 10px rgba(255,255,255,0.2)"
        }}
      />
    </>
  );
};

export default CustomCursor;