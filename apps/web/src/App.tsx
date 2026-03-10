import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useLanguage } from "@/i18n/context";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

import { CartProvider } from "@/lib/cart-context";
import { LandingPage } from "@/routes/LandingPage";
import { LoginPage } from "@/routes/LoginPage";
import { RegisterAccountPage } from "@/routes/RegisterAccountPage";
import { RegisterItemPage } from "@/routes/RegisterItemPage";
import { DashboardPage } from "@/routes/DashboardPage";
import { ReportTheftPage } from "@/routes/ReportTheftPage";
import { LookupPage } from "@/routes/LookupPage";
import { PartnerPage } from "@/routes/PartnerPage";
import { PrivacyPolicyPage } from "@/routes/PrivacyPolicyPage";
import { TermsOfServicePage } from "@/routes/TermsOfServicePage";
import { FaqPage } from "@/routes/FaqPage";
import { ContactPage } from "@/routes/ContactPage";
import { BoutiquePage } from "@/routes/BoutiquePage";
import { BoutiqueSuccessPage } from "@/routes/BoutiqueSuccessPage";
import { NotFoundPage } from "@/routes/NotFoundPage";

function App() {
  const { t } = useLanguage();

  return (
    <CartProvider>
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[var(--rcb-primary)] focus:px-4 focus:py-2 focus:text-white"
      >
        {t.a11y.skipToContent}
      </a>
      <ScrollToTop />
      <Navbar />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterAccountPage />} />
          <Route path="/enregistrer" element={<RegisterItemPage />} />
          <Route path="/verifier" element={<LookupPage />} />
          <Route path="/partenaires" element={<PartnerPage />} />
          <Route path="/confidentialite" element={<PrivacyPolicyPage />} />
          <Route path="/conditions" element={<TermsOfServicePage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/boutique" element={<BoutiquePage />} />
          <Route path="/boutique/succes" element={<BoutiqueSuccessPage />} />
          <Route
            path="/tableau-de-bord"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/declarer-vol"
            element={
              <ProtectedRoute>
                <ReportTheftPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
    </CartProvider>
  );
}

export default App;
