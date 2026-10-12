import type { Metadata } from "next";
import Image from "next/image";
import { getServices, getSiteSettings } from "@/lib/queries";
import { WhatsAppButton } from "@/components/public/whatsapp-button";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettings()]);

  return (
    <div className="container-artee py-16 md:py-24">
      <div className="max-w-2xl">
        <span className="eyebrow">Services</span>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] text-ink md:text-6xl">
          Ways to work together
        </h1>
      </div>

      {services.length === 0 ? (
        <p className="mt-16 text-sm text-muted">Services will be listed here shortly.</p>
      ) : (
        <div className="mt-16 flex flex-col divide-y divide-border/70">
          {services.map((service) => (
            <div key={service.id} className="grid gap-8 py-14 md:grid-cols-[1fr_1.4fr] md:gap-16">
              {service.image_url ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <Image
                    src={service.image_url}
                    alt={service.title}
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div />
              )}
              <div className="flex flex-col items-start gap-5">
                <h2 className="font-display text-3xl text-ink">{service.title}</h2>
                {service.description && (
                  <p className="max-w-lg text-base leading-relaxed text-muted">{service.description}</p>
                )}
                {service.starting_price && (
                  <span className="eyebrow">Starting at {service.starting_price}</span>
                )}
                <WhatsAppButton
                  phoneNumber={settings.whatsapp_number}
                  message={service.whatsapp_message || settings.whatsapp_commission_message}
                  label={service.cta_label}
                  variant="outline"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
