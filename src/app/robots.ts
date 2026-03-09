import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://invisibleworks.co';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/*/tools/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
