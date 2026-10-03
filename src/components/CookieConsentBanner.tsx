import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPolicy: (type: 'cookies' | 'privacy') => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('coretaskpro_cookie_consent');
    if (!consent) {
      // Small timeout for smooth appearance
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (choice: 'essential_only' | 'all') => {
    localStorage.setItem('coretaskpro_cookie_consent', choice);
    localStorage.setItem('coretaskpro_cookie_consent_date', new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-slate-700/80 text-xs sm:text-sm space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Cookie className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Browser Storage & Transparency</span>
          </div>
          <button
            onClick={() => handleConsent('essential_only')}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-300 text-xs leading-relaxed">
          We use strictly necessary browser storage to maintain secure authentication and process Pesapal payouts. All non-essential third-party tracking is <strong>halted by default</strong> until you explicitly opt in.
        </p>

        <div className="flex items-center gap-2 pt-1 text-xs text-teal-300">
          <button
            type="button"
            onClick={() => onOpenPolicy('cookies')}
            className="underline hover:text-white cursor-pointer font-medium"
          >
            Cookie Policy
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onOpenPolicy('privacy')}
            className="underline hover:text-white cursor-pointer font-medium"
          >
            Privacy Policy
          </button>
        </div>

        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => handleConsent('all')}
            className="flex-1 py-2 px-3 bg-[#0D7A6B] hover:bg-[#0b6357] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer text-center"
          >
            Accept All
          </button>
          <button
            type="button"
            onClick={() => handleConsent('essential_only')}
            className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium text-xs transition-colors cursor-pointer text-center"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
};
