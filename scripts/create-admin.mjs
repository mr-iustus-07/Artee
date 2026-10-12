// One-time bootstrap script: creates the first admin account.
// Usage:  node scripts/create-admin.mjs
// Reads INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD / SUPABASE_SERVICE_ROLE_KEY
// from your .env.local — never commit real values, never ship this key to the client.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function loadEnvLocal() {
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
    }
  } catch {
    // .env.local not found — assume env vars are already set (e.g. CI)
  }
}
loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.INITIAL_ADMIN_EMAIL;
const password = process.env.INITIAL_ADMIN_PASSWORD;

if (!url || !serviceKey || !email || !password) {
  console.error(
    "Missing one of NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: created, error: createError } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (createError) {
  console.error("Could not create admin user:", createError.message);
  console.error("If the user already exists, add it to the `admins` table manually in Supabase.");
  process.exit(1);
}

const { error: insertError } = await supabase
  .from("admins")
  .insert({ id: created.user.id, email });

if (insertError) {
  console.error("User created, but failed to add to admins table:", insertError.message);
  process.exit(1);
}

console.log(`Admin account ready for ${email}.`);
console.log("IMPORTANT: sign in and change this password immediately under Admin → Settings → Security.");
