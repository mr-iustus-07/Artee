"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ArtworkProcessStep } from "@/lib/types";
import { cn } from "@/lib/utils";

function StepFrame({ step, index }: { step: ArtworkProcessStep; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex w-[78vw] shrink-0 snap-start flex-col gap-4 sm:w-[42vw] lg:w-[26vw]">
      <div
        className={cn(
          "relative aspect-[3/4] overflow-hidden bg-surface transition-all duration-[900ms] ease-cinematic",
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
      >
        <Image src={step.image_url} alt={step.label} fill sizes="40vw" className="object-cover" />
      </div>
      <div
        className={cn(
          "flex items-center gap-3 transition-all duration-700 ease-cinematic",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
        style={{ transitionDelay: "120ms" }}
      >
        <span className="font-display text-sm text-sanguine">{String(index + 1).padStart(2, "0")}</span>
        <span className="eyebrow">{step.label}</span>
      </div>
    </div>
  );
}

export function ProcessStrip({ steps }: { steps: ArtworkProcessStep[] }) {
  if (!steps.length) return null;

  return (
    <div className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:mx-0 md:gap-10 md:px-0">
      {steps.map((step, i) => (
        <StepFrame key={step.id} step={step} index={i} />
      ))}
    </div>
  );
}
