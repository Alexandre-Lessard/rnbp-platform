export function RegistrationPromoSection() {
  return (
    <section className="bg-[#f6f7f9]">
      <div className="section-shell py-16 sm:py-20">
        <article className="mx-auto grid max-w-6xl items-stretch overflow-hidden rounded-[2.4rem] bg-[#f6f7f9] lg:grid-cols-[340px_1fr]">
          <img
            src="/assets/promo-protect.png"
            alt="Personnes discutant autour d'une table"
            className="h-full w-full object-cover"
          />
          <div className="flex flex-col justify-center px-8 py-10 sm:px-12 lg:px-16">
            <h2 className="text-6xl font-bold leading-tight text-slate-950 sm:text-7xl">
              Enregistrer et
              <br />
              protéger vos biens
            </h2>
            <p className="mt-7 max-w-2xl text-3xl leading-relaxed text-slate-600">
              Créez un compte et documentez vos possessions de valeur pour faciliter leur
              identification et leur restitution.
            </p>
            <a href="#inscription" className="mt-10 text-2xl font-semibold text-slate-900">
              Accéder &gt;
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
