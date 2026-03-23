import React, { useState } from 'react';
import {
  Home, Box, Cpu, LineChart, RefreshCw,
  ClipboardList, AlertTriangle, Settings,
  BarChart3, Bell, Search,
  ChevronLeft, ChevronRight, User
} from 'lucide-react';

// Dashboard views
import PharmacistView from './PharmacistView';
import InventoryView from './InventoryView';
import AIAgentsView from './AIAgentsView';
import OrdersView from './OrdersView';
import AlertsView from './AlertsView';
import SettingsView from './SettingsView';
import NLQueryTerminal from './NLQueryTerminal';

const VIEWS = {
  overview: PharmacistView,
  inventory: InventoryView,
  agents: AIAgentsView,
  orders: OrdersView,
  alerts: AlertsView,
  settings: SettingsView,
};

const DashboardLayout = ({ children, role = 'Pharmacist', onBack }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('overview');

  const menuItems = [
    { icon: Home, label: 'Overview', id: 'overview' },
    { icon: Box, label: 'Inventory', id: 'inventory' },
    { icon: Cpu, label: 'AI Agents', id: 'agents', badge: 3 },
    { icon: LineChart, label: 'Forecasting', id: 'forecasting', disabled: true },
    { icon: RefreshCw, label: 'Redistribution', id: 'redistribution', disabled: true },
    { icon: ClipboardList, label: 'Orders', id: 'orders' },
    { icon: AlertTriangle, label: 'Alerts', id: 'alerts', badge: 12, badgeColor: 'bg-danger/20 text-danger' },
    { icon: BarChart3, label: 'Analytics', id: 'analytics', disabled: true },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  const ActiveView = VIEWS[activePage] || PharmacistView;

  return (
    <div className="flex h-screen bg-void text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${isCollapsed ? 'w-20' : 'w-64'} bg-navy border-r border-white/5 flex flex-col transition-all duration-300 z-30`}
      >
        <div className="h-14 flex items-center px-6 border-b border-white/5 gap-3">
          <div className="w-2 h-2 rounded-full bg-acid shadow-[0_0_10px_rgba(232,245,50,0.5)] flex-shrink-0"></div>
          {!isCollapsed && <span className="font-bold tracking-tight">CherriPlus</span>}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => !item.disabled && setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${isActive
                    ? 'bg-acid/10 text-acid border-l-[3px] border-acid rounded-l-none'
                    : item.disabled
                      ? 'text-white/20 cursor-not-allowed opacity-60'
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <item.icon size={20} className={isActive ? 'text-acid' : ''} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">
                    {item.label}
                    {item.disabled && (
                      <sup className="text-[8px] font-bold text-acid/90 uppercase tracking-widest animate-pulse ml-1">
                        soon
                      </sup>
                    )}
                  </span>
                )}
                {item.badge && !isCollapsed && (
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded ${item.badgeColor || 'bg-acid/20 text-acid'}`}>
                    {item.badge}
                  </span>
                )}
                {isCollapsed && (
                  <div className="absolute left-16 bg-navy border border-white/10 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-acid/30 to-acid/60 flex items-center justify-center shrink-0">
              <User size={16} className="text-void" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 truncate">
                <p className="text-xs font-bold text-white leading-none mb-1">Priya K.</p>
                <p className="text-[10px] text-white/40 leading-none">{role}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-md text-white/40 hover:text-white transition-all"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-void/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="max-w-md w-full relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Global Search SKUs, Orders, Agents..."
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-acid/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {onBack && (
              <>
                <button onClick={onBack} className="text-xs font-bold text-white/40 hover:text-white transition-colors flex items-center gap-1">
                  <ChevronLeft size={14} /> Landing
                </button>
                <div className="h-6 w-px bg-white/10"></div>
              </>
            )}
            <button
              onClick={() => setActivePage('alerts')}
              className="relative text-white/50 hover:text-white transition-colors"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full ring-2 ring-void"></span>
            </button>
            <div className="h-6 w-px bg-white/10"></div>
            <button className="text-sm font-bold text-acid flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-acid animate-pulse"></div>
              Agent Live
            </button>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(circle_at_top_right,rgba(232,245,50,0.015)_0%,transparent_50%)] relative">
          {/* Render children (role switcher) if passed, otherwise show active page */}
          {children ? children : <ActiveView />}

          {/* NL Query Terminal — always floating */}
          <NLQueryTerminal />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
