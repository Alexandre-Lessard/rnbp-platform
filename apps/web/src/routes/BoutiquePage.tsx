import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { useLanguage } from "@/i18n/context";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { apiRequest } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";

type UserItem = {
  id: string;
  name: string;
  rnbpNumber: string;
};

// ── Feature icon (checkmark in circle) ──────────────────────────────
function CheckIcon() {
  return (
    <svg className="mt-0.5 h-5 w-5 shrink-0 text-[var(--rcb-primary)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

const productImages = [
  "/assets/product-stickers.png",
  "/assets/product-stickers-detail.png",
  "/assets/product-stickers-closeup.png",
];

export function BoutiquePage() {
  const { t } = useLanguage();
  const shop = t.shop!;
  const { user } = useAuth();
  const { cart, addItem, removeItem, updateQuantity, cartCount } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(!!user);
  const [showModal, setShowModal] = useState(false);
  const [modalSelection, setModalSelection] = useState("");

  useEffect(() => {
    if (!user) return;
    apiRequest<{ items: UserItem[] }>("/items")
      .then((data) => setUserItems(data.items))
      .catch(() => { /* ignore */ })
      .finally(() => setLoadingItems(false));
  }, [user]);

  function handleBuyClick() {
    if (user && userItems.length > 0) {
      setModalSelection(userItems[0].rnbpNumber);
      setShowModal(true);
    }
    // Si pas connecté ou pas d'items, on ne fait rien (le bouton affiche un message)
  }

  function handleModalConfirm() {
    const item = userItems.find((i) => i.rnbpNumber === modalSelection);
    if (!item) return;
    addItem({
      rnbpNumber: modalSelection,
      itemName: item.name,
      productName: shop.productName,
    });
    setShowModal(false);
  }

  async function handleCheckout() {
    setCheckingOut(true);
    setError("");
    try {
      const res = await apiRequest<{ url: string }>("/shop/checkout", {
        method: "POST",
        body: {
          items: cart.map((i) => ({
            rnbpNumber: i.rnbpNumber,
            quantity: i.quantity,
          })),
        },
      });
      window.location.href = res.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
      setCheckingOut(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>{t.pages.shop.title}</title>
        <meta name="description" content={t.pages.shop.description} />
      </Helmet>
      <section className="min-h-[70vh] bg-[var(--rcb-white)]">
        {/* ── Hero produit ─────────────────────────────────────────────── */}
      <div className="section-shell grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
        {/* Images */}
        <div className="flex flex-col items-center gap-4">
          <div className="aspect-square w-full max-w-sm overflow-hidden rounded-2xl">
            <img
              src={productImages[activeImage]}
              alt={shop.productImageAlt}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex gap-3">
            {productImages.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`h-16 w-16 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                  i === activeImage
                    ? "border-[var(--rcb-primary)] ring-1 ring-[var(--rcb-primary)]"
                    : "border-[var(--rcb-border)] opacity-60 hover:opacity-100"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold leading-tight text-[var(--rcb-text-strong)] sm:text-4xl">
              {shop.productName}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-[var(--rcb-text-muted)]">
              {shop.productDescription}
            </p>

            {/* Features */}
            <ul className="mt-6 space-y-3">
              {shop.productFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-[var(--rcb-text-body)]">
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              {!user ? (
                <p className="text-sm text-[var(--rcb-text-muted)]">
                  {shop.loginRequired}{" "}
                  <Link to="/connexion" className="font-medium text-[var(--rcb-primary)] hover:underline">
                    {shop.loginLink}
                  </Link>
                </p>
              ) : loadingItems ? null : userItems.length === 0 ? (
                <p className="text-sm text-[var(--rcb-text-muted)]">
                  {shop.noItemsMessage}{" "}
                  <Link to="/enregistrer" className="font-medium text-[var(--rcb-primary)] hover:underline">
                    {shop.noItemsLink}
                  </Link>
                </p>
              ) : (
                <Button onClick={handleBuyClick}>
                  {shop.addButton}
                </Button>
              )}
            </div>
          </div>
        </div>

      {/* ── Séparateur ───────────────────────────────────────────────── */}
      <div className="section-shell">
        <hr className="border-[var(--rcb-border)]" />
      </div>

      {/* ── Panier ───────────────────────────────────────────────────── */}
      <div className="section-shell py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-[var(--rcb-text-strong)]">
            {shop.cartTitle}
          </h2>

          {cartCount === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-[var(--rcb-border)] px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-[var(--rcb-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p className="mt-4 text-[var(--rcb-text-muted)]">{shop.cartEmpty}</p>
              {user && userItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleBuyClick}
                  className="mt-3 cursor-pointer text-sm font-medium text-[var(--rcb-primary)] transition-colors hover:underline"
                >
                  {shop.cartEmptyAction}
                </button>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.rnbpNumber}
                  className="flex items-center justify-between gap-4 rounded-xl border border-[var(--rcb-border)] px-5 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[var(--rcb-text-strong)]">
                      {item.productName ?? shop.productName}
                    </p>
                    <p className="truncate text-sm text-[var(--rcb-text-muted)]">
                      {item.itemName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.rnbpNumber, item.quantity - 1)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[var(--rcb-border)] text-sm font-medium transition-colors hover:bg-[var(--rcb-border)]"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.rnbpNumber, item.quantity + 1)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[var(--rcb-border)] text-sm font-medium transition-colors hover:bg-[var(--rcb-border)]"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.rnbpNumber)}
                      className="ml-2 cursor-pointer text-sm text-red-500 transition-colors hover:text-red-700"
                    >
                      {shop.removeItem}
                    </button>
                  </div>
                </div>
              ))}

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="pt-3">
                <Button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full"
                >
                  {checkingOut ? shop.checkingOut : shop.checkout}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal — sélection du bien ────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-[var(--rcb-bg)] p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--rcb-text-strong)]">
              {shop.selectItemLabel}
            </h3>

            <div className="mt-4 space-y-2">
              {userItems.map((item) => (
                <label
                  key={item.rnbpNumber}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--rcb-border)] p-3 transition-colors hover:bg-[var(--rcb-surface)]"
                >
                  <input
                    type="radio"
                    name="item-select"
                    value={item.rnbpNumber}
                    checked={modalSelection === item.rnbpNumber}
                    onChange={() => setModalSelection(item.rnbpNumber)}
                    className="accent-[var(--rcb-primary)]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--rcb-text-strong)]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[var(--rcb-text-muted)]">
                      {item.rnbpNumber}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
                {t.registration?.backButton ?? "Annuler"}
              </Button>
              <Button size="sm" onClick={handleModalConfirm}>
                {shop.addButton}
              </Button>
            </div>
          </div>
        </div>
      )}
      </section>
    </>
  );
}
