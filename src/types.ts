export type DashboardTab =
  | 'dashboard'
  | 'tasks'
  | 'my-reviews'
  | 'earnings'
  | 'referrals'
  | 'plans'
  | 'contact';

export type AppView = 'landing' | 'login' | 'signup' | 'dashboard';

export interface SubscriptionPlan {
  id: string;
  code: string; // e.g., 'REG-1', 'NAM-2', 'GLO-3'
  badge: string;
  badgeType?: 'default' | 'popular' | 'global';
  title: string;
  subtitle: string;
  priceUsd: number;
  period: string;
  description: string;
  territory: string;
  earningRate: string;
  features: string[];
  isPopular?: boolean;
}

export type PaymentMethod = 'card' | 'mpesa' | 'bank';

export interface PesapalTransaction {
  referenceId: string;
  trackingId: string;
  planId: string;
  planTitle: string;
  amountUsd: number;
  currency: 'USD';
  method: PaymentMethod;
  phoneNumber?: string;
  cardNumberMasked?: string;
  authCode?: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface ReviewTask {
  id: string;
  businessName: string;
  location: string;
  country: string;
  category: string;
  reward: number; // in USD ($)
  slotsLeft: number;
  totalSlots: number;
  tags: string[];
  recentReviewersCount: number;
  description: string;
  address: string;
  requirements: string[];
  isLocked?: boolean;
}

export interface SubmittedReview {
  id: string;
  taskId: string;
  businessName: string;
  category?: string;
  location?: string;
  rating: number;
  visitDate: string;
  reviewText: string;
  reward: number; // in USD ($)
  status: 'pending_moderation' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface WithdrawalRecord {
  id: string;
  amountUsd: number;
  method: string;
  recipientAccount: string;
  status: 'completed' | 'processing' | 'pending';
  reference: string;
  date: string;
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'support';
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
}

export interface ReferredMember {
  id: string;
  name: string;
  emailMasked: string;
  joinedDate: string;
  hasPurchasedPlan: boolean;
  planPurchased?: string;
  commissionEarned: number; // in USD ($)
}

export interface ReviewerAccount {
  isLoggedIn: boolean;
  isSubscribed: boolean;
  activePlan?: SubscriptionPlan;
  subscribedAt?: string;
  pesapalTrackingId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  inviteCode: string;
  referralLink: string;
  walletBalance: number; // in USD ($)
  lifetimeEarned: number; // in USD ($)
  referralCommission: number; // in USD ($)
  totalWithdrawn: number; // in USD ($)
  submittedReviews: SubmittedReview[];
  withdrawals: WithdrawalRecord[];
  messages: SupportMessage[];
  referredMembers: ReferredMember[];
}
