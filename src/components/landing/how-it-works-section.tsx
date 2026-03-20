"use client";

import { useEffect, useRef } from "react";
import { Upload, Settings2, DownloadCloud } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
      }
    });

    // Reveal steps one by one
    stepsRef.current.forEach((step, idx) => {
      tl.fromTo(step, 
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      );
      
      // Reveal connecting line after step (except last)
      if (idx < linesRef.current.length && linesRef.current[idx]) {
        tl.fromTo(linesRef.current[idx],
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.4, ease: "power1.inOut" }
        , "-=0.2");
      }
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const steps = [
    {
      title: "Upload File",
      description: "Drag & drop your PDF directly into the browser.",
      icon: <Upload className="w-8 h-8 text-red-500" />
    },
    {
      title: "Choose Tool",
      description: "Select merge, compress, edit, or convert options.",
      icon: <Settings2 className="w-8 h-8 text-brand-primary" />
    },
    {
      title: "Download Instantly",
      description: "Get your processed file in seconds securely.",
      icon: <DownloadCloud className="w-8 h-8 text-rose-500" />
    }
  ];

  return (
    <section ref={sectionRef} id="how-it-works" className="relative py-32 px-6 z-10 w-full overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-20 text-white">
          <span className="text-gradient">3 Simple</span> Steps
        </h2>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex-1 flex flex-col items-center z-10 w-full">
              
              <div 
                ref={el => { stepsRef.current[idx] = el; }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center mb-6 relative group overflow-hidden shadow-[0_15px_35px_-10px_rgba(223,37,49,0.2)]">
                  <div className="absolute inset-0 rounded-full bg-linear-to-b from-white/10 to-transparent group-hover:scale-110 transition-transform duration-500" />
                  {step.icon}
                  
                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-primary text-white font-bold flex items-center justify-center border-4 border-[#0A0A0F]">
                    {idx + 1}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-neutral-400 text-sm max-w-[200px]">{step.description}</p>
              </div>

              {/* Connecting Line (Desktop) */}
              {idx < steps.length - 1 && (
                <div 
                  ref={el => { linesRef.current[idx] = el; }}
                  className="hidden md:block absolute top-[48px] left-[60%] w-[80%] h-[2px] bg-linear-to-r from-red-500/50 to-brand-primary/50 -z-10" 
                >
                  {/* Moving dot on line */}
                  <div className="w-full h-full relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1/4 h-full bg-linear-to-r from-transparent via-white to-transparent animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </section>
  );
}
