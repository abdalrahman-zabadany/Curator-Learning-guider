import { cn } from "@/lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export function Card({ children, className, hover, style }: CardProps) {
  return (
    <div
      style={style}
      className={cn(
        "rounded-xl border border-zinc-800 bg-zinc-900 p-5",
        hover && "transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800/80",
        className
      )}
    >
      {children}
    </div>
  );
}
