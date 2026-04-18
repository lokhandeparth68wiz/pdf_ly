"use client";

import { motion } from "framer-motion";

export function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
      {/* Primary Pink Orb */}
      <motion.div
        animate={{
          x: ["0%", "10%", "-10%", "0%"],
          y: ["0%", "-10%", "10%", "0%"],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255, 20, 147, 0.8) 0%, rgba(255, 20, 147, 0) 70%)",
          filter: "blur(60px)",
        }}
      />
      
      {/* Secondary Deep Pink Orb */}
      <motion.div
        animate={{
          x: ["0%", "-15%", "15%", "0%"],
          y: ["0%", "15%", "-15%", "0%"],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/3 right-1/4 w-[35vw] h-[35vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(199, 21, 133, 0.6) 0%, rgba(199, 21, 133, 0) 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Tertiary Hot Pink Orb */}
      <motion.div
        animate={{
          x: ["0%", "20%", "-20%", "0%"],
          y: ["0%", "-20%", "20%", "0%"],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-1/4 left-1/3 w-[45vw] h-[45vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255, 105, 180, 0.3) 0%, rgba(255, 105, 180, 0) 70%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}
