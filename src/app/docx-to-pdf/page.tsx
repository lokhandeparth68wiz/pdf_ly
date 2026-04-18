import { Metadata } from 'next';
import { ToolContentLayout } from '@/components/seo/tool-content-layout';
import DocxToPdfClient from './docx-to-pdf-client';

export const metadata: Metadata = {
  title: 'Word to PDF Converter | Convert DOCX to PDF Free',
  description: 'Convert Microsoft Word (DOCX) documents to PDF format instantly. Free online tool by PDFly to lock in your formatting.',
  alternates: {
    canonical: 'https://pdf-ly.vercel.app/docx-to-pdf',
  },
};

export default function DocxToPdfPage() {
  const faqs = [
    { question: "Why should I convert my Word document to PDF?", answer: "PDFs freeze your formatting. This ensures that whoever opens your document sees exactly what you intended, regardless of their device or installed fonts." },
    { question: "Will my hyperlinks still work?", answer: "Yes, PDFly preserves active hyperlinks from your Word document directly into the generated PDF." },
    { question: "Is this secure?", answer: "Absolutely. We process the file over a secure connection and automatically delete both the original DOCX and the output PDF shortly after processing." },
  ];

  const steps = [
    { name: "Upload DOCX", text: "Drag and drop your Microsoft Word document into the tool." },
    { name: "Conversion", text: "PDFly perfectly locks in the formatting and generates the PDF equivalent." },
    { name: "Download", text: "Save your new PDF file, ready to be sent securely to clients or colleagues." },
  ];

  const seoblocks = [
    { 
      title: "Free Online Word to PDF Converter", 
      content: "<p>When you finish drafting a document in Microsoft Word, distributing it as a .docx file can be risky. Layouts break, fonts go missing, and content can easily be altered. PDFly offers a reliable, free online Word to PDF converter to instantly secure your documents for sharing.</p>"
    },
    { 
      title: "Lock In Your Perfect Formatting", 
      content: "<p>The primary advantage of the PDF format is its universality. Convert your DOCX resumes, invoices, contracts, and assignments to PDF before sending them. PDFly guarantees that exactly how your document looks in Word is exactly how it will look in the final PDF, frozen safely inside the file.</p>"
    },
    { 
      title: "Fast and Easy PDF Generation", 
      content: "<p>You don't need expensive office software installed to create a PDF. With PDFly, the conversion happens entirely in the cloud at lightning speeds. Just upload your file, click convert, and you have your professional PDF document in seconds, entirely free.</p>"
    }
  ];

  return (
    <ToolContentLayout
      toolName="Word to PDF"
      heroTitle="Convert Word documents to PDF"
      heroDescription="Make your DOCX files perfectly readable on any device by converting them into secure, unalterable PDFs."
      actionButtonText="Convert to PDF"
      toolUrl="/docx-to-pdf"
      faqs={faqs}
      steps={steps}
      seoContentBlocks={seoblocks}
    >
      <div className="w-full">
        <DocxToPdfClient hideHeader={true} />
      </div>
    </ToolContentLayout>
  );
}
