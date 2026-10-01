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

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[65vh]">
          {type === 'terms' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                <strong>Platform Operating Agreement:</strong> By accessing CoreTaskPro, creating an account, or subscribing to a territory access plan, you agree to these Terms of Service. Please read them thoroughly.
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">1. Independent Reviewer Relationship</h4>
                <p className="text-xs text-slate-600 mt-1">
                  CoreTaskPro operates an independent feedback and market research platform connecting local merchants with genuine consumers. Enrolled reviewers operate strictly as independent consumer contributors and not as employees, agents, or partners of CoreTaskPro.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">2. Territory Plans, Subscriptions & Renewals</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Territory subscription plans ($2.70/month for Regional Access / North America; $3.50/month for Global Access) unlock verified task listings within specified geographical jurisdictions. All plan transactions are processed securely in USD via Pesapal 3.0. Subscriptions remain active until cancelled by the user in account settings prior to the subsequent billing cycle.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">3. Review Moderation & Compensation Release</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Task rewards ($2.00 to $6.00 USD per verified task) are awarded solely upon successful moderation clearance by our review audit team within 24 to 48 hours. Submissions that fail to satisfy word count, contain duplicate or plagiarized text, or violate our Review Integrity Guidelines will be rejected without remuneration.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">4. Withdrawals & Payout Gateways</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Approved earnings are maintained in USD wallet balances. Withdrawals are disbursed through Pesapal payout channels (Direct Card, Mobile Money, or Bank Wire) to the account holder's registered recipient details. Standard banking clearing windows (2–4 hours for mobile wallets; 1–3 business days for international wire) apply.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">5. Anti-Fraud & Account Termination</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Creating multiple reviewer profiles, employing proxy VPNs to spoof physical visits, utilizing automated language generation tools (bots, LLMs), or coordinating false reviews constitutes a material breach. Violators face immediate permanent account termination and forfeiture of pending unverified balances.
                </p>
              </div>
            </div>
          )}

          {type === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                <strong>Data Privacy Commitment:</strong> CoreTaskPro complies with international privacy frameworks (GDPR and CCPA principles). We respect your privacy and never sell reviewer personal identifiers.
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">1. Information We Collect</h4>
                <p className="text-xs text-slate-600 mt-1">
                  We collect account registration data (legal name, email address, and payout contact number), review submission content (visit dates, rating, and written descriptions), and transactional logs necessary to disburse Pesapal settlements.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">2. Zero Payment Data Storage (PCI-DSS Compliance)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  All payment transactions are encrypted and handled exclusively by Pesapal’s certified PCI-DSS Level 1 gateway. CoreTaskPro never receives, processes, or stores your credit card numbers, CVVs, or mobile money PINs on our servers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">3. Use of Personal Information</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Your information is utilized solely to: (a) authenticate your reviewer profile; (b) facilitate moderation verification; (c) transfer approved earnings via Pesapal; and (d) provide customer support communications.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">4. Data Retention & Erasure</h4>
                <p className="text-xs text-slate-600 mt-1">
                  You may request permanent deletion of your reviewer profile and associated personal data at any time by contacting support@coretaskpro.com, subject to legal recordkeeping obligations for financial transactions.
                </p>
              </div>
            </div>
          )}

          {type === 'guidelines' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <strong>Zero-Tolerance Integrity Standard:</strong> CoreTaskPro connects real patrons with genuine local merchants. Every review is inspected by human moderators and automated heuristics.
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">1. Firsthand Physical Visit Mandate</h4>
                <p className="text-xs text-slate-600 mt-1">
                  You must have personally patronized the business establishment within the past 90 days. Secondhand anecdotes, hearsay, or generic feedback without visiting the premises are strictly disqualified.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">2. Absolute Prohibition of AI & Automated Content</h4>
                <p className="text-xs text-slate-600 mt-1">
                  All submissions are parsed through language heuristic models. Using ChatGPT, Claude, bot scripts, or copy-pasting from Google Maps/Yelp triggers an instant disqualification and flag on your reviewer profile.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">3. Specific Detail Requirement (Minimum 30 Words)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Reviews must explicitly describe your interaction: specific dishes or beverages consumed, services rendered, wait times, staff hospitality, and overall facility ambiance. Vague one-liners like "great food, loved it" will be rejected.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">4. Conflicts of Interest & Bias</h4>
                <p className="text-xs text-slate-600 mt-1">
                  You may not review your own enterprise, your current employer, a family business, or a direct competitor. Reviewers must maintain total consumer independence.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">5. Verification Audits & Random Proof of Visit</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Moderators may periodically request secondary verification (such as an itemized receipt, order ticket, or geotagged photograph) for spot-audit compliance before clearing larger payout balances.
                </p>
              </div>

              <div className="p-3 bg-red-50 border border-red-200/80 rounded-xl text-xs text-red-800">
                <strong>Enforcement & Penalties:</strong> Fabricated reviews result in immediate permanent account termination, forfeiture of pending rewards, and blacklisting of associated payout credentials.
              </div>
            </div>
          )}

          {type === 'acceptable-use' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">1. Lawful & Constructive Conduct</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Users agree to utilize CoreTaskPro strictly for authentic consumer evaluations. Threatening, profane, defamatory, or abusive commentary directed at merchant staff or business establishments will be immediately purged.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">2. Anti-Scraping & System Abuse</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Reverse engineering platform APIs, deploying crawlers, scraping merchant coordinates, or orchestrating distributed denial of service attempts will result in legal action and IP blacklisting.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">3. Single Account Policy</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Each reviewer may operate only one active account linked to their verifiable legal name and payout destination. Creating duplicate accounts to exploit introductory tasks or referral codes triggers an immediate global ban.
                </p>
              </div>
            </div>
          )}

          {type === 'cookies' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">1. Essential Operational Cookies</h4>
                <p className="text-xs text-slate-600 mt-1">
                  CoreTaskPro uses strictly necessary session cookies to maintain your login credentials, preserve active review drafts, and ensure secure transaction handshake communication with Pesapal payment gateways.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">2. No Third-Party Tracking Advertising</h4>
                <p className="text-xs text-slate-600 mt-1">
                  We do not embed third-party advertising tracking pixels, behavioural retargeting beacons, or data broker cookies on our member dashboard.
                </p>
              </div>
            </div>
          )}

          {(type === 'how-it-works' || type === 'why-us') && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Platform Operational Model</h4>
                <p className="text-xs text-slate-600 mt-1">
                  CoreTaskPro matches independent reviewers with local businesses seeking authentic customer feedback. Reviewers choose tasks in their subscribed territories, write firsthand reviews with at least 30 words, and earn $2–$6 USD per approved review paid through Pesapal.
                </p>
              </div>
            </div>
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
