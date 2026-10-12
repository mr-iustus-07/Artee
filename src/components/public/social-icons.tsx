import { Instagram, Youtube, Facebook, Linkedin, Link2 } from "lucide-react";
import type { SocialLink, SocialPlatform } from "@/lib/types";

// lucide-react has no dedicated X, Pinterest, or Behance glyphs, so those
// three use small inline brand marks; everything else uses lucide icons.
function XIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21.5l-7.5 8.57L22.75 22h-6.94l-5.43-7.11L4.13 22H1l8.03-9.17L1.5 2h7.11l4.9 6.49L18.24 2Zm-1.22 18h1.92L7.06 4h-2l12 16Z" />
    </svg>
  );
}
function PinterestIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.32 2 11.7c0 4.02 2.5 7.46 6.03 8.88-.08-.75-.16-1.92.03-2.75.17-.75 1.1-4.77 1.1-4.77s-.28-.56-.28-1.38c0-1.29.76-2.26 1.7-2.26.8 0 1.19.6 1.19 1.31 0 .8-.51 1.99-.77 3.1-.22.92.47 1.68 1.4 1.68 1.68 0 2.97-1.75 2.97-4.26 0-2.23-1.62-3.78-3.93-3.78-2.68 0-4.25 1.98-4.25 4.02 0 .8.31 1.65.7 2.12a.28.28 0 0 1 .06.27c-.07.29-.23.92-.26 1.05-.04.17-.14.2-.32.12-1.19-.55-1.93-2.27-1.93-3.66 0-2.98 2.18-5.72 6.28-5.72 3.3 0 5.86 2.32 5.86 5.43 0 3.24-2.06 5.85-4.91 5.85-.96 0-1.86-.5-2.17-1.08l-.59 2.24c-.21.8-.79 1.81-1.18 2.42.89.27 1.83.42 2.81.42 5.52 0 10-4.32 10-9.7C22 6.32 17.52 2 12 2Z" />
    </svg>
  );
}
function BehanceIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7.8 10.5c1.3-.5 2-1.5 2-2.9 0-2.4-1.8-3.6-4.3-3.6H1v13.9h4.9c2.7 0 4.7-1.3 4.7-3.9 0-1.6-.9-2.9-2.8-3.5ZM3.9 6h2.5c1.1 0 1.9.5 1.9 1.5s-.7 1.6-1.9 1.6H3.9V6Zm2.8 9.9H3.9v-3.5h2.9c1.3 0 2.1.6 2.1 1.7 0 1.2-.9 1.8-2.2 1.8ZM23 12.5c0-3-1.9-5.3-5-5.3-3.1 0-5.2 2.3-5.2 5.5 0 3.3 2.2 5.4 5.4 5.4 2.3 0 3.9-1 4.6-2.9h-2.3c-.3.7-1.1 1.1-2.2 1.1-1.5 0-2.5-.9-2.7-2.4H23v-1.4Zm-8.3-1c.3-1.3 1.2-2 2.4-2 1.3 0 2.1.8 2.3 2h-4.7ZM14 5h6v1.4h-6z" />
    </svg>
  );
}

const platformIcons: Record<SocialPlatform, (props: { size: number }) => JSX.Element> = {
  instagram: ({ size }) => <Instagram size={size} strokeWidth={1.5} />,
  youtube: ({ size }) => <Youtube size={size} strokeWidth={1.5} />,
  facebook: ({ size }) => <Facebook size={size} strokeWidth={1.5} />,
  linkedin: ({ size }) => <Linkedin size={size} strokeWidth={1.5} />,
  x: XIcon,
  pinterest: PinterestIcon,
  behance: BehanceIcon,
  other: ({ size }) => <Link2 size={size} strokeWidth={1.5} />,
};

export function SocialIcons({ links, size = 16 }: { links: SocialLink[]; size?: number }) {
  if (!links.length) return null;
  return (
    <div className="flex items-center gap-4">
      {links.map((link) => {
        const Icon = platformIcons[link.platform] ?? platformIcons.other;
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label || link.platform}
            className="text-ink/60 transition-colors hover:text-sanguine"
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
}
