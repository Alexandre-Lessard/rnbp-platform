import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useParams, useSearchParams } from "react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { useLanguage } from "@/i18n/context";
import { ROUTES } from "@/routes/routes";

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

// Redirects temporaires — anciennes routes FR (retirer apres juillet 2026)
function RedirectWithSearch({ to }: { to: string }) {
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();
  return <Navigate to={search ? `${to}?${search}` : to} replace />;
}
function RedirectEdit() {
  const { id } = useParams();
  return <Navigate to={ROUTES.edit(id!)} replace />;
}
function RedirectAdminOrder() {
  const { id } = useParams();
  return <Navigate to={ROUTES.adminOrderDetail(id!)} replace />;
}

import { PromoBanner } from "@/components/layout/PromoBanner";
import { CartProvider } from "@/lib/cart-context";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterAccountPage } from "@/pages/RegisterAccountPage";
import { RegisterItemPage } from "@/pages/RegisterItemPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ReportTheftPage } from "@/pages/ReportTheftPage";
import { LookupPage } from "@/pages/LookupPage";
import { PartnerPage } from "@/pages/PartnerPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "@/pages/TermsOfServicePage";
import { FaqPage } from "@/pages/FaqPage";
import { ContactPage } from "@/pages/ContactPage";
import { BoutiquePage } from "@/pages/BoutiquePage";
import { BoutiqueSuccessPage } from "@/pages/BoutiqueSuccessPage";
import { AdminItemsPage } from "@/pages/AdminItemsPage";
import { AdminOrdersPage } from "@/pages/AdminOrdersPage";
import { AdminOrderDetailPage } from "@/pages/AdminOrderDetailPage";
import { AdminProductsPage } from "@/pages/AdminProductsPage";
import { AdminProductEditPage } from "@/pages/AdminProductEditPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { VerifyEmailPage } from "@/pages/VerifyEmailPage";
import { EmailPendingPage } from "@/pages/EmailPendingPage";
import { EditItemPage } from "@/pages/EditItemPage";
import { OAuthCallbackPage } from "@/pages/OAuthCallbackPage";
import { AboutPage } from "@/pages/AboutPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { LookupPhotoPage } from "@/pages/LookupPhotoPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

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
      <PromoBanner />
      <main id="main-content">
        <Routes>
          <Route path={ROUTES.home} element={<LandingPage />} />
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.register} element={<RegisterAccountPage />} />
          <Route path={ROUTES.registerItem} element={<RegisterItemPage />} />
          <Route path={ROUTES.lookup} element={<LookupPage />} />
          <Route path={ROUTES.lookupPhoto} element={<LookupPhotoPage />} />
          <Route path={ROUTES.registry} element={<PartnerPage />} />
          <Route path={ROUTES.privacy} element={<PrivacyPolicyPage />} />
          <Route path={ROUTES.terms} element={<TermsOfServicePage />} />
          <Route path={ROUTES.faq} element={<FaqPage />} />
          <Route path={ROUTES.contact} element={<ContactPage />} />
          <Route path={ROUTES.about} element={<AboutPage />} />
          <Route path={ROUTES.shop} element={<BoutiquePage />} />
          <Route path={ROUTES.shopSuccess} element={<BoutiqueSuccessPage />} />
          <Route path={ROUTES.verifyEmail} element={<VerifyEmailPage />} />
          <Route path={ROUTES.emailPending} element={<EmailPendingPage />} />
          <Route path={ROUTES.googleCallback} element={<OAuthCallbackPage />} />
          <Route path={ROUTES.facebookCallback} element={<OAuthCallbackPage />} />
          <Route path={ROUTES.microsoftCallback} element={<OAuthCallbackPage />} />
          <Route
            path={ROUTES.dashboard}
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.settings}
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.reportTheft}
            element={
              <ProtectedRoute>
                <ReportTheftPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.admin}
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboardPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path={ROUTES.adminItems}
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminItemsPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path={ROUTES.adminOrders}
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminOrdersPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders/:id"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminOrderDetailPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path={ROUTES.adminProducts}
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminProductsPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/:id"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminProductEditPage />
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* Redirects temporaires — anciennes routes FR (retirer apres juillet 2026) */}
          <Route path="/connexion" element={<RedirectWithSearch to={ROUTES.login} />} />
          <Route path="/inscription" element={<Navigate to={ROUTES.register} replace />} />
          <Route path="/enregistrer" element={<Navigate to={ROUTES.registerItem} replace />} />
          <Route path="/verifier" element={<Navigate to={ROUTES.lookup} replace />} />
          <Route path="/confidentialite" element={<Navigate to={ROUTES.privacy} replace />} />
          <Route path="/conditions" element={<Navigate to={ROUTES.terms} replace />} />
          <Route path="/boutique/succes" element={<Navigate to={ROUTES.shopSuccess} replace />} />
          <Route path="/boutique" element={<Navigate to={ROUTES.shop} replace />} />
          <Route path="/verifier-courriel" element={<Navigate to={ROUTES.verifyEmail} replace />} />
          <Route path="/verification-en-attente" element={<Navigate to={ROUTES.emailPending} replace />} />
          <Route path="/tableau-de-bord" element={<Navigate to={ROUTES.dashboard} replace />} />
          <Route path="/modifier/:id" element={<RedirectEdit />} />
          <Route path="/declarer-vol" element={<Navigate to={ROUTES.reportTheft} replace />} />
          <Route path="/admin/commandes/:id" element={<RedirectAdminOrder />} />
          <Route path="/admin/commandes" element={<Navigate to={ROUTES.adminOrders} replace />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
    </CartProvider>
  );
}

export default App;
