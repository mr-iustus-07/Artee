import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning";
}) {
  const tones = {
    neutral: "bg-ink/5 text-muted dark:bg-paper/10",
    success: "bg-emerald-700/10 text-emerald-700 dark:text-emerald-400",
    warning: "bg-amber-700/10 text-amber-700 dark:text-amber-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}
