"use client";

import { cn } from "@/lib/cn";
import { Check, Circle, Clock, BookOpen, FileText, ExternalLink, Video, Hammer } from "lucide-react";
import type { PathwayNode as PathwayNodeType } from "@/types";

interface PathwayNodeProps {
  node: PathwayNodeType;
  onStatusChange?: (nodeId: string, status: PathwayNodeType["status"]) => void;
  isLast?: boolean;
}

const typeIcons = {
  course: BookOpen,
  book: FileText,
  article: FileText,
  project: Hammer,
  video: Video,
};

const statusConfig = {
  not_started: {
    icon: Circle,
    label: "Not Started",
    ring: "border-border text-muted",
    dot: "bg-surface-hover",
  },
  in_progress: {
    icon: Clock,
    label: "In Progress",
    ring: "border-amber-400 text-amber-500",
    dot: "bg-amber-400",
  },
  completed: {
    icon: Check,
    label: "Completed",
    ring: "border-emerald-400 text-emerald-500",
    dot: "bg-emerald-400",
  },
};

const cycleStatus = (current: PathwayNodeType["status"]): PathwayNodeType["status"] => {
  const order: PathwayNodeType["status"][] = ["not_started", "in_progress", "completed"];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
};

export function PathwayNodeCard({ node, onStatusChange, isLast = true }: PathwayNodeProps) {
  const status = statusConfig[node.status];
  const TypeIcon = typeIcons[node.type];
  const StatusIcon = status.icon;

  return (
    <div className="relative flex gap-4">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onStatusChange?.(node.id, cycleStatus(node.status))}
          className={cn(
            "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110",
            status.ring
          )}
        >
          <StatusIcon className="h-4 w-4" />
        </button>
        {!isLast && (
          <div className={cn(
            "w-0.5 flex-1 transition-colors duration-300",
            node.status === "completed" ? "bg-emerald-400" : "bg-border"
          )} />
        )}
      </div>

      {/* Node Content */}
      <div className="flex-1 pb-8">
        <div className="group rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-muted">
                <TypeIcon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">{node.title}</h4>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                  <span className="capitalize">{node.type}</span>
                  <span>·</span>
                  <span className="capitalize">{node.status.replace("_", " ")}</span>
                </div>
              </div>
            </div>
            {node.url && (
              <a
                href={node.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-muted transition-colors hover:text-accent"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          {node.description && (
            <p className="mt-2 text-sm text-muted">{node.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
