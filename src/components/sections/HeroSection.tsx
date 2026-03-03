import { Button } from "../ui/Button";

function ChevronDown() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="-mt-1 h-9 w-14">
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
    <section id="accueil" className="section-frame scroll-mt-28 border-t-0 bg-[var(--rcb-bg)]">
      <div className="section-shell grid items-center gap-10 py-16 lg:grid-cols-[1fr_1.1fr] lg:py-20">
        <div className="animate-rise">
          <p className="text-4xl font-medium leading-tight text-[var(--rcb-text)] sm:text-5xl">
            Protèges et retrouves
          </p>
          <h1 className="mt-2 text-7xl font-bold leading-[0.95] text-[var(--rcb-navy)] sm:text-8xl">
            Tes biens
          </h1>

          <p className="mt-8 border-l-2 border-[var(--rcb-navy)] pl-4 text-4xl text-[var(--rcb-text)] sm:text-[2.2rem]">
            C'est Simple et pratique
          </p>

          <p className="mt-8 max-w-xl text-2xl leading-relaxed text-[var(--rcb-text-muted)]">
            Enregistrez vos biens de valeur dans un registre sécurisé afin de simplifier leur
            identification et d'augmenter vos chances de restitution en cas de perte ou de vol.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Button>Enregistrer un bien</Button>
            <Button variant="outline">Déclare un bien volé</Button>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[700px] items-center justify-center">
          <img
            src="/assets/hero-shield-check.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -top-10 -left-10 w-[420px] opacity-90"
          />
          <img
            src="/assets/hero-items.png"
            alt="Vélo, laptop, cellulaire, montre, voiturette de golf et autres biens"
            className="relative z-10 w-full drop-shadow-[0_30px_40px_rgba(16,25,40,0.2)]"
          />
        </div>
      </div>

      <div className="relative border-t border-[var(--rcb-border-muted)]">
        <a
          href="#categories"
          className="absolute left-1/2 top-[-1px] flex h-[49px] w-[98px] -translate-x-1/2 items-start justify-center rounded-b-full border border-t-0 border-[var(--rcb-border-muted)] bg-[var(--rcb-bg)] text-[var(--rcb-text)] transition-colors hover:text-[var(--rcb-primary)]"
        >
          <ChevronDown />
        </a>
      </div>
    </section>
  );
}
