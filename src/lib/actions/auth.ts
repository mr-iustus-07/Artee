"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error?: string; success?: boolean };

export async function signIn(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // TEMPORARY DIAGNOSTIC — logs server-side only, the user-facing
    // message stays generic on purpose. Remove once the cause is found.
    console.error("ARTEE signIn DEBUG", {
      email,
      status: error.status,
      name: error.name,
      code: (error as { code?: string }).code ?? null,
      message: error.message,
    });
    return { error: "Incorrect email or password." };
  }

  // Confirm this account is actually allow-listed as an admin, not just
  // any Supabase auth user.
  const { data: admin, error: adminLookupError } = await supabase
    .from("admins")
    .select("id")
    .eq("id", data.user.id)
    .single();

  if (!admin) {
    // TEMPORARY DIAGNOSTIC — same as above.
    console.error("ARTEE signIn admin-check DEBUG", {
      userId: data.user.id,
      email: data.user.email,
      adminLookupError: adminLookupError
        ? {
            code: adminLookupError.code,
            message: adminLookupError.message,
            details: adminLookupError.details,
            hint: adminLookupError.hint,
          }
        : null,
    });
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function changePassword(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: "Not signed in." };

  // Re-authenticate with the current password before allowing the change.
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (verifyError) return { error: "Current password is incorrect." };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };

  return { success: true };
}

export async function changeEmail(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const newEmail = String(formData.get("newEmail") || "").trim();
  if (!newEmail) return { error: "Enter a new email address." };

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) return { error: error.message };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("admins").update({ email: newEmail }).eq("id", user.id);
  }

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function signOutAllSessions() {
  const supabase = createClient();
  await supabase.auth.signOut({ scope: "global" });
  redirect("/admin/login");
}
