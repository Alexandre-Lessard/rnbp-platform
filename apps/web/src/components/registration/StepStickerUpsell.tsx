import { useState } from "react";
import { Link } from "react-router";
import { useLanguage } from "@/i18n/context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";

type StepStickerUpsellProps = {
  onNext: () => void;
  onBack: () => void;
  itemName: string;
};

export function StepStickerUpsell({ onNext, onBack, itemName }: StepStickerUpsellProps) {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const reg = t.registration!;
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    // Ajoute au panier avec un rnbpNumber temporaire "pending:<itemName>"
    // qui sera remplacé par le vrai numéro RNBP après la création de l'item
    addItem({
      rnbpNumber: `pending:${itemName}`,
      itemName,
      productName: t.shop?.productName,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="rounded-xl border-2 border-[var(--rcb-primary)]/30 bg-[var(--rcb-primary)]/5 p-6 sm:p-8">
        <h3 className="text-xl font-bold text-[var(--rcb-text-strong)]">
          {reg.stickerHeading}
        </h3>
        <p className="mt-3 text-[var(--rcb-text-body)]">
          {reg.stickerPitch}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={added}
            className={added ? "cursor-default opacity-70" : ""}
          >
            {added ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {reg.addedToCart}
              </span>
            ) : (
              reg.addToCart
            )}
          </Button>

          <Link
            to="/boutique"
            className="text-sm font-medium text-[var(--rcb-primary)] transition-colors hover:underline"
          >
            {reg.viewShop} &rarr;
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer text-sm font-medium text-[var(--rcb-text-muted)] transition-colors hover:text-[var(--rcb-text-strong)]"
        >
          &larr; {reg.backButton}
        </button>
        <Button onClick={onNext}>
          {reg.confirmButton}
        </Button>
      </div>
    </div>
  );
}
