import React, { useState } from 'react';
import {
  Check,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { ReviewerAccount } from '../../types';

interface AuthScreenProps {
  initialMode: 'login' | 'signup';
  bannerNotice?: string | null;
  onBackToLanding: () => void;
  onSuccess: (accountData: Partial<ReviewerAccount>) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode,
  bannerNotice,
  onBackToLanding,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Form fields
  const [fullName, setFullName] = useState('Newton Mass');
  const [email, setEmail] = useState('newton@coretaskpro.com');
  const [phone, setPhone] = useState('+1 (555) 349-8821');
  const [password, setPassword] = useState('CoreTask2026!');
  const [inviteCode, setInviteCode] = useState('B10791D6');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full legal name');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address');
        return;
      }
      if (!phone.trim()) {
        setErrorMsg('Please provide your contact/payout phone number');
        return;
      }
      if (!agreedToTerms) {
        setErrorMsg('Please agree to the reviewer code of conduct and terms');
        return;
      }
    } else {
      if (!email.trim()) {
        setErrorMsg('Please enter your account email');
        return;
      }
      if (!password.trim()) {
        setErrorMsg('Please enter your password');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        isLoggedIn: true,
        customerName: fullName || 'Newton Mass',
        customerEmail: email || 'newton@coretaskpro.com',
        customerPhone: phone || '+1 (555) 349-8821',
        inviteCode: inviteCode || 'DEF8A083',
      });
    }, 600);
  };

  const handleQuickDemoFill = () => {
    if (mode === 'login') {
      setEmail('newton@coretaskpro.com');
      setPassword('CoreTask2026!');
    } else {
      setFullName('Newton Mass');
      setEmail('newton@coretaskpro.com');
      setPhone('+1 (555) 349-8821');
      setPassword('CoreTask2026!');
      setInviteCode('B10791D6');
      setAgreedToTerms(true);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* Left Form Panel (50% on Desktop) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        
        {/* Top Header & Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to public site</span>
          </button>

          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0D7A6B] flex items-center justify-center text-white">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              Core<span className="text-[#0D7A6B]">Task</span> Pro
            </span>
          </div>
        </div>

        {/* Center Auth Form */}
        <div className="max-w-md w-full mx-auto my-auto py-6">
          
          {bannerNotice && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200/90 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2.5 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{bannerNotice}</span>
            </div>
          )}

          {/* Quick Demo Credentials Pill */}
          <div className="mb-6 p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-teal-950 font-medium">
              <KeyRound className="w-4 h-4 text-[#0D7A6B]" />
              <span>1-Click Test Access:</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-xs font-bold text-[#0D7A6B] hover:underline cursor-pointer bg-white px-2.5 py-1 rounded-md border border-teal-200 shadow-2xs"
            >
              Fill Demo Credentials
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {mode === 'login'
                ? 'Resume where you left off and manage your USD rewards and territory tasks.'
                : 'Register, activate your country pass, and start earning USD for honest firsthand reviews.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            
            {mode === 'signup' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Full legal name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Newton Mass"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0D7A6B] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0D7A6B] transition-colors"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Contact / Payout Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0D7A6B] transition-colors font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Used for plan verification and Pesapal USD payouts.
                </span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-700">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset verification dispatched to ' + email)}
                    className="text-xs text-[#1D4ED8] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0D7A6B] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Referral invite code (optional)
                  </label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="B10791D6"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0D7A6B] transition-colors uppercase font-mono"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms-check"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[#0D7A6B] focus:ring-[#0D7A6B]"
                  />
                  <label htmlFor="terms-check" className="text-xs text-slate-600 leading-tight">
                    I agree to the <span className="font-semibold text-slate-900 underline">Terms of Service</span> and verified <span className="font-semibold text-slate-900 underline">Review Integrity Guidelines</span>.
                  </label>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#0F3460] hover:bg-[#0c2a4f] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer mt-4"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : mode === 'login' ? (
                <span>Sign in to Dashboard</span>
              ) : (
                <span>Create Account</span>
              )}
            </button>

          </form>

          {/* Toggle between Login and Signup */}
          <div className="mt-6 text-center space-y-2 text-xs text-slate-600">
            {mode === 'login' ? (
              <>
                <p>
                  Need to verify your email?{' '}
                  <button
                    onClick={() => alert('Verification email resent.')}
                    className="text-[#1D4ED8] hover:underline cursor-pointer"
                  >
                    Resend link
                  </button>
                </p>
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg(null);
                    }}
                    className="font-bold text-[#0F3460] hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              </>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className="font-bold text-[#0F3460] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="space-x-3">
            <span>Terms</span>
            <span>·</span>
            <span>Privacy</span>
            <span>·</span>
            <span>Guidelines</span>
          </div>
          <span>Pesapal USD Verified</span>
        </div>

      </div>

      {/* Right Purple/Navy Gradient Panel (50% on Desktop) */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#0F3460] via-[#1E293B] to-[#3B35B0] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        
        {/* Ambient glow circles */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 pt-4">
          <span className="text-xs font-bold tracking-widest text-teal-200 uppercase bg-white/10 px-3 py-1 rounded-full">
            CORE TASK PRO REVIEW NETWORK
          </span>
        </div>

        <div className="relative z-10 my-auto py-12 max-w-lg space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Honest reviews of the places you visit — paid directly in USD cash.
          </h2>

          <p className="text-base text-slate-300 leading-relaxed">
            Select a verified business in your active territory, write your firsthand feedback, and get your reward credited in USD once moderation approves your submission.
          </p>
        </div>

        {/* Referral Callout Banner */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-xs text-slate-200 space-y-1">
          <h4 className="font-bold text-white text-sm">
            Member Invitation Applied
          </h4>
          <p>
            Referral code <strong>B10791D6</strong> is linked. Your inviter receives their referral commission in USD when your initial plan clears.
          </p>
        </div>

      </div>

    </div>
  );
};
