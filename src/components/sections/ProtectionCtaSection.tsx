export function ProtectionCtaSection() {
  return (
    <section id="inscription" className="section-frame scroll-mt-24 border-t-0 bg-[#f5f5f5]">
      <div className="section-shell pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24">
        <div className="relative mx-auto max-w-5xl rounded-[2.5rem] border-2 border-[#81a7c8] bg-[#f6f7f9] px-8 py-14 text-center sm:px-16 sm:py-20">
          <img
            src="/assets/cta-arrow.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-10 hidden w-44 opacity-25 lg:block"
          />
          <img
            src="/assets/hero-shield-check.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -right-14 hidden w-56 opacity-20 lg:block"
          />

          <h2 className="mx-auto max-w-3xl text-6xl font-bold leading-tight text-slate-950 sm:text-7xl">
            Commencez à protéger
            <br />
            vos biens maintenant
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-3xl leading-relaxed text-slate-600">
            Que ce soit un vélo électrique, une voiturette de golf, un tracteur à gazon ou tout
            autre véhicule similaire, inscrivez-le pour plus de sécurité et de tranquillité
            d'esprit.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="rounded-xl bg-[var(--rcb-primary)] px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-[var(--rcb-primary-dark)]"
            >
              S'inscrire
            </button>
            <button
              type="button"
              className="rounded-xl border border-[var(--rcb-primary)] px-8 py-4 text-lg font-medium text-slate-900 transition-colors hover:bg-white"
            >
              Vérifier un bien
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
