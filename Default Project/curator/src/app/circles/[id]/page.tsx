"use client";

import { useState, use } from "react";
import { ArrowLeft, Users, Plus, Mic, Pause, Share2, Flag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { VoiceSnippet } from "@/components/circles/VoiceSnippet";
import Link from "next/link";
import { cn } from "@/lib/cn";

const ALL_CIRCLES: Record<string, {
  name: string;
  description: string;
  memberCount: number;
  icon: string;
  tags: string[];
  createdAt: string;
  rules: string[];
  recentVoiceSnippets: Array<{
    id: string;
    authorName: string;
    content: string;
    duration: number;
    upvotes: number;
    createdAt: string;
  }>;
  members: Array<{ name: string; joined: string }>;
}> = {
  "1": {
    name: "Self-Taught Machine Learning",
    description: "A supportive space for self-taught ML practitioners to share progress, ask questions, and learn together. No gatekeeping, no ego — just growth.",
    memberCount: 2340,
    icon: "🤖",
    tags: ["Machine Learning", "AI & LLMs"],
    createdAt: "2025-09-15",
    rules: ["Be respectful and supportive", "No self-promotion without context", "Share resources freely", "Help beginners — you were one once"],
    recentVoiceSnippets: [
      { id: "v1", authorName: "Priya Sharma", content: "Just finished my first Kaggle submission! It's not great but I actually built a working model from scratch. The feeling is unreal.", duration: 45, upvotes: 34, createdAt: "2026-07-18" },
      { id: "v2", authorName: "Marcus Lee", content: "Quick tip for anyone struggling with transformer attention mechanisms — 3Blue1Brown's latest video makes it click.", duration: 52, upvotes: 67, createdAt: "2026-07-17" },
      { id: "v2b", authorName: "Sarah Chen", content: "Started the fast.ai course this week. Jeremy Howard's top-down approach is genuinely mind-blowing. Why isn't everyone teaching this way?", duration: 38, upvotes: 45, createdAt: "2026-07-16" },
    ],
    members: [
      { name: "Priya Sharma", joined: "2025-10-01" },
      { name: "Marcus Lee", joined: "2025-11-12" },
      { name: "Sarah Chen", joined: "2025-09-20" },
      { name: "Tom Fischer", joined: "2026-01-05" },
      { name: "Anonymous", joined: "2026-03-18" },
    ],
  },
  "2": {
    name: "Web Dev Accountability",
    description: "Weekly voice check-ins to keep each other on track. Share wins, blockers, and plans. Real accountability, real people.",
    memberCount: 1890,
    icon: "💻",
    tags: ["Web Development"],
    createdAt: "2025-11-01",
    rules: ["Post a weekly check-in", "Celebrate others' wins", "No spam or course promotions"],
    recentVoiceSnippets: [
      { id: "v3", authorName: "Jamie Park", content: "Week 12: Finally got auth working with Next.js and Supabase. The middleware approach was key.", duration: 38, upvotes: 23, createdAt: "2026-07-19" },
    ],
    members: [
      { name: "Jamie Park", joined: "2025-11-15" },
      { name: "Elena Torres", joined: "2025-12-01" },
    ],
  },
  "3": {
    name: "Design Theory & Critique",
    description: "Go deeper than Figma tutorials. Typography, color theory, layout principles, and constructive critique.",
    memberCount: 890,
    icon: "🎨",
    tags: ["Design Theory"],
    createdAt: "2026-01-10",
    rules: ["Critique constructively", "Credit original work", "No AI-generated art without disclosure"],
    recentVoiceSnippets: [
      { id: "v4", authorName: "Nina Kowalski", content: "Hot take: Most beginner designers overuse drop shadows when they should use contrast and spacing.", duration: 55, upvotes: 89, createdAt: "2026-07-20" },
    ],
    members: [
      { name: "Nina Kowalski", joined: "2026-01-15" },
    ],
  },
  "4": {
    name: "Data Science Career Switchers",
    description: "Navigating the transition from non-technical roles to data science. Resume tips, interview prep, emotional support.",
    memberCount: 3210,
    icon: "📊",
    tags: ["Data Science"],
    createdAt: "2025-08-20",
    rules: ["Be kind — career switches are hard", "Share interview experiences", "No gatekeeping knowledge"],
    recentVoiceSnippets: [],
    members: [
      { name: "Rosa Martinez", joined: "2025-09-01" },
      { name: "James Wright", joined: "2025-10-15" },
    ],
  },
  "5": {
    name: "AI & LLM Tinkerers",
    description: "Building with LLMs, RAG systems, and AI agents. Experiments, prompt engineering, cutting edge.",
    memberCount: 1560,
    icon: "🧠",
    tags: ["AI & LLMs", "Machine Learning"],
    createdAt: "2025-12-01",
    rules: ["Share your experiments — failures included", "Cite sources", "No hype without substance"],
    recentVoiceSnippets: [
      { id: "v5", authorName: "Tom Fischer", content: "Built a RAG pipeline that actually works. The secret was chunking strategy — recursive character splitting was 3x better.", duration: 48, upvotes: 112, createdAt: "2026-07-19" },
    ],
    members: [
      { name: "Tom Fischer", joined: "2025-12-10" },
      { name: "Anika Patel", joined: "2026-01-20" },
    ],
  },
  "6": {
    name: "DevOps & Cloud Learners",
    description: "Docker, Kubernetes, AWS, CI/CD — learn cloud and DevOps together.",
    memberCount: 1230,
    icon: "☁️",
    tags: ["DevOps", "Cloud Computing"],
    createdAt: "2026-02-01",
    rules: ["Share your setup", "Help troubleshoot", "No vendor wars"],
    recentVoiceSnippets: [
      { id: "v6", authorName: "Alex Chen", content: "Finally understanding Kubernetes after 3 weeks. The pods metaphor finally clicked.", duration: 32, upvotes: 45, createdAt: "2026-07-18" },
    ],
    members: [{ name: "Alex Chen", joined: "2026-02-10" }],
  },
  "7": {
    name: "Mobile Dev Hub",
    description: "React Native, Flutter, Swift, Kotlin — all things mobile development.",
    memberCount: 980,
    icon: "📱",
    tags: ["Mobile Development"],
    createdAt: "2026-01-20",
    rules: ["Share project demos", "Be platform-agnostic", "Help beginners"],
    recentVoiceSnippets: [
      { id: "v7", authorName: "Sarah Kim", content: "React Native vs Flutter in 2026: I switched to Flutter and don't regret it.", duration: 42, upvotes: 56, createdAt: "2026-07-17" },
    ],
    members: [{ name: "Sarah Kim", joined: "2026-01-25" }],
  },
  "8": {
    name: "Cybersecurity Study Group",
    description: "CompTIA Security+, CEH, TryHackMe. Study together, pass exams.",
    memberCount: 1450,
    icon: "🔒",
    tags: ["Cybersecurity"],
    createdAt: "2025-10-15",
    rules: ["No illegal activities", "Share study resources", "Celebrate cert passes"],
    recentVoiceSnippets: [
      { id: "v8", authorName: "Jordan Lee", content: "Passed Security+ today! Study strategy: Messer videos first, then practice exams.", duration: 58, upvotes: 134, createdAt: "2026-07-20" },
    ],
    members: [{ name: "Jordan Lee", joined: "2025-11-01" }],
  },
  "9": {
    name: "Frontend Masters Circle",
    description: "React, Vue, Svelte, CSS wizardry. Frontend engineers pushing boundaries.",
    memberCount: 2100,
    icon: "✨",
    tags: ["Web Development"],
    createdAt: "2025-11-10",
    rules: ["Share code snippets", "Discuss trade-offs", "No framework wars"],
    recentVoiceSnippets: [
      { id: "v9", authorName: "Chris Dan", content: "CSS container queries changed everything. Refactored our entire component library.", duration: 35, upvotes: 78, createdAt: "2026-07-19" },
    ],
    members: [{ name: "Chris Dan", joined: "2025-11-20" }],
  },
  "10": {
    name: "Python Everywhere",
    description: "Automation, data science, web backends, scripting — if it's Python, we talk about it.",
    memberCount: 2890,
    icon: "🐍",
    tags: ["Programming Languages"],
    createdAt: "2025-09-01",
    rules: ["Share automation wins", "Help with debugging", "No Python 2 vs 3 wars"],
    recentVoiceSnippets: [
      { id: "v10", authorName: "Elena Torres", content: "Automated my entire reporting pipeline. 3 hours now takes 5 minutes.", duration: 40, upvotes: 92, createdAt: "2026-07-18" },
    ],
    members: [{ name: "Elena Torres", joined: "2025-09-10" }],
  },
  "11": {
    name: "Startup & Product Builders",
    description: "MVP strategies, user research, launch tactics, and founder mental health.",
    memberCount: 760,
    icon: "🚀",
    tags: ["Web Development", "Design Theory"],
    createdAt: "2026-03-01",
    rules: ["Share real metrics", "Be honest about failures", "No pitching"],
    recentVoiceSnippets: [],
    members: [{ name: "David Park", joined: "2026-03-05" }],
  },
  "12": {
    name: "Open Source Contributors",
    description: "First PR to maintainer. Learn to contribute to open source.",
    memberCount: 1100,
    icon: "🌐",
    tags: ["Programming Languages", "Web Development"],
    createdAt: "2026-01-05",
    rules: ["Be welcoming to newcomers", "Follow project guidelines", "Share good first issues"],
    recentVoiceSnippets: [
      { id: "v11", authorName: "David Park", content: "My first contribution to a major OSS project was merged today!", duration: 28, upvotes: 67, createdAt: "2026-07-20" },
    ],
    members: [{ name: "David Park", joined: "2026-01-10" }],
  },
};

export default function CircleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const circle = ALL_CIRCLES[id];
  const [joined, setJoined] = useState(false);
  const [memberCount, setMemberCount] = useState(circle?.memberCount ?? 0);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [snippets, setSnippets] = useState(circle?.recentVoiceSnippets ?? []);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const toast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  if (!circle) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Circle not found</h1>
        <p className="mt-2 text-muted">This circle doesn&apos;t exist or has been removed.</p>
        <Link href="/circles" className="mt-4 inline-block">
          <Button variant="outline">Back to Circles</Button>
        </Link>
      </div>
    );
  }

  const handleJoin = () => {
    if (joined) {
      setJoined(false);
      setMemberCount((c) => c - 1);
      toast("Left the circle");
    } else {
      setJoined(true);
      setMemberCount((c) => c + 1);
      toast(`Welcome to ${circle.name}!`);
    }
  };

  const handleUpvote = (snippetId: string) => {
    setSnippets((prev) =>
      prev.map((s) => s.id === snippetId ? { ...s, upvotes: s.upvotes + 1 } : s)
    );
    toast("Upvoted!");
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast("Voice note recorded!");
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      const interval = setInterval(() => {
        setRecordingTime((t) => {
          if (t >= 59) {
            clearInterval(interval);
            setIsRecording(false);
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      {showToast && (
        <div className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 animate-fade-in rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700 shadow-lg dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
          {showToast}
        </div>
      )}

      <Link href="/circles" className="mb-6 flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Circles
      </Link>

      {/* Circle Header */}
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-3xl shrink-0">
              {circle.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{circle.name}</h1>
              <div className="mt-1 flex items-center gap-3 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {memberCount.toLocaleString()} members
                </span>
                <span>·</span>
                <span>Created {circle.createdAt}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted max-w-2xl">{circle.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {circle.tags.map((tag) => (<Badge key={tag}>{tag}</Badge>))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
          <Button onClick={handleJoin} variant={joined ? "outline" : "primary"}>
            {joined ? "✓ Joined" : <><Plus className="h-4 w-4" /> Join Circle</>}
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="ghost" size="sm">
            <Flag className="h-4 w-4" /> Report
          </Button>
        </div>
      </Card>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Voice Board — Main Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Voice Board</h2>
            {joined && (
              <div className="flex items-center gap-2">
                <button onClick={toggleRecording}
                  className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isRecording
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-accent text-white hover:bg-accent-hover"
                  )}>
                  {isRecording ? (
                    <><Pause className="h-4 w-4" /> {formatTime(recordingTime)}</>
                  ) : (
                    <><Mic className="h-4 w-4" /> Record</>
                  )}
                </button>
              </div>
            )}
          </div>

          {snippets.length === 0 ? (
            <Card className="py-12 text-center">
              <Mic className="mx-auto h-8 w-8 text-muted mb-3" />
              <p className="text-muted text-sm">No voice notes yet.</p>
              {joined && <p className="text-xs text-muted mt-1">Be the first to drop a voice note!</p>}
            </Card>
          ) : (
            snippets.map((snippet) => (
              <VoiceSnippet key={snippet.id} {...snippet} onUpvote={handleUpvote} />
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Rules */}
          <Card>
            <h3 className="text-sm font-semibold mb-3">Circle Rules</h3>
            <ol className="space-y-2">
              {circle.rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted">
                  <span className="shrink-0 font-medium text-foreground">{i + 1}.</span>
                  {rule}
                </li>
              ))}
            </ol>
          </Card>

          {/* Members */}
          <Card>
            <h3 className="text-sm font-semibold mb-3">Members</h3>
            <div className="space-y-2.5">
              {circle.members.map((member, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Avatar name={member.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-xs text-muted">Joined {member.joined}</p>
                  </div>
                </div>
              ))}
            </div>
            {memberCount > circle.members.length && (
              <p className="mt-3 text-xs text-muted text-center">
                +{(memberCount - circle.members.length).toLocaleString()} more members
              </p>
            )}
          </Card>

          {/* Tags */}
          <Card>
            <h3 className="text-sm font-semibold mb-3">Topics</h3>
            <div className="flex flex-wrap gap-1.5">
              {circle.tags.map((tag) => (<Badge key={tag}>{tag}</Badge>))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
