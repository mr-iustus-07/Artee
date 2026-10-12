import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminBottomNav } from "@/components/admin/admin-bottom-nav";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects unauthenticated visitors, but the check is
  // repeated here so this layout is safe even if it's ever reached directly.
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-paper">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar email={user.email} />
        <main className="flex-1 px-6 pb-24 pt-10 md:px-10 md:pb-10">{children}</main>
      </div>
      <AdminBottomNav />
    </div>
  );
}
