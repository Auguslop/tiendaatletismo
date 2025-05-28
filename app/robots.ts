import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/add-product/", "/edit-product/"],
    },
    sitemap: "https://tu-sitio.vercel.app/sitemap.xml",
  }
}
