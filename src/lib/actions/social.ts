"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/actions/auth";
import type { SocialPlatform } from "@/lib/types";

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authorized.");
  return supabase;
}

export async function saveSocialLink(
  linkId: string | null,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const url = String(formData.get("url") || "").trim();
  if (!url) return { error: "Profile URL is required." };

  const payload = {
    platform: String(formData.get("platform") || "other") as SocialPlatform,
    label: String(formData.get("label") || ""),
    username: String(formData.get("username") || ""),
    url,
  };

  if (linkId) {
    const { error } = await supabase.from("social_links").update(payload).eq("id", linkId);
    if (error) return { error: error.message };
  } else {
    const { count } = await supabase
      .from("social_links")
      .select("id", { count: "exact", head: true });
    const { error } = await supabase
      .from("social_links")
      .insert({ ...payload, display_order: count ?? 0 });
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/social");
  revalidatePath("/contact");
  return { success: true };
}

export async function toggleSocialLink(id: string, isEnabled: boolean) {
  const supabase = await requireAdmin();
  await supabase.from("social_links").update({ is_enabled: isEnabled }).eq("id", id);
  revalidatePath("/admin/social");
  revalidatePath("/contact");
}

export async function deleteSocialLink(id: string) {
  const supabase = await requireAdmin();
  await supabase.from("social_links").delete().eq("id", id);
  revalidatePath("/admin/social");
  revalidatePath("/contact");
}

export async function reorderSocialLinks(orderedIds: string[]) {
  const supabase = await requireAdmin();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("social_links").update({ display_order: index }).eq("id", id)
    )
  );
  revalidatePath("/admin/social");
  revalidatePath("/contact");
}
