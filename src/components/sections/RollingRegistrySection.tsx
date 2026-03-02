export function RollingRegistrySection() {
  return (
    <section className="relative border-y border-[#e6eff6] bg-[#f5f5f5]">
      <div className="section-shell py-0">
        <div className="relative overflow-hidden border-y-[3px] border-[#e6eff6] bg-[#f5f5f5] px-6 pt-8 text-center sm:px-10 sm:pt-10 lg:px-20 lg:pt-16">
          <h2 className="mx-auto max-w-3xl text-6xl font-bold leading-tight text-slate-950 sm:text-7xl">
            Le Registre Québécois
            <br />
            du matériel roulant
          </h2>
          <p className="mt-6 text-3xl text-slate-600">
            RDC compte plus de 47 catégories de véhicules roulants
          </p>

          <div className="relative mt-8 h-[360px] sm:h-[460px] lg:h-[620px]">
            <div className="absolute inset-x-0 top-[64%] border-t border-[#d6e7f6]" />
            <img
              src="/assets/registry-golf.png"
              alt="Voiturette de golf"
              className="absolute bottom-0 left-1/2 z-20 w-[94%] max-w-[980px] -translate-x-1/2 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
