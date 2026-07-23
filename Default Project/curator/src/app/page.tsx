import Link from "next/link";
import {
  Map,
  Users,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const features = [
  {
    icon: Star,
    title: "Deep Course Reviews",
    description:
      "Honest, anonymous reviews with a clear Worth-It metric. Know exactly what you're signing up for.",
    link: "/reviews",
    badge: "Worth-It Score",
  },
  {
    icon: Map,
    title: "Learning Pathways",
    description:
      "Crowdsourced roadmaps showing the exact steps real people took to build skills and land jobs.",
    link: "/pathways",
    badge: "Fork & Customize",
  },
  {
    icon: Users,
    title: "Circles",
    description:
      "Niche community spaces with voice boards and audio snippets. Real human connection, no noise.",
    link: "/circles",
    badge: "Audio First",
  },
];

const stats = [
  { value: "12K+", label: "Course Reviews" },
  { value: "3.4K", label: "Learning Pathways" },
  { value: "890", label: "Active Circles" },
  { value: "45K+", label: "Learners" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="dot-grid absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center lg:px-6 lg:py-32">
          <Badge variant="info" className="mb-6">
            Built for self-directed learners
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find courses that are
            <br />
            <span className="text-accent">actually worth it</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Peer reviews, learning roadmaps, and voice-powered community circles
            — everything you need to make smart decisions about online education.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/reviews">
              <Button size="lg">
                Browse Reviews
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pathways">
              <Button variant="outline" size="lg">
                Explore Pathways
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="mt-1 text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 lg:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Three pillars designed to replace guesswork with clarity in your learning journey.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description, link, badge }) => (
            <Link key={title} href={link}>
              <Card hover className="h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <h3 className="font-semibold">{title}</h3>
                  <Badge>{badge}</Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
                <div className="mt-4 text-sm font-medium text-accent">
                  Explore →
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust indicators */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Anonymous Reviews</h3>
                <p className="mt-1 text-sm text-muted">
                  Share honest opinions without revealing your identity. Full privacy toggle on every review.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Verified Completions</h3>
                <p className="mt-1 text-sm text-muted">
                  Optionally attach certificate links to prove you actually finished the course.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <Map className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Forkable Pathways</h3>
                <p className="mt-1 text-sm text-muted">
                  Clone any learning roadmap and customize it to fit your goals, pace, and interests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center lg:px-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Stop guessing. Start learning smart.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Join thousands of self-directed learners who make informed decisions about their education.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/reviews">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pathways">
              <Button variant="outline" size="lg">
                Browse Pathways
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
