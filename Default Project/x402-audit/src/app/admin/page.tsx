"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCcw, CheckCircle, XCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { PageSkeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface Job { id: string; scope: { target: string; type: string; description: string }; status: string; report?: { findings: unknown[]; summary: Record<string, number>; passed: boolean; humanReviewed: boolean }; createdAt: string; }
interface Payment { id: string; jobId: string; amount: string; token: string; status: string; createdAt: string; }

export default function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tab, setTab] = useState<"jobs" | "payments">("jobs");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin");
        const data = await res.json();
        if (!cancelled) setJobs(data.jobs || []);
        const pres = await fetch("/api/admin?action=payments");
        const pdata = await pres.json();
        if (!cancelled) setPayments(pdata.payments || []);
      } catch { /* empty */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const approveReview = async (jobId: string) => {
    await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "approve_review", jobId }) });
    const res = await fetch("/api/admin");
    const data = await res.json();
    setJobs(data.jobs || []);
  };

  const refund = async (jobId: string) => {
    if (!confirm("Initiate refund?")) return;
    await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "refund", jobId }) });
    const res = await fetch("/api/admin");
    const data = await res.json();
    setJobs(data.jobs || []);
  };

  const refresh = async () => {
    setLoading(true);
    const res = await fetch("/api/admin");
    const data = await res.json();
    setJobs(data.jobs || []);
    const pres = await fetch("/api/admin?action=payments");
    const pdata = await pres.json();
    setPayments(pdata.payments || []);
    setLoading(false);
  };

  const statusColors: Record<string, string> = {
    completed: "bg-emerald-500/20 text-emerald-400",
    running: "bg-blue-500/20 text-blue-400",
    pending_payment: "bg-amber-500/20 text-amber-400",
    paid: "bg-indigo-500/20 text-indigo-400",
    failed: "bg-red-500/20 text-red-400",
    refunded: "bg-zinc-500/20 text-zinc-400",
    refunding: "bg-amber-500/20 text-amber-400",
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <Link href="/" className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="h-5 w-5 text-indigo-400" /> Admin</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage audit jobs, approve reports, process refunds.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={refresh}>
          <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Card>
          <AnimatedNumber value={jobs.length} className="text-2xl font-bold text-indigo-400" />
          <p className="text-xs text-zinc-500 mt-1">Total Jobs</p>
        </Card>
        <Card>
          <AnimatedNumber value={jobs.filter((j) => j.status === "completed").length} className="text-2xl font-bold text-emerald-400" />
          <p className="text-xs text-zinc-500 mt-1">Completed</p>
        </Card>
        <Card>
          <AnimatedNumber value={payments.length} className="text-2xl font-bold text-amber-400" />
          <p className="text-xs text-zinc-500 mt-1">Payments</p>
        </Card>
      </div>

      <div className="mt-6 flex gap-2 text-sm">
        <button onClick={() => setTab("jobs")} className={cn("rounded-lg px-3 py-1.5 font-medium transition-colors", tab === "jobs" ? "bg-indigo-500/20 text-indigo-400" : "text-zinc-400 hover:text-white")}>
          Jobs (<AnimatedNumber value={jobs.length} className="inline" />)
        </button>
        <button onClick={() => setTab("payments")} className={cn("rounded-lg px-3 py-1.5 font-medium transition-colors", tab === "payments" ? "bg-indigo-500/20 text-indigo-400" : "text-zinc-400 hover:text-white")}>
          Payments (<AnimatedNumber value={payments.length} className="inline" />)
        </button>
      </div>

      {tab === "jobs" && (
        <div className="mt-4 space-y-3">
          {jobs.length === 0 ? (
            <Card className="py-8 text-center text-zinc-400">No jobs yet.</Card>
          ) : jobs.map((job) => (
            <Card key={job.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/audit/${job.id}`} className="font-medium hover:text-indigo-400">{job.scope.target}</Link>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", statusColors[job.status] || "bg-zinc-700 text-zinc-300")}>{job.status}</span>
                  </div>
                  {job.report && (
                    <p className="mt-1 text-xs text-zinc-400">
                      <AnimatedNumber value={job.report.summary?.critical || 0} className="text-red-400" /> critical · <AnimatedNumber value={job.report.summary?.high || 0} className="text-orange-400" /> high · <AnimatedNumber value={job.report.summary?.medium || 0} className="text-yellow-400" /> medium
                      {job.report.humanReviewed && <span className="ml-2 text-emerald-400">✓ Human reviewed</span>}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  {job.status === "completed" && !job.report?.humanReviewed && (
                    <Button size="sm" variant="secondary" onClick={() => approveReview(job.id)}>
                      <CheckCircle className="h-3 w-3" /> Approve
                    </Button>
                  )}
                  {["completed", "paid"].includes(job.status) && (
                    <Button size="sm" variant="danger" onClick={() => refund(job.id)}>
                      <XCircle className="h-3 w-3" /> Refund
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "payments" && (
        <div className="mt-4 space-y-3">
          {payments.length === 0 ? (
            <Card className="py-8 text-center text-zinc-400">No payments yet.</Card>
          ) : payments.map((p) => (
            <Card key={p.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium font-mono">{p.id}</p>
                  <p className="text-xs text-zinc-400">Job: {p.jobId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{p.amount} USDC</p>
                  <p className={cn("text-xs", p.status === "settled" ? "text-emerald-400" : "text-zinc-400")}>{p.status}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
