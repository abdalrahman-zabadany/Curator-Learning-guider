import { cn } from "@/lib/cn";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

export function Avatar({ src, alt, name, size = "md", className }: AvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-hover",
        sizeStyles[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt || name || "Avatar"} className="h-full w-full object-cover" />
      ) : initials ? (
        <span className="font-medium text-muted">{initials}</span>
      ) : (
        <User className="h-1/2 w-1/2 text-muted" />
      )}
    </div>
  );
}
