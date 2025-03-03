"use client";

import { useState, useEffect } from "react";

// Function to randomize text for a cool decryption effect
export default function useDecryptEffect(originalText = "Lukwiya Bonnie", duration = 1500) {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const textLength = originalText.length;
    let interval;
    
    // Calculate iterations based on duration
    const iterations = 10;
    const iterationTime = duration / iterations;
    
    // Start with random characters
    let currentText = Array(textLength).fill().map(() => 
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
    
    setDisplayText(currentText);
    
    let currentIteration = 0;
    
    // Replace characters gradually to reveal original text
    interval = setInterval(() => {
      currentIteration++;
      
      // Calculate how many characters to replace in this iteration
      const charsToReplace = Math.ceil((currentIteration / iterations) * textLength);
      
      // Create new text with some correct characters
      currentText = currentText.split('').map((char, index) => {
        if (index < charsToReplace) {
          return originalText[index];
        }
        return characters.charAt(Math.floor(Math.random() * characters.length));
      }).join("");
      
      setDisplayText(currentText);
      
      // Complete when all iterations are done
      if (currentIteration >= iterations) {
        clearInterval(interval);
        setDisplayText(originalText);
      }
    }, iterationTime);
    
    return () => clearInterval(interval);
  }, [originalText, duration]);
  
  return displayText;
}
