import Link from "next/link";
import { Sparkles, Twitter, Github, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#08080D] border-t border-white/5 pt-20 pb-10 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          <div className="col-span-1 lg:col-span-2">
            <Link href="/ai-landing" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                NovaMind
              </span>
            </Link>
            <p className="text-neutral-400 max-w-sm mb-8">
              Empowering the next generation of builders with hyper-scalable AI infrastructure. 
              Build, deploy, and scale faster than ever before.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Github, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" 
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-brand-primary hover:bg-brand-primary/10 transition-colors"
                  ><Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Product</h4>
            <ul className="flex flex-col gap-4">
              {["Features", "Integrations", "Pricing", "Changelog", "Documentation"].map(link => (
                <li key={link}>
                  <Link href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="flex flex-col gap-4">
              {["About Us", "Careers", "Blog", "Contact Sales", "Partners"].map(link => (
                <li key={link}>
                  <Link href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
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
            © {new Date().getFullYear()} NovaMind Inc. All rights reserved.
          </p>
          <p className="text-neutral-500 text-sm flex items-center gap-1">
            Built with <span className="text-red-500">♥</span> by NovaMind
          </p>
        </div>
      </div>
    </footer>
  );
}
