"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Type, PenTool, X, Undo2 } from "lucide-react";
import { FileDropzone } from "@/components/file-dropzone";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import SignatureCanvas from "react-signature-canvas";
import { PDFDocument, rgb } from "pdf-lib";

// Initialize PDF.js worker safely for SSR
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface Annotation {
  id: string;
  type: "text" | "signature";
  x: number;
  y: number;
  content?: string;
  dataUrl?: string; // For signature
  pageIndex: number;
}

export default function PdfEditorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [renderScale] = useState<number>(1);
  
  const [tool, setTool] = useState<"text" | "draw" | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);
  
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const addTextAnnotation = () => {
    const text = prompt("Enter text to add:");
    if (!text) return;
    
    setAnnotations([...annotations, {
      id: Date.now().toString(),
      type: "text",
      content: text,
      pageIndex: currentPage - 1,
      x: 100, // Default position
      y: 100, // Default position
    }]);
    setTool(null);
  };

  const saveSignature = () => {
    if (sigCanvas.current?.isEmpty()) return;
    const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    if (dataUrl) {
      setAnnotations([...annotations, {
        id: Date.now().toString(),
        type: "signature",
        dataUrl,
        pageIndex: currentPage - 1,
        x: 100,
        y: 100,
      }]);
    }
    setShowSignaturePad(false);
    setTool(null);
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(annotations.filter((a) => a.id !== id));
  };

  const handleExport = async () => {
    if (!file) return;
    setIsExporting(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      for (const ann of annotations) {
        if (ann.pageIndex >= pages.length) continue;
        const page = pages[ann.pageIndex];
        const { height } = page.getSize();

        // Very basic coordinate mapping (assuming 1:1 scale for simplicity here)
        // PDF coordinates start from bottom-left. We might need to invert Y.
        // Screen Y = 0 is top. PDF Y = height is top.
        // Real coordinate mapping requires accounting for actual renderScale and DPI.
        // For this demo, we'll place items roughly where they are defined, assuming basic scaling.
        const pdfX = ann.x;
        const pdfY = height - ann.y - (ann.type === "signature" ? 50 : 20);

        if (ann.type === "text" && ann.content) {
          page.drawText(ann.content, {
            x: pdfX,
            y: pdfY,
            size: 24,
            color: rgb(0, 0, 0),
          });
        } else if (ann.type === "signature" && ann.dataUrl) {
          const imageBytes = await fetch(ann.dataUrl).then((res) => res.arrayBuffer());
          const signatureImage = await pdfDoc.embedPng(imageBytes);
          const sigDims = signatureImage.scale(0.5); // scale down
          
          page.drawImage(signatureImage, {
            x: pdfX,
            y: pdfY,
            width: sigDims.width,
            height: sigDims.height,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full absolute inset-0 pt-16 bg-neutral-100 dark:bg-neutral-950">
      {!file ? (
        <div className="p-12 w-full max-w-4xl mx-auto my-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">Edit PDF Document</h1>
            <p className="text-neutral-500">Add text, sign documents, and add annotations easily.</p>
          </div>
          <FileDropzone onFilesDropped={(files) => setFile(files[0])} multiple={false} />
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Toolbar */}
          <div className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFile(null)}
                className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                title="Close file"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="font-medium text-sm truncate max-w-[200px] text-neutral-900 dark:text-white">
                {file.name}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={addTextAnnotation}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  tool === "text" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                <Type className="w-4 h-4" /> Add Text
              </button>
              <button
                onClick={() => setShowSignaturePad(true)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  tool === "draw" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                <PenTool className="w-4 h-4" /> Sign
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(c => c - 1)}
                  className="px-2 disabled:opacity-50"
                  >
                  Prev
                </button>
                <span>{currentPage} / {numPages || '-'}</span>
                <button
                  disabled={currentPage >= numPages}
                  onClick={() => setCurrentPage(c => c + 1)}
                  className="px-2 disabled:opacity-50"
                  >
                  Next
                </button>
              </div>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm disabled:opacity-50"
              >
                {isExporting ? "Exporting..." : <><Download className="w-4 h-4" /> Apply & Download</>}
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-950 p-4 relative flex justify-center">
            {fileUrl && (
              <div className="relative shadow-xl bg-white transition-all transform-gpu" style={{ minHeight: "800px", minWidth: "600px" }}>
                <Document
                  file={fileUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={<div className="p-10 text-center text-neutral-500">Loading document...</div>}
                >
                  <Page
                    pageNumber={currentPage}
                    scale={renderScale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="border border-neutral-200"
                  />
                  
                  {/* Annotation Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {annotations.filter(a => a.pageIndex === currentPage - 1).map(ann => (
                      <div
                        key={ann.id}
                        className="absolute pointer-events-auto group cursor-move hover:ring-2 ring-blue-500 rounded"
                        style={{
                          left: ann.x,
                          top: ann.y,
                        }}
                        onDragEnd={() => {
                          // Very basic drag implementation stub
                        }}
                      >
                         <button 
                           onClick={() => removeAnnotation(ann.id)}
                           className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           <X className="w-3 h-3" />
                         </button>
                        {ann.type === "text" && (
                          <div className="text-2xl font-sans text-black whitespace-nowrap bg-white/50 px-1 border border-transparent group-hover:border-blue-500">
                            {ann.content}
                          </div>
                        )}
                        {ann.type === "signature" && ann.dataUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={ann.dataUrl} alt="Signature" className="h-16 object-contain border border-transparent group-hover:border-blue-500 bg-white/50 rounded" />
                        )}
                      </div>
                    ))}
                  </div>

                </Document>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {showSignaturePad && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Draw Signature</h3>
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 rounded-xl mb-4 overflow-hidden relative">
               <SignatureCanvas 
                 ref={sigCanvas}
                 penColor="black"
                 canvasProps={{ className: 'w-full h-48 signature-canvas' }} 
               />
               <div className="absolute bottom-2 right-2 flex gap-2">
                 <button onClick={() => sigCanvas.current?.clear()} className="p-1.5 bg-white shadow rounded text-neutral-500 hover:text-neutral-900" title="Clear">
                   <Undo2 className="w-4 h-4" />
                 </button>
               </div>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowSignaturePad(false)}
                className="px-4 py-2 font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={saveSignature}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm"
              >
                Save Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
