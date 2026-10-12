import { ArtworkCard } from "@/components/public/artwork-card";
import type { Artwork } from "@/lib/types";
import { cn } from "@/lib/utils";

// Every third artwork in a group of 5 spans two columns, echoing the
// large-image-first editorial layout called for in the brief without
// resorting to a uniform template grid.
const spanPattern = [2, 1, 1, 1, 2];

export function ArtworkGrid({ artworks }: { artworks: Artwork[] }) {
  if (!artworks.length) return null;

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.map((artwork, i) => {
        const span = spanPattern[i % spanPattern.length];
        return (
          <div key={artwork.id} className={cn(span === 2 && "lg:col-span-2")}>
            <ArtworkCard artwork={artwork} size={span === 2 ? "lg" : "md"} priority={i < 2} />
          </div>
        );
      })}
    </div>
  );
}
