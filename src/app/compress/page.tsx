import { constructMetadata } from "@/lib/seo";
import { JSONLDSchema } from "@/components/schema";
import CompressClient from "./compress-client";
import { ParticleBackground } from "@/components/effects/particle-background";

export const metadata = constructMetadata({
  title: "Compress PDF Online | Reduce PDF File Size Free - PDFly",
  description: "Easily compress PDF files online without losing quality. Reduce PDF file size to 100kb or less securely for free. Try our PDF compressor.",
});

export default function CompressPage() {
  return (
    <>
      <JSONLDSchema
        type="SoftwareApplication"
        data={{
          name: "PDFly PDF Compressor",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description: "Free online tool to significantly reduce PDF file size while maintaining maximum quality.",
        }}
      />
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center">
        <ParticleBackground baseColor="#f97316" secondaryColor="#c2410c" />
        <div className="relative z-10 w-full">
          <CompressClient />
        </div>
      </div>
    </>
  );
}
