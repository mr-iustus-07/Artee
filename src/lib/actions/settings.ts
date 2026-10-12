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

export async function updateGeneralSettings(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  let logoUrl = String(formData.get("existingLogoUrl") || "") || null;
  const logoFile = formData.get("logo") as File | null;
  if (logoFile && logoFile.size > 0) logoUrl = await uploadMedia(logoFile, "site");

  let faviconUrl = String(formData.get("existingFaviconUrl") || "") || null;
  const faviconFile = formData.get("favicon") as File | null;
  if (faviconFile && faviconFile.size > 0) faviconUrl = await uploadMedia(faviconFile, "site");

  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name: String(formData.get("siteName") || "ARTEE"),
      artist_name: String(formData.get("artistName") || "Ravinash"),
      site_description: String(formData.get("siteDescription") || ""),
      logo_url: logoUrl,
      favicon_url: faviconUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateAppearanceSettings(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .update({
      theme_mode: String(formData.get("themeMode") || "system"),
      accent_color: String(formData.get("accentColor") || "#A63D2F"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateContactSettings(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .update({
      whatsapp_number: String(formData.get("whatsappNumber") || ""),
      contact_email: String(formData.get("contactEmail") || ""),
      location: String(formData.get("location") || ""),
      business_hours: String(formData.get("businessHours") || "") || null,
      contact_message: String(formData.get("contactMessage") || ""),
      whatsapp_default_message: String(formData.get("whatsappDefaultMessage") || ""),
      whatsapp_commission_message: String(formData.get("whatsappCommissionMessage") || ""),
      whatsapp_wall_painting_message: String(formData.get("whatsappWallPaintingMessage") || ""),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateContentSettings(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .update({
      hero_headline: String(formData.get("heroHeadline") || ""),
      hero_subheadline: String(formData.get("heroSubheadline") || ""),
      hero_primary_cta: String(formData.get("heroPrimaryCta") || ""),
      hero_secondary_cta: String(formData.get("heroSecondaryCta") || ""),
      commission_cta_label: String(formData.get("commissionCtaLabel") || ""),
      footer_note: String(formData.get("footerNote") || ""),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateSeoSettings(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  let ogImageUrl = String(formData.get("existingOgImageUrl") || "") || null;
  const ogFile = formData.get("ogImage") as File | null;
  if (ogFile && ogFile.size > 0) ogImageUrl = await uploadMedia(ogFile, "site");

  const { error } = await supabase
    .from("site_settings")
    .update({
      seo_title: String(formData.get("seoTitle") || ""),
      seo_description: String(formData.get("seoDescription") || ""),
      og_image_url: ogImageUrl,
      google_verification: String(formData.get("googleVerification") || "") || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateAdvancedSettings(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .update({
      analytics_id: String(formData.get("analyticsId") || "") || null,
      maintenance_mode: formData.get("maintenanceMode") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateArtistProfile(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  let portraitUrl = String(formData.get("existingPortraitUrl") || "") || null;
  const portraitFile = formData.get("portrait") as File | null;
  if (portraitFile && portraitFile.size > 0) portraitUrl = await uploadMedia(portraitFile, "artist");

  let signatureUrl = String(formData.get("existingSignatureUrl") || "") || null;
  const signatureFile = formData.get("signature") as File | null;
  if (signatureFile && signatureFile.size > 0)
    signatureUrl = await uploadMedia(signatureFile, "artist");

  const achievements = String(formData.get("achievements") || "")
    .split("\n")
    .map((a) => a.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from("artist")
    .update({
      name: String(formData.get("name") || "Ravinash"),
      brand_name: String(formData.get("brandName") || "ARTEE"),
      short_intro: String(formData.get("shortIntro") || ""),
      biography: String(formData.get("biography") || ""),
      philosophy: String(formData.get("philosophy") || ""),
      experience: String(formData.get("experience") || ""),
      achievements,
      location: String(formData.get("location") || ""),
      featured_quote: String(formData.get("featuredQuote") || ""),
      portrait_url: portraitUrl,
      signature_url: signatureUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { error: error.message };
  revalidatePath("/about");
  revalidatePath("/", "layout");
  return { success: true };
}
