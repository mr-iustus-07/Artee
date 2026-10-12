import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { getSiteSettings, getFeaturedArtworks } from "@/lib/queries";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function Hero() {
  const [settings, featured] = await Promise.all([
    getSiteSettings(),
    getFeaturedArtworks(1),
  ]);
  const heroArtwork = featured[0];

  return (
    <section className="relative flex min-h-[92vh] flex-col justify-end overflow-hidden bg-ink">
      {heroArtwork?.cover_image_url ? (
        <Image
          src={heroArtwork.cover_image_url}
          alt={heroArtwork.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80 animate-fade-in"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-ink to-surface" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

      <div className="container-artee relative z-10 pb-16 pt-40 md:pb-24">
        <p className="eyebrow text-paper/70 animate-reveal-up" style={{ opacity: 0 }}>
          {settings.hero_subheadline}
        </p>
        <h1
          className="mt-5 max-w-4xl font-display text-5xl leading-[1.05] text-paper animate-reveal-up md:text-7xl"
          style={{ opacity: 0, animationDelay: "120ms" }}
        >
          {settings.hero_headline}
        </h1>

        <div
          className="mt-10 flex flex-wrap items-center gap-4 animate-reveal-up"
          style={{ opacity: 0, animationDelay: "260ms" }}
        >
          <Link
            href="/works"
            className={cn(
              buttonVariants({ size: "lg" }),
              "border border-paper/40 bg-transparent text-paper hover:-translate-y-px hover:border-paper hover:bg-paper hover:text-ink"
            )}
          >
            {settings.hero_primary_cta}
          </Link>
          <WhatsAppButton
            phoneNumber={settings.whatsapp_number}
            message={settings.whatsapp_commission_message}
            label={settings.hero_secondary_cta}
            variant="secondary"
            size="lg"
          />
        </div>
      </div>

      <div className="container-artee relative z-10 hidden justify-end pb-10 md:flex">
        <ArrowDown size={18} strokeWidth={1.5} className="text-paper/50 animate-bounce" />
      </div>
    </section>
  );
}
