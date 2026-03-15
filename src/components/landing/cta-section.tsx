"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative py-40 px-6 z-10 w-full overflow-hidden flex items-center justify-center">
      {/* Background glow specific to CTA */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
             <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            Ready to <span className="text-gradient">Transform</span>
            <br /> Your AI Workflow?
          </h2>
          
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Join thousands of teams shipping robust, scalable AI products 
            10x faster with NovaMind infrastructure.
          </p>
          
          <button className="relative group px-10 py-5 rounded-full font-bold text-lg text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] hover:shadow-[0_0_60px_-15px_rgba(139,92,246,0.8)] transition-all duration-300 hover:scale-105 flex items-center gap-3">
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">Start Building for Free</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Floating elements */}
        <motion.div 
          className="absolute -top-12 -left-20 md:-left-32 w-24 h-24 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center -rotate-12 animate-float"
        >
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
        </motion.div>

        <motion.div 
          className="absolute -bottom-10 -right-16 md:-right-24 w-32 h-20 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center rotate-6 animate-float-reverse shadow-xl"
        >
          <div className="flex flex-col gap-2 w-full px-4">
            <div className="h-2 w-full bg-white/10 rounded-full" />
            <div className="h-2 w-2/3 bg-purple-500/50 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
