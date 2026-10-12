"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { saveArtwork } from "@/lib/actions/artworks";
import { toSlug } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormMessage } from "@/components/ui/form-message";
import { ImageUploader } from "@/components/admin/image-uploader";
import { GalleryUploader } from "@/components/admin/gallery-uploader";
import type { ActionResult } from "@/lib/actions/auth";
import type { Artwork, ArtworkCategory } from "@/lib/types";

const initialState: ActionResult = {};

export function ArtworkForm({
  artwork,
  categories,
}: {
  artwork?: Artwork;
  categories: ArtworkCategory[];
}) {
  const action = saveArtwork.bind(null, artwork?.id ?? null);
  const [state, formAction] = useFormState(action, initialState);
  const [isFeatured, setIsFeatured] = useState(artwork?.is_featured ?? false);
  const [slug, setSlug] = useState(artwork?.slug ?? "");
  const [titleTouched, setTitleTouched] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={artwork?.title}
            required
            onChange={(e) => {
              if (!titleTouched) setSlug(toSlug(e.target.value));
            }}
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setTitleTouched(true);
              setSlug(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select id="categoryId" name="categoryId" defaultValue={artwork?.category_id ?? ""}>
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="medium">Medium</Label>
          <Input id="medium" name="medium" defaultValue={artwork?.medium} placeholder="Graphite on paper" />
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <Input id="year" name="year" type="number" defaultValue={artwork?.year ?? undefined} />
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input id="tags" name="tags" defaultValue={artwork?.tags?.join(", ")} placeholder="portrait, graphite, custom" />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={artwork?.description} />
      </div>

      <div>
        <Label htmlFor="story">Story</Label>
        <Textarea
          id="story"
          name="story"
          defaultValue={artwork?.story}
          placeholder="Inspiration, concept, technique, materials, creation process…"
          className="min-h-[180px]"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ImageUploader
          name="coverImage"
          existingUrlFieldName="existingCoverUrl"
          label="Cover image"
          initialUrl={artwork?.cover_image_url}
          aspectClassName="aspect-[4/5]"
        />
        <GalleryUploader
          filesFieldName="galleryImages"
          existingUrlsFieldName="existingGalleryUrls"
          label="Gallery images"
          initialUrls={artwork?.gallery_image_urls}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={artwork?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="displayOrder">Display order</Label>
          <Input id="displayOrder" name="displayOrder" type="number" defaultValue={artwork?.display_order ?? 0} />
        </div>
        <div className="flex items-end gap-3 pb-2">
          <Switch checked={isFeatured} onCheckedChange={setIsFeatured} label="Featured artwork" />
          <input type="hidden" name="isFeatured" value={isFeatured ? "on" : ""} />
          <span className="text-sm text-ink">Featured artwork</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="seoTitle">SEO title</Label>
          <Input id="seoTitle" name="seoTitle" defaultValue={artwork?.seo_title ?? ""} />
        </div>
        <div>
          <Label htmlFor="seoDescription">SEO description</Label>
          <Input id="seoDescription" name="seoDescription" defaultValue={artwork?.seo_description ?? ""} />
        </div>
      </div>

      {state.error && <FormMessage error={state.error} />}

      <SubmitButton size="lg" className="w-fit" pendingText="Saving artwork…">
        {artwork ? "Save changes" : "Create artwork"}
      </SubmitButton>
    </form>
  );
}
