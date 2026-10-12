"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toSlug } from "@/lib/utils";
import { uploadMedia } from "@/lib/actions/media";
import type { ActionResult } from "@/lib/actions/auth";

function parseTags(raw: FormData) {
  return String(raw.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authorized.");
  return supabase;
}

export async function saveArtwork(
  artworkId: string | null,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Title is required." };

  let coverUrl = String(formData.get("existingCoverUrl") || "") || null;
  const coverFile = formData.get("coverImage") as File | null;
  if (coverFile && coverFile.size > 0) {
    coverUrl = await uploadMedia(coverFile, "artworks");
  }

  const galleryFiles = formData.getAll("galleryImages") as File[];
  const existingGallery = formData
    .getAll("existingGalleryUrls")
    .map(String)
    .filter(Boolean);
  const newGalleryUrls = await Promise.all(
    galleryFiles.filter((f) => f.size > 0).map((f) => uploadMedia(f, "artworks"))
  );

  const payload = {
    title,
    slug: String(formData.get("slug") || "").trim() || toSlug(title),
    category_id: String(formData.get("categoryId") || "") || null,
    medium: String(formData.get("medium") || ""),
    year: formData.get("year") ? Number(formData.get("year")) : null,
    tags: parseTags(formData),
    description: String(formData.get("description") || ""),
    story: String(formData.get("story") || ""),
    cover_image_url: coverUrl,
    gallery_image_urls: [...existingGallery, ...newGalleryUrls],
    is_featured: formData.get("isFeatured") === "on",
    status: String(formData.get("status") || "draft"),
    display_order: Number(formData.get("displayOrder") || 0),
    seo_title: String(formData.get("seoTitle") || "") || null,
    seo_description: String(formData.get("seoDescription") || "") || null,
    updated_at: new Date().toISOString(),
  };

  let id = artworkId;
  if (id) {
    const { error } = await supabase.from("artworks").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase.from("artworks").insert(payload).select("id").single();
    if (error) return { error: error.message };
    id = data.id;
  }

  revalidatePath("/admin/artworks");
  revalidatePath("/works");
  revalidatePath("/");
  redirect(`/admin/artworks/${id}`);
}

export async function toggleArtworkStatus(id: string, status: "draft" | "published") {
  const supabase = await requireAdmin();
  await supabase.from("artworks").update({ status }).eq("id", id);
  revalidatePath("/admin/artworks");
  revalidatePath("/works");
}

export async function deleteArtwork(id: string) {
  const supabase = await requireAdmin();
  await supabase.from("artworks").delete().eq("id", id);
  revalidatePath("/admin/artworks");
  revalidatePath("/works");
}

export async function addProcessStep(artworkId: string, formData: FormData): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const label = String(formData.get("label") || "").trim();
  const file = formData.get("image") as File | null;
  if (!label || !file || file.size === 0) return { error: "Label and image are required." };

  const imageUrl = await uploadMedia(file, "process");
  const { count } = await supabase
    .from("artwork_process_steps")
    .select("id", { count: "exact", head: true })
    .eq("artwork_id", artworkId);

  const { error } = await supabase.from("artwork_process_steps").insert({
    artwork_id: artworkId,
    label,
    image_url: imageUrl,
    display_order: count ?? 0,
  });
  if (error) return { error: error.message };

  revalidatePath(`/admin/artworks/${artworkId}`);
  return { success: true };
}

export async function deleteProcessStep(id: string, artworkId: string) {
  const supabase = await requireAdmin();
  await supabase.from("artwork_process_steps").delete().eq("id", id);
  revalidatePath(`/admin/artworks/${artworkId}`);
}
