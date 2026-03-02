export function RollingRegistrySection() {
  return (
    <section className="section-frame border-t-0 bg-[#f6f7f9]">
      <div className="section-shell py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-none border border-[#d4dde7] bg-[#f6f7f9] px-6 pt-8 text-center sm:px-10 sm:pt-10 lg:px-20 lg:pt-16">
          <h2 className="mx-auto max-w-3xl text-6xl font-bold leading-tight text-slate-950 sm:text-7xl">
            Le Registre Québécois
            <br />
            du matériel roulant
          </h2>
          <p className="mt-6 text-3xl text-slate-600">
            RDC compte plus de 47 catégories de véhicules roulants
          </p>

          <div className="relative mt-6 h-[320px] sm:h-[450px] lg:h-[560px]">
            <img
              src="/assets/registry-golf.png"
              alt="Voiturette de golf"
              className="absolute left-1/2 top-0 w-[95%] max-w-[980px] -translate-x-1/2 translate-y-4 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
