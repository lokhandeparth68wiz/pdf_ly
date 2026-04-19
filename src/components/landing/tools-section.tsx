"use client";

import { useRef, useEffect } from "react";
import { CopyPlus, FileEdit, FileArchive, FileText, FileType2, ArrowRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const tools = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDFs into one unified document instantly.",
    icon: <CopyPlus className="h-8 w-8 text-red-400 group-hover:text-red-300 transition-colors" />,
    href: "/merge",
    gradient: "from-red-600 to-brand-primary",
  },
  {
    title: "Edit PDF",
    description: "Add text, shapes, images, and freehand annotations securely.",
    icon: <FileEdit className="h-8 w-8 text-rose-400 group-hover:text-rose-300 transition-colors" />,
    href: "/edit",
    gradient: "from-rose-600 to-red-500",
  },
  {
    title: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    icon: <FileArchive className="h-8 w-8 text-amber-500 group-hover:text-amber-400 transition-colors" />,
    href: "/compress",
    gradient: "from-brand-primary to-orange-500",
  },
  {
    title: "PDF to DOCX",
    description: "Convert PDFs to editable Word documents with high accuracy.",
    icon: <FileText className="h-8 w-8 text-red-500 group-hover:text-red-400 transition-colors" />,
    href: "/pdf-to-docx",
    gradient: "from-red-600 to-rose-500",
  },
  {
    title: "DOCX to PDF",
    description: "Make DOCX files easy to read by converting them to PDF.",
    icon: <FileType2 className="h-8 w-8 text-rose-500 group-hover:text-rose-400 transition-colors" />,
    href: "/docx-to-pdf",
    gradient: "from-rose-600 to-red-600",
  },
];

export function ToolsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current) return;

    gsap.fromTo(
      cardsRef.current,
      { y: 50, opacity: 0, scale: 0.95 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        }
      }
    );

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <section ref={sectionRef} id="tools" className="relative py-32 px-6 z-10 w-full min-h-screen flex items-center justify-center pointer-events-none">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            All Your Tools in <span className="text-gradient">One Platform</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Everything you need for perfect documents, processed locally where possible for maximum speed and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <Link 
              key={tool.title} 
              href={tool.href}
              ref={el => { cardsRef.current[idx] = el; }}
              className="group relative block rounded-3xl p-px outline-none"
            >
              {/* Animated Conic Gradient Border on Hover */}
              <div className="absolute inset-0 rounded-3xl bg-transparent transition-all duration-500 opacity-0 group-hover:opacity-100 -z-10 group-hover:glowing-border" />
              
              <div className="relative h-full glass-card rounded-[inherit] p-8 transition-all duration-500 group-hover:bg-[#12121A]/90 overflow-hidden flex flex-col justify-between group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                {/* Background soft glow based on tool color */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-linear-to-br ${tool.gradient} rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 border-t-white/20 backdrop-blur-md shadow-[inset_0_0_15px_rgba(255,255,255,0.05),0_8px_20px_rgba(0,0,0,0.5)] flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10">
                    {tool.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neutral-200 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed mb-8 flex-1">
                    {tool.description}
                  </p>
                </div>

                <div className="relative z-10 flex items-center text-sm font-semibold text-white/50 group-hover:text-white transition-all duration-300">
                  <span className="group-hover:mr-2 transition-all">Launch Tool</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
