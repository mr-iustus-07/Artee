"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ImageUploader({
  name,
  existingUrlFieldName,
  label,
  initialUrl,
  aspectClassName = "aspect-[4/3]",
}: {
  name: string;
  existingUrlFieldName: string;
  label: string;
  initialUrl?: string | null;
  aspectClassName?: string;
}) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [existingUrl, setExistingUrl] = useState<string | null>(initialUrl ?? null);

  return (
    <div>
      <Label>{label}</Label>
      <input type="hidden" name={existingUrlFieldName} value={existingUrl ?? ""} />
      <label
        className={cn(
          "relative flex cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-surface/60 transition-colors hover:border-sanguine",
          aspectClassName
        )}
      >
        {preview ? (
          <Image src={preview} alt="" fill sizes="320px" className="object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted">
            <Upload size={18} strokeWidth={1.5} />
            <span className="text-xs">Click to upload</span>
          </div>
        )}
        <input
          type="file"
          name={name}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
        />
      </label>
      {preview && (
        <button
          type="button"
          onClick={() => {
            setPreview(null);
            setExistingUrl(null);
          }}
          className="mt-2 flex items-center gap-1 text-xs text-muted hover:text-sanguine"
        >
          <X size={12} /> Remove image
        </button>
      )}
    </div>
  );
}
