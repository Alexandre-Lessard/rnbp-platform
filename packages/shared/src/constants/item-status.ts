export const ITEM_STATUSES = [
  "active",
  "stolen",
  "recovered",
  "transferred",
] as const;

export type ItemStatus = (typeof ITEM_STATUSES)[number];
