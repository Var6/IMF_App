import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

/**
 * Cloudflare R2 is S3-compatible, so we drive it with the AWS S3 SDK.
 * We keep a single cached client per server process.
 */

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_URL,
} = process.env;

let _client: S3Client | null = null;

export function r2Configured(): boolean {
  return Boolean(
    R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET
  );
}

function client(): S3Client {
  if (!r2Configured()) {
    throw new Error(
      "R2 storage is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET in .env.local"
    );
  }
  if (!_client) {
    _client = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID!,
        secretAccessKey: R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return _client;
}

/** Build a unique, path-safe object key inside a folder. */
export function buildKey(folder: string, filename: string): string {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-60);
  const cleanFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+|\/+$/g, "");
  return `${cleanFolder}/${randomUUID()}-${safe}`;
}

/** Upload a buffer to R2 and return the stored object key. */
export async function uploadBuffer(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await client().send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return key;
}

/**
 * Turn a stored object key into a URL the browser can load.
 * - If R2_PUBLIC_URL is set (public bucket / custom domain) we return a direct
 *   public URL.
 * - Otherwise we return our authenticated proxy route which streams a
 *   short-lived presigned URL.
 */
export function publicUrlForKey(key: string | null | undefined): string | null {
  if (!key) return null;
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL.replace(/\/+$/, "")}/${key}`;
  }
  return `/api/file?key=${encodeURIComponent(key)}`;
}

/** Generate a short-lived presigned GET URL for a stored object key. */
export async function presignedGetUrl(
  key: string,
  expiresInSeconds = 300
): Promise<string> {
  return getSignedUrl(
    client(),
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }),
    { expiresIn: expiresInSeconds }
  );
}
