import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServicesManager } from "@/components/admin/services-manager";
import type { Service } from "@/lib/types";

export default async function AdminServicesPage() {
  const supabase = createClient();
  const { data } = await supabase.from("services").select("*").order("display_order");
  const services = (data ?? []) as Service[];

  return (
    <div className="max-w-3xl">
      <AdminPageHeader title="Services" description="What you offer, and how each one converts to a WhatsApp enquiry." />
      <ServicesManager services={services} />
    </div>
  );
}
