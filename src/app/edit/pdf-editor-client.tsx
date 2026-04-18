"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const PdfEditorComponent = dynamic(() => import("./pdf-editor-component"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
      <p className="text-neutral-500 font-medium">Loading Document Editor...</p>
    </div>
  ),
});

export default function PdfEditorClient({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  return <PdfEditorComponent hideHeader={hideHeader} />;
}

