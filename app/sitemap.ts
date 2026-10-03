import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://asii.site";

  const routes = ["/", "/services", "/platform", "/contact", "/verify"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
  }));
}
