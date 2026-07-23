"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { PageSkeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface Job { id: string; scope: { target: string; type: string; description: string }; status: string; report?: { findings: unknown[]; summary: Record<string, number>; passed: boolean; humanReviewed: boolean }; createdAt: string; }

export default function ReceiptsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin");
        const data = await res.json();
        if (!cancelled) setJobs(data.jobs || []);
      } catch { /* empty */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const refresh = async () => {
    setLoading(true);
    const res = await fetch("/api/admin");
    const data = await res.json();
    setJobs(data.jobs || []);
    setLoading(false);
  };

  const statusColors: Record<string, string> = {
    completed: "bg-emerald-500/20 text-emerald-400",
    running: "bg-blue-500/20 text-blue-400",
    pending_payment: "bg-amber-500/20 text-amber-400",
    paid: "bg-indigo-500/20 text-indigo-400",
    failed: "bg-red-500/20 text-red-400",
    refunded: "bg-zinc-500/20 text-zinc-400",
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <Link href="/" className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audit Receipts</h1>
          <p className="mt-1 text-sm text-zinc-400">
            <AnimatedNumber value={jobs.length} className="font-medium text-white" /> payment receipts and audit results tied to x402 settlements.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={refresh}>
          <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {jobs.length === 0 ? (
          <Card className="py-12 text-center">
            <p className="text-zinc-400">No audit jobs yet.</p>
            <Link href="/audit/new" className="mt-3 inline-block">
              <Button size="sm">Start an Audit</Button>
            </Link>
          </Card>
        ) : (
          jobs.map((job, i) => (
            <Card key={job.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` } as React.CSSProperties}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/audit/${job.id}`} className="font-medium hover:text-indigo-400 transition-colors">
                      {job.scope.target}
                    </Link>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", statusColors[job.status] || "bg-zinc-700 text-zinc-300")}>
                      {job.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">{job.scope.type} — {job.scope.description}</p>
                  <p className="mt-1 text-[11px] text-zinc-500 font-mono">{job.id}</p>
                </div>
                <div className="text-right shrink-0">
                  {job.report && (
                    <div className="text-xs">
                      <p className={cn("font-medium", job.report.passed ? "text-emerald-400" : "text-red-400")}>
                        {job.report.passed ? "PASSED" : "FAILED"}
                      </p>
                      <p className="text-zinc-500"><AnimatedNumber value={job.report.summary?.total || 0} /> findings</p>
                    </div>
                  )}
                  <p className="mt-1 text-[10px] text-zinc-500">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
