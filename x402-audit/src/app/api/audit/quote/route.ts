import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { createQuote } from "@/lib/store";
import type { AuditScope } from "@/types";

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

  const { scope } = body as { scope: AuditScope };

  if (!scope?.target || !scope?.type || !scope?.description) {
    return NextResponse.json({ error: "MISSING_SCOPE_FIELDS: target, type, and description are required" }, { status: 400 });
  }

  if (scope.target.length > MAX_TARGET_LENGTH || scope.description.length > MAX_DESCRIPTION_LENGTH) {
    return NextResponse.json({ error: "INPUT_TOO_LONG" }, { status: 400 });
  }

  if (!VALID_SCOPE_TYPES.includes(scope.type as typeof VALID_SCOPE_TYPES[number])) {
    return NextResponse.json({ error: "INVALID_SCOPE_TYPE" }, { status: 400 });
  }

  const resourcePath = "/audit/quote";
  const price = env.DEFAULT_AUDIT_PRICE_USDC;

  const quote = createQuote(scope, resourcePath, price);
  return NextResponse.json({
    quote,
    scope,
    message: "Quote generated. Pay to proceed with the audit.",
  });
}
