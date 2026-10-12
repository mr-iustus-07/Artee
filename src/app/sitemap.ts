import type { MetadataRoute } from "next";
import { getPublishedArtworks } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const artworks = await getPublishedArtworks();

  const staticPages = ["", "/works", "/about", "/services", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const artworkPages = artworks.map((artwork) => ({
    url: `${siteUrl}/works/${artwork.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...artworkPages];
}
