import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId || jobId.length > 128) {
    return NextResponse.json({ error: "INVALID_JOB_ID" }, { status: 400 });
  }

  if (!/^job_[a-f0-9]{16}$/.test(jobId)) {
    return NextResponse.json({ error: "INVALID_JOB_ID_FORMAT" }, { status: 400 });
  }

  const job = getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "JOB_NOT_FOUND" }, { status: 404 });
  }

  if (job.status !== "completed" || !job.report) {
    return NextResponse.json({ error: "REPORT_NOT_READY", status: job.status }, { status: 202 });
  }

  return NextResponse.json({ report: job.report, artifacts: job.artifacts });
}
