"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

      {/* Floating UI Preview */}
      <motion.div
        initial={{ opacity: 0, y: 100, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        style={{ perspective: 1000 }}
        className="w-full max-w-5xl z-10 mx-auto px-4"
      >
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden glass-card border border-white/10 shadow-2xl shadow-red-500/10 flex items-center justify-center">
            {/* Mock Dashboard UI inside the glass card */}
            <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
            
            <div className="w-4/5 h-4/5 rounded-xl border border-white/5 bg-brand-dark/80 flex flex-col overflow-hidden shadow-2xl">
              {/* Fake App header */}
              <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/50" />
                 <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                 <div className="w-3 h-3 rounded-full bg-green-500/50" />
                 <div className="ml-4 h-6 w-48 rounded bg-white/5" />
              </div>
              {/* Fake App Content */}
              <div className="flex-1 p-6 flex gap-6">
                <div className="w-64 h-full rounded-lg bg-white/5 flex items-center justify-center border border-white/5 border-dashed">
                   <div className="text-neutral-500 text-sm flex flex-col items-center gap-2">
                     <span className="w-10 h-10 rounded bg-white/10 mb-2 animate-pulse" />
                     Drop PDF here
                   </div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                   <div className="h-24 w-full rounded-lg bg-red-500/10 border border-red-500/20" />
                   <div className="h-24 w-full rounded-lg bg-brand-primary/10 border border-brand-primary/20" />
                </div>
              </div>
            </div>
            
            <div className="absolute -inset-0.5 bg-linear-to-tr from-red-500/20 via-transparent to-brand-primary/20 rounded-2xl z-[-1] blur-md mix-blend-screen" />
        </div>
      </motion.div>
    </section>
  );
}
