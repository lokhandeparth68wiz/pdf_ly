"use client";

import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      }
    );
  }, []);

  const plans = [
    {
      name: "Starter",
      description: "For individuals exploring AI",
      monthlyPrice: "0",
      annualPrice: "0",
      features: ["1,000 API calls/mo", "1 Custom Model", "Community Support", "Basic Analytics"],
      buttonText: "Start Free",
      isPopular: false,
    },
    {
      name: "Pro",
      description: "For teams building production AI apps",
      monthlyPrice: "49",
      annualPrice: "39",
      features: ["50,000 API calls/mo", "10 Custom Models", "Priority Support", "Advanced Analytics", "Custom Domains", "Team Collaboration"],
      buttonText: "Get Started",
      isPopular: true,
    },
    {
      name: "Enterprise",
      description: "Custom infrastructure for large scale",
      monthlyPrice: "Custom",
      annualPrice: "Custom",
      features: ["Unlimited API calls", "Unlimited Models", "24/7 Phone Support", "Custom SLAs", "Dedicated Infrastructure", "SSO & SAML"],
      buttonText: "Contact Sales",
      isPopular: false,
    }
  ];

  return (
    <section ref={sectionRef} id="pricing" className="relative py-32 px-6 z-10 w-full">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Simple, <span className="text-gradient">transparent pricing</span>
          </h2>
          
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-neutral-400'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 rounded-full bg-[#1A1A24] border border-white/10 transition-colors p-1"
            >
              <motion.div 
                layout
                className="w-5 h-5 rounded-full bg-purple-500 shadow-md"
                animate={{ x: isAnnual ? 26 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-neutral-400'}`}>
              Annual <span className="text-purple-400 ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 items-center">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`relative rounded-3xl ${plan.isPopular ? 'glowing-border p-px transform md:-translate-y-4' : ''}`}
            >
              <div className={`h-full flex flex-col p-8 rounded-[inherit] ${plan.isPopular ? 'bg-[#0f0f16]' : 'glass-card border-white/5'}`}>
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-linear-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-xl font-display font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-neutral-400 mb-6 h-10">{plan.description}</p>
                
                <div className="mb-8 flex items-end gap-2">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={isAnnual ? 'annual' : 'monthly'}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      className="text-4xl font-display font-bold text-white"
                    >
                      {plan.monthlyPrice === 'Custom' ? 'Custom' : `$${isAnnual ? plan.annualPrice : plan.monthlyPrice}`}
                    </motion.span>
                  </AnimatePresence>
                  {plan.monthlyPrice !== 'Custom' && <span className="text-neutral-500 font-medium pb-1">/mo</span>}
                </div>
                
                <button 
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 mb-8 ${
                    plan.isPopular 
                      ? 'bg-white text-black hover:bg-neutral-200' 
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {plan.buttonText}
                </button>
                
                <div className="flex flex-col gap-4 mt-auto">
                  {plan.features.map(feature => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-purple-400" />
                      </div>
                      <span className="text-sm text-neutral-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
