import { NextRequest, NextResponse } from "next/server";
import { requireX402Payment } from "@/lib/x402-middleware";
import { createJob, getJobByIdempotencyKey, acquireLock, updateJob, getJob, validateQuote, consumeNonce } from "@/lib/store";
import { runAuditWorkflow, settlePayment, verifyPayment } from "@/lib/audit-engine";
import { env } from "@/lib/env";
import { randomBytes } from "crypto";
import type { AuditScope, AuditConfig, AuditQuote } from "@/types";

const MAX_TARGET_LENGTH = 256;
const MAX_DESCRIPTION_LENGTH = 4096;
const VALID_SCOPE_TYPES = ["vault", "protocol", "fund", "treasury", "strategy"] as const;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const { scope, config, idempotencyKey, paymentSignature, quote } = body as {
    scope: AuditScope;
    config: AuditConfig;
    idempotencyKey?: string;
    paymentSignature?: string;
    quote?: AuditQuote;
  };

  if (!scope?.target || !scope?.type || !scope?.description) {
    return NextResponse.json({ error: "MISSING_SCOPE_FIELDS" }, { status: 400 });
  }

  if (scope.target.length > MAX_TARGET_LENGTH || scope.description.length > MAX_DESCRIPTION_LENGTH) {
    return NextResponse.json({ error: "INPUT_TOO_LONG" }, { status: 400 });
  }

  if (!VALID_SCOPE_TYPES.includes(scope.type as typeof VALID_SCOPE_TYPES[number])) {
    return NextResponse.json({ error: "INVALID_SCOPE_TYPE" }, { status: 400 });
  }

  if (scope.contractAddresses) {
    for (const addr of scope.contractAddresses) {
      if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) {
        return NextResponse.json({ error: "INVALID_CONTRACT_ADDRESS" }, { status: 400 });
      }
    }
  }

  const idemKey = idempotencyKey || `idem_${randomBytes(16).toString("hex")}`;
  const existing = getJobByIdempotencyKey(idemKey);
  if (existing) {
    return NextResponse.json({ job: existing, message: "Idempotent replay" });
  }

  const resourcePath = "/audit/run";

  if (!paymentSignature || !quote) {
    const result = await requireX402Payment(request, resourcePath, scope);
    if (!result.success) return result.response!;
  }

  if (quote && paymentSignature) {
    if (quote.price !== env.DEFAULT_AUDIT_PRICE_USDC) {
      return NextResponse.json({ error: "PRICE_MISMATCH" }, { status: 402 });
    }

    const validation = validateQuote(quote, resourcePath, scope, paymentSignature);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 402 });
    }

    const verification = await verifyPayment(paymentSignature, {
      price: quote.price,
      token: quote.token,
      network: quote.network,
      recipient: quote.recipient,
      nonce: quote.nonce,
      resourcePath: quote.resourcePath,
    });

    if (!verification.success) {
      return NextResponse.json({ error: "PAYMENT_VERIFICATION_FAILED" }, { status: 402 });
    }

    consumeNonce(quote.nonce, paymentSignature);
  }

  const job = createJob(scope, config as never, quote?.id || "unknown", idemKey);
  job.status = "paid";

  if (!acquireLock(job.id)) {
    return NextResponse.json({ error: "DUPLICATE_CONCURRENT_RUN" }, { status: 409 });
  }

  try {
    updateJob(job.id, { status: "running" });

    const report = await runAuditWorkflow(scope, config);
    report.jobId = job.id;

    updateJob(job.id, {
      status: "completed",
      report,
      artifacts: [
        {
          id: `art_${randomBytes(8).toString("hex")}`,
          type: "report",
          filename: `report-${job.id}.json`,
          size: JSON.stringify(report).length,
          hash: "",
          createdAt: new Date().toISOString(),
        },
      ],
    });

    if (quote && paymentSignature) {
      const settleResult = await settlePayment(paymentSignature, resourcePath);
      if (!settleResult.success) {
        updateJob(job.id, { status: "completed", paymentReceipt: { paymentSignature, txHash: undefined, amount: env.DEFAULT_AUDIT_PRICE_USDC, token: env.MONAD_TESTNET_USDC, network: env.MONAD_TESTNET_NETWORK, resourcePath, nonce: quote.nonce, timestamp: new Date().toISOString() } });
      }
    }

    const settledJob = getJob(job.id);
    return NextResponse.json({ job: settledJob }, { status: 200 });
  } catch {
    updateJob(job.id, { status: "failed" });
    return NextResponse.json({ error: "AUDIT_FAILED" }, { status: 500 });
  }
}
