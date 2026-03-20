"use client";

import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const policyContent: Record<string, React.ReactNode> = {
  "Privacy Policy": (
    <div className="space-y-6 text-neutral-300">
      <section>
        <h3 className="text-white text-lg font-medium mb-2">1. Information We Collect</h3>
        <p>We only collect information that you voluntarily provide to us when expressing an interest in obtaining information about us or our products and services. All file processing happens locally in your browser when possible.</p>
      </section>
      <section>
        <h3 className="text-white text-lg font-medium mb-2">2. How We Use Your Information</h3>
        <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests.</p>
      </section>
      <section>
        <h3 className="text-white text-lg font-medium mb-2">3. Will Your Information Be Shared With Anyone?</h3>
        <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
      </section>
    </div>
  ),
  "Terms of Service": (
    <div className="space-y-6 text-neutral-300">
      <section>
        <h3 className="text-white text-lg font-medium mb-2">1. Agreement to Terms</h3>
        <p>By viewing or using this website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
      </section>
      <section>
        <h3 className="text-white text-lg font-medium mb-2">2. Use License</h3>
        <p>Permission is granted to temporarily download one copy of the materials on PDFly&apos;s website for personal, non-commercial transitory viewing only.</p>
      </section>
      <section>
        <h3 className="text-white text-lg font-medium mb-2">3. Disclaimer</h3>
        <p>The materials on PDFly&apos;s website are provided on an &apos;as is&apos; basis. PDFly makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
      </section>
    </div>
  ),
  "Cookie Policy": (
    <div className="space-y-6 text-neutral-300">
      <section>
        <h3 className="text-white text-lg font-medium mb-2">What Are Cookies</h3>
        <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience.</p>
      </section>
      <section>
        <h3 className="text-white text-lg font-medium mb-2">How We Use Cookies</h3>
        <p>We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.</p>
      </section>
      <section>
        <h3 className="text-white text-lg font-medium mb-2">Disabling Cookies</h3>
        <p>You can prevent the setting of cookies by adjusting the settings on your browser. Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.</p>
      </section>
    </div>
  ),
  "Security": (
    <div className="space-y-6 text-neutral-300">
      <section>
        <h3 className="text-white text-lg font-medium mb-2">Our Commitment</h3>
        <p>PDFly is built with security as a foundational principle. We understand that your documents are sensitive and need uncompromising protection.</p>
      </section>
      <section>
        <h3 className="text-white text-lg font-medium mb-2">Local Processing</h3>
        <p>Whenever technically possible, we process your PDF files entirely within your web browser. This means your private documents never touch our servers, eliminating the risk of cloud data breaches.</p>
      </section>
      <section>
        <h3 className="text-white text-lg font-medium mb-2">Encryption in Transit</h3>
        <p>When server processing is required for complex operations, all file transfers are secured using industry-standard TLS 1.3 encryption. Files are immediately deleted from our servers after processing is complete.</p>
      </section>
    </div>
  ),
  "GDPR": (
    <div className="space-y-6 text-neutral-300">
      <section>
        <h3 className="text-white text-lg font-medium mb-2">Data Subject Rights</h3>
        <p>Under the General Data Protection Regulation (GDPR), if you are a resident of the European Economic Area (EEA), you have certain data protection rights. PDFly aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.</p>
      </section>
      <section>
        <h3 className="text-white text-lg font-medium mb-2">Your Rights Include:</h3>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>The right to access, update or to delete the information we have on you.</li>
          <li>The right of rectification.</li>
          <li>The right to object.</li>
          <li>The right of restriction.</li>
          <li>The right to data portability.</li>
          <li>The right to withdraw consent.</li>
        </ul>
      </section>
      <section>
        <p>If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.</p>
      </section>
    </div>
  )
};

type PolicyKey = keyof typeof policyContent;

export function Footer() {
  const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null);

  return (
    <footer className="w-full relative z-10">
      {/* Policy Modal */}
      <AnimatePresence>
        {activePolicy && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePolicy(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-xl font-display font-semibold text-white">
                  {activePolicy}
                </h2>
                <button
                  onClick={() => setActivePolicy(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto leading-relaxed">
                {policyContent[activePolicy]}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
            {Object.keys(policyContent).map(link => (
              <button 
                key={link} 
                onClick={() => setActivePolicy(link as PolicyKey)}
                className="text-neutral-400 hover:text-white transition-colors text-sm font-medium cursor-pointer"
              >
                {link}
              </button>
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
