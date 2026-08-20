"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Download, Type, PenTool, X, Undo2, FileEdit, Eraser, MousePointerClick, Loader2 } from "lucide-react";
import { FileDropzone } from "@/components/file-dropzone";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import SignatureCanvas from "react-signature-canvas";
import { PDFDocument, rgb, StandardFonts, PDFFont } from "pdf-lib";
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
  fontSize?: number;
  fontFamily?: string;
  dataUrl?: string; // For signature
  pageIndex: number;
}

// Extracted text item from pdfjs
interface ExtractedTextItem {
  id: string;
  str: string;              // original text
  x: number;                // screen x (top-left origin)
  y: number;                // screen y
  width: number;            // rendered width px
  height: number;           // rendered height px
  fontSize: number;         // screen font size px
  fontName: string;         // pdfjs internal font name
  transform: number[];      // raw PDF transform [a,b,c,d,tx,ty]
  pageIndex: number;
}

// Tracks a user edit to an extracted text item
interface TextEdit {
  itemId: string;
  newContent: string;
}

export default function PdfEditorClient({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [renderScale] = useState<number>(1);
  
  const [tool, setTool] = useState<"text" | "draw" | "whiteout" | "editText" | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);
  
  const [isExporting, setIsExporting] = useState(false);

  // Whiteout drawing state
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawingWhiteout, setIsDrawingWhiteout] = useState(false);
  const [currentWhiteout, setCurrentWhiteout] = useState<{x: number, y: number, w: number, h: number} | null>(null);

  // Text Modal state
  const [showTextModal, setShowTextModal] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [textFontSize, setTextFontSize] = useState(24);
  const [textFontFamily, setTextFontFamily] = useState("Helvetica");

  // Edit existing text state
  const [extractedText, setExtractedText] = useState<ExtractedTextItem[]>([]);
  const [textEdits, setTextEdits] = useState<TextEdit[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isExtractingText, setIsExtractingText] = useState(false);

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

  // Extract text from all pages when PDF is loaded
  const extractTextFromPdf = useCallback(async (url: string, totalPages: number) => {
    setIsExtractingText(true);
    try {
      const pdf = await pdfjs.getDocument(url).promise;
      const allItems: ExtractedTextItem[] = [];

      for (let i = 0; i < totalPages; i++) {
        const page = await pdf.getPage(i + 1);
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: renderScale });
        const textContent = await page.getTextContent();
        const scaleRatio = viewport.width / baseViewport.width;

        for (const item of textContent.items) {
          if (!('str' in item) || !item.str.trim()) continue;

          const tx = item.transform;
          // tx = [scaleX, skewX, skewY, scaleY, translateX, translateY]
          const pdfFontSize = Math.abs(tx[3]);
          const screenFontSize = pdfFontSize * scaleRatio;

          // Convert PDF coords (bottom-left origin) to screen coords (top-left)
          const screenX = tx[4] * scaleRatio;
          const screenY = viewport.height - (tx[5] * scaleRatio) - screenFontSize;

          const screenWidth = ('width' in item ? (item as { width: number }).width : 0) * scaleRatio;

          allItems.push({
            id: `et-${i}-${allItems.length}`,
            str: item.str,
            x: screenX,
            y: screenY,
            width: screenWidth || (item.str.length * screenFontSize * 0.6),
            height: screenFontSize * 1.3,
            fontSize: screenFontSize,
            fontName: ('fontName' in item ? (item as { fontName: string }).fontName : ''),
            transform: tx,
            pageIndex: i,
          });
        }
      }

      setExtractedText(allItems);
    } catch (err) {
      console.error("Failed to extract text:", err);
    } finally {
      setIsExtractingText(false);
    }
  }, [renderScale]);

  // Trigger text extraction when file loads
  useEffect(() => {
    if (fileUrl && numPages > 0) {
      extractTextFromPdf(fileUrl, numPages);
    }
  }, [fileUrl, numPages, extractTextFromPdf]);

  // Update or create a text edit entry
  const updateTextEdit = (itemId: string, newContent: string) => {
    setTextEdits(prev => {
      const existing = prev.find(e => e.itemId === itemId);
      // If text is reverted to original, remove the edit
      const original = extractedText.find(t => t.id === itemId);
      if (original && newContent === original.str) {
        return prev.filter(e => e.itemId !== itemId);
      }
      if (existing) {
        return prev.map(e => e.itemId === itemId ? { ...e, newContent } : e);
      }
      return [...prev, { itemId, newContent }];
    });
  };

  const confirmAddText = () => {
    if (!textContent.trim()) return;
    
    setAnnotations([...annotations, {
      id: Date.now().toString(),
      type: "text",
      content: textContent,
      fontSize: textFontSize,
      fontFamily: textFontFamily,
      pageIndex: currentPage - 1,
      x: 100,
      y: 100,
    }]);
    setShowTextModal(false);
    setTextContent("");
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

      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);
      
      const fontMap: Record<string, PDFFont> = {
        "Helvetica": helveticaFont,
        "Times Roman": timesRomanFont,
        "Courier": courierFont,
      };

      const renderedPageElement = containerRef.current?.querySelector('.react-pdf__Page');
      const renderedWidth = renderedPageElement ? renderedPageElement.clientWidth : 600;
      const renderedHeight = renderedPageElement ? renderedPageElement.clientHeight : 800;

      // Apply text edits (whiteout original + redraw new text)
      for (const edit of textEdits) {
        const item = extractedText.find(t => t.id === edit.itemId);
        if (!item || item.pageIndex >= pages.length) continue;

        const page = pages[item.pageIndex];
        const { width: pdfWidth, height: pdfHeight } = page.getSize();
        const scaleX = pdfWidth / renderedWidth;
        const scaleY = pdfHeight / renderedHeight;

        // Whiteout the original text
        const pdfX = item.x * scaleX;
        const pdfY = pdfHeight - ((item.y + item.height) * scaleY);
        page.drawRectangle({
          x: pdfX - 1,
          y: pdfY - 1,
          width: (item.width * scaleX) + 2,
          height: (item.height * scaleY) + 2,
          color: rgb(1, 1, 1),
        });

        // Redraw with the user's new text
        const editFontSize = item.fontSize * scaleY;
        page.drawText(edit.newContent, {
          x: pdfX,
          y: pdfY + 2,
          size: editFontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      }

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
          const fontSize = ann.fontSize || 24;
          const font = fontMap[ann.fontFamily || "Helvetica"] || helveticaFont;
          page.drawText(ann.content, {
            x: pdfX,
            y: pdfY - (fontSize * scaleY), // adjust for font baseline
            size: fontSize * scaleY,
            font: font,
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
                onClick={() => setShowTextModal(true)}
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
              <button
                onClick={() => setTool(tool === "editText" ? null : "editText")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all border ${
                  tool === "editText" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <MousePointerClick className="w-4 h-4" /> Edit Text
                {isExtractingText && <Loader2 className="w-3 h-3 animate-spin" />}
              </button>
              {textEdits.length > 0 && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full border border-yellow-400/30">
                  {textEdits.length} edit{textEdits.length > 1 ? 's' : ''}
                </span>
              )}
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
                className={`relative shadow-xl bg-white transition-all transform-gpu ${tool === 'whiteout' ? 'cursor-crosshair' : ''} ${tool === 'editText' ? 'cursor-text' : ''}`}
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
                          <div 
                            className="font-sans text-black whitespace-pre-wrap bg-white/50 px-1 border border-transparent group-hover:border-blue-500 leading-none"
                            style={{ 
                              fontSize: `${ann.fontSize || 24}px`,
                              fontFamily: ann.fontFamily === 'Times Roman' ? '"Times New Roman", Times, serif' : 
                                          ann.fontFamily === 'Courier' ? 'Courier, monospace' : 
                                          'Arial, Helvetica, sans-serif'
                            }}
                          >
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

                  {/* Edit Existing Text Overlay */}
                  {tool === "editText" && (
                    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 5 }}>
                      {extractedText
                        .filter(item => item.pageIndex === currentPage - 1)
                        .map(item => {
                          const edit = textEdits.find(e => e.itemId === item.id);
                          const isEditing = editingItemId === item.id;
                          const displayText = edit?.newContent ?? item.str;

                          return (
                            <div
                              key={item.id}
                              className="absolute"
                              style={{
                                left: item.x,
                                top: item.y,
                                width: isEditing ? 'auto' : item.width,
                                minWidth: item.width,
                                height: item.height,
                              }}
                            >
                              {isEditing ? (
                                <input
                                  autoFocus
                                  value={displayText}
                                  onChange={(e) => updateTextEdit(item.id, e.target.value)}
                                  onBlur={() => setEditingItemId(null)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') setEditingItemId(null);
                                    if (e.key === 'Escape') {
                                      // Revert this edit
                                      setTextEdits(prev => prev.filter(te => te.itemId !== item.id));
                                      setEditingItemId(null);
                                    }
                                  }}
                                  className="bg-white border-2 border-blue-500 text-black px-0.5 outline-none rounded-sm shadow-lg"
                                  style={{
                                    fontSize: item.fontSize,
                                    lineHeight: `${item.height}px`,
                                    height: item.height,
                                    minWidth: item.width,
                                    fontFamily: 'Arial, Helvetica, sans-serif',
                                  }}
                                />
                              ) : (
                                <div
                                  onClick={() => setEditingItemId(item.id)}
                                  className={`h-full w-full cursor-text transition-all rounded-sm ${
                                    edit
                                      ? 'bg-yellow-300/30 ring-1 ring-yellow-400/60 hover:bg-yellow-300/40'
                                      : 'hover:bg-blue-200/25 hover:ring-1 hover:ring-blue-400/40'
                                  }`}
                                  title={edit ? `Edited: "${item.str}" → "${edit.newContent}"` : `Click to edit: "${item.str}"`}
                                />
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}

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

      {/* Text Modal */}
      {showTextModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card bg-black/70 rounded-3xl p-8 w-full max-w-md shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 relative">
            <h3 className="text-xl font-bold mb-6 text-white text-center">Add Text</h3>
            
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Text Content</label>
                <textarea 
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 resize-none h-24"
                  placeholder="Type your text here..."
                  autoFocus
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Font Family</label>
                  <select
                    value={textFontFamily}
                    onChange={(e) => setTextFontFamily(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500 appearance-none"
                  >
                    <option value="Helvetica" className="text-black">Helvetica</option>
                    <option value="Times Roman" className="text-black">Times Roman</option>
                    <option value="Courier" className="text-black">Courier</option>
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Size</label>
                  <input 
                    type="number"
                    value={textFontSize}
                    onChange={(e) => setTextFontSize(Number(e.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500"
                    min="8"
                    max="144"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowTextModal(false)}
                className="px-6 py-3 font-medium text-neutral-300 hover:text-white glass-card bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAddText}
                className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 border border-fuchsia-400/30 shadow-[0_0_15px_rgba(217,70,239,0.3)] text-white font-medium rounded-xl transition-all"
              >
                Add Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
