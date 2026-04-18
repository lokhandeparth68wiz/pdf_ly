import { Metadata } from 'next';

export const baseMetadata = {
  applicationName: 'PDFly',
  authors: [{ name: 'PDFly Team' }],
  creator: 'PDFly',
  publisher: 'PDFly',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    siteName: 'PDFly',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@pdfly',
  },
};

export function constructMetadata({
  title = "PDFly - Modern PDF Utility SaaS",
  description = "Merge, compress, convert, and edit PDF files online for free. Fast, secure, and intuitive PDF tools.",
  image = "/og-image.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images: [image],
    },
    icons,
    metadataBase: new URL('https://pdf-ly.vercel.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
