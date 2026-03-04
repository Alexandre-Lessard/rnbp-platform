export type TheftReport = {
  id: string;
  itemId: string;
  reporterId: string;
  policeReportNumber: string | null;
  theftDate: string | null;
  theftLocation: string | null;
  description: string | null;
  status: "pending" | "confirmed" | "resolved" | "dismissed";
  createdAt: string;
  updatedAt: string;
};
