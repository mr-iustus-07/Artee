"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  FolderTree,
  Sparkles,
  Share2,
  Settings,
  ExternalLink,
  User,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/artworks", label: "Artworks", icon: ImageIcon },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/social", label: "Social Media", icon: Share2 },
  { href: "/admin/demo-content", label: "Demo Content", icon: FlaskConical },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border/70 bg-surface/40 md:flex">
      <div className="flex h-20 items-center px-8">
        <span className="font-display text-lg tracking-[0.08em] text-ink">ARTEE Studio</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-2.5 text-sm transition-colors",
                active ? "bg-ink text-paper dark:bg-paper dark:text-ink" : "text-ink/70 hover:bg-ink/5 dark:hover:bg-paper/5"
              )}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/70 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm text-ink/70 hover:bg-ink/5 dark:hover:bg-paper/5"
        >
          <ExternalLink size={16} strokeWidth={1.75} />
          View site
        </Link>
      </div>
    </aside>
  );
}
