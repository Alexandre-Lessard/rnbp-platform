import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/i18n/context";
import { useCart } from "@/lib/cart-context";
import { apiRequest, isNetworkError } from "@/lib/api-client";
import { getButtonClasses } from "@/lib/button-styles";
import { Button } from "@/components/ui/Button";
import { ServiceUnavailable } from "@/components/auth/ServiceUnavailable";

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
  const { user } = useAuth();
  const { t } = useLanguage();
  const { cart, addItem } = useCart();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [backendDown, setBackendDown] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Modal state for "already in cart" confirmation
  const [confirmItem, setConfirmItem] = useState<Item | null>(null);

  useEffect(() => {
    apiRequest<{ items: Item[] }>("/items")
      .then((data) => setItems(data.items))
      .catch((err) => {
        if (isNetworkError(err)) {
          setBackendDown(true);
        } else {
          setLoadError(err instanceof Error ? err.message : "Erreur de chargement");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function doAddItem(item: Item) {
    addItem({ rnbpNumber: item.rnbpNumber, itemName: item.name, productName: t.shop?.productName });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 2500);
  }

  function handleOrderStickers(item: Item) {
    if (addedId === item.id) return;

    const alreadyInCart = cart.some((c) => c.rnbpNumber === item.rnbpNumber);
    if (alreadyInCart) {
      setConfirmItem(item);
    } else {
      doAddItem(item);
    }
  }

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    stolen: "bg-red-100 text-red-800",
    recovered: "bg-blue-100 text-blue-800",
    transferred: "bg-gray-100 text-gray-800",
  };

  const dash = t.dashboard;

  if (backendDown) {
    return (
      <section className="min-h-[80vh] bg-[var(--rcb-white)]">
        <ServiceUnavailable />
      </section>
    );
  }

  return (
    <section className="min-h-[80vh] bg-[var(--rcb-white)]">
      <div className="section-shell py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
            {dash?.heading ?? "Tableau de bord"}
          </h1>
          <p className="mt-1 text-lg text-[var(--rcb-text-muted)]">
            {dash?.welcome?.replace("{{name}}", user?.firstName ?? "") ??
              `Bienvenue, ${user?.firstName}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/enregistrer"
            className={getButtonClasses("primary", "sm", "w-[170px] whitespace-nowrap text-center")}
          >
            + {dash?.addItem ?? "Enregistrer un bien"}
          </Link>
          <Link
            to="/declarer-vol"
            className={getButtonClasses("outline", "sm", "w-[170px] whitespace-nowrap text-center")}
          >
            {dash?.reportTheft ?? "Déclarer un vol"}
          </Link>
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
            {dash?.noItems ?? "Aucun bien enregistré pour le moment."}
          </p>
          <Link
            to="/enregistrer"
            className={`${getButtonClasses("primary", "lg")} mt-6`}
          >
            {dash?.addItem ?? "Enregistrer un bien"}
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--rcb-border)] bg-[var(--rcb-bg)] p-5"
            >
              <div className="flex-1">
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
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={addedId === item.id}
                  onClick={() => handleOrderStickers(item)}
                  className="cursor-pointer text-xs font-medium text-[var(--rcb-primary)] transition-colors hover:underline disabled:cursor-default disabled:opacity-60"
                >
                  {addedId === item.id
                    ? (t.registration?.addedToCart ?? "✓")
                    : (t.shop?.orderStickers ?? "Commander des étiquettes")}
                </button>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[item.status] ?? "bg-gray-100 text-gray-800"}`}
                >
                  {dash?.statuses?.[item.status] ?? item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Modal — article déjà dans le panier */}
      {confirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-[var(--rcb-bg)] p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--rcb-text-strong)]">
              {dash?.alreadyInCartTitle ?? "Déjà dans le panier"}
            </h3>
            <p className="mt-2 text-sm text-[var(--rcb-text-muted)]">
              {dash?.alreadyInCartDescription ?? "Cet article est déjà dans votre panier. Voulez-vous en ajouter un autre ?"}
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <Button
                size="sm"
                onClick={() => {
                  doAddItem(confirmItem);
                  setConfirmItem(null);
                }}
              >
                {dash?.alreadyInCartConfirm ?? "Oui, ajouter"}
              </Button>
              <Link
                to="/boutique"
                onClick={() => setConfirmItem(null)}
                className={getButtonClasses("outline", "sm", "w-full")}
              >
                {dash?.alreadyInCartViewCart ?? "Voir le panier"}
              </Link>
              <button
                type="button"
                onClick={() => setConfirmItem(null)}
                className="cursor-pointer pt-1 text-sm font-medium text-[var(--rcb-text-muted)] transition-colors hover:text-[var(--rcb-text-strong)]"
              >
                {dash?.alreadyInCartCancel ?? "Non merci"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
