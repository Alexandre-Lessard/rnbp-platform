export const REPORT_STATUSES = [
  "pending",
  "confirmed",
  "resolved",
  "dismissed",
] as const;

export type ReportStatus = (typeof REPORT_STATUSES)[number];
