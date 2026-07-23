export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-zinc-500">
        <p className="font-medium text-red-400/90">
          PRODUCTION WARNING: Real fund audits require user-defined methodology, expert review,
          legal and compliance review, and independent security validation.
        </p>
        <p className="mt-2">
          This is a test build using Monad testnet USDC. x402 v2 · Monad eip155:10143
        </p>
        <p className="mt-1">
          &copy; {new Date().getFullYear()} x402 Audit Agent
        </p>
      </div>
    </footer>
  );
}
