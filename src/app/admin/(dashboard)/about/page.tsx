import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ArtistProfileForm } from "@/components/admin/artist-profile-form";
import type { Artist } from "@/lib/types";

export default async function AdminAboutPage() {
  const supabase = createClient();
  const { data } = await supabase.from("artist").select("*").eq("id", 1).single();
  const artist = data as Artist;

  return (
    <div className="max-w-3xl">
      <AdminPageHeader title="About the Artist" description="This content powers the public About page." />
      <ArtistProfileForm artist={artist} />
    </div>
  );
}
