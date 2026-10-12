import Link from "next/link";
import { Hero } from "@/components/public/hero";
import { SectionHeading } from "@/components/public/section-heading";
import { ArtworkGrid } from "@/components/public/artwork-grid";
import { AboutPreview } from "@/components/public/about-preview";
import { PortfolioStack } from "@/components/public/portfolio-stack";
import { WallPaintingPromo } from "@/components/public/wall-painting-promo";
import { ServicesPreview } from "@/components/public/services-preview";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { RevealSection } from "@/components/public/reveal-section";
import { getFeaturedArtworks, getPublishedArtworks, getServices, getSiteSettings } from "@/lib/queries";

export default async function HomePage() {
  const [settings, featured, services] = await Promise.all([
    getSiteSettings(),
    getFeaturedArtworks(6),
    getServices(),
  ]);

  const selected = featured.length ? featured : (await getPublishedArtworks()).slice(0, 6);

  return (
    <>
      <Hero />

      {selected.length > 0 && (
        <RevealSection className="py-24 md:py-32">
          <div className="container-artee">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading eyebrow="Selected Works" title="A closer look at recent pieces" />
              <Link href="/works" className="eyebrow shrink-0 text-ink/70 hover:text-sanguine transition-colors">
                View all works →
              </Link>
            </div>
            <div className="mt-14">
              <ArtworkGrid artworks={selected} />
            </div>
          </div>
        </RevealSection>
      )}

      <RevealSection>
        <AboutPreview />
      </RevealSection>

      <RevealSection className="py-24 md:py-32">
        <div className="container-artee">
          <SectionHeading
            eyebrow="Portfolio"
            title="The full collection"
            description="A handful of pieces from the archive — hover to browse, click to see everything."
            align="center"
          />
          <div className="mt-20">
            <PortfolioStack artworks={selected} />
          </div>
        </div>
      </RevealSection>

      {services.length > 0 && (
        <RevealSection className="py-24 md:py-32">
          <div className="container-artee">
            <SectionHeading
              eyebrow="Services"
              title="Ways to work together"
              description="From an intimate portrait to a full room mural, every piece begins as a conversation."
            />
            <div className="mt-14">
              <ServicesPreview services={services} />
            </div>
          </div>
        </RevealSection>
      )}

      <RevealSection>
        <WallPaintingPromo />
      </RevealSection>

      <RevealSection className="border-t border-border/70">
        <div className="container-artee flex flex-col items-center gap-6 py-24 text-center md:py-32">
          <span className="eyebrow">Commission</span>
          <h2 className="max-w-2xl font-display text-4xl leading-[1.1] text-ink md:text-5xl">
            Have an idea in mind? Let's turn it into something tangible.
          </h2>
          <WhatsAppButton
            phoneNumber={settings.whatsapp_number}
            message={settings.whatsapp_commission_message}
            label={settings.commission_cta_label}
            size="lg"
          />
        </div>
      </RevealSection>
    </>
  );
}
