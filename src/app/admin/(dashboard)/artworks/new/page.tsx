import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ArtworkForm } from "@/components/admin/artwork-form";
import type { ArtworkCategory } from "@/lib/types";

export default async function NewArtworkPage() {
  const supabase = createClient();
  const { data } = await supabase.from("artwork_categories").select("*").order("display_order");
  const categories = (data ?? []) as ArtworkCategory[];

  return (
    <div className="max-w-3xl">
      <AdminPageHeader title="New Artwork" description="Add a new piece to your portfolio." />
      <ArtworkForm categories={categories} />
    </div>
  );
}
