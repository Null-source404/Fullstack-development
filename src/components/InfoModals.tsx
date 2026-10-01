import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';

interface InfoModalProps {
  type: 'how-it-works' | 'terms' | 'why-us' | 'guidelines' | 'privacy' | 'acceptable-use' | 'cookies' | null;
  onClose: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  type,
  onClose,
  onOpenAuth,
}) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto font-sans">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[88vh] flex flex-col"
        role="dialog"
      >
        <div className="bg-[#0c6b5d] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {type === 'terms' && 'Terms of Service'}
                {type === 'privacy' && 'Privacy Policy'}
                {type === 'guidelines' && 'Review Integrity Guidelines'}
                {type === 'acceptable-use' && 'Acceptable Use Policy'}
                {type === 'cookies' && 'Cookie Policy'}
                {type === 'how-it-works' && 'How CoreTaskPro Works'}
                {type === 'why-us' && 'Why Choose CoreTaskPro'}
              </h3>
              <p className="text-xs text-teal-100">CoreTaskPro Official Platform Documentation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {type === 'terms' && (
            <>
              <h4 className="font-bold text-slate-900 text-base">1. Reviewer Agreement</h4>
              <p>
                By enrolling as a reviewer on CoreTaskPro, you verify that all reviews you submit reflect genuine, firsthand interactions with the subject merchants. Fabricated reviews, automated AI-generated submissions, or coordinated rating campaigns are strictly prohibited.
              </p>

              <h4 className="font-bold text-slate-900 text-base pt-2">2. Compensation & Settlement</h4>
              <p>
                Reviews are compensated between $2.00 and $6.00 USD upon human moderation approval. Approved balances are maintained in USD and processed via secure Pesapal gateway payout channels.
              </p>

              <h4 className="font-bold text-slate-900 text-base pt-2">3. Subscription Access</h4>
              <p>
                Territory proxy network access passes are charged as stated ($2.70 or $3.50/month). Cancellation can be enacted at any time from your account settings.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <h4 className="font-bold text-slate-900 text-base">Privacy & Data Handling</h4>
              <p>
                CoreTaskPro does not sell your personal identifiers. Contact information is strictly utilized to authenticate accounts, coordinate customer support, and route payment settlements through Pesapal API 3.0.
              </p>
            </>
          )}

          {type === 'guidelines' && (
            <>
              <h4 className="font-bold text-slate-900 text-base">Review Integrity Policy</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Reviews must contain at least 30 words detailing service quality, items purchased, or facility cleanliness.</li>
                <li>No copy-pasted text from other review platforms.</li>
                <li>Photos or receipts may be requested by moderation for random quality spot-checks.</li>
              </ul>
            </>
          )}

          {(type === 'acceptable-use' || type === 'cookies' || type === 'how-it-works' || type === 'why-us') && (
            <>
              <h4 className="font-bold text-slate-900 text-base">Platform Standards</h4>
              <p>
                Every task on CoreTaskPro represents an active local merchant looking for legitimate customer experiences. Payouts are guaranteed for all verified, approved submissions.
              </p>
            </>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Version 3.2 · October 2026</span>
          <button
            onClick={() => {
              onClose();
              onOpenAuth('signup');
            }}
            className="px-4 py-2 bg-[#0c6b5d] hover:bg-[#0a574a] text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};
