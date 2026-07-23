"use client";

import { Users, Target, Shield, Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const values = [
  { icon: <Users className="h-6 w-6" />, title: "Community First", desc: "We believe the best learning happens together. Every feature is designed to connect, not isolate." },
  { icon: <Target className="h-6 w-6" />, title: "Radical Transparency", desc: "Honest reviews, real experiences, no hidden agendas. If a course isn't worth it, we'll say so." },
  { icon: <Shield className="h-6 w-6" />, title: "Learner Autonomy", desc: "We don't tell you what to learn. We give you the data, the voices, and the tools to decide for yourself." },
  { icon: <Heart className="h-6 w-6" />, title: "Accessibility", desc: "Education should be accessible to everyone, regardless of background, location, or budget." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <h1 className="text-3xl font-bold">About Curator</h1>
      <p className="mt-3 text-lg text-muted max-w-2xl">
        We&apos;re building a better way for self-directed learners to find, review, and navigate online courses — together.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {values.map((v) => (
          <Card key={v.title}>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">{v.icon}</div>
              <div>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">{v.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-10">
        <h2 className="text-xl font-semibold">Our Story</h2>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Curator started with a simple frustration: the internet is full of incredible learning resources,
          but figuring out which ones are actually worth your time is painfully difficult. Course platforms
          market themselves aggressively. Review sites are gamed. And word-of-mouth only goes so far.
        </p>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          We thought: what if self-directed learners could build their own review platform? One that&apos;s
          by learners, for learners. No sponsorships. No affiliate bias. Just honest voices helping each
          other make better decisions about where to invest their limited time and money.
        </p>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          That&apos;s Curator. It&apos;s not a course platform. It&apos;s not a MOOC. It&apos;s the missing
          layer of trust between you and the overwhelming ocean of online education.
        </p>
      </Card>

      <div className="mt-10 text-center">
        <Link href="/">
          <Button variant="primary">Explore Curator</Button>
        </Link>
      </div>
    </div>
  );
}
