import { createHash, randomBytes } from "crypto";
import { env } from "./env";
import type { AuditQuote, AuditScope, PaymentRecord, PaymentReceipt, AuditJob } from "@/types";

const scopeHashes = new Map<string, string>();
const nonces = new Set<string>();
const signatures = new Set<string>();
const paymentRecords = new Map<string, PaymentRecord>();
const jobs = new Map<string, AuditJob>();
const locks = new Map<string, boolean>();

export function computeScopeHash(scope: AuditScope): string {
  const payload = JSON.stringify({
    target: scope.target,
    type: scope.type,
    description: scope.description,
    chainIds: scope.chainIds?.sort(),
    contractAddresses: scope.contractAddresses?.sort(),
    customFields: scope.customFields,
  });
  return createHash("sha256").update(payload).digest("hex");
}

export function generateNonce(): string {
  return randomBytes(16).toString("hex");
}

export function createQuote(
  scope: AuditScope,
  resourcePath: string,
  price?: string
): AuditQuote {
  const scopeHash = computeScopeHash(scope);
  const nonce = generateNonce();
  const expiry = Math.floor(Date.now() / 1000) + env.QUOTE_EXPIRY_SECONDS;

  const quote: AuditQuote = {
    id: `quote_${randomBytes(8).toString("hex")}`,
    scopeHash,
    resourcePath,
    price: price || env.DEFAULT_AUDIT_PRICE_USDC,
    token: env.MONAD_TESTNET_USDC,
    network: env.MONAD_TESTNET_NETWORK,
    recipient: env.PAY_TO_ADDRESS,
    expiry,
    nonce,
    scheme: "v2-eip155-exact",
  };

  scopeHashes.set(quote.id, scopeHash);
  return quote;
}

export function validateQuote(
  quote: AuditQuote,
  resourcePath: string,
  scope: AuditScope,
  paymentSignature: string
): { valid: boolean; error?: string } {
  if (quote.expiry < Math.floor(Date.now() / 1000)) {
    return { valid: false, error: "QUOTE_EXPIRED" };
  }
  if (quote.resourcePath !== resourcePath) {
    return { valid: false, error: "RESOURCE_PATH_MISMATCH" };
  }
  const currentHash = computeScopeHash(scope);
  if (quote.scopeHash !== currentHash) {
    return { valid: false, error: "SCOPE_CHANGED" };
  }
  if (quote.token !== env.MONAD_TESTNET_USDC) {
    return { valid: false, error: "WRONG_TOKEN" };
  }
  if (quote.network !== env.MONAD_TESTNET_NETWORK) {
    return { valid: false, error: "WRONG_NETWORK" };
  }
  if (quote.recipient !== env.PAY_TO_ADDRESS) {
    return { valid: false, error: "WRONG_RECIPIENT" };
  }
  if (nonces.has(quote.nonce)) {
    return { valid: false, error: "NONCE_REPLAYED" };
  }
  if (signatures.has(paymentSignature)) {
    return { valid: false, error: "SIGNATURE_REPLAYED" };
  }
  const sigKey = `${quote.nonce}:${paymentSignature}`;
  if (nonces.has(sigKey)) {
    return { valid: false, error: "SIGNATURE_REPLAYED" };
  }
  return { valid: true };
}

export function consumeNonce(nonce: string, paymentSignature: string): void {
  nonces.add(nonce);
  nonces.add(`${nonce}:${paymentSignature}`);
  signatures.add(paymentSignature);
}

export function acquireLock(jobId: string): boolean {
  if (locks.get(jobId)) return false;
  locks.set(jobId, true);
  return true;
}

export function releaseLock(jobId: string): void {
  locks.delete(jobId);
}

export function createPaymentRecord(
  jobId: string,
  quoteId: string,
  paymentSignature: string,
  amount: string,
  token: string,
  network: string,
  payerAddress?: string
): PaymentRecord {
  const record: PaymentRecord = {
    id: `pay_${randomBytes(8).toString("hex")}`,
    jobId,
    quoteId,
    paymentSignature,
    amount,
    token,
    network,
    payerAddress,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  paymentRecords.set(record.id, record);
  return record;
}

export function getPaymentRecord(id: string): PaymentRecord | undefined {
  return paymentRecords.get(id);
}

export function updatePaymentStatus(id: string, status: PaymentRecord["status"]): void {
  const record = paymentRecords.get(id);
  if (record) record.status = status;
}

export function createJob(
  scope: AuditScope,
  config: AuditConfigInput,
  quoteId: string,
  idempotencyKey: string
): AuditJob {
  const scopeHash = computeScopeHash(scope);
  const job: AuditJob = {
    id: `job_${randomBytes(8).toString("hex")}`,
    scope,
    config: config as AuditJob["config"],
    scopeHash,
    status: "pending_payment",
    quoteId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    idempotencyKey,
  };
  jobs.set(job.id, job);
  return job;
}

export function getJob(id: string): AuditJob | undefined {
  return jobs.get(id);
}

export function updateJob(id: string, updates: Partial<AuditJob>): void {
  const job = jobs.get(id);
  if (job) {
    Object.assign(job, updates, { updatedAt: new Date().toISOString() });
  }
}

export function getJobByIdempotencyKey(key: string): AuditJob | undefined {
  for (const job of jobs.values()) {
    if (job.idempotencyKey === key) return job;
  }
  return undefined;
}

export function listJobs(): AuditJob[] {
  return Array.from(jobs.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function listPaymentRecords(): PaymentRecord[] {
  return Array.from(paymentRecords.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function storeReceipt(jobId: string, receipt: PaymentReceipt): void {
  const job = jobs.get(jobId);
  if (job) {
    job.paymentReceipt = receipt;
    job.status = "paid";
    job.updatedAt = new Date().toISOString();
  }
}

interface AuditConfigInput {
  checks: { id: string; name: string; description: string; category: string; severity: string; enabled: boolean }[];
  severityRubric: { critical: string; high: string; medium: string; low: string; informational: string };
  dataSources: string[];
  reportFormat: string;
  requireHumanReview: boolean;
  passFailPolicy: string;
  customInstructions?: string;
}
