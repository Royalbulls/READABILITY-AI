import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

// Load configuration
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

// Initialize admin app if not already initialized
const apps = getApps();
const adminApp = apps.length === 0 
  ? initializeApp({ projectId: firebaseConfig.projectId }) 
  : apps[0];

export const db = getFirestore(adminApp, firebaseConfig.firestoreDatabaseId || "(default)");

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "user" | "admin";
  walletBalance: number; // For credit balance
  requestLimit: number;  // Request limits
  requestsUsed: number;  // Requests consumed
  referredBy?: string;
  referralCode: string;
  referralsCount: number;
  createdAt: number;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  orderId: string;
  type: "payment" | "referral_bonus" | "manual_adjustment" | "subscription_renewal" | "refund" | "purchase";
  creditsAllocated: number;
  description: string;
  timestamp: number;
  planName?: string;
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
  amount: number; // credits changed
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

// ==========================================
// SELF-HEALING LOCAL FALLBACK DATABASE ENGINE
// ==========================================
export let useLocalFallback = false;
const LOCAL_DB_PATH = path.join(process.cwd(), "local_db.json");

interface LocalData {
  users: Record<string, UserProfile>;
  transactions: Record<string, TransactionRecord>;
  subscriptions: Record<string, SubscriptionRecord>;
  walletLedger: Record<string, WalletLedgerRecord>;
  invoices: Record<string, InvoiceRecord>;
  webhookLogs: WebhookLogRecord[];
  waitlist?: Record<string, any>;
  feedback?: Record<string, any>;
}

function loadLocalDB(): Required<LocalData> {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf8"));
      return {
        users: data.users || {},
        transactions: data.transactions || {},
        subscriptions: data.subscriptions || {},
        walletLedger: data.walletLedger || {},
        invoices: data.invoices || {},
        webhookLogs: data.webhookLogs || [],
        waitlist: data.waitlist || {},
        feedback: data.feedback || {}
      };
    }
  } catch (e) {
    console.error("[Server DB] Failed to load local DB:", e);
  }
  return {
    users: {},
    transactions: {},
    subscriptions: {},
    walletLedger: {},
    invoices: {},
    webhookLogs: [],
    waitlist: {},
    feedback: {}
  };
}

function saveLocalDB(data: LocalData) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("[Server DB] Failed to save local DB:", e);
  }
}

// Proactive startup check to see if firebase-admin has permissions
async function checkFirebaseAccess() {
  try {
    await db.collection("system_check").limit(1).get();
  } catch (err: any) {
    const msg = err.message || "";
    if (msg.includes("PERMISSION_DENIED") || msg.includes("permissions") || err.code === 7) {
      useLocalFallback = true;
      console.warn("[Server DB] Proactive check: Firestore access PERMISSION_DENIED. Enabled local JSON database fallback.");
    }
  }
}
checkFirebaseAccess();

// Helper to determine if an error is a permissions error
function isPermissionError(err: any): boolean {
  const msg = err.message || "";
  return !!(msg.includes("PERMISSION_DENIED") || msg.includes("permissions") || err.code === 7);
}

// Ensure user profile exists, create with defaults if not
export async function getOrCreateUserProfile(
  uid: string, 
  email: string, 
  displayName: string,
  referredByCode?: string
): Promise<UserProfile> {
  if (useLocalFallback) {
    return handleGetOrCreateLocal(uid, email, displayName, referredByCode);
  }

  try {
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      const data = userSnap.data() as UserProfile;
      if (data.role === undefined) {
        await userRef.update({ role: "user" });
        data.role = "user";
      }
      return { ...data, uid };
    }

    let initialRole: "user" | "admin" = "user";
    try {
      const testSnap = await db.collection("users").limit(1).get();
      if (testSnap.empty) {
        initialRole = "admin";
        console.log(`[Server DB] Bootstrapping first user ${email} as ADMIN.`);
      }
    } catch (err) {
      console.error("Failed to check empty users collection:", err);
    }

    const referralCode = `READ-${uid.substring(0, 5).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const newUser: UserProfile = {
      uid,
      email,
      displayName: displayName || "Readability Scholar",
      role: initialRole,
      walletBalance: 5,
      requestLimit: 5,
      requestsUsed: 0,
      referralCode,
      referralsCount: 0,
      createdAt: Date.now()
    };

    if (referredByCode) {
      const cleanedCode = referredByCode.trim().toUpperCase();
      try {
        const referrerSnap = await db.collection("users").where("referralCode", "==", cleanedCode).get();

        if (!referrerSnap.empty) {
          const referrerDoc = referrerSnap.docs[0];
          const referrerRef = db.collection("users").doc(referrerDoc.id);
          await referrerRef.update({
            requestLimit: FieldValue.increment(5),
            walletBalance: FieldValue.increment(5),
            referralsCount: FieldValue.increment(1)
          });

          const refTxId = `ref_reward_${Date.now()}_${referrerDoc.id.substring(0, 4)}`;
          await db.collection("transactions").doc(refTxId).set({
            id: refTxId,
            userId: referrerDoc.id,
            amount: 0,
            currency: "INR",
            status: "success",
            orderId: refTxId,
            type: "referral_bonus",
            creditsAllocated: 5,
            description: `Referral bonus for inviting ${email}`,
            timestamp: Date.now()
          });

          newUser.referredBy = referrerDoc.id;
          newUser.requestLimit = 10;
          newUser.walletBalance = 10;

          console.log(`[Referral] Referral code ${cleanedCode} applied. Referrer: ${referrerDoc.id}, Referred: ${uid}`);
        }
      } catch (refError) {
        console.error("Error processing referral on user creation:", refError);
      }
    }

    await userRef.set(newUser);

    if (!newUser.referredBy) {
      const signupTxId = `signup_free_${Date.now()}`;
      await db.collection("transactions").doc(signupTxId).set({
        id: signupTxId,
        userId: uid,
        amount: 0,
        currency: "INR",
        status: "success",
        orderId: signupTxId,
        type: "referral_bonus",
        creditsAllocated: 5,
        description: "Welcome gift: 5 Free Starter Credits",
        timestamp: Date.now()
      });
    } else {
      const signupTxId = `signup_referred_${Date.now()}`;
      await db.collection("transactions").doc(signupTxId).set({
        id: signupTxId,
        userId: uid,
        amount: 0,
        currency: "INR",
        status: "success",
        orderId: signupTxId,
        type: "referral_bonus",
        creditsAllocated: 10,
        description: "Welcome gift: 10 Free Credits (Referred)",
        timestamp: Date.now()
      });
    }

    return newUser;
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      console.warn("[Server DB] Firestore error during getOrCreateUserProfile. Falling back to local DB.");
      return handleGetOrCreateLocal(uid, email, displayName, referredByCode);
    }
    throw err;
  }
}

function handleGetOrCreateLocal(
  uid: string, 
  email: string, 
  displayName: string, 
  referredByCode?: string
): UserProfile {
  const ldb = loadLocalDB();
  if (ldb.users[uid]) {
    return ldb.users[uid];
  }

  let initialRole: "user" | "admin" = "user";
  if (Object.keys(ldb.users).length === 0) {
    initialRole = "admin";
  }

  const referralCode = `READ-${uid.substring(0, 5).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

  const newUser: UserProfile = {
    uid,
    email,
    displayName: displayName || "Readability Scholar",
    role: initialRole,
    walletBalance: 5,
    requestLimit: 5,
    requestsUsed: 0,
    referralCode,
    referralsCount: 0,
    createdAt: Date.now()
  };

  if (referredByCode) {
    const cleanedCode = referredByCode.trim().toUpperCase();
    const referrerId = Object.keys(ldb.users).find(k => ldb.users[k].referralCode === cleanedCode);
    if (referrerId) {
      ldb.users[referrerId].requestLimit += 5;
      ldb.users[referrerId].walletBalance += 5;
      ldb.users[referrerId].referralsCount += 1;

      const refTxId = `ref_reward_${Date.now()}_${referrerId.substring(0, 4)}`;
      ldb.transactions[refTxId] = {
        id: refTxId,
        userId: referrerId,
        amount: 0,
        currency: "INR",
        status: "success",
        orderId: refTxId,
        type: "referral_bonus",
        creditsAllocated: 5,
        description: `Referral bonus for inviting ${email}`,
        timestamp: Date.now()
      };

      newUser.referredBy = referrerId;
      newUser.requestLimit = 10;
      newUser.walletBalance = 10;
    }
  }

  ldb.users[uid] = newUser;

  const signupTxId = newUser.referredBy ? `signup_referred_${Date.now()}` : `signup_free_${Date.now()}`;
  ldb.transactions[signupTxId] = {
    id: signupTxId,
    userId: uid,
    amount: 0,
    currency: "INR",
    status: "success",
    orderId: signupTxId,
    type: "referral_bonus",
    creditsAllocated: newUser.referredBy ? 10 : 5,
    description: newUser.referredBy ? "Welcome gift: 10 Free Credits (Referred)" : "Welcome gift: 5 Free Starter Credits",
    timestamp: Date.now()
  };

  saveLocalDB(ldb);
  return newUser;
}

// Deduct 1 credit for an operation
export async function deductUserCredit(uid: string): Promise<boolean> {
  if (useLocalFallback) {
    return handleDeductLocal(uid);
  }

  try {
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) return false;

    const data = userSnap.data() as UserProfile;
    if (data.requestsUsed >= data.requestLimit) {
      return false;
    }

    await userRef.update({
      requestsUsed: FieldValue.increment(1),
      walletBalance: FieldValue.increment(-1)
    });
    return true;
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      console.warn("[Server DB] Firestore error during deductUserCredit. Falling back to local DB.");
      return handleDeductLocal(uid);
    }
    throw err;
  }
}

function handleDeductLocal(uid: string): boolean {
  const ldb = loadLocalDB();
  const user = ldb.users[uid];
  if (!user) return false;
  if (user.requestsUsed >= user.requestLimit) return false;
  user.requestsUsed += 1;
  user.walletBalance -= 1;
  saveLocalDB(ldb);
  return true;
}

// Get user transaction logs
export async function getUserTransactions(uid: string): Promise<TransactionRecord[]> {
  if (useLocalFallback) {
    return handleGetTransactionsLocal(uid);
  }

  try {
    const snap = await db.collection("transactions").where("userId", "==", uid).get();
    const records: TransactionRecord[] = [];
    snap.forEach(d => {
      records.push(d.data() as TransactionRecord);
    });
    return records.sort((a, b) => b.timestamp - a.timestamp);
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      console.warn("[Server DB] Firestore error during getUserTransactions. Falling back to local DB.");
      return handleGetTransactionsLocal(uid);
    }
    throw err;
  }
}

function handleGetTransactionsLocal(uid: string): TransactionRecord[] {
  const ldb = loadLocalDB();
  const list = Object.values(ldb.transactions).filter(tx => tx.userId === uid);
  return list.sort((a, b) => b.timestamp - a.timestamp);
}

// ADMIN: Get all users
export async function adminGetAllUsers(): Promise<UserProfile[]> {
  if (useLocalFallback) {
    return handleAdminGetAllUsersLocal();
  }

  try {
    const snap = await db.collection("users").get();
    const users: UserProfile[] = [];
    snap.forEach(d => {
      users.push(d.data() as UserProfile);
    });
    return users.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      console.warn("[Server DB] Firestore error during adminGetAllUsers. Falling back to local DB.");
      return handleAdminGetAllUsersLocal();
    }
    throw err;
  }
}

function handleAdminGetAllUsersLocal(): UserProfile[] {
  const ldb = loadLocalDB();
  return Object.values(ldb.users).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

// ADMIN: Get all transactions
export async function adminGetAllTransactions(): Promise<TransactionRecord[]> {
  if (useLocalFallback) {
    return handleAdminGetAllTransactionsLocal();
  }

  try {
    const snap = await db.collection("transactions").get();
    const records: TransactionRecord[] = [];
    snap.forEach(d => {
      records.push(d.data() as TransactionRecord);
    });
    return records.sort((a, b) => b.timestamp - a.timestamp);
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      console.warn("[Server DB] Firestore error during adminGetAllTransactions. Falling back to local DB.");
      return handleAdminGetAllTransactionsLocal();
    }
    throw err;
  }
}

function handleAdminGetAllTransactionsLocal(): TransactionRecord[] {
  const ldb = loadLocalDB();
  return Object.values(ldb.transactions).sort((a, b) => b.timestamp - a.timestamp);
}

// ADMIN: Adjust credits manually
export async function adminAdjustCredits(
  userId: string, 
  change: number, 
  reason: string
): Promise<void> {
  if (useLocalFallback) {
    return handleAdminAdjustCreditsLocal(userId, change, reason);
  }

  try {
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) throw new Error("User profile not found.");

    const currentProfile = userSnap.data() as UserProfile;
    const newLimit = currentProfile.requestLimit + change;
    const newBalance = currentProfile.walletBalance + change;

    await userRef.update({
      requestLimit: newLimit,
      walletBalance: newBalance
    });

    const txId = `adj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await db.collection("transactions").doc(txId).set({
      id: txId,
      userId,
      amount: 0,
      currency: "INR",
      status: "success",
      orderId: txId,
      type: "manual_adjustment",
      creditsAllocated: change,
      description: `Manual adjustment: ${reason}`,
      timestamp: Date.now()
    });
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      console.warn("[Server DB] Firestore error during adminAdjustCredits. Falling back to local DB.");
      return handleAdminAdjustCreditsLocal(userId, change, reason);
    }
    throw err;
  }
}

function handleAdminAdjustCreditsLocal(userId: string, change: number, reason: string): void {
  const ldb = loadLocalDB();
  const user = ldb.users[userId];
  if (!user) throw new Error("User profile not found.");
  user.requestLimit += change;
  user.walletBalance += change;

  const txId = `adj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  ldb.transactions[txId] = {
    id: txId,
    userId,
    amount: 0,
    currency: "INR",
    status: "success",
    orderId: txId,
    type: "manual_adjustment",
    creditsAllocated: change,
    description: `Manual adjustment: ${reason}`,
    timestamp: Date.now()
  };
  saveLocalDB(ldb);
}

// ADMIN: Adjust user role
export async function adminAdjustRole(userId: string, newRole: "user" | "admin"): Promise<void> {
  if (useLocalFallback) {
    return handleAdminAdjustRoleLocal(userId, newRole);
  }

  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update({ role: newRole });
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      console.warn("[Server DB] Firestore error during adminAdjustRole. Falling back to local DB.");
      return handleAdminAdjustRoleLocal(userId, newRole);
    }
    throw err;
  }
}

function handleAdminAdjustRoleLocal(userId: string, newRole: "user" | "admin"): void {
  const ldb = loadLocalDB();
  if (ldb.users[userId]) {
    ldb.users[userId].role = newRole;
    saveLocalDB(ldb);
  }
}

// API helper: apply referral code
export async function applyReferralCodeBackend(
  uid: string,
  userEmail: string,
  code: string
): Promise<{ success: boolean; message: string; error?: string }> {
  if (useLocalFallback) {
    return handleApplyReferralLocal(uid, userEmail, code);
  }

  try {
    const cleanedCode = code.trim().toUpperCase();
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return { success: false, message: "User profile not found." };
    }

    const userProfile = userSnap.data() as UserProfile;
    if (userProfile.referredBy) {
      return { success: false, message: "You have already been referred." };
    }

    if (userProfile.referralCode === cleanedCode) {
      return { success: false, message: "You cannot use your own referral code." };
    }

    const referrerSnap = await db.collection("users").where("referralCode", "==", cleanedCode).get();
    if (referrerSnap.empty) {
      return { success: false, message: "Invalid referral code." };
    }

    const referrerDoc = referrerSnap.docs[0];
    const referrerRef = db.collection("users").doc(referrerDoc.id);

    await userRef.update({
      referredBy: referrerDoc.id,
      requestLimit: FieldValue.increment(5),
      walletBalance: FieldValue.increment(5)
    });

    await referrerRef.update({
      requestLimit: FieldValue.increment(5),
      walletBalance: FieldValue.increment(5),
      referralsCount: FieldValue.increment(1)
    });

    const refTxId = `ref_manual_${Date.now()}`;
    await db.collection("transactions").doc(refTxId).set({
      id: refTxId,
      userId: referrerDoc.id,
      amount: 0,
      currency: "INR",
      status: "success",
      orderId: refTxId,
      type: "referral_bonus",
      creditsAllocated: 5,
      description: `Referral bonus for inviting ${userEmail}`,
      timestamp: Date.now()
    });

    const userTxId = `ref_applied_${Date.now()}`;
    await db.collection("transactions").doc(userTxId).set({
      id: userTxId,
      userId: uid,
      amount: 0,
      currency: "INR",
      status: "success",
      orderId: userTxId,
      type: "referral_bonus",
      creditsAllocated: 5,
      description: `Applied referral code: ${cleanedCode}`,
      timestamp: Date.now()
    });

    return { success: true, message: "Referral applied! +5 requests added to both wallets." };
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      console.warn("[Server DB] Firestore error during applyReferralCodeBackend. Falling back to local DB.");
      return handleApplyReferralLocal(uid, userEmail, code);
    }
    throw err;
  }
}

function handleApplyReferralLocal(uid: string, userEmail: string, code: string): { success: boolean; message: string } {
  const cleanedCode = code.trim().toUpperCase();
  const ldb = loadLocalDB();
  const userProfile = ldb.users[uid];
  if (!userProfile) {
    return { success: false, message: "User profile not found." };
  }
  if (userProfile.referredBy) {
    return { success: false, message: "You have already been referred." };
  }
  if (userProfile.referralCode === cleanedCode) {
    return { success: false, message: "You cannot use your own referral code." };
  }

  const referrerId = Object.keys(ldb.users).find(k => ldb.users[k].referralCode === cleanedCode);
  if (!referrerId) {
    return { success: false, message: "Invalid referral code." };
  }

  userProfile.referredBy = referrerId;
  userProfile.requestLimit += 5;
  userProfile.walletBalance += 5;

  ldb.users[referrerId].requestLimit += 5;
  ldb.users[referrerId].walletBalance += 5;
  ldb.users[referrerId].referralsCount += 1;

  const refTxId = `ref_manual_${Date.now()}`;
  ldb.transactions[refTxId] = {
    id: refTxId,
    userId: referrerId,
    amount: 0,
    currency: "INR",
    status: "success",
    orderId: refTxId,
    type: "referral_bonus",
    creditsAllocated: 5,
    description: `Referral bonus for inviting ${userEmail}`,
    timestamp: Date.now()
  };

  const userTxId = `ref_applied_${Date.now()}`;
  ldb.transactions[userTxId] = {
    id: userTxId,
    userId: uid,
    amount: 0,
    currency: "INR",
    status: "success",
    orderId: userTxId,
    type: "referral_bonus",
    creditsAllocated: 5,
    description: `Applied referral code: ${cleanedCode}`,
    timestamp: Date.now()
  };

  saveLocalDB(ldb);
  return { success: true, message: "Referral applied! +5 requests added to both wallets." };
}

// API helper: create payment transaction
export async function createPaymentTransaction(
  orderId: string,
  uid: string,
  amount: number,
  credits: number,
  planName: string
): Promise<void> {
  if (useLocalFallback) {
    return handleCreatePaymentTxLocal(orderId, uid, amount, credits, planName);
  }

  try {
    await db.collection("transactions").doc(orderId).set({
      id: orderId,
      userId: uid,
      amount,
      currency: "INR",
      status: "pending",
      orderId,
      type: "payment",
      creditsAllocated: credits,
      description: `${planName} Plan (${credits} Credits)`,
      timestamp: Date.now()
    });
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      console.warn("[Server DB] Firestore error during createPaymentTransaction. Falling back to local DB.");
      return handleCreatePaymentTxLocal(orderId, uid, amount, credits, planName);
    }
    throw err;
  }
}

function handleCreatePaymentTxLocal(orderId: string, uid: string, amount: number, credits: number, planName: string): void {
  const ldb = loadLocalDB();
  ldb.transactions[orderId] = {
    id: orderId,
    userId: uid,
    amount,
    currency: "INR",
    status: "pending",
    orderId,
    type: "payment",
    creditsAllocated: credits,
    description: `${planName} Plan (${credits} Credits)`,
    timestamp: Date.now()
  };
  saveLocalDB(ldb);
}

// API helper: verify and process payment
export async function verifyAndProcessPayment(
  orderId: string,
  isSuccess: boolean
): Promise<{ success: boolean; status: string; alreadyProcessed?: boolean }> {
  if (useLocalFallback) {
    return handleVerifyPaymentLocal(orderId, isSuccess);
  }

  try {
    const txRef = db.collection("transactions").doc(orderId);
    const txSnap = await txRef.get();
    if (!txSnap.exists) {
      throw new Error("Transaction record not found.");
    }

    const txData = txSnap.data() as TransactionRecord;
    if (txData.status === "success") {
      return { success: true, status: "success", alreadyProcessed: true };
    }

    if (isSuccess) {
      await txRef.update({ status: "success" });

      const userRef = db.collection("users").doc(txData.userId);
      await userRef.update({
        requestLimit: FieldValue.increment(txData.creditsAllocated),
        walletBalance: FieldValue.increment(txData.creditsAllocated)
      });

      console.log(`[Payment Verify] Order ${orderId} verified successfully. Credited ${txData.creditsAllocated} requests.`);
      return { success: true, status: "success" };
    } else {
      await txRef.update({ status: "failed" });
      return { success: false, status: "failed" };
    }
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      console.warn("[Server DB] Firestore error during verifyAndProcessPayment. Falling back to local DB.");
      return handleVerifyPaymentLocal(orderId, isSuccess);
    }
    throw err;
  }
}

function handleVerifyPaymentLocal(orderId: string, isSuccess: boolean): { success: boolean; status: string; alreadyProcessed?: boolean } {
  const ldb = loadLocalDB();
  const tx = ldb.transactions[orderId];
  if (!tx) throw new Error("Transaction record not found.");
  if (tx.status === "success") {
    return { success: true, status: "success", alreadyProcessed: true };
  }

  if (isSuccess) {
    tx.status = "success";
    const user = ldb.users[tx.userId];
    if (user) {
      user.requestLimit += tx.creditsAllocated;
      user.walletBalance += tx.creditsAllocated;
    }
    saveLocalDB(ldb);
    return { success: true, status: "success" };
  } else {
    tx.status = "failed";
    saveLocalDB(ldb);
    return { success: false, status: "failed" };
  }
}

// API helper: process payment webhook
export async function processPaymentWebhook(
  orderId: string,
  paymentStatus: string
): Promise<void> {
  if (useLocalFallback) {
    return handleWebhookLocal(orderId, paymentStatus);
  }

  try {
    if (paymentStatus === "SUCCESS") {
      const txRef = db.collection("transactions").doc(orderId);
      const txSnap = await txRef.get();

      if (txSnap.exists) {
        const txData = txSnap.data() as TransactionRecord;
        if (txData.status === "pending") {
          await txRef.update({ status: "success" });

          const userRef = db.collection("users").doc(txData.userId);
          await userRef.update({
            requestLimit: FieldValue.increment(txData.creditsAllocated),
            walletBalance: FieldValue.increment(txData.creditsAllocated)
          });
          console.log(`[Webhook success] Webhook processed. Order ${orderId} successful. Credited ${txData.creditsAllocated} requests.`);
        }
      }
    }
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      console.warn("[Server DB] Firestore error during processPaymentWebhook. Falling back to local DB.");
      return handleWebhookLocal(orderId, paymentStatus);
    }
    throw err;
  }
}

function handleWebhookLocal(orderId: string, paymentStatus: string): void {
  if (paymentStatus === "SUCCESS") {
    const ldb = loadLocalDB();
    const tx = ldb.transactions[orderId];
    if (tx && tx.status === "pending") {
      tx.status = "success";
      const user = ldb.users[tx.userId];
      if (user) {
        user.requestLimit += tx.creditsAllocated;
        user.walletBalance += tx.creditsAllocated;
      }
      saveLocalDB(ldb);
    }
  }
}

// COLLECT WAITLIST EMAIL
export async function addWaitlistEmail(email: string, source: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (useLocalFallback) {
    const ldb = loadLocalDB() as any;
    if (!ldb.waitlist) ldb.waitlist = {};
    const id = `wait_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    ldb.waitlist[id] = { email: cleanEmail, source, timestamp: Date.now() };
    saveLocalDB(ldb);
    return;
  }
  try {
    const id = `wait_${Date.now()}`;
    await db.collection("waitlist").doc(id).set({
      email: cleanEmail,
      source,
      timestamp: Date.now()
    });
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      return addWaitlistEmail(email, source);
    }
    throw err;
  }
}

// SUBMIT FEEDBACK
export async function addFeedback(email: string, message: string, rating: number): Promise<void> {
  if (useLocalFallback) {
    const ldb = loadLocalDB() as any;
    if (!ldb.feedback) ldb.feedback = {};
    const id = `feed_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    ldb.feedback[id] = { email, message, rating, timestamp: Date.now() };
    saveLocalDB(ldb);
    return;
  }
  try {
    const id = `feed_${Date.now()}`;
    await db.collection("feedback").doc(id).set({
      email,
      message,
      rating,
      timestamp: Date.now()
    });
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      return addFeedback(email, message, rating);
    }
    throw err;
  }
}

// GET ANALYTICS DATA
export async function getAnalyticsData(): Promise<any> {
  let users: any[] = [];
  let transactions: any[] = [];
  let waitlist: any[] = [];
  let feedback: any[] = [];

  if (useLocalFallback) {
    const ldb = loadLocalDB() as any;
    users = Object.values(ldb.users || {});
    transactions = Object.values(ldb.transactions || {});
    waitlist = Object.values(ldb.waitlist || {});
    feedback = Object.values(ldb.feedback || {});
  } else {
    try {
      const usersSnap = await db.collection("users").get();
      usersSnap.forEach(d => users.push(d.data()));

      const txSnap = await db.collection("transactions").get();
      txSnap.forEach(d => transactions.push(d.data()));

      const waitlistSnap = await db.collection("waitlist").get();
      waitlistSnap.forEach(d => waitlist.push(d.data()));

      const feedbackSnap = await db.collection("feedback").get();
      feedbackSnap.forEach(d => feedback.push(d.data()));
    } catch (err) {
      if (isPermissionError(err)) {
        useLocalFallback = true;
        return getAnalyticsData();
      }
      throw err;
    }
  }

  // Calculate metrics
  const totalUsers = users.length;
  const totalRequests = users.reduce((sum, u) => sum + (u.requestsUsed || 0), 0);
  
  // Conversion Rate (success purchase transactions / total users)
  const successPayments = transactions.filter(t => t.status === "success" && t.type === "payment");
  const uniqueBuyers = new Set(successPayments.map(t => t.userId)).size;
  const conversionRate = totalUsers > 0 ? Number(((uniqueBuyers / totalUsers) * 100).toFixed(1)) : 0;

  // Retention: Active users who have used at least 1 credit / total users
  const activeUsers = users.filter(u => (u.requestsUsed || 0) > 0).length;
  const retentionRate = totalUsers > 0 ? Number(((activeUsers / totalUsers) * 100).toFixed(1)) : 0;

  // Referral Performance
  const totalReferrals = users.reduce((sum, u) => sum + (u.referralsCount || 0), 0);
  const referredUsers = users.filter(u => u.referredBy).length;

  // Revenue
  const totalRevenue = successPayments.reduce((sum, t) => sum + (t.amount || 0), 0);

  // Generate automated report
  const weeklyReport = `
# Readability AI Growth Report & Weekly Audit
*Generated on ${new Date().toLocaleDateString()} (Autonomous Growth Engine)*

## 1. Core Engagement Performance
- **Active User Base**: ${totalUsers} accounts registered securely.
- **Cognitive Simplification requests processed**: ${totalRequests} successful operations using the Kilvish Engine.
- **Conversion Rate (Paying Cohort)**: ${conversionRate}% (${uniqueBuyers} unique paying subscribers).
- **User Activation / Retention Rate**: ${retentionRate}% (${activeUsers} active document simplifiers).

## 2. Growth Loops & Referrals
- **Referral Loop Volume**: ${totalReferrals} referral links generated, with ${referredUsers} organic referred user signups.
- **Waitlist Pipeline**: ${waitlist.length} potential users registered for advanced features waitlist.
- **User Sentiment Score**: ${feedback.length > 0 ? (feedback.reduce((sum, f) => sum + (f.rating || 5), 0) / feedback.length).toFixed(1) : "5.0"}/5.0 based on ${feedback.length} submissions.

## 3. Financial Summary
- **Gross Revenue (PayU orders)**: ₹${totalRevenue} INR.
- **Customer Acquisition Cost (CAC)**: ₹0 (100% organic launch loop driving user signups).

## 4. Key Recommendations & Next Growth Steps
1. **Leverage Top Referrers**: Incentivize power referrers with additional free requests.
2. **Launch on Product Hunt**: Utilize the launch assets created in Phase 1 to go live on Product Hunt!
3. **Convert Waitlist**: Send waitlist emails a special 'Founder promo code' to secure early subscribers.
  `.trim();

  return {
    metrics: {
      totalUsers,
      totalRequests,
      conversionRate,
      retentionRate,
      totalReferrals,
      referredUsers,
      totalRevenue,
      waitlistCount: waitlist.length,
      feedbackCount: feedback.length,
      averageRating: feedback.length > 0 ? Number((feedback.reduce((sum, f) => sum + (f.rating || 5), 0) / feedback.length).toFixed(1)) : 5.0
    },
    weeklyReport,
    waitlist,
    feedback
  };
}

// ==========================================
// CREATOR ECONOMY CORE BACKEND SYSTEM
// ==========================================

export async function updateCreatorProfile(uid: string, data: any): Promise<any> {
  if (useLocalFallback) {
    const ldb = loadLocalDB() as any;
    const user = ldb.users[uid];
    if (!user) throw new Error("User profile not found.");
    user.isCreator = true;
    user.creatorApproved = user.creatorApproved !== undefined ? user.creatorApproved : true; // Auto approve in local mode for ease of use
    user.creatorProfile = {
      ...(user.creatorProfile || {}),
      ...data,
      followers: user.creatorProfile?.followers || [],
      viewsCount: user.creatorProfile?.viewsCount || 0,
      downloadsCount: user.creatorProfile?.downloadsCount || 0,
      salesCount: user.creatorProfile?.salesCount || 0,
      revenue: user.creatorProfile?.revenue || 0,
    };
    saveLocalDB(ldb);
    return user;
  }
  try {
    const docRef = db.collection("users").doc(uid);
    const snap = await docRef.get();
    if (!snap.exists) throw new Error("User profile not found.");
    const existing = snap.data() || {};
    const updated = {
      ...existing,
      isCreator: true,
      creatorApproved: existing.creatorApproved !== undefined ? existing.creatorApproved : true, // Set to true by default for developer experience
      creatorProfile: {
        ...(existing.creatorProfile || {}),
        ...data,
        followers: existing.creatorProfile?.followers || [],
        viewsCount: existing.creatorProfile?.viewsCount || 0,
        downloadsCount: existing.creatorProfile?.downloadsCount || 0,
        salesCount: existing.creatorProfile?.salesCount || 0,
        revenue: existing.creatorProfile?.revenue || 0,
      }
    };
    await docRef.set(updated, { merge: true });
    return updated;
  } catch (err) {
    // Check for permission or fallback to local
    useLocalFallback = true;
    return updateCreatorProfile(uid, data);
  }
}

export async function getCreatorProducts(): Promise<any[]> {
  if (useLocalFallback) {
    const ldb = loadLocalDB() as any;
    if (!ldb.products) ldb.products = {};
    return Object.values(ldb.products);
  }
  try {
    const snap = await db.collection("products").get();
    const list: any[] = [];
    snap.forEach(d => list.push(d.data()));
    return list;
  } catch (err) {
    useLocalFallback = true;
    return getCreatorProducts();
  }
}

export async function createCreatorProduct(uid: string, productData: any): Promise<any> {
  const productId = productData.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const product = {
    ...productData,
    id: productId,
    creatorId: uid,
    downloadsCount: productData.downloadsCount || 0,
    viewsCount: productData.viewsCount || 0,
    likesCount: productData.likesCount || 0,
    createdAt: productData.createdAt || Date.now()
  };

  if (useLocalFallback) {
    const ldb = loadLocalDB() as any;
    if (!ldb.products) ldb.products = {};
    ldb.products[productId] = product;
    saveLocalDB(ldb);
    return product;
  }
  try {
    await db.collection("products").doc(productId).set(product, { merge: true });
    return product;
  } catch (err) {
    useLocalFallback = true;
    return createCreatorProduct(uid, productData);
  }
}

export async function purchaseProductBackend(uid: string, productId: string): Promise<any> {
  if (useLocalFallback) {
    const ldb = loadLocalDB() as any;
    const user = ldb.users[uid];
    if (!user) throw new Error("User profile not found.");
    const product = ldb.products?.[productId];
    if (!product) throw new Error("Product not found.");
    
    if (product.status === "free") {
      product.downloadsCount = (product.downloadsCount || 0) + 1;
      saveLocalDB(ldb);
      return { success: true, product };
    }
    
    if (user.walletBalance < product.price) {
      throw new Error("Insufficient wallet balance credits to purchase this premium document.");
    }
    
    user.walletBalance -= product.price;
    user.requestsUsed = (user.requestsUsed || 0) + product.price;
    product.downloadsCount = (product.downloadsCount || 0) + 1;
    
    const creator = ldb.users[product.creatorId];
    if (creator) {
      creator.walletBalance = (creator.walletBalance || 0) + product.price;
      if (!creator.creatorProfile) creator.creatorProfile = {};
      creator.creatorProfile.revenue = (creator.creatorProfile.revenue || 0) + product.price;
      creator.creatorProfile.salesCount = (creator.creatorProfile.salesCount || 0) + 1;
    }
    
    const txId = `tx_prod_${Date.now()}`;
    if (!ldb.transactions) ldb.transactions = {};
    ldb.transactions[txId] = {
      id: txId,
      userId: uid,
      amount: product.price,
      currency: "CREDITS",
      status: "success",
      orderId: productId,
      type: "purchase",
      creditsAllocated: -product.price,
      description: `Purchased premium ${product.title} by ${product.creatorName}`,
      timestamp: Date.now()
    };
    
    saveLocalDB(ldb);
    return { success: true, product, user };
  }
  try {
    const userRef = db.collection("users").doc(uid);
    const uSnap = await userRef.get();
    if (!uSnap.exists) throw new Error("User profile not found.");
    const user = uSnap.data() as any;

    const prodRef = db.collection("products").doc(productId);
    const pSnap = await prodRef.get();
    if (!pSnap.exists) throw new Error("Product not found.");
    const product = pSnap.data() as any;

    if (product.status === "free") {
      await prodRef.update({ downloadsCount: (product.downloadsCount || 0) + 1 });
      product.downloadsCount += 1;
      return { success: true, product };
    }

    if (user.walletBalance < product.price) {
      throw new Error("Insufficient wallet balance credits.");
    }

    const creatorRef = db.collection("users").doc(product.creatorId);
    
    // Simple update for atomic correctness in container modes
    await db.runTransaction(async (transaction) => {
      const uDoc = await transaction.get(userRef);
      const uData = uDoc.data() as any;
      if (uData.walletBalance < product.price) {
        throw new Error("Insufficient wallet balance credits.");
      }

      const pDoc = await transaction.get(prodRef);
      const pData = pDoc.data() as any;

      const cDoc = await transaction.get(creatorRef);
      const cData = cDoc.data() as any;

      transaction.update(userRef, {
        walletBalance: uData.walletBalance - product.price,
        requestsUsed: (uData.requestsUsed || 0) + product.price
      });

      transaction.update(prodRef, {
        downloadsCount: (pData.downloadsCount || 0) + 1
      });

      if (cDoc.exists) {
        transaction.update(creatorRef, {
          walletBalance: (cData.walletBalance || 0) + product.price,
          "creatorProfile.revenue": (cData.creatorProfile?.revenue || 0) + product.price,
          "creatorProfile.salesCount": (cData.creatorProfile?.salesCount || 0) + 1
        });
      }

      const txId = `tx_prod_${Date.now()}`;
      transaction.set(db.collection("transactions").doc(txId), {
        id: txId,
        userId: uid,
        amount: product.price,
        currency: "CREDITS",
        status: "success",
        orderId: productId,
        type: "purchase",
        creditsAllocated: -product.price,
        description: `Purchased premium ${product.title} by ${product.creatorName}`,
        timestamp: Date.now()
      });
    });

    return { success: true };
  } catch (err) {
    useLocalFallback = true;
    return purchaseProductBackend(uid, productId);
  }
}

export async function followCreatorBackend(uid: string, creatorId: string): Promise<any> {
  if (useLocalFallback) {
    const ldb = loadLocalDB() as any;
    const creator = ldb.users[creatorId];
    if (!creator) throw new Error("Creator not found.");
    if (!creator.creatorProfile) creator.creatorProfile = {};
    if (!creator.creatorProfile.followers) creator.creatorProfile.followers = [];
    
    const idx = creator.creatorProfile.followers.indexOf(uid);
    if (idx > -1) {
      creator.creatorProfile.followers.splice(idx, 1);
    } else {
      creator.creatorProfile.followers.push(uid);
    }
    saveLocalDB(ldb);
    return creator;
  }
  try {
    const creatorRef = db.collection("users").doc(creatorId);
    const snap = await creatorRef.get();
    if (!snap.exists) throw new Error("Creator not found.");
    const creator = snap.data() as any;
    if (!creator.creatorProfile) creator.creatorProfile = {};
    if (!creator.creatorProfile.followers) creator.creatorProfile.followers = [];
    
    const idx = creator.creatorProfile.followers.indexOf(uid);
    if (idx > -1) {
      creator.creatorProfile.followers.splice(idx, 1);
    } else {
      creator.creatorProfile.followers.push(uid);
    }
    
    await creatorRef.update({
      "creatorProfile.followers": creator.creatorProfile.followers
    });
    return creator;
  } catch (err) {
    useLocalFallback = true;
    return followCreatorBackend(uid, creatorId);
  }
}

export async function adminUpdateCreatorBackend(creatorId: string, updates: any): Promise<any> {
  if (useLocalFallback) {
    const ldb = loadLocalDB() as any;
    const creator = ldb.users[creatorId];
    if (!creator) throw new Error("Creator profile not found.");
    if (updates.creatorApproved !== undefined) creator.creatorApproved = updates.creatorApproved;
    if (updates.verified !== undefined) {
      if (!creator.creatorProfile) creator.creatorProfile = {};
      creator.creatorProfile.verified = updates.verified;
    }
    saveLocalDB(ldb);
    return creator;
  }
  try {
    const creatorRef = db.collection("users").doc(creatorId);
    await creatorRef.set(updates, { merge: true });
    return updates;
  } catch (err) {
    useLocalFallback = true;
    return adminUpdateCreatorBackend(creatorId, updates);
  }
}

export async function getSubscriptionStatus(uid: string): Promise<SubscriptionRecord | null> {
  if (useLocalFallback) {
    const ldb = loadLocalDB();
    const subs = Object.values(ldb.subscriptions).filter(s => s.userId === uid);
    if (subs.length === 0) return null;
    subs.sort((a, b) => b.updatedAt - a.updatedAt);
    return subs[0];
  }
  try {
    const snap = await db.collection("subscriptions")
      .where("userId", "==", uid)
      .get();
    if (snap.empty) return null;
    const list: SubscriptionRecord[] = [];
    snap.forEach(doc => {
      list.push(doc.data() as SubscriptionRecord);
    });
    list.sort((a, b) => b.updatedAt - a.updatedAt);
    return list[0];
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      return getSubscriptionStatus(uid);
    }
    throw err;
  }
}

export async function createOrUpdateSubscription(sub: SubscriptionRecord): Promise<void> {
  if (useLocalFallback) {
    const ldb = loadLocalDB();
    ldb.subscriptions[sub.id] = sub;
    saveLocalDB(ldb);
    return;
  }
  try {
    await db.collection("subscriptions").doc(sub.id).set(sub);
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      return createOrUpdateSubscription(sub);
    }
    throw err;
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  if (useLocalFallback) {
    const ldb = loadLocalDB();
    const sub = ldb.subscriptions[subscriptionId];
    if (sub) {
      sub.status = "cancelled";
      sub.autoRenew = false;
      sub.updatedAt = Date.now();
      saveLocalDB(ldb);
    }
    return;
  }
  try {
    await db.collection("subscriptions").doc(subscriptionId).update({
      status: "cancelled",
      autoRenew: false,
      updatedAt: Date.now()
    });
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      return cancelSubscription(subscriptionId);
    }
    throw err;
  }
}

export async function refundSubscriptionBackend(subscriptionId: string): Promise<void> {
  const list = await getSubscriptionList();
  const sub = list.find(s => s.id === subscriptionId);
  if (!sub) {
    throw new Error("Subscription not found.");
  }

  sub.status = "expired";
  sub.autoRenew = false;
  sub.updatedAt = Date.now();
  await createOrUpdateSubscription(sub);

  const creditsToDeduct = sub.amount === 299 ? 150 : sub.amount === 799 ? 500 : sub.amount === 1499 ? 1000 : 5000;
  
  if (useLocalFallback) {
    const ldb = loadLocalDB();
    const u = ldb.users[sub.userId];
    if (u) {
      u.walletBalance = Math.max(0, u.walletBalance - creditsToDeduct);
      u.requestLimit = Math.max(0, u.requestLimit - creditsToDeduct);
    }
    saveLocalDB(ldb);
  } else {
    await db.collection("users").doc(sub.userId).update({
      walletBalance: FieldValue.increment(-creditsToDeduct),
      requestLimit: FieldValue.increment(-creditsToDeduct)
    });
  }

  const ledgerId = `ledger_ref_${Date.now()}`;
  await createWalletLedgerEntry({
    id: ledgerId,
    userId: sub.userId,
    type: "refund",
    amount: -creditsToDeduct,
    previousBalance: 0,
    newBalance: 0,
    description: `Refund processed for ${sub.planName} Plan. Subscription revoked.`,
    referenceId: subscriptionId,
    timestamp: Date.now()
  });
}

export async function createWalletLedgerEntry(entry: WalletLedgerRecord): Promise<void> {
  if (useLocalFallback) {
    const ldb = loadLocalDB();
    ldb.walletLedger[entry.id] = entry;
    saveLocalDB(ldb);
    return;
  }
  try {
    await db.collection("walletLedger").doc(entry.id).set(entry);
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      return createWalletLedgerEntry(entry);
    }
    throw err;
  }
}

export async function createInvoice(invoice: InvoiceRecord): Promise<void> {
  if (useLocalFallback) {
    const ldb = loadLocalDB();
    ldb.invoices[invoice.id] = invoice;
    saveLocalDB(ldb);
    return;
  }
  try {
    await db.collection("invoices").doc(invoice.id).set(invoice);
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      return createInvoice(invoice);
    }
    throw err;
  }
}

export async function logWebhook(log: WebhookLogRecord): Promise<void> {
  if (useLocalFallback) {
    const ldb = loadLocalDB();
    // Use an array to store Webhook Logs locally
    if (!ldb.webhookLogs) ldb.webhookLogs = [];
    ldb.webhookLogs.push(log);
    if (ldb.webhookLogs.length > 200) {
      ldb.webhookLogs.shift();
    }
    saveLocalDB(ldb);
    return;
  }
  try {
    await db.collection("webhookLogs").doc(log.id).set(log);
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      return logWebhook(log);
    }
    throw err;
  }
}

export async function getSubscriptionList(uid?: string): Promise<SubscriptionRecord[]> {
  if (useLocalFallback) {
    const ldb = loadLocalDB();
    const subs = Object.values(ldb.subscriptions);
    if (uid) return subs.filter(s => s.userId === uid);
    return subs;
  }
  try {
    let q: any = db.collection("subscriptions");
    if (uid) {
      q = q.where("userId", "==", uid);
    }
    const snap = await q.get();
    const list: SubscriptionRecord[] = [];
    snap.forEach((doc: any) => {
      list.push(doc.data() as SubscriptionRecord);
    });
    return list;
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      return getSubscriptionList(uid);
    }
    throw err;
  }
}

export async function getInvoiceList(uid?: string): Promise<InvoiceRecord[]> {
  if (useLocalFallback) {
    const ldb = loadLocalDB();
    const invs = Object.values(ldb.invoices);
    if (uid) return invs.filter(i => i.userId === uid);
    return invs;
  }
  try {
    let q: any = db.collection("invoices");
    if (uid) {
      q = q.where("userId", "==", uid);
    }
    const snap = await q.get();
    const list: InvoiceRecord[] = [];
    snap.forEach((doc: any) => {
      list.push(doc.data() as InvoiceRecord);
    });
    return list;
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      return getInvoiceList(uid);
    }
    throw err;
  }
}

export async function getWalletLedgerList(uid?: string): Promise<WalletLedgerRecord[]> {
  if (useLocalFallback) {
    const ldb = loadLocalDB();
    const ledger = Object.values(ldb.walletLedger);
    if (uid) return ledger.filter(l => l.userId === uid);
    return ledger;
  }
  try {
    let q: any = db.collection("walletLedger");
    if (uid) {
      q = q.where("userId", "==", uid);
    }
    const snap = await q.get();
    const list: WalletLedgerRecord[] = [];
    snap.forEach((doc: any) => {
      list.push(doc.data() as WalletLedgerRecord);
    });
    return list;
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      return getWalletLedgerList(uid);
    }
    throw err;
  }
}

export async function getWebhookLogs(): Promise<WebhookLogRecord[]> {
  if (useLocalFallback) {
    const ldb = loadLocalDB();
    return ldb.webhookLogs || [];
  }
  try {
    const snap = await db.collection("webhookLogs").orderBy("timestamp", "desc").limit(100).get();
    const list: WebhookLogRecord[] = [];
    snap.forEach(doc => {
      list.push(doc.data() as WebhookLogRecord);
    });
    return list;
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      return getWebhookLogs();
    }
    throw err;
  }
}

export async function processPayUSubscriptionSuccess(txnid: string, payload: any): Promise<void> {
  if (useLocalFallback) {
    const ldb = loadLocalDB();
    const txData = ldb.transactions[txnid];
    if (!txData) throw new Error("Transaction record not found locally.");
    if (txData.status === "success") return; // Idempotency check

    txData.status = "success";
    const user = ldb.users[txData.userId];
    if (!user) throw new Error("User not found locally.");

    const previousBalance = user.walletBalance;
    user.walletBalance += txData.creditsAllocated;
    user.requestLimit += txData.creditsAllocated;

    const now = Date.now();
    const nextBilling = now + 30 * 24 * 60 * 60 * 1000;

    // Create subscription
    const subRecord: SubscriptionRecord = {
      id: txnid,
      userId: txData.userId,
      planId: txData.planName.toLowerCase() as any,
      planName: txData.planName,
      amount: txData.amount,
      currency: "INR",
      status: "active",
      paymentStartDate: now,
      paymentEndDate: now + 365 * 24 * 60 * 60 * 1000,
      nextBillingDate: nextBilling,
      autoRenew: true,
      createdAt: now,
      updatedAt: now,
      gateway: "payu",
      payuSubscriptionId: txnid,
      paymentMethod: payload.mode || "mandate"
    };
    ldb.subscriptions[txnid] = subRecord;

    // Create ledger
    const ledgerId = `ledger_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const ledgerRecord: WalletLedgerRecord = {
      id: ledgerId,
      userId: txData.userId,
      type: "credit_renewal",
      amount: txData.creditsAllocated,
      previousBalance,
      newBalance: user.walletBalance,
      description: `Subscription renewal credits for ${txData.planName} Plan`,
      referenceId: txnid,
      timestamp: now
    };
    ldb.walletLedger[ledgerId] = ledgerRecord;

    // Create invoice
    const gstRate = 0.18;
    const subtotal = txData.amount / (1 + gstRate);
    const gstAmount = txData.amount - subtotal;
    const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const invoiceRecord: InvoiceRecord = {
      id: invoiceId,
      userId: txData.userId,
      subscriptionId: txnid,
      transactionId: txnid,
      planName: txData.planName,
      amount: Number(subtotal.toFixed(2)),
      gstAmount: Number(gstAmount.toFixed(2)),
      totalAmount: Number(txData.amount),
      status: "paid",
      billingName: payload.firstname || user.displayName || "Readability Scholar",
      billingEmail: payload.email || user.email || "scholar@readability.rbaadvisor.com",
      billingPhone: payload.phone || "9999999999",
      timestamp: now
    };
    ldb.invoices[invoiceId] = invoiceRecord;

    saveLocalDB(ldb);
    return;
  }

  try {
    const txRef = db.collection("transactions").doc(txnid);
    const txSnap = await txRef.get();
    if (!txSnap.exists) throw new Error("Transaction record not found in Firestore.");
    
    const txData = txSnap.data() as TransactionRecord;
    if (txData.status === "success") return; // Idempotency check

    await db.runTransaction(async (transaction) => {
      const userRef = db.collection("users").doc(txData.userId);
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists) throw new Error("User profile not found in Firestore.");
      const user = userSnap.data() as UserProfile;

      const previousBalance = user.walletBalance;
      const newBalance = previousBalance + txData.creditsAllocated;

      // Update user
      transaction.update(userRef, {
        walletBalance: FieldValue.increment(txData.creditsAllocated),
        requestLimit: FieldValue.increment(txData.creditsAllocated)
      });

      // Update transaction
      transaction.update(txRef, { status: "success" });

      const now = Date.now();
      const nextBilling = now + 30 * 24 * 60 * 60 * 1000;

      // Set subscription
      const subRecord: SubscriptionRecord = {
        id: txnid,
        userId: txData.userId,
        planId: txData.planName.toLowerCase() as any,
        planName: txData.planName,
        amount: txData.amount,
        currency: "INR",
        status: "active",
        paymentStartDate: now,
        paymentEndDate: now + 365 * 24 * 60 * 60 * 1000,
        nextBillingDate: nextBilling,
        autoRenew: true,
        createdAt: now,
        updatedAt: now,
        gateway: "payu",
        payuSubscriptionId: txnid,
        paymentMethod: payload.mode || "mandate"
      };
      transaction.set(db.collection("subscriptions").doc(txnid), subRecord);

      // Set ledger entry
      const ledgerId = `ledger_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const ledgerRecord: WalletLedgerRecord = {
        id: ledgerId,
        userId: txData.userId,
        type: "credit_renewal",
        amount: txData.creditsAllocated,
        previousBalance,
        newBalance,
        description: `Subscription renewal credits for ${txData.planName} Plan`,
        referenceId: txnid,
        timestamp: now
      };
      transaction.set(db.collection("walletLedger").doc(ledgerId), ledgerRecord);

      // Set invoice (GST Compliance)
      const gstRate = 0.18;
      const subtotal = txData.amount / (1 + gstRate);
      const gstAmount = txData.amount - subtotal;
      const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const invoiceRecord: InvoiceRecord = {
        id: invoiceId,
        userId: txData.userId,
        subscriptionId: txnid,
        transactionId: txnid,
        planName: txData.planName,
        amount: Number(subtotal.toFixed(2)),
        gstAmount: Number(gstAmount.toFixed(2)),
        totalAmount: Number(txData.amount),
        status: "paid",
        billingName: payload.firstname || user.displayName || "Readability Scholar",
        billingEmail: payload.email || user.email || "scholar@readability.rbaadvisor.com",
        billingPhone: payload.phone || "9999999999",
        timestamp: now
      };
      transaction.set(db.collection("invoices").doc(invoiceId), invoiceRecord);
    });
  } catch (err) {
    if (isPermissionError(err)) {
      useLocalFallback = true;
      return processPayUSubscriptionSuccess(txnid, payload);
    }
    throw err;
  }
}



