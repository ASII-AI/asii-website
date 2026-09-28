import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://asii.site";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/pilot",
        "/dashboard",
        "/signals",
        "/continuity",
        "/review",
        "/report",
        "/success",
        "/investigations",
        "/resources",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
