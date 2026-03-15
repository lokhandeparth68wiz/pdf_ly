import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pdf-ly.vercel.app';
  
  // Base routes and programmatic tool pages
  const routes = [
    '',
    '/merge-pdf',
    '/compress-pdf',
    '/pdf-to-docx',
    '/docx-to-pdf',
    '/edit-pdf',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
