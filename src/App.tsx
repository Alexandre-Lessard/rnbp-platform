import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { CategoriesSection } from "./components/sections/CategoriesSection";
import { CycleSection } from "./components/sections/CycleSection";
import { FaqSection } from "./components/sections/FaqSection";
import { HeroSection } from "./components/sections/HeroSection";
import { ProtectionCtaSection } from "./components/sections/ProtectionCtaSection";
import { RegistrationPromoSection } from "./components/sections/RegistrationPromoSection";
import { RollingRegistrySection } from "./components/sections/RollingRegistrySection";
import { ThreeStepsSection } from "./components/sections/ThreeStepsSection";
import {
  categories,
  cycleActions,
  cycleBenefits,
  faqItems,
  navItems,
  registrationSteps,
  siteMeta,
} from "./data/siteContent";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar items={navItems} />
      <main>
        <HeroSection />
        <CategoriesSection items={categories} minValueLabel={siteMeta.minValueLabel} />
        <CycleSection actions={cycleActions} benefits={cycleBenefits} />
        <RegistrationPromoSection />
        <RollingRegistrySection />
        <ProtectionCtaSection />
        <ThreeStepsSection steps={registrationSteps} />
        <FaqSection items={faqItems} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
