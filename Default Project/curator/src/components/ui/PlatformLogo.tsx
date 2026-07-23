import { cn } from "@/lib/cn";

interface PlatformLogoProps {
  platform: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const logos: Record<string, { svg: React.ReactNode; color: string; label: string }> = {
  Coursera: {
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor" className="h-full w-full">
        <text x="4" y="28" fontSize="22" fontWeight="700" fontFamily="sans-serif">coursera</text>
      </svg>
    ),
    color: "bg-[#0056D2] text-white border-[#0056D2]",
    label: "Coursera",
  },
  Udemy: {
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor" className="h-full w-full">
        <text x="8" y="28" fontSize="22" fontWeight="800" fontFamily="sans-serif">udemy</text>
      </svg>
    ),
    color: "bg-[#A435F0] text-white border-[#A435F0]",
    label: "Udemy",
  },
  edX: {
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor" className="h-full w-full">
        <text x="18" y="28" fontSize="22" fontWeight="700" fontFamily="sans-serif">edX</text>
      </svg>
    ),
    color: "bg-[#02262B] text-white border-[#02262B]",
    label: "edX",
  },
  YouTube: {
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor" className="h-full w-full">
        <rect x="8" y="8" width="24" height="18" rx="4" fill="white" />
        <polygon points="18,13 18,23 26,18" fill="#FF0000" />
        <text x="38" y="26" fontSize="14" fontWeight="600" fontFamily="sans-serif">YouTube</text>
      </svg>
    ),
    color: "bg-[#FF0000] text-white border-[#FF0000]",
    label: "YouTube",
  },
  "Frontend Masters": {
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor" className="h-full w-full">
        <text x="6" y="26" fontSize="14" fontWeight="700" fontFamily="sans-serif">FRONTEND</text>
        <text x="6" y="36" fontSize="10" fontWeight="400" fontFamily="sans-serif">MASTERS</text>
      </svg>
    ),
    color: "bg-[#0F0F0F] text-white border-[#0F0F0F]",
    label: "Frontend Masters",
  },
  "DeepLearning.AI": {
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor" className="h-full w-full">
        <circle cx="16" cy="20" r="8" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="16" cy="20" r="3" fill="white" />
        <text x="30" y="24" fontSize="11" fontWeight="600" fontFamily="sans-serif">DeepLearning.AI</text>
      </svg>
    ),
    color: "bg-[#0037D1] text-white border-[#0037D1]",
    label: "DeepLearning.AI",
  },
  "DataTalks.Club": {
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor" className="h-full w-full">
        <circle cx="14" cy="20" r="8" fill="white" opacity="0.2" />
        <circle cx="14" cy="20" r="4" fill="white" />
        <text x="28" y="24" fontSize="11" fontWeight="600" fontFamily="sans-serif">DataTalks.Club</text>
      </svg>
    ),
    color: "bg-[#157373] text-white border-[#157373]",
    label: "DataTalks.Club",
  },
  "LinkedIn Learning": {
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor" className="h-full w-full">
        <rect x="6" y="8" width="22" height="22" rx="3" fill="white" />
        <text x="10" y="25" fontSize="15" fontWeight="700" fontFamily="sans-serif" fill="#0A66C2">in</text>
        <text x="34" y="24" fontSize="10" fontWeight="500" fontFamily="sans-serif">LinkedIn Learning</text>
      </svg>
    ),
    color: "bg-[#0A66C2] text-white border-[#0A66C2]",
    label: "LinkedIn Learning",
  },
  Skillshare: {
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor" className="h-full w-full">
        <circle cx="16" cy="20" r="7" fill="white" />
        <text x="30" y="24" fontSize="14" fontWeight="700" fontFamily="sans-serif">skillshare</text>
      </svg>
    ),
    color: "bg-[#00FF84] text-black border-[#00FF84]",
    label: "Skillshare",
  },
  Other: {
    svg: (
      <svg viewBox="0 0 120 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-full w-full">
        <rect x="10" y="8" width="24" height="24" rx="4" />
        <path d="M18 18h8M18 24h5" />
      </svg>
    ),
    color: "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
    label: "Other",
  },
};

const sizeStyles = {
  sm: "h-5 w-14 px-1 py-0.5 text-[8px]",
  md: "h-7 w-20 px-1.5 py-1 text-[10px]",
  lg: "h-9 w-28 px-2 py-1.5 text-xs",
  xl: "h-11 w-36 px-2.5 py-2 text-sm",
};

export function PlatformLogo({ platform, size = "md", className }: PlatformLogoProps) {
  const logo = logos[platform] || logos["Other"];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-lg border font-bold tracking-tight overflow-hidden",
        logo.color,
        sizeStyles[size],
        className
      )}
      title={platform}
    >
      {logo.svg}
    </div>
  );
}

interface PlatformBannerProps {
  platform: string;
  className?: string;
}

export function PlatformBanner({ platform, className }: PlatformBannerProps) {
  const logo = logos[platform] || logos["Other"];

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border px-3 py-2 font-bold tracking-tight",
        logo.color,
        className
      )}
    >
      <div className="h-6 w-20 shrink-0 overflow-hidden">{logo.svg}</div>
    </div>
  );
}
