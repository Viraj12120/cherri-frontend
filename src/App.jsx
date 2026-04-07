import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import ROICalculator from './components/ROICalculator';
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

// Register Cherri+ custom easing curves
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
        
        {/* ROI Calculator Section */}
        <section id="roi" className="py-24 px-6 md:px-12 bg-[radial-gradient(circle_at_80%_20%,rgba(232,245,50,0.03)_0%,transparent_50%)]">
            <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4 reveal-section">
                <span className="text-acid text-[10px] font-black uppercase tracking-[0.3em] mb-4 reveal-child">Value Assessment</span>
                <h2 className="text-3xl md:text-5xl font-black text-white italic mb-16 text-center reveal-child uppercase tracking-tight">
                    ESTIMATE YOUR <span className="text-acid underline underline-offset-[12px] decoration-1 decoration-acid/30">ANNUAL RECOVERY</span>
                </h2>
                <div className="w-full flex justify-center reveal-child">
                    <ROICalculator />
                </div>
                <p className="text-white/30 text-[10px] uppercase font-mono tracking-widest mt-12 reveal-child">
                    Based on average pharmaceutical industry expiry benchmarks
                </p>
            </div>
        </section>

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

// ─── Google OAuth Callback ──────────────────────────────────────────────────
const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const handleGoogleCallback = useAuthStore((s) => s.handleGoogleCallback);
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleGoogleCallback(code).then((user) => {
        if (user?.tenant_id) {
          navigate(PATHS.dashboard(user.tenant_id), { replace: true });
        } else {
          setError('Authentication failed. Please try again.');
        }
      });
    } else {
      setError('Missing authorization code.');
    }
  }, [searchParams, handleGoogleCallback, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f11] text-white">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">{error}</h1>
          <button
            onClick={() => navigate(PATHS.login)}
            className="px-4 py-2 bg-white text-void rounded font-bold"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f11] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-acid border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white/50 animate-pulse">Authenticating with Google...</p>
      </div>
    </div>
  );
};

// ─── App with Router ─────────────────────────────────────────────────────────
function App() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // 2. Plan-based redirect: if logged in but on the FREE plan (no paid plan yet), 
  // redirect from dashboard overview to pricing.
  // ── Legacy Plan Redirect Removed ───────────────────────────────────
  // Trial enforcement is now handled within DashboardLayout using TrialExpiredOverlay.
  // ───────────────────────────────────────────────────────────────────

  // On app load: if tokens exist but user isn't fetched, validate session
  useEffect(() => {
    if (accessToken && !user) {
      fetchMe().catch(() => {
        // Session invalid - interceptor handles logout
      });
    }
  }, [accessToken, user, fetchMe]);

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
        <Route path={PATHS.googleCallback} element={<GoogleCallback />} />

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
