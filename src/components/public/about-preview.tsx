import Image from "next/image";
import Link from "next/link";
import { getArtist } from "@/lib/queries";

export async function AboutPreview() {
  const artist = await getArtist();
  if (!artist.short_intro && !artist.biography) return null;

  return (
    <section className="py-24 md:py-32">
      <div className="container-artee grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-20">
        {artist.portrait_url && (
          <div className="relative aspect-[4/5] overflow-hidden bg-surface">
            <Image
              src={artist.portrait_url}
              alt={artist.name}
              fill
              sizes="(min-width: 768px) 35vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
        <div>
          <span className="eyebrow">About {artist.name}</span>
          <p className="mt-4 font-display text-3xl leading-[1.2] text-ink md:text-4xl">
            {artist.short_intro || artist.biography.slice(0, 220)}
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-sanguine transition-all hover:gap-3"
          >
            Read the full story →
          </Link>
        </div>
      </div>
    </section>
  );
}
