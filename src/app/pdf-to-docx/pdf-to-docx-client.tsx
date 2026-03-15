"use client";

import { useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import { FileDropzone } from "@/components/file-dropzone";

export default function PdfToDocxClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);

  const handleFilesDropped = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setConvertedUrl(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    try {
      setIsConverting(true);
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
      alert(error instanceof Error ? error.message : "An error occurred during conversion. LibreOffice may not be installed on the server.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
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

      <div className="space-y-8">
        {!file && (
          <FileDropzone onFilesDropped={handleFilesDropped} accept={{ "application/pdf": [".pdf"] }} multiple={false} />
        )}

        {file && !convertedUrl && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
                  <FileText className="w-8 h-8 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white truncate max-w-sm">
                    {file.name}
                  </h3>
                  <p className="text-neutral-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                Choose different file
              </button>
            </div>

            <div className="flex justify-end border-t border-neutral-100 dark:border-neutral-800 pt-6">
              <button
                onClick={handleConvert}
                disabled={isConverting}
                className="flex flex-1 md:flex-none items-center justify-center px-12 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-medium rounded-xl shadow-sm transition-colors"
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
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-12 text-center shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95">
             <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">✓</span>
             </div>
             <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
               Conversion Successful!
             </h2>
             <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
               Your Word document is ready. Download it below.
             </p>
             
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setFile(null);
                    setConvertedUrl(null);
                  }}
                  className="px-6 py-3 font-medium text-neutral-600 bg-neutral-100 dark:text-neutral-300 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-colors w-full sm:w-auto"
                >
                  Convert another file
                </button>
                <a
                  href={convertedUrl}
                  download={`converted-${file!.name.replace(".pdf", ".docx")}`}
                  className="flex items-center justify-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl shadow-sm transition-colors w-full sm:w-auto"
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
