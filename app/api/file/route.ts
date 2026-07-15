import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { presignedGetUrl, r2Configured } from "@/lib/r2";

export const runtime = "nodejs";

/**
 * Authenticated file proxy. Given ?key=<r2-object-key> it redirects to a
 * short-lived presigned GET URL. Used when the bucket is private (no
 * R2_PUBLIC_URL). Any logged-in user (partner or admin) may view files.
 */
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!r2Configured()) {
    return NextResponse.json({ error: "Storage not configured." }, { status: 503 });
  }

  const key = new URL(req.url).searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Missing key." }, { status: 400 });
  }

  const url = await presignedGetUrl(key, 300);
  return NextResponse.redirect(url);
}
