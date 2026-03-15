"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b-0">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-md border border-white/20">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            PDFly
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/merge" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            Merge
          </Link>
          <Link href="/compress" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            Compress
          </Link>
          <Link href="/edit" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            Edit
          </Link>
        </div>
      </div>
    </nav>
  );
}
