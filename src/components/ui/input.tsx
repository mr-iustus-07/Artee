import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-border bg-paper px-3.5 text-sm text-ink placeholder:text-muted focus:border-sanguine focus:outline-none focus:ring-1 focus:ring-sanguine transition-colors",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
