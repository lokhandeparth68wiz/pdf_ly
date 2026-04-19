import { Metadata } from 'next';
import { ToolContentLayout } from '@/components/seo/tool-content-layout';
import CompressClient from '../compress/compress-client';

export const metadata: Metadata = {
  title: 'Compress PDF Online Free | Reduce PDF Size',
  description: 'Compress PDF size without losing quality. Free online PDF compressor by PDFly. Make your PDF files smaller instantly.',
  alternates: {
    canonical: 'https://pdf-ly.vercel.app/compress-pdf',
  },
};

export default function CompressPdfPage() {
  const faqs = [
    { question: "Will compressing my PDF ruin the quality?", answer: "No, PDFly uses smart compression algorithms that reduce file size by stripping redundant data while preserving the visual quality of text and images." },
    { question: "How much smaller will my file get?", answer: "Depending on the original file (especially if it contains unoptimized images), you can see file size reductions of up to 90%." },
    { question: "Can I compress password-protected PDFs?", answer: "You will need to unlock the PDF first before our tool can analyze and compress the contents." },
  ];

  const steps = [
    { name: "Select PDF file", text: "Upload the heavy PDF document you need to shrink." },
    { name: "Choose compression level", text: "Select between extreme compression (smallest size) or recommended compression (best quality retention)." },
    { name: "Download", text: "Download your newly compressed, lightweight PDF file ready for emailing." },
  ];

  const seoblocks = [
    { 
      title: "Reduce PDF File Size Online for Free", 
      content: "<p>Are your PDF files too large to attach to an email or upload to a portal? PDFly solves this instantly. Our free online PDF compressor shrinks the file size of your documents in seconds, making them easy to share, upload, and store.</p>"
    },
    { 
      title: "Compress PDF without losing quality", 
      content: "<p>The biggest fear when reducing file sizes is blurry text or pixelated images. PDFly utilizes advanced optimization techniques to ensure that your compressed PDFs look identical to the originals on screen. We intelligently optimize fonts and compress images just enough to hit the perfect balance of size and quality.</p>"
    },
    { 
      title: "Fast, Secure, and Private", 
      content: "<p>Don't risk uploading sensitive corporate or personal documents to untrusted applications. PDFly forces automatic deletion of your files immediately after processing. Your data remains yours, and your compressed documents are delivered through an encrypted, high-speed connection.</p>"
    }
  ];

  return (
    <ToolContentLayout
      toolName="Compress PDF"
      heroTitle="Shrink your PDF sizes instantly"
      heroDescription="Got a PDF that's too large to email? Reduce its file size dramatically while maintaining perfect visual quality."
      actionButtonText="Compress PDF"
      toolUrl="/compress-pdf"
      faqs={faqs}
      steps={steps}
      seoContentBlocks={seoblocks}
      accentColor="#f59e0b"
      accentColorSecondary="#92400e"
    >
      <div className="w-full">
        <CompressClient hideHeader={true} />
      </div>
    </ToolContentLayout>
  );
}
