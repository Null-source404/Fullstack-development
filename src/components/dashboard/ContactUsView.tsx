import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  User,
  Headphones
} from 'lucide-react';
import { ReviewerAccount, SupportMessage } from '../../types';

interface ContactUsViewProps {
  account: ReviewerAccount;
  onSendMessage: (msg: SupportMessage) => void;
}

export const ContactUsView: React.FC<ContactUsViewProps> = ({
  account,
  onSendMessage,
}) => {
  const [name, setName] = useState(account.customerName || '');
  const [email, setEmail] = useState(account.customerEmail || '');
  const [phone, setPhone] = useState(account.customerPhone || '');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);

    const userMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      name,
      email,
      phone,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onSendMessage(userMsg);
    setMessage('');

    // Simulate auto-support acknowledgment after 1.5s
    setTimeout(() => {
      setIsSending(false);
      const replyMsg: SupportMessage = {
        id: `reply-${Date.now()}`,
        sender: 'support',
        name: 'CoreTaskPro Support (David)',
        email: 'support@coretaskpro.com',
        phone: '+254 700 000 000',
        message: `Hello ${name.split(' ')[0]}, thank you for contacting us. We have received your inquiry and our reviewer support team is actively reviewing your request. For payout or plan issues, please ensure your M-Pesa details match your account.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onSendMessage(replyMsg);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Contact us
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Send us a message and we will reply on this page.
        </p>
      </div>

      {/* 2-Column Panel matching Screenshot 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Send a message Form (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Mail className="w-4 h-4 text-[#3B35B0]" />
            <span>Send a message</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contact number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Message
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how we can help."
                className="w-full p-3.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#1D4ED8] resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="w-full py-3 rounded-xl bg-[#0F3460] hover:bg-[#0c2a4f] disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              {isSending ? 'Sending message...' : 'Send message'}
            </button>
          </form>
        </div>

        {/* Right: Your messages Panel (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Your messages
          </h3>

          {account.messages.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-2xl py-16 px-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                No messages yet
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Anything you send us appears here, together with our reply.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {account.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                    m.sender === 'user'
                      ? 'bg-blue-50/80 border border-blue-200 text-slate-800 ml-6'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      {m.sender === 'user' ? (
                        <User className="w-3 h-3 text-blue-600" />
                      ) : (
                        <Headphones className="w-3 h-3 text-emerald-600" />
                      )}
                      <span>{m.name}</span>
                    </span>
                    <span className="font-normal">{m.timestamp}</span>
                  </div>
                  <p className="leading-relaxed pt-0.5">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
