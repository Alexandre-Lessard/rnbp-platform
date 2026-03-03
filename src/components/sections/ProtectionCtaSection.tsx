import { Button } from "../ui/Button";

export function ProtectionCtaSection() {
  return (
    <section id="inscription" className="scroll-mt-24 bg-[var(--rcb-bg)]">
      <div className="section-shell pt-16 pb-28 sm:pt-20 sm:pb-32 lg:pt-24">
        <div className="relative mx-auto max-w-5xl rounded-[2.5rem] border border-[var(--rcb-frame)] bg-[var(--rcb-bg)] px-8 py-14 sm:px-16 sm:py-20 md:border-0">
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
            <div className="absolute left-[180px] right-[38px] top-0 h-[2px] bg-[var(--rcb-frame)]" />
            <div className="absolute right-0 top-[38px] bottom-[220px] w-[2px] bg-[var(--rcb-frame)]" />
            <div className="absolute left-0 top-[226px] bottom-[38px] w-[2px] bg-[var(--rcb-frame)]" />
            <div className="absolute bottom-0 left-[38px] right-[188px] h-[2px] bg-[var(--rcb-frame)]" />

            <div className="absolute left-0 bottom-0 h-[38px] w-[38px] rounded-bl-[38px] border-b-[2px] border-l-[2px] border-[var(--rcb-frame)]" />
            <div className="absolute right-0 top-0 h-[38px] w-[38px] rounded-tr-[38px] border-r-[2px] border-t-[2px] border-[var(--rcb-frame)]" />

            <img
              src="/assets/cta-arrow.png"
              alt=""
              className="absolute -left-[54px] -top-[5px] w-[165px]"
            />
            <img
              src="/assets/hero-shield-check.png"
              alt=""
              className="absolute -bottom-[86px] -right-[100px] w-[235px]"
              style={{ filter: "sepia(0.15) saturate(2.5) hue-rotate(185deg)" }}
            />
          </div>

          <div className="relative z-10 text-center">
            <h2 className="mx-auto max-w-3xl text-6xl font-bold leading-tight text-[var(--rcb-text)] sm:text-7xl">
              Commencez à protéger
              <br />
              vos biens maintenant
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-3xl leading-relaxed text-[var(--rcb-text-muted)]">
              Que ce soit un vélo électrique, une voiturette de golf, un tracteur à gazon ou tout
              autre véhicule similaire, inscrivez-le pour plus de sécurité et de tranquillité
              d'esprit.
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Button>S'inscrire</Button>
              <Button variant="outline">Vérifier un bien</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
