import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArtworkRowActions } from "@/components/admin/artwork-row-actions";
import type { Artwork } from "@/lib/types";

export default async function AdminArtworksPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("artworks")
    .select("*, artwork_categories(*)")
    .order("display_order", { ascending: true });
  const artworks = (data ?? []) as Artwork[];

  return (
    <div>
      <AdminPageHeader
        title="Artworks"
        description="Everything shown in your portfolio, managed from here."
        actions={
          <Link href="/admin/artworks/new">
            <Button size="sm">
              <Plus size={14} /> New artwork
            </Button>
          </Link>
        }
      />

      {artworks.length === 0 ? (
        <p className="text-sm text-muted">No artworks yet — add your first piece to get started.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border/70 border-y border-border/70">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="flex items-center gap-5 py-4">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-surface">
                {artwork.cover_image_url && (
                  <Image src={artwork.cover_image_url} alt={artwork.title} fill sizes="56px" className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/admin/artworks/${artwork.id}`} className="truncate font-medium text-ink hover:text-sanguine">
                  {artwork.title}
                </Link>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {[artwork.artwork_categories?.name, artwork.medium, artwork.year].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
              {artwork.is_demo && <Badge tone="warning">Demo</Badge>}
              {artwork.is_featured && <Badge tone="success">Featured</Badge>}
              <Badge tone={artwork.status === "published" ? "success" : "neutral"}>{artwork.status}</Badge>
              <ArtworkRowActions id={artwork.id} status={artwork.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
