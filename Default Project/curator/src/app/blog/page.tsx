"use client";

import { Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

const posts = [
  {
    id: 1,
    title: "Why We Built Curator: The Trust Problem in Online Education",
    excerpt: "The online course market is booming, but learners are struggling to find honest, unbiased reviews. Here's how we're trying to fix that.",
    date: "2026-07-15",
    tag: "Company",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "The State of Self-Taught Developers in 2026",
    excerpt: "Our data reveals which platforms are most popular, which courses get the best reviews, and what self-taught developers actually want to learn.",
    date: "2026-07-01",
    tag: "Research",
    readTime: "8 min",
  },
  {
    id: 3,
    title: "How Voice Notes Are Changing Community Learning",
    excerpt: "Text-based forums have their place, but there's something uniquely powerful about hearing a fellow learner's voice. Our circles are proving it.",
    date: "2026-06-18",
    tag: "Product",
    readTime: "4 min",
  },
  {
    id: 4,
    title: "Worth It? A Framework for Evaluating Online Courses",
    excerpt: "Before you spend $50 on a Udemy course or $50/month on Coursera, here's a systematic approach to figuring out if it's worth your time and money.",
    date: "2026-06-01",
    tag: "Learning",
    readTime: "6 min",
  },
  {
    id: 5,
    title: "5 Things We Learned Launching Our First Learning Pathways",
    excerpt: "Our curated pathways hit some unexpected notes with users. Here's what worked, what didn't, and what we're building next.",
    date: "2026-05-15",
    tag: "Product",
    readTime: "5 min",
  },
];

const tagColors: Record<string, string> = {
  Company: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  Research: "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  Product: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Learning: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="mt-3 text-lg text-muted max-w-2xl">
        Thoughts on self-directed learning, online education, and building Curator.
      </p>

      <div className="mt-10 space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="group cursor-pointer transition-all duration-200 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tagColors[post.tag] || ""}`}>{post.tag}</span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                  <span className="text-xs text-muted">· {post.readTime}</span>
                </div>
                <h2 className="text-lg font-semibold group-hover:text-accent transition-colors">{post.title}</h2>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">{post.excerpt}</p>
              </div>
              <ArrowRight className="mt-2 h-5 w-5 shrink-0 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
