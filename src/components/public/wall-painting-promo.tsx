import Image from "next/image";
import Link from "next/link";
import { getSiteSettings, getPublishedArtworks } from "@/lib/queries";
import { WhatsAppButton } from "@/components/public/whatsapp-button";

export async function WallPaintingPromo() {
  const [settings, wallExamples] = await Promise.all([
    getSiteSettings(),
    getPublishedArtworks("wall-painting"),
  ]);

  return (
    <section className="border-y border-border/70 bg-surface">
      <div className="container-artee flex flex-col items-start gap-8 py-24 md:flex-row md:items-end md:justify-between md:py-32">
        <div className="max-w-2xl">
          <span className="eyebrow">Wall Painting</span>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] text-ink md:text-6xl">
            Walls can tell stories.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
            From a single accent wall to a full mural, every wall painting is designed
            around the room it lives in and painted by hand, on site.
          </p>
        </div>
        <WhatsAppButton
          phoneNumber={settings.whatsapp_number}
          message={settings.whatsapp_wall_painting_message}
          label="Discuss a Wall Project"
          size="lg"
        />
      </div>

      {wallExamples.length > 0 && (
        <div className="container-artee grid grid-cols-2 gap-4 pb-16 sm:grid-cols-3 md:pb-24">
          {wallExamples.slice(0, 3).map((artwork) => (
            <Link key={artwork.id} href={`/works/${artwork.slug}`} className="group relative aspect-[4/3] overflow-hidden bg-ink/5">
              {artwork.cover_image_url && (
                <Image
                  src={artwork.cover_image_url}
                  alt={artwork.title}
                  fill
                  sizes="(min-width: 768px) 30vw, 45vw"
                  className="object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-[1.04]"
                />
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
