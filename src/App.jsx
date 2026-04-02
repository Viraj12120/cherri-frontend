import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { CustomEase } from 'gsap/CustomEase';

import { PATHS } from './routes/paths';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleGuard from './routes/RoleGuard';
import { useAuthStore } from './stores/authStore';

// Landing Components
import Navbar from './components/Navbar';
import Hero from './landing/Hero';
import FeatureIntro from './landing/FeatureIntro';
import FeatureGrid from './landing/FeatureGrid';
import Outcomes from './landing/Outcomes';
import UseCase from './landing/UseCase';
import FAQ from './landing/FAQ';
import FinalCTA from './landing/FinalCTA';
import Footer from './components/Footer';

// Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Pricing from './pages/Pricing';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import AcceptInvitePage from './pages/AcceptInvitePage';
import NotFoundPage from './pages/NotFoundPage';
import PlaceholderPage from './pages/PlaceholderPage';

// UI
import { ToastContainer } from './components/ui/Toast';

// Dashboard
import DashboardLayout from './dashboard/Layout';
import OverviewPage from './pages/dashboard/OverviewPage';
import InventoryPage from './pages/dashboard/InventoryPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import OrdersPage from './pages/dashboard/OrdersPage';
import AlertsPage from './pages/dashboard/AlertsPage';
import AgentsPage from './pages/dashboard/AgentsPage';
import AIQueryPage from './pages/dashboard/AIQueryPage';
import BillingPage from './pages/dashboard/BillingPage';
import UsersPage from './pages/dashboard/UsersPage';
import AuditLogPage from './pages/dashboard/AuditLogPage';
import SuppliersPage from './pages/dashboard/SuppliersPage';
import RedistributionsPage from './pages/dashboard/RedistributionsPage';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineBanner from './components/OfflineBanner';

gsap.registerPlugin(ScrollTrigger, TextPlugin, CustomEase);

// Register CherriPlus custom easing curves
CustomEase.create('pharma.out', 'M0,0 C0.16,1 0.3,1 1,1');
CustomEase.create('pharma.inOut', 'M0,0 C0.5,0 0.5,1 1,1');
CustomEase.create('pharma.spring', 'M0,0 C0.14,0 0.22,1.13 1,1');

// ─── Landing Page ────────────────────────────────────────────────────────────
const LandingPage = () => {
  const { i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-section').forEach((section) => {
        const children = section.querySelectorAll('.reveal-child');
        if (children.length > 0) {
          gsap.fromTo(
            children,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.08,
              ease: 'pharma.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                once: true,
              },
            },
          );
        }
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full overflow-x-hidden">
      <Navbar currentView="landing" isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main>
        <div id="home"><Hero key={i18n.language} /></div>
        <div id="features"><FeatureIntro /></div>
        <FeatureGrid />
        <Outcomes />
        <div id="about"><UseCase /></div>
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

// ─── Dashboard Root Redirect ─────────────────────────────────────────────────
const DashboardRootRedirect = () => {
  const user = useAuthStore((s) => s.user);
  if (user?.tenant_id) {
    return <Navigate to={PATHS.dashboard(user.tenant_id)} replace />;
  }
  return <Navigate to={PATHS.login} replace />;
};

// ─── App with Router ─────────────────────────────────────────────────────────
function App() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useAuthStore((s) => s.fetchMe);

  // On app load: if tokens exist but user isn't fetched, validate session
  useEffect(() => {
    if (accessToken && isAuthenticated) {
      fetchMe().catch(() => {
        // fetchMe failed — interceptor will handle refresh/logout
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <OfflineBanner />
      <Routes>
        {/* ── Public Routes ─────────────────────────────────────────────── */}
        <Route path={PATHS.home} element={<LandingPage />} />
        <Route path={PATHS.login} element={<Login />} />
        <Route path={PATHS.signup} element={<SignUp />} />
        <Route path={PATHS.pricing} element={<Pricing />} />
        <Route path={PATHS.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path={PATHS.resetPassword} element={<ResetPasswordPage />} />
        <Route path={PATHS.verifyEmail} element={<VerifyEmailPage />} />
        <Route path={PATHS.acceptInvite} element={<AcceptInvitePage />} />

        {/* ── Protected Dashboard Routes ────────────────────────────────── */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRootRedirect /></ProtectedRoute>} />

        <Route
          path={PATHS.dashboardBase}
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<OverviewPage />}
          />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="medicines" element={<PlaceholderPage title="Medicines" />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<PlaceholderPage title="Order Detail" />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="agents/:agentActionId" element={<PlaceholderPage title="Agent Detail" />} />
          {/* <Route path="ai-query" element={<AIQueryPage />} /> */}
          <Route path="redistributions" element={<RedistributionsPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route
            path="users"
            element={
              <RoleGuard allowedRoles={['ADMIN', 'MANAGER']}>
                <UsersPage />
              </RoleGuard>
            }
          />
          <Route
            path="audit-log"
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <AuditLogPage />
              </RoleGuard>
            }
          />
        </Route>

        {/* ── 404 ───────────────────────────────────────────────────────── */}
        <Route path={PATHS.notFound} element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={PATHS.notFound} replace />} />
      </Routes>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
