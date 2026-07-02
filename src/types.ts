export type SimplificationMode = 'default' | 'eli5' | 'pro' | 'student' | 'academy';

export interface InputHistoryItem {
  id: string;
  originalText: string;
  imageAttached?: boolean;
  imageMimeType?: string;
  imageData?: string; // base64
  simplifiedText: string;
  mode: SimplificationMode;
  title: string;
  timestamp: number;
}

export interface ExampleItem {
  id: string;
  title: string;
  category: string;
  description: string;
  text: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "user" | "admin";
  walletBalance: number;
  requestLimit: number;
  requestsUsed: number;
  referredBy?: string;
  referralCode: string;
  referralsCount: number;
  createdAt: number;
  
  // Creator Profile fields
  isCreator?: boolean;
  creatorApproved?: boolean;
  creatorProfile?: {
    photo?: string;
    coverBanner?: string;
    displayName?: string;
    username?: string;
    bio?: string;
    skills?: string[];
    category?: string;
    website?: string;
    socialLinks?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
      instagram?: string;
      youtube?: string;
      facebook?: string;
    };
    location?: string;
    verified?: boolean; // admin controlled
    followers?: string[]; // list of user uids
    viewsCount?: number;
    downloadsCount?: number;
    salesCount?: number;
    revenue?: number;
    brandLogo?: string;
    brandName?: string;
    portfolio?: string;
    email?: string;
    phone?: string;
    languages?: string;
    personalDomain?: string;
  };
}

export interface CreatorProduct {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  title: string;
  description: string;
  contentType: string;
  category: string;
  status: "free" | "paid" | "draft" | "scheduled" | "private" | "public";
  price: number; // price in credits
  content: string; // The markdown contents of Course, eBook, etc.
  downloadsCount: number;
  viewsCount: number;
  likesCount: number;
  createdAt: number;
  launchData?: {
    description?: string;
    seoMetadata?: string;
    landingPageCopy?: string;
    socialPosts?: {
      twitter?: string;
      linkedin?: string;
      facebook?: string;
      instagram?: string;
      whatsapp?: string;
      telegram?: string;
    };
    emailCampaign?: string;
    pressRelease?: string;
  };
}

export interface TransactionRecord {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  orderId: string;
  type: "payment" | "referral_bonus" | "manual_adjustment" | "subscription_renewal" | "refund";
  creditsAllocated: number;
  description: string;
  timestamp: number;
}

export interface SubscriptionRecord {
  id: string; // Subscription ID or PayU subscription ID
  userId: string;
  planId: "free" | "starter" | "pro" | "creator" | "enterprise";
  planName: string;
  amount: number;
  currency: string;
  status: "active" | "cancelled" | "pending" | "expired" | "failed";
  paymentStartDate: number;
  paymentEndDate: number;
  nextBillingDate: number;
  autoRenew: boolean;
  createdAt: number;
  updatedAt: number;
  gateway: "payu";
  payuSubscriptionId?: string;
  paymentMethod?: string;
}

export interface WalletLedgerRecord {
  id: string;
  userId: string;
  type: "credit_renewal" | "credit_purchase" | "usage_deduction" | "referral_bonus" | "refund" | "manual_adjustment";
  amount: number; // credits changed (positive or negative)
  previousBalance: number;
  newBalance: number;
  description: string;
  referenceId: string; // invoiceId, transactionId or orderId
  timestamp: number;
}

export interface InvoiceRecord {
  id: string;
  userId: string;
  subscriptionId?: string;
  transactionId?: string;
  planName: string;
  amount: number;
  gstAmount: number; // GST 18% etc
  totalAmount: number;
  status: "paid" | "unpaid" | "refunded";
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  timestamp: number;
}

export interface WebhookLogRecord {
  id: string;
  timestamp: number;
  payload: any;
  status: "success" | "failed" | "duplicate";
  error?: string;
}


