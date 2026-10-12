import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ArtworkCard({
  artwork,
  size = "md",
  priority = false,
}: {
  artwork: Artwork;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}) {
  const aspect = size === "lg" ? "aspect-[4/5]" : size === "sm" ? "aspect-[3/4]" : "aspect-[4/5]";

  return (
    <Link href={`/works/${artwork.slug}`} className="group block">
      <div className={cn("relative overflow-hidden bg-surface", aspect)}>
        {artwork.cover_image_url && (
          <Image
            src={artwork.cover_image_url}
            alt={artwork.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-[1.045]"
          />
        )}
        <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl text-ink transition-colors group-hover:text-sanguine">
            {artwork.title}
          </h3>
          <p className="mt-1 text-xs uppercase tracking-wide text-muted">
            {[artwork.artwork_categories?.name, artwork.medium].filter(Boolean).join(" · ")}
          </p>
        </div>
        {artwork.year && <span className="shrink-0 text-xs text-muted">{artwork.year}</span>}
      </div>
    </Link>
  );
}
