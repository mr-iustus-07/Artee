-- =========================================================================
-- ARTEE — Demo content system
-- Run this once in the Supabase SQL Editor, AFTER schema.sql and grants.sql.
-- Safe to re-run: column adds are guarded, seed inserts are keyed by slug
-- so re-running won't duplicate rows.
-- =========================================================================

-- 1. Mark which rows are demo content, so it can be told apart from real
--    client content and removed in one action without touching anything
--    the artist has actually uploaded.
alter table public.artworks add column if not exists is_demo boolean not null default false;
alter table public.services add column if not exists is_demo boolean not null default false;

create index if not exists artworks_is_demo_idx on public.artworks (is_demo);
create index if not exists services_is_demo_idx on public.services (is_demo);

-- 2. Demo categories (safe to keep even after demo artworks are removed —
--    delete manually from Admin → Categories if you don't want them).
insert into public.artwork_categories (name, slug, display_order)
values
  ('Portraits', 'portraits', 0),
  ('Pencil Art', 'pencil-art', 1),
  ('Wall Painting', 'wall-painting', 2)
on conflict (slug) do nothing;

-- 3. Demo artworks — all image paths are LOCAL files under /public/demo/
--    (served directly by Next.js, no external network dependency).
insert into public.artworks
  (title, slug, category_id, medium, year, tags, description, story,
   cover_image_url, gallery_image_urls, is_featured, status, display_order, is_demo)
select
  v.title, v.slug,
  (select id from public.artwork_categories where slug = v.category_slug),
  v.medium, v.year, v.tags, v.description, v.story,
  v.cover_image_url, v.gallery_image_urls, v.is_featured, 'published', v.display_order, true
from (values
  ('Portrait Study I', 'demo-portrait-study-i', 'portraits', 'Graphite on paper', 2026,
   array['portrait','graphite','study'],
   'A demo portrait study used to preview the portfolio layout before real artwork is uploaded.',
   'This is placeholder demo content, generated locally, so the site has something to show before real work is added. Replace it any time from Admin → Artworks, or remove all demo content at once from Admin → Demo Content.',
   '/demo/hero-featured.svg', array['/demo/artwork-01-portrait-study.svg']::text[], true, 0),

  ('Botanical Sketch', 'demo-botanical-sketch', 'pencil-art', 'Pencil on paper', 2026,
   array['botanical','pencil'],
   'A demo pencil study, part of the sample portfolio.',
   'Placeholder demo content — safe to remove once real artwork is uploaded.',
   '/demo/artwork-02-botanical.svg', array[]::text[], false, 1),

  ('Gesture Study', 'demo-gesture-study', 'pencil-art', 'Charcoal on paper', 2025,
   array['gesture','figure'],
   'A demo gesture drawing used to preview the works grid.',
   'Placeholder demo content — safe to remove once real artwork is uploaded.',
   '/demo/artwork-03-gesture.svg', array[]::text[], false, 2),

  ('Still Life Hatch Study', 'demo-still-life-hatch-study', 'pencil-art', 'Graphite on paper', 2025,
   array['still-life','hatching'],
   'A demo hatching study used to preview the works grid.',
   'Placeholder demo content — safe to remove once real artwork is uploaded.',
   '/demo/artwork-04-still-life.svg', array[]::text[], false, 3),

  ('Architectural Study', 'demo-architectural-study', 'pencil-art', 'Ink on paper', 2025,
   array['architecture','line-study'],
   'A demo line study used to preview the works grid.',
   'Placeholder demo content — safe to remove once real artwork is uploaded.',
   '/demo/artwork-05-architectural.svg', array[]::text[], false, 4),

  ('Crosshatch Portrait', 'demo-crosshatch-portrait', 'portraits', 'Ink crosshatch on paper', 2024,
   array['portrait','crosshatch'],
   'A demo crosshatch portrait used to preview the works grid.',
   'This artwork also carries a demo process gallery (Idea → Sketch → Line Art → Final), to preview how the process storytelling section looks on an artwork page. Placeholder demo content — safe to remove once real artwork is uploaded.',
   '/demo/artwork-06-crosshatch.svg', array[]::text[], true, 5)
) as v(title, slug, category_slug, medium, year, tags, description, story, cover_image_url, gallery_image_urls, is_featured, display_order)
on conflict (slug) do nothing;

-- 4. Demo process gallery, attached to the crosshatch portrait piece above.
insert into public.artwork_process_steps (artwork_id, label, image_url, display_order)
select a.id, v.label, v.image_url, v.display_order
from public.artworks a
join (values
  ('Idea', '/demo/process-01-idea.svg', 0),
  ('Sketch', '/demo/process-02-sketch.svg', 1),
  ('Line Art', '/demo/process-03-lineart.svg', 2),
  ('Final Artwork', '/demo/process-04-final.svg', 3)
) as v(label, image_url, display_order) on true
where a.slug = 'demo-crosshatch-portrait'
  and not exists (
    select 1 from public.artwork_process_steps p where p.artwork_id = a.id
  );

-- 5. Demo wall-painting examples (shown in the Wall Painting section gallery).
insert into public.artworks
  (title, slug, category_id, medium, year, tags, description, story,
   cover_image_url, gallery_image_urls, is_featured, status, display_order, is_demo)
select
  v.title, v.slug,
  (select id from public.artwork_categories where slug = 'wall-painting'),
  'Wall mural', 2026, array['mural','wall-painting'],
  'A demo wall mural example.',
  'Placeholder demo content — safe to remove once real project photos are uploaded.',
  v.cover_image_url, array[]::text[], false, 'published', v.display_order, true
from (values
  ('Living Room Mural', 'demo-living-room-mural', '/demo/wall-mural-01.svg', 6),
  ('Cafe Accent Wall', 'demo-cafe-accent-wall', '/demo/wall-mural-02.svg', 7)
) as v(title, slug, cover_image_url, display_order)
on conflict (slug) do nothing;

-- 6. Demo services.
insert into public.services
  (title, description, image_url, starting_price, cta_label, is_featured, is_enabled, display_order, is_demo)
select v.title, v.description, v.image_url, v.starting_price, 'Enquire on WhatsApp', v.is_featured, true, v.display_order, true
from (values
  ('Custom Portrait', 'A hand-drawn portrait made from your reference photo.', '/demo/artwork-01-portrait-study.svg', 'on request', true, 0),
  ('Wall Painting', 'A mural or accent wall, designed and painted on site.', '/demo/wall-mural-01.svg', 'on request', true, 1),
  ('Custom Artwork', 'Artwork created to your brief — subject, size, and medium.', '/demo/artwork-04-still-life.svg', null, false, 2)
) as v(title, description, image_url, starting_price, is_featured, display_order)
where not exists (select 1 from public.services where title = v.title and is_demo = true);

-- 7. Demo artist portrait — only applied if the artist profile has no
--    portrait set yet, so this never overwrites a real uploaded photo.
update public.artist
set portrait_url = '/demo/artist-portrait.svg'
where id = 1 and portrait_url is null;
