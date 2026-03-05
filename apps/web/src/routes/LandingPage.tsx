import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/i18n/context";
import { AllCategoriesSection } from "@/components/sections/AllCategoriesSection";
import { CycleSection } from "@/components/sections/CycleSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { InsuranceFormSection } from "@/components/sections/InsuranceFormSection";
import { ProtectionCtaSection } from "@/components/sections/ProtectionCtaSection";
import { RollingRegistrySection } from "@/components/sections/RollingRegistrySection";
import { ThreeStepsSection } from "@/components/sections/ThreeStepsSection";

export function LandingPage() {
  const { t } = useLanguage();
  return (
    <>
      <Helmet>
        <title>{t.pages.home.title}</title>
        <meta name="description" content={t.pages.home.description} />
      </Helmet>
      <HeroSection />
      <CycleSection />
      <RollingRegistrySection />
      <AllCategoriesSection />
      <ProtectionCtaSection />
      <ThreeStepsSection />
      <InsuranceFormSection />
      <FaqSection />
    </>
  );
}
