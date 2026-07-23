"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const faqs = [
  {
    q: "What is Curator?",
    a: "Curator is a peer-to-peer course review and learning platform. We help self-directed learners find honest course reviews, follow curated learning pathways, and connect with communities of fellow learners.",
  },
  {
    q: "Is Curator free?",
    a: "Yes! Curator is completely free to use. We don't sell courses, run ads, or have affiliate partnerships that bias our reviews. Our goal is to be the most trustworthy source of course information on the internet.",
  },
  {
    q: "How are course reviews verified?",
    a: "We use a combination of verified enrollment checks, helpfulness voting, and community moderation to ensure reviews are authentic. Reviews marked as 'verified' come from learners who can prove they completed the course.",
  },
  {
    q: "What is the WorthItMeter?",
    a: "The WorthItMeter is our proprietary rating system that aggregates community votes to show what percentage of reviewers found a course worth their time and money. It's a quick visual indicator, but we always recommend reading the full reviews.",
  },
  {
    q: "How do Learning Pathways work?",
    a: "Learning Pathways are curated sequences of courses and resources designed by experienced learners and educators. They provide a structured route through a topic, with estimated time commitments and skill-level indicators.",
  },
  {
    q: "What are Community Circles?",
    a: "Circles are topic-based communities where learners can connect, share voice notes, discuss courses, and hold each other accountable. Think of them as small, focused learning groups.",
  },
  {
    q: "Can I submit my own course for review?",
    a: "Absolutely! Course creators are welcome to add their courses to our directory. However, they cannot review their own course or incentivize positive reviews. Transparency is core to our mission.",
  },
  {
    q: "How do I report a fake or biased review?",
    a: "Click the flag icon on any review to report it. Our moderation team reviews flagged content within 48 hours. Repeat offenders are banned from the platform.",
  },
  {
    q: "Do you plan to sell courses directly?",
    a: "No. Curator will always be an independent review and community platform. We will never sell courses or take commissions from course platforms. This is how we maintain our objectivity.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      <p className="mt-3 text-lg text-muted">
        Everything you need to know about Curator.
      </p>

      <div className="mt-10 space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border border-border bg-card transition-colors">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-sm font-medium pr-4">{faq.q}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted transition-transform duration-200",
                  openIndex === i && "rotate-180"
                )}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-sm text-muted leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
