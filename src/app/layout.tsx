import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pdf-ly.vercel.app'),
  title: {
    default: "PDFly | Fast & Secure Free Online PDF Tools",
    template: "%s | PDFly",
  },
  description: "Merge, compress, edit, and convert your PDF files online for free. Secure, fast, and no installation required. The ultimate PDF advantage.",
  keywords: ["merge pdf", "compress pdf", "pdf to docx", "docx to pdf", "edit pdf online", "free pdf tools", "pdf utility", "pdf converter"],
  authors: [{ name: "PDFly" }],
  creator: "PDFly",
  publisher: "PDFly",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "PDFly | Fast & Secure Free Online PDF Tools",
    description: "Merge, compress, edit, and convert your PDF files online for free. Secure, fast, and no installation required.",
    url: "https://pdf-ly.vercel.app",
    siteName: "PDFly",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFly | Fast & Secure Free Online PDF Tools",
    description: "Merge, compress, edit, and convert your PDF files online for free.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-black text-neutral-100 selection:bg-white/20 selection:text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
