import React, { useState } from 'react';
import {
  Globe,
  Check,
  ShieldCheck,
  Zap,
  Lock,
  CreditCard,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { SubscriptionPlan, ReviewerAccount } from '../../types';

interface PlansPaymentViewProps {
  plans: SubscriptionPlan[];
  account: ReviewerAccount;
  onActivatePlan: (plan: SubscriptionPlan) => void;
}

export const PlansPaymentView: React.FC<PlansPaymentViewProps> = ({
  plans,
  account,
  onActivatePlan,
}) => {
  const [selectedCountry, setSelectedCountry] = useState('United States (USD)');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Territory Plans & Payments
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your active plan determines which countries' business review pools you can claim. All subscriptions billed in USD.
        </p>
      </div>

      {/* Country Selector Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Reviewer Operating Country / Region
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your operating jurisdiction. Payouts and plan charges are processed in USD ($) via Pesapal.
          </p>
        </div>

        <div className="max-w-md">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0D7A6B] cursor-pointer"
          >
            <option value="United States (USD)">United States (USD)</option>
            <option value="Canada (USD)">Canada (USD)</option>
            <option value="Australia (USD)">Australia (USD)</option>
            <option value="New Zealand (USD)">New Zealand (USD)</option>
            <option value="United Kingdom (USD)">United Kingdom (USD)</option>
            <option value="International (USD)">International Worldwide (USD)</option>
          </select>
        </div>
      </div>

      {/* 3 Plan Cards (Strictly USD) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => {
          const isCurrentActive = account.isSubscribed && account.activePlan?.id === plan.id;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-6 border transition-all duration-150 flex flex-col justify-between shadow-2xs ${
                isCurrentActive
                  ? 'border-2 border-emerald-600 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                    {plan.code}
                  </span>
                  {isCurrentActive && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Active Tier
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-900 text-base">
                  {plan.title}
                </h3>

                <div className="mt-4 mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      ${plan.priceUsd.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">USD /mo</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-5">
                  {plan.description}
                </p>

                <div className="space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{plan.territory}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-emerald-700">
                    <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-600 shrink-0" />
                    <span>{plan.earningRate}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onActivatePlan(plan)}
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  isCurrentActive
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-[#0F3460] hover:bg-[#0c2a4f] text-white shadow-xs'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>{isCurrentActive ? 'Renew / Extend Tier' : 'Activate with Pesapal USD'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment History Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">
          Subscription Invoices & Receipts
        </h3>

        {account.isSubscribed && account.pesapalTrackingId ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 font-semibold">Date</th>
                  <th className="py-2.5 font-semibold">Tier Description</th>
                  <th className="py-2.5 font-semibold">Pesapal Gateway Ref</th>
                  <th className="py-2.5 font-semibold">Amount (USD)</th>
                  <th className="py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                <tr>
                  <td className="py-3">{account.subscribedAt || 'Today'}</td>
                  <td className="py-3 font-semibold text-slate-900">{account.activePlan?.title}</td>
                  <td className="py-3 font-mono text-[11px] text-slate-500">{account.pesapalTrackingId}</td>
                  <td className="py-3 font-bold text-slate-900">${account.activePlan?.priceUsd.toFixed(2)} USD</td>
                  <td className="py-3">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      SETTLED
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No active billing history. Activate a territory tier above to start reviewing verified establishments.
          </div>
        )}
      </div>

    </div>
  );
};
