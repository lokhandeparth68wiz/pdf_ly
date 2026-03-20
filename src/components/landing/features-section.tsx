"use client";

import { useEffect, useRef } from "react";
import { Zap, ShieldCheck, Download, MonitorSmartphone, EyeOff } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    gsap.fromTo(
      listRef.current,
      { x: -50, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.6,
        stagger: 0.15, ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const features = [
    { title: "Lightning Fast Processing", desc: "Operations complete in milliseconds thanks to optimized local processing.", icon: Zap },
    { title: "Secure File Handling", desc: "Files never leave your device for maximum privacy.", icon: ShieldCheck },
    { title: "No Installation Required", desc: "Everything happens directly in your browser. Just open and use.", icon: Download },
    { title: "Works on Any Device", desc: "Fully responsive utilities across Desktop, Tablet, and Mobile.", icon: MonitorSmartphone },
    { title: "Automatic File Deletion", desc: "Strict privacy safeguards mean files disappear instantly after processing.", icon: EyeOff },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 z-10 w-full bg-black/40 backdrop-blur-md border-y border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1 text-left">
           <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
             The ultimate <br/><span className="text-gradient">PDF advantage.</span>
           </h2>
           <p className="text-lg text-neutral-400 mb-8 max-w-md">
             PDFly was built from the ground up to solve the most painful parts of managing documents.
           </p>
        </div>
        
        <div className="flex-1 flex flex-col gap-6">
          {features.map((feat, idx) => (
            <div 
              key={idx}
              ref={el => { listRef.current[idx] = el; }}
              className="flex items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-red-500/20 to-brand-dark/50 border border-white/10 border-t-white/20 backdrop-blur-xl flex items-center justify-center shrink-0 group-hover:bg-red-500/30 group-hover:shadow-[0_8px_32px_rgba(223,37,49,0.25)] transition-all shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]">
                 <feat.icon className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">{feat.title}</h4>
                <p className="text-neutral-400 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
