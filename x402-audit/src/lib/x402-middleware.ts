import { NextRequest, NextResponse } from "next/server";
import { createQuote, validateQuote, consumeNonce, createPaymentRecord, storeReceipt, getJob, releaseLock } from "@/lib/store";
import { verifyPayment, settlePayment } from "@/lib/audit-engine";
import { env } from "@/lib/env";
import type { AuditQuote, AuditScope } from "@/types";

export interface X402PaymentContext {
  quote: AuditQuote;
  paymentSignature: string;
  jobId?: string;
}

function buildPaymentRequired(quote: AuditQuote): NextResponse {
  return NextResponse.json(
    {
      error: "Payment Required",
      x402Version: 2,
      quote,
      message: "This endpoint requires x402 payment. Submit paymentSignature in the request body to proceed.",
      instructions: {
        step1: "Sign the payment using v2-eip155-exact scheme with the quote details",
        step2: "Include paymentSignature in your request body",
        step3: "Resubmit the request",
      },
    },
    {
      status: 402,
      headers: {
        "X-PAYMENT-REQUIRED": JSON.stringify({ quote }),
        "Content-Type": "application/json",
      },
    }
  );
}

export async function requireX402Payment(
  request: NextRequest,
  resourcePath: string,
  scope: AuditScope,
  options?: { price?: string; jobId?: string }
): Promise<{ success: boolean; response?: NextResponse; paymentContext?: X402PaymentContext }> {
  const body = await request.clone().json().catch(() => ({}));
  const { paymentSignature } = body as { paymentSignature?: string; idempotencyKey?: string };

  if (!paymentSignature) {
    const quote = createQuote(scope, resourcePath, options?.price);
    return { success: false, response: buildPaymentRequired(quote) };
  }

  const quote = (body as { quote?: AuditQuote }).quote;
  if (!quote) {
    return { success: false, response: NextResponse.json({ error: "MISSING_QUOTE" }, { status: 400 }) };
  }

  const validation = validateQuote(quote, resourcePath, scope, paymentSignature);
  if (!validation.valid) {
    return { success: false, response: NextResponse.json({ error: validation.error }, { status: 402 }) };
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
    return { success: false, response: NextResponse.json({ error: verification.error }, { status: 402 }) };
  }

  consumeNonce(quote.nonce, paymentSignature);

  const payerAddress = (body as { payerAddress?: string }).payerAddress;
  createPaymentRecord(
    options?.jobId || quote.id,
    quote.id,
    paymentSignature,
    quote.price,
    quote.token,
    quote.network,
    payerAddress
  );

  return {
    success: true,
    paymentContext: {
      quote,
      paymentSignature,
      jobId: options?.jobId,
    },
  };
}

export async function completeX402Settlement(
  paymentSignature: string,
  resourcePath: string,
  jobId: string
): Promise<{ txHash?: string; receipt?: string; error?: string }> {
  const result = await settlePayment(paymentSignature, resourcePath);
  if (result.success) {
    const job = getJob(jobId);
    if (job) {
      storeReceipt(jobId, {
        paymentSignature,
        txHash: result.txHash,
        facilitatorResponse: result.receipt,
        amount: job.paymentReceipt?.amount || env.DEFAULT_AUDIT_PRICE_USDC,
        token: env.MONAD_TESTNET_USDC,
        network: env.MONAD_TESTNET_NETWORK,
        resourcePath,
        nonce: "",
        timestamp: new Date().toISOString(),
      });
      releaseLock(jobId);
    }
    return { txHash: result.txHash, receipt: result.receipt };
  }
  return { error: result.error };
}

export function buildX402ReceiptHeaders(
  txHash?: string,
  facilitatorResponse?: string
): Record<string, string> {
  const headers: Record<string, string> = {};
  const response: Record<string, unknown> = {};
  if (txHash) response.txHash = txHash;
  if (facilitatorResponse) {
    try { response.facilitator = JSON.parse(facilitatorResponse); } catch { response.facilitator = facilitatorResponse; }
  }
  headers["X-PAYMENT-RESPONSE"] = JSON.stringify(response);
  return headers;
}
