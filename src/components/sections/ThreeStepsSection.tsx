import type { StepCard } from "../../types/content";

type ThreeStepsSectionProps = {
  steps: StepCard[];
};

export function ThreeStepsSection({ steps }: ThreeStepsSectionProps) {
  return (
    <section className="section-frame border-t-0 bg-[#f6f7f9]">
      <div className="section-shell py-16 sm:py-20">
        <div className="text-center">
          <h2 className="text-6xl font-bold text-slate-950 sm:text-7xl">Trois étapes claires</h2>
          <p className="mt-5 text-3xl text-slate-600">Commencez maintenant</p>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.step}
              className="overflow-hidden rounded-[2.2rem] border border-[#9ba3af] bg-[#f6f7f9]"
            >
              <div className="px-9 pt-8 pb-7">
                <p className="text-3xl font-bold text-slate-500">{step.step}</p>
                <h3 className="mt-5 text-6xl font-bold leading-tight text-slate-950">{step.title}</h3>
                <p className="mt-6 text-3xl leading-relaxed text-slate-600">{step.description}</p>
                <a href="#inscription" className="mt-6 inline-block text-2xl font-semibold text-slate-900">
                  En savoir plus &gt;
                </a>
              </div>
              <img src={step.image} alt={step.title} className="h-52 w-full object-cover" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
