import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { apiRequest } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { useLanguage } from "@/i18n/context";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/routes";

type OrderItem = {
  id: string;
  quantity: number;
  unitPriceCents: number;
  rnbpNumber: string | null;
  itemId: string | null;
  itemName: string | null;
  itemCategory: string | null;
  itemBrand: string | null;
  itemModel: string | null;
  productSlug: string | null;
  productNameFr: string | null;
  productNameEn: string | null;
  customMechanic: string | null;
};

type OrderDetail = {
  id: string;
  email: string;
  status: string;
  totalCents: number;
  createdAt: string;
  items: OrderItem[];
};

const RNBP_PATTERN = /^RNBP-[A-Z0-9]{8}$/;

export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Per-item assignment state
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [assigning, setAssigning] = useState<Record<string, boolean>>({});
  const [assignErrors, setAssignErrors] = useState<Record<string, string>>({});

  const [shipping, setShipping] = useState(false);
  const [shipError, setShipError] = useState("");

  useEffect(() => {
    apiRequest<{ order: OrderDetail }>(`/admin/orders/${id}`)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(getErrorMessage(err, t)))
      .finally(() => setLoading(false));
  }, [id, t]);

  async function handleAssign(orderItemId: string) {
    const value = (inputs[orderItemId] ?? "").trim().toUpperCase();
    if (!RNBP_PATTERN.test(value)) {
      setAssignErrors((prev) => ({ ...prev, [orderItemId]: "Format: RNBP-XXXXXXXX" }));
      return;
    }

    setAssigning((prev) => ({ ...prev, [orderItemId]: true }));
    setAssignErrors((prev) => ({ ...prev, [orderItemId]: "" }));

    try {
      await apiRequest(`/admin/orders/${id}/items/${orderItemId}/assign`, {
        method: "PATCH",
        body: { rnbpNumber: value },
      });
      // Update local state
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((item) =>
                item.id === orderItemId ? { ...item, rnbpNumber: value } : item,
              ),
            }
          : prev,
      );
    } catch (err) {
      setAssignErrors((prev) => ({
        ...prev,
        [orderItemId]: getErrorMessage(err, t),
      }));
    } finally {
      setAssigning((prev) => ({ ...prev, [orderItemId]: false }));
    }
  }

  async function handleShip() {
    setShipping(true);
    setShipError("");
    try {
      await apiRequest(`/admin/orders/${id}/ship`, { method: "PATCH" });
      setOrder((prev) => (prev ? { ...prev, status: "shipped" } : prev));
    } catch (err) {
      setShipError(getErrorMessage(err, t));
    } finally {
      setShipping(false);
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

  if (error || !order) {
    return (
      <section className="min-h-[80vh] bg-[var(--rcb-white)]">
        <div className="section-shell py-16">
          <p className="text-red-600">{error || "Commande introuvable"}</p>
          <Link to={ROUTES.adminOrders} className="mt-4 inline-block text-sm font-medium text-[var(--rcb-primary)] hover:underline">
            &larr; Retour aux commandes
          </Link>
        </div>
      </section>
    );
  }

  const needsRnbp = (item: OrderItem) => item.customMechanic === "item-linked-stickers";
  const allAssigned = order.items
    .filter(needsRnbp)
    .every((item) => item.rnbpNumber);

  return (
    <section className="min-h-[80vh] bg-[var(--rcb-white)]">
      <div className="section-shell py-16">
        <Link to={ROUTES.adminOrders} className="text-sm font-medium text-[var(--rcb-primary)] hover:underline">
          &larr; Retour aux commandes
        </Link>

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-[var(--rcb-text-strong)]">
            Commande
          </h1>
          <div className="mt-2 space-y-1 text-sm text-[var(--rcb-text-muted)]">
            <p>Client : {order.email}</p>
            <p>Date : {new Date(order.createdAt).toLocaleDateString("fr-CA")}</p>
            <p>Total : {(order.totalCents / 100).toFixed(2)} $</p>
            <p>Statut : <span className="font-medium">{order.status}</span></p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-bold text-[var(--rcb-text-strong)]">Articles</h2>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-[var(--rcb-border)] bg-[var(--rcb-bg)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-[var(--rcb-text-strong)]">
                    {needsRnbp(item)
                      ? (item.itemName ?? "Item inconnu")
                      : (item.productNameFr ?? item.productSlug ?? "Produit")}
                  </p>
                  {needsRnbp(item) && (
                    <p className="mt-1 text-sm text-[var(--rcb-text-muted)]">
                      {[item.itemCategory, item.itemBrand, item.itemModel].filter(Boolean).join(" — ")}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-[var(--rcb-text-muted)]">
                    Quantité : {item.quantity}
                    {item.unitPriceCents != null && (
                      <> — {(item.unitPriceCents / 100).toFixed(2)} $</>
                    )}
                  </p>
                </div>

                {needsRnbp(item) ? (
                  item.rnbpNumber ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      {item.rnbpNumber}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="RNBP-XXXXXXXX"
                        value={inputs[item.id] ?? ""}
                        onChange={(e) =>
                          setInputs((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        className="h-9 w-40 rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-3 text-sm uppercase text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAssign(item.id)}
                        disabled={assigning[item.id]}
                      >
                        {assigning[item.id] ? "..." : "Assigner"}
                      </Button>
                    </div>
                  )
                ) : (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    Produit standard
                  </span>
                )}
              </div>
              {assignErrors[item.id] && (
                <p className="mt-2 text-sm text-red-600">{assignErrors[item.id]}</p>
              )}
            </div>
          ))}
        </div>

        {order.status === "paid" && (
          <div className="mt-8">
            {shipError && (
              <p className="mb-3 text-sm text-red-600">{shipError}</p>
            )}
            <Button
              onClick={handleShip}
              disabled={!allAssigned || shipping}
            >
              {shipping ? "Envoi..." : "Marquer comme expédiée"}
            </Button>
            {!allAssigned && (
              <p className="mt-2 text-sm text-[var(--rcb-text-muted)]">
                Assignez un numéro RNBP aux articles qui le requièrent avant d'expédier.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
