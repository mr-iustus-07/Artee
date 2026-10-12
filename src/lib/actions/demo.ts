"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authorized.");
  return supabase;
}

/**
 * Deletes ONLY rows explicitly flagged is_demo = true. Never touches any
 * other row, regardless of title/content — this is the one safeguard the
 * brief asks for, so it's kept simple and literal on purpose.
 */
export async function deleteAllDemoContent(): Promise<{ error?: string; success?: boolean }> {
  const supabase = await requireAdmin();

  const { error: artworksError } = await supabase.from("artworks").delete().eq("is_demo", true);
  if (artworksError) return { error: `Artworks: ${artworksError.message}` };

  const { error: servicesError } = await supabase.from("services").delete().eq("is_demo", true);
  if (servicesError) return { error: `Services: ${servicesError.message}` };

  // artwork_process_steps clean up automatically via ON DELETE CASCADE.
  // Demo images live under /public/demo (bundled with the app, not
  // Supabase Storage), so there's no remote storage object to clean up.

  revalidatePath("/admin", "layout");
  revalidatePath("/", "layout");
  revalidatePath("/works");
  revalidatePath("/services");

  return { success: true };
}
