"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Plus, Mic, X, Users, Pause } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CircleCard } from "@/components/circles/CircleCard";
import type { Circle } from "@/types";
import { cn } from "@/lib/cn";

const MOCK_CIRCLES: Circle[] = [
  {
    id: "1",
    name: "Self-Taught Machine Learning",
    description: "A supportive space for self-taught ML practitioners to share progress, ask questions, and learn together.",
    memberCount: 2340,
    icon: "🤖",
    tags: ["Machine Learning", "AI & LLMs"],
    recentVoiceSnippets: [
      { id: "v1", authorName: "Priya Sharma", content: "Just finished my first Kaggle submission! It's not great but I actually built a working model from scratch.", duration: 45, upvotes: 34, createdAt: "2026-07-18" },
      { id: "v2", authorName: "Marcus Lee", content: "Quick tip for anyone struggling with transformer attention mechanisms — 3Blue1Brown's latest video makes it click.", duration: 52, upvotes: 67, createdAt: "2026-07-17" },
    ],
  },
  {
    id: "2",
    name: "Web Dev Accountability",
    description: "Weekly voice check-ins to keep each other on track. Share wins, blockers, and plans.",
    memberCount: 1890,
    icon: "💻",
    tags: ["Web Development"],
    recentVoiceSnippets: [
      { id: "v3", authorName: "Jamie Park", content: "Week 12: Finally got auth working with Next.js and Supabase. The middleware approach was key.", duration: 38, upvotes: 23, createdAt: "2026-07-19" },
    ],
  },
  {
    id: "3",
    name: "Design Theory & Critique",
    description: "Go deeper than Figma tutorials. Typography, color theory, layout principles, and constructive critique.",
    memberCount: 890,
    icon: "🎨",
    tags: ["Design Theory"],
    recentVoiceSnippets: [
      { id: "v4", authorName: "Nina Kowalski", content: "Hot take: Most beginner designers overuse drop shadows when they should use contrast and spacing.", duration: 55, upvotes: 89, createdAt: "2026-07-20" },
    ],
  },
  {
    id: "4",
    name: "Data Science Career Switchers",
    description: "Navigating the transition from non-technical roles to data science. Resume tips, interview prep, emotional support.",
    memberCount: 3210,
    icon: "📊",
    tags: ["Data Science"],
    recentVoiceSnippets: [],
  },
  {
    id: "5",
    name: "AI & LLM Tinkerers",
    description: "Building with LLMs, RAG systems, and AI agents. Experiments, prompt engineering, cutting edge.",
    memberCount: 1560,
    icon: "🧠",
    tags: ["AI & LLMs", "Machine Learning"],
    recentVoiceSnippets: [
      { id: "v5", authorName: "Tom Fischer", content: "Built a RAG pipeline that actually works. The secret was chunking strategy — recursive character splitting was 3x better.", duration: 48, upvotes: 112, createdAt: "2026-07-19" },
    ],
  },
  {
    id: "6",
    name: "DevOps & Cloud Learners",
    description: "Docker, Kubernetes, AWS, CI/CD — learn cloud and DevOps together. Share setups, troubleshoot together.",
    memberCount: 1230,
    icon: "☁️",
    tags: ["DevOps", "Cloud Computing"],
    recentVoiceSnippets: [
      { id: "v6", authorName: "Alex Chen", content: "Finally understanding Kubernetes after 3 weeks. The 'pods are like containers in a pod' metaphor finally clicked for me.", duration: 32, upvotes: 45, createdAt: "2026-07-18" },
    ],
  },
  {
    id: "7",
    name: "Mobile Dev Hub",
    description: "React Native, Flutter, Swift, Kotlin — all things mobile development. Ship your first app together.",
    memberCount: 980,
    icon: "📱",
    tags: ["Mobile Development"],
    recentVoiceSnippets: [
      { id: "v7", authorName: "Sarah Kim", content: "React Native vs Flutter in 2026: I switched to Flutter and don't regret it. Hot reload alone saved me hours this week.", duration: 42, upvotes: 56, createdAt: "2026-07-17" },
    ],
  },
  {
    id: "8",
    name: "Cybersecurity Study Group",
    description: "CompTIA Security+, CEH, TryHackMe. Study together, share resources, pass exams.",
    memberCount: 1450,
    icon: "🔒",
    tags: ["Cybersecurity"],
    recentVoiceSnippets: [
      { id: "v8", authorName: "Jordan Lee", content: "Passed Security+ today! Here's my study strategy: Messer videos first, then practice exams, then the book for gaps.", duration: 58, upvotes: 134, createdAt: "2026-07-20" },
    ],
  },
  {
    id: "9",
    name: "Frontend Masters Circle",
    description: "React, Vue, Svelte, CSS wizardry. Frontend engineers pushing the boundaries of what's possible in the browser.",
    memberCount: 2100,
    icon: "🎨",
    tags: ["Web Development"],
    recentVoiceSnippets: [
      { id: "v9", authorName: "Chris Dan", content: "CSS container queries changed everything. I refactored our entire component library and it's 40% less code.", duration: 35, upvotes: 78, createdAt: "2026-07-19" },
    ],
  },
  {
    id: "10",
    name: "Python Everywhere",
    description: "Automation, data science, web backends, scripting — if it's Python, we talk about it here.",
    memberCount: 2890,
    icon: "🐍",
    tags: ["Programming Languages"],
    recentVoiceSnippets: [
      { id: "v10", authorName: "Elena Torres", content: "Automated my entire job reporting pipeline with Python. 3 hours of work now takes 5 minutes. My boss thinks I'm a wizard.", duration: 40, upvotes: 92, createdAt: "2026-07-18" },
    ],
  },
  {
    id: "11",
    name: "Startup & Product Builders",
    description: "For learners building their own products. MVP strategies, user research, launch tactics, and founder mental health.",
    memberCount: 760,
    icon: "🚀",
    tags: ["Web Development", "Design Theory"],
    recentVoiceSnippets: [],
  },
  {
    id: "12",
    name: "Open Source Contributors",
    description: "First PR to maintainer. Learn how to contribute to open source, find projects, and build your GitHub profile.",
    memberCount: 1100,
    icon: "🌐",
    tags: ["Programming Languages", "Web Development"],
    recentVoiceSnippets: [
      { id: "v11", authorName: "David Park", content: "My first contribution to a major OSS project was merged today! It was just a docs fix, but it feels amazing.", duration: 28, upvotes: 67, createdAt: "2026-07-20" },
    ],
  },
];

const CATEGORIES = [
  "All", "Machine Learning", "Web Development", "Data Science",
  "Design Theory", "AI & LLMs", "Mobile Development", "DevOps",
  "Cloud Computing", "Cybersecurity", "Programming Languages",
];

export default function CirclesPage() {
  const [circles, setCircles] = useState<Circle[]>(MOCK_CIRCLES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showRecorder, setShowRecorder] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [newCircleName, setNewCircleName] = useState("");
  const [newCircleDesc, setNewCircleDesc] = useState("");
  const [newCircleTags, setNewCircleTags] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const toast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  const filtered = circles.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "All" ||
      c.tags.some((t) => t === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        toast("Voice note recorded! (Audio saved locally)");
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch {
      toast("Microphone access denied. Please allow mic access.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRecorderRef.current?.stop();
    };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleCreateCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleName.trim()) return;
    const newCircle: Circle = {
      id: String(Date.now()),
      name: newCircleName,
      description: newCircleDesc,
      memberCount: 1,
      icon: "✨",
      tags: newCircleTags.length > 0 ? newCircleTags : ["Web Development"],
      recentVoiceSnippets: [],
    };
    setCircles((prev) => [newCircle, ...prev]);
    setShowCreateModal(false);
    setNewCircleName("");
    setNewCircleDesc("");
    setNewCircleTags([]);
    toast("Circle created! You're the first member.");
  };

  const toggleNewCircleTag = (tag: string) => {
    setNewCircleTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleVoiceSnippetVote = (snippetId: string) => {
    setCircles((prev) =>
      prev.map((c) => ({
        ...c,
        recentVoiceSnippets: c.recentVoiceSnippets.map((s) =>
          s.id === snippetId ? { ...s, upvotes: s.upvotes + 1 } : s
        ),
      }))
    );
    toast("Upvoted!");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      {showToast && (
        <div className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 animate-fade-in rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700 shadow-lg dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
          {showToast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Circles</h1>
          <p className="mt-1 text-sm text-muted">Voice-powered learning communities with no noise</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowRecorder(!showRecorder)}>
            <Mic className="h-4 w-4" /> Voice Note
          </Button>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" /> Create Circle
          </Button>
        </div>
      </div>

      {/* Audio Recorder Panel */}
      {showRecorder && (
        <Card className="mt-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Record a Voice Note</h3>
            <button onClick={() => { setShowRecorder(false); if (isRecording) stopRecording(); }}
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted hover:bg-surface-hover">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col items-center gap-4 py-4">
            {isRecording && (
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="text-sm font-mono text-red-500">{formatTime(recordingTime)}</span>
                <span className="text-xs text-muted">/ 1:00 max</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button onClick={startRecording}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-red-600 active:scale-95">
                  <Mic className="h-6 w-6" />
                </button>
              ) : (
                <>
                  <button onClick={stopRecording}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 animate-pulse">
                    <Pause className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-muted">
              {isRecording ? "Tap to stop recording" : "Tap to start recording (max 60s)"}
            </p>
          </div>
        </Card>
      )}

      {/* Create Circle Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
          <div className="animate-fade-in mx-4 w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Create a Circle</h2>
              <button onClick={() => setShowCreateModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-hover">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-muted">Start a community around a shared learning goal.</p>
            <form onSubmit={handleCreateCircle} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Circle Name</label>
                <input type="text" value={newCircleName} onChange={(e) => setNewCircleName(e.target.value)}
                  placeholder="e.g. Rust Study Group"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Description</label>
                <textarea value={newCircleDesc} onChange={(e) => setNewCircleDesc(e.target.value)} rows={3}
                  placeholder="What's this circle about?"
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.filter((c) => c !== "All").map((tag) => (
                    <button key={tag} type="button" onClick={() => toggleNewCircleTag(tag)}
                      className={cn("rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                        newCircleTags.includes(tag) ? "bg-accent text-white" : "bg-surface-hover text-muted hover:text-foreground"
                      )}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={!newCircleName.trim()}>
                <Users className="h-4 w-4" /> Create Circle
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circles by name or topic..."
            className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20" />
        </div>
      </div>

      {/* Category Tags */}
      <div className="mt-3 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
              selectedCategory === cat ? "bg-accent text-white shadow-sm" : "bg-surface-hover text-muted hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700"
            )}>
            {cat}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4 text-sm text-muted">
        <span>{filtered.length} circles</span>
        <span>·</span>
        <span>{filtered.reduce((s, c) => s + c.memberCount, 0).toLocaleString()} total members</span>
      </div>

      {/* Circles Grid */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="col-span-2 py-16 text-center">
            <p className="text-muted">No circles match your search.</p>
            <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="mt-2 text-sm font-medium text-accent hover:text-accent-hover">
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((circle) => (
            <CircleCard key={circle.id} circle={circle} onUpvote={handleVoiceSnippetVote} />
          ))
        )}
      </div>
    </div>
  );
}
