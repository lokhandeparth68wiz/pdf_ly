"use client";

import { useEffect, useRef } from "react";
import { Cpu, Zap, Layers, GitBranch, Users, Shield } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current) return;

    // Staggered reveal for cards
    gsap.fromTo(
      cardsRef.current,
      { 
        y: 100, 
        opacity: 0,
        scale: 0.95
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const features = [
    {
      title: "Lightning Fast Training",
      description: "Distributed GPU clusters enable model training up to 10x faster than traditional infrastructure.",
      icon: <Cpu className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />,
      colSpan: "md:col-span-2",
    },
    {
      title: "Real-time Inference",
      description: "Achieve sub-millisecond global latency via our edge network.",
      icon: <Zap className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />,
      colSpan: "md:col-span-1",
    },
    {
      title: "Auto-Scaling",
      description: "Scale seamlessly from 0 to 1M requests per second instantly.",
      icon: <Layers className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />,
      colSpan: "md:col-span-1",
    },
    {
      title: "Model Versioning",
      description: "Git backend but built specifically for massive neural networks.",
      icon: <GitBranch className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />,
      colSpan: "md:col-span-1",
    },
    {
      title: "Team Collaboration",
      description: "Shared workspaces with granular permissions and audit logs.",
      icon: <Users className="w-6 h-6 text-pink-400 group-hover:text-pink-300 transition-colors" />,
      colSpan: "md:col-span-2",
    },
    {
      title: "Enterprise Security",
      description: "SOC2 compliant with end-to-end encryption to protect IP.",
      icon: <Shield className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />,
      colSpan: "md:col-span-1",
    },
  ];

  return (
    <section ref={sectionRef} id="product" className="relative py-32 px-6 z-10 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            <span className="text-gradient">Supercharged </span>
            <span className="text-white">AI Development</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Everything you need to build the next generation of AI applications,
            unified in a single premium platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {features.map((feature, idx) => (
            <div
              key={idx}
              ref={el => { cardsRef.current[idx] = el; }}
              className={`group glass-card rounded-2xl p-8 relative overflow-hidden transition-all duration-500 hover:border-purple-500/30 hover:bg-[#12121A]/80 flex flex-col justify-between ${feature.colSpan}`}
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Subtle hover glow following mouse could go here, omitting for simplicity */}
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner group-hover:bg-white/10 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-display font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
