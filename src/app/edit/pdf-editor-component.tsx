"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Type, PenTool, X, Undo2, FileEdit, Eraser } from "lucide-react";
import { FileDropzone } from "@/components/file-dropzone";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import SignatureCanvas from "react-signature-canvas";
import { PDFDocument, rgb } from "pdf-lib";
import { motion } from "framer-motion";

// Initialize PDF.js worker safely for SSR
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface Annotation {
  id: string;
  type: "text" | "signature" | "whiteout";
  x: number;
  y: number;
  width?: number; // for whiteout
  height?: number; // for whiteout
  content?: string;
  dataUrl?: string; // For signature
  pageIndex: number;
}

export default function PdfEditorClient({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [renderScale] = useState<number>(1);
  
  const [tool, setTool] = useState<"text" | "draw" | "whiteout" | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);
  
  const [isExporting, setIsExporting] = useState(false);

  // Whiteout drawing state
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawingWhiteout, setIsDrawingWhiteout] = useState(false);
  const [currentWhiteout, setCurrentWhiteout] = useState<{x: number, y: number, w: number, h: number} | null>(null);

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
      x: 100,
      y: 100,
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

      const renderedPageElement = containerRef.current?.querySelector('.react-pdf__Page');
      const renderedWidth = renderedPageElement ? renderedPageElement.clientWidth : 600;
      const renderedHeight = renderedPageElement ? renderedPageElement.clientHeight : 800;

      for (const ann of annotations) {
        if (ann.pageIndex >= pages.length) continue;
        const page = pages[ann.pageIndex];
        const { width: pdfWidth, height: pdfHeight } = page.getSize();

        const scaleX = pdfWidth / renderedWidth;
        const scaleY = pdfHeight / renderedHeight;

        const pdfX = ann.x * scaleX;
        const pdfY = pdfHeight - (ann.y * scaleY);

        if (ann.type === "whiteout" && ann.width && ann.height) {
          page.drawRectangle({
            x: pdfX,
            y: pdfY - (ann.height * scaleY),
            width: ann.width * scaleX,
            height: ann.height * scaleY,
            color: rgb(1, 1, 1),
          });
        } else if (ann.type === "text" && ann.content) {
          page.drawText(ann.content, {
            x: pdfX,
            y: pdfY - (24 * scaleY), // adjust for font baseline
            size: 24 * scaleY,
            color: rgb(0, 0, 0),
          });
        } else if (ann.type === "signature" && ann.dataUrl) {
          const imageBytes = await fetch(ann.dataUrl).then((res) => res.arrayBuffer());
          const signatureImage = await pdfDoc.embedPng(imageBytes);
          
          const sigScreenHeight = 64; // h-16 tailwind class
          const sigScreenWidth = (signatureImage.width / signatureImage.height) * sigScreenHeight;
          
          page.drawImage(signatureImage, {
            x: pdfX,
            y: pdfY - (sigScreenHeight * scaleY),
            width: sigScreenWidth * scaleX,
            height: sigScreenHeight * scaleY,
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
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] w-full">
      {!file ? (
        <div className={hideHeader ? "w-full relative z-20" : "p-12 w-full max-w-4xl mx-auto my-auto relative z-20"}>
          {!hideHeader && (
            <div className="text-center mb-10">
              <div className="flex justify-center mb-4 relative z-20">
                <div className="p-4 rounded-2xl glass-card border border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.3)]">
                  <FileEdit className="w-10 h-10 text-fuchsia-400" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 drop-shadow-lg">
                Edit PDF
              </h1>
              <p className="text-lg text-neutral-300 max-w-2xl mx-auto drop-shadow">
                Add text, shapes, images, and freehand annotations securely.
              </p>
            </div>
          )}
          <FileDropzone onFilesDropped={(files) => setFile(files[0])} multiple={false} theme="purple" />
        </div>
      ) : (
        <div className="flex flex-col h-full w-full relative z-20 pb-4">
          {/* Toolbar */}
          <div className="h-16 border-b border-white/10 glass-card bg-black/40 flex items-center justify-between px-6 shrink-0 z-10 mx-4 mt-6 rounded-t-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFile(null)}
                className="p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-md transition-colors glass-card"
                title="Close file"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="font-medium text-sm truncate max-w-[200px] text-white">
                {file.name}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={addTextAnnotation}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all border ${
                  tool === "text" ? "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400" : "border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Type className="w-4 h-4" /> Add Text
              </button>
              <button
                onClick={() => setShowSignaturePad(true)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all border ${
                  tool === "draw" ? "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400" : "border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <PenTool className="w-4 h-4" /> Sign
              </button>
              <button
                onClick={() => setTool(tool === "whiteout" ? null : "whiteout")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all border ${
                  tool === "whiteout" ? "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400" : "border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Eraser className="w-4 h-4" /> Whiteout
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 text-sm text-neutral-400 font-medium">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(c => c - 1)}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 hover:text-white transition-colors disabled:opacity-30"
                  >
                  Prev
                </button>
                <span className="text-white bg-white/10 px-3 py-1 rounded-md border border-white/5 shadow-inner">{currentPage} / {numPages || '-'}</span>
                <button
                  disabled={currentPage >= numPages}
                  onClick={() => setCurrentPage(c => c + 1)}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 hover:text-white transition-colors disabled:opacity-30"
                  >
                  Next
                </button>
              </div>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-6 py-2 bg-fuchsia-600/90 hover:bg-fuchsia-500 border border-fuchsia-400/30 shadow-[0_0_15px_rgba(217,70,239,0.3)] text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
              >
                {isExporting ? "Exporting..." : <><Download className="w-4 h-4" /> Apply & Download</>}
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto bg-black/20 p-8 relative flex justify-center mx-4 mb-4 border border-t-0 border-white/10 rounded-b-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            {fileUrl && (
              <div 
                ref={containerRef}
                className={`relative shadow-xl bg-white transition-all transform-gpu ${tool === 'whiteout' ? 'cursor-crosshair' : ''}`}
                style={{ minHeight: "800px", minWidth: "600px", touchAction: "none" }}
                onPointerDown={(e) => {
                  if (tool !== "whiteout" || !containerRef.current) return;
                  const rect = containerRef.current.getBoundingClientRect();
                  setIsDrawingWhiteout(true);
                  setCurrentWhiteout({ x: e.clientX - rect.left, y: e.clientY - rect.top, w: 0, h: 0 });
                }}
                onPointerMove={(e) => {
                  if (!isDrawingWhiteout || !currentWhiteout || !containerRef.current) return;
                  const rect = containerRef.current.getBoundingClientRect();
                  setCurrentWhiteout({
                    ...currentWhiteout,
                    w: (e.clientX - rect.left) - currentWhiteout.x,
                    h: (e.clientY - rect.top) - currentWhiteout.y,
                  });
                }}
                onPointerUp={() => {
                  if (isDrawingWhiteout && currentWhiteout) {
                    const x = currentWhiteout.w < 0 ? currentWhiteout.x + currentWhiteout.w : currentWhiteout.x;
                    const y = currentWhiteout.h < 0 ? currentWhiteout.y + currentWhiteout.h : currentWhiteout.y;
                    const w = Math.abs(currentWhiteout.w);
                    const h = Math.abs(currentWhiteout.h);

                    if (w > 10 && h > 10) {
                      setAnnotations([...annotations, {
                        id: Date.now().toString(),
                        type: "whiteout",
                        pageIndex: currentPage - 1,
                        x, y, width: w, height: h,
                      }]);
                    }
                  }
                  setIsDrawingWhiteout(false);
                  setCurrentWhiteout(null);
                }}
                onPointerLeave={() => {
                  setIsDrawingWhiteout(false);
                  setCurrentWhiteout(null);
                }}
              >
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
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Active Whiteout Drawing */}
                    {isDrawingWhiteout && currentWhiteout && (
                      <div 
                        className="absolute bg-white border border-dashed border-neutral-400"
                        style={{
                          left: currentWhiteout.w < 0 ? currentWhiteout.x + currentWhiteout.w : currentWhiteout.x,
                          top: currentWhiteout.h < 0 ? currentWhiteout.y + currentWhiteout.h : currentWhiteout.y,
                          width: Math.abs(currentWhiteout.w),
                          height: Math.abs(currentWhiteout.h),
                        }}
                      />
                    )}
                    
                    {annotations.filter(a => a.pageIndex === currentPage - 1).map(ann => (
                      <motion.div
                        key={ann.id}
                        className={`absolute pointer-events-auto group ${ann.type === 'whiteout' ? '' : 'cursor-move'} hover:ring-2 ring-blue-500 rounded`}
                        style={{
                          x: ann.x,
                          y: ann.y,
                          ...(ann.type === 'whiteout' ? { width: ann.width, height: ann.height } : {})
                        }}
                        drag={ann.type !== 'whiteout'}
                        dragMomentum={false}
                        onDragEnd={(_, info) => {
                          setAnnotations(prev => prev.map(a => a.id === ann.id ? { ...a, x: a.x + info.offset.x, y: a.y + info.offset.y } : a));
                        }}
                      >
                         <button 
                           onClick={() => removeAnnotation(ann.id)}
                           className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                         >
                           <X className="w-3 h-3" />
                         </button>
                        {ann.type === "text" && (
                          <div className="text-2xl font-sans text-black whitespace-nowrap bg-white/50 px-1 border border-transparent group-hover:border-blue-500 leading-none">
                            {ann.content}
                          </div>
                        )}
                        {ann.type === "signature" && ann.dataUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={ann.dataUrl} alt="Signature" className="h-16 object-contain border border-transparent group-hover:border-blue-500 bg-white/50 rounded pointer-events-none" />
                        )}
                        {ann.type === "whiteout" && (
                          <div className="w-full h-full bg-white border border-transparent group-hover:border-blue-500" />
                        )}
                      </motion.div>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card bg-black/70 rounded-3xl p-8 w-full max-w-md shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 relative">
            <h3 className="text-xl font-bold mb-6 text-white text-center">Draw Signature</h3>
            <div className="border-2 border-dashed border-white/20 bg-white/80 rounded-2xl mb-6 overflow-hidden relative shadow-inner">
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
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowSignaturePad(false)}
                className="px-6 py-3 font-medium text-neutral-300 hover:text-white glass-card bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={saveSignature}
                className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 border border-fuchsia-400/30 shadow-[0_0_15px_rgba(217,70,239,0.3)] text-white font-medium rounded-xl transition-all"
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
