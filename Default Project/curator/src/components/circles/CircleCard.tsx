"use client";

import { Users, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { VoiceSnippet } from "./VoiceSnippet";
import Link from "next/link";
import type { Circle } from "@/types";

interface CircleCardProps {
  circle: Circle;
  onClick?: () => void;
  onUpvote?: (snippetId: string) => void;
}

export function CircleCard({ circle, onClick, onUpvote }: CircleCardProps) {
  return (
    <Link href={`/circles/${circle.id}`} className="block">
    <Card hover onClick={onClick} className="cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-2xl shrink-0">
            {circle.icon}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{circle.name}</h3>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
              <Users className="h-3 w-3" />
              {circle.memberCount.toLocaleString()} members
            </div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted shrink-0" />
      </div>

      <p className="mt-3 text-sm text-muted line-clamp-2">{circle.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {circle.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      {circle.recentVoiceSnippets.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-border pt-4">
          <p className="text-xs font-medium text-muted">Recent voice updates</p>
          {circle.recentVoiceSnippets.slice(0, 2).map((snippet) => (
            <VoiceSnippet key={snippet.id} {...snippet} onUpvote={onUpvote} />
          ))}
        </div>
      )}
    </Card>
    </Link>
  );
}
