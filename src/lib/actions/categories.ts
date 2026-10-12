"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toSlug } from "@/lib/utils";
import type { ActionResult } from "@/lib/actions/auth";

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authorized.");
  return supabase;
}

export async function createCategory(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Name is required." };

  const { count } = await supabase
    .from("artwork_categories")
    .select("id", { count: "exact", head: true });

  const { error } = await supabase.from("artwork_categories").insert({
    name,
    slug: toSlug(name),
    display_order: count ?? 0,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/works");
  return { success: true };
}

export async function updateCategory(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Name is required." };

  const { error } = await supabase
    .from("artwork_categories")
    .update({ name, slug: toSlug(name) })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/works");
  return { success: true };
}

export async function toggleCategory(id: string, isEnabled: boolean) {
  const supabase = await requireAdmin();
  await supabase.from("artwork_categories").update({ is_enabled: isEnabled }).eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/works");
}

export async function deleteCategory(id: string) {
  const supabase = await requireAdmin();
  await supabase.from("artwork_categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/works");
}

export async function reorderCategories(orderedIds: string[]) {
  const supabase = await requireAdmin();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("artwork_categories").update({ display_order: index }).eq("id", id)
    )
  );
  revalidatePath("/admin/categories");
  revalidatePath("/works");
}
