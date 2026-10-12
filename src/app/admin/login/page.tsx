"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { signIn, type ActionResult } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormMessage } from "@/components/ui/form-message";

const initialState: ActionResult = {};

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(signIn, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-2xl tracking-[0.08em] text-ink">
          ARTEE
        </Link>
        <p className="eyebrow mt-2">Studio Sign In</p>

        <form action={formAction} className="mt-10 flex flex-col gap-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="username" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>

          {state.error && <FormMessage error={state.error} />}

          <SubmitButton size="lg" className="mt-2 w-full" pendingText="Signing in…">
            Sign In
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
