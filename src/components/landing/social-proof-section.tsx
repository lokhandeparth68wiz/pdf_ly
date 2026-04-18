"use client";

import { motion } from "framer-motion";

export function SocialProofSection() {
  return (
    <section className="py-24 px-6 z-10 w-full flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-pink-900/10 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
        >
          <p className="text-xl md:text-3xl font-display font-medium text-white mb-10 leading-relaxed">
            "Trusted by <span className="text-pink-500 font-bold">12,500+ professionals</span> worldwide to securely handle millions of sensitive documents every single day."
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <div className="flex -space-x-4">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="w-12 h-12 rounded-full glass-card flex items-center justify-center overflow-hidden">
                    {/* Dummy avatar gradient source */}
                    <div className={`w-full h-full bg-linear-to-br from-pink-${i}00 to-rose-${i}00 opacity-50`} />
                 </div>
               ))}
            </div>
            <div className="pl-4 border-l border-white/10 ml-2 text-left">
              <div className="flex gap-1 text-amber-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-sm text-neutral-400 font-medium">4.9/5 Average Rating</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
