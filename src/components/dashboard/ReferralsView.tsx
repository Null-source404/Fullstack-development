import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Users,
  ShoppingBag,
  DollarSign,
  UserPlus
} from 'lucide-react';
import { ReviewerAccount } from '../../types';

interface ReferralsViewProps {
  account: ReviewerAccount;
  onShowToast: (msg: string) => void;
}

export const ReferralsView: React.FC<ReferralsViewProps> = ({
  account,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const inviteUrl = account.referralLink || `https://coretaskpro.com/signup?ref=${account.inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    onShowToast('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Reviewer Referral Network
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          USD commissions credit directly to your available balance the moment a referred member's initial plan payment clears.
        </p>
      </div>

      {/* Your Invite Link Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0D7A6B]">
          <Share2 className="w-4 h-4" />
          <span>Your Dedicated Invite Link</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            readOnly
            value={inviteUrl}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs sm:text-sm font-mono text-slate-800 select-all focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#0F3460] hover:bg-[#0c2a4f] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy link'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed pt-1">
          Your unique code is <strong className="text-slate-800 font-mono">{account.inviteCode}</strong>. Commission is <strong>$1.55 USD</strong> for Regional & North America Priority passes, and <strong>$2.70 USD</strong> for the Global Unlimited pass — credited in USD once per qualified member.
        </p>
      </div>

      {/* 3 Metric Cards in USD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Members invited */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Members invited</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {account.referredMembers.length}
            </span>
          </div>
        </div>

        {/* Bought a plan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Subscribed members</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {account.referredMembers.filter((m) => m.hasPurchasedPlan).length}
            </span>
          </div>
        </div>

        {/* Commission earned */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">USD Commission earned</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ${account.referralCommission.toFixed(2)} USD
            </span>
          </div>
        </div>

      </div>

      {/* Referred Members List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">
          Referred Reviewers
        </h3>

        {account.referredMembers.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-2xl py-12 px-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <UserPlus className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">
              No referred reviewers yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Share your invite link with patrons who regularly patronize local dining, auto, or salon establishments.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {account.referredMembers.map((member) => (
              <div
                key={member.id}
                className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{member.name}</span>
                  <span className="text-slate-400 ml-2">({member.emailMasked})</span>
                  <span className="text-[11px] text-slate-500 block">Registered {member.joinedDate}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 block">
                    +${member.commissionEarned.toFixed(2)} USD
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {member.hasPurchasedPlan ? member.planPurchased : 'Pending subscription'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
