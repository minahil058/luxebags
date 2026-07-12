"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export const BackgroundTexture = () => {
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

  // Parallax transform for the grid
  const gridX = useTransform(mouseX, [-500, 500], [-20, 20]);
  const gridY = useTransform(mouseY, [-500, 500], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set(clientX - centerX);
    y.set(clientY - centerY);
  };

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      {/* Animated Grid Pattern with Parallax */}
      <motion.div 
        style={{ x: gridX, y: gridY }}
        className="absolute inset-[-5%] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"
      />
      
      {/* Soft Spotlights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-white/[0.01] blur-[150px] rounded-full" />

      {/* Moving Light Beams */}
      {isMounted && [...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -1200],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 25,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 15,
          }}
          className="absolute h-[1px] w-[400px] bg-gradient-to-r from-transparent via-white/5 to-transparent"
          style={{
            left: `${Math.random() * 100}%`,
            top: "120%",
            transform: `rotate(${Math.random() * 40 - 20}deg)`,
          }}
        />
      ))}

      {/* Static Faint Lines for Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px)] bg-[size:200px] opacity-20" />
    </div>
  );
};
