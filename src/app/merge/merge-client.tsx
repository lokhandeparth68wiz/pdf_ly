"use client";

import { useState } from "react";
import { CopyPlus, Download, Loader2 } from "lucide-react";
import { FileDropzone } from "@/components/file-dropzone";
import { SortableFileItem } from "@/components/sortable-file-item";
import { PDFDocument } from "pdf-lib";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export interface FileItem {
  id: string;
  file: File;
}

export default function MergeClient({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFilesDropped = (acceptedFiles: File[]) => {
    const newItems = acceptedFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
    }));
    setFiles((prev) => [...prev, ...newItems]);
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
      setMergedPdfUrl(null);
    }
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
      setMergedPdfUrl(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      if (mergedPdfUrl) {
        URL.revokeObjectURL(mergedPdfUrl);
        setMergedPdfUrl(null);
      }
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }

    try {
      setIsMerging(true);
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      if (mergedPdfUrl) URL.revokeObjectURL(mergedPdfUrl);
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("An error occurred while merging the PDFs.");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className={hideHeader ? "w-full" : "container mx-auto px-4 py-12 max-w-4xl"}>
      {!hideHeader && (
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4 relative z-20">
            <div className="p-4 rounded-2xl glass-card border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <CopyPlus className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 drop-shadow-lg">
            Merge PDF Files
          </h1>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto drop-shadow">
            Combine PDFs in the order you want with the easiest PDF merger available.
          </p>
        </div>
      )}

      <div className="space-y-8">
        <FileDropzone onFilesDropped={handleFilesDropped} multiple={true} />

        {files.length > 0 && (
          <div className="glass-card bg-black/40 rounded-3xl p-6 md:p-8 border border-white/10 relative z-20">
            <h2 className="text-xl font-semibold mb-6 flex items-center justify-between text-white drop-shadow-md">
              <span>Selected Files <span className="text-blue-400">({files.length})</span></span>
              <span className="text-sm font-normal text-neutral-400">Drag to reorder</span>
            </h2>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={files.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3 mb-8">
                  {files.map((item) => (
                    <SortableFileItem key={item.id} id={item.id} file={item.file} onRemove={handleRemove} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <div className="flex flex-col sm:flex-row gap-4 justify-end border-t border-white/10 pt-6">
              {mergedPdfUrl && (
                <a
                  href={mergedPdfUrl}
                  download="merged_document.pdf"
                  className="flex items-center justify-center px-6 py-3 bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-colors border border-emerald-400/30"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Merged PDF
                </a>
              )}
              <button
                onClick={handleMerge}
                disabled={files.length < 2 || isMerging}
                className="flex items-center justify-center px-8 py-3 bg-blue-600/90 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-colors border border-blue-400/30"
              >
                {isMerging ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Merging...
                  </>
                ) : (
                  "Merge PDFs"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
