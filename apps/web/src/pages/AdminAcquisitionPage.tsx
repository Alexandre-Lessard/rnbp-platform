import { useState, useEffect, useCallback, useRef } from "react";
import { apiRequest } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { useLanguage } from "@/i18n/context";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

/**
 * What each campaign brought in, next to what it cost.
 *
 * The spend is typed in by hand rather than read from Meta's API: that would
 * mean a system-user token to create, renew and guard, for a number that is
 * already on the invoice. This works from the first dollar.
 *
 * Expect this page to show fewer conversions than Meta's own dashboard. Meta
 * credits itself for people who saw an ad and came back days later through a
 * different route; we only count what carried our tag, and only for people who
 * accepted advertising trackers. The gap is not a bug — it is the difference
 * between what Meta claims and what we can actually verify.
 */

type Campaign = {
  campaign: string;
  source: string | null;
  signups: number;
  orders: number;
  revenueCents: number;
  spendCents: number;
  costPerSignupCents: number | null;
  costPerOrderCents: number | null;
  signupToOrderRate: number | null;
};

type SpendEntry = {
  id: string;
  campaign: string;
  platform: string;
  amountCents: number;
  periodStart: string;
  periodEnd: string;
  note: string | null;
};

type AcquisitionResponse = {
  from: string;
  to: string;
  campaigns: Campaign[];
  totals: { signups: number; orders: number; revenueCents: number; spendCents: number };
  spendEntries: SpendEntry[];
};

function money(cents: number | null): string {
  if (cents === null) return "—";
  return (cents / 100).toLocaleString("fr-CA", { style: "currency", currency: "CAD" });
}

function percent(rate: number | null): string {
  if (rate === null) return "—";
  return `${(rate * 100).toFixed(1)} %`;
}

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function AdminAcquisitionPage() {
  const { t } = useLanguage();

  const [from, setFrom] = useState(() => isoDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));
  const [to, setTo] = useState(() => isoDay(new Date()));

  const [data, setData] = useState<AcquisitionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [spendOpen, setSpendOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    campaign: "",
    platform: "facebook",
    amount: "",
    periodStart: isoDay(new Date()),
    periodEnd: isoDay(new Date()),
    note: "",
  });

  // A stale response must not overwrite a fresher one: changing the range
  // twice quickly fires two requests that can come back out of order.
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest<AcquisitionResponse>(`/admin/acquisition?from=${from}&to=${to}`);
      if (id === requestId.current) setData(res);
    } catch (err) {
      if (id === requestId.current) setError(getErrorMessage(err, t));
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [from, to, t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveSpend() {
    const amountCents = Math.round(Number(form.amount.replace(",", ".")) * 100);
    if (!form.campaign.trim() || !Number.isFinite(amountCents) || amountCents < 0) {
      setFormError("A campaign name and a valid amount are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      await apiRequest("/admin/acquisition/spend", {
        method: "POST",
        body: {
          campaign: form.campaign.trim(),
          platform: form.platform,
          amountCents,
          periodStart: new Date(`${form.periodStart}T00:00:00.000Z`).toISOString(),
          periodEnd: new Date(`${form.periodEnd}T23:59:59.999Z`).toISOString(),
          ...(form.note.trim() ? { note: form.note.trim() } : {}),
        },
      });
      setSpendOpen(false);
      setForm((f) => ({ ...f, campaign: "", amount: "", note: "" }));
      await load();
    } catch (err) {
      setFormError(getErrorMessage(err, t));
    } finally {
      setSaving(false);
    }
  }

  async function deleteSpend(id: string) {
    try {
      await apiRequest(`/admin/acquisition/spend/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(getErrorMessage(err, t));
    }
  }

  const totals = data?.totals;
  const blendedCostPerOrder =
    totals && totals.orders > 0 && totals.spendCents > 0
      ? Math.round(totals.spendCents / totals.orders)
      : null;

  return (
    <section className="min-h-[80vh] bg-[var(--rcb-white)]">
      <title>Admin — Acquisition | Badge</title>
      <div className="section-shell py-16">
        <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">Acquisition</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--rcb-text-muted)]">
          Signups and paid orders per campaign, against the spend entered below. Only visitors who
          accepted advertising trackers can be attributed, so these numbers are a floor — Meta&apos;s
          dashboard will always claim more.
        </p>

        {/* ── Range ─────────────────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap items-end gap-4">
          <label className="flex flex-col text-sm text-[var(--rcb-text-muted)]">
            From
            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 rounded-lg border border-[var(--rcb-border)] px-3 py-2 text-[var(--rcb-text-strong)]"
            />
          </label>
          <label className="flex flex-col text-sm text-[var(--rcb-text-muted)]">
            To
            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 rounded-lg border border-[var(--rcb-border)] px-3 py-2 text-[var(--rcb-text-strong)]"
            />
          </label>
          <Button size="sm" onClick={() => setSpendOpen(true)} style={{ minWidth: 150 }}>
            Add spend
          </Button>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--rcb-primary)] border-t-transparent" />
          </div>
        ) : !data || data.campaigns.length === 0 ? (
          <div className="mt-10 rounded-xl border border-[var(--rcb-border)] bg-[var(--rcb-surface)] p-10 text-center">
            <p className="text-[var(--rcb-text-muted)]">
              Nothing in this range yet. Signups and orders appear here as soon as they arrive —
              tagged ones under their campaign, the rest under “direct”.
            </p>
          </div>
        ) : (
          <>
            {/* ── Headline numbers ────────────────────────────── */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Spend", value: money(totals!.spendCents) },
                { label: "Signups", value: String(totals!.signups) },
                { label: "Paid orders", value: String(totals!.orders) },
                { label: "Cost per order", value: money(blendedCostPerOrder) },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-xl border border-[var(--rcb-border)] bg-[var(--rcb-surface)] p-5"
                >
                  <p className="text-sm text-[var(--rcb-text-muted)]">{kpi.label}</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--rcb-text-strong)]">{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* ── Per campaign ────────────────────────────────── */}
            <div className="mt-8 overflow-x-auto rounded-xl border border-[var(--rcb-border)]">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead className="bg-[var(--rcb-surface)] text-[var(--rcb-text-muted)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Campaign</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 text-right font-medium">Spend</th>
                    <th className="px-4 py-3 text-right font-medium">Signups</th>
                    <th className="px-4 py-3 text-right font-medium">Orders</th>
                    <th className="px-4 py-3 text-right font-medium">Revenue</th>
                    <th className="px-4 py-3 text-right font-medium">Cost / signup</th>
                    <th className="px-4 py-3 text-right font-medium">Cost / order</th>
                    <th className="px-4 py-3 text-right font-medium">Signup → order</th>
                  </tr>
                </thead>
                <tbody>
                  {data.campaigns.map((row) => (
                    <tr key={row.campaign} className="border-t border-[var(--rcb-border)]">
                      <td className="px-4 py-3 font-medium text-[var(--rcb-text-strong)]">
                        {row.campaign}
                      </td>
                      <td className="px-4 py-3 text-[var(--rcb-text-muted)]">{row.source ?? "—"}</td>
                      <td className="px-4 py-3 text-right">{money(row.spendCents)}</td>
                      <td className="px-4 py-3 text-right">{row.signups}</td>
                      <td className="px-4 py-3 text-right">{row.orders}</td>
                      <td className="px-4 py-3 text-right">{money(row.revenueCents)}</td>
                      <td className="px-4 py-3 text-right">{money(row.costPerSignupCents)}</td>
                      <td className="px-4 py-3 text-right">{money(row.costPerOrderCents)}</td>
                      <td className="px-4 py-3 text-right">{percent(row.signupToOrderRate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Spend entries ───────────────────────────────── */}
            <h2 className="mt-12 text-xl font-bold text-[var(--rcb-text-strong)]">Spend entries</h2>
            {data.spendEntries.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--rcb-text-muted)]">
                None in this range. Without one, cost per acquisition stays empty.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {data.spendEntries.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--rcb-border)] px-4 py-3 text-sm"
                  >
                    <span className="text-[var(--rcb-text-strong)]">
                      <strong>{entry.campaign}</strong>{" "}
                      <span className="text-[var(--rcb-text-muted)]">({entry.platform})</span>{" "}
                      {money(entry.amountCents)}{" "}
                      <span className="text-[var(--rcb-text-muted)]">
                        {entry.periodStart.slice(0, 10)} → {entry.periodEnd.slice(0, 10)}
                      </span>
                      {entry.note && (
                        <span className="text-[var(--rcb-text-muted)]"> — {entry.note}</span>
                      )}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSpend(entry.id)}
                      style={{ minWidth: 90 }}
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* ── Add spend ───────────────────────────────────────────── */}
      <Modal open={spendOpen} onClose={() => setSpendOpen(false)} title="Add spend">
        <div className="space-y-4">
          <label className="flex flex-col text-sm text-[var(--rcb-text-muted)]">
            Campaign
            <input
              type="text"
              value={form.campaign}
              onChange={(e) => setForm({ ...form, campaign: e.target.value })}
              placeholder="Must match the utm_campaign in the ad's link"
              className="mt-1 rounded-lg border border-[var(--rcb-border)] px-3 py-2 text-[var(--rcb-text-strong)]"
            />
          </label>
          <label className="flex flex-col text-sm text-[var(--rcb-text-muted)]">
            Platform
            <input
              type="text"
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className="mt-1 rounded-lg border border-[var(--rcb-border)] px-3 py-2 text-[var(--rcb-text-strong)]"
            />
          </label>
          <label className="flex flex-col text-sm text-[var(--rcb-text-muted)]">
            Amount (CAD)
            <input
              type="text"
              inputMode="decimal"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="150.00"
              className="mt-1 rounded-lg border border-[var(--rcb-border)] px-3 py-2 text-[var(--rcb-text-strong)]"
            />
          </label>
          <div className="flex gap-4">
            <label className="flex flex-1 flex-col text-sm text-[var(--rcb-text-muted)]">
              From
              <input
                type="date"
                value={form.periodStart}
                onChange={(e) => setForm({ ...form, periodStart: e.target.value })}
                className="mt-1 rounded-lg border border-[var(--rcb-border)] px-3 py-2 text-[var(--rcb-text-strong)]"
              />
            </label>
            <label className="flex flex-1 flex-col text-sm text-[var(--rcb-text-muted)]">
              To
              <input
                type="date"
                value={form.periodEnd}
                onChange={(e) => setForm({ ...form, periodEnd: e.target.value })}
                className="mt-1 rounded-lg border border-[var(--rcb-border)] px-3 py-2 text-[var(--rcb-text-strong)]"
              />
            </label>
          </div>
          <label className="flex flex-col text-sm text-[var(--rcb-text-muted)]">
            Note (optional)
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="mt-1 rounded-lg border border-[var(--rcb-border)] px-3 py-2 text-[var(--rcb-text-strong)]"
            />
          </label>

          {formError && <p className="text-sm text-red-700">{formError}</p>}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setSpendOpen(false)}
              disabled={saving}
              style={{ minWidth: 110 }}
            >
              Cancel
            </Button>
            <Button onClick={saveSpend} disabled={saving} style={{ minWidth: 110 }}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
