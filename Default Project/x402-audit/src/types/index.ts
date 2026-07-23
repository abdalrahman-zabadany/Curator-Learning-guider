export interface AuditScope {
  target: string;
  type: "vault" | "protocol" | "fund" | "treasury" | "strategy";
  description: string;
  chainIds?: number[];
  contractAddresses?: string[];
  customFields?: Record<string, string>;
}

export interface AuditCheck {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low" | "informational";
  enabled: boolean;
}

export interface SeverityRubric {
  critical: string;
  high: string;
  medium: string;
  low: string;
  informational: string;
}

export interface AuditConfig {
  checks: AuditCheck[];
  severityRubric: SeverityRubric;
  dataSources: string[];
  reportFormat: "markdown" | "json" | "html";
  requireHumanReview: boolean;
  passFailPolicy: "strict" | "advisory";
  customInstructions?: string;
}

export interface AuditQuote {
  id: string;
  scopeHash: string;
  resourcePath: string;
  price: string;
  token: string;
  network: string;
  recipient: string;
  expiry: number;
  nonce: string;
  scheme: "v2-eip155-exact" | "v2-eip155-upto";
}

export interface AuditJob {
  id: string;
  scope: AuditScope;
  config: AuditConfig;
  scopeHash: string;
  status: "pending_payment" | "paid" | "running" | "completed" | "failed" | "refunding" | "refunded";
  quoteId: string;
  paymentReceipt?: PaymentReceipt;
  report?: AuditReport;
  artifacts?: AuditArtifact[];
  createdAt: string;
  updatedAt: string;
  idempotencyKey: string;
}

export interface PaymentReceipt {
  paymentSignature: string;
  txHash?: string;
  facilitatorResponse?: string;
  payerAddress?: string;
  amount: string;
  token: string;
  network: string;
  resourcePath: string;
  nonce: string;
  timestamp: string;
}

export interface AuditFinding {
  id: string;
  checkId: string;
  checkName: string;
  severity: "critical" | "high" | "medium" | "low" | "informational";
  title: string;
  description: string;
  recommendation: string;
  affectedContracts?: string[];
  evidence?: string;
}

export interface AuditReport {
  jobId: string;
  scope: AuditScope;
  findings: AuditFinding[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
    total: number;
  };
  passed: boolean;
  humanReviewed: boolean;
  generatedAt: string;
  methodology: string;
}

export interface AuditArtifact {
  id: string;
  type: "report" | "raw_data" | "logs" | "evidence";
  filename: string;
  size: number;
  hash: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  jobId: string;
  quoteId: string;
  paymentSignature: string;
  txHash?: string;
  amount: string;
  token: string;
  network: string;
  payerAddress?: string;
  status: "pending" | "verified" | "settled" | "failed" | "refunded";
  createdAt: string;
}
