import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoryManager } from "@/components/admin/category-manager";
import type { ArtworkCategory } from "@/lib/types";

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data } = await supabase.from("artwork_categories").select("*").order("display_order");
  const categories = (data ?? []) as ArtworkCategory[];

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Categories"
        description="Organize your portfolio. These appear as filters on the Works page, in this order."
      />
      <CategoryManager categories={categories} />
    </div>
  );
}
