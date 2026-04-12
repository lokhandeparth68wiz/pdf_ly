import { constructMetadata } from "@/lib/seo";
import { JSONLDSchema } from "@/components/schema";
import PdfToDocxClient from "../pdf-to-docx/pdf-to-docx-client";
import { ParticleBackground } from "@/components/effects/particle-background";

export const metadata = constructMetadata({
  title: "PDF to Word Converter | Convert PDF to DOCX Free - PDFly",
  description: "Convert PDF to editable Word documents (DOCX) online for free. 100% accurate text and layout retention. No watermark.",
});

export default function PdfToDocxToolPage() {
  return (
    <>
      <JSONLDSchema
        type="SoftwareApplication"
        data={{
          name: "PDFly PDF to DOCX Converter",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description: "Free online tool to convert PDF files to editable Word documents.",
        }}
      />
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center">
        <ParticleBackground baseColor="#9333ea" secondaryColor="#581c87" />
        <div className="relative z-10 w-full">
          <PdfToDocxClient />
        </div>
      </div>
    </>
  );
}
