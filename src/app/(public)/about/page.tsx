import type { Metadata } from "next";
import Image from "next/image";
import { getArtist, getSiteSettings } from "@/lib/queries";
import { WhatsAppButton } from "@/components/public/whatsapp-button";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [artist, settings] = await Promise.all([getArtist(), getSiteSettings()]);

  return (
    <div className="container-artee py-16 md:py-24">
      <div className="grid gap-16 md:grid-cols-2 md:gap-24">
        <div className="order-2 md:order-1">
          <span className="eyebrow">{artist.brand_name}</span>
          <h1 className="mt-3 font-display text-5xl leading-[1.05] text-ink md:text-6xl">
            {artist.name}
          </h1>

          {artist.short_intro && (
            <p className="mt-6 text-lg leading-relaxed text-ink/90">{artist.short_intro}</p>
          )}
          {artist.biography && (
            <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-muted">
              {artist.biography}
            </p>
          )}

          {artist.featured_quote && (
            <blockquote className="mt-10 border-l-2 border-sanguine pl-6 font-display text-2xl italic leading-snug text-ink">
              “{artist.featured_quote}”
            </blockquote>
          )}

          {artist.philosophy && (
            <div className="mt-10">
              <span className="eyebrow">Philosophy</span>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-muted">
                {artist.philosophy}
              </p>
            </div>
          )}

          {artist.experience && (
            <div className="mt-10">
              <span className="eyebrow">Experience</span>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-muted">
                {artist.experience}
              </p>
            </div>
          )}

          {artist.achievements.length > 0 && (
            <div className="mt-10">
              <span className="eyebrow">Achievements</span>
              <ul className="mt-3 flex flex-col gap-2">
                {artist.achievements.map((item) => (
                  <li key={item} className="text-sm text-ink/80">
                    — {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {artist.location && <p className="mt-10 text-sm text-muted">Based in {artist.location}</p>}

          <div className="mt-10">
            <WhatsAppButton
              phoneNumber={settings.whatsapp_number}
              message={settings.whatsapp_commission_message}
              label={settings.commission_cta_label}
            />
          </div>
        </div>

        <div className="order-1 md:order-2">
          {artist.portrait_url && (
            <div className="relative aspect-[4/5] overflow-hidden bg-surface">
              <Image
                src={artist.portrait_url}
                alt={artist.name}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )}
          {artist.signature_url && (
            <Image
              src={artist.signature_url}
              alt={`${artist.name} signature`}
              width={160}
              height={60}
              className="mt-6 opacity-80 dark:invert"
            />
          )}
        </div>
      </div>
    </div>
  );
}
