import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-sanguine hover:text-paper dark:bg-paper dark:text-ink dark:hover:bg-sanguine dark:hover:text-paper",
  secondary: "bg-sanguine text-paper hover:opacity-90",
  outline:
    "border border-ink/25 text-ink hover:border-sanguine hover:text-sanguine dark:border-paper/25 dark:text-paper dark:hover:border-sanguine dark:hover:text-sanguine",
  ghost: "text-ink hover:bg-ink/5 dark:text-paper dark:hover:bg-paper/10",
  danger: "bg-red-700 text-white hover:bg-red-800",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-sm",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[3px] uppercase tracking-[0.14em] text-xs font-medium transition-all duration-300 ease-cinematic hover:-translate-y-px active:translate-y-0 active:duration-100 disabled:opacity-40 disabled:pointer-events-none disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sanguine focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
    variants[variant],
    sizes[size],
    className
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>(({ className, variant = "primary", size = "md", ...props }, ref) => (
  <button ref={ref} className={buttonVariants({ variant, size, className })} {...props} />
));
Button.displayName = "Button";
