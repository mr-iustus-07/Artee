"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";
import { deleteService, toggleService } from "@/lib/actions/services";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ServiceForm } from "@/components/admin/service-form";
import type { Service } from "@/lib/types";

export function ServicesManager({ services }: { services: Service[] }) {
  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setAddingNew((v) => !v)}>
          <Plus size={14} /> {addingNew ? "Cancel" : "New service"}
        </Button>
      </div>

      {addingNew && (
        <div className="mt-6">
          <ServiceForm onSaved={() => setAddingNew(false)} />
        </div>
      )}

      <div className="mt-8 flex flex-col divide-y divide-border/70 border-y border-border/70">
        {services.map((service) => (
          <div key={service.id} className="py-5">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-surface">
                {service.image_url && (
                  <Image src={service.image_url} alt={service.title} fill sizes="80px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-ink">{service.title}</p>
                  {service.is_demo && <Badge tone="warning">Demo</Badge>}
                </div>
                {service.starting_price && <p className="text-xs text-muted">From {service.starting_price}</p>}
              </div>

              <Switch
                checked={service.is_enabled}
                onCheckedChange={(checked) =>
                  startTransition(async () => {
                    await toggleService(service.id, checked);
                    toast.success(checked ? "Service enabled" : "Service hidden");
                  })
                }
                label="Enabled"
              />

              <button
                type="button"
                onClick={() => setEditingId(editingId === service.id ? null : service.id)}
                className="text-muted hover:text-sanguine"
                aria-label="Edit service"
              >
                <Pencil size={15} />
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  if (confirm(`Delete "${service.title}"?`)) {
                    startTransition(async () => {
                      await deleteService(service.id);
                      toast.success("Service deleted");
                    });
                  }
                }}
                className="text-muted hover:text-red-600"
                aria-label="Delete service"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {editingId === service.id && (
              <div className="mt-5">
                <ServiceForm service={service} onSaved={() => setEditingId(null)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
