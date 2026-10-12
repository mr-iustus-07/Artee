import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full min-h-[120px] rounded-md border border-border bg-paper px-3.5 py-3 text-sm text-ink placeholder:text-muted focus:border-sanguine focus:outline-none focus:ring-1 focus:ring-sanguine transition-colors",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
