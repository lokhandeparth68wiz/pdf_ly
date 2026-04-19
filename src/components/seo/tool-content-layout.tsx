import Link from "next/link";

import { ParticleBackground } from "@/components/effects/particle-background";
import { GradientMesh } from "@/components/effects/gradient-mesh";
import { NoiseTexture } from "@/components/effects/noise-texture";
import { StructuredData, generateSoftwareSchema, generateFaqSchema, generateHowToSchema } from "@/components/seo/structured-data";
import { UploadCloud } from "lucide-react";

type FAQ = { question: string; answer: string };
type Step = { name: string; text: string };

interface ToolContentLayoutProps {
  toolName: string;
  heroTitle: string;
  heroDescription: string;
  actionButtonText: string;
  faqs: FAQ[];
  steps: Step[];
  seoContentBlocks: { title: string; content: string }[];
  toolUrl: string;
  children?: React.ReactNode;
  accentColor?: string;
  accentColorSecondary?: string;
}

export function ToolContentLayout({
  toolName,
  heroTitle,
  heroDescription,
  actionButtonText,
  faqs,
  steps,
  seoContentBlocks,
  toolUrl,
  children,
  accentColor,
  accentColorSecondary
}: ToolContentLayoutProps) {
  return (
    <div className="relative w-full min-h-screen bg-brand-dark text-white flex flex-col font-sans overflow-x-hidden selection:bg-brand-primary/30 selection:text-white">
      {/* Schemas */}
      <StructuredData data={generateSoftwareSchema()} />
      <StructuredData data={generateFaqSchema(faqs)} />
      <StructuredData data={generateHowToSchema(`How to use ${toolName}`, `Step by step guide on how to use ${toolName} on PDFly`, steps)} />

      {/* Global Cinematic Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleBackground {...(accentColor ? { baseColor: accentColor, secondaryColor: accentColorSecondary || accentColor } : {})} />
        <GradientMesh {...(accentColor ? { baseColor: accentColor, secondaryColor: accentColorSecondary || accentColor } : {})} />
        <NoiseTexture />
      </div>



      <main className="flex-1 flex flex-col relative z-10 w-full pt-32 pb-24 px-6 max-w-5xl mx-auto">
        
        {/* Tool Hero */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter mb-6">
            {heroTitle}
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {heroDescription}
          </p>
          
          {/* Interactive Upload/Action Area */}
          {children ? (
            <div className="w-full max-w-3xl mx-auto">
              {children}
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto aspect-video rounded-2xl glass-card border border-white/10 shadow-2xl flex flex-col items-center justify-center p-8 mb-8 bg-black/40 backdrop-blur-md">
                <div className="flex flex-col items-center justify-center gap-4 text-neutral-400">
                  <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 border-dashed animate-pulse flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8 text-neutral-500" />
                  </div>
                  <p>Drag and drop your PDF here</p>
                  <Link 
                    href={toolUrl} 
                    className={`px-8 py-4 rounded-full font-medium text-white transition-all ${!accentColor ? 'bg-brand-primary shadow-[0_0_30px_-10px_rgba(223,37,49,0.5)] hover:shadow-[0_0_50px_-10px_rgba(223,37,49,0.8)]' : ''}`}
                    style={accentColor ? { backgroundColor: accentColor, boxShadow: `0 0 30px -10px ${accentColor}80` } : undefined}
                  >
                    {actionButtonText}
                  </Link>
                </div>
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="mb-24">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">How to {toolName}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-4 ${!accentColor ? 'bg-brand-primary/20 text-brand-primary' : ''}`}
                  style={accentColor ? { backgroundColor: `${accentColor}20`, color: accentColor } : undefined}
                >
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.name}</h3>
                <p className="text-neutral-400 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Long-form Content Section */}
        <section className="mb-24 prose prose-invert prose-p:text-neutral-400 prose-headings:font-display max-w-none">
          {seoContentBlocks.map((block, idx) => (
            <div key={idx} className="mb-12">
              <h2 className="text-3xl font-bold mb-4">{block.title}</h2>
              <div 
                className="text-lg leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: block.content }} 
              />
            </div>
          ))}
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                <p className="text-neutral-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal Cross-Linking Section */}
        <section className="mt-12 pt-12 border-t border-white/10">
          <h3 className="text-2xl font-display font-bold mb-6 text-center">More Free PDF Tools</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/merge-pdf" className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">Merge PDF</Link>
            <Link href="/compress-pdf" className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">Compress PDF</Link>
            <Link href="/pdf-to-docx" className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">PDF to Word</Link>
            <Link href="/docx-to-pdf" className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">Word to PDF</Link>
            <Link href="/edit-pdf" className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">Edit PDF</Link>
          </div>
        </section>

      </main>

    </div>
  );
}
