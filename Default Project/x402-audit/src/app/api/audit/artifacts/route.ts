import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  const artifactId = searchParams.get("artifactId");

  if (!jobId || jobId.length > 128) {
    return NextResponse.json({ error: "INVALID_JOB_ID" }, { status: 400 });
  }

  if (!/^job_[a-f0-9]{16}$/.test(jobId)) {
    return NextResponse.json({ error: "INVALID_JOB_ID_FORMAT" }, { status: 400 });
  }

  if (artifactId && artifactId.length > 128) {
    return NextResponse.json({ error: "INVALID_ARTIFACT_ID" }, { status: 400 });
  }

  const job = getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "JOB_NOT_FOUND" }, { status: 404 });
  }

  if (!job.artifacts || job.artifacts.length === 0) {
    return NextResponse.json({ error: "NO_ARTIFACTS" }, { status: 404 });
  }

  if (artifactId) {
    const artifact = job.artifacts.find((a) => a.id === artifactId);
    if (!artifact) return NextResponse.json({ error: "ARTIFACT_NOT_FOUND" }, { status: 404 });
    return NextResponse.json({ artifact });
  }

  return NextResponse.json({ artifacts: job.artifacts });
}
