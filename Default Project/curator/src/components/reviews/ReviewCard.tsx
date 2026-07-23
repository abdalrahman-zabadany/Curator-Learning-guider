"use client";

import { Star, ThumbsUp, ThumbsDown, ShieldCheck, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformLogo } from "@/components/ui/PlatformLogo";
import { WorthItMeter } from "./WorthItMeter";
import { getPlatformColor, formatDate } from "@/lib/utils";
import { cn } from "@/lib/cn";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
  onVote?: (reviewId: string, direction: "up" | "down") => void;
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-zinc-300 dark:text-zinc-600"
          )}
        />
      ))}
    </div>
  );
}

export function ReviewCard({ review, onVote }: ReviewCardProps) {
  const worthItPct = Math.round(
    ((review.overallRating + review.contentQuality + review.practicalValue + review.engagement) / 20) * 100
  );

  const totalVotes = review.upvotes + review.downvotes;
  const approvalRatio = totalVotes > 0 ? Math.round((review.upvotes / totalVotes) * 100) : 100;

  return (
    <Card className="animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Avatar
            name={review.isAnonymous ? undefined : review.authorName}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {review.isAnonymous ? "Anonymous Learner" : review.authorName}
              </span>
              {review.isAnonymous && (
                <span title="Anonymous review">
                  <EyeOff className="h-3 w-3 text-muted" />
                </span>
              )}
              {review.verified && (
                <span title="Verified completion">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <PlatformLogo platform={review.platform} size="sm" />
              <Badge className={getPlatformColor(review.platform)}>
                {review.platform}
              </Badge>
              <span className="text-xs text-muted">{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
        <WorthItMeter percentage={worthItPct} size="sm" />
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">{review.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{review.body}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <span>Content</span>
          <StarRating rating={review.contentQuality} />
        </div>
        <div className="flex items-center gap-1.5">
          <span>Practical</span>
          <StarRating rating={review.practicalValue} />
        </div>
        <div className="flex items-center gap-1.5">
          <span>Engagement</span>
          <StarRating rating={review.engagement} />
        </div>
      </div>

      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {review.pros.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Pros
              </p>
              <ul className="space-y-1">
                {review.pros.map((pro, i) => (
                  <li key={i} className="text-xs text-muted">
                    + {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-red-500 dark:text-red-400">
                Cons
              </p>
              <ul className="space-y-1">
                {review.cons.map((con, i) => (
                  <li key={i} className="text-xs text-muted">
                    − {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
        <button
          onClick={() => onVote?.(review.id, "up")}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium transition-all duration-150 active:scale-95",
            review.userVote === "up"
              ? "text-accent"
              : "text-muted hover:text-accent"
          )}
        >
          <ThumbsUp className={cn("h-3.5 w-3.5", review.userVote === "up" && "fill-current")} />
          {review.upvotes}
        </button>
        <button
          onClick={() => onVote?.(review.id, "down")}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium transition-all duration-150 active:scale-95",
            review.userVote === "down"
              ? "text-red-500"
              : "text-muted hover:text-red-500"
          )}
        >
          <ThumbsDown className={cn("h-3.5 w-3.5", review.userVote === "down" && "fill-current")} />
          {review.downvotes}
        </button>
        <span className="ml-auto text-[11px] text-muted">
          {approvalRatio}% helpful
        </span>
      </div>
    </Card>
  );
}
