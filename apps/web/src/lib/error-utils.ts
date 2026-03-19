import type { SiteContent } from "@/types/content";
import type { ApiError } from "./api-client";

/**
 * Map an API error to a localized message using i18n error codes.
 * Falls back to the English message from the API if the code is not mapped.
 */
export function getErrorMessage(
  err: unknown,
  t: SiteContent,
): string {
  const apiErr = err as ApiError | undefined;
  const code = apiErr?.code;

  if (code && t.apiErrors?.[code]) {
    return t.apiErrors[code];
  }

  // Fallback to the API message (English)
  if (err instanceof Error) {
    return err.message;
  }

  return t.errors?.generic ?? "An error occurred";
}

/**
 * Map an API success code to a localized message.
 * Falls back to the English message from the API.
 */
export function getSuccessMessage(
  response: { code?: string; message?: string },
  t: SiteContent,
): string {
  const code = response.code;

  if (code && t.apiErrors?.[code]) {
    return t.apiErrors[code];
  }

  return response.message ?? "";
}
