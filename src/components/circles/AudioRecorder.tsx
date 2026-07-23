"use client";

import { cn } from "@/lib/cn";
import { forwardRef } from "react";

interface AudioRecorderProps {
  maxDuration?: number;
  className?: string;
}

const AudioRecorder = forwardRef<HTMLDivElement, AudioRecorderProps>(
  ({ maxDuration = 60, className }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col items-center gap-3", className)}>
        <p className="text-xs text-muted">
          Tap to record a {maxDuration}-second voice snippet
        </p>
        <button
          className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-red-600 active:scale-95"
          title="Record"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </button>
      </div>
    );
  }
);

AudioRecorder.displayName = "AudioRecorder";
export { AudioRecorder };
