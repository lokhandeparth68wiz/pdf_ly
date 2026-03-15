"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative py-40 px-6 z-10 w-full overflow-hidden flex items-center justify-center">
      {/* Background glow specific to CTA */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-linear-to-tr from-brand-primary/20 to-red-600/20 rounded-full blur-[100px]"
        />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-red-600 to-brand-primary flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(223,37,49,0.3)]">
             <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            Ready to <span className="text-gradient">Transform</span>
            <br /> Your Document Workflow?
          </h2>
          
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Join thousands of professionals securing their document workflows. 
          No credit card required.
        </p>
          
        <button className="relative px-10 py-5 rounded-full font-bold text-lg text-white shadow-[0_0_40px_-10px_rgba(223,37,49,0.7)] hover:shadow-[0_0_60px_-10px_rgba(223,37,49,0.9)] transition-all duration-300 hover:scale-105 group">
           <div className="absolute inset-0 rounded-full bg-brand-primary opacity-90 group-hover:opacity-100 transition-opacity" />
           <span className="relative z-10">Start Using PDFly Free</span>
           <ArrowRight className="w-5 h-5 relative z-10 inline-block ml-3 group-hover:translate-x-1 transition-transform" />
        </button>
        </motion.div>
      </div>
    </section>
  );
}
