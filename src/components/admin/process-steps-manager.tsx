"use client";

import { useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { addProcessStep, deleteProcessStep } from "@/lib/actions/artworks";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ArtworkProcessStep } from "@/lib/types";

export function ProcessStepsManager({
  artworkId,
  steps,
}: {
  artworkId: string;
  steps: ArtworkProcessStep[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="border border-border/70 p-6">
      <h3 className="font-display text-xl text-ink">Process gallery</h3>
      <p className="mt-1 text-xs text-muted">
        Add each stage — Idea, Sketch, Line Art, Detailing, Final Artwork — in the order they should appear.
      </p>

      {steps.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {steps.map((step) => (
            <div key={step.id} className="relative">
              <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-surface">
                <Image src={step.image_url} alt={step.label} fill sizes="200px" className="object-cover" />
              </div>
              <p className="mt-2 text-xs uppercase tracking-wide text-muted">{step.label}</p>
              <form action={deleteProcessStep.bind(null, step.id, artworkId)}>
                <button
                  type="submit"
                  className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-paper"
                  aria-label={`Remove ${step.label}`}
                >
                  <X size={12} />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <form
        ref={formRef}
        action={async (formData) => {
          await addProcessStep(artworkId, formData);
          formRef.current?.reset();
        }}
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            Step label
          </label>
          <Input name="label" placeholder="Sketch" required />
        </div>
        <div className="flex-1">
          <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            required
            className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-wide file:text-paper dark:file:bg-paper dark:file:text-ink"
          />
        </div>
        <SubmitButton size="sm" pendingText="Adding…">
          Add step
        </SubmitButton>
      </form>
    </div>
  );
}
