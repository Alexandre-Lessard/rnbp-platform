import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getConfig } from "../config.js";

let client: S3Client | null = null;

export function isR2Configured(): boolean {
  const c = getConfig();
  return !!(
    c.R2_ACCOUNT_ID &&
    c.R2_ACCESS_KEY_ID &&
    c.R2_SECRET_ACCESS_KEY &&
    c.R2_BUCKET_NAME
  );
}

function getClient(): S3Client {
  if (client) return client;
  const c = getConfig();
  client = new S3Client({
    region: "auto",
    endpoint: `https://${c.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: c.R2_ACCESS_KEY_ID!,
      secretAccessKey: c.R2_SECRET_ACCESS_KEY!,
    },
  });
  return client;
}

/**
 * Upload a file to R2 and return its public URL.
 */
export async function uploadToR2(
  key: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const c = getConfig();
  await getClient().send(
    new PutObjectCommand({
      Bucket: c.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );
  const baseUrl = c.R2_PUBLIC_URL || `https://${c.R2_BUCKET_NAME}.${c.R2_ACCOUNT_ID}.r2.dev`;
  return `${baseUrl}/${key}`;
}

/**
 * Delete a file from R2.
 */
export async function deleteFromR2(key: string): Promise<void> {
  const c = getConfig();
  await getClient().send(
    new DeleteObjectCommand({
      Bucket: c.R2_BUCKET_NAME!,
      Key: key,
    }),
  );
}

/**
 * Extract the R2 object key from a full public URL.
 */
export function extractR2Key(url: string): string | null {
  const c = getConfig();
  const baseUrl = c.R2_PUBLIC_URL || `https://${c.R2_BUCKET_NAME}.${c.R2_ACCOUNT_ID}.r2.dev`;
  if (url.startsWith(baseUrl)) {
    return url.slice(baseUrl.length + 1); // +1 for the /
  }
  return null;
}
