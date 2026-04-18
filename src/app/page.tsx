import Link from "next/link";
import { ParticleBackground } from "@/components/effects/particle-background";
import { GradientMesh } from "@/components/effects/gradient-mesh";
import { NoiseTexture } from "@/components/effects/noise-texture";
import { StructuredData, generateSoftwareSchema } from "@/components/seo/structured-data";

import { HeroSection } from "@/components/landing/hero-section";
import { ToolsSection } from "@/components/landing/tools-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { SocialProofSection } from "@/components/landing/social-proof-section";
import { CtaSection } from "@/components/landing/cta-section";
import { SeoContentSection } from "@/components/seo/seo-content-section";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-brand-dark text-white flex flex-col font-sans overflow-x-hidden selection:bg-purple-500/30 selection:text-white">
      <StructuredData data={generateSoftwareSchema()} />
      {/* 
        ========================================
        GLOBAL CINEMATIC EFFECTS 
        ========================================
      */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleBackground />
        <GradientMesh />
        <NoiseTexture />
      </div>

      {/* 
        ========================================
        LANDING CONTENT (Z-INDEX 10)
        ========================================
      */}
      <main className="flex-1 flex flex-col relative z-10 w-full">
        <HeroSection />
        <ToolsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <SocialProofSection />
        
        {/* Re-using the excellent CTA block from earlier, updating text */}
        <div className="scale-105 origin-top relative mt-20"> 
          <CtaSection />
        </div>
        
        {/* SEO Long-form Keyword Content */}
        <SeoContentSection />
      </main>
    </div>
  );
}
