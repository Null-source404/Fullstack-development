import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  Printer,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { SubscriptionPlan, PaymentMethod, PesapalTransaction, ReviewerAccount } from '../types';

interface PesapalCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: SubscriptionPlan;
  plans: SubscriptionPlan[];
  onSelectPlan: (plan: SubscriptionPlan) => void;
  currency: 'USD' | 'KES';
  onPaymentSuccess: (transaction: PesapalTransaction) => void;
  account: ReviewerAccount;
}

export const PesapalCheckoutModal: React.FC<PesapalCheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  plans,
  onSelectPlan,
  onPaymentSuccess,
  account,
}) => {
  const [step, setStep] = useState<'payment' | 'card_otp' | 'success'>('payment');
  
  // Customer info
  const [customerName, setCustomerName] = useState(account.customerName || 'Newton Mass');
  const [customerEmail, setCustomerEmail] = useState(account.customerEmail || 'newton@coretaskpro.com');
  const [customerPhone, setCustomerPhone] = useState(account.customerPhone || '+1 (555) 349-8821');
  const [country, setCountry] = useState('United States');
  
  // Payment method: 'card' | 'mpesa' | 'bank'
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Card fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('789');
  const [cardOtp, setCardOtp] = useState('');

  // Generated Pesapal order details
  const [referenceId, setReferenceId] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [completedTransaction, setCompletedTransaction] = useState<PesapalTransaction | null>(null);

  useEffect(() => {
    if (isOpen) {
      const ref = `PESA-USD-${Math.floor(100000 + Math.random() * 900000)}`;
      const track = `track_usd_${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;
      setReferenceId(ref);
      setTrackingId(track);
      setStep('payment');
      setErrorMessage(null);
      setIsProcessing(false);
    }
  }, [isOpen, selectedPlan]);

  if (!isOpen) return null;

  const displayAmount = `$${selectedPlan.priceUsd.toFixed(2)} USD`;
  const usdAmount = selectedPlan.priceUsd;

  const handleInitiatePesapal = () => {
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (selectedMethod === 'card') {
        setStep('card_otp');
      } else {
        completePaymentSuccess();
      }
    }, 1100);
  };

  const completePaymentSuccess = () => {
    const authCode = `AUTH-${Math.floor(10000000 + Math.random() * 90000000).toString(36).toUpperCase()}`;

    const newTransaction: PesapalTransaction = {
      referenceId,
      trackingId,
      planId: selectedPlan.id,
      planTitle: selectedPlan.title,
      amountUsd: usdAmount,
      currency: 'USD',
      method: selectedMethod,
      phoneNumber: customerPhone,
      cardNumberMasked: '•••• •••• •••• 4242',
      authCode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
      status: 'completed',
    };

    setCompletedTransaction(newTransaction);
    setStep('success');
    onPaymentSuccess(newTransaction);
  };

  const handleVerifyCardOtp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      completePaymentSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans"
        role="dialog"
        aria-modal="true"
      >
        {/* Pesapal Official Gateway Header in USD */}
        <div className="bg-[#0F3460] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-base text-white">
              <span className="text-emerald-400">P</span>
              <span className="text-blue-400">P</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wide text-white">
                  PESAPAL <span className="text-xs font-normal text-slate-300">USD GATEWAY 3.0</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-medium">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  PCI-DSS 256-Bit
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Merchant: Core Task Pro Technologies · Ref: {referenceId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Pesapal Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* SUCCESS SCREEN */}
          {step === 'success' && completedTransaction && (
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Pesapal USD Payment Verified
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Reviewer Territory Activated!
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  You now have access to verified review opportunities in <strong>{selectedPlan.territory}</strong>.
                </p>
              </div>

              {/* Official Receipt Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-left text-xs space-y-2.5 max-w-md mx-auto">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-900 text-sm">Pesapal Official Receipt</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded">
                    STATUS: COMPLETED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                  <div>
                    <span className="block text-slate-400">Order Reference</span>
                    <span className="font-semibold text-slate-800">{completedTransaction.referenceId}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Pesapal Tracking ID</span>
                    <span className="font-semibold text-slate-800 font-mono text-[11px] truncate block">
                      {completedTransaction.trackingId}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Authorization Code</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {completedTransaction.authCode}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Amount Paid</span>
                    <span className="font-bold text-slate-900">
                      ${completedTransaction.amountUsd.toFixed(2)} USD
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Subscribed Tier</span>
                    <span className="font-medium text-slate-800">{completedTransaction.planTitle}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Date & Time</span>
                    <span className="font-medium text-slate-800">{completedTransaction.timestamp}</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-200">
                  Invoice dispatched to: {customerEmail}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print Pesapal Receipt
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0D7A6B] hover:bg-[#0a6357] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open Tasks & Start Earning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* CARD 3D SECURE OTP SCREEN */}
          {step === 'card_otp' && (
            <div className="max-w-md mx-auto text-center py-4 space-y-4 animate-in fade-in duration-200">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Pesapal 3D-Secure Authentication
              </h3>
              <p className="text-xs text-slate-500">
                A one-time verification passcode has been dispatched to authenticate payment of <strong>{displayAmount}</strong>.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Merchant:</span>
                  <span className="font-semibold text-slate-800">TaskPulse Pro (via Pesapal)</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Amount:</span>
                  <span className="font-bold text-slate-900">{displayAmount}</span>
                </div>
                
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter Verification OTP (Use test code: 123456)
                  </label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={cardOtp}
                    onChange={(e) => setCardOtp(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-center tracking-widest font-mono text-sm focus:border-teal-600 focus:outline-none bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleVerifyCardOtp}
                  disabled={isProcessing}
                  className="w-full py-2.5 rounded-xl bg-[#0F3460] hover:bg-[#0c2a4f] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying with Card Issuer...</span>
                    </>
                  ) : (
                    <span>Authorize ${usdAmount.toFixed(2)} USD</span>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep('payment')}
                className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Back to payment options
              </button>
            </div>
          )}

          {/* MAIN PAYMENT FORM */}
          {step === 'payment' && (
            <div className="space-y-6">
              
              {/* Order & Territory Summary */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-2.5 py-0.5 rounded-md">
                      {selectedPlan.badge}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {selectedPlan.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedPlan.description}
                  </p>
                  <p className="text-xs text-[#0D7A6B] font-semibold mt-1">
                    ✓ {selectedPlan.earningRate}
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4 shrink-0">
                  <span className="text-xs text-slate-400 block font-medium">Billed in USD</span>
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {displayAmount}
                  </span>
                  <div className="mt-1">
                    <select
                      value={selectedPlan.id}
                      onChange={(e) => {
                        const found = plans.find((p) => p.id === e.target.value);
                        if (found) onSelectPlan(found);
                      }}
                      className="text-[11px] font-semibold text-teal-700 bg-white border border-slate-200 rounded px-1.5 py-0.5 cursor-pointer"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (${p.priceUsd.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  1. Reviewer Contact Information
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Newton Mass"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-teal-600 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="newton@taskpulsepro.com"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-teal-600 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (555) 349-8821"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-teal-600 focus:outline-none font-mono bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-teal-600 focus:outline-none bg-white cursor-pointer"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="International">Other Country</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Select Pesapal USD Payment Method
                </h5>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600 mb-2" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">Credit / Debit</span>
                      <span className="text-[10px] text-slate-500">Visa / Mastercard</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('mpesa')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedMethod === 'mpesa'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Wallet className="w-5 h-5 text-emerald-600 mb-2" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">Pesapal Wallet</span>
                      <span className="text-[10px] text-slate-500">Instant USD</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bank')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedMethod === 'bank'
                        ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-teal-700 mb-2" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">Direct Wire</span>
                      <span className="text-[10px] text-slate-500">ACH / Swift</span>
                    </div>
                  </button>
                </div>

                {selectedMethod === 'card' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-mono focus:border-teal-600 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-mono focus:border-teal-600 focus:outline-none text-center"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="789"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-mono focus:border-teal-600 focus:outline-none text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Checkout Action */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-[#0D7A6B]" />
                  <span>256-Bit SSL Encrypted USD Checkout</span>
                </div>

                <button
                  type="button"
                  onClick={handleInitiatePesapal}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0F3460] hover:bg-[#0c2a4f] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Contacting Pesapal...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay {displayAmount} via Pesapal</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
