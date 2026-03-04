import { fileTypeFromBuffer } from "file-type";
import { badRequest } from "./errors.js";

const ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_DOC_MIMES = new Set([
  ...ALLOWED_IMAGE_MIMES,
  "application/pdf",
]);

/**
 * Validate file by checking magic bytes (not just Content-Type header).
 * Returns the detected MIME type.
 */
export async function validateFileType(
  buffer: Buffer,
  allowedSet: "image" | "document",
): Promise<string> {
  const result = await fileTypeFromBuffer(buffer);

  if (!result) {
    throw badRequest("Type de fichier non reconnu");
  }

  const allowed =
    allowedSet === "image" ? ALLOWED_IMAGE_MIMES : ALLOWED_DOC_MIMES;

  if (!allowed.has(result.mime)) {
    throw badRequest(
      `Type de fichier non autorisé : ${result.mime}. Types acceptés : ${[...allowed].join(", ")}`,
    );
  }

  return result.mime;
}

/**
 * Validate file size.
 */
export function validateFileSize(
  buffer: Buffer,
  maxSizeBytes: number,
): void {
  if (buffer.length > maxSizeBytes) {
    const maxMB = Math.round(maxSizeBytes / (1024 * 1024));
    throw badRequest(`Fichier trop volumineux. Taille maximale : ${maxMB} Mo`);
  }
}
