import Link from "next/link";
import type { Metadata } from "next";
import { ArtworkGrid } from "@/components/public/artwork-grid";
import { getCategories, getPublishedArtworks } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Works" };

export default async function WorksPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category;
  const [categories, artworks] = await Promise.all([
    getCategories(),
    getPublishedArtworks(activeCategory),
  ]);

  return (
    <div className="container-artee py-16 md:py-24">
      <div className="max-w-2xl">
        <span className="eyebrow">Portfolio</span>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] text-ink md:text-6xl">
          The Work
        </h1>
      </div>

      {categories.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-b border-border/70 pb-8">
          <Link
            href="/works"
            className={cn(
              "eyebrow transition-colors",
              !activeCategory ? "text-sanguine" : "text-ink/60 hover:text-ink"
            )}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/works?category=${category.slug}`}
              className={cn(
                "eyebrow transition-colors",
                activeCategory === category.slug ? "text-sanguine" : "text-ink/60 hover:text-ink"
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-14">
        {artworks.length > 0 ? (
          <ArtworkGrid artworks={artworks} />
        ) : (
          <p className="py-20 text-center text-sm text-muted">
            New work is being prepared for this category — check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
