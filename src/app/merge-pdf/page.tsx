import { Metadata } from 'next';
import { ToolContentLayout } from '@/components/seo/tool-content-layout';
import MergeClient from '../merge/merge-client';

export const metadata: Metadata = {
  title: 'Merge PDF Online Free | Combine PDFs',
  description: 'Merge multiple PDF files instantly with PDFly. Free online PDF merger with fast processing and secure file handling.',
  alternates: {
    canonical: 'https://pdf-ly.vercel.app/merge-pdf',
  },
};

export default function MergePdfPage() {
  const faqs = [
    { question: "Is it safe to merge PDFs online?", answer: "Yes, PDFly processes your files securely and deletes them immediately after you download your merged document." },
    { question: "Can I merge large PDF files?", answer: "Absolutely. Our optimized local processing handles large files smoothly without requiring huge uploads." },
    { question: "Is this tool really free?", answer: "Yes, merging PDFs on PDFly is completely free to use with no hidden catch." },
  ];

  const steps = [
    { name: "Upload your PDFs", text: "Drag and drop the PDF files you want to combine into the upload box above." },
    { name: "Reorder", text: "Drag the files to arrange them in the exact order you want them merged." },
    { name: "Download", text: "Click 'Merge PDF' and download your perfectly combined document." },
  ];

  const seoblocks = [
    { 
      title: "Best Free Online PDF Merger", 
      content: "<p>Combining multiple documents shouldn't take complicated paid software. PDFly's free online PDF merger allows you to combine contracts, assignments, and reports directly in your browser without losing quality. Our tool ensures your text, images, and formatting remain perfectly intact.</p>"
    },
    { 
      title: "Merge PDFs Securely", 
      content: "<p>Your privacy is our priority. Unlike older tools that store your sensitive documents on their servers for hours, PDFly utilizes cutting-edge local processing where possible, and strict automatic deletion protocols. The moment your files are merged and downloaded, they are erased forever from our temporary cache.</p>"
    },
    { 
      title: "Why Combine PDFs?", 
      content: "<p>Whether you're compiling financial reports for your team, submitting a multi-part assignment, or organizing travel documents, keeping everything in one single, organized PDF file is the professional standard. No more emailing confusing attachments—just one clean, merged document.</p>"
    }
  ];

  return (
    <ToolContentLayout
      toolName="Merge PDF"
      heroTitle="Combine multiple PDFs into one"
      heroDescription="The easiest online PDF merger. No installation, secure, and lightning fast. Drop your files below to get started."
      actionButtonText="Merge PDFs"
      toolUrl="/merge-pdf"
      faqs={faqs}
      steps={steps}
      seoContentBlocks={seoblocks}
    >
      <div className="w-full">
        <MergeClient hideHeader={true} />
      </div>
    </ToolContentLayout>
  );
}

