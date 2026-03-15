"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/ai-landing" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-purple-400 transition-colors">
            NovaMind
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {["Product", "Solutions", "Pricing", "Docs"].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/signin"
            className="hidden md:block text-sm font-medium text-neutral-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="glowing-border group relative px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
          >
            <div className="absolute inset-px bg-[#12121A] rounded-full z-0 transition-colors group-hover:bg-[#1a1a24]" />
            <span className="relative z-10 flex items-center gap-2">
              Get Started
            </span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
