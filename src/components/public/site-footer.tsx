import Link from "next/link";
import { getSiteSettings, getSocialLinks } from "@/lib/queries";
import { SocialIcons } from "@/components/public/social-icons";
import { WhatsAppButton } from "@/components/public/whatsapp-button";

const navLinks = [
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export async function SiteFooter() {
  const [settings, socialLinks] = await Promise.all([getSiteSettings(), getSocialLinks()]);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70">
      <div className="container-artee grid gap-12 py-16 md:grid-cols-3 md:py-24">
        <div className="flex flex-col gap-4">
          <span className="font-display text-2xl tracking-[0.08em] text-ink">
            {settings.site_name}
          </span>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            {settings.site_description || `Original artwork by ${settings.artist_name}.`}
          </p>
          <WhatsAppButton
            phoneNumber={settings.whatsapp_number}
            message={settings.whatsapp_commission_message}
            label={settings.commission_cta_label}
            variant="outline"
            size="sm"
            className="mt-2 w-fit"
          />
        </div>

        <nav className="flex flex-col gap-3">
          <span className="eyebrow">Navigate</span>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-ink/80 hover:text-sanguine transition-colors w-fit">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-4">
          <span className="eyebrow">Connect</span>
          {settings.contact_email && (
            <a href={`mailto:${settings.contact_email}`} className="text-sm text-ink/80 hover:text-sanguine transition-colors w-fit">
              {settings.contact_email}
            </a>
          )}
          {settings.location && <span className="text-sm text-muted">{settings.location}</span>}
          <SocialIcons links={socialLinks} />
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container-artee flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted md:flex-row">
          <span>
            © {year} {settings.site_name}. {settings.footer_note}
          </span>
          <span>{settings.artist_name}</span>
        </div>
      </div>
    </footer>
  );
}
