"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";

export function GalleryUploader({
  existingUrlsFieldName,
  filesFieldName,
  label,
  initialUrls = [],
}: {
  existingUrlsFieldName: string;
  filesFieldName: string;
  label: string;
  initialUrls?: string[];
}) {
  const [existing, setExisting] = useState<string[]>(initialUrls);
  const [newPreviews, setNewPreviews] = useState<{ file: File; url: string }[]>([]);

  return (
    <div>
      <Label>{label}</Label>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {existing.map((url) => (
          <div key={url} className="relative aspect-square overflow-hidden rounded-md bg-surface">
            <Image src={url} alt="" fill sizes="160px" className="object-cover" />
            <input type="hidden" name={existingUrlsFieldName} value={url} />
            <button
              type="button"
              onClick={() => setExisting((prev) => prev.filter((u) => u !== url))}
              className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-paper"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {newPreviews.map(({ url }, i) => (
          <div key={url} className="relative aspect-square overflow-hidden rounded-md bg-surface">
            <Image src={url} alt="" fill sizes="160px" className="object-cover" />
            <button
              type="button"
              onClick={() => setNewPreviews((prev) => prev.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-paper"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-muted hover:border-sanguine">
          <Upload size={16} strokeWidth={1.5} />
          <span className="text-[10px]">Add</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setNewPreviews((prev) => [
                ...prev,
                ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),
              ]);
            }}
          />
        </label>
      </div>

      {/* Real file inputs submitted with the form — hidden but present so
          FormData picks up every selected file under the same field name. */}
      <div className="hidden">
        {newPreviews.map(({ file }, i) => (
          <FileInputProxy key={i} name={filesFieldName} file={file} />
        ))}
      </div>
    </div>
  );
}

// FormData can't be given a File object directly outside of a real <input>,
// so each newly selected file gets its own single-file input synced via DataTransfer.
function FileInputProxy({ name, file }: { name: string; file: File }) {
  return (
    <input
      type="file"
      name={name}
      ref={(el) => {
        if (el) {
          const dt = new DataTransfer();
          dt.items.add(file);
          el.files = dt.files;
        }
      }}
    />
  );
}
