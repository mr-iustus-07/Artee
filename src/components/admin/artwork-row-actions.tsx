"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteArtwork, toggleArtworkStatus } from "@/lib/actions/artworks";
import { Switch } from "@/components/ui/switch";

export function ArtworkRowActions({
  id,
  status,
}: {
  id: string;
  status: "draft" | "published";
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-4">
      <Switch
        checked={status === "published"}
        onCheckedChange={(checked) =>
          startTransition(async () => {
            await toggleArtworkStatus(id, checked ? "published" : "draft");
            toast.success(checked ? "Published" : "Moved to draft");
          })
        }
        label="Published"
      />
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("Delete this artwork? This can't be undone.")) {
            startTransition(async () => {
              await deleteArtwork(id);
              toast.success("Artwork deleted");
            });
          }
        }}
        className="text-xs text-muted hover:text-red-600 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
