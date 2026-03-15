import Link from 'next/link';

export function SeoContentSection() {
  return (
    <section className="w-full bg-black/40 backdrop-blur-md py-24 px-6 border-y border-white/5 relative z-10">
      <div className="max-w-4xl mx-auto prose prose-invert prose-p:text-neutral-400 prose-headings:font-display prose-a:text-brand-primary hover:prose-a:text-red-400">
        <h2 className="text-4xl font-bold mb-6 text-white text-center">Best Free PDF Tools Online</h2>
        <p className="text-lg leading-relaxed text-center max-w-3xl mx-auto mb-16">
          Whether you are a student submitting an assignment, a professional organizing contracts, or someone who just needs to fix a typo in a downloaded document, PDFly offers a comprehensive suite of free, online PDF tools. We focus on speed, privacy, and quality, ensuring your document workflows are never interrupted.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mt-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">How to Merge or Compress PDFs Easily</h3>
            <p className="leading-relaxed mb-4">
              Dealing with large files is a constant source of frustration. Many email clients reject attachments larger than 25MB. By using our <Link href="/compress-pdf">Compress PDF</Link> tool, you can drastically reduce the file size of your documents with a single click, without compromising the visual clarity of your text or images.
            </p>
            <p className="leading-relaxed">
              Similarly, managing multiple separate pages is chaotic. If you have several chapters of a report or multiple receipts for an expense claim, our <Link href="/merge-pdf">Merge PDF</Link> utility lets you drag, drop, reorder, and combine them into one seamless, professional document.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">Why Use PDFly Instead of Software?</h3>
            <p className="leading-relaxed mb-4">
              Traditional PDF software like Adobe Acrobat can be expensive, bloated, and require heavy system resources. PDFly operates entirely in your browser. This means whether you need to <Link href="/edit-pdf">edit a PDF</Link> to add a signature, or <Link href="/pdf-to-docx">convert a PDF to Word format</Link>, you can do it instantly on any device, including your smartphone.
            </p>
            <p className="leading-relaxed">
              Security is our paramount concern. Unlike questionable free utilities that harvest your data, our tools utilize local-first processing architectures when possible, and strict automatic deletion protocols for any server-side conversions like transforming <Link href="/docx-to-pdf">Word DOCX back to PDF</Link>. Your files remain explicitly yours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
