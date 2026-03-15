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

export default function MergeClient() {
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
    setMergedPdfUrl(null); // Reset when new files are added
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
    setMergedPdfUrl(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setMergedPdfUrl(null);
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
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
            <CopyPlus className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          Merge PDF Files
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Combine PDFs in the order you want with the easiest PDF merger available.
        </p>
      </div>

      <div className="space-y-8">
        <FileDropzone onFilesDropped={handleFilesDropped} multiple={true} />

        {files.length > 0 && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold mb-6 flex items-center justify-between">
              <span>Selected Files ({files.length})</span>
              <span className="text-sm font-normal text-neutral-500">Drag to reorder</span>
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

            <div className="flex flex-col sm:flex-row gap-4 justify-end border-t border-neutral-100 dark:border-neutral-800 pt-6">
              {mergedPdfUrl && (
                <a
                  href={mergedPdfUrl}
                  download="merged_document.pdf"
                  className="flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Merged PDF
                </a>
              )}
              <button
                onClick={handleMerge}
                disabled={files.length < 2 || isMerging}
                className="flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-sm transition-colors"
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
