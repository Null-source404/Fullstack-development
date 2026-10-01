import React, { useState } from 'react';
import {
  Wallet,
  Hourglass,
  Coins,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
  CreditCard
} from 'lucide-react';
import { ReviewerAccount } from '../../types';

interface EarningsViewProps {
  account: ReviewerAccount;
  onRequestWithdrawal: (amountUsd: number, phone: string, method: string) => void;
}

export const EarningsView: React.FC<EarningsViewProps> = ({
  account,
  onRequestWithdrawal,
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState<string>(
    account.walletBalance > 0 ? account.walletBalance.toString() : '0.00'
  );
  const [payoutMethod, setPayoutMethod] = useState('Pesapal Direct Card');
  const [recipientAccount, setRecipientAccount] = useState(account.customerEmail || 'newton@coretaskpro.com');
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const pendingAmount = account.submittedReviews
    .filter((r) => r.status === 'pending_moderation')
    .reduce((sum, r) => sum + r.reward, 0);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const num = parseFloat(withdrawAmount);
    if (isNaN(num) || num <= 0) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid withdrawal amount greater than $0.00 USD' });
      return;
    }

    if (num > account.walletBalance) {
      setStatusMsg({
        type: 'error',
        text: `Insufficient balance. You currently have $${account.walletBalance.toFixed(2)} USD ready to request. Complete review tasks to earn additional USD rewards.`,
      });
      return;
    }

    onRequestWithdrawal(num, recipientAccount, payoutMethod);
    setStatusMsg({
      type: 'success',
      text: `Withdrawal request of $${num.toFixed(2)} USD submitted to ${payoutMethod} (${recipientAccount}) via Pesapal! Payouts process within 2–4 hours.`,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Earnings & USD Withdrawals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Approved review rewards and referral commissions are paid directly in USD from your available balance.
        </p>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Available */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Available USD</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ${account.walletBalance.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1 font-medium">
              ${account.walletBalance.toFixed(2)} USD free to withdraw
            </span>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending reviews</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ${pendingAmount.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1 font-medium">
              Credited in USD on approval
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
              Total USD earned to date
            </span>
          </div>
        </div>

        {/* Withdrawn */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Withdrawn USD</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ${account.totalWithdrawn.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1 font-medium">
              Paid out via Pesapal
            </span>
          </div>
        </div>

      </div>

      {/* Main Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Request a withdrawal Form */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">
            Request USD Withdrawal
          </h3>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Amount (USD $)
              </label>
              <input
                type="number"
                step="0.01"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:border-[#0D7A6B]"
              />
              <button
                type="button"
                onClick={() => setWithdrawAmount(account.walletBalance.toFixed(2))}
                className="text-xs text-[#0D7A6B] hover:underline mt-1 font-semibold cursor-pointer"
              >
                Withdraw full available balance (${account.walletBalance.toFixed(2)} USD)
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Payout Channel
              </label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#0D7A6B] cursor-pointer"
              >
                <option value="Pesapal Direct Card">Pesapal Direct Card / Bank Payout (USD)</option>
                <option value="Pesapal Mobile Wallet">Pesapal Mobile Wallet (M-Pesa / Airtel Money)</option>
                <option value="International Wire">International Bank Wire (ACH / Swift)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Recipient Email / Account Identifier
              </label>
              <input
                type="text"
                value={recipientAccount}
                onChange={(e) => setRecipientAccount(e.target.value)}
                placeholder="account@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0D7A6B]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0F3460] hover:bg-[#0c2a4f] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              Submit USD Withdrawal
            </button>
          </form>

          {statusMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                statusMsg.type === 'error'
                  ? 'bg-amber-50 border border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              }`}
            >
              {statusMsg.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-bold block">
                  {statusMsg.type === 'error' ? 'Insufficient balance' : 'Request Transmitted'}
                </span>
                <p>{statusMsg.text}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Withdrawal History & Recent Activity */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              USD Withdrawal History
            </h3>

            {account.withdrawals.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-2xl py-10 px-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Banknote className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                  No withdrawals recorded yet
                </h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Your USD payout requests and batch clearances will display here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {account.withdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">
                        ${w.amountUsd.toFixed(2)} USD to {w.method}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {w.recipientAccount} · Ref: {w.reference}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        {w.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {w.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Recent USD Activity
            </h3>
            <div className="text-xs text-slate-400">
              {account.submittedReviews.length > 0 ? (
                <div className="space-y-2">
                  {account.submittedReviews.slice(0, 3).map((r) => (
                    <div key={r.id} className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">Review: {r.businessName}</span>
                      <span className="font-bold text-[#0D7A6B]">+${r.reward.toFixed(2)} USD</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px]">No activity in the last 30 days.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
