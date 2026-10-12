import Link from "next/link";
import Image from "next/image";
import { Plus, Sparkles, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [
    { data: artist },
    { count: totalArtworks },
    { count: publishedArtworks },
    { count: draftArtworks },
    { count: activeServices },
    { count: socialPlatforms },
    { count: enquiries },
    { data: recentArtworks },
  ] = await Promise.all([
    supabase.from("artist").select("name").eq("id", 1).single(),
    supabase.from("artworks").select("id", { count: "exact", head: true }),
    supabase.from("artworks").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("artworks").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("services").select("id", { count: "exact", head: true }).eq("is_enabled", true),
    supabase.from("social_links").select("id", { count: "exact", head: true }).eq("is_enabled", true),
    supabase.from("enquiry_log").select("id", { count: "exact", head: true }),
    supabase
      .from("artworks")
      .select("id, title, slug, status, cover_image_url, is_demo, updated_at")
      .order("updated_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <div>
      <div className="mb-10">
        <p className="eyebrow">{greeting()}</p>
        <h1 className="mt-1 font-display text-3xl text-ink">{artist?.name ?? "Ravinash"}</h1>
        <p className="mt-1 text-sm text-muted">Here's what's live on the website right now.</p>
      </div>

      {/* Quick actions — large, thumb-friendly tap targets first, mobile-first */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          href="/admin/artworks/new"
          className="flex items-center gap-3 border border-ink bg-ink px-5 py-4 text-paper transition-opacity hover:opacity-90 dark:border-paper dark:bg-paper dark:text-ink"
        >
          <Plus size={18} strokeWidth={2} />
          <span className="text-sm font-medium">Add Artwork</span>
        </Link>
        <Link
          href="/admin/services"
          className="flex items-center gap-3 border border-border/70 px-5 py-4 transition-colors hover:border-sanguine"
        >
          <Sparkles size={18} strokeWidth={1.75} />
          <span className="text-sm font-medium text-ink">Manage Services</span>
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 border border-border/70 px-5 py-4 transition-colors hover:border-sanguine"
        >
          <Settings size={18} strokeWidth={1.75} />
          <span className="text-sm font-medium text-ink">Site Settings</span>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Published" value={publishedArtworks ?? 0} sublabel={`${totalArtworks ?? 0} total works`} />
        <StatCard label="Drafts" value={draftArtworks ?? 0} sublabel="Not yet visible" />
        <StatCard label="Active Services" value={activeServices ?? 0} />
        <StatCard label="Connected Socials" value={socialPlatforms ?? 0} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        <StatCard label="WhatsApp Enquiries" value={enquiries ?? 0} sublabel="CTA clicks logged since launch" />
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <span className="eyebrow">Recently updated</span>
          <Link href="/admin/artworks" className="text-xs text-sanguine hover:underline">
            View all
          </Link>
        </div>

        {!recentArtworks || recentArtworks.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No artworks yet.</p>
        ) : (
          <div className="mt-4 flex flex-col divide-y divide-border/70 border-y border-border/70">
            {recentArtworks.map((artwork) => (
              <Link
                key={artwork.id}
                href={`/admin/artworks/${artwork.id}`}
                className="flex items-center gap-4 py-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface">
                  {artwork.cover_image_url && (
                    <Image
                      src={artwork.cover_image_url}
                      alt={artwork.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{artwork.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge tone={artwork.status === "published" ? "success" : "neutral"}>
                      {artwork.status}
                    </Badge>
                    {artwork.is_demo && <Badge tone="warning">Demo</Badge>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
