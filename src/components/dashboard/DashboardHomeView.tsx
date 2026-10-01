import React from 'react';
import {
  Wallet,
  Coins,
  Users,
  Banknote,
  ClipboardList,
  Hourglass,
  ArrowRight,
  UserPlus,
  ArrowUpRight,
  Star,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ReviewerAccount, DashboardTab } from '../../types';

interface DashboardHomeViewProps {
  account: ReviewerAccount;
  onNavigateTab: (tab: DashboardTab) => void;
  onOpenWithdraw: () => void;
  onOpenPlanCheckout: () => void;
}

export const DashboardHomeView: React.FC<DashboardHomeViewProps> = ({
  account,
  onNavigateTab,
  onOpenWithdraw,
  onOpenPlanCheckout,
}) => {
  const pendingAmount = account.submittedReviews
    .filter((r) => r.status === 'pending_moderation')
    .reduce((sum, r) => sum + r.reward, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {account.customerName.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Your earnings, review activity and plan status.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('tasks')}
          className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1a44bc] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Browse tasks</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Plan Status Banner */}
      {!account.isSubscribed ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Choose a plan to unlock tasks
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Each plan unlocks review tasks in specific countries. Activate via Pesapal USD and start earning immediately.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('plans')}
            className="px-4 py-2 bg-[#0F3460] hover:bg-[#0c2a4f] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            View plans
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="text-xs font-bold text-emerald-950 block">
                {account.activePlan?.title || 'Active Subscription'} Unlocked
              </span>
              <span className="text-[11px] text-emerald-800">
                Territory: {account.activePlan?.territory} · Instant Pesapal Payouts
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded-lg border border-emerald-200">
            Active
          </span>
        </div>
      )}

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Available Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Available balance</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ${account.walletBalance.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1 font-medium">
              Ready to withdraw
            </span>
          </div>
        </div>

        {/* Lifetime Earned */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Lifetime earned</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ${account.lifetimeEarned.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1 font-medium">
              All approved rewards
            </span>
          </div>
        </div>

        {/* Referral Commission */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Referral commission</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ${account.referralCommission.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1 font-medium">
              {account.referredMembers.length} members invited
            </span>
          </div>
        </div>

        {/* Withdrawn */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Withdrawn</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ${account.totalWithdrawn.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1 font-medium">
              Paid out to you
            </span>
          </div>
        </div>

      </div>

      {/* Split Row: Review Activity & Pending Rewards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Review Activity (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Review activity
            </h3>
            {account.submittedReviews.length > 0 && (
              <button
                onClick={() => onNavigateTab('my-reviews')}
                className="text-xs font-semibold text-[#1D4ED8] hover:underline"
              >
                See all
              </button>
            )}
          </div>

          {account.submittedReviews.length === 0 ? (
            /* Empty State matching screenshot */
            <div className="border border-dashed border-slate-200 rounded-2xl py-12 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                No reviews yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Pick a business you have genuinely visited and write your first review to start earning.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigateTab('tasks')}
                  className="px-4 py-2 bg-[#1D4ED8] hover:bg-[#1a44bc] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Find a task
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {account.submittedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rev.businessName}</span>
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="ml-1 text-[11px] font-semibold">{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">
                      "{rev.reviewText}"
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900 block">
                      +${rev.reward.toFixed(2)}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      rev.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {rev.status === 'approved' ? 'Approved' : 'Awaiting moderation'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Pending Rewards Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Pending rewards
          </h3>

          <div className="flex items-center gap-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Hourglass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                ${pendingAmount.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-500 block">
                Awaiting moderation
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Rewards move to your available balance as soon as a moderator approves the review.
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={onOpenWithdraw}
              className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Withdraw earnings
            </button>

            <button
              onClick={() => onNavigateTab('referrals')}
              className="w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>Invite and earn</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
