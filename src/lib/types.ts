export type ThemeMode = "light" | "dark" | "system";

export type Artist = {
  id: number;
  name: string;
  brand_name: string;
  short_intro: string;
  biography: string;
  philosophy: string;
  experience: string;
  achievements: string[];
  location: string;
  featured_quote: string;
  portrait_url: string | null;
  signature_url: string | null;
  supporting_image_urls: string[];
};

export type ArtworkCategory = {
  id: string;
  name: string;
  slug: string;
  is_enabled: boolean;
  display_order: number;
};

export type ArtworkProcessStep = {
  id: string;
  artwork_id: string;
  label: string;
  image_url: string;
  display_order: number;
};

export type Artwork = {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  medium: string;
  year: number | null;
  tags: string[];
  description: string;
  story: string;
  cover_image_url: string | null;
  gallery_image_urls: string[];
  is_featured: boolean;
  status: "draft" | "published";
  display_order: number;
  is_demo: boolean;
  seo_title: string | null;
  seo_description: string | null;
  artwork_categories?: ArtworkCategory | null;
  artwork_process_steps?: ArtworkProcessStep[];
};

export type Service = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  starting_price: string | null;
  cta_label: string;
  whatsapp_message: string | null;
  is_featured: boolean;
  is_enabled: boolean;
  display_order: number;
  is_demo: boolean;
};

export type SocialPlatform =
  | "instagram"
  | "youtube"
  | "facebook"
  | "x"
  | "pinterest"
  | "behance"
  | "linkedin"
  | "other";

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  label: string;
  username: string;
  url: string;
  is_enabled: boolean;
  display_order: number;
};

export type SiteSettings = {
  id: 1;
  site_name: string;
  artist_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  site_description: string;
  theme_mode: ThemeMode;
  accent_color: string;
  whatsapp_number: string;
  contact_email: string;
  location: string;
  business_hours: string | null;
  contact_message: string;
  whatsapp_default_message: string;
  whatsapp_commission_message: string;
  whatsapp_wall_painting_message: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_primary_cta: string;
  hero_secondary_cta: string;
  commission_cta_label: string;
  footer_note: string;
  seo_title: string;
  seo_description: string;
  og_image_url: string | null;
  google_verification: string | null;
  analytics_id: string | null;
  maintenance_mode: boolean;
};
