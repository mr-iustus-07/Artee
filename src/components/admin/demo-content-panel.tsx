"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { deleteAllDemoContent } from "@/lib/actions/demo";
import { Button } from "@/components/ui/button";

export function DemoContentPanel({
  artworkCount,
  serviceCount,
}: {
  artworkCount: number;
  serviceCount: number;
}) {
  const [isPending, startTransition] = useTransition();
  const total = artworkCount + serviceCount;

  function handleDelete() {
    const confirmed = confirm(
      `This removes only content marked as demo — ${artworkCount} demo artwork(s) and ${serviceCount} demo service(s). Your real content is never touched. Continue?`
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteAllDemoContent();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Demo content removed.");
      }
    });
  }

  if (total === 0) {
    return (
      <div className="border border-border/70 p-8 text-center">
        <p className="text-sm text-muted">
          No demo content remains — everything on the site is real content you've added.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border/70 p-8">
      <div className="flex items-start gap-4">
        <AlertTriangle size={20} strokeWidth={1.5} className="mt-1 shrink-0 text-sanguine" />
        <div>
          <p className="text-sm text-ink">
            <strong>{artworkCount}</strong> demo artwork{artworkCount === 1 ? "" : "s"} and{" "}
            <strong>{serviceCount}</strong> demo service{serviceCount === 1 ? "" : "s"} are currently
            visible on the site.
          </p>
          <p className="mt-2 max-w-lg text-sm text-muted">
            These were seeded so the portfolio has something to show before real artwork is
            uploaded. They're clearly separate from your own content and can be removed in one
            action, any time — nothing marked as real content is ever affected.
          </p>
        </div>
      </div>

      <Button variant="danger" size="sm" className="mt-6" disabled={isPending} onClick={handleDelete}>
        {isPending ? "Removing…" : "Delete all demo content"}
      </Button>
    </div>
  );
}
