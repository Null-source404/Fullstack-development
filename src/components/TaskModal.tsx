import React, { useState } from 'react';
import { X, Star, DollarSign, MapPin, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { ReviewTask, ReviewerAccount, SubmittedReview } from '../types';

interface TaskModalProps {
  task: ReviewTask | null;
  onClose: () => void;
  account: ReviewerAccount;
  onOpenCheckout: () => void;
  onSubmitReview: (review: SubmittedReview) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  onClose,
  account,
  onOpenCheckout,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState(5);
  const [visitDate, setVisitDate] = useState('2026-09-24');
  const [reviewText, setReviewText] = useState(
    'Had a wonderful Sunday brunch at Harborview. The waterfront views of the Bay Bridge were spectacular, and the dim sum items were fresh and delicate. Service was prompt and friendly despite the weekend rush. Highly recommend their shrimp dumplings and egg tarts!'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!task) return null;

  const wordCount = reviewText.trim() ? reviewText.trim().split(/\s+/).length : 0;
  const isSatisfiedWordCount = wordCount >= 30;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account.isSubscribed) {
      onOpenCheckout();
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      const newReview: SubmittedReview = {
        id: `rev-${Date.now()}`,
        taskId: task.id,
        businessName: task.businessName,
        rating,
        visitDate,
        reviewText,
        reward: task.reward,
        status: 'pending_moderation',
        submittedAt: 'Just now',
      };
      onSubmitReview(newReview);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
      >
        {/* Header */}
        <div className="bg-[#0F3460] text-white p-5 flex items-start justify-between">
          <div>
            <div className="inline-block text-[11px] font-bold tracking-wider text-teal-200 uppercase bg-black/20 px-2.5 py-0.5 rounded-md mb-1">
              VERIFIED TASK BRIEF
            </div>
            <h3 className="text-xl font-bold">{task.businessName}</h3>
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>{task.address || task.location}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-sm">
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 block">Reward per review</span>
              <span className="text-2xl font-extrabold text-[#0D7A6B]">
                ${task.reward.toFixed(2)} USD
              </span>
              <span className="text-[11px] text-slate-500 block font-medium">Pesapal USD Settlement</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Available Slots</span>
              <span className="text-2xl font-extrabold text-slate-900">
                {task.slotsLeft} <span className="text-sm font-normal text-slate-500">/ {task.totalSlots}</span>
              </span>
              <span className="text-[11px] text-slate-500 block">24–48h Review Turnaround</span>
            </div>
          </div>

          {/* Subscription Check Warning if not subscribed */}
          {!account.isSubscribed && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Territory Tier Required</span>
              </div>
              <p className="text-xs text-amber-800">
                To claim task rewards and withdraw via Pesapal, unlock your territory tier starting at $2.70 USD/mo.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="mt-1 w-full py-2.5 px-3 rounded-xl bg-[#0D7A6B] text-white text-xs font-bold hover:bg-[#0a6357] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Activate Tier via Pesapal USD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {isSubmitted ? (
            <div className="text-center py-6 space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Review Submitted for Moderation!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Automated heuristics validated your review. Our moderation team reviews within 24–48 hours, after which <strong>${task.reward.toFixed(2)} USD</strong> will credit to your available balance.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#0F3460] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Task Brief
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-700">
                    {rating}.0 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date of Visit
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:border-[#0D7A6B] focus:outline-none bg-white"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Your Firsthand Review
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      isSatisfiedWordCount ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {wordCount} words (min 30 words)
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about the atmosphere, service speed, quality, or recommendations..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs leading-relaxed focus:border-[#0D7A6B] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isSatisfiedWordCount}
                className="w-full py-3 rounded-xl bg-[#0F3460] hover:bg-[#0c2a4f] disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Checking Quality & Submitting...</span>
                ) : account.isSubscribed ? (
                  <span>Submit Review & Claim ${task.reward.toFixed(2)} USD</span>
                ) : (
                  <span>Unlock Tier with Pesapal USD</span>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
