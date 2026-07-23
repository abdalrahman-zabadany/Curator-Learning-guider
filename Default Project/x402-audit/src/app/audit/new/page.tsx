"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Play, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import Link from "next/link";
import type { AuditScope, AuditCheck } from "@/types";

const DEFAULT_CHECKS: AuditCheck[] = [
  { id: "reentrancy", name: "Reentrancy Analysis", description: "Check for reentrancy vulnerabilities in contract calls", category: "smart-contract", severity: "critical", enabled: true },
  { id: "access-control", name: "Access Control", description: "Verify proper access control mechanisms", category: "smart-contract", severity: "high", enabled: true },
  { id: "oracle-manipulation", name: "Oracle Manipulation", description: "Check for oracle price manipulation vectors", category: "defi", severity: "critical", enabled: true },
  { id: "flash-loan", name: "Flash Loan Attack Surface", description: "Analyze flash loan attack vectors", category: "defi", severity: "high", enabled: true },
  { id: "centralization", name: "Centralization Risk", description: "Identify centralization risks and admin privileges", category: "governance", severity: "medium", enabled: true },
  { id: "upgradeable", name: "Upgradeable Contract Risks", description: "Review upgradeable proxy patterns for risks", category: "smart-contract", severity: "high", enabled: false },
];

const SCOPE_TYPES = ["vault", "protocol", "fund", "treasury", "strategy"] as const;
const SEVERITY_LEVELS = ["critical", "high", "medium", "low", "informational"] as const;

export default function NewAuditPage() {
  const router = useRouter();
  const [step, setStep] = useState<"scope" | "config" | "review">("scope");
  const [scope, setScope] = useState<AuditScope>({ target: "", type: "vault", description: "", chainIds: [10143], contractAddresses: [] });
  const [checks, setChecks] = useState<AuditCheck[]>(DEFAULT_CHECKS);
  const [reportFormat, setReportFormat] = useState<"markdown" | "json" | "html">("json");
  const [requireHumanReview, setRequireHumanReview] = useState(true);
  const [passFailPolicy, setPassFailPolicy] = useState<"strict" | "advisory">("advisory");
  const [customInstructions, setCustomInstructions] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  const addContract = () => {
    if (contractAddress.trim()) {
      setScope((s) => ({ ...s, contractAddresses: [...(s.contractAddresses || []), contractAddress.trim()] }));
      setContractAddress("");
    }
  };

  const toggleCheck = (id: string) => {
    setChecks((prev) => prev.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const addCheck = () => {
    const id = `check_${Date.now()}`;
    setChecks((prev) => [...prev, { id, name: "New Check", description: "Describe this check", category: "custom", severity: "medium", enabled: true }]);
  };

  const removeCheck = (id: string) => {
    setChecks((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCheck = (id: string, field: keyof AuditCheck, value: string | boolean) => {
    setChecks((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSubmit = async () => {
    try {
      await fetch("/api/admin", { method: "GET" });
      router.push(`/audit/new?submitted=true`);
    } catch {
      alert("Audit scope saved. In production, this submits to the x402-gated audit pipeline.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <Link href="/" className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <h1 className="text-2xl font-bold">New Security Audit</h1>
      <p className="mt-2 text-sm text-zinc-400">Define your audit scope, checks, and configuration. All methodology is user-defined.</p>

      {/* Progress */}
      <div className="mt-6 flex items-center gap-2 text-xs">
        {(["scope", "config", "review"] as const).map((s, i) => (
          <button key={s} onClick={() => setStep(s)}
            className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors",
              step === s ? "bg-indigo-500/20 text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
            )}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/20 text-[10px]">{i + 1}</span>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Step 1: Scope */}
      {step === "scope" && (
        <Card className="mt-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Audit Scope</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Target Name *</label>
              <input value={scope.target} onChange={(e) => setScope((s) => ({ ...s, target: e.target.value }))}
                placeholder="e.g. Aave V3 Lending Pool, Uniswap V4 Router"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Scope Type *</label>
              <div className="flex flex-wrap gap-2">
                {SCOPE_TYPES.map((t) => (
                  <button key={t} onClick={() => setScope((s) => ({ ...s, type: t }))}
                    className={cn("rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      scope.type === t ? "border-indigo-500 bg-indigo-500/20 text-indigo-400" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    )}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description *</label>
              <textarea value={scope.description} onChange={(e) => setScope((s) => ({ ...s, description: e.target.value }))}
                placeholder="Describe what this audit should cover..."
                rows={3}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Contract Addresses</label>
              <div className="flex gap-2">
                <input value={contractAddress} onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="0x..."
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-mono placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                <Button variant="secondary" size="sm" onClick={addContract}>Add</Button>
              </div>
              {scope.contractAddresses && scope.contractAddresses.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {scope.contractAddresses.map((addr, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-xs font-mono text-zinc-300">
                      {addr.slice(0, 6)}...{addr.slice(-4)}
                      <button onClick={() => setScope((s) => ({ ...s, contractAddresses: s.contractAddresses?.filter((_, j) => j !== i) }))} className="text-zinc-500 hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setStep("config")} disabled={!scope.target || !scope.description}>Next: Configure Checks</Button>
          </div>
        </Card>
      )}

      {/* Step 2: Config */}
      {step === "config" && (
        <Card className="mt-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Audit Configuration</h2>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Security Checks</h3>
                <Button variant="ghost" size="sm" onClick={addCheck}><Plus className="h-3 w-3" /> Add Check</Button>
              </div>
              <div className="space-y-2">
                {checks.map((check) => (
                  <div key={check.id} className="flex items-center gap-3 rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-3">
                    <button onClick={() => toggleCheck(check.id)}
                      className={cn("h-4 w-4 rounded border-2 flex items-center justify-center transition-colors",
                        check.enabled ? "border-indigo-500 bg-indigo-500" : "border-zinc-600"
                      )}>
                      {check.enabled && <span className="text-[10px] text-white">✓</span>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <input value={check.name} onChange={(e) => updateCheck(check.id, "name", e.target.value)}
                        className="w-full bg-transparent text-sm font-medium focus:outline-none" />
                      <input value={check.description} onChange={(e) => updateCheck(check.id, "description", e.target.value)}
                        className="w-full bg-transparent text-xs text-zinc-400 focus:outline-none" />
                    </div>
                    <select value={check.severity} onChange={(e) => updateCheck(check.id, "severity", e.target.value)}
                      className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs">
                      {SEVERITY_LEVELS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => removeCheck(check.id)} className="text-zinc-500 hover:text-red-400 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Report Format</label>
                <select value={reportFormat} onChange={(e) => setReportFormat(e.target.value as typeof reportFormat)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm">
                  <option value="json">JSON</option>
                  <option value="markdown">Markdown</option>
                  <option value="html">HTML</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Pass/Fail Policy</label>
                <select value={passFailPolicy} onChange={(e) => setPassFailPolicy(e.target.value as typeof passFailPolicy)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm">
                  <option value="advisory">Advisory (non-blocking)</option>
                  <option value="strict">Strict (fails on critical/high)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={requireHumanReview} onChange={(e) => setRequireHumanReview(e.target.checked)}
                  className="rounded border-zinc-600 bg-zinc-800" />
                <span className="text-sm font-medium">Require human review before finalizing</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Custom Methodology Instructions</label>
              <textarea value={customInstructions} onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Define your audit methodology, data sources, and any specific instructions for the AI agent..."
                rows={4}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="secondary" onClick={() => setStep("scope")}>Back</Button>
            <Button onClick={() => setStep("review")}>Review & Pay</Button>
          </div>
        </Card>
      )}

      {/* Step 3: Review */}
      {step === "review" && (
        <Card className="mt-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Review & Submit</h2>

          <div className="space-y-4 text-sm">
            <div className="rounded-lg bg-zinc-800/50 p-3">
              <p className="text-xs text-zinc-500 mb-1">Target</p>
              <p className="font-medium">{scope.target}</p>
              <p className="text-zinc-400">{scope.type} — {scope.description}</p>
            </div>
            <div className="rounded-lg bg-zinc-800/50 p-3">
              <p className="text-xs text-zinc-500 mb-1">Checks ({checks.filter((c) => c.enabled).length} enabled)</p>
              <div className="flex flex-wrap gap-1.5">
                {checks.filter((c) => c.enabled).map((c) => (
                  <span key={c.id} className={cn("rounded-md px-2 py-0.5 text-xs font-medium",
                    c.severity === "critical" ? "bg-red-500/20 text-red-400" :
                    c.severity === "high" ? "bg-orange-500/20 text-orange-400" :
                    c.severity === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-zinc-700 text-zinc-300"
                  )}>{c.name}</span>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-zinc-800/50 p-3">
              <p className="text-xs text-zinc-500 mb-1">Config</p>
              <p>Format: {reportFormat} · Policy: {passFailPolicy} · Human review: {requireHumanReview ? "yes" : "no"}</p>
            </div>
          </div>

          <Card className="mt-4 border-amber-500/30 bg-amber-500/5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-zinc-400">
                This audit uses x402 v2-eip155-exact on Monad testnet. Payment of 1 USDC will be required
                via the <code>/audit/run</code> endpoint. The facilitator at x402-facilitator.molandak.org
                will verify and settle the payment onchain.
              </p>
            </div>
          </Card>

          <div className="mt-6 flex justify-between">
            <Button variant="secondary" onClick={() => setStep("config")}>Back</Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Play className="h-4 w-4" /> Submit Audit Scope
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
