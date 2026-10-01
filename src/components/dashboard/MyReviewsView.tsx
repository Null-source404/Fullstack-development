import React, { useState } from 'react';
import {
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { ReviewerAccount, DashboardTab } from '../../types';

interface MyReviewsViewProps {
  account: ReviewerAccount;
  onNavigateTab: (tab: DashboardTab) => void;
}

export const MyReviewsView: React.FC<MyReviewsViewProps> = ({
  account,
  onNavigateTab,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const filteredReviews = account.submittedReviews.filter((r) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending') return r.status === 'pending_moderation';
    if (activeFilter === 'Approved') return r.status === 'approved';
    if (activeFilter === 'Rejected') return r.status === 'rejected';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My reviews
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rewards are credited as soon as a moderator approves your review.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('tasks')}
          className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1a44bc] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Write another</span>
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Reviews take at most 4 business days to be checked.
      </p>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl w-fit text-xs font-semibold">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeFilter === tab
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content: Empty State vs Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="border border-dashed border-slate-300 rounded-3xl py-16 px-6 text-center space-y-4 bg-white">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Star className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              You have not written a review yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Claim a task for a business you have genuinely visited and your review will appear here.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('tasks')}
              className="px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1a44bc] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Browse tasks
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {rev.businessName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{rev.rating}.0</span>
                    <span className="text-xs text-slate-400">· Visit date: {rev.visitDate}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-lg font-extrabold text-slate-900 block">
                    +${rev.reward.toFixed(2)}
                  </span>
                  <span
                    className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      rev.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rev.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {rev.status === 'approved' ? 'Approved & Credited' : 'Under Moderation'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                "{rev.reviewText}"
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Submitted {rev.submittedAt}</span>
                <span>Review ID: {rev.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
