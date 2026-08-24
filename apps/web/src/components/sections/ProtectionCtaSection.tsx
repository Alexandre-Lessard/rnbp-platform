import { Link } from "react-router";
import { useLanguage } from "@/i18n/context";
import { getButtonClasses } from "@/lib/button-styles";
import { ROUTES } from "@/routes/routes";

export function ProtectionCtaSection() {
  const { t } = useLanguage();

  return (
    <section id="register" className="scroll-mt-24 bg-[var(--rcb-bg)]">
      <div className="section-shell pt-16 pb-28 sm:pt-20 sm:pb-32 lg:pt-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[var(--rcb-frame)] bg-[var(--rcb-bg)] sm:rounded-[2.5rem]">
          {/*
            The photo is 3:2. Squeezing it into a narrow fixed column cropped
            the phone and the shield right out of frame, so it now runs as a
            banner above the text on small screens and takes a wider column —
            with a left-of-centre anchor — from lg up, where the subject sits.
          */}
          <div className="grid lg:grid-cols-[minmax(0,420px)_1fr]">
            <img
              src="/assets/promo-protect-v2.webp"
              alt={t.protectionCta.imageAlt}
              width={1536}
              height={1024}
              loading="lazy"
              className="h-56 w-full object-cover object-[35%_center] sm:h-72 lg:h-full"
            />

            <div className="relative z-10 flex flex-col justify-center px-6 py-10 text-center sm:px-12 sm:py-16 lg:px-14 lg:text-left">
              <h2 className="text-balance text-3xl font-bold leading-tight text-[var(--rcb-text)] sm:text-5xl lg:text-6xl">
                {t.protectionCta.headingLine1}{" "}
                <span className="hidden lg:inline">
                  <br />
                </span>
                {t.protectionCta.headingLine2}
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--rcb-text-muted)] sm:mt-8 sm:text-xl">
                {t.protectionCta.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-12 lg:justify-start">
                <Link to={ROUTES.registerItem} className={getButtonClasses("primary")}>{t.buttons.signUp}</Link>
                <Link to={ROUTES.lookup} className={getButtonClasses("outline")}>{t.buttons.verifyItem}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
