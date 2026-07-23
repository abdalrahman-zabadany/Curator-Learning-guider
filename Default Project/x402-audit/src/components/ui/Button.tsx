import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" && "bg-indigo-600 text-white hover:bg-indigo-500",
        variant === "secondary" && "border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
        variant === "ghost" && "text-zinc-400 hover:text-white hover:bg-zinc-800",
        variant === "danger" && "bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        className
      )}
      {...props}
    />
  );
}
