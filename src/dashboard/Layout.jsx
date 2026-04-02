import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Home, Box, Cpu, LineChart, RefreshCw,
  ClipboardList, AlertTriangle, Settings, Sparkles,
  BarChart3, Bell, Search, Building2,
  ChevronLeft, ChevronRight, User, Users, LogOut, CreditCard
} from 'lucide-react';

import { PATHS } from '../routes/paths';
import { useAuthStore } from '../stores/authStore';
import { useUiStore } from '../stores/uiStore';

import NLQueryTerminal from './NLQueryTerminal';
import MobileRestriction from './components/MobileRestriction';
const DashboardLayout = () => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { tenantId } = useParams();

  const unreadAlertsCount = useUiStore((s) => s.unreadAlertsCount);

  const menuItems = [
    { icon: Home, label: t('dashboard.sidebar.overview'), path: PATHS.dashboard(tenantId), end: true },
    { icon: Box, label: t('dashboard.sidebar.inventory'), path: PATHS.inventory(tenantId) },
    { icon: ClipboardList, label: t('dashboard.sidebar.orders'), path: PATHS.orders(tenantId) },
    { icon: Building2, label: 'Suppliers', path: PATHS.suppliers(tenantId) },
    { icon: AlertTriangle, label: t('dashboard.sidebar.alerts'), path: PATHS.alerts(tenantId), badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined, badgeColor: 'bg-danger/20 text-danger' },
    { icon: Sparkles, label: t('dashboard.sidebar.agents'), path: PATHS.agents(tenantId) },
    { icon: RefreshCw, label: t('dashboard.sidebar.redistribution'), path: PATHS.redistributions(tenantId) },
    { icon: Users, label: 'Team', path: PATHS.users(tenantId) },
    { icon: CreditCard, label: t('dashboard.sidebar.billing'), path: PATHS.billing(tenantId) },
    { icon: Settings, label: t('dashboard.sidebar.settings'), path: PATHS.settings(tenantId) },
    { icon: LineChart, label: t('dashboard.sidebar.forecasting'), path: null, disabled: true },
  ];
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    navigate(PATHS.login, { replace: true });
  };

  return (
    <div className="flex h-screen bg-void text-white overflow-hidden relative">
      {/* Mobile Restriction Screen */}
      <MobileRestriction />

      {/* Sidebar */}
      <aside
        className={`${isCollapsed ? 'md:w-20' : 'lg:w-64 md:w-20 w-0'} bg-navy border-r border-white/5 flex flex-col transition-all duration-300 z-30 md:flex hidden`}
      >
        <div className="h-14 flex items-center px-4 border-b border-white/5 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-2 h-2 rounded-full bg-acid shadow-[0_0_10px_rgba(232,245,50,0.5)] flex-shrink-0"></div>
            {!isCollapsed && (
              <span className="font-bold tracking-tight lg:inline hidden">Cherri+</span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-white/5 rounded-md text-white/40 hover:text-white transition-all"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.disabled || !item.path) {
              return (
                <button
                  key={item.label}
                  disabled
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/20 cursor-not-allowed opacity-60"
                >
                  <item.icon size={20} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium lg:inline hidden">
                      {item.label}
                      <sup className="text-[8px] font-bold text-acid/90 uppercase tracking-widest animate-pulse ml-1">
                        {t('dashboard.sidebar.soon')}
                      </sup>
                    </span>
                  )}
                </button>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${isActive
                    ? 'bg-acid/10 text-acid border-l-[3px] border-acid rounded-l-none'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={20} className={isActive ? 'text-acid' : ''} />
                    {!isCollapsed && (
                      <span className="text-sm font-medium lg:inline hidden">
                        {item.label}
                      </span>
                    )}
                    {item.badge && !isCollapsed && (
                      <span
                        className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded lg:inline hidden ${item.badgeColor || 'bg-acid/20 text-acid'
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isCollapsed && (
                      <div className="absolute left-16 bg-navy border border-white/10 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Admin Only: Team Management */}
          {/* {(user?.role?.toUpperCase() === 'ADMIN' || user?.role?.toUpperCase() === 'MANAGER') && (
            <NavLink
              to={PATHS.users}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${isActive
                  ? 'bg-acid/10 text-acid border-l-[3px] border-acid rounded-l-none'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Users size={20} />
              {!isCollapsed && <span className="text-sm font-medium lg:inline hidden">Team</span>}
            </NavLink>
          )} */}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/40 hover:bg-danger/10 hover:text-danger transition-all ${isCollapsed ? 'justify-center' : ''}`}
            title={t('dashboard.sidebar.logout')}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="text-sm font-medium lg:inline hidden">{t('dashboard.sidebar.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-void/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="max-w-md w-full relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder={t('dashboard.topbar.search_placeholder')}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-acid/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <NavLink
              to={PATHS.alerts(tenantId)}
              className="relative text-white/50 hover:text-white transition-colors"
            >
              <Bell size={20} />
              {unreadAlertsCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full ring-2 ring-void"></span>}
            </NavLink>
            <div className="h-6 w-px bg-white/10"></div>
            <button className="text-sm font-bold text-acid flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-acid animate-pulse"></div>
              <span className="hidden md:inline">{t('dashboard.topbar.agent_live')}</span>
            </button>

            {/* User Profile - Global Topbar */}
            <div className="flex items-center gap-3  px-4 py-2">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-bold text-white leading-none mb-1">
                  {user?.first_name || 'Pharmacist'} {user?.last_name || ''}
                </p>
                <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest leading-none">
                  {user?.role || 'User'}
                </p>
              </div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-acid/30 to-acid/60 flex items-center justify-center border border-white/10 shrink-0">
                <User className="text-void" size={14} />
              </div>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[radial-gradient(circle_at_top_right,rgba(232,245,50,0.015)_0%,transparent_50%)] relative">
          <Outlet />

          {/* NL Query Terminal — always floating */}
          <NLQueryTerminal />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
