"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <Shield className="h-5 w-5 text-indigo-500" />
          <span>x402 Audit</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/audit/new" className="text-zinc-400 hover:text-white transition-colors">
            New Audit
          </Link>
          <Link href="/receipts" className="text-zinc-400 hover:text-white transition-colors">
            Receipts
          </Link>
          <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors">
            Admin
          </Link>
          <div className="ml-2 flex items-center gap-2 border-l border-zinc-800 pl-4">
            <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
