import React, { useState } from 'react';
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  UserPlus,
  CreditCard,
  Star,
  Banknote,
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { SubscriptionPlan, ReviewerAccount } from '../../types';
import { InfoModal } from '../InfoModals';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup', bannerNotice?: string, planToActivate?: SubscriptionPlan) => void;
  onOpenCheckout: (plan: SubscriptionPlan) => void;
  onGoToDashboard: () => void;
  account: ReviewerAccount;
  plans: SubscriptionPlan[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onOpenCheckout,
  onGoToDashboard,
  account,
  plans,
}) => {
  const [activeModal, setActiveModal] = useState<'how-it-works' | 'terms' | 'why-us' | 'guidelines' | 'privacy' | 'acceptable-use' | 'cookies' | null>(null);

  // When clicking any service action (e.g. Plan or Task or Claim):
  // User must have an account first before accessing any service!
  const handleProtectedServiceAction = (plan?: SubscriptionPlan, serviceName: string = 'this service') => {
    if (account.isLoggedIn) {
      if (plan) {
        onOpenCheckout(plan);
      } else {
        onGoToDashboard();
      }
    } else {
      onOpenAuth(
        'signup',
        `Please create a free account or sign in first before accessing ${serviceName}.`,
        plan
      );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#0d7665]/20 selection:text-[#0d7665]">
      
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0d7665] flex items-center justify-center text-white shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                CoreTaskPro
              </span>
            </a>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
              <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
                How it works
              </a>
              <a href="#plans" className="hover:text-slate-900 transition-colors">
                Plans
              </a>
              <a href="#why-us" className="hover:text-slate-900 transition-colors">
                Why us
              </a>
              <button 
                onClick={() => setActiveModal('terms')} 
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Terms
              </button>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {account.isLoggedIn ? (
                <>
                  <button
                    onClick={onGoToDashboard}
                    className="text-sm font-semibold text-slate-800 hover:text-slate-950 px-3 py-2 cursor-pointer"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={onGoToDashboard}
                    className="bg-[#0d7665] hover:bg-[#0a5c4e] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    Open Workspace
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="text-sm font-semibold text-slate-800 hover:text-slate-950 px-3 py-2 transition-colors cursor-pointer"
                  >
                    Sign in
                  </button>

                  <button
                    onClick={() => onOpenAuth('signup', 'Create your account first to access review tasks and start earning.')}
                    className="bg-[#0d7665] hover:bg-[#0a5c4e] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-xs hover:shadow transition-all duration-150 cursor-pointer active:scale-95"
                  >
                    Start earning
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Green bullet pill matching screenshot */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Paying reviewers since 2024</span>
              </div>

              {/* Exact Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Write honest reviews.<br />
                <span className="text-[#1d4ed8]">Get paid</span> for every one.
              </h1>

              {/* Exact Subhead paragraph */}
              <p className="text-slate-600 text-base sm:text-[17px] leading-relaxed max-w-xl">
                CoreTaskPro connects local businesses with real customers. Share your genuine firsthand experience and earn <strong className="font-bold text-slate-900">$2–$6</strong> per approved review — paid straight via Pesapal.
              </p>

              {/* 3 Checkmark bullets */}
              <div className="space-y-2.5 text-sm text-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>No experience required</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Paid via Pesapal</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Reviews moderated in 24–48 hrs</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-3 leading-normal">
                Fabricated reviews are rejected and repeat violations result in account termination.
              </p>

            </div>

            {/* Right Column: Hero Floating Card */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end pt-6 lg:pt-0">
              
              {/* Floating Top Badge: "This month $620k+ paid" */}
              <div className="absolute -top-2 right-0 sm:right-2 z-20 bg-white rounded-2xl shadow-lg border border-slate-100 px-4 py-2 text-right">
                <span className="text-[11px] text-slate-400 block font-normal leading-tight">This month</span>
                <span className="text-base font-extrabold text-slate-900">$620k+ paid</span>
              </div>

              {/* Main Visual Card */}
              <div 
                onClick={() => handleProtectedServiceAction(undefined, 'Harborview task claiming')}
                className="w-full max-w-[390px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative cursor-pointer group transition-transform hover:-translate-y-0.5"
                title="Click to view task details (requires reviewer account)"
              >
                {/* Dark teal card header */}
                <div className="bg-[#083a38] text-white p-5 sm:p-6 relative">
                  <span className="text-[10px] font-bold tracking-wider text-teal-300 uppercase bg-teal-900/80 px-2.5 py-0.5 rounded">
                    ACTIVE TASK
                  </span>

                  <h3 className="text-xl font-bold text-white mt-1.5 group-hover:text-teal-200 transition-colors">
                    Harborview Café & Bar
                  </h3>
                  <p className="text-xs text-teal-200/80 mt-0.5">
                    San Francisco, CA · United States
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Reward per review</span>
                      <span className="text-3xl font-extrabold text-slate-900">
                        $5.00
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">Slots left</span>
                      <span className="text-base font-bold text-slate-900">
                        8 / 20
                      </span>
                    </div>
                  </div>

                  {/* Pills */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                      Café
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                      Dining
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                      Local
                    </span>
                  </div>

                  {/* Reviewers avatars row */}
                  <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                    <div className="flex -space-x-1.5">
                      <div className="w-5 h-5 rounded-full bg-blue-500 border border-white" />
                      <div className="w-5 h-5 rounded-full bg-purple-500 border border-white" />
                      <div className="w-5 h-5 rounded-full bg-teal-500 border border-white" />
                    </div>
                    <span>24 reviewers earning this week</span>
                  </div>
                </div>
              </div>

              {/* Floating Bottom Badge: "PayPal payout sent +$5.00 received" */}
              <div className="absolute -bottom-4 left-0 sm:left-4 z-20 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 px-4 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block leading-tight">Pesapal payout sent</span>
                  <span className="text-xs font-bold text-emerald-600">+$5.00 received</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-[#fbfcfd] border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="mb-12">
            <span className="text-xs font-bold tracking-wider text-[#0d7665] uppercase block">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              From sign-up to first payout — four steps
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
              CoreTaskPro is built to get you earning as quickly as possible, with no complicated setup.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 01 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-light text-slate-300">01</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                  Create a free account
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sign up in under 2 minutes. No prior experience needed — just your genuine opinions about places you've visited.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-light text-slate-300">02</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                  Pick a plan for your region
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Each plan unlocks review tasks in specific countries. Pay securely via Pesapal and activate your account instantly.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-light text-slate-300">03</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                  Write genuine reviews
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Browse available tasks, pick businesses you've actually visited, and share your real firsthand experience.
                </p>
              </div>
            </div>

            {/* Step 04 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-light text-slate-300">04</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                  Earn per approved review
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Once a moderator approves your review, $2–$6 moves to your balance. Withdraw via Pesapal anytime.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SUBSCRIPTION PLANS SECTION */}
      <section id="plans" className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#0d7665] uppercase block">
                SUBSCRIPTION PLANS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Choose your earning territory
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                Each plan unlocks review tasks in specific regions. Pay with Pesapal and start earning the same day.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/70 self-start md:self-auto">
              <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
              <span>Activates instantly after payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Card 1: Regional Access (Starter) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <span className="inline-block text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md">
                  Starter
                </span>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">Regional Access</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Best for getting started</p>
                </div>

                <div className="flex items-baseline gap-1 py-1">
                  <span className="text-3xl font-extrabold text-slate-900">$2.70</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>

                <p className="text-xs text-slate-600">
                  Unlock review tasks in Australia and New Zealand.
                </p>

                <div className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Australia, New Zealand</span>
                </div>

                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 pt-1">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>$2–$5 per approved review</span>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Instant activation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Pesapal payouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Email support</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleProtectedServiceAction(plans[0], 'Starter Plan')}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Get started
                </button>
              </div>
            </div>

            {/* Card 2: North America (MOST POPULAR) */}
            <div className="bg-white rounded-2xl border-2 border-[#0d7665] flex flex-col justify-between shadow-xl relative overflow-hidden">
              {/* Ribbon Header */}
              <div className="bg-[#0d7665] text-white text-center text-xs font-bold py-1.5 uppercase tracking-wider">
                MOST POPULAR
              </div>

              <div className="p-6 space-y-4">
                <span className="inline-block text-xs font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                  Popular
                </span>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">North America</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Highest task volume</p>
                </div>

                <div className="flex items-baseline gap-1 py-1">
                  <span className="text-3xl font-extrabold text-slate-900">$2.70</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>

                <p className="text-xs text-slate-600">
                  Access the largest pool of review tasks in the US and Canada.
                </p>

                <div className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>United States, Canada</span>
                </div>

                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 pt-1">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>$2–$6 per approved review</span>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Instant activation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Pesapal payouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Priority support</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => handleProtectedServiceAction(plans[1], 'North America Priority Plan')}
                  className="w-full py-2.5 rounded-xl bg-[#0d7665] hover:bg-[#0a5c4e] text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  Get started
                </button>
              </div>
            </div>

            {/* Card 3: All Countries (Global) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <span className="inline-block text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md">
                  Global
                </span>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">All Countries</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Maximum earning potential</p>
                </div>

                <div className="flex items-baseline gap-1 py-1">
                  <span className="text-3xl font-extrabold text-slate-900">$3.50</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>

                <p className="text-xs text-slate-600">
                  Full access to every supported country and the highest reward tiers.
                </p>

                <div className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>All supported countries</span>
                </div>

                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 pt-1">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>$3–$6 per approved review</span>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Instant activation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Pesapal payouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Dedicated support</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleProtectedServiceAction(plans[2], 'All Countries Global Plan')}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Get started
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. GRADIENT METRICS BANNER */}
      <section className="bg-gradient-to-r from-[#006e5b] via-[#0b5f7e] to-[#254db0] text-white py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-white block tracking-tight">
                24,800+
              </span>
              <span className="text-xs sm:text-sm text-teal-100 mt-1 block font-medium">
                Active reviewers
              </span>
            </div>

            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-white block tracking-tight">
                187,000+
              </span>
              <span className="text-xs sm:text-sm text-teal-100 mt-1 block font-medium">
                Reviews approved
              </span>
            </div>

            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-white block tracking-tight">
                $620,000+
              </span>
              <span className="text-xs sm:text-sm text-teal-100 mt-1 block font-medium">
                Total paid out
              </span>
            </div>

            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-white block tracking-tight">
                12
              </span>
              <span className="text-xs sm:text-sm text-teal-100 mt-1 block font-medium">
                Countries supported
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY THOUSANDS OF REVIEWERS CHOOSE CORETASKPRO */}
      <section id="why-us" className="py-16 sm:py-20 bg-[#fbfcfd]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Why thousands of reviewers choose CoreTaskPro
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Built on transparency, fast payouts, and a genuine community of reviewers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Verified businesses only
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Every task on CoreTaskPro is a real, verified local business — no fake listings, no spam.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Fast moderation
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Most reviews are moderated within 24–48 hours. Approved rewards hit your balance immediately.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Genuine reviews only
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  We use advanced detection to ensure every review describes a real firsthand visit. Quality earns more.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Multiple countries
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Earn from businesses in Australia, New Zealand, USA, Canada and more — all from one account.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. DARK FOOTER */}
      <footer className="bg-[#070e18] text-slate-400 pt-16 pb-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
            
            {/* Left Brand Col */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#0d7665] flex items-center justify-center text-white">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">
                  CoreTaskPro
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                CoreTaskPro connects real customers with local businesses. Earn $2–$6 for every genuine review you write about places you've actually visited.
              </p>

              <div className="pt-1">
                <span className="inline-block text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-full">
                  Payments via Pesapal
                </span>
              </div>
            </div>

            {/* PLATFORM Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                PLATFORM
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#plans" className="hover:text-white transition-colors">
                    Subscription plans
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => handleProtectedServiceAction(undefined, 'Referral Program')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Referral program
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('guidelines')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Review guidelines
                  </button>
                </li>
              </ul>
            </div>

            {/* LEGAL Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                LEGAL
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <button 
                    onClick={() => setActiveModal('terms')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Terms of service
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('privacy')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Privacy policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('acceptable-use')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Acceptable use
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('cookies')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Cookie policy
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 CoreTaskPro. All rights reserved.</p>
            <p>Payments processed via Pesapal · USD pricing</p>
          </div>
        </div>
      </footer>

      {/* Info Modals */}
      <InfoModal
        type={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenAuth={(mode) => onOpenAuth(mode)}
      />

    </div>
  );
};
