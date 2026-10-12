import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type {
  Artist,
  Artwork,
  ArtworkCategory,
  Service,
  SiteSettings,
  SocialLink,
} from "@/lib/types";

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  return data as SiteSettings;
});

export const getArtist = cache(async (): Promise<Artist> => {
  const supabase = createClient();
  const { data } = await supabase.from("artist").select("*").eq("id", 1).single();
  return data as Artist;
});

export const getCategories = cache(async (): Promise<ArtworkCategory[]> => {
  const supabase = createClient();
  const { data } = await supabase
    .from("artwork_categories")
    .select("*")
    .eq("is_enabled", true)
    .order("display_order", { ascending: true });
  return (data ?? []) as ArtworkCategory[];
});

export const getPublishedArtworks = cache(
  async (categorySlug?: string): Promise<Artwork[]> => {
    const supabase = createClient();
    let query = supabase
      .from("artworks")
      .select("*, artwork_categories(*)")
      .eq("status", "published")
      .order("display_order", { ascending: true });

    if (categorySlug) {
      const { data: category } = await supabase
        .from("artwork_categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();
      if (category) query = query.eq("category_id", category.id);
    }

    const { data } = await query;
    return (data ?? []) as Artwork[];
  }
);

export const getFeaturedArtworks = cache(async (limit = 6): Promise<Artwork[]> => {
  const supabase = createClient();
  const { data } = await supabase
    .from("artworks")
    .select("*, artwork_categories(*)")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(limit);
  return (data ?? []) as Artwork[];
});

export const getArtworkBySlug = cache(async (slug: string): Promise<Artwork | null> => {
  const supabase = createClient();
  const { data } = await supabase
    .from("artworks")
    .select("*, artwork_categories(*), artwork_process_steps(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (!data) return null;
  (data as Artwork).artwork_process_steps?.sort((a, b) => a.display_order - b.display_order);
  return data as Artwork;
});

export const getServices = cache(async (): Promise<Service[]> => {
  const supabase = createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_enabled", true)
    .order("display_order", { ascending: true });
  return (data ?? []) as Service[];
});

export const getSocialLinks = cache(async (): Promise<SocialLink[]> => {
  const supabase = createClient();
  const { data } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_enabled", true)
    .order("display_order", { ascending: true });
  return (data ?? []) as SocialLink[];
});

export async function logEnquiryClick(source: string) {
  "use server";
  const supabase = createClient();
  await supabase.from("enquiry_log").insert({ source });
}
