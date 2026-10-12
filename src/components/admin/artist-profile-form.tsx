"use client";

import { useFormState } from "react-dom";
import { updateArtistProfile } from "@/lib/actions/settings";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormMessage } from "@/components/ui/form-message";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { ActionResult } from "@/lib/actions/auth";
import type { Artist } from "@/lib/types";

const initialState: ActionResult = {};

export function ArtistProfileForm({ artist }: { artist: Artist }) {
  const [state, formAction] = useFormState(updateArtistProfile, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Artist name</Label>
          <Input id="name" name="name" defaultValue={artist.name} required />
        </div>
        <div>
          <Label htmlFor="brandName">Brand name</Label>
          <Input id="brandName" name="brandName" defaultValue={artist.brand_name} required />
        </div>
      </div>

      <div>
        <Label htmlFor="shortIntro">Short introduction</Label>
        <Textarea id="shortIntro" name="shortIntro" defaultValue={artist.short_intro} />
      </div>

      <div>
        <Label htmlFor="biography">Biography</Label>
        <Textarea id="biography" name="biography" defaultValue={artist.biography} className="min-h-[160px]" />
      </div>

      <div>
        <Label htmlFor="philosophy">Artistic philosophy</Label>
        <Textarea id="philosophy" name="philosophy" defaultValue={artist.philosophy} />
      </div>

      <div>
        <Label htmlFor="experience">Experience</Label>
        <Textarea id="experience" name="experience" defaultValue={artist.experience} />
      </div>

      <div>
        <Label htmlFor="achievements">Achievements (one per line)</Label>
        <Textarea
          id="achievements"
          name="achievements"
          defaultValue={artist.achievements.join("\n")}
          placeholder={"Featured in XYZ Gallery, 2025\nCommissioned mural for ABC Cafe"}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={artist.location} />
        </div>
        <div>
          <Label htmlFor="featuredQuote">Featured quote</Label>
          <Input id="featuredQuote" name="featuredQuote" defaultValue={artist.featured_quote} />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ImageUploader
          name="portrait"
          existingUrlFieldName="existingPortraitUrl"
          label="Portrait photo"
          initialUrl={artist.portrait_url}
          aspectClassName="aspect-[4/5]"
        />
        <ImageUploader
          name="signature"
          existingUrlFieldName="existingSignatureUrl"
          label="Signature (transparent PNG works best)"
          initialUrl={artist.signature_url}
          aspectClassName="aspect-[3/1]"
        />
      </div>

      {state.error && <FormMessage error={state.error} />}
      {state.success && <FormMessage success />}

      <SubmitButton size="lg" className="w-fit" pendingText="Saving…">
        Save profile
      </SubmitButton>
    </form>
  );
}
