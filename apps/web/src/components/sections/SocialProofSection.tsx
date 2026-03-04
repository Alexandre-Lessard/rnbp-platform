import { useLanguage } from "@/i18n/context";

export function SocialProofSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-[var(--rcb-bg)]">
      <div className="section-shell py-14 sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-[var(--rcb-primary)]/30 bg-[var(--rcb-primary)]/10 px-5 py-2 text-sm font-semibold text-[var(--rcb-primary)]">
            {t.socialProof.badge}
          </span>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {t.socialProof.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-5xl font-bold text-[var(--rcb-primary)] sm:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-lg text-[var(--rcb-text-muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
