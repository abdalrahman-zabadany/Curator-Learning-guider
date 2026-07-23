"use client";

import Link from "next/link";
import { Shield, Lock, FileText, Receipt, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const features = [
  { icon: <Lock className="h-5 w-5" />, title: "x402 Payment Gate", desc: "Every audit is gated with Monad x402. Pay per report with USDC on testnet." },
  { icon: <FileText className="h-5 w-5" />, title: "User-Defined Methodology", desc: "Define your own checks, severity rubric, data sources, and pass/fail policy." },
  { icon: <Shield className="h-5 w-5" />, title: "Extension Points", desc: "Vaults, protocols, funds, treasuries, strategies — audit anything with custom workflows." },
  { icon: <Receipt className="h-5 w-5" />, title: "Onchain Receipts", desc: "Every payment is settled onchain via the Monad x402 Facilitator." },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 animate-fade-in">
          <Shield className="h-8 w-8 text-indigo-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight animate-fade-in">
          x402 Audit Agent
        </h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto animate-fade-in">
          AI-powered security audit agent for crypto funds. Pay per audit with Monad USDC.
          Define your own methodology, checks, and severity rubric.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 animate-fade-in">
          <Link href="/audit/new">
            <Button>Start New Audit</Button>
          </Link>
          <Link href="/receipts">
            <Button variant="secondary">View Receipts</Button>
          </Link>
        </div>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        {features.map((f, i) => (
          <Card key={f.title} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` } as React.CSSProperties}>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">{f.icon}</div>
              <div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 border-red-500/30 bg-red-500/5 animate-fade-in">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-red-400">Production Warning</h3>
            <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
              Real fund audits require user-defined methodology, expert review, legal and compliance
              review, and independent security validation. This agent generates placeholder findings
              — you must define your own checks, severity rubric, data sources, report format,
              human review requirements, and pass/fail policy.
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs text-zinc-500 animate-fade-in">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <p className="font-medium text-zinc-300">Network</p>
          <p className="mt-1">Monad Testnet</p>
          <p className="font-mono text-zinc-400">eip155:10143</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <p className="font-medium text-zinc-300">Token</p>
          <p className="mt-1">USDC</p>
          <p className="font-mono text-zinc-400">0x534b...43A3</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <p className="font-medium text-zinc-300">Protocol</p>
          <p className="mt-1">x402 v2</p>
          <p className="font-mono text-zinc-400">exact</p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {[
          { label: "Audits Run", value: 0 },
          { label: "Findings", value: 0 },
          { label: "USDC Settled", value: 0 },
          { label: "Jobs Active", value: 0 },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <AnimatedNumber value={stat.value} className="text-3xl font-bold text-indigo-400" />
            <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
