import type { MetadataRoute } from "next";
import { blogPosts, products, services } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

// Requis par l'export statique : la route doit être générée au build.
export const dynamic = "force-static";

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/a-propos",
    "/solutions",
    "/produits",
    "/services",
    "/etudes-de-cas",
    "/blog",
    "/carrieres",
    "/contact",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...staticPages,
    ...products.map((p) => ({
      url: `${BASE}/produits/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...services.map((s) => ({
      url: `${BASE}/services/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...blogPosts.map((b) => ({
      url: `${BASE}/blog/${b.slug}`,
      lastModified: new Date(b.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
