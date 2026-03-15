"use client";

import Link from "next/link";
import { CopyPlus, FileEdit, FileArchive, FileType2, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const tools = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDFs into one unified document.",
    icon: <CopyPlus className="h-8 w-8 text-blue-400" />,
    href: "/merge",
    color: "bg-blue-500/10",
  },
  {
    title: "Edit PDF",
    description: "Add text, shapes, images, and freehand annotations.",
    icon: <FileEdit className="h-8 w-8 text-emerald-400" />,
    href: "/edit",
    color: "bg-emerald-500/10",
  },
  {
    title: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    icon: <FileArchive className="h-8 w-8 text-amber-400" />,
    href: "/compress",
    color: "bg-amber-500/10",
  },
  {
    title: "PDF to DOCX",
    description: "Convert PDFs to editable Word documents easily.",
    icon: <FileText className="h-8 w-8 text-purple-400" />,
    href: "/pdf-to-docx",
    color: "bg-purple-500/10",
  },
  {
    title: "DOCX to PDF",
    description: "Make DOCX files easy to read by converting them to PDF.",
    icon: <FileType2 className="h-8 w-8 text-rose-400" />,
    href: "/docx-to-pdf",
    color: "bg-rose-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 md:px-8 relative overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <div className="text-center max-w-4xl mb-20 relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-md mb-8"
        >
           <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
           <span className="text-sm font-medium text-neutral-300 tracking-wide uppercase">The Future of PDF Utilities</span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="text-gradient">Every tool you need</span><br/> to work with PDFs
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-neutral-400 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          PDFly provides the sleekest and most powerful ways to merge, edit, compress, and convert your documents securely inside your browser.
        </motion.p>
      </div>

      {/* Tools Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {tools.map((tool) => (
          <Link key={tool.title} href={tool.href}>
            <motion.div
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              className="flex flex-col h-full p-8 rounded-3xl glass-panel glow-card group"
            >
              <div className={`w-16 h-16 rounded-2xl ${tool.color} flex items-center justify-center mb-8 border border-white/5 group-hover:bg-white/10 transition-colors`}>
                {tool.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white group-hover:text-neutral-200 transition-colors">
                {tool.title}
              </h3>
              <p className="text-neutral-400 flex-1 leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-8 flex items-center text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                Launch tool <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
