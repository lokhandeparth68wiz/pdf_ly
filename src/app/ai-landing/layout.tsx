import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NovaMind | The Future of AI Infrastructure",
  description: "Build, deploy, and scale AI models with unprecedented speed and reliability.",
};

export default function AILandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${spaceGrotesk.variable} ${inter.variable} min-h-screen bg-[#0A0A0F] text-white flex flex-col selection:bg-purple-500/30 selection:text-white font-sans antialiased overflow-x-hidden`}>
      {children}
    </div>
  );
}
