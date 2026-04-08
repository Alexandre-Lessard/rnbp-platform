import { useLanguage } from "@/i18n/context";
import { AllCategoriesSection } from "@/components/sections/AllCategoriesSection";
import { CycleSection } from "@/components/sections/CycleSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { InsuranceFormSection } from "@/components/sections/InsuranceFormSection";
import { ProtectionCtaSection } from "@/components/sections/ProtectionCtaSection";
import { RollingRegistrySection } from "@/components/sections/RollingRegistrySection";
import { ThreeStepsSection } from "@/components/sections/ThreeStepsSection";
import { VerifyBeforeBuySection } from "@/components/sections/VerifyBeforeBuySection";

export function LandingPage() {
  const { t } = useLanguage();
  return (
    <>
      
        <title>{t.pages.home.title}</title>
        <meta name="description" content={t.pages.home.description} />
      
      <HeroSection />
      <CycleSection />
      <RollingRegistrySection />
      <AllCategoriesSection />
      <ProtectionCtaSection />
      <ThreeStepsSection />
      <InsuranceFormSection />
      <VerifyBeforeBuySection />
      <FaqSection />
    </>
  );
}
export default LandingPage;
