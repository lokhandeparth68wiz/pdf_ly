import Link from 'next/link';

export function SeoContentSection() {
  return (
    <section className="w-full bg-black/40 backdrop-blur-md py-24 px-6 border-y border-white/5 relative z-10">
      <div className="max-w-4xl mx-auto prose prose-invert prose-p:text-neutral-400 prose-headings:font-display prose-a:text-brand-primary hover:prose-a:text-red-400">
        <h2 className="text-4xl font-bold mb-8 text-white text-center">Your Ultimate Free Online PDF Toolkit</h2>
        
        <p className="text-lg leading-relaxed mb-8">
          Welcome to PDFly, the most advanced, lightning-fast platform to manage all your document needs directly from your web browser. 
          Whether you need to <Link href="/edit-pdf">edit pdf online</Link> for a quick signature, or completely restructure a massive report, 
          PDFly provides a seamless, secure, and entirely free ecosystem. We eliminate the need for expensive, bloated desktop software.
        </p>

        <h3 className="text-2xl font-bold mb-4 text-white">What is PDFly?</h3>
        <p className="leading-relaxed mb-8">
          PDFly is a comprehensive suite of cloud-based PDF utilities designed to simplify the way you interact with documents. 
          Historically, making even minor changes to a PDF—like fixing a typo or appending a missing page—required downloading heavy, 
          paid applications like Adobe Acrobat. PDFly democratizes document editing by bringing enterprise-grade processing capabilities 
          straight to your browser. From students submitting academic assignments to professionals drafting legal contracts, PDFly is trusted 
          globally for its speed, accuracy, and unwavering commitment to user privacy.
        </p>

        <h3 className="text-2xl font-bold mb-4 text-white">Core Features of Our PDF Tools</h3>
        <ul className="list-disc pl-6 mb-8 text-neutral-400 space-y-2">
          <li><strong>Merge PDFs:</strong> Combine multiple separate documents into one cohesive file. It's incredibly easy to <Link href="/merge-pdf">merge pdf online</Link> by simply dragging and dropping your pages into the correct order.</li>
          <li><strong>Compress PDFs:</strong> Struggling with email attachment limits? You can <Link href="/compress-pdf">compress pdf free</Link> with our smart reduction algorithms that shrink file sizes by up to 90% without losing visual clarity.</li>
          <li><strong>Edit &amp; Annotate:</strong> Need to fill out a form or add a digital signature? Use our tools to <Link href="/edit-pdf">edit pdf online</Link> effortlessly. Add text, images, shapes, and whiteout sensitive blocks instantly.</li>
          <li><strong>Format Conversion:</strong> Transform static documents into fully editable Microsoft Word files via our <Link href="/pdf-to-docx">PDF to DOCX</Link> converter, or freeze your formatting by converting <Link href="/docx-to-pdf">Word back to PDF</Link>.</li>
          <li><strong>Split &amp; Extract:</strong> If you have a massive 100-page document but only need chapter three, you can split pdf free (coming soon to our unified dashboard) to extract exactly what you need.</li>
        </ul>

        <h3 className="text-2xl font-bold mb-4 text-white">Why Choose PDFly?</h3>
        <p className="leading-relaxed mb-4">
          There are dozens of free PDF tools on the internet, but PDFly stands out primarily because of our technical architecture. 
          We utilize localized WebAssembly processing where possible, meaning your files are often processed directly utilizing your 
          own computer's hardware rather than being slowly uploaded to a remote server. This results in processing times that are up to 
          10x faster than traditional online alternatives.
        </p>
        <p className="leading-relaxed mb-8">
          Furthermore, PDFly operates with a zero-friction philosophy. There are no mandatory account registrations, no hidden trial expirations, 
          and absolutely no watermarks stamped onto your exported documents. You deserve full ownership of your pristine, formatted files.
        </p>

        <h3 className="text-2xl font-bold mb-4 text-white">Bank-Grade Security and Privacy</h3>
        <p className="leading-relaxed mb-8">
          Uploading sensitive corporate financial records or personal legal documents to a free website is inherently scary. We understand this. 
          That is why security is the foundational pillar of PDFly. All data transfers occur over encrypted SSL/TLS connections. 
          More importantly, we employ a strict <strong>Automatic Deletion Protocol</strong>. The moment your document finishes processing and 
          you download the result, the temporary files are instantly and permanently purged from our caching servers. We do not read, store, 
          share, or sell your documents. Under no circumstances will your private data linger on our infrastructure.
        </p>

        <h3 className="text-2xl font-bold mb-4 text-white">Frequently Asked Questions (FAQ)</h3>
        <div className="space-y-4 mb-8">
          <div>
            <h4 className="text-lg font-bold text-neutral-200">Is PDFly really 100% free to use?</h4>
            <p className="leading-relaxed">Yes. We believe essential document tools should be accessible to everyone. Our core utilities, including our merger, compressor, and converter, are completely free with no hidden catch or premium tier locking your final download.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-neutral-200">Are my uploaded documents safe?</h4>
            <p className="leading-relaxed">Absolutely. Files are processed securely and deleted automatically and permanently from our temporary servers immediately after your download is complete.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-neutral-200">Can I use PDFly on my mobile phone?</h4>
            <p className="leading-relaxed">Yes! PDFly is fully responsive and optimized for mobile browsers, allowing you to edit, compress, and convert documents on the go from your iOS or Android device.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-neutral-200">Will compressing my PDF ruin the image quality?</h4>
            <p className="leading-relaxed">Our smart compression engine maintains the perfect balance by optimizing the DPI and stripping redundant metadata. Your text remains razor sharp, and while images are compressed to save space, they retain excellent visual fidelity for standard printing and screen viewing.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
