"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/actions/media";
import type { ActionResult } from "@/lib/actions/auth";

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authorized.");
  return supabase;
}

export async function saveService(
  serviceId: string | null,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Title is required." };

  let imageUrl = String(formData.get("existingImageUrl") || "") || null;
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) imageUrl = await uploadMedia(file, "services");

  const payload = {
    title,
    description: String(formData.get("description") || ""),
    image_url: imageUrl,
    starting_price: String(formData.get("startingPrice") || "") || null,
    cta_label: String(formData.get("ctaLabel") || "Enquire on WhatsApp"),
    whatsapp_message: String(formData.get("whatsappMessage") || "") || null,
    is_featured: formData.get("isFeatured") === "on",
    display_order: Number(formData.get("displayOrder") || 0),
  };

  if (serviceId) {
    const { error } = await supabase.from("services").update(payload).eq("id", serviceId);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("services").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true };
}

export async function toggleService(id: string, isEnabled: boolean) {
  const supabase = await requireAdmin();
  await supabase.from("services").update({ is_enabled: isEnabled }).eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function deleteService(id: string) {
  const supabase = await requireAdmin();
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
}
