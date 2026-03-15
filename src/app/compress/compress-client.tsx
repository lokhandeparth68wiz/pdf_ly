"use client";

import { useState } from "react";
import { FileArchive, Download, Loader2, Settings2 } from "lucide-react";
import { FileDropzone } from "@/components/file-dropzone";

export default function CompressClient() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<"screen" | "ebook" | "printer">("screen");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [savings, setSavings] = useState<{ original: number; new: number } | null>(null);

  const handleFilesDropped = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setCompressedUrl(null);
    setSavings(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    try {
      setIsCompressing(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("level", level);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/compress`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to compress PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setCompressedUrl(url);
      
      setSavings({
        original: file.size,
        new: blob.size,
      });
    } catch (error: any) {
      console.error("Compression error:", error);
      alert(error.message || "An error occurred during compression. Ghostscript may not be installed on the server.");
    } finally {
      setIsCompressing(false);
    }
  };

  const formatSize = (bytes: number) => (bytes / 1024 / 1024).toFixed(2);
  const savingsPercent = savings 
    ? Math.round((1 - savings.new / savings.original) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl">
            <FileArchive className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          Compress PDF
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Reduce your PDF file size while keeping the highest possible quality.
        </p>
      </div>

      <div className="space-y-8">
        {!file && (
          <FileDropzone onFilesDropped={handleFilesDropped} multiple={false} />
        )}

        {file && !compressedUrl && (
          <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <FileArchive className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white truncate max-w-sm">
                    {file.name}
                  </h3>
                  <p className="text-neutral-400">{formatSize(file.size)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Choose different file
              </button>
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4 flex items-center text-white">
                <Settings2 className="w-5 h-5 mr-2 text-neutral-400" />
                Compression Level
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: "screen", label: "Extreme Compression", desc: "Less quality, high compression" },
                  { id: "ebook", label: "Recommended", desc: "Good quality, good compression" },
                  { id: "printer", label: "Less Compression", desc: "High quality, less compression" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setLevel(opt.id as any)}
                    className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
                      level === opt.id 
                        ? "border-amber-500 bg-amber-500/10" 
                        : "border-white/10 hover:border-amber-500/50 bg-white/5"
                    }`}
                  >
                    <span className={`font-semibold ${level === opt.id ? "text-amber-400" : "text-white"}`}>
                      {opt.label}
                    </span>
                    <span className="text-sm text-left text-neutral-400 mt-1">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCompress}
                disabled={isCompressing}
                className="flex items-center justify-center px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-sm transition-colors w-full md:w-auto"
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Compressing...
                  </>
                ) : (
                  "Compress PDF"
                )}
              </button>
            </div>
          </div>
        )}

        {compressedUrl && savings && (
          <div className="glass-panel rounded-3xl p-8 text-center shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)] animate-in zoom-in-95">
             <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                <span className="text-3xl font-bold text-green-400">-{savingsPercent}%</span>
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">
               PDF Compressed Successfully!
             </h2>
             <p className="text-neutral-400 mb-8 max-w-md mx-auto">
               Your file is now {formatSize(savings.new)} MB, down from {formatSize(savings.original)} MB.
             </p>
             
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setFile(null);
                    setCompressedUrl(null);
                    setSavings(null);
                  }}
                  className="px-6 py-3 font-medium text-neutral-600 bg-neutral-100 dark:text-neutral-300 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-colors w-full sm:w-auto"
                >
                  Compress another file
                </button>
                <a
                  href={compressedUrl}
                  download={`compressed-${file!.name}`}
                  className="flex items-center justify-center px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl shadow-sm transition-colors w-full sm:w-auto"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Compressed PDF
                </a>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
