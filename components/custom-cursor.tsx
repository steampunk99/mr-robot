"use client"

// components/CustomCursor.tsx
import React, { useEffect, useRef, useState } from "react";
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
    hover: { scale: 2, opacity: 0.8 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  text: {
    default: { opacity: 0, scale: 0.8 },
    hover: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const CustomCursor: React.FC = () => {
  // Motion values for the cursor
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // State to store the current hover text
  const [cursorText, setCursorText] = useState("");

  // Smooth delay effect for the outer ring
  const outerX = useSpring(cursorX, { stiffness: 100, damping: 18 });
  const outerY = useSpring(cursorY, { stiffness: 100, damping: 18 });

  // Animation controls
  const innerControls = useAnimation();
  const outerControls = useAnimation();
  const textControls = useAnimation();
  
  // Ref to track whether mouse interactions are working
  const interactionCounter = useRef(0);

  // Size configurations for cursor elements
  const innerSize = 12;
  const outerSize = 60;
  // Larger size when showing text
  const expandedSize = 160;

  useEffect(() => {
    console.log("CustomCursor component mounted");

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHoverStart = (e: MouseEvent) => {
      interactionCounter.current += 1;
      console.log(`Hover start detected on: ${(e.target as HTMLElement).tagName}, count: ${interactionCounter.current}`);
      
      // Get the data-cursor-text attribute or use a default
      const targetElement = e.target as HTMLElement;
      const hoverText = targetElement.getAttribute('data-cursor-text') || "";
      
      // Update cursor text and animate
      setCursorText(hoverText);
      
      // Animate inner cursor
      innerControls.start({
        ...cursorAnimationConfig.inner.hover,
        transition: cursorAnimationConfig.inner.transition
      });
      
      // Animate outer cursor - make it bigger if we have text
      outerControls.start({
        ...cursorAnimationConfig.outer.hover,
        scale: hoverText ? 6 : cursorAnimationConfig.outer.hover.scale,
        transition: cursorAnimationConfig.outer.transition
      });
      
      // Animate text visibility
      if (hoverText) {
        textControls.start({
          ...cursorAnimationConfig.text.hover,
          transition: cursorAnimationConfig.text.transition
        });
      }
    };

    const handleHoverEnd = (e: MouseEvent) => {
      console.log(`Hover end detected on: ${(e.target as HTMLElement).tagName}`);
      
      // Return to default states
      innerControls.start({
        ...cursorAnimationConfig.inner.default,
        transition: cursorAnimationConfig.inner.transition
      });
      
      outerControls.start({
        ...cursorAnimationConfig.outer.default,
        transition: cursorAnimationConfig.outer.transition
      });
      
      textControls.start({
        ...cursorAnimationConfig.text.default,
        transition: cursorAnimationConfig.text.transition
      });
      
      // Clear text after animation finishes
      setTimeout(() => setCursorText(""), 300);
    };

    window.addEventListener("mousemove", moveCursor);

    const attachInteractionListeners = () => {
      const interactiveElements = document.querySelectorAll("a, button, .interactive");
      console.log(`Found ${interactiveElements.length} interactive elements`);
      
      interactiveElements.forEach((el) => {
        if (el.hasAttribute("cursor-listener")) return;
        
        el.addEventListener("mouseenter", handleHoverStart);
        el.addEventListener("mouseleave", handleHoverEnd);
        
        // If element doesn't have data-cursor-text, add a default based on element type
        if (!el.hasAttribute("data-cursor-text")) {
          if (el.tagName === "A") {
            el.setAttribute("data-cursor-text", "Click me");
          } else if (el.tagName === "BUTTON") {
            el.setAttribute("data-cursor-text", "Tap me");
          }
        }
        
        el.setAttribute("cursor-listener", "true");
      });
    };

    attachInteractionListeners();

    const observer = new MutationObserver(() => {
      attachInteractionListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      
      document.querySelectorAll("[cursor-listener='true']").forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
        el.removeAttribute("cursor-listener");
      });
      
      observer.disconnect();
    };
  }, [cursorX, cursorY, innerControls, outerControls, textControls]);

  return (
    <>
      {/* Inner Cursor - Small glowing circle */}
      <motion.div
        animate={innerControls}
        style={{
          position: "fixed",
          top: -innerSize / 2, 
          left: -innerSize / 2,
          width: innerSize,
          height: innerSize,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.8) 10%, rgba(255,255,255,0) 80%)",
          pointerEvents: "none",
          x: cursorX,
          y: cursorY,
          zIndex: 9999,
          mixBlendMode: "difference",
          boxShadow: "0 0 5px rgba(255,255,255,0.3)"
        }}
      />

      {/* Outer Cursor - Faintly glowing ring */}
      <motion.div
        animate={outerControls}
        style={{
          position: "fixed",
          top: -outerSize / 2,
          left: -outerSize / 2,
          width: outerSize,
          height: outerSize,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.5)",
          pointerEvents: "none",
          x: outerX,
          y: outerY,
          zIndex: 9998,
          mixBlendMode: "exclusion",
          boxShadow: "0 0 10px rgba(255,255,255,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      />
      
      {/* Text within the cursor */}
      <motion.div
        animate={textControls}
        initial={cursorAnimationConfig.text.default}
        style={{
          position: "fixed",
          pointerEvents: "none",
          x: outerX,
          y: outerY,
          zIndex: 10000,
          fontSize: "14px",
          fontWeight: "bold",
        
          padding: "8px 8px",
          color: "#00FF00",
          textShadow: "0 0 3px rgba(0,0,0,0.8)",
          textAlign: "center",
          whiteSpace: "nowrap",
          transform: "translate(-50%, -50%)",
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}
      >
        {cursorText}
      </motion.div>
    </>
  );
};

export default CustomCursor;