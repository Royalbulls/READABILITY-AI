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
    };
    location?: string;
    verified?: boolean; // admin controlled
    followers?: string[]; // list of user uids
    viewsCount?: number;
    downloadsCount?: number;
    salesCount?: number;
    revenue?: number;
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
  type: "payment" | "referral_bonus" | "manual_adjustment";
  creditsAllocated: number;
  description: string;
  timestamp: number;
}

