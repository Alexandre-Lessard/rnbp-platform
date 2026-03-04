import { useState, type FormEvent } from "react";
import { useLanguage } from "@/i18n/context";
import { Button } from "@/components/ui/Button";
import { apiRequest } from "@/lib/api-client";

type LookupResult = {
  found: boolean;
  status?: string;
  category?: string;
  brand?: string | null;
  model?: string | null;
};

export function LookupPage() {
  const { t } = useLanguage();
  const [rcbpNumber, setRcbpNumber] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const data = await apiRequest<LookupResult>(
        `/lookup/${encodeURIComponent(rcbpNumber.trim())}`,
      );
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la vérification",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
          {t.lookup?.heading ?? "Vérifier un bien"}
        </h1>
        <p className="mt-2 text-[var(--rcb-text-muted)]">
          {t.lookup?.description ??
            "Entrez un numéro RCBP pour vérifier le statut d'un bien."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <input
            type="text"
            placeholder={t.lookup?.inputPlaceholder ?? "RCBP-XXXXXXXX"}
            value={rcbpNumber}
            onChange={(e) => setRcbpNumber(e.target.value.toUpperCase())}
            className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-center text-lg tracking-wider text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none sm:max-w-xs"
          />
          <Button type="submit" disabled={loading} className="cursor-pointer disabled:opacity-50">
            {loading
              ? (t.lookup?.searching ?? "Recherche...")
              : (t.lookup?.searchButton ?? "Vérifier")}
          </Button>
        </form>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div
            className={`mt-6 rounded-xl border p-6 ${
              result.found && result.status === "stolen"
                ? "border-red-300 bg-red-50"
                : result.found
                  ? "border-green-300 bg-green-50"
                  : "border-[var(--rcb-border)] bg-[var(--rcb-surface)]"
            }`}
          >
            {result.found ? (
              <>
                <p className="text-lg font-semibold text-[var(--rcb-text-strong)]">
                  {result.status === "stolen"
                    ? (t.lookup?.stolenMessage ?? "Ce bien a été déclaré volé")
                    : (t.lookup?.foundMessage ?? "Bien trouvé dans le registre")}
                </p>
                {result.category && (
                  <p className="mt-2 text-sm text-[var(--rcb-text-muted)]">
                    {result.category}
                    {result.brand ? ` — ${result.brand}` : ""}
                    {result.model ? ` ${result.model}` : ""}
                  </p>
                )}
              </>
            ) : (
              <p className="text-lg text-[var(--rcb-text-muted)]">
                {t.lookup?.notFoundMessage ??
                  "Aucun bien trouvé avec ce numéro."}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
