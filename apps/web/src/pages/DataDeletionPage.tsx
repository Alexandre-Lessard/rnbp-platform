import { useLanguage } from "@/i18n/context";

export function DataDeletionPage() {
  const { t } = useLanguage();
  const dd = t.legal!.dataDeletion;
  const meta = t.pages.dataDeletion;

  return (
    <section className="min-h-[70vh] bg-[var(--rcb-bg)]">
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <div className="section-shell py-16">
        <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
          {dd.heading}
        </h1>
        <div className="mt-10 max-w-3xl space-y-10">
          <p className="leading-relaxed text-[var(--rcb-text-body)]">
            {dd.intro}
          </p>

          <div>
            <h2 className="text-lg font-semibold text-[var(--rcb-text-strong)]">
              {dd.stepsHeading}
            </h2>
            <ol className="mt-4 list-decimal space-y-3 pl-6 leading-relaxed text-[var(--rcb-text-body)]">
              {dd.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--rcb-text-strong)]">
              {dd.timelineHeading}
            </h2>
            <p className="mt-2 leading-relaxed text-[var(--rcb-text-body)]">
              {dd.timeline}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--rcb-text-strong)]">
              {dd.contactHeading}
            </h2>
            <p className="mt-2 leading-relaxed text-[var(--rcb-text-body)]">
              {dd.contactBody}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export default DataDeletionPage;
