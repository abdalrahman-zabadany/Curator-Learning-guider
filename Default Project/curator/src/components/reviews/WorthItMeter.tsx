"use client";

import { cn } from "@/lib/cn";

interface WorthItMeterProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function WorthItMeter({
  percentage,
  size = "md",
  showLabel = true,
  className,
}: WorthItMeterProps) {
  const isWorthIt = percentage >= 60;

  const sizeStyles = {
    sm: { ring: "h-12 w-12", text: "text-xs", stroke: 3, radius: 18 },
    md: { ring: "h-16 w-16", text: "text-sm", stroke: 4, radius: 24 },
    lg: { ring: "h-24 w-24", text: "text-base", stroke: 5, radius: 36 },
  };

  const s = sizeStyles[size];
  const circumference = 2 * Math.PI * s.radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div className={cn("relative", s.ring)}>
        <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${(s.radius + s.stroke) * 2} ${(s.radius + s.stroke) * 2}`}>
          <circle
            cx={s.radius + s.stroke}
            cy={s.radius + s.stroke}
            r={s.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={s.stroke}
            className="text-border"
          />
          <circle
            cx={s.radius + s.stroke}
            cy={s.radius + s.stroke}
            r={s.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={s.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-700 ease-out",
              isWorthIt ? "text-emerald-500" : "text-red-400"
            )}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold leading-none", s.text)}>
            {percentage}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span
          className={cn(
            "text-xs font-medium",
            isWorthIt
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-500 dark:text-red-400"
          )}
        >
          {isWorthIt ? "Worth It" : "Not Worth It"}
        </span>
      )}
    </div>
  );
}
