# ARTEE — Artist Portfolio & Commission Platform

A premium portfolio website and private admin CMS for the artist **Ravinash**,
built with Next.js 14 (App Router), Tailwind CSS, and Supabase (Postgres +
Auth + Storage).

---

## 1. What's included

**Public site** — Home (restructured as: featured intro → selected works →
about preview → services → wall painting → commission CTA), Works (with
admin-managed categories), Artwork detail (story + process gallery +
WhatsApp CTA), About, Services, Contact. Light/dark/system theming,
mobile-first responsive design, SEO metadata + sitemap.

**Admin CMS** at `/admin` — secure login, mobile-first dashboard (greeting,
recent artwork, bottom navigation on small screens), full CRUD for Artworks
(with cover + gallery + process-step images), Categories, Services, Artist
profile (About), Social links, Demo Content management, and a tabbed
Settings screen (General, Appearance, Contact, Content, SEO, Security,
Advanced).

**Design system** — a warm "gallery paper" palette with a sanguine
(red-chalk) accent, drawn from classical figure-drawing pigments rather than
a generic template look. Fraunces (display serif) + Work Sans (UI sans).
Buttons use a small 3px radius with a restrained hover lift rather than
pills or gradients. See `src/app/globals.css`, `tailwind.config.ts`, and
`src/components/ui/button.tsx` for the tokens.

---

## 2. Prerequisites

- Node.js 18.18+ and npm
- A free [Supabase](https://supabase.com) project
- A WhatsApp Business (or personal) number for commission enquiries

---

## 3. Set up Supabase

Run these **in order** in the Supabase SQL Editor:

1. **`supabase/schema.sql`** — every table, Row Level Security policy, and
   the public `artee-media` storage bucket.
2. **`supabase/grants.sql`** — required. RLS policies only filter which
   *rows* a role can touch within an operation it's already permitted to
   perform; the role still needs a base Postgres `GRANT` on the table.
   Without this step, public reads (site settings, artworks, etc.) can
   silently come back empty even though the RLS policy and the data both
   exist. This script only adds `GRANT`s — it does not touch any RLS
   policy.
3. **`supabase/demo-content.sql`** — optional but recommended for a new
   project. Adds an `is_demo` flag to `artworks`/`services` and seeds a
   small set of demo artworks, wall-painting examples, and services, all
   pointing at local placeholder images in `/public/demo/` (no external
   image hosting needed). See §7 below for how to remove it later.

Then go to **Project Settings → API** and copy:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — it's
  only used once, locally, to create the first admin account. Never paste
  it into a chat, ticket, or commit — if it's ever been shared anywhere
  outside your own machine/host, rotate it from Project Settings → API.)

---

## 4. Local setup

```bash
npm install
cp .env.example .env.local
# fill in .env.local with your Supabase values from step 3
```

### Create the first admin account

Never hardcode credentials — the initial admin is provisioned securely via
Supabase Auth using the service role key, run once from your machine:

```bash
node scripts/create-admin.mjs
```

This uses `INITIAL_ADMIN_EMAIL` / `INITIAL_ADMIN_PASSWORD` from
`.env.local` (defaults to `artee.ravinash@com` / `artee@ravinash` — **change
the password immediately after your first login**, from
**Admin → Settings → Security**).

### Run the dev server

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin CMS: http://localhost:3000/admin/login (on mobile widths, use the
  bottom navigation bar; the sidebar takes over at the `md` breakpoint)

---

## 5. Deploy (Vercel)

1. Push this project to a GitHub repo.
2. Import it into [Vercel](https://vercel.com/new).
3. Add the environment variables from `.env.local` (all of them except
   `INITIAL_ADMIN_EMAIL` / `INITIAL_ADMIN_PASSWORD`, which are only needed
   locally for the bootstrap script) to the Vercel project settings.
4. Set `NEXT_PUBLIC_SITE_URL` to your real production URL.
5. Deploy. Run `node scripts/create-admin.mjs` locally (pointed at your
   production Supabase project) once, to create the real admin account —
   or create it directly via **Supabase → Authentication → Users → Add
   user**, then insert a matching row into the `admins` table with that
   user's `id`.

---

## 6. How content maps to the admin CMS

| Public page | Managed from |
|---|---|
| Home hero, headline, CTA labels | Admin → Settings → Content |
| Home "About" preview + full About page | Admin → About |
| Works / category filters | Admin → Categories |
| Artwork detail pages, process gallery | Admin → Artworks |
| Wall Painting section + example gallery | Admin → Artworks (category: Wall Painting) |
| Services page | Admin → Services |
| Contact page, WhatsApp number & messages | Admin → Settings → Contact |
| Social icons (Contact page + mobile menu) | Admin → Social Media |
| Site name, logo, favicon | Admin → Settings → General |
| Theme default, accent color | Admin → Settings → Appearance |
| Meta title/description, OG image | Admin → Settings → SEO |
| Password, login email, sessions | Admin → Settings → Security |
| Analytics ID, maintenance mode | Admin → Settings → Advanced |
| Placeholder/demo artwork + services | Admin → Demo Content |

Every WhatsApp button on the site is built from the phone number and
message templates in **Settings → Contact** — change the number once and
every CTA site-wide updates.

---

## 7. Demo content

If you ran `supabase/demo-content.sql`, the site launches with a small,
visually-coherent set of placeholder content so it doesn't look empty
before real artwork is uploaded:

- 6 demo artworks (locally generated abstract graphite-sketch SVGs — no
  external image URLs), including one with a full 4-step process gallery
- 2 demo wall-painting examples
- 3 demo services
- A demo artist portrait (only applied if no real portrait is set yet —
  it will never overwrite a real uploaded photo)

Every demo row is flagged `is_demo = true` in the database. To remove it:

**Admin → Demo Content → Delete all demo content.**

This deletes *only* rows where `is_demo = true` — it is scoped at the
database level (`.eq("is_demo", true)`) and cannot touch anything else,
regardless of title or content. Real content you add through the normal
Artworks/Services screens is never flagged as demo and is never affected.

The demo images themselves live in `/public/demo/` (bundled with the app,
not Supabase Storage) — you can delete that folder once you no longer need
it, or regenerate the family with `python3 scripts/generate-demo-art.py`.

---

## 8. Notes, limitations & good next steps

This is a working foundation, iterated across a large brief — not every
micro-detail is pixel-final. A few things worth knowing:

- **Reordering** (categories, social links) uses simple up/down controls
  rather than drag-and-drop, for reliability without extra dependencies.
- **Enquiry tracking**: an `enquiry_log` table and dashboard counter exist,
  but WhatsApp CTA clicks aren't wired to it yet (`logEnquiryClick` in
  `src/lib/queries.ts` is ready to call from any button's `onClick`).
- **Artwork upload is a single form, not the step-by-step mobile wizard**
  (Choose images → Title → Category → Description → Story → Publish)
  described in the brief. The single-page form is fully functional and
  mobile-responsive, but the guided step flow hasn't been built yet — it's
  a meaningful enough UI project to deserve its own focused pass.
- **Motion** uses a lightweight IntersectionObserver-based reveal
  (`src/components/public/reveal-section.tsx`) plus the existing CSS
  keyframe system, rather than adding Framer Motion as a new dependency —
  kept deliberately within the existing animation architecture. Respects
  `prefers-reduced-motion` globally via `globals.css`.
- **Full breakpoint-by-breakpoint QA** (360/390/430px + tablet + desktop,
  across light/dark/system) hasn't been systematically swept — the layouts
  are built mobile-first with standard Tailwind breakpoints throughout,
  but haven't been checked device-by-device.
- **Structured data (JSON-LD)** for Artist/Artwork schema isn't emitted yet.
- **Next.js 14 is end-of-life** (Oct 2025). This project pins the last
  patched 14.x release (`14.2.35`) to close known critical CVEs, but you
  should plan to upgrade to a currently-supported major version before
  relying on this in production long-term.
- The Keshart reference site was used only for high-level UX/information-
  architecture principles (per the brief) — no code, assets, or content
  were copied from it.

---

## 9. Project structure

```
src/
  app/
    (public)/            → Home, Works, About, Services, Contact
    admin/
      login/              → sign-in (outside the dashboard shell)
      (dashboard)/        → protected CMS screens, incl. demo-content/
  components/
    public/               → header, footer, hero, about-preview,
                             wall-painting-promo, reveal-section, etc.
    admin/                 → sidebar, bottom nav, forms, uploaders, managers
    ui/                    → button, input, select, switch, etc.
  lib/
    actions/               → server actions (all writes go through here,
                              incl. actions/demo.ts for demo-content delete)
    supabase/               → browser/server/middleware Supabase clients
    queries.ts               → cached read-only data fetchers for public pages
supabase/
  schema.sql                 → full database schema + RLS policies
  grants.sql                  → required GRANT fix (run after schema.sql)
  demo-content.sql             → optional is_demo column + seed data
scripts/
  create-admin.mjs             → one-time admin bootstrap script
  generate-demo-art.py          → regenerates the local placeholder art
public/demo/                     → generated placeholder artwork (local, no
                                    external image URLs)
```
