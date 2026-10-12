import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "@/lib/actions/auth";

export function AdminTopbar({ email }: { email?: string }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-border/70 px-6 md:px-10">
      <span className="text-sm text-muted">{email}</span>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-ink/70 hover:text-sanguine transition-colors"
          >
            <LogOut size={15} strokeWidth={1.75} />
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
