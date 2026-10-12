import Link from "next/link";
import { getSiteSettings, getSocialLinks } from "@/lib/queries";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileMenu } from "@/components/public/mobile-menu";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { ProfileLink } from "@/components/public/profile-link";

const navLinks = [
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const [settings, socialLinks] = await Promise.all([getSiteSettings(), getSocialLinks()]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-paper/85 backdrop-blur">
      <div className="container-artee flex h-20 items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl tracking-[0.08em] text-ink"
          aria-label={`${settings.site_name} home`}
        >
          {settings.site_name}
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="eyebrow text-ink/70 transition-colors hover:text-sanguine"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <ThemeToggle />
          <WhatsAppButton
            phoneNumber={settings.whatsapp_number}
            message={settings.whatsapp_commission_message}
            label={settings.commission_cta_label}
            size="sm"
          />
          <ProfileLink />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ProfileLink />
          <MobileMenu links={navLinks} settings={settings} socialLinks={socialLinks} />
        </div>
      </div>
    </header>
  );
}
