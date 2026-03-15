"use client";

import { motion, Variants } from "framer-motion";
import { Play } from "lucide-react";

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
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center z-10">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              NovaMind Engine v2.0 is now live
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter leading-[1.05] mb-8"
          >
            The Future of <br className="hidden md:block" />
            <span className="text-gradient">AI Infrastructure</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Build, deploy, and scale state-of-the-art AI models with unprecedented speed, 
            reliability, and global low-latency infrastructure.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
            <button className="relative group px-8 py-4 rounded-full font-medium text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)] hover:shadow-[0_0_60px_-15px_rgba(139,92,246,0.7)] transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 rounded-full bg-linear-to-r from-purple-600 to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Get Started Free</span>
            </button>
            <button className="px-8 py-4 rounded-full font-medium text-white border border-white/10 hover:bg-white/5 transition-all duration-300 flex items-center gap-2 group hover:border-white/20">
              <Play className="w-4 h-4 fill-white/80 group-hover:fill-white transition-colors" />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-32 pt-10 border-t border-white/5"
        >
          <p className="text-sm text-neutral-500 font-medium mb-8">TRUSTED BY 10,000+ FORWARD-THINKING TEAMS</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-50 grayscale">
            {/* Simple logo placeholders mimicking tech companies */}
            {["Google", "Meta", "OpenAI", "Anthropic", "Microsoft"].map((company) => (
              <span key={company} className="text-xl md:text-2xl font-display font-bold tracking-widest text-white/80">
                {company}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
