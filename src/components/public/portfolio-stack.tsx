"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/lib/types";

// Symmetric fan spread, center card frontmost. Index 2 is center for a
// 5-card stack; positions scale down gracefully for fewer cards.
const FAN_OFFSETS = [
  { rotate: -14, x: -112, y: 16 },
  { rotate: -7, x: -56, y: 4 },
  { rotate: 0, x: 0, y: -12 },
  { rotate: 7, x: 56, y: 4 },
  { rotate: 14, x: 112, y: 16 },
];

export function PortfolioStack({ artworks }: { artworks: Artwork[] }) {
  const cards = artworks.filter((a) => a.cover_image_url).slice(0, 5);
  const containerRef = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (cards.length === 0) return null;

  // Re-center the offset table when there are fewer than 5 cards, so the
  // fan still spreads evenly around the middle instead of bunching left.
  const startIndex = Math.floor((FAN_OFFSETS.length - cards.length) / 2);
  const centerIndex = (cards.length - 1) / 2;

  return (
    <Link
      ref={containerRef}
      href="/works"
      aria-label="View the full portfolio"
      className="relative mx-auto block h-[360px] w-full max-w-[300px] sm:h-[440px] sm:max-w-sm md:h-[520px] md:max-w-md"
    >
      {cards.map((artwork, i) => {
        const offset = FAN_OFFSETS[startIndex + i];
        const distanceFromCenter = Math.abs(i - centerIndex);
        const baseZ = 50 - Math.round(distanceFromCenter * 10);
        const hovered = hoveredIndex === i;

        const fanTransform = !visible
          ? "translate(-50%, -50%) translate(0px, 18px) rotate(0deg) scale(0.92)"
          : hovered
            ? `translate(-50%, -50%) translate(${offset.x}px, ${offset.y - 22}px) rotate(0deg) scale(1.06)`
            : `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${offset.rotate}deg) scale(1)`;

        return (
          <div
            key={artwork.id}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="absolute left-1/2 top-1/2 w-[64%] transition-all duration-[850ms] ease-cinematic"
            style={{
              transform: fanTransform,
              transitionDelay: visible ? `${i * 90}ms` : "0ms",
              zIndex: hovered ? 100 : baseZ,
              opacity: visible ? 1 : 0,
            }}
          >
            <div className="rounded-[2px] border border-border/70 bg-paper p-2.5 pb-5 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.35)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                <Image
                  src={artwork.cover_image_url!}
                  alt={artwork.title}
                  fill
                  sizes="(min-width: 768px) 280px, 200px"
                  className="object-cover"
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <span className="truncate font-display text-xs text-ink">{artwork.title}</span>
                <span className="shrink-0 text-[9px] uppercase tracking-wide text-muted">
                  No. 0{i + 1}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      <span className="absolute -bottom-9 right-0 eyebrow text-ink/60 transition-colors hover:text-sanguine sm:-bottom-11">
        View All Works →
      </span>
    </Link>
  );
}
