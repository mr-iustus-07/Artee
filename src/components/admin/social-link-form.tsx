"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { saveSocialLink } from "@/lib/actions/social";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormMessage } from "@/components/ui/form-message";
import type { ActionResult } from "@/lib/actions/auth";
import type { SocialLink } from "@/lib/types";

const initialState: ActionResult = {};
const platforms = ["instagram", "youtube", "facebook", "x", "pinterest", "behance", "linkedin", "other"] as const;

export function SocialLinkForm({ link, onSaved }: { link?: SocialLink; onSaved?: () => void }) {
  const action = saveSocialLink.bind(null, link?.id ?? null);
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state.success) onSaved?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-md border border-border/70 bg-surface/40 p-6"
    >
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <Label htmlFor="platform">Platform</Label>
          <Select id="platform" name="platform" defaultValue={link?.platform ?? "instagram"}>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="label">Label (for "other")</Label>
          <Input id="label" name="label" defaultValue={link?.label ?? ""} placeholder="Threads" />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" defaultValue={link?.username ?? ""} placeholder="@artee.ravinash" />
        </div>
      </div>

      <div>
        <Label htmlFor="url">Profile URL</Label>
        <Input id="url" name="url" type="url" defaultValue={link?.url} required placeholder="https://instagram.com/artee.ravinash" />
      </div>

      {state.error && <FormMessage error={state.error} />}

      <SubmitButton className="w-fit" pendingText="Saving…">
        {link ? "Save changes" : "Add platform"}
      </SubmitButton>
    </form>
  );
}
