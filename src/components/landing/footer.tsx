import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full relative z-10">
      {/* Translucent glass background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md border-t border-white/5" />
      
      <div className="max-w-7xl mx-auto relative pt-16 pb-8 px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-red-600 to-brand-primary flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                PDFly
              </span>
            </Link>
            <p className="text-neutral-400 leading-relaxed text-sm">
              The fastest, most secure way to process your documents online. 
              No limits, no installation required.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security", "GDPR"].map(link => (
              <Link key={link} href="#" className="text-neutral-400 hover:text-white transition-colors text-sm font-medium">
                {link}
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} PDFly. All rights reserved.
          </p>
          <p className="text-neutral-500 text-sm flex items-center gap-1">
            Built with <span className="text-brand-primary">♥</span> for document workflows
          </p>
        </div>
      </div>
    </footer>
  );
}
