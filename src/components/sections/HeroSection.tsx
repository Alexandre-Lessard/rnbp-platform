function ChevronDown() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7">
      <path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section id="accueil" className="section-frame scroll-mt-28 border-t-0 bg-[#f8f9fb]">
      <div className="section-shell grid items-center gap-10 py-16 lg:grid-cols-[1fr_1.1fr] lg:py-20">
        <div className="animate-rise">
          <p className="text-5xl font-medium leading-tight text-slate-900 sm:text-6xl">
            Protèges et retrouves
          </p>
          <h1 className="mt-2 text-7xl font-bold leading-[0.95] text-slate-950 sm:text-8xl">
            tes biens
          </h1>

          <p className="mt-8 border-l-2 border-[var(--rcb-primary)] pl-4 text-4xl text-slate-900 sm:text-[2.2rem]">
            C'est Simple et pratique
          </p>

          <p className="mt-8 max-w-xl text-2xl leading-relaxed text-slate-600">
            Enregistrez vos biens de valeur dans un registre sécurisé afin de simplifier leur
            identification et d'augmenter vos chances de restitution en cas de perte ou de vol.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="rounded-xl bg-[var(--rcb-primary)] px-7 py-4 text-lg font-medium text-white transition-colors hover:bg-[var(--rcb-primary-dark)]"
            >
              Enregistrer un bien
            </button>
            <button
              type="button"
              className="rounded-xl border border-[var(--rcb-primary)] bg-white px-7 py-4 text-lg font-medium text-slate-900 transition-colors hover:bg-[var(--rcb-primary-light)]"
            >
              Déclare un bien volé
            </button>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[720px] items-center justify-center lg:justify-start">
          <img
            src="/assets/hero-shield-check.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -top-16 -left-2 w-[70%]"
          />
          <img
            src="/assets/hero-scooter.png"
            alt="Trottinette électrique"
            className="relative z-10 w-full max-w-[460px] drop-shadow-[0_30px_40px_rgba(16,25,40,0.2)]"
          />
        </div>
      </div>

      <div className="relative border-t border-[#d2d9e2]">
        <a
          href="#categories"
          className="absolute left-1/2 top-0 flex h-14 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-b-[2.2rem] border border-[#cfd7e1] bg-[#f8f9fb] text-slate-900 transition-colors hover:text-[var(--rcb-primary)]"
        >
          <ChevronDown />
        </a>
      </div>
    </section>
  );
}
