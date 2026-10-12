import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  phoneNumber,
  message,
  label,
  variant = "primary",
  size = "md",
  className,
  showIcon = true,
}: {
  phoneNumber: string;
  message: string;
  label: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}) {
  if (!phoneNumber) return null;
  return (
    <a
      href={buildWhatsAppLink(phoneNumber, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {showIcon && <MessageCircle size={14} strokeWidth={1.75} />}
      {label}
    </a>
  );
}
