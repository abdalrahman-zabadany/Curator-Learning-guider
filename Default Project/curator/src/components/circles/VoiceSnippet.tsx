"use client";

import { Play, Pause, ThumbsUp } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, formatDuration } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";

interface VoiceSnippetProps {
  authorName: string;
  authorAvatar?: string;
  content: string;
  duration: number;
  upvotes: number;
  createdAt: string;
  isAnonymous?: boolean;
  onUpvote?: (snippetId: string) => void;
  id?: string;
}

export function VoiceSnippet({
  authorName,
  authorAvatar,
  content,
  duration,
  upvotes,
  createdAt,
  isAnonymous = false,
  onUpvote,
  id,
}: VoiceSnippetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      let p = progress;
      intervalRef.current = setInterval(() => {
        p += 100 / (duration * 10);
        if (p >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsPlaying(false);
          setProgress(0);
          return;
        }
        setProgress(p);
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasVoted && onUpvote && id) {
      onUpvote(id);
      setHasVoted(true);
    }
  };

  return (
    <div className="flex gap-3 rounded-xl border border-border bg-surface p-3 transition-all duration-200 hover:shadow-sm">
      <Avatar name={isAnonymous ? undefined : authorName} src={authorAvatar} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">
            {isAnonymous ? "Anonymous" : authorName}
          </span>
          <span className="text-xs text-muted shrink-0">{formatDate(createdAt)}</span>
        </div>
        <p className="mt-1 text-sm text-muted line-clamp-2">{content}</p>

        <div className="mt-2.5 flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-all duration-200 hover:bg-accent-hover hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="ml-0.5 h-3 w-3" />}
          </button>
          <div className="flex-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
              <div className="h-full rounded-full bg-accent transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <span className="text-xs text-muted tabular-nums shrink-0">
            {formatDuration(Math.round((progress / 100) * duration))}/{formatDuration(duration)}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <button onClick={handleUpvote}
            className={cn("flex items-center gap-1 text-xs font-medium transition-all duration-150",
              hasVoted ? "text-accent" : "text-muted hover:text-accent"
            )}>
            <ThumbsUp className={cn("h-3 w-3", hasVoted && "fill-current")} />
            {upvotes}
          </button>
        </div>
      </div>
    </div>
  );
}
