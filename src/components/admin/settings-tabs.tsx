"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import {
  updateGeneralSettings,
  updateAppearanceSettings,
  updateContactSettings,
  updateContentSettings,
  updateSeoSettings,
  updateAdvancedSettings,
} from "@/lib/actions/settings";
import { changePassword, changeEmail, signOutAllSessions, type ActionResult } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormMessage } from "@/components/ui/form-message";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

const initialState: ActionResult = {};

const tabs = [
  "General",
  "Appearance",
  "Contact",
  "Content",
  "SEO",
  "Security",
  "Advanced",
] as const;
type Tab = (typeof tabs)[number];

export function SettingsTabs({ settings, userEmail }: { settings: SiteSettings; userEmail?: string }) {
  const [active, setActive] = useState<Tab>("General");

  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-border/70">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "px-4 py-3 text-xs uppercase tracking-wide transition-colors",
              active === tab ? "border-b-2 border-sanguine text-ink" : "text-muted hover:text-ink"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-w-2xl py-10">
        {active === "General" && <GeneralTab settings={settings} />}
        {active === "Appearance" && <AppearanceTab settings={settings} />}
        {active === "Contact" && <ContactTab settings={settings} />}
        {active === "Content" && <ContentTab settings={settings} />}
        {active === "SEO" && <SeoTab settings={settings} />}
        {active === "Security" && <SecurityTab userEmail={userEmail} />}
        {active === "Advanced" && <AdvancedTab settings={settings} />}
      </div>
    </div>
  );
}

function GeneralTab({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useFormState(updateGeneralSettings, initialState);
  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="siteName">Website name</Label>
          <Input id="siteName" name="siteName" defaultValue={settings.site_name} required />
        </div>
        <div>
          <Label htmlFor="artistName">Artist name</Label>
          <Input id="artistName" name="artistName" defaultValue={settings.artist_name} required />
        </div>
      </div>
      <div>
        <Label htmlFor="siteDescription">Website description</Label>
        <Textarea id="siteDescription" name="siteDescription" defaultValue={settings.site_description} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <ImageUploader name="logo" existingUrlFieldName="existingLogoUrl" label="Logo" initialUrl={settings.logo_url} aspectClassName="aspect-[3/1]" />
        <ImageUploader name="favicon" existingUrlFieldName="existingFaviconUrl" label="Favicon" initialUrl={settings.favicon_url} aspectClassName="aspect-square" />
      </div>
      {state.error && <FormMessage error={state.error} />}
      {state.success && <FormMessage success />}
      <SubmitButton className="w-fit" pendingText="Saving…">Save general settings</SubmitButton>
    </form>
  );
}

function AppearanceTab({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useFormState(updateAppearanceSettings, initialState);
  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <Label htmlFor="themeMode">Default theme</Label>
        <Select id="themeMode" name="themeMode" defaultValue={settings.theme_mode}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </Select>
        <p className="mt-2 text-xs text-muted">Visitors can still switch themes themselves — this sets the default.</p>
      </div>
      <div>
        <Label htmlFor="accentColor">Accent color</Label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            id="accentColor"
            name="accentColor"
            defaultValue={settings.accent_color}
            className="h-11 w-16 rounded-md border border-border bg-paper"
          />
          <span className="text-sm text-muted">{settings.accent_color}</span>
        </div>
      </div>
      {state.error && <FormMessage error={state.error} />}
      {state.success && <FormMessage success />}
      <SubmitButton className="w-fit" pendingText="Saving…">Save appearance</SubmitButton>
    </form>
  );
}

function ContactTab({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useFormState(updateContactSettings, initialState);
  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="whatsappNumber">WhatsApp number (with country code)</Label>
          <Input id="whatsappNumber" name="whatsappNumber" defaultValue={settings.whatsapp_number} placeholder="+91 98765 43210" required />
        </div>
        <div>
          <Label htmlFor="contactEmail">Email</Label>
          <Input id="contactEmail" name="contactEmail" type="email" defaultValue={settings.contact_email} />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={settings.location} />
        </div>
        <div>
          <Label htmlFor="businessHours">Business hours</Label>
          <Input id="businessHours" name="businessHours" defaultValue={settings.business_hours ?? ""} placeholder="Mon–Sat, 10am–7pm" />
        </div>
      </div>
      <div>
        <Label htmlFor="contactMessage">Contact page message</Label>
        <Textarea id="contactMessage" name="contactMessage" defaultValue={settings.contact_message} />
      </div>

      <div className="border-t border-border/70 pt-6">
        <span className="eyebrow">WhatsApp prefilled messages</span>
        <div className="mt-4 flex flex-col gap-5">
          <div>
            <Label htmlFor="whatsappDefaultMessage">Default message</Label>
            <Textarea id="whatsappDefaultMessage" name="whatsappDefaultMessage" defaultValue={settings.whatsapp_default_message} />
          </div>
          <div>
            <Label htmlFor="whatsappCommissionMessage">Commission message</Label>
            <Textarea id="whatsappCommissionMessage" name="whatsappCommissionMessage" defaultValue={settings.whatsapp_commission_message} />
          </div>
          <div>
            <Label htmlFor="whatsappWallPaintingMessage">Wall painting message</Label>
            <Textarea id="whatsappWallPaintingMessage" name="whatsappWallPaintingMessage" defaultValue={settings.whatsapp_wall_painting_message} />
          </div>
        </div>
      </div>

      {state.error && <FormMessage error={state.error} />}
      {state.success && <FormMessage success />}
      <SubmitButton className="w-fit" pendingText="Saving…">Save contact settings</SubmitButton>
    </form>
  );
}

function ContentTab({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useFormState(updateContentSettings, initialState);
  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <Label htmlFor="heroHeadline">Hero headline</Label>
        <Textarea id="heroHeadline" name="heroHeadline" defaultValue={settings.hero_headline} />
      </div>
      <div>
        <Label htmlFor="heroSubheadline">Hero subheadline</Label>
        <Input id="heroSubheadline" name="heroSubheadline" defaultValue={settings.hero_subheadline} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="heroPrimaryCta">Hero primary button label</Label>
          <Input id="heroPrimaryCta" name="heroPrimaryCta" defaultValue={settings.hero_primary_cta} />
        </div>
        <div>
          <Label htmlFor="heroSecondaryCta">Hero secondary button label</Label>
          <Input id="heroSecondaryCta" name="heroSecondaryCta" defaultValue={settings.hero_secondary_cta} />
        </div>
      </div>
      <div>
        <Label htmlFor="commissionCtaLabel">Commission CTA label (used site-wide)</Label>
        <Input id="commissionCtaLabel" name="commissionCtaLabel" defaultValue={settings.commission_cta_label} />
      </div>
      <div>
        <Label htmlFor="footerNote">Footer note</Label>
        <Input id="footerNote" name="footerNote" defaultValue={settings.footer_note} placeholder="All rights reserved." />
      </div>
      {state.error && <FormMessage error={state.error} />}
      {state.success && <FormMessage success />}
      <SubmitButton className="w-fit" pendingText="Saving…">Save content</SubmitButton>
    </form>
  );
}

function SeoTab({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useFormState(updateSeoSettings, initialState);
  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <Label htmlFor="seoTitle">Meta title</Label>
        <Input id="seoTitle" name="seoTitle" defaultValue={settings.seo_title} />
      </div>
      <div>
        <Label htmlFor="seoDescription">Meta description</Label>
        <Textarea id="seoDescription" name="seoDescription" defaultValue={settings.seo_description} />
      </div>
      <ImageUploader name="ogImage" existingUrlFieldName="existingOgImageUrl" label="Open Graph image" initialUrl={settings.og_image_url} aspectClassName="aspect-[1.91/1]" />
      <div>
        <Label htmlFor="googleVerification">Google site verification code</Label>
        <Input id="googleVerification" name="googleVerification" defaultValue={settings.google_verification ?? ""} />
      </div>
      {state.error && <FormMessage error={state.error} />}
      {state.success && <FormMessage success />}
      <SubmitButton className="w-fit" pendingText="Saving…">Save SEO settings</SubmitButton>
    </form>
  );
}

function SecurityTab({ userEmail }: { userEmail?: string }) {
  const [passwordState, passwordAction] = useFormState(changePassword, initialState);
  const [emailState, emailAction] = useFormState(changeEmail, initialState);

  return (
    <div className="flex flex-col gap-12">
      <div>
        <span className="eyebrow">Signed in as</span>
        <p className="mt-1 text-sm text-ink">{userEmail}</p>
      </div>

      <form action={passwordAction} className="flex flex-col gap-5 border-t border-border/70 pt-8">
        <span className="eyebrow">Change password</span>
        <div>
          <Label htmlFor="currentPassword">Current password</Label>
          <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required minLength={8} />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} />
          </div>
        </div>
        {passwordState.error && <FormMessage error={passwordState.error} />}
        {passwordState.success && <FormMessage success />}
        <SubmitButton className="w-fit" pendingText="Updating…">Update password</SubmitButton>
      </form>

      <form action={emailAction} className="flex flex-col gap-5 border-t border-border/70 pt-8">
        <span className="eyebrow">Change login email</span>
        <div>
          <Label htmlFor="newEmail">New email</Label>
          <Input id="newEmail" name="newEmail" type="email" required />
        </div>
        {emailState.error && <FormMessage error={emailState.error} />}
        {emailState.success && <FormMessage success />}
        <SubmitButton className="w-fit" pendingText="Updating…">Update email</SubmitButton>
      </form>

      <form action={signOutAllSessions} className="border-t border-border/70 pt-8">
        <span className="eyebrow">Sessions</span>
        <p className="mt-2 max-w-md text-sm text-muted">
          Sign out everywhere this account is currently logged in, including other browsers and devices.
        </p>
        <Button type="submit" variant="danger" size="sm" className="mt-4">
          Sign out all sessions
        </Button>
      </form>
    </div>
  );
}

function AdvancedTab({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useFormState(updateAdvancedSettings, initialState);
  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <Label htmlFor="analyticsId">Analytics ID</Label>
        <Input id="analyticsId" name="analyticsId" defaultValue={settings.analytics_id ?? ""} placeholder="G-XXXXXXXXXX" />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="maintenanceMode" defaultChecked={settings.maintenance_mode} className="h-4 w-4 accent-current" />
        Maintenance mode (hides the site from search engines)
      </label>
      {state.error && <FormMessage error={state.error} />}
      {state.success && <FormMessage success />}
      <SubmitButton className="w-fit" pendingText="Saving…">Save advanced settings</SubmitButton>
    </form>
  );
}
