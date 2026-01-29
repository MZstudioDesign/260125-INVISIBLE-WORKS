import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://invisibleworks.co';
  const locales = ['ko', 'en', 'zh-CN', 'zh-TW'];
  const lastModified = new Date();

  // Static pages
  const staticPages = [
    '', // home
    '/portfolio',
    '/contact',
    '/design-system',
    '/privacy',
    '/terms',
    '/tools/business-card',
    '/tools/quote',
  ];

  // Generate sitemap entries for each locale and page
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified,
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : page === '/portfolio' ? 0.9 : 0.7,
      });
    }
  }

  // Add root redirect
  entries.push({
    url: baseUrl,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1,
  });

  return entries;
}
