import { constructMetadata } from "@/lib/seo";
import { JSONLDSchema } from "@/components/schema";
import PdfEditorClient from "./pdf-editor-client";
import { ParticleBackground } from "@/components/effects/particle-background";

export const metadata = constructMetadata({
  title: "Edit PDF Online Free | Add Text & Sign PDF - PDFly",
  description: "Free online PDF editor. Add text, shapes, images, and freehand signatures to your PDF documents instantly without software.",
});

export default function EditPage() {
  return (
    <>
      <JSONLDSchema
        type="SoftwareApplication"
        data={{
          name: "PDFly PDF Editor",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description: "Free online PDF editor allows you to add text, signatures, and annotations to PDF files directly in your browser.",
        }}
      />
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center">
        <ParticleBackground baseColor="#d946ef" secondaryColor="#a21caf" />
        <div className="relative z-10 w-full h-full">
          <PdfEditorClient />
        </div>
      </div>
    </>
  );
}
