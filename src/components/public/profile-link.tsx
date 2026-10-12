import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A small, icon-only link to /admin. Deliberately unlabeled in the UI
 * (just the icon, with an aria-label for accessibility) so it doesn't
 * read as a public "Admin" call-to-action — existing middleware already
 * sends signed-out visitors to /admin/login and signed-in sessions
 * straight to the dashboard, so this one link works for both states.
 */
export function ProfileLink({ className }: { className?: string }) {
  return (
    <Link
      href="/admin"
      aria-label="Studio sign in"
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full text-ink/70 transition-colors hover:text-sanguine",
        className
      )}
    >
      <CircleUserRound size={19} strokeWidth={1.5} />
    </Link>
  );
}
