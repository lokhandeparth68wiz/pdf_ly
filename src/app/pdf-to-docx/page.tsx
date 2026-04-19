import { Metadata } from 'next';
import { ToolContentLayout } from '@/components/seo/tool-content-layout';
import PdfToDocxClient from './pdf-to-docx-client';

export const metadata: Metadata = {
  title: 'PDF to Word Converter | Convert PDF to DOCX Free',
  description: 'Convert PDF to editable Word documents (DOCX) online for free. 100% accurate text and layout retention. No watermark.',
  alternates: {
    canonical: 'https://pdf-ly.vercel.app/pdf-to-docx',
  },
};

export default function PdfToDocxPage() {
  const faqs = [
    { question: "Will my formatting break when converting?", answer: "PDFly strives to maintain the exact layout, margins, fonts, and images of your original PDF when converting it into a Word document." },
    { question: "Can I edit the converted Word file?", answer: "Yes! The resulting DOCX file is fully editable in Microsoft Word, Google Docs, or LibreOffice." },
    { question: "Does it convert scanned PDFs?", answer: "Currently, we extract standard text layers. Scanned images without OCR text layers will be converted as images inside the Word document." },
  ];

  const steps = [
    { name: "Upload your PDF", text: "Select the PDF document you want to convert into a Word file." },
    { name: "Processing", text: "PDFly instantly reconstructs the layout and text into a native DOCX format." },
    { name: "Download", text: "Download your easily editable Word document and start making changes." },
  ];

  const seoblocks = [
    { 
      title: "Convert PDF to Word Online for Free", 
      content: "<p>PDFs are great for viewing, but terrible for editing. Whenever you need to update a contract, fix a typo in a report, or reuse the text from a brochure, you need to convert it first. PDFly provides a seamless, free PDF to Word (DOCX) converter that handles this for you instantly.</p>"
    },
    { 
      title: "High-Fidelity Document Conversion", 
      content: "<p>Unlike basic text extractors, PDFly's robust conversion engine carefully maps the original PDF's layout constraints to Word's formatting rules. This ensures paragraphs, tables, lists, and images stay neatly where they belong, significantly reducing the time you have to spend fixing formatting errors.</p>"
    },
    { 
      title: "No Watermarks or Hidden Fees", 
      content: "<p>Many online tools lock your converted Word documents behind a paywall or stamp an ugly watermark on every page. PDFly commits to providing clean, watermark-free, fully editable DOCX files to our users completely free of charge. Your document editing workflow just got a massive upgrade.</p>"
    }
  ];

  return (
    <ToolContentLayout
      toolName="PDF to Word"
      heroTitle="Convert PDF to editable Word doc"
      heroDescription="Turn your static PDFs into fully editable Microsoft Word documents with perfect formatting retention."
      actionButtonText="Convert to DOCX"
      toolUrl="/pdf-to-docx"
      faqs={faqs}
      steps={steps}
      seoContentBlocks={seoblocks}
      accentColor="#06b6d4"
      accentColorSecondary="#164e63"
    >
      <div className="w-full">
        <PdfToDocxClient hideHeader={true} />
      </div>
    </ToolContentLayout>
  );
}
