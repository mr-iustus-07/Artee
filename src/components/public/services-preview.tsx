import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/types";

export function ServicesPreview({ services }: { services: Service[] }) {
  if (!services.length) return null;

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-3">
      {services.slice(0, 3).map((service) => (
        <Link
          key={service.id}
          href="/services"
          className="group relative flex min-h-[380px] flex-col justify-end bg-ink p-8"
        >
          {service.image_url && (
            <Image
              src={service.image_url}
              alt={service.title}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-40"
            />
          )}
          <div className="relative z-10">
            <h3 className="font-display text-2xl text-paper">{service.title}</h3>
            {service.starting_price && (
              <p className="mt-2 text-xs uppercase tracking-wide text-paper/60">
                From {service.starting_price}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
