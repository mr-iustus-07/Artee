import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ArtworkForm } from "@/components/admin/artwork-form";
import { ProcessStepsManager } from "@/components/admin/process-steps-manager";
import type { Artwork, ArtworkCategory } from "@/lib/types";

export default async function EditArtworkPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: artwork }, { data: categoriesData }] = await Promise.all([
    supabase
      .from("artworks")
      .select("*, artwork_process_steps(*)")
      .eq("id", params.id)
      .single(),
    supabase.from("artwork_categories").select("*").order("display_order"),
  ]);

  if (!artwork) notFound();

  const typedArtwork = artwork as Artwork;
  typedArtwork.artwork_process_steps?.sort((a, b) => a.display_order - b.display_order);
  const categories = (categoriesData ?? []) as ArtworkCategory[];

  return (
    <div className="max-w-3xl">
      <AdminPageHeader title={typedArtwork.title} description="Edit this artwork." />
      <ArtworkForm artwork={typedArtwork} categories={categories} />

      <div className="mt-16">
        <ProcessStepsManager artworkId={typedArtwork.id} steps={typedArtwork.artwork_process_steps ?? []} />
      </div>
    </div>
  );
}
