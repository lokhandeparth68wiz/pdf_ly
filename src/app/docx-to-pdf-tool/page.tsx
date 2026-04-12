import { constructMetadata } from "@/lib/seo";
import { JSONLDSchema } from "@/components/schema";
import DocxToPdfClient from "../docx-to-pdf/docx-to-pdf-client";
import { ParticleBackground } from "@/components/effects/particle-background";

export const metadata = constructMetadata({
  title: "Word to PDF Converter | Convert DOCX to PDF Free - PDFly",
  description: "Convert Microsoft Word (DOCX) documents to PDF format instantly. Free online tool by PDFly to lock in your formatting.",
});

export default function DocxToPdfToolPage() {
  return (
    <>
      <JSONLDSchema
        type="SoftwareApplication"
        data={{
          name: "PDFly DOCX to PDF Converter",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description: "Free online tool to convert Word documents to PDF format.",
        }}
      />
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center">
        <ParticleBackground baseColor="#e11d48" secondaryColor="#881337" />
        <div className="relative z-10 w-full">
          <DocxToPdfClient />
        </div>
      </div>
    </>
  );
}
