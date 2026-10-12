"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  reorderCategories,
  toggleCategory,
  updateCategory,
} from "@/lib/actions/categories";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Switch } from "@/components/ui/switch";
import { FormMessage } from "@/components/ui/form-message";
import type { ActionResult } from "@/lib/actions/auth";
import type { ArtworkCategory } from "@/lib/types";

const initialState: ActionResult = {};

function CategoryRow({
  category,
  isFirst,
  isLast,
  onMove,
}: {
  category: ArtworkCategory;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: "up" | "down") => void;
}) {
  const [isPending, startTransition] = useTransition();
  const updateAction = updateCategory.bind(null, category.id);
  const [state, formAction] = useFormState(updateAction, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-4 py-4">
      <div className="flex flex-col text-muted">
        <button type="button" disabled={isFirst} onClick={() => onMove("up")} className="disabled:opacity-30" aria-label="Move up">
          <ChevronUp size={14} />
        </button>
        <button type="button" disabled={isLast} onClick={() => onMove("down")} className="disabled:opacity-30" aria-label="Move down">
          <ChevronDown size={14} />
        </button>
      </div>

      <Input name="name" defaultValue={category.name} className="max-w-xs" />

      <div className="flex items-center gap-2">
        <Switch
          checked={category.is_enabled}
          onCheckedChange={(checked) =>
            startTransition(async () => {
              await toggleCategory(category.id, checked);
              toast.success(checked ? "Category enabled" : "Category hidden");
            })
          }
          label="Enabled"
        />
        <span className="text-xs text-muted">Enabled</span>
      </div>

      <SubmitButton size="sm" variant="outline" pendingText="Saving…">
        Save
      </SubmitButton>

      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm(`Delete "${category.name}"? Artworks in this category will become uncategorized.`)) {
            startTransition(async () => {
              await deleteCategory(category.id);
              toast.success("Category deleted");
            });
          }
        }}
        className="ml-auto text-muted hover:text-red-600"
        aria-label="Delete category"
      >
        <Trash2 size={15} />
      </button>

      {state.error && (
        <div className="w-full">
          <FormMessage error={state.error} />
        </div>
      )}
    </form>
  );
}

export function CategoryManager({ categories }: { categories: ArtworkCategory[] }) {
  const [list, setList] = useState(categories);
  const [createState, createFormAction] = useFormState(createCategory, initialState);

  useEffect(() => {
    setList(categories);
  }, [categories]);

  function move(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const next = [...list];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setList(next);
    reorderCategories(next.map((c) => c.id));
  }

  return (
    <div>
      <form action={createFormAction} className="flex items-end gap-4 border-b border-border/70 pb-8">
        <div className="max-w-xs flex-1">
          <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            New category
          </label>
          <Input name="name" placeholder="Portraits" required />
        </div>
        <SubmitButton pendingText="Adding…">Add category</SubmitButton>
      </form>
      {createState.error && (
        <div className="mt-4">
          <FormMessage error={createState.error} />
        </div>
      )}

      <div className="mt-2 flex flex-col divide-y divide-border/70">
        {list.map((category, i) => (
          <CategoryRow
            key={category.id}
            category={category}
            isFirst={i === 0}
            isLast={i === list.length - 1}
            onMove={(direction) => move(i, direction)}
          />
        ))}
      </div>
    </div>
  );
}
