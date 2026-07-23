"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { PageSkeleton, FindingsSkeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface Finding { id: string; checkName: string; severity: string; title: string; description: string; recommendation: string; }
interface Report { jobId: string; scope: { target: string; type: string; description: string }; findings: Finding[]; summary: Record<string, number>; passed: boolean; humanReviewed: boolean; methodology: string; }
interface Job { id: string; scope: { target: string; type: string; description: string }; status: string; report?: Report; paymentReceipt?: { amount: string; token: string; txHash?: string }; createdAt: string; }

const sevColors: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  informational: "bg-zinc-700/50 text-zinc-300 border-zinc-600",
};

export default function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin").then((r) => r.json()).then((data) => {
      const found = (data.jobs || []).find((j: Job) => j.id === id);
      if (!cancelled) {
        setJob(found || null);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <PageSkeleton />;
  if (!job) return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h1 className="text-xl font-bold">Audit not found</h1>
      <Link href="/" className="mt-4 inline-block"><Button variant="secondary">Back</Button></Link>
    </div>
  );

  const report = job.report;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <Link href="/" className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <Card className="animate-fade-in">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{job.scope.target}</h1>
              <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-[10px] font-medium">{job.status}</span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">{job.scope.type} — {job.scope.description}</p>
            <p className="mt-1 text-[11px] text-zinc-500 font-mono">{job.id}</p>
          </div>
          {report && (
            <div className="text-right shrink-0">
              <p className={cn("text-2xl font-bold", report.passed ? "text-emerald-400" : "text-red-400")}>
                {report.passed ? "PASSED" : "FAILED"}
              </p>
              {report.humanReviewed && <p className="text-xs text-emerald-400">✓ Human reviewed</p>}
            </div>
          )}
        </div>
      </Card>

      {job.paymentReceipt && (
        <Card className="mt-4 animate-fade-in" style={{ animationDelay: "100ms" } as React.CSSProperties}>
          <h3 className="text-sm font-semibold mb-2">Payment Receipt</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-zinc-500">Amount:</span> <AnimatedNumber value={parseInt(job.paymentReceipt.amount) || 0} /> {job.paymentReceipt.token}</div>
            <div><span className="text-zinc-500">Network:</span> Monad Testnet</div>
            {job.paymentReceipt.txHash && (
              <div className="col-span-2"><span className="text-zinc-500">Tx:</span> <span className="font-mono text-xs">{job.paymentReceipt.txHash}</span></div>
            )}
          </div>
        </Card>
      )}

      {report ? (
        <>
          <Card className="mt-4 animate-fade-in" style={{ animationDelay: "200ms" } as React.CSSProperties}>
            <h3 className="text-sm font-semibold mb-3">Findings Summary</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {(["critical", "high", "medium", "low", "informational"] as const).map((s) => (
                <div key={s} className={cn("rounded-lg border p-3", sevColors[s])}>
                  <AnimatedNumber value={report.summary?.[s] || 0} className="text-2xl font-bold" />
                  <p className="text-[10px] font-medium uppercase">{s}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="mt-4 space-y-3">
            <h3 className="text-sm font-semibold">Findings (<AnimatedNumber value={report.findings.length} className="inline" />)</h3>
            {report.findings.map((f, i) => (
              <Card key={f.id} className="animate-fade-in" style={{ animationDelay: `${300 + i * 80}ms` } as React.CSSProperties}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-medium border", sevColors[f.severity])}>{f.severity}</span>
                      <span className="font-medium text-sm">{f.title}</span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{f.description}</p>
                    <p className="mt-2 text-xs text-zinc-500"><span className="font-medium text-zinc-300">Recommendation:</span> {f.recommendation}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-4 border-zinc-700 animate-fade-in" style={{ animationDelay: "500ms" } as React.CSSProperties}>
            <h3 className="text-sm font-semibold mb-2">Methodology</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{report.methodology}</p>
          </Card>
        </>
      ) : (
        <div className="mt-4">
          <FindingsSkeleton />
        </div>
      )}
    </div>
  );
}
