export function Footer() {
  return (
    <footer id="contact" className="section-frame border-t-0 bg-[var(--rcb-header)]">
      <div className="section-shell py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <a href="#accueil" className="inline-block">
              <img src="/assets/logo-rcdb.png" alt="RCBP" className="h-10" />
            </a>
            <nav className="mt-8 flex flex-wrap gap-8 text-sm font-medium text-[var(--rcb-text-strong)]">
              <a href="#accueil">Accueil</a>
              <a href="#inscription">Enregistrer</a>
              <a href="#cycle">À propos</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[var(--rcb-text-strong)]">S'abonner</h3>
            <form
              className="mt-5 flex flex-col gap-4 sm:flex-row"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                placeholder="Votre adresse courriel"
                className="h-11 w-full border-b border-[var(--rcb-border-muted)] bg-transparent px-1 text-lg text-[var(--rcb-text-body)] placeholder:text-[var(--rcb-text-light)] focus:outline-none"
              />
              <button
                type="submit"
                className="h-11 rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-5 text-sm font-semibold text-[var(--rcb-text-strong)] transition-colors hover:bg-[var(--rcb-surface)]"
              >
                Envoyer
              </button>
            </form>
            <p className="mt-4 text-sm text-[var(--rcb-text-muted)]">
              En vous abonnant, vous acceptez notre politique de confidentialité.
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-[var(--rcb-border)] pt-8 text-sm text-[var(--rcb-text-body)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-6">
              <a href="#faq" className="underline">
                Politique de confidentialité
              </a>
              <a href="#faq" className="underline">
                Conditions d'utilisation
              </a>
              <a href="#faq" className="underline">
                Paramètres de cookies
              </a>
            </div>
            <p>© 2026 Registre canadien des biens personnels. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
