import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { getSiteSettings, getSocialLinks } from "@/lib/queries";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { SocialIcons } from "@/components/public/social-icons";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const [settings, socialLinks] = await Promise.all([getSiteSettings(), getSocialLinks()]);

  return (
    <div className="container-artee py-16 md:py-24">
      <div className="max-w-2xl">
        <span className="eyebrow">Get in Touch</span>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] text-ink md:text-6xl">
          Let's talk about your piece.
        </h1>
        {settings.contact_message && (
          <p className="mt-6 text-base leading-relaxed text-muted">{settings.contact_message}</p>
        )}
      </div>

      <div className="mt-14 flex flex-col gap-6">
        <WhatsAppButton
          phoneNumber={settings.whatsapp_number}
          message={settings.whatsapp_default_message}
          label="Message on WhatsApp"
          size="lg"
          className="w-fit"
        />

        <div className="mt-4 flex flex-col gap-4 text-sm">
          {settings.contact_email && (
            <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-3 text-ink/80 hover:text-sanguine transition-colors w-fit">
              <Mail size={16} strokeWidth={1.5} />
              {settings.contact_email}
            </a>
          )}
          {settings.location && (
            <span className="flex items-center gap-3 text-ink/80">
              <MapPin size={16} strokeWidth={1.5} />
              {settings.location}
            </span>
          )}
          {settings.business_hours && (
            <span className="flex items-center gap-3 text-ink/80">
              <Clock size={16} strokeWidth={1.5} />
              {settings.business_hours}
            </span>
          )}
        </div>

        {socialLinks.length > 0 && (
          <div className="mt-8">
            <span className="eyebrow">Follow along</span>
            <div className="mt-4">
              <SocialIcons links={socialLinks} size={20} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
