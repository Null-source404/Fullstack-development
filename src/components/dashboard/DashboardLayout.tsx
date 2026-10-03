import React, { useState } from 'react';
import {
  LayoutDashboard,
  ListTodo,
  Star,
  Wallet,
  Users,
  CreditCard,
  Mail,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Check,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { DashboardTab, ReviewerAccount } from '../../types';

interface DashboardLayoutProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  account: ReviewerAccount;
  onSignOut: () => void;
  onOpenPolicy?: (type: 'how-it-works' | 'terms' | 'why-us' | 'guidelines' | 'privacy' | 'acceptable-use' | 'cookies') => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onTabChange,
  account,
  onSignOut,
  onOpenPolicy,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems: { tab: DashboardTab; label: string; icon: React.ElementType }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { tab: 'tasks', label: 'Available tasks', icon: ListTodo },
    { tab: 'my-reviews', label: 'My reviews', icon: Star },
    { tab: 'earnings', label: 'Earnings', icon: Wallet },
    { tab: 'referrals', label: 'Referrals', icon: Users },
    { tab: 'plans', label: 'Plans & payment', icon: CreditCard },
    { tab: 'contact', label: 'Contact us', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0D7A6B] flex items-center justify-center text-white">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            Core<span className="text-[#0D7A6B]">Task</span> Pro
          </span>
        </div>

        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside
          className={`bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-200 z-20 ${
            // Mobile drawer positioning
            mobileDrawerOpen
              ? 'fixed inset-y-0 left-0 w-72 shadow-2xl z-50 flex'
              : 'hidden lg:flex'
          } ${
            // Desktop collapsed rail vs full width
            isCollapsed ? 'lg:w-20' : 'lg:w-64'
          }`}
        >
          {/* Top Brand & Collapse Toggle */}
          <div>
            <div className="p-5 flex items-center justify-between border-b border-slate-100">
              <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                <div className="w-8 h-8 rounded-xl bg-[#0D7A6B] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                {!isCollapsed && (
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    Core<span className="text-[#0D7A6B]">Task</span> Pro
                  </span>
                )}
              </div>

              {!isCollapsed && (
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* If collapsed, small expand button */}
            {isCollapsed && (
              <div className="hidden lg:flex justify-center py-2 border-b border-slate-100">
                <button
                  onClick={() => setIsCollapsed(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  title="Expand sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Navigation Items */}
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.tab;

                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      onTabChange(item.tab);
                      setMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#1D4ED8] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Profile & Sign Out at Bottom */}
          <div className="p-4 border-t border-slate-100 space-y-3">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                {account.customerName.charAt(0) || 'N'}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {account.customerName}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {account.isSubscribed
                      ? `${account.activePlan?.code || 'Active'} Plan`
                      : 'No active plan'}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={onSignOut}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer ${
                isCollapsed ? 'px-0' : ''
              }`}
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              {!isCollapsed && <span>Sign out</span>}
            </button>
          </div>

        </aside>

        {/* Mobile backdrop */}
        {mobileDrawerOpen && (
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
          />
        )}

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>

          <footer className="max-w-6xl mx-auto w-full pt-8 mt-12 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <p>© 2026 CoreTaskPro. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenPolicy?.('privacy')}
                className="hover:text-slate-700 underline cursor-pointer"
              >
                Privacy
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onOpenPolicy?.('cookies')}
                className="hover:text-slate-700 underline cursor-pointer"
              >
                Cookies
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onOpenPolicy?.('acceptable-use')}
                className="hover:text-slate-700 underline cursor-pointer"
              >
                Acceptable Use
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onOpenPolicy?.('guidelines')}
                className="hover:text-slate-700 underline cursor-pointer"
              >
                Guidelines
              </button>
            </div>
          </footer>
        </main>

      </div>
    </div>
  );
};
