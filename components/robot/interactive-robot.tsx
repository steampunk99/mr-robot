"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import FutureRobot from "./future-robot";

interface SectionInfo {
  section: "home" | "about" | "work" | "contact";
  isVisible: boolean;
}

// Robot messages for each section
interface RobotMessage {
  text: string;
  duration: number;
}

const robotMessages: Record<string, RobotMessage[]> = {
  home: [
    { text: "Welcome to my portfolio!", duration: 5000 },
    { text: "I'll be your guide", duration: 5000 }
  ],
  about: [
    { text: "Let me tell you about myself", duration: 4000 },
    { text: "I specialize in creative development..wait we're here already, bye", duration: 6000 }
  ],
  work: [
    { text: "Check out my latest projects", duration: 5000 },
    { text: "Each one is crafted with care", duration: 5000 }
  ],
  contact: [
    { text: "Want to work together?", duration: 5000 },
    { text: "Let's get in touch!", duration: 5000 }
  ]
};

export default function InteractiveRobot() {
  // States for robot appearance and behavior
  const [activeSection, setActiveSection] = useState<"home" | "about" | "work" | "contact">("home");
  const [robotMode, setRobotMode] = useState<"floating" | "walking" | "presenting" | "waving">("floating");
  const [currentMessage, setCurrentMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Spring animations for smoother movement
  const springConfig = { damping: 20, stiffness: 150 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);
  const springRotation = useSpring(0, springConfig);
  const springScale = useSpring(1, springConfig);
  
  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Intersection Observer to detect which section is in view
  useEffect(() => {
    // Track which section is currently visible
    const updateVisibility = () => {
      const sections: SectionInfo[] = [
        { section: "home", isVisible: false },
        { section: "about", isVisible: false },
        { section: "work", isVisible: false },
        { section: "contact", isVisible: false }
      ];
      
      sections.forEach(item => {
        const element = document.getElementById(item.section);
        if (element) {
          const rect = element.getBoundingClientRect();
          item.isVisible = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
        }
      });
      
      const visibleSection = sections.find(s => s.isVisible);
      if (visibleSection) {
        setActiveSection(visibleSection.section);
      }
    };
    
    // Set up the scroll event listener
    window.addEventListener('scroll', updateVisibility);
    updateVisibility(); // Initial check
    
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);
  
  // Update robot appearance and behavior based on active section
  useEffect(() => {
    // Change robot properties based on active section
    switch (activeSection) {
      case "home":
        setRobotMode("floating");
        springX.set(0);
        springY.set(0);
        springRotation.set(0);
        springScale.set(1);
        break;
        
      case "about":
        setRobotMode("presenting");
        springX.set(isMobile ? 0 : -150);
        springY.set(isMobile ? 0 : 50);
        springRotation.set(isMobile ? 0 : 15);
        springScale.set(isMobile ? 0.7 : 0.8);
        break;
        
      case "work":
        setRobotMode("walking");
        springX.set(isMobile ? 0 : 150);
        springY.set(isMobile ? 0 : -50);
        springRotation.set(isMobile ? 0 : -15);
        springScale.set(isMobile ? 0.6 : 0.7);
        break;
        
      case "contact":
        setRobotMode("waving");
        springX.set(0);
        springY.set(isMobile ? 30 : 100);
        springRotation.set(0);
        springScale.set(isMobile ? 0.7 : 0.9);
        break;
    }
    
    // Display section-specific robot messages
    if (robotMessages[activeSection]) {
      let messageIndex = 0;
      
      const showNextMessage = () => {
        if (messageIndex < robotMessages[activeSection].length) {
          const message = robotMessages[activeSection][messageIndex];
          setCurrentMessage(message.text);
          setShowMessage(true);
          
          const timer1 = setTimeout(() => {
            setShowMessage(false);
            
            const timer2 = setTimeout(() => {
              messageIndex++;
              showNextMessage();
            }, 1000);
            
            return () => clearTimeout(timer2);
          }, message.duration);
          
          return () => clearTimeout(timer1);
        }
      };
      
      showNextMessage();
    }
  }, [activeSection, springX, springY, springRotation, springScale, isMobile]);

  return (
    <>
      {/* Fixed Robot that follows scroll and changes based on section */}
      <motion.div 
        className={`fixed ${isMobile ? 'bottom-20 right-5' : 'right-[10%] top-1/2 -translate-y-1/2'} z-30 pointer-events-none`}
        style={{
          x: springX,
          y: springY,
          rotate: springRotation,
          scale: springScale,
          transformOrigin: 'center',
        }}
      >
        <FutureRobot 
          width={isMobile ? 150 : 300} 
          height={isMobile ? 200 : 400} 
          section={activeSection}
          disableMotion={robotMode !== "floating"} 
        />
        
        {/* Robot speech bubble */}
        <AnimatePresence>
          {showMessage && (
            <motion.div 
              className={`absolute ${isMobile ? '-left-32 -top-10' : '-left-64 top-0'} bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 min-w-52 max-w-56`}
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-sm text-white">{currentMessage}</div>
              <div className={`absolute ${isMobile ? 'right-0 bottom-1/2 translate-y-1/2 translate-x-2 border-r-8 border-t-8 border-b-8 border-transparent border-r-white/10' : 'right-0 top-1/2 -translate-y-1/2 translate-x-2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-white/10'}`}></div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Section indicator (only visible on desktop) */}
        {!isMobile && (
          <motion.div 
            className="absolute -left-20 top-1/2 -translate-y-1/2 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="h-px w-16 bg-white/30"></div>
            <span className="text-xs uppercase tracking-widest text-white/60 ml-3">
              {activeSection}
            </span>
          </motion.div>
        )}
      </motion.div>
      
      {/* Section navigation dots */}
      <div className={`fixed right-5 ${isMobile ? 'bottom-5' : 'top-1/2 -translate-y-1/2'} flex ${isMobile ? 'flex-row' : 'flex-col'} gap-4 z-40`}>
        {["home", "about", "work", "contact"].map((section) => (
          <a
            key={section}
            href={`#${section}`}
            className="group"
          >
            <div 
              className={`h-1 w-1 rounded-full transition-ease-out duration-800 ${
                activeSection === section 
                  ? "transparent  scale-125" 
                  : "bg-white border border-white rounded-full scale-100 group-hover:bg-white/50"
              }`}
            />
          </a>
        ))}
      </div>
    </>
  );
} 