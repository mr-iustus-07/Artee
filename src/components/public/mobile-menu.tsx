"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { SocialIcons } from "@/components/public/social-icons";
import type { SiteSettings, SocialLink } from "@/lib/types";

export function MobileMenu({
  links,
  settings,
  socialLinks = [],
}: {
  links: { href: string; label: string }[];
  settings: SiteSettings;
  socialLinks?: SocialLink[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center text-ink"
      >
        {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
      </button>

      {open && (
        <div className="fixed inset-0 top-20 z-30 flex flex-col justify-between bg-paper px-8 py-10 animate-fade-in">
          <nav className="flex flex-col gap-6">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl text-ink animate-reveal-up"
                style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-6">
            <WhatsAppButton
              phoneNumber={settings.whatsapp_number}
              message={settings.whatsapp_commission_message}
              label={settings.commission_cta_label}
              className="w-full justify-center"
            />
            <div className="flex items-center justify-between">
              <SocialIcons links={socialLinks} size={18} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
