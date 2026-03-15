export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container mx-auto px-4 py-8 md:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} PDFly. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
