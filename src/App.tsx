import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AllCategoriesSection } from "@/components/sections/AllCategoriesSection";
import { CycleSection } from "@/components/sections/CycleSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProtectionCtaSection } from "@/components/sections/ProtectionCtaSection";
import { RollingRegistrySection } from "@/components/sections/RollingRegistrySection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";
import { ThreeStepsSection } from "@/components/sections/ThreeStepsSection";
import { useLanguage } from "@/i18n/context";

function App() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[var(--rcb-primary)] focus:px-4 focus:py-2 focus:text-white"
      >
        {t.a11y.skipToContent}
      </a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <CycleSection />
        <RollingRegistrySection />
        <AllCategoriesSection />
        <ProtectionCtaSection />
        <ThreeStepsSection />
        <SocialProofSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
