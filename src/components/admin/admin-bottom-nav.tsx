"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image as ImageIcon, Plus, Sparkles, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Home", icon: Home, exact: true },
  { href: "/admin/artworks", label: "Works", icon: ImageIcon },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-paper/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="relative flex h-16 items-center justify-around px-2">
        {items.slice(0, 2).map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] uppercase tracking-wide transition-colors",
                active ? "text-sanguine" : "text-muted"
              )}
            >
              <Icon size={19} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}

        {/* Elevated primary action — adding artwork is the most common task on mobile */}
        <Link
          href="/admin/artworks/new"
          aria-label="Add artwork"
          className="relative -top-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sanguine text-paper shadow-lg transition-transform active:scale-95"
        >
          <Plus size={24} strokeWidth={2} />
        </Link>

        {items.slice(2).map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] uppercase tracking-wide transition-colors",
                active ? "text-sanguine" : "text-muted"
              )}
            >
              <Icon size={19} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
