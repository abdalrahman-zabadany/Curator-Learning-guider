"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function TwoFactorVerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [useBackup, setUseBackup] = useState(false);
  const [backupCode, setBackupCode] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (useBackup) {
      if (!backupCode.trim()) {
        setError("Enter a backup code");
        return;
      }
    } else if (!/^\d{6}$/.test(code)) {
      setError("Enter a valid 6-digit code");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 600);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
            <Shield className="h-7 w-7 text-accent" />
          </div>
          <h1 className="text-2xl font-bold">Two-factor authentication</h1>
          <p className="mt-1 text-sm text-muted">
            {useBackup ? "Enter one of your backup codes" : "Enter the code from your authenticator app"}
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          {!useBackup ? (
            <div>
              <label className="mb-1.5 block text-sm font-medium">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                autoFocus
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-center font-mono text-lg tracking-[0.3em] outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-sm font-medium">Backup Code</label>
              <input
                type="text"
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value.slice(0, 9))}
                placeholder="XXXX-XXXX"
                maxLength={9}
                autoFocus
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-center font-mono text-sm tracking-wider outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </form>

        <button
          onClick={() => { setUseBackup(!useBackup); setError(""); setCode(""); setBackupCode(""); }}
          className="mt-4 w-full text-center text-sm text-muted hover:text-foreground"
        >
          {useBackup ? "Use authenticator app instead" : "Use a backup code instead"}
        </button>

        <div className="mt-6 flex items-center justify-center">
          <Link href="/login" className="flex items-center gap-2 text-sm text-muted hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
