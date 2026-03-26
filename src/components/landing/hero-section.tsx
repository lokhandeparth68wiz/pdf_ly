"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    },
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center z-10 w-full mt-10">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter leading-[1.05] mb-8"
          >
            Powerful PDF Tools. <br className="hidden md:block" />
            <span className="text-gradient">Lightning Fast.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Merge, compress, edit, and convert your PDFs in seconds. 
            No software installation required. Secure, private, and instant.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-20">
            <Link href="#tools" className="relative group px-8 py-4 rounded-full font-medium text-white shadow-[0_0_40px_-10px_rgba(223,37,49,0.5)] hover:shadow-[0_0_60px_-15px_rgba(223,37,49,0.7)] transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <div className="absolute inset-0 rounded-full bg-linear-to-r from-brand-primary to-red-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Start Using PDFly</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link href="#how-it-works" className="px-8 py-4 rounded-full font-medium text-white border border-white/10 hover:bg-white/5 transition-all duration-300 flex items-center gap-2 group hover:border-white/20">
              <PlayCircle className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
              See How It Works
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
