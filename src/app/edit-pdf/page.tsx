import { Metadata } from 'next';
import { ToolContentLayout } from '@/components/seo/tool-content-layout';

export const metadata: Metadata = {
  title: 'Edit PDF Online Free | PDF Editor',
  description: 'Free online PDF editor. Add text, images, shapes, and annotations to your PDF files directly in your browser with PDFly.',
  alternates: {
    canonical: 'https://pdf-ly.vercel.app/edit-pdf',
  },
};

export default function EditPdfPage() {
  const faqs = [
    { question: "Can I add text to my PDF?", answer: "Yes. PDFly's editor allows you to overlay new text, select fonts, and adjust styling directly onto your existing PDF pages." },
    { question: "Is it possible to sign a PDF?", answer: "Absolutely. You can draw your signature, upload an image of it, or type your name using our annotation tools." },
    { question: "Can I white out existing text?", answer: "You can use the shapes tool to draw a white rectangle over sensitive information to redact or hide it quickly." },
  ];

  const steps = [
    { name: "Upload Document", text: "Select the PDF you wish to edit from your computer or drag it into the box." },
    { name: "Make Edits", text: "Use our interactive toolbar to add text, draw annotations, insert shapes, or add images." },
    { name: "Save Changes", text: "Click export to permanently bake your edits into a brand new, updated PDF file." },
  ];

  const seoblocks = [
    { 
      title: "The Best Free Online PDF Editor", 
      content: "<p>Don't spend hundreds of dollars on premium desktop software just to add a quick note or fill out a form. PDFly provides a powerful, free online PDF editor right in your browser. Whether you need to sign a contract, fill out a lease agreement, or annotate a school paper, our tool has you covered.</p>"
    },
    { 
      title: "Add Text, Signatures, and Images", 
      content: "<p>Our editing suite is designed to be intuitive and fast. Easily drop text boxes anywhere on the page, adjust the font size and color, and type away. If you need to drop a company logo onto an invoice or sign the bottom line of a legal document, our image and drawing tools make it seamless.</p>"
    },
    { 
      title: "Cross-Platform PDF Editing", 
      content: "<p>Because PDFly runs directly in your web browser, our PDF editor works flawlessly whether you are on a Windows PC, a Mac, or a Linux machine. There are no heavy downloads or system requirements. Just open your browser, upload your file, and start editing instantly.</p>"
    }
  ];

  return (
    <ToolContentLayout
      toolName="Edit PDF"
      heroTitle="Edit your PDF files easily"
      heroDescription="Add text, signatures, shapes, and images to your PDF documents directly from your browser. Completely free."
      actionButtonText="Edit PDF"
      toolUrl="/edit"
      faqs={faqs}
      steps={steps}
      seoContentBlocks={seoblocks}
    />
  );
}
