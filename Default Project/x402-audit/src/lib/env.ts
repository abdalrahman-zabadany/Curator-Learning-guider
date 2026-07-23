const requiredEnvVars = {
  PAY_TO_ADDRESS: process.env.PAY_TO_ADDRESS,
} as const;

if (!requiredEnvVars.PAY_TO_ADDRESS) {
  console.error("[x402-audit] FATAL: PAY_TO_ADDRESS environment variable is not set. Set it in .env.local or .env");
}

export const env = {
  PAY_TO_ADDRESS: process.env.PAY_TO_ADDRESS || "0x0000000000000000000000000000000000000000",
  FACILITATOR_URL: process.env.FACILITATOR_URL || "https://x402-facilitator.molandak.org",
  MONAD_TESTNET_USDC: "0x534b2f3A21130d7a60830c2Df862319e593943A3",
  MONAD_TESTNET_CHAIN_ID: 10143,
  MONAD_TESTNET_NETWORK: "eip155:10143",
  DEFAULT_AUDIT_PRICE_USDC: "1000000",
  QUOTE_EXPIRY_SECONDS: 300,
  MAX_CONCURRENT_JOBS: 10,
  LOCK_TIMEOUT_MS: 30000,
} as const;
