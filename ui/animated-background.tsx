import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

export const AnimatedBackground = ({ 
  particleCount = 100, 
  backgroundColor = "bg-slate-900", 
  particleColor = "bg-white" 
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleResize = useCallback(() => {
    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  useEffect(() => {
    // Initial dimension set
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Generate particles with more varied movement
  const generateParticleVariants = () => {
    return {
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      scale: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      transition: {
        duration: Math.random() * 20 + 10,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut"
      }
    };
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${backgroundColor}`}>
      {/* Gradient overlay */}
      <div 
        className={`absolute inset-0 w-full h-full ${backgroundColor} z-20 
        [mask-image:radial-gradient(transparent,white)] pointer-events-none`} 
      />

      {/* Animated particles */}
      {[...Array(particleCount)].map((_, i) => {
        const initialVariants = generateParticleVariants();
        return (
          <motion.span
            key={i}
            className={`fixed top-0 left-0 w-1 h-1 ${particleColor} rounded-full`}
            initial={initialVariants}
            animate={{
              x: [initialVariants.x, Math.random() * dimensions.width],
              y: [initialVariants.y, Math.random() * dimensions.height],
              opacity: [initialVariants.opacity, Math.random() * 0.5 + 0.2],
              transition: initialVariants.transition
            }}
            style={{
              opacity: initialVariants.opacity
            }}
          />
        );
      })}
    </div>
  );
};