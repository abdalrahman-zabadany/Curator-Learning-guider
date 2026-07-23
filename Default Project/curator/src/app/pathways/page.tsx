"use client";

import { useState } from "react";
import { Plus, Search, TrendingUp, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PathwayTimeline } from "@/components/pathways/PathwayTimeline";
import type { LearningPathway, PathwayNode } from "@/types";

const MOCK_PATHWAYS: LearningPathway[] = [
  {
    id: "1",
    title: "Zero to ML Engineer in 12 Months",
    description: "The exact path I took from knowing zero machine learning to landing an ML engineer role at a mid-size startup.",
    authorName: "Jordan Kim",
    goal: "ML Engineer Role",
    difficulty: "intermediate",
    estimatedMonths: 12,
    tags: ["Machine Learning", "Python", "Math"],
    forks: 234,
    stars: 567,
    createdAt: "2026-03-01",
    nodes: [
      { id: "n1", title: "Python for Everybody (Coursera)", type: "course", status: "completed", order: 1 },
      { id: "n2", title: "Mathematics for Machine Learning (book)", type: "book", status: "completed", order: 2 },
      { id: "n3", title: "CS50: Intro to Computer Science", type: "course", status: "completed", order: 3 },
      { id: "n4", title: "Fast.ai Practical Deep Learning", type: "course", status: "completed", order: 4 },
      { id: "n5", title: "Andrew Ng's ML Specialization", type: "course", status: "in_progress", order: 5 },
      { id: "n6", title: "Kaggle Competitions", type: "project", status: "not_started", order: 6 },
      { id: "n7", title: "MLOps Specialization", type: "course", status: "not_started", order: 7 },
      { id: "n8", title: "Build Portfolio Projects", type: "project", status: "not_started", order: 8 },
    ],
  },
  {
    id: "2",
    title: "Full-Stack Web Developer Roadmap",
    description: "Complete path from zero coding knowledge to building and deploying full-stack web apps. MERN stack with TypeScript.",
    authorName: "Maria Santos",
    goal: "Full-Stack Developer",
    difficulty: "beginner",
    estimatedMonths: 8,
    tags: ["Web Development", "TypeScript", "React"],
    forks: 189,
    stars: 423,
    createdAt: "2026-01-15",
    nodes: [
      { id: "n1", title: "freeCodeCamp Responsive Web Design", type: "course", status: "completed", order: 1 },
      { id: "n2", title: "The Web Developer Bootcamp (Udemy)", type: "course", status: "completed", order: 2 },
      { id: "n3", title: "JavaScript.info", type: "article", status: "completed", order: 3 },
      { id: "n4", title: "React Official Tutorial", type: "course", status: "completed", order: 4 },
      { id: "n5", title: "TypeScript Handbook", type: "article", status: "completed", order: 5 },
      { id: "n6", title: "Next.js Documentation", type: "course", status: "in_progress", order: 6 },
      { id: "n7", title: "Build a SaaS Project", type: "project", status: "not_started", order: 7 },
    ],
  },
  {
    id: "3",
    title: "UI/UX Design from Scratch",
    description: "Learning path for becoming a product designer. No art school required.",
    authorName: "Alex Chen",
    goal: "Product Designer",
    difficulty: "beginner",
    estimatedMonths: 6,
    tags: ["Design Theory", "Figma", "UX Research"],
    forks: 156,
    stars: 312,
    createdAt: "2026-02-20",
    nodes: [
      { id: "n1", title: "Google UX Design Certificate", type: "course", status: "completed", order: 1 },
      { id: "n2", title: "The Design of Everyday Things", type: "book", status: "completed", order: 2 },
      { id: "n3", title: "Figma YouTube Tutorials", type: "video", status: "completed", order: 3 },
      { id: "n4", title: "Design Systems Course (Figma)", type: "course", status: "in_progress", order: 4 },
      { id: "n5", title: "Redesign an Existing App", type: "project", status: "not_started", order: 5 },
    ],
  },
  {
    id: "4",
    title: "AI/LLM Engineer in 6 Months",
    description: "Fast-track path to building with LLMs. Covers prompt engineering, RAG, fine-tuning, and AI agents.",
    authorName: "Tom Fischer",
    goal: "AI Engineer",
    difficulty: "intermediate",
    estimatedMonths: 6,
    tags: ["AI & LLMs", "Python", "Machine Learning"],
    forks: 312,
    stars: 789,
    createdAt: "2026-04-10",
    nodes: [
      { id: "n1", title: "Python for Everybody (Coursera)", type: "course", status: "completed", order: 1 },
      { id: "n2", title: "ChatGPT Prompt Engineering (DeepLearning.AI)", type: "course", status: "completed", order: 2 },
      { id: "n3", title: "LangChain Documentation & Tutorials", type: "article", status: "completed", order: 3 },
      { id: "n4", title: "Building RAG Applications (free course)", type: "course", status: "in_progress", order: 4 },
      { id: "n5", title: "Fine-tuning LLMs (Hugging Face)", type: "course", status: "not_started", order: 5 },
      { id: "n6", title: "Build an AI Agent Project", type: "project", status: "not_started", order: 6 },
      { id: "n7", title: "Deploy to Production (FastAPI + Docker)", type: "course", status: "not_started", order: 7 },
    ],
  },
  {
    id: "5",
    title: "Cloud & DevOps Engineer Path",
    description: "From zero cloud knowledge to AWS certified DevOps engineer. Includes hands-on projects and certification.",
    authorName: "Priya Patel",
    goal: "DevOps Engineer",
    difficulty: "intermediate",
    estimatedMonths: 9,
    tags: ["DevOps", "Cloud Computing", "AWS"],
    forks: 178,
    stars: 345,
    createdAt: "2026-03-25",
    nodes: [
      { id: "n1", title: "Linux Command Line Fundamentals", type: "course", status: "completed", order: 1 },
      { id: "n2", title: "Docker & Kubernetes: The Practical Guide", type: "course", status: "completed", order: 2 },
      { id: "n3", title: "AWS Cloud Practitioner", type: "course", status: "completed", order: 3 },
      { id: "n4", title: "AWS Solutions Architect Associate", type: "course", status: "in_progress", order: 4 },
      { id: "n5", title: "Terraform: Up & Running (book)", type: "book", status: "not_started", order: 5 },
      { id: "n6", title: "CI/CD Pipeline Project", type: "project", status: "not_started", order: 6 },
      { id: "n7", title: "GitHub Actions Deep Dive", type: "course", status: "not_started", order: 7 },
    ],
  },
  {
    id: "6",
    title: "Data Science from Scratch",
    description: "Complete beginner path to data science. Statistics, Python, SQL, visualization, and your first Kaggle competition.",
    authorName: "Elena Torres",
    goal: "Data Scientist",
    difficulty: "beginner",
    estimatedMonths: 10,
    tags: ["Data Science", "Python", "SQL"],
    forks: 267,
    stars: 534,
    createdAt: "2026-02-05",
    nodes: [
      { id: "n1", title: "Statistics Fundamentals (Khan Academy)", type: "course", status: "completed", order: 1 },
      { id: "n2", title: "100 Days of Code: Python (Udemy)", type: "course", status: "completed", order: 2 },
      { id: "n3", title: "SQL for Data Science (Coursera)", type: "course", status: "completed", order: 3 },
      { id: "n4", title: "Python for Data Analysis (book)", type: "book", status: "completed", order: 4 },
      { id: "n5", title: "Data Visualization with Matplotlib/Seaborn", type: "course", status: "in_progress", order: 5 },
      { id: "n6", title: "Kaggle Titanic Competition", type: "project", status: "not_started", order: 6 },
      { id: "n7", title: "Exploratory Data Analysis Project", type: "project", status: "not_started", order: 7 },
      { id: "n8", title: "Google Data Analytics Certificate", type: "course", status: "not_started", order: 8 },
    ],
  },
  {
    id: "7",
    title: "iOS App Developer (Swift & SwiftUI)",
    description: "From zero to publishing your first app on the App Store. Swift, SwiftUI, and real-world project experience.",
    authorName: "Marcus Lee",
    goal: "iOS Developer",
    difficulty: "beginner",
    estimatedMonths: 7,
    tags: ["Mobile Development", "Swift", "SwiftUI"],
    forks: 143,
    stars: 278,
    createdAt: "2026-05-12",
    nodes: [
      { id: "n1", title: "Swift Programming Fundamentals (Apple)", type: "course", status: "completed", order: 1 },
      { id: "n2", title: "100 Days of SwiftUI (Hacking with Swift)", type: "course", status: "completed", order: 2 },
      { id: "n3", title: "Apple HIG Documentation", type: "article", status: "in_progress", order: 3 },
      { id: "n4", title: "Build a Weather App", type: "project", status: "not_started", order: 4 },
      { id: "n5", title: "Core Data & Persistence", type: "course", status: "not_started", order: 5 },
      { id: "n6", title: "Publish to App Store", type: "project", status: "not_started", order: 6 },
    ],
  },
  {
    id: "8",
    title: "Cybersecurity Analyst Path",
    description: "Prepare for the CompTIA Security+ and start a career in cybersecurity. Network fundamentals through ethical hacking.",
    authorName: "David Park",
    goal: "Security Analyst",
    difficulty: "intermediate",
    estimatedMonths: 8,
    tags: ["Cybersecurity", "Networking", "Linux"],
    forks: 198,
    stars: 389,
    createdAt: "2026-04-18",
    nodes: [
      { id: "n1", title: "Google IT Support Certificate", type: "course", status: "completed", order: 1 },
      { id: "n2", title: "Networking Fundamentals (Professor Messer)", type: "video", status: "completed", order: 2 },
      { id: "n3", title: "Linux Essentials", type: "course", status: "completed", order: 3 },
      { id: "n4", title: "CompTIA Security+ Prep", type: "course", status: "in_progress", order: 4 },
      { id: "n5", title: "TryHackMe Beginner Path", type: "course", status: "not_started", order: 5 },
      { id: "n6", title: "CTF Challenges", type: "project", status: "not_started", order: 6 },
    ],
  },
];

const difficultyConfig = {
  beginner: { label: "Beginner", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  intermediate: { label: "Intermediate", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  advanced: { label: "Advanced", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export default function PathwaysPage() {
  const [pathways, setPathways] = useState<LearningPathway[]>(MOCK_PATHWAYS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "forked">("popular");
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);

  const filtered = pathways
    .filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDifficulty = !filterDifficulty || p.difficulty === filterDifficulty;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.stars - a.stars;
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.forks - a.forks;
    });

  const handleNodeStatusChange = (pathwayId: string, nodeId: string, status: PathwayNode["status"]) => {
    setPathways((prev) =>
      prev.map((p) =>
        p.id === pathwayId
          ? {
              ...p,
              nodes: p.nodes.map((n) => (n.id === nodeId ? { ...n, status } : n)),
            }
          : p
      )
    );
  };

  const handleFork = (pathwayId: string) => {
    setPathways((prev) =>
      prev.map((p) =>
        p.id === pathwayId ? { ...p, forks: p.forks + 1 } : p
      )
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Learning Pathways</h1>
          <p className="mt-1 text-sm text-muted">
            Crowdsourced roadmaps from real learners who achieved their goals
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" /> Create Pathway
        </Button>
      </div>

      {/* Search & Sort */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pathways, tags, or goals..."
            className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="forked">Most Forked</option>
          </select>
        </div>
      </div>

      {/* Difficulty Filters */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterDifficulty(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !filterDifficulty
              ? "bg-accent text-white"
              : "bg-surface-hover text-muted hover:text-foreground"
          }`}
        >
          All Levels
        </button>
        {(["beginner", "intermediate", "advanced"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setFilterDifficulty(filterDifficulty === d ? null : d)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filterDifficulty === d
                ? "bg-accent text-white"
                : "bg-surface-hover text-muted hover:text-foreground"
            }`}
          >
            {difficultyConfig[d].label}
          </button>
        ))}
      </div>

      {/* Pathway Stats Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Card className="flex items-center gap-3 py-3 px-4">
          <BarChart3 className="h-5 w-5 text-accent" />
          <div>
            <div className="text-sm font-bold">{pathways.length}</div>
            <div className="text-xs text-muted">Pathways</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3 py-3 px-4">
          <Clock className="h-5 w-5 text-accent" />
          <div>
            <div className="text-sm font-bold">{pathways.reduce((sum, p) => sum + p.nodes.length, 0)}</div>
            <div className="text-xs text-muted">Total Steps</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3 py-3 px-4">
          <TrendingUp className="h-5 w-5 text-accent" />
          <div>
            <div className="text-sm font-bold">{pathways.reduce((sum, p) => sum + p.stars, 0).toLocaleString()}</div>
            <div className="text-xs text-muted">Total Stars</div>
          </div>
        </Card>
      </div>

      {/* Pathways */}
      <div className="mt-6 space-y-6">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted">No pathways found.</div>
        ) : (
          filtered.map((pathway) => (
            <PathwayTimeline
              key={pathway.id}
              pathway={pathway}
              onFork={handleFork}
              onNodeStatusChange={handleNodeStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
