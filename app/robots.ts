import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl: string = "https://hydroocann.com"
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ["/studio", "/checkout", "/payment"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}