/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppView, DashboardTab, SubscriptionPlan, ReviewTask, ReviewerAccount, PesapalTransaction, SubmittedReview, SupportMessage } from './types';
import { SUBSCRIPTION_PLANS, AVAILABLE_TASKS, INITIAL_ACCOUNT } from './data/mockData';
import { auth, onAuthStateChanged, signOut, db, doc, getDoc } from './lib/firebase';
import { LandingPage } from './components/public/LandingPage';
import { AuthScreen } from './components/auth/AuthScreen';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHomeView } from './components/dashboard/DashboardHomeView';
import { AvailableTasksView } from './components/dashboard/AvailableTasksView';
import { MyReviewsView } from './components/dashboard/MyReviewsView';
import { EarningsView } from './components/dashboard/EarningsView';
import { ReferralsView } from './components/dashboard/ReferralsView';
import { PlansPaymentView } from './components/dashboard/PlansPaymentView';
import { ContactUsView } from './components/dashboard/ContactUsView';
import { PesapalCheckoutModal } from './components/PesapalCheckoutModal';
import { TaskModal } from './components/TaskModal';
import { InfoModal } from './components/InfoModals';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  // Current high-level view: 'landing' | 'login' | 'signup' | 'dashboard'
  const [appView, setAppView] = useState<AppView>('landing');
  
  // Dashboard active tab
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('dashboard');

  // Info modal state
  const [infoModalType, setInfoModalType] = useState<'how-it-works' | 'terms' | 'why-us' | 'guidelines' | 'privacy' | 'acceptable-use' | 'cookies' | null>(null);

  // Currency: USD / KES
  const [currency, setCurrency] = useState<'USD' | 'KES'>('USD');

  // Subscription Plans
  const [plans] = useState<SubscriptionPlan[]>(SUBSCRIPTION_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[1]); // Default to DCP 1.2

  // Review Tasks
  const [tasks, setTasks] = useState<ReviewTask[]>(AVAILABLE_TASKS);
  const [activeTaskModal, setActiveTaskModal] = useState<ReviewTask | null>(null);

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication notice & pending plan
  const [authBannerNotice, setAuthBannerNotice] = useState<string | null>(null);
  const [pendingPlanForCheckout, setPendingPlanForCheckout] = useState<SubscriptionPlan | null>(null);

  // Reviewer Account State (initialized to logged out so user must have account first)
  const [account, setAccount] = useState<ReviewerAccount>(INITIAL_ACCOUNT);

  // Sync Firebase Auth session on mount / changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Reviewer Member';
        let phone = firebaseUser.phoneNumber || '';
        let refCode = 'REF-' + firebaseUser.uid.substring(0, 6).toUpperCase();

        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            name = data.fullName || name;
            phone = data.phone || phone;
            refCode = data.referralCode || refCode;
          }
        } catch (err) {
          console.warn('Sync profile error:', err);
        }

        setAccount((prev) => ({
          ...prev,
          isLoggedIn: true,
          customerName: name,
          customerEmail: firebaseUser.email || '',
          customerPhone: phone || prev.customerPhone,
          inviteCode: refCode,
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Open Auth screen with optional banner and pending plan
  const handleOpenAuth = (
    mode: 'login' | 'signup',
    bannerNotice?: string,
    planToActivate?: SubscriptionPlan
  ) => {
    setAuthBannerNotice(bannerNotice || null);
    if (planToActivate) {
      setPendingPlanForCheckout(planToActivate);
      setSelectedPlan(planToActivate);
    }
    setAppView(mode);
  };

  // Open Checkout for a chosen plan (Requires account first!)
  const handleOpenCheckout = (plan?: SubscriptionPlan) => {
    const targetPlan = plan || selectedPlan;
    if (plan) {
      setSelectedPlan(plan);
    }

    if (!account.isLoggedIn) {
      handleOpenAuth(
        'signup',
        'The user should have an account first before accessing any service. Please create an account or sign in to continue.',
        targetPlan
      );
      return;
    }

    setIsCheckoutOpen(true);
  };

  // Payment completed callback from Pesapal 3.0 gateway
  const handlePaymentSuccess = (transaction: PesapalTransaction) => {
    const activatedPlan = plans.find((p) => p.id === transaction.planId) || selectedPlan;

    setAccount((prev) => ({
      ...prev,
      isSubscribed: true,
      activePlan: activatedPlan,
      pesapalTrackingId: transaction.trackingId,
      subscribedAt: new Date().toLocaleDateString(),
      customerPhone: transaction.phoneNumber || prev.customerPhone,
    }));

    showToast(`Pesapal payment verified! ${activatedPlan.title} activated successfully.`);
  };

  // Auth screen success (login/signup)
  const handleAuthSuccess = (accountData: Partial<ReviewerAccount>) => {
    setAccount((prev) => ({
      ...prev,
      ...accountData,
      isLoggedIn: true,
    }));
    setAppView('dashboard');
    showToast(`Welcome, ${accountData.customerName || account.customerName}!`);

    // If user clicked a plan before signing in, open checkout immediately
    if (pendingPlanForCheckout) {
      setSelectedPlan(pendingPlanForCheckout);
      setIsCheckoutOpen(true);
      setPendingPlanForCheckout(null);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out notice:', err);
    }
    setAccount({
      ...INITIAL_ACCOUNT,
      isLoggedIn: false,
    });
    setAppView('landing');
    showToast('Signed out of CoreTaskPro.');
  };

  // Submit Review
  const handleSubmitReview = (newReview: SubmittedReview) => {
    setAccount((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + newReview.reward,
      lifetimeEarned: prev.lifetimeEarned + newReview.reward,
      submittedReviews: [newReview, ...prev.submittedReviews],
    }));

    // Update available slots
    setTasks((prev) =>
      prev.map((t) =>
        t.id === newReview.taskId && t.slotsLeft > 0
          ? { ...t, slotsLeft: t.slotsLeft - 1 }
          : t
      )
    );

    showToast(`Review submitted for ${newReview.businessName}! $${newReview.reward.toFixed(2)} added.`);
  };

  // Request Withdrawal via Pesapal
  const handleRequestWithdrawal = (amountUsd: number, recipientAccount: string, method: string) => {
    setAccount((prev) => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - amountUsd),
      totalWithdrawn: prev.totalWithdrawn + amountUsd,
      withdrawals: [
        {
          id: `wd-${Date.now()}`,
          amountUsd,
          method,
          recipientAccount,
          status: 'completed',
          reference: `PESA-WD-${Math.floor(100000 + Math.random() * 900000)}`,
          date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev.withdrawals,
      ],
    }));
    showToast(`Withdrawal of $${amountUsd.toFixed(2)} USD sent via Pesapal to ${recipientAccount}!`);
  };

  // Send Contact Support Message
  const handleSendMessage = (msg: SupportMessage) => {
    setAccount((prev) => ({
      ...prev,
      messages: [...prev.messages, msg],
    }));
    if (msg.sender === 'user') {
      showToast('Support message dispatched. Reply will appear shortly.');
    }
  };

  return (
    <>
      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 bg-[#0F3460] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom duration-200 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-0.5 ml-auto cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* VIEW 1: PUBLIC LANDING PAGE */}
      {appView === 'landing' && (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onOpenCheckout={handleOpenCheckout}
          onGoToDashboard={() => setAppView('dashboard')}
          account={account}
          plans={plans}
        />
      )}

      {/* VIEW 2 & 3: SPLIT-LAYOUT AUTH (LOGIN OR SIGNUP) */}
      {(appView === 'login' || appView === 'signup') && (
        <AuthScreen
          initialMode={appView}
          bannerNotice={authBannerNotice}
          onBackToLanding={() => setAppView('landing')}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* VIEW 4: AUTHENTICATED DASHBOARD WITH COLLAPSIBLE SIDEBAR */}
      {appView === 'dashboard' && (
        <DashboardLayout
          currentTab={dashboardTab}
          onTabChange={(tab) => setDashboardTab(tab)}
          account={account}
          onSignOut={handleSignOut}
          onOpenPolicy={(type) => setInfoModalType(type)}
        >
          {dashboardTab === 'dashboard' && (
            <DashboardHomeView
              account={account}
              onNavigateTab={(tab) => setDashboardTab(tab)}
              onOpenWithdraw={() => setDashboardTab('earnings')}
              onOpenPlanCheckout={() => setDashboardTab('plans')}
            />
          )}

          {dashboardTab === 'tasks' && (
            <AvailableTasksView
              tasks={tasks}
              account={account}
              onSelectTask={(task) => setActiveTaskModal(task)}
              onOpenPlans={() => setDashboardTab('plans')}
            />
          )}

          {dashboardTab === 'my-reviews' && (
            <MyReviewsView
              account={account}
              onNavigateTab={(tab) => setDashboardTab(tab)}
            />
          )}

          {dashboardTab === 'earnings' && (
            <EarningsView
              account={account}
              onRequestWithdrawal={handleRequestWithdrawal}
            />
          )}

          {dashboardTab === 'referrals' && (
            <ReferralsView
              account={account}
              onShowToast={showToast}
            />
          )}

          {dashboardTab === 'plans' && (
            <PlansPaymentView
              plans={plans}
              account={account}
              onActivatePlan={(plan) => handleOpenCheckout(plan)}
            />
          )}

          {dashboardTab === 'contact' && (
            <ContactUsView
              account={account}
              onSendMessage={handleSendMessage}
            />
          )}
        </DashboardLayout>
      )}

      {/* Pesapal 3.0 Checkout Modal (M-Pesa STK push, Airtel, Card, Bank) */}
      <PesapalCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={selectedPlan}
        plans={plans}
        onSelectPlan={(plan) => setSelectedPlan(plan)}
        currency={currency}
        onPaymentSuccess={handlePaymentSuccess}
        account={account}
      />

      {/* Task Details & Review Submission Modal */}
      <TaskModal
        task={activeTaskModal}
        onClose={() => setActiveTaskModal(null)}
        account={account}
        onOpenCheckout={() => {
          setActiveTaskModal(null);
          setIsCheckoutOpen(true);
        }}
        onOpenGuidelines={() => setInfoModalType('guidelines')}
        onSubmitReview={handleSubmitReview}
      />

      {/* Cookie Transparency & Tracking Consent Banner */}
      <CookieConsentBanner
        onOpenPolicy={(type) => setInfoModalType(type)}
      />

      {/* Global Info Modal for Review Integrity Guidelines & Policies */}
      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
        onOpenAuth={(mode) => handleOpenAuth(mode)}
      />
    </>
  );
}
