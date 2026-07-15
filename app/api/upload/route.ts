import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { buildKey, uploadBuffer, publicUrlForKey, r2Configured } from "@/lib/r2";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
]);

/**
 * Accepts a single file upload (multipart/form-data, field "file") and stores
 * it in R2. Uploads to the "registration/*" folder are allowed without a
 * session (needed during sign-up); every other folder requires a logged-in
 * user.
 */
export async function POST(req: Request) {
  if (!r2Configured()) {
    return NextResponse.json(
      {
        error:
          "File storage is not configured. Set the R2_* variables in .env.local.",
      },
      { status: 503 }
    );
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const folderRaw = (form?.get("folder") as string) || "misc";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const isRegistration = folderRaw.startsWith("registration");
  if (!isRegistration) {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type || "unknown"}` },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 8 MB." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = buildKey(folderRaw, file.name || "upload");
  await uploadBuffer(key, buffer, file.type);

  return NextResponse.json({ key, url: publicUrlForKey(key) });
}
