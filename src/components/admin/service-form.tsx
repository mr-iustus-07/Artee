"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { saveService } from "@/lib/actions/services";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormMessage } from "@/components/ui/form-message";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { ActionResult } from "@/lib/actions/auth";
import type { Service } from "@/lib/types";

const initialState: ActionResult = {};

export function ServiceForm({ service, onSaved }: { service?: Service; onSaved?: () => void }) {
  const action = saveService.bind(null, service?.id ?? null);
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state.success) onSaved?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-md border border-border/70 bg-surface/40 p-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={service?.title} required />
        </div>
        <div>
          <Label htmlFor="startingPrice">Starting price (optional)</Label>
          <Input id="startingPrice" name="startingPrice" defaultValue={service?.starting_price ?? ""} placeholder="₹4,500" />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={service?.description} />
      </div>

      <ImageUploader
        name="image"
        existingUrlFieldName="existingImageUrl"
        label="Image"
        initialUrl={service?.image_url}
        aspectClassName="aspect-[16/9]"
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="ctaLabel">CTA label</Label>
          <Input id="ctaLabel" name="ctaLabel" defaultValue={service?.cta_label ?? "Enquire on WhatsApp"} />
        </div>
        <div>
          <Label htmlFor="displayOrder">Display order</Label>
          <Input id="displayOrder" name="displayOrder" type="number" defaultValue={service?.display_order ?? 0} />
        </div>
      </div>

      <div>
        <Label htmlFor="whatsappMessage">WhatsApp message (optional override)</Label>
        <Textarea
          id="whatsappMessage"
          name="whatsappMessage"
          defaultValue={service?.whatsapp_message ?? ""}
          placeholder="Leave blank to use the default commission message"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="isFeatured" defaultChecked={service?.is_featured} className="h-4 w-4 accent-current" />
        Feature on home page
      </label>

      {state.error && <FormMessage error={state.error} />}

      <SubmitButton className="w-fit" pendingText="Saving…">
        {service ? "Save changes" : "Add service"}
      </SubmitButton>
    </form>
  );
}
