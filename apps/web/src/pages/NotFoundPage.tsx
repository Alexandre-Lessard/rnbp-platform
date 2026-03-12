import { Link } from "react-router";
import { useLanguage } from "@/i18n/context";
import { getButtonClasses } from "@/lib/button-styles";

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-[var(--rcb-primary)]">404</h1>
      <p className="mt-4 text-xl text-[var(--rcb-text-strong)]">
        {t.errors?.notFound ?? "Page introuvable"}
      </p>
      <p className="mt-2 text-[var(--rcb-text-muted)]">
        {t.errors?.notFoundDescription ??
          "La page que vous cherchez n'existe pas ou a été déplacée."}
      </p>
      <Link to="/" className={`${getButtonClasses("primary", "lg")} mt-8`}>
        {t.errors?.backHome ?? "Retour à l'accueil"}
      </Link>
    </section>
  );
}
