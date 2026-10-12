"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { ChevronUp, ChevronDown, Plus, Trash2, Pencil } from "lucide-react";
import { deleteSocialLink, reorderSocialLinks, toggleSocialLink } from "@/lib/actions/social";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SocialLinkForm } from "@/components/admin/social-link-form";
import type { SocialLink } from "@/lib/types";

export function SocialManager({ links }: { links: SocialLink[] }) {
  const [list, setList] = useState(links);
  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setList(links);
  }, [links]);

  function move(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const next = [...list];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setList(next);
    reorderSocialLinks(next.map((l) => l.id));
  }

  return (
    <div>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setAddingNew((v) => !v)}>
          <Plus size={14} /> {addingNew ? "Cancel" : "Add platform"}
        </Button>
      </div>

      {addingNew && (
        <div className="mt-6">
          <SocialLinkForm onSaved={() => setAddingNew(false)} />
        </div>
      )}

      <div className="mt-8 flex flex-col divide-y divide-border/70 border-y border-border/70">
        {list.map((link, i) => (
          <div key={link.id} className="py-5">
            <div className="flex items-center gap-4">
              <div className="flex flex-col text-muted">
                <button type="button" disabled={i === 0} onClick={() => move(i, "up")} className="disabled:opacity-30">
                  <ChevronUp size={13} />
                </button>
                <button type="button" disabled={i === list.length - 1} onClick={() => move(i, "down")} className="disabled:opacity-30">
                  <ChevronDown size={13} />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium capitalize text-ink">{link.platform}</p>
                <p className="truncate text-xs text-muted">{link.username || link.url}</p>
              </div>

              <Switch
                checked={link.is_enabled}
                onCheckedChange={(checked) =>
                  startTransition(async () => {
                    await toggleSocialLink(link.id, checked);
                    toast.success(checked ? "Shown on site" : "Hidden from site");
                  })
                }
                label="Enabled"
              />

              <button
                type="button"
                onClick={() => setEditingId(editingId === link.id ? null : link.id)}
                className="text-muted hover:text-sanguine"
                aria-label="Edit"
              >
                <Pencil size={15} />
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  if (confirm(`Remove ${link.platform}?`)) {
                    startTransition(async () => {
                      await deleteSocialLink(link.id);
                      toast.success("Removed");
                    });
                  }
                }}
                className="text-muted hover:text-red-600"
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {editingId === link.id && (
              <div className="mt-5">
                <SocialLinkForm link={link} onSaved={() => setEditingId(null)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
