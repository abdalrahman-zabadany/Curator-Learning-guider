import { describe, it, expect } from "vitest";
import {
  computeScopeHash,
  generateNonce,
  createQuote,
  validateQuote,
  consumeNonce,
  acquireLock,
  releaseLock,
  createJob,
  getJob,
  updateJob,
  createPaymentRecord,
  storeReceipt,
  getJobByIdempotencyKey,
} from "../store";
import type { AuditScope } from "@/types";

const testScope: AuditScope = {
  target: "Test Protocol",
  type: "protocol",
  description: "Security audit of test protocol",
  chainIds: [10143],
  contractAddresses: ["0x1234567890abcdef1234567890abcdef12345678"],
};

describe("x402 Payment Binding", () => {
  it("computes deterministic scope hash", () => {
    const hash1 = computeScopeHash(testScope);
    const hash2 = computeScopeHash(testScope);
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/);
  });

  it("scope hash changes when scope changes", () => {
    const hash1 = computeScopeHash(testScope);
    const changed = { ...testScope, target: "Different Protocol" };
    const hash2 = computeScopeHash(changed);
    expect(hash1).not.toBe(hash2);
  });

  it("creates quote with correct fields", () => {
    const quote = createQuote(testScope, "/audit/quote");
    expect(quote.id).toMatch(/^quote_/);
    expect(quote.resourcePath).toBe("/audit/quote");
    expect(quote.token).toBe("0x534b2f3A21130d7a60830c2Df862319e593943A3");
    expect(quote.network).toBe("eip155:10143");
    expect(quote.scheme).toBe("v2-eip155-exact");
    expect(quote.expiry).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it("generates unique nonces", () => {
    const nonce1 = generateNonce();
    const nonce2 = generateNonce();
    expect(nonce1).not.toBe(nonce2);
    expect(nonce1).toMatch(/^[a-f0-9]{32}$/);
  });
});

describe("Quote Validation", () => {
  it("rejects expired quotes", () => {
    const quote = createQuote(testScope, "/audit/quote");
    const expired = { ...quote, expiry: Math.floor(Date.now() / 1000) - 100 };
    const result = validateQuote(expired, "/audit/quote", testScope, "sig123");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("QUOTE_EXPIRED");
  });

  it("rejects wrong resource path", () => {
    const quote = createQuote(testScope, "/audit/quote");
    const result = validateQuote(quote, "/audit/run", testScope, "sig123");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("RESOURCE_PATH_MISMATCH");
  });

  it("rejects changed scope", () => {
    const quote = createQuote(testScope, "/audit/quote");
    const differentScope = { ...testScope, target: "Hacked Protocol" };
    const result = validateQuote(quote, "/audit/quote", differentScope, "sig123");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("SCOPE_CHANGED");
  });

  it("rejects wrong token", () => {
    const quote = createQuote(testScope, "/audit/quote");
    const wrongToken = { ...quote, token: "0xWRONG" };
    const result = validateQuote(wrongToken, "/audit/quote", testScope, "sig123");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("WRONG_TOKEN");
  });

  it("rejects wrong network", () => {
    const quote = createQuote(testScope, "/audit/quote");
    const wrongNet = { ...quote, network: "eip155:1" };
    const result = validateQuote(wrongNet, "/audit/quote", testScope, "sig123");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("WRONG_NETWORK");
  });

  it("rejects wrong recipient", () => {
    const quote = createQuote(testScope, "/audit/quote");
    const wrongRecip = { ...quote, recipient: "0xAAA" };
    const result = validateQuote(wrongRecip, "/audit/quote", testScope, "sig123");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("WRONG_RECIPIENT");
  });

  it("accepts valid quote", () => {
    const quote = createQuote(testScope, "/audit/quote");
    const result = validateQuote(quote, "/audit/quote", testScope, "sig123");
    expect(result.valid).toBe(true);
  });
});

describe("Replay Protection", () => {
  it("rejects replayed nonce", () => {
    const quote = createQuote(testScope, "/audit/quote");
    consumeNonce(quote.nonce, "sig1");
    const result = validateQuote(quote, "/audit/quote", testScope, "sig2");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("NONCE_REPLAYED");
  });

  it("rejects replayed signature", () => {
    const quote = createQuote(testScope, "/audit/quote");
    consumeNonce(quote.nonce, "sig_same");
    const quote2 = createQuote(testScope, "/audit/quote");
    const result = validateQuote(quote2, "/audit/quote", testScope, "sig_same");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("SIGNATURE_REPLAYED");
  });
});

describe("Concurrency Locking", () => {
  it("acquires lock on first attempt", () => {
    const result = acquireLock("job-1");
    expect(result).toBe(true);
  });

  it("rejects concurrent lock on same job", () => {
    acquireLock("job-2");
    const result = acquireLock("job-2");
    expect(result).toBe(false);
  });

  it("releases lock", () => {
    acquireLock("job-3");
    releaseLock("job-3");
    const result = acquireLock("job-3");
    expect(result).toBe(true);
    releaseLock("job-3");
  });
});

describe("Refund States", () => {
  it("transitions job to refunding", () => {
    const job = createJob(testScope, { checks: [], severityRubric: {}, dataSources: [], reportFormat: "json", requireHumanReview: false, passFailPolicy: "advisory" }, "q1", "idem-refund");
    updateJob(job.id, { status: "refunding" });
    const updated = getJob(job.id);
    expect(updated?.status).toBe("refunding");
  });

  it("transitions job to refunded", () => {
    const job = createJob(testScope, { checks: [], severityRubric: {}, dataSources: [], reportFormat: "json", requireHumanReview: false, passFailPolicy: "advisory" }, "q2", "idem-refund2");
    updateJob(job.id, { status: "refunding" });
    updateJob(job.id, { status: "refunded" });
    const updated = getJob(job.id);
    expect(updated?.status).toBe("refunded");
  });
});

describe("Idempotency", () => {
  it("returns existing job for duplicate idempotency key", () => {
    const job = createJob(testScope, { checks: [], severityRubric: {}, dataSources: [], reportFormat: "json", requireHumanReview: false, passFailPolicy: "advisory" }, "q3", "idem-dup");
    const found = getJobByIdempotencyKey("idem-dup");
    expect(found?.id).toBe(job.id);
  });

  it("returns undefined for unknown idempotency key", () => {
    const found = getJobByIdempotencyKey("idem-unknown");
    expect(found).toBeUndefined();
  });
});

describe("Payment Records", () => {
  it("creates payment record", () => {
    const record = createPaymentRecord("job-1", "quote-1", "sig-1", "1000000", "USDC", "eip155:10143", "0xpayer");
    expect(record.id).toMatch(/^pay_/);
    expect(record.status).toBe("pending");
    expect(record.amount).toBe("1000000");
  });

  it("stores receipt on job", () => {
    const job = createJob(testScope, { checks: [], severityRubric: {}, dataSources: [], reportFormat: "json", requireHumanReview: false, passFailPolicy: "advisory" }, "q4", "idem-receipt");
    storeReceipt(job.id, {
      paymentSignature: "sig",
      txHash: "0xtxhash",
      amount: "1000000",
      token: "USDC",
      network: "eip155:10143",
      resourcePath: "/audit/run",
      nonce: "n1",
      timestamp: new Date().toISOString(),
    });
    const updated = getJob(job.id);
    expect(updated?.status).toBe("paid");
    expect(updated?.paymentReceipt?.txHash).toBe("0xtxhash");
  });
});
