import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/i18n/context";
import { apiRequest } from "@/lib/api-client";
import { getButtonClasses } from "@/lib/button-styles";

type Item = {
  id: string;
  name: string;
  category: string;
  brand: string | null;
  model: string | null;
  status: string;
  rnbpNumber: string;
  createdAt: string;
};

export function DashboardPage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    apiRequest<{ items: Item[] }>("/items")
      .then((data) => setItems(data.items))
      .catch((err) => {
        setLoadError(err instanceof Error ? err.message : "Erreur de chargement");
      })
      .finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    stolen: "bg-red-100 text-red-800",
    recovered: "bg-blue-100 text-blue-800",
    transferred: "bg-gray-100 text-gray-800",
  };

  return (
    <section className="min-h-[80vh] bg-[var(--rcb-white)]">
      <div className="section-shell py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
            {t.dashboard?.heading ?? "Tableau de bord"}
          </h1>
          <p className="mt-1 text-lg text-[var(--rcb-text-muted)]">
            {t.dashboard?.welcome?.replace("{{name}}", user?.firstName ?? "") ??
              `Bienvenue, ${user?.firstName}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/enregistrer"
            className={getButtonClasses("primary", "sm")}
          >
            + {t.dashboard?.addItem ?? "Enregistrer un bien"}
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            className="cursor-pointer rounded-lg border border-[var(--rcb-border)] px-4 py-2 text-sm font-medium text-[var(--rcb-text-muted)] transition-colors hover:text-[var(--rcb-primary)]"
          >
            {t.nav.logout}
          </button>
        </div>
      </div>

      {loadError && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="mt-16 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--rcb-primary)] border-t-transparent" />
        </div>
      ) : items.length === 0 && !loadError ? (
        <div className="mt-10 rounded-xl border border-[var(--rcb-border)] bg-[var(--rcb-surface)] p-10 text-center">
          <p className="text-lg text-[var(--rcb-text-muted)]">
            {t.dashboard?.noItems ?? "Aucun bien enregistré pour le moment."}
          </p>
          <Link
            to="/enregistrer"
            className={`${getButtonClasses("primary", "lg")} mt-6`}
          >
            {t.dashboard?.addItem ?? "Enregistrer un bien"}
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--rcb-border)] bg-[var(--rcb-bg)] p-5"
            >
              <div>
                <h3 className="text-lg font-semibold text-[var(--rcb-text-strong)]">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--rcb-text-muted)]">
                  {item.brand}
                  {item.model ? ` ${item.model}` : ""}
                  {" — "}
                  <span className="font-mono text-xs tracking-wider">
                    {item.rnbpNumber}
                  </span>
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[item.status] ?? "bg-gray-100 text-gray-800"}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
