import { AllCategoriesSection } from "@/components/sections/AllCategoriesSection";
import { CycleSection } from "@/components/sections/CycleSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { InsuranceFormSection } from "@/components/sections/InsuranceFormSection";
import { ProtectionCtaSection } from "@/components/sections/ProtectionCtaSection";
import { RollingRegistrySection } from "@/components/sections/RollingRegistrySection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";
import { ThreeStepsSection } from "@/components/sections/ThreeStepsSection";

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <CycleSection />
      <RollingRegistrySection />
      <AllCategoriesSection />
      <ProtectionCtaSection />
      <ThreeStepsSection />
      <SocialProofSection />
      <InsuranceFormSection />
      <FaqSection />
    </>
  );
}
