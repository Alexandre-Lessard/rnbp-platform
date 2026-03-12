import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { useLanguage } from "@/i18n/context";
import { useCart } from "@/lib/cart-context";
import { getButtonClasses } from "@/lib/button-styles";
import { ROUTES } from "@/routes/routes";

export function BoutiqueSuccessPage() {
  const { t } = useLanguage();
  const shop = t.shop!;
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Helmet>
        <title>{t.pages.shopSuccess.title}</title>
        <meta name="description" content={t.pages.shopSuccess.description} />
      </Helmet>
      <section className="min-h-[70vh] bg-[var(--rcb-white)]">
      <div className="section-shell flex flex-col items-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-[var(--rcb-text-strong)]">
          {shop.successHeading}
        </h1>
        <p className="mt-3 text-lg text-[var(--rcb-text-muted)]">
          {shop.successDescription}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to={ROUTES.shop} className={getButtonClasses("outline")}>
            {shop.backToShop}
          </Link>
          <Link to="/" className={getButtonClasses("primary")}>
            {shop.backToHome}
          </Link>
        </div>
      </div>
      </section>
    </>
  );
}
