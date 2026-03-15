import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#08080D] border-t border-white/5 pt-20 pb-10 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-red-600 to-brand-primary flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                PDFly
              </span>
            </Link>
            <p className="text-neutral-400 leading-relaxed mb-8">
              The fastest, most secure way to process your documents online. 
              No limits, no installation required.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Legal</h4>
            <ul className="flex flex-col gap-4">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security", "GDPR"].map(link => (
                <li key={link}>
                  <Link href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
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
