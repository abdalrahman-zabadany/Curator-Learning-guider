import { NextRequest, NextResponse } from "next/server";
import { listJobs, listPaymentRecords, getJob, updateJob } from "@/lib/store";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

function checkAuth(request: NextRequest): boolean {
  if (!ADMIN_API_KEY) return true;
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${ADMIN_API_KEY}`;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "payments") {
    return NextResponse.json({ payments: listPaymentRecords() });
  }

  return NextResponse.json({ jobs: listJobs() });
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const { action, jobId } = body as { action: string; jobId: string };

  if (!jobId) {
    return NextResponse.json({ error: "MISSING_JOB_ID" }, { status: 400 });
  }

  const job = getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "JOB_NOT_FOUND" }, { status: 404 });
  }

  switch (action) {
    case "approve_review":
      if (job.report) {
        job.report.humanReviewed = true;
        updateJob(jobId, { report: job.report });
      }
      return NextResponse.json({ job: getJob(jobId) });

    case "refund":
      if (!["completed", "paid"].includes(job.status)) {
        return NextResponse.json({ error: "INVALID_STATE_FOR_REFUND" }, { status: 400 });
      }
      if (job.status === "refunding" || job.status === "refunded") {
        return NextResponse.json({ error: "ALREADY_REFUNDING" }, { status: 400 });
      }
      updateJob(jobId, { status: "refunding" });
      setTimeout(() => updateJob(jobId, { status: "refunded" }), 1000);
      return NextResponse.json({ job: getJob(jobId), message: "Refund initiated" });

    default:
      return NextResponse.json({ error: "INVALID_ACTION" }, { status: 400 });
  }
}
