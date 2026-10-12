-- =========================================================================
-- ARTEE — Grants fix
-- Run this once in the Supabase SQL Editor, AFTER supabase/schema.sql.
-- Safe to re-run (GRANT is idempotent).
--
-- WHY THIS IS NEEDED:
-- Row Level Security policies only filter which ROWS a role can see/change
-- within an operation it's already allowed to perform. If the role never
-- received a base table-level GRANT, Postgres denies the operation before
-- RLS is even evaluated — which looks exactly like "query returns null,
-- no thrown error surfaces client-side" from the Supabase JS client.
--
-- This script does NOT alter, drop, or replace any RLS policy. It only
-- adds the underlying GRANTs those policies assume already exist.
-- =========================================================================

grant usage on schema public to anon, authenticated;

-- Public (anon) read access — matches the "public can read …" RLS policies
grant select on public.artist                  to anon, authenticated;
grant select on public.artwork_categories      to anon, authenticated;
grant select on public.artworks                to anon, authenticated;
grant select on public.artwork_process_steps   to anon, authenticated;
grant select on public.services                to anon, authenticated;
grant select on public.social_links            to anon, authenticated;
grant select on public.site_settings           to anon, authenticated;

-- Anyone (including anon) can log a WhatsApp CTA click
grant insert on public.enquiry_log to anon, authenticated;

-- Authenticated admin CRUD — matches the "admins manage …" RLS policies.
-- The GRANT is broad here; the RLS policies (using public.is_admin())
-- are what actually restrict this to allow-listed admins.
grant select, insert, update, delete on public.artist                to authenticated;
grant select, insert, update, delete on public.artwork_categories    to authenticated;
grant select, insert, update, delete on public.artworks              to authenticated;
grant select, insert, update, delete on public.artwork_process_steps to authenticated;
grant select, insert, update, delete on public.services              to authenticated;
grant select, insert, update, delete on public.social_links          to authenticated;
grant select, update              on public.site_settings          to authenticated;
grant select                      on public.admins                 to authenticated;
grant select                      on public.enquiry_log             to authenticated;

-- Confirm grants landed (run this SELECT afterwards to sanity-check):
-- select grantee, table_name, privilege_type
-- from information_schema.role_table_grants
-- where table_schema = 'public'
-- order by table_name, grantee;
