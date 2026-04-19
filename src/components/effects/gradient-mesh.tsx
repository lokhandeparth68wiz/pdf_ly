"use client";

import { motion } from "framer-motion";

export function GradientMesh({ baseColor, secondaryColor }: { baseColor?: string; secondaryColor?: string } = {}) {
  const primary = baseColor || "rgba(223, 37, 49, 0.8)";
  const secondary = secondaryColor || "rgba(153, 27, 34, 0.6)";
  const tertiary = baseColor ? baseColor.replace("0.8", "0.3") : "rgba(255, 77, 77, 0.3)";

  // Convert hex to rgba if needed
  const hexToRgba = (hex: string, alpha: number) => {
    if (hex.startsWith("rgba")) return hex;
    if (hex.startsWith("rgb")) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const primaryGrad = baseColor ? hexToRgba(baseColor, 0.8) : primary;
  const primaryGradFade = baseColor ? hexToRgba(baseColor, 0) : "rgba(223, 37, 49, 0)";
  const secondaryGrad = secondaryColor ? hexToRgba(secondaryColor, 0.6) : secondary;
  const secondaryGradFade = secondaryColor ? hexToRgba(secondaryColor, 0) : "rgba(153, 27, 34, 0)";
  const tertiaryGrad = baseColor ? hexToRgba(baseColor, 0.3) : tertiary;
  const tertiaryGradFade = baseColor ? hexToRgba(baseColor, 0) : "rgba(255, 77, 77, 0)";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
      {/* Primary Orb */}
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
          background: `radial-gradient(circle, ${primaryGrad} 0%, ${primaryGradFade} 70%)`,
          filter: "blur(60px)",
        }}
      />
      
      {/* Secondary Orb */}
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
          background: `radial-gradient(circle, ${secondaryGrad} 0%, ${secondaryGradFade} 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Tertiary Orb */}
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
          background: `radial-gradient(circle, ${tertiaryGrad} 0%, ${tertiaryGradFade} 70%)`,
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}
