"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Copy, Check, ArrowLeft } from "lucide-react";

const MOCK_SECRET = "JBSWY3DPEHPK3PXP";
const MOCK_BACKUP_CODES = [
  "A7K2-M9X1", "B3L8-P4Y6", "C5N0-Q2Z5", "D1R7-S8W3",
  "E9T4-U6V2", "F2A5-X1B8", "G6C3-Y7D0", "H4E9-Z5F1",
];

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"qr" | "verify" | "backup">("qr");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code)) {
      setError("Enter a valid 6-digit code");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("backup");
    }, 600);
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(MOCK_BACKUP_CODES.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
            <Shield className="h-7 w-7 text-indigo-500" />
          </div>
          <h1 className="text-2xl font-bold">
            {step === "qr" && "Set up 2FA"}
            {step === "verify" && "Verify your code"}
            {step === "backup" && "Save backup codes"}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {step === "qr" && "Scan this QR code with your authenticator app"}
            {step === "verify" && "Enter the 6-digit code from your app"}
            {step === "backup" && "Save these codes in a safe place"}
          </p>
        </div>

        {step === "qr" && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-center">
              <div className="flex h-48 w-48 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800">
                <div className="grid grid-cols-7 gap-1">
                  {[1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,0,0,1,1,0,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,0,1,0,0,1,0,1,0,1].map((v, i) => (
                    <div key={i} className={`h-4 w-4 rounded-sm ${v ? "bg-white" : "bg-transparent"}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-3">
              <p className="text-xs text-zinc-400">Or enter this key manually:</p>
              <p className="mt-1 font-mono text-sm font-medium tracking-wider text-white">{MOCK_SECRET}</p>
            </div>
            <button
              onClick={() => setStep("verify")}
              className="w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Continue
            </button>
          </div>
        )}

        {step === "verify" && (
          <form onSubmit={handleVerify} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-center font-mono text-lg tracking-[0.3em] text-white outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Enable"}
            </button>
            <button
              type="button"
              onClick={() => setStep("qr")}
              className="flex w-full items-center justify-center gap-2 text-sm text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to QR code
            </button>
          </form>
        )}

        {step === "backup" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-amber-800 bg-amber-900/20 px-4 py-3 text-sm text-amber-400">
              Store these codes securely. Each code can only be used once if you lose access to your authenticator.
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_BACKUP_CODES.map((c) => (
                <div key={c} className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-center font-mono text-sm text-white">
                  {c}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={copyBackupCodes}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
              >
                {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy Codes</>}
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex flex-1 items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
              >
                Done
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-zinc-400">
          <Link href="/" className="font-medium text-indigo-400 hover:text-indigo-300">
            Skip for now
          </Link>
        </p>
      </div>
    </div>
  );
}
