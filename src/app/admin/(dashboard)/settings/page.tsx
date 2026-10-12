import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsTabs } from "@/components/admin/settings-tabs";
import type { SiteSettings } from "@/lib/types";

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const [{ data: settings }, { data: userData }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase.auth.getUser(),
  ]);

  return (
    <div>
      <AdminPageHeader title="Settings" description="Everything that controls how the site looks and behaves." />
      <SettingsTabs settings={settings as SiteSettings} userEmail={userData.user?.email} />
    </div>
  );
}
