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
                <strong>Data Privacy & Regulatory Compliance:</strong> CoreTaskPro complies with international privacy frameworks (GDPR Art. 5, CCPA/CPRA, and Kenya DPA). We enforce strict data minimization to limit storage and protect users and the platform from regulatory penalties.
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">1. Data Minimization & Excessive Storage Limits</h4>
                <p className="text-xs text-slate-600 mt-1">
                  We collect only the minimum personal data strictly necessary to operate the review service: legal name, account email, contact/payout phone number, and submitted evaluation text. We explicitly do not collect biometric data, background location tracking, device contacts, or unnecessary personal identifiers, eliminating exposure to excessive data storage regulatory fines.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">2. Data Retention & Automatic Database Purging</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Active account records are stored securely in Google Cloud Firestore only while the reviewer account remains open. Transient task reservations, expired drafts, and temporary moderation logs older than 60 days are systematically purged to prevent cloud storage bloat and reduce data liability.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">3. Zero Payment Data Storage (PCI-DSS Level 1 Compliance)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Payment handling for territory passes and payout disbursements is routed through Pesapal’s certified PCI-DSS Level 1 encrypted gateway. CoreTaskPro servers never store, process, or transmit raw credit card numbers, CVVs, or mobile money PINs.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">4. Zero Data Selling & Statutory User Rights</h4>
                <p className="text-xs text-slate-600 mt-1">
                  We never sell, rent, or trade personal data to third-party brokers. Enrolled reviewers possess the statutory right to request a complete copy of their stored data or demand permanent erasure ("Right to be Forgotten") within 30 days by emailing support@coretaskpro.com.
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
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                <strong>Infrastructure & Content Protection Policy:</strong> This policy prevents malicious abuse, safeguards platform infrastructure from runaway compute charges, and guarantees a safe marketplace.
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">1. Prohibition of Resource-Hijacking & High-Compute Jobs (Crypto Mining & DDoS)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Users and automated agents are strictly forbidden from utilizing platform infrastructure, API endpoints, or client runtime environments for cryptocurrency mining (including WebAssembly, background, or script miners), distributed denial-of-service (DDoS) orchestration, botnets, automated load-generation scripts, or heavy resource-hijacking jobs. Violations trigger immediate network termination and IP ban.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">2. Prohibition of Harmful Content, Payloads & Injections</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Submitting malicious scripts, Cross-Site Scripting (XSS) payloads, SQL/NoSQL injection attempts, phishing links, trojans, automated form-fill bots, or defamatory attacks against business merchants is strictly illegal and subject to zero-tolerance removal.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">3. Single Account Policy & Identity Integrity</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Each reviewer may operate only one active account linked to their verifiable legal name and payout destination. Operating multi-accounting rings to harvest introductory commissions or farm referral codes triggers an immediate global ban.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">4. Financial Liability for Infrastructure Exploitation</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Any party that initiates, abets, or executes resource-hijacking, crypto mining, or DDoS attacks against CoreTaskPro explicitly agrees to be held legally and financially liable for all resultant cloud computing charges, database read/write costs, bandwidth egress fees, and technical remediation damages.
                </p>
              </div>
            </div>
          )}

          {type === 'cookies' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                <strong>Cookie Transparency & Consent Standard:</strong> In compliance with the EU ePrivacy Directive and GDPR, we ensure transparent browser storage and halt third-party tracking spend until explicit opt-in is granted.
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">1. Transparent Browser Storage Categorization</h4>
                <p className="text-xs text-slate-600 mt-1">
                  CoreTaskPro uses strictly necessary browser storage (session tokens, CSRF protection, and Pesapal transaction verification callback handshakes). These are essential for account security and payout processing and do not require prior opt-in under international standards.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">2. Halting Third-Party Tracking Until Explicit Opt-In</h4>
                <p className="text-xs text-slate-600 mt-1">
                  All non-essential third-party analytics, behavioral tracking, and advertising tracking spend are completely halted and blocked by default. No third-party tracking scripts execute until you explicitly choose "Accept All" on the Cookie Consent Banner.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">3. Zero Covert Fingerprinting & Zero Tracking Resale</h4>
                <p className="text-xs text-slate-600 mt-1">
                  We do not deploy canvas fingerprinting, audio fingerprinting, device beacons, or cross-site tracking cookies. We never monetize or sell browser cookie profiles to third-party ad exchanges or data brokers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">4. Managing & Revoking Cookie Choices</h4>
                <p className="text-xs text-slate-600 mt-1">
                  You can inspect or delete cookies at any time via your browser settings, or reset your preferences by clearing the "coretaskpro_cookie_consent" key in your browser local storage.
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
