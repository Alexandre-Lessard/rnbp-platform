export function RollingRegistrySection() {
  return (
    <section className="border-y-[3px] border-[#e6eff6] bg-[#f5f5f5]">
      <div className="section-shell py-14 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="text-left">
            <h2 className="text-6xl font-bold leading-tight text-slate-950 sm:text-7xl">
              Le Registre canadien
              <br />
              des biens
            </h2>
            <p className="mt-6 max-w-3xl text-3xl leading-relaxed text-slate-600">
              RCDB couvre plus de 47 catégories de biens, incluant le matériel roulant, l'électronique,
              les outils spécialisés et d'autres articles de valeur.
            </p>
            <p className="mt-6 text-2xl font-semibold text-slate-800">
              Une preuve claire de propriété, au même endroit.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[760px]">
            <img
              src="/assets/rcdb-registry-visual.png"
              alt="Voiturette de golf"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
