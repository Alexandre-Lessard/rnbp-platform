import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/i18n/context";
import { useCart, cartKey } from "@/lib/cart-context";
import { apiRequest, isNetworkError } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { getButtonClasses } from "@/lib/button-styles";
import { Button } from "@/components/ui/Button";
import { ServiceUnavailable } from "@/components/auth/ServiceUnavailable";
import { PromoCallout } from "@/components/ui/PromoCallout";
import { ROUTES } from "@/routes/routes";

type Item = {
  id: string;
  name: string;
  category: string;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  status: string;
  rnbpNumber: string | null;
  archivedAt: string | null;
  archiveReason: string | null;
  archiveReasonCustom: string | null;
  createdAt: string;
};

export function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { cart, addItem } = useCart();
  const [items, setItems] = useState<Item[]>([]);
  const [archivedItems, setArchivedItems] = useState<Item[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [backendDown, setBackendDown] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Modal state for "already in cart" confirmation
  const [confirmItem, setConfirmItem] = useState<Item | null>(null);

  useEffect(() => {
    Promise.all([
      apiRequest<{ items: Item[] }>("/items"),
      apiRequest<{ items: Item[] }>("/items?archived=true"),
    ])
      .then(([active, all]) => {
        setItems(active.items);
        setArchivedItems(all.items.filter((i) => i.archivedAt !== null));
      })
      .catch((err) => {
        if (isNetworkError(err)) {
          setBackendDown(true);
        } else {
          setLoadError(getErrorMessage(err, t));
        }
      })
      .finally(() => setLoading(false));
  }, [t]);

  function doAddItem(item: Item) {
    addItem({
      productId: "",
      productSlug: "sticker-sheet",
      productName: t.shop?.productName ?? "",
      itemId: item.id,
      itemName: item.name,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 2500);
  }

  function handleOrderStickers(item: Item) {
    if (addedId === item.id) return;

    const key = cartKey({ productSlug: "sticker-sheet", itemId: item.id });
    const alreadyInCart = cart.some((c) => cartKey(c) === key);
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
            {dash?.heading ?? "Dashboard"}
          </h1>
          <p className="mt-1 text-lg text-[var(--rcb-text-muted)]">
            {dash?.welcome?.replace("{{name}}", user?.firstName ?? "") ??
              `Welcome, ${user?.firstName}`}
          </p>
          {user?.clientNumber && (
            <p className="mt-1 text-sm text-[var(--rcb-text-muted)]">
              {dash?.clientNumber ?? "Client no."} : {user.clientNumber.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.registerItem}
            className={getButtonClasses("primary", "sm", "w-[170px] whitespace-nowrap text-center")}
          >
            + {dash?.addItem ?? "Register an item"}
          </Link>
          <Link
            to={ROUTES.reportTheft}
            className={getButtonClasses("outline", "sm", "w-[170px] whitespace-nowrap text-center")}
          >
            {dash?.reportTheft ?? "Report a theft"}
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
            {dash?.noItems ?? "No items registered yet."}
          </p>
          <Link
            to={ROUTES.registerItem}
            className={`${getButtonClasses("primary", "lg")} mt-6`}
          >
            {dash?.addItem ?? "Register an item"}
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
                  {item.rnbpNumber ? (
                    <>
                      {" — "}
                      <span className="font-mono text-xs tracking-wider">
                        {item.rnbpNumber}
                      </span>
                    </>
                  ) : item.serialNumber ? (
                    <>
                      {" — "}
                      <span className="text-xs text-[var(--rcb-text-muted)]">
                        S/N {item.serialNumber}
                      </span>
                    </>
                  ) : null}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {item.status === "active" && (
                  <Link
                    to={ROUTES.edit(item.id)}
                    className={getButtonClasses("outline", "sm", "!px-4 !py-1.5 !text-xs")}
                  >
                    {dash?.editItem ?? "Edit"}
                  </Link>
                )}
                {item.status !== "stolen" && (
                  <button
                    type="button"
                    disabled={addedId === item.id}
                    onClick={() => handleOrderStickers(item)}
                    className="cursor-pointer text-xs font-medium text-[var(--rcb-primary)] transition-colors hover:underline disabled:cursor-default disabled:opacity-60"
                  >
                    {addedId === item.id
                      ? (t.registration?.addedToCart ?? "✓")
                      : (t.shop?.orderStickers ?? "Order stickers")}
                  </button>
                )}
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

      {/* ── Promo callout ─────────────────────────────────── */}
      <div className="mt-8">
        <PromoCallout variant="dashboard" items={items} />
      </div>

      {/* ── Archived items section ──────────────────────────── */}
      {archivedItems.length > 0 && (
        <div className="mt-12">
          <button
            type="button"
            onClick={() => setShowArchived((v) => !v)}
            className="cursor-pointer text-sm font-medium text-[var(--rcb-text-muted)] transition-colors hover:text-[var(--rcb-primary)]"
          >
            {t.archive?.archivedItems ?? "Archived items"} ({archivedItems.length})
            {showArchived ? " ▲" : " ▼"}
          </button>
          {showArchived && (
            <div className="mt-4 space-y-3">
              {archivedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--rcb-border)] bg-[var(--rcb-surface)] p-4 opacity-60"
                >
                  <div>
                    <h3 className="font-medium text-[var(--rcb-text-strong)]">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-[var(--rcb-text-muted)]">
                      {t.archive?.archivedOn ?? "Archived on"}{" "}
                      {item.archivedAt ? new Date(item.archivedAt).toLocaleDateString() : "—"}
                      {" — "}
                      {t.archive?.reason ?? "Reason"}: {item.archiveReason === "other"
                        ? item.archiveReasonCustom
                        : t.archive?.reasons?.[item.archiveReason ?? ""] ?? item.archiveReason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>

      {/* Modal — item already in cart */}
      {confirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-[var(--rcb-bg)] p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--rcb-text-strong)]">
              {dash?.alreadyInCartTitle ?? "Already in cart"}
            </h3>
            <p className="mt-2 text-sm text-[var(--rcb-text-muted)]">
              {dash?.alreadyInCartDescription ?? "This item is already in your cart. Add another?"}
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <Button
                size="sm"
                onClick={() => {
                  doAddItem(confirmItem);
                  setConfirmItem(null);
                }}
              >
                {dash?.alreadyInCartConfirm ?? "Yes, add"}
              </Button>
              <Link
                to={ROUTES.shop}
                onClick={() => setConfirmItem(null)}
                className={getButtonClasses("outline", "sm", "w-full")}
              >
                {dash?.alreadyInCartViewCart ?? "View cart"}
              </Link>
              <button
                type="button"
                onClick={() => setConfirmItem(null)}
                className="cursor-pointer pt-1 text-sm font-medium text-[var(--rcb-text-muted)] transition-colors hover:text-[var(--rcb-text-strong)]"
              >
                {dash?.alreadyInCartCancel ?? "No thanks"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
