import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DemoContentPanel } from "@/components/admin/demo-content-panel";

export default async function AdminDemoContentPage() {
  const supabase = createClient();

  const [{ count: artworkCount }, { count: serviceCount }] = await Promise.all([
    supabase.from("artworks").select("id", { count: "exact", head: true }).eq("is_demo", true),
    supabase.from("services").select("id", { count: "exact", head: true }).eq("is_demo", true),
  ]);

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Demo Content"
        description="Placeholder artwork and services shown before real content is added."
      />
      <DemoContentPanel artworkCount={artworkCount ?? 0} serviceCount={serviceCount ?? 0} />
    </div>
  );
}
