"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

interface FileDropzoneProps {
  onFilesDropped: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  theme?: "blue" | "amber";
}

export function FileDropzone({
  onFilesDropped,
  accept = { "application/pdf": [".pdf"] },
  multiple = true,
  theme = "blue",
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesDropped(acceptedFiles);
      }
    },
    [onFilesDropped]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  const themeColors = {
    blue: {
      activeBorder: "border-blue-500",
      activeBg: "bg-blue-500/10",
      icon: "text-blue-400",
      btnBg: "bg-blue-600 hover:bg-blue-500",
      btnBorder: "border-blue-400/30",
    },
    amber: {
      activeBorder: "border-amber-500",
      activeBg: "bg-amber-500/10",
      icon: "text-amber-400",
      btnBg: "bg-amber-600 hover:bg-amber-500",
      btnBorder: "border-amber-400/30",
    }
  };

  const colors = themeColors[theme];

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 max-w-3xl w-full mx-auto
        glass-card
        ${
          isDragActive
            ? `${colors.activeBorder} ${colors.activeBg} scale-[1.02]`
            : "border-white/10 hover:border-white/20 hover:scale-[1.01]"
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
        <div className="p-4 rounded-full shadow-lg glass-card border border-white/20">
          <UploadCloud className={`w-10 h-10 ${colors.icon}`} />
        </div>
        <h3 className="text-xl font-semibold text-white">
          {isDragActive ? "Drop files here" : "Choose files or drag & drop"}
        </h3>
        <p className="text-neutral-400 max-w-xs">
          Supported formats: PDF. Up to 100MB per file.
        </p>
        <button 
          type="button" 
          className={`mt-4 px-6 py-3 ${colors.btnBg} text-white font-medium rounded-full shadow-lg transition-colors border ${colors.btnBorder}`}
        >
          Select Files
        </button>
      </div>
    </div>
  );
}
