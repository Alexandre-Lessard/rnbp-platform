import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { useLanguage } from "@/i18n/context";
import { locales } from "@/i18n/locales";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { invalidatePromo, promoSentence } from "@/lib/use-promo";
import { BRAND_NAME } from "@rnbp/shared";

/**
 * The pre-launch promo, editable without a deploy: text in both languages,
 * last day of the offer, an on/off switch and auto-hide after the end date.
 * The "valid until" sentence is generated from the date, so the two cannot
 * disagree the way the hard-coded text once did.
 */

type PromoSettings = {
  active: boolean;
  autoHide: boolean;
  endsOn: string;
  textFr: string;
  textEn: string;
  updatedAt: string;
  visibleNow: boolean;
};

type FormData = Omit<PromoSettings, "updatedAt" | "visibleNow">;

const emptyForm: FormData = {
  active: true,
  autoHide: true,
  endsOn: "",
  textFr: "",
  textEn: "",
};

export function AdminPromoPage() {
  const { t, locale } = useLanguage();
  const p = t.admin?.promo;

  const [form, setForm] = useState<FormData>(emptyForm);
  const [saved, setSaved] = useState<PromoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function applySaved(promo: PromoSettings | null) {
    setSaved(promo);
    if (promo) {
      setForm({
        active: promo.active,
        autoHide: promo.autoHide,
        endsOn: promo.endsOn,
        textFr: promo.textFr,
        textEn: promo.textEn,
      });
    }
  }

  useEffect(() => {
    let cancelled = false;
    apiRequest<{ promo: PromoSettings | null }>("/admin/promo")
      .then((data) => {
        if (!cancelled) applySaved(data.promo);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, t));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const data = await apiRequest<{ promo: PromoSettings }>("/admin/promo", {
        method: "PUT",
        body: form,
      });
      applySaved(data.promo);
      // The banner on this tab picks up the new settings on the next page.
      invalidatePromo();
      setSuccess(p?.saved ?? "Promotion saved.");
    } catch (err) {
      setError(getErrorMessage(err, t));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="min-h-[80vh] bg-[var(--rcb-white)]">
        <div className="section-shell flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--rcb-primary)] border-t-transparent" />
        </div>
      </section>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 py-2.5 text-sm text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none";
  const labelClass = "block text-sm font-medium text-[var(--rcb-text-strong)] mb-1.5";
  const hintClass = "mt-1 text-xs text-[var(--rcb-text-muted)]";

  const status = saved
    ? saved.visibleNow
      ? { text: p?.visibleNow ?? "Showing now", className: "bg-green-50 text-green-800" }
      : !saved.active
        ? { text: p?.hiddenInactive ?? "Hidden: turned off", className: "bg-gray-100 text-gray-700" }
        : { text: p?.hiddenExpired ?? "Hidden: end date passed", className: "bg-amber-50 text-amber-800" }
    : null;

  const canPreview = form.endsOn && (form.textFr || form.textEn);

  return (
    <section className="min-h-[80vh] bg-[var(--rcb-white)]">
      <title>{`Admin — ${t.admin?.nav.promo ?? "Promotion"} | ${BRAND_NAME}`}</title>
      <div className="section-shell max-w-3xl py-16">
        <h1 className="text-2xl font-bold text-[var(--rcb-text-strong)]">
          {p?.title ?? "Promotion"}
        </h1>
        <p className="mt-2 text-sm text-[var(--rcb-text-body)]">{p?.intro}</p>

        {status && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${status.className}`}>
              {status.text}
            </span>
            {saved && (
              <span className="text-xs text-[var(--rcb-text-muted)]">
                {p?.lastUpdated ?? "Last updated:"}{" "}
                {new Date(saved.updatedAt).toLocaleString(locale === "fr" ? "fr-CA" : "en-CA", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </span>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Toggle
            id="active"
            checked={form.active}
            onChange={(active) => setForm((prev) => ({ ...prev, active }))}
            label={p?.active ?? "Active"}
          />

          <div>
            <label htmlFor="textFr" className={labelClass}>
              {p?.textFr ?? "Text (French)"}
            </label>
            <textarea
              id="textFr"
              rows={2}
              required
              maxLength={300}
              value={form.textFr}
              onChange={(e) => setForm((prev) => ({ ...prev, textFr: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="textEn" className={labelClass}>
              {p?.textEn ?? "Text (English)"}
            </label>
            <textarea
              id="textEn"
              rows={2}
              required
              maxLength={300}
              value={form.textEn}
              onChange={(e) => setForm((prev) => ({ ...prev, textEn: e.target.value }))}
              className={inputClass}
            />
            <p className={hintClass}>{p?.textHint}</p>
          </div>

          <div>
            <label htmlFor="endsOn" className={labelClass}>
              {p?.endsOn ?? "Last day of the offer"}
            </label>
            <input
              id="endsOn"
              type="date"
              required
              value={form.endsOn}
              onChange={(e) => setForm((prev) => ({ ...prev, endsOn: e.target.value }))}
              className={`${inputClass} max-w-[220px]`}
            />
          </div>

          <div>
            <Toggle
              id="autoHide"
              checked={form.autoHide}
              onChange={(autoHide) => setForm((prev) => ({ ...prev, autoHide }))}
              label={p?.autoHide ?? "Hide automatically after the end date"}
            />
            <p className={hintClass}>{p?.autoHideHint}</p>
          </div>

          {canPreview && (
            <div>
              <p className={labelClass}>{p?.preview ?? "Preview"}</p>
              <div className="space-y-2 rounded-xl border border-[var(--rcb-primary)]/30 bg-[var(--rcb-primary)]/[0.06] px-4 py-3 text-sm text-[var(--rcb-text-strong)]">
                {(["fr", "en"] as const).map((lang) => (
                  <p key={lang}>
                    <span className="mr-2 text-xs font-bold text-[var(--rcb-text-muted)] uppercase">
                      {lang}
                    </span>
                    {promoSentence(form, lang, locales[lang].promo?.validUntil ?? "{date}")}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" disabled={saving} className="min-w-[160px]">
              {saving ? (p?.saving ?? "Saving…") : (p?.save ?? "Save")}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AdminPromoPage;
