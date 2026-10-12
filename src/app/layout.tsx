import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteSettings } from "@/lib/queries";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  return {
    metadataBase: new URL(siteUrl),
    title: { default: settings.seo_title, template: `%s · ${settings.site_name}` },
    description: settings.seo_description,
    icons: settings.favicon_url ? [{ url: settings.favicon_url }] : undefined,
    openGraph: {
      title: settings.seo_title,
      description: settings.seo_description,
      siteName: settings.site_name,
      images: settings.og_image_url ? [settings.og_image_url] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo_title,
      description: settings.seo_description,
      images: settings.og_image_url ? [settings.og_image_url] : undefined,
    },
    verification: settings.google_verification
      ? { google: settings.google_verification }
      : undefined,
    robots: settings.maintenance_mode ? { index: false, follow: false } : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${sans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme={settings.theme_mode}
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" theme="system" />
        </ThemeProvider>
      </body>
    </html>
  );
}
