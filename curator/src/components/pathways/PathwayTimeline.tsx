"use client";

import { useState } from "react";
import { Star, GitFork, Tag, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { PathwayNodeCard } from "./PathwayNode";
import { cn } from "@/lib/cn";
import type { LearningPathway, PathwayNode } from "@/types";

interface PathwayTimelineProps {
  pathway: LearningPathway;
  onFork?: (pathwayId: string) => void;
  onNodeStatusChange?: (pathwayId: string, nodeId: string, status: PathwayNode["status"]) => void;
}

const difficultyStyles = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function PathwayTimeline({ pathway, onFork, onNodeStatusChange }: PathwayTimelineProps) {
  const [expanded, setExpanded] = useState(false);
  const [starred, setStarred] = useState(false);
  const [starCount, setStarCount] = useState(pathway.stars);
  const completedCount = pathway.nodes.filter((n) => n.status === "completed").length;
  const progress = Math.round((completedCount / pathway.nodes.length) * 100);

  const toggleStar = () => {
    setStarred(!starred);
    setStarCount((c) => starred ? c - 1 : c + 1);
  };

  return (
    <Card className="animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Avatar name={pathway.authorName} size="md" />
          <div>
            <h3 className="font-semibold">{pathway.title}</h3>
            <p className="mt-0.5 text-xs text-muted">
              by {pathway.authorName} · {pathway.nodes.length} steps
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleStar}
            className={cn("flex items-center gap-1 text-xs font-medium transition-all duration-150 active:scale-95",
              starred ? "text-amber-500" : "text-muted hover:text-amber-500"
            )}>
            <Star className={cn("h-3.5 w-3.5", starred && "fill-current")} />
            {starCount}
          </button>
          <button
            onClick={() => onFork?.(pathway.id)}
            className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent active:scale-95"
            title="Fork this pathway"
          >
            <GitFork className="h-3.5 w-3.5" />
            {pathway.forks}
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted">{pathway.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge variant="info">
          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          {pathway.goal}
        </Badge>
        <Badge className={difficultyStyles[pathway.difficulty]}>
          {pathway.difficulty}
        </Badge>
        <Badge>
          <Clock className="mr-1 h-2.5 w-2.5" />
          ~{pathway.estimatedMonths}mo
        </Badge>
        {pathway.tags.map((tag) => (
          <Badge key={tag}>
            <Tag className="mr-1 h-2.5 w-2.5" />
            {tag}
          </Badge>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Progress</span>
          <span>{completedCount}/{pathway.nodes.length} completed ({progress}%)</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-hover">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-border py-2 text-xs font-medium text-muted transition-colors hover:bg-surface-hover"
      >
        {expanded ? (
          <>
            <ChevronUp className="h-3 w-3" /> Hide Pathway
          </>
        ) : (
          <>
            <ChevronDown className="h-3 w-3" /> Show Pathway ({pathway.nodes.length} steps)
          </>
        )}
      </button>

      {expanded && (
        <div className="mt-4 space-y-0">
          {pathway.nodes
            .sort((a, b) => a.order - b.order)
            .map((node, i) => (
              <PathwayNodeCard
                key={node.id}
                node={node}
                isLast={i === pathway.nodes.length - 1}
                onStatusChange={(nodeId, status) =>
                  onNodeStatusChange?.(pathway.id, nodeId, status)
                }
              />
            ))}
        </div>
      )}
    </Card>
  );
}
