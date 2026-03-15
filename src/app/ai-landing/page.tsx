import { ParticleBackground } from "./components/particle-background";
import { GradientMesh } from "./components/gradient-mesh";
import { NoiseTexture } from "./components/noise-texture";
import { Navbar } from "./components/navbar";
import { HeroSection } from "./components/hero-section";
import { FeaturesSection } from "./components/features-section";
import { PricingSection } from "./components/pricing-section";
import { CtaSection } from "./components/cta-section";
import { Footer } from "./components/footer";

export default function AILandingPage() {
  return (
    <main className="w-full relative min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      {/* Absolute Background Layers */}
      <ParticleBackground />
      <GradientMesh />
      <NoiseTexture />
      
      {/* Fixed Navigation */}
      <Navbar />

      {/* Page Content Layers */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CtaSection />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
