import React, { useState, useMemo } from 'react';
import {
  Check,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ReviewerAccount } from '../../types';
import { InfoModal } from '../InfoModals';
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  db,
  doc,
  getDoc,
  setDoc,
} from '../../lib/firebase';

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
  
  // Clean form fields with empty initial values (placeholders for user to fill)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Policy Modal state for clickable Terms & Guidelines
  const [activePolicyModal, setActivePolicyModal] = useState<'terms' | 'guidelines' | 'privacy' | null>(null);

  // Random invite code placeholder for the input field
  const randomInvitePlaceholder = useMemo(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `REF-${code}`;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

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
      if (!password || password.length < 6) {
        setErrorMsg('Password must be at least 6 characters');
        return;
      }
      if (!agreedToTerms) {
        setErrorMsg('Please agree to the Terms of Service and Review Integrity Guidelines');
        return;
      }

      setIsLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        try {
          await sendEmailVerification(user);
        } catch {
          // Non-blocking if rate limited
        }

        const userProfile = {
          userId: user.uid,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          planId: 'regional',
          isSubscribed: false,
          walletBalanceUSD: 0,
          pendingBalanceUSD: 0,
          completedTasks: 0,
          referralCode: 'REF-' + user.uid.substring(0, 6).toUpperCase(),
          invitedBy: inviteCode.trim().toUpperCase() || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        try {
          await setDoc(doc(db, 'users', user.uid), userProfile);
        } catch (dbErr) {
          console.warn('Profile write notice:', dbErr);
        }

        setIsLoading(false);
        onSuccess({
          isLoggedIn: true,
          customerName: fullName.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
          inviteCode: userProfile.referralCode,
        });
      } catch (err: any) {
        setIsLoading(false);
        if (err.code === 'auth/email-already-in-use') {
          setErrorMsg('An account with this email already exists. Please sign in instead.');
        } else if (err.code === 'auth/invalid-email') {
          setErrorMsg('The email address format is invalid.');
        } else if (err.code === 'auth/weak-password') {
          setErrorMsg('Password should be at least 6 characters.');
        } else if (err.code === 'auth/operation-not-allowed') {
          setErrorMsg('Email/password authentication is pending console activation. Please use "Continue with Google" for instant 1-click access.');
        } else {
          setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
        }
      }
    } else {
      // Login
      if (!email.trim()) {
        setErrorMsg('Please enter your account email');
        return;
      }
      if (!password.trim()) {
        setErrorMsg('Please enter your password');
        return;
      }

      setIsLoading(true);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        let profileName = user.displayName || email.split('@')[0] || 'Reviewer';
        let profilePhone = '';
        let refCode = 'REF-' + user.uid.substring(0, 6).toUpperCase();

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            profileName = data.fullName || profileName;
            profilePhone = data.phone || '';
            refCode = data.referralCode || refCode;
          }
        } catch (dbErr) {
          console.warn('Profile read notice:', dbErr);
        }

        setIsLoading(false);
        onSuccess({
          isLoggedIn: true,
          customerName: profileName,
          customerEmail: user.email || email.trim(),
          customerPhone: profilePhone,
          inviteCode: refCode,
        });
      } catch (err: any) {
        setIsLoading(false);
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
          setErrorMsg('Invalid email or password. Please verify and try again.');
        } else if (err.code === 'auth/operation-not-allowed') {
          setErrorMsg('Email/password authentication is pending console activation. Please use "Continue with Google" for instant 1-click access.');
        } else {
          setErrorMsg(err.message || 'Unable to sign in. Please try again.');
        }
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      let profileName = user.displayName || 'Reviewer';
      let profilePhone = user.phoneNumber || '';
      let refCode = 'REF-' + user.uid.substring(0, 6).toUpperCase();

      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            userId: user.uid,
            fullName: profileName,
            email: user.email || '',
            phone: profilePhone,
            planId: 'regional',
            isSubscribed: false,
            walletBalanceUSD: 0,
            pendingBalanceUSD: 0,
            completedTasks: 0,
            referralCode: refCode,
            invitedBy: inviteCode.trim().toUpperCase() || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else {
          const data = userDoc.data();
          profileName = data.fullName || profileName;
          profilePhone = data.phone || profilePhone;
          refCode = data.referralCode || refCode;
        }
      } catch (dbErr) {
        console.warn('Firestore doc check notice:', dbErr);
      }

      setIsLoading(false);
      onSuccess({
        isLoggedIn: true,
        customerName: profileName,
        customerEmail: user.email || '',
        customerPhone: profilePhone,
        inviteCode: refCode,
      });
    } catch (err: any) {
      setIsLoading(false);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Google sign-in could not be completed.');
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please type your registered email address into the Email field below first, then click Forgot password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMsg(`Password reset link dispatched to ${email.trim()}. Please check your email inbox.`);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not send password reset email. Please ensure the email address is correct.');
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
            <span>Return</span>
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
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1-Click Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-2xs transition-all active:scale-98 cursor-pointer mb-5"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">or continue with email</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

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
                  placeholder="e.g. John Doe"
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
                placeholder="name@example.com"
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
                  placeholder="e.g. +1 (555) 000-0000 or 0712345678"
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
                    onClick={handleForgotPassword}
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
                  placeholder={mode === 'signup' ? 'Create a password (min 8 characters)' : 'Enter your password'}
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">
                      Referral invite code (optional)
                    </label>
                    <span className="text-[11px] text-slate-400">If invited by a friend</span>
                  </div>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder={`e.g. ${randomInvitePlaceholder}`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0D7A6B] transition-colors uppercase font-mono"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms-check"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[#0D7A6B] focus:ring-[#0D7A6B] cursor-pointer"
                  />
                  <label htmlFor="terms-check" className="text-xs text-slate-600 leading-tight">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setActivePolicyModal('terms')}
                      className="font-semibold text-slate-900 underline hover:text-[#0D7A6B] cursor-pointer"
                    >
                      Terms of Service
                    </button>{' '}
                    and verified{' '}
                    <button
                      type="button"
                      onClick={() => setActivePolicyModal('guidelines')}
                      className="font-semibold text-slate-900 underline hover:text-[#0D7A6B] cursor-pointer"
                    >
                      Review Integrity Guidelines
                    </button>.
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

        {/* Footer info with clickable policy links */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="space-x-3">
            <button
              type="button"
              onClick={() => setActivePolicyModal('terms')}
              className="hover:text-slate-700 underline cursor-pointer"
            >
              Terms
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActivePolicyModal('privacy')}
              className="hover:text-slate-700 underline cursor-pointer"
            >
              Privacy
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActivePolicyModal('guidelines')}
              className="hover:text-slate-700 underline cursor-pointer"
            >
              Guidelines
            </button>
          </div>
          <span>Pesapal USD Verified</span>
        </div>

      </div>

      {/* Right Purple/Navy Gradient Panel (50% on Desktop) */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#0F3460] via-[#1E293B] to-[#3B35B0] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        
        {/* Ambient glow circles */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 my-auto py-12 max-w-lg space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Honest reviews of the places you visit — paid directly in USD cash.
          </h2>

          <p className="text-base text-slate-300 leading-relaxed">
            Select a verified business in your active territory, write your firsthand feedback, and get your reward credited in USD once moderation approves your submission.
          </p>
        </div>

        {/* Referral Callout Banner - only included once the user has input the optional referral code */}
        {inviteCode.trim().length > 0 ? (
          <div className="relative z-10 bg-white/15 backdrop-blur-md border border-teal-300/40 rounded-2xl p-5 text-xs text-slate-100 space-y-1 transition-all">
            <h4 className="font-bold text-teal-300 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-300" />
              Member Invitation Applied
            </h4>
            <p>
              Referral code <span className="font-mono font-bold text-teal-300">{inviteCode.trim().toUpperCase()}</span> is linked. Your inviter receives their referral commission in USD when your initial plan clears.
            </p>
          </div>
        ) : (
          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 text-xs text-slate-200 space-y-1">
            <h4 className="font-bold text-white text-sm">
              Verified Review Platform
            </h4>
            <p className="text-slate-300">
              Direct Pesapal payouts in USD. Reviews are verified within 24–48 hours and credited directly to your account.
            </p>
          </div>
        )}

      </div>

      {/* Info Modal for Terms of Service and Review Integrity Guidelines */}
      <InfoModal
        type={activePolicyModal}
        onClose={() => setActivePolicyModal(null)}
        onOpenAuth={(targetMode) => {
          setActivePolicyModal(null);
          setMode(targetMode);
        }}
      />

    </div>
  );
};
