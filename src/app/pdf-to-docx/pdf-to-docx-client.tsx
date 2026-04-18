"use client";

import { useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import { FileDropzone } from "@/components/file-dropzone";

export default function PdfToDocxClient({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesDropped = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setConvertedUrl(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    try {
      setIsConverting(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetFormat", "docx");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/convert`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to convert PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);
    } catch (error: unknown) {
      console.error("Conversion error:", error);
      setError(error instanceof Error ? error.message : "An error occurred during conversion.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className={hideHeader ? "w-full" : "container mx-auto px-4 py-12 max-w-4xl"}>
      {!hideHeader && (
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
              <FileText className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            PDF to Word (DOCX)
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Convert your PDF files to editable Word documents instantly.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {!file && (
          <FileDropzone
            onFilesDropped={handleFilesDropped}
            accept={{ "application/pdf": [".pdf"] }}
            multiple={false}
            theme="purple"
            description="Supported formats: PDF. Up to 100MB per file."
          />
        )}

        {error && (
          <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-center">
            {error}
          </div>
        )}

        {file && !convertedUrl && (
          <div className="rounded-2xl p-6 md:p-8 glass-card border border-white/10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <FileText className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white truncate max-w-sm">
                    {file.name}
                  </h3>
                  <p className="text-neutral-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => { setFile(null); setError(null); }}
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Change file
              </button>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleConvert}
                disabled={isConverting}
                className="flex flex-1 md:flex-none items-center justify-center px-10 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-medium rounded-xl shadow-lg transition-all"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  "Convert to DOCX"
                )}
              </button>
            </div>
          </div>
        )}

        {convertedUrl && (
          <div className="rounded-2xl p-10 text-center glass-card border border-white/10">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                <span className="text-2xl font-bold text-green-400">✓</span>
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">
               Conversion Successful!
             </h2>
             <p className="text-neutral-400 mb-8 max-w-md mx-auto">
               Your Word document is ready. Download it below.
             </p>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setFile(null);
                    setConvertedUrl(null);
                    setError(null);
                  }}
                  className="px-6 py-3 font-medium text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors w-full sm:w-auto"
                >
                  Convert another file
                </button>
                <a
                  href={convertedUrl}
                  download={`converted-${file!.name.replace(".pdf", ".docx")}`}
                  className="flex items-center justify-center px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl shadow-lg transition-all w-full sm:w-auto"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download DOCX
                </a>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
