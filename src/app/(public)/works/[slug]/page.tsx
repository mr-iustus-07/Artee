import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArtworkBySlug, getSiteSettings } from "@/lib/queries";
import { ProcessStrip } from "@/components/public/process-strip";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { SectionHeading } from "@/components/public/section-heading";
import { artworkEnquiryMessage } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const artwork = await getArtworkBySlug(params.slug);
  if (!artwork) return {};
  return {
    title: artwork.seo_title || artwork.title,
    description: artwork.seo_description || artwork.description,
    openGraph: artwork.cover_image_url ? { images: [artwork.cover_image_url] } : undefined,
  };
}

export default async function ArtworkDetailPage({ params }: { params: { slug: string } }) {
  const [artwork, settings] = await Promise.all([
    getArtworkBySlug(params.slug),
    getSiteSettings(),
  ]);
  if (!artwork) notFound();

  const meta = [artwork.artwork_categories?.name, artwork.medium, artwork.year ? String(artwork.year) : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <article>
      <div className="relative h-[70vh] w-full bg-surface md:h-[85vh]">
        {artwork.cover_image_url && (
          <Image
            src={artwork.cover_image_url}
            alt={artwork.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="container-artee py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <span className="eyebrow">{meta}</span>
            <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink md:text-5xl">
              {artwork.title}
            </h1>
            {artwork.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-3 py-1 text-[11px] text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-10">
            {artwork.description && (
              <p className="text-lg leading-relaxed text-ink/90">{artwork.description}</p>
            )}
            {artwork.story && (
              <div>
                <span className="eyebrow">Story</span>
                <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-muted">
                  {artwork.story}
                </p>
              </div>
            )}
          </div>
        </div>

        {artwork.gallery_image_urls.length > 0 && (
          <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {artwork.gallery_image_urls.map((url) => (
              <div key={url} className="relative aspect-[4/5] overflow-hidden bg-surface">
                <Image src={url} alt={artwork.title} fill sizes="50vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {artwork.artwork_process_steps && artwork.artwork_process_steps.length > 0 && (
          <div className="mt-24">
            <SectionHeading eyebrow="Process" title="From idea to final artwork" />
            <div className="mt-12">
              <ProcessStrip steps={artwork.artwork_process_steps} />
            </div>
          </div>
        )}

        <div className="mt-24 flex flex-col items-center gap-6 border-t border-border/70 pt-16 text-center">
          <h2 className="font-display text-3xl text-ink md:text-4xl">Want something like this?</h2>
          <p className="max-w-md text-sm text-muted">Commission your own artwork, made for you.</p>
          <WhatsAppButton
            phoneNumber={settings.whatsapp_number}
            message={artworkEnquiryMessage(settings.whatsapp_commission_message, artwork.title)}
            label="Enquire on WhatsApp"
            size="lg"
          />
        </div>
      </div>
    </article>
  );
}
