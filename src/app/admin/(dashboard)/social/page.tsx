import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SocialManager } from "@/components/admin/social-manager";
import type { SocialLink } from "@/lib/types";

export default async function AdminSocialPage() {
  const supabase = createClient();
  const { data } = await supabase.from("social_links").select("*").order("display_order");
  const links = (data ?? []) as SocialLink[];

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Social Media"
        description="Platforms shown on your Contact page and in the mobile menu, in this order."
      />
      <SocialManager links={links} />
    </div>
  );
}
