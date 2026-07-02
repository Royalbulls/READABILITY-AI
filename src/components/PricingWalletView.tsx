import React, { useState, useEffect } from "react";
import { CreditCard, ShieldCheck, Zap, Heart, Gift, Copy, Check, Users, RefreshCw, AlertTriangle, X, Info, Download, Trash, CheckCircle } from "lucide-react";
import { User as FirebaseUser } from "../lib/firebase";
import { UserProfile, TransactionRecord } from "../types";

interface PricingWalletViewProps {
  user: FirebaseUser;
  userProfile: UserProfile | null;
  onRefreshProfile: () => void;
}

// FEATURE FLAG FOR HACKATHON PROTO-SUBMISSION
const DISABLE_PAYMENTS_FOR_HACKATHON = true;

export default function PricingWalletView({ user, userProfile, onRefreshProfile }: PricingWalletViewProps) {
  const [activeTab, setActiveTab] = useState<"plans" | "history" | "invoices">("plans");
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);
  
  // Referral states
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [applyingReferral, setApplyingReferral] = useState(false);
  const [referralSuccess, setReferralSuccess] = useState("");
  const [referralError, setReferralError] = useState("");
  const [copied, setCopied] = useState(false);

  // PayU Subscription states
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [subDetails, setSubDetails] = useState<any>(null);
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingSub, setLoadingSub] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState<{
    success: boolean;
    orderId: string;
    creditsAllocated: number;
    amount: number;
    isMock: boolean;
  } | null>(null);

  // Parse URL parameters for PayU callbacks on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payuStatus = params.get("payu_status");
    const orderId = params.get("order_id");
    
    if (payuStatus && orderId) {
      if (payuStatus === "success") {
        const lowerId = orderId.toLowerCase();
        const credits = lowerId.includes("starter") ? 150 : lowerId.includes("pro") ? 500 : lowerId.includes("creator") ? 1000 : lowerId.includes("enterprise") ? 5000 : 150;
        const amount = lowerId.includes("starter") ? 299 : lowerId.includes("pro") ? 799 : lowerId.includes("creator") ? 1499 : lowerId.includes("enterprise") ? 4999 : 299;
        setPaymentStatus({
          success: true,
          orderId: orderId,
          creditsAllocated: credits,
          amount: amount,
          isMock: false
        });
        onRefreshProfile();
        fetchTransactions();
        fetchSubscriptionStatus();
        
        // Clean URL query parameters so the message doesn't keep showing on refresh
        window.history.replaceState({}, document.title, window.location.pathname + "?view=pricing");
      } else if (payuStatus === "failed") {
        setCustomAlert({
          title: "Subscription Failed",
          message: `Your PayU subscription payment (Order: ${orderId}) failed or was canceled. Please try again.`,
          type: "error"
        });
        window.history.replaceState({}, document.title, window.location.pathname + "?view=pricing");
      }
    }
  }, []);

  // Beautiful Custom Dialog States to bypass blocked iframe window.confirm & window.alert
  const [customAlert, setCustomAlert] = useState<{ title: string; message: string; type: "error" | "success" | "info" } | null>(null);
  const [simulatedCheckout, setSimulatedCheckout] = useState<{
    planName: string;
    order_id: string;
    order_amount: number;
    credits: number;
  } | null>(null);

  // Load transaction logs
  const fetchTransactions = async () => {
    if (!user) return;
    setLoadingTx(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/user/transactions", {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Failed to load user transactions:", err);
    } finally {
      setLoadingTx(false);
    }
  };

  // Load active subscription, invoices and ledger balance statements
  const fetchSubscriptionStatus = async () => {
    if (!user) return;
    setLoadingSub(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/subscription/status", {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubDetails(data.subscription);
        setLedgers(data.ledger || []);
        setInvoices(data.invoices || []);
      }
    } catch (err) {
      console.error("Failed to load subscription status:", err);
    } finally {
      setLoadingSub(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchSubscriptionStatus();
  }, [user]);

  const copyReferralCode = () => {
    if (!userProfile?.referralCode) return;
    navigator.clipboard.writeText(userProfile.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralCodeInput.trim()) return;

    setApplyingReferral(true);
    setReferralSuccess("");
    setReferralError("");

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/user/apply-referral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ code: referralCodeInput })
      });
      const data = await res.json();
      if (!res.ok) {
        setReferralError(data.error || "Failed to apply referral code.");
      } else {
        setReferralSuccess(data.message);
        setReferralCodeInput("");
        onRefreshProfile();
        fetchTransactions();
      }
    } catch (err) {
      setReferralError("Network error. Please try again.");
    } finally {
      setApplyingReferral(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;
    setLoadingSub(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (res.ok) {
        setCustomAlert({
          title: "Subscription Cancelled",
          message: "Auto-renewal has been successfully turned off. You will remain on your plan until the current billing cycle expires.",
          type: "success"
        });
        fetchSubscriptionStatus();
        onRefreshProfile();
      } else {
        const d = await res.json();
        setCustomAlert({
          title: "Cancellation Failed",
          message: d.error || "Failed to cancel your subscription.",
          type: "error"
        });
      }
    } catch (err: any) {
      setCustomAlert({
        title: "Connection Error",
        message: err.message,
        type: "error"
      });
    } finally {
      setLoadingSub(false);
    }
  };

  const confirmSimulatedPayment = async (orderId: string, credits: number, amount: number, planName: string) => {
    setSimulatedCheckout(null);
    setCheckoutLoading(planName.toLowerCase());
    try {
      // Simulate real callback to test webhook or callback success logic
      const idToken = await user.getIdToken();
      
      // Call secure webhook verification endpoint via simulated callback triggers in backend
      const verifyRes = await fetch("/api/payu/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          txnid: orderId,
          status: "success",
          amount: String(amount),
          productinfo: `${planName} Subscription - Readability AI`,
          firstname: userProfile?.displayName || "Readability Scholar",
          email: userProfile?.email || "scholar@readability.ai",
          phone: "9999999999",
          mode: "CC"
        })
      });

      if (verifyRes.ok) {
        setPaymentStatus({
          success: true,
          orderId: orderId,
          creditsAllocated: credits,
          amount: amount,
          isMock: true
        });
        onRefreshProfile();
        fetchTransactions();
        fetchSubscriptionStatus();
      } else {
        setCustomAlert({
          title: "Simulation Failed",
          message: "Payment simulation verification failed or was declined by the server.",
          type: "error"
        });
      }
    } catch (err: any) {
      setCustomAlert({
        title: "Connection Error",
        message: "Failed to connect to billing simulation server: " + err.message,
        type: "error"
      });
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleBuyPlan = async (planId: string) => {
    if (DISABLE_PAYMENTS_FOR_HACKATHON) {
      setCustomAlert({
        title: "Hackathon Preview Mode",
        message: `The ${planId.toUpperCase()} subscription tier is in Hackathon Preview. Real payments and credit card transactions are temporarily disabled for the Google Cloud Hackathon. \n\nAll accounts have been allocated preview credits so you can evaluate the platform's advanced features for free!`,
        type: "info"
      });
      return;
    }
    setCheckoutLoading(planId);
    setPaymentStatus(null);
    try {
      const idToken = await user.getIdToken();
      
      const res = await fetch("/api/payu/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ planId })
      });

      const data = await res.json();
      if (!res.ok) {
        // If developer merchant credentials are not configured, offer high-quality Sandbox simulation instantly
        if (res.status === 400 && data.error?.includes("missing")) {
          const simulatedTxnid = `sub_${Date.now()}_sim`;
          const credits = planId === "starter" ? 150 : planId === "pro" ? 500 : planId === "creator" ? 1000 : planId === "enterprise" ? 5000 : 150;
          const amount = planId === "starter" ? 299 : planId === "pro" ? 799 : planId === "creator" ? 1499 : planId === "enterprise" ? 4999 : 299;
          
          // Pre-log pending simulation transaction
          const preRes = await fetch("/api/payu/create-subscription", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`
            },
            body: JSON.stringify({ planId, simulatePending: true })
          }).catch(() => null);

          setSimulatedCheckout({
            planName: planId.toUpperCase(),
            order_id: simulatedTxnid,
            order_amount: amount,
            credits: credits
          });
          return;
        }

        setCustomAlert({
          title: "Subscription Failed",
          message: data.error || "Failed to initiate PayU subscription session.",
          type: "error"
        });
        setCheckoutLoading(null);
        return;
      }

      // Real PayU redirection via dynamic POST form submission (handles standing instructions)
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.payuUrl;
      form.target = "_blank";
      
      Object.entries(data.params).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      console.error(err);
      setCustomAlert({
        title: "Billing Error",
        message: "Billing connection error: " + err.message,
        type: "error"
      });
    } finally {
      setCheckoutLoading(null);
    }
  };

  const plans = [
    {
      id: "starter",
      name: "Starter Scholar",
      price: "₹299",
      subtext: "Great for casual learning",
      credits: "150 requests/month",
      isFree: false,
      features: [
        "150 recurring search & learn requests",
        "Auto-renews monthly via PayU",
        "Priority model response latency",
        "Support for all academic presets",
        "Full image OCR support"
      ]
    },
    {
      id: "pro",
      name: "Pro Academic",
      price: "₹799",
      subtext: "Most popular for intensive studies",
      credits: "500 requests/month",
      isFree: false,
      popular: true,
      features: [
        "500 recurring premium AI query requests",
        "Auto-renews monthly via PayU",
        "Elite intelligence modes unlocked",
        "Advanced deep academic course modules",
        "Direct PDF/Document ingestion"
      ]
    },
    {
      id: "creator",
      name: "Creator Studio",
      price: "₹1499",
      subtext: "Designed for expert educators",
      credits: "1000 requests/month",
      isFree: false,
      features: [
        "1000 recurring premium query requests",
        "Auto-renews monthly via PayU",
        "Full workspace collaboration controls",
        "Custom course syllabus generator",
        "VIP customer priority help desk"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise Elite",
      price: "₹4999",
      subtext: "Enterprise volume & custom API integration",
      credits: "5000 requests/month",
      isFree: false,
      features: [
        "5000 recurring premium requests",
        "Dedicated workspace bandwidth",
        "Custom Google Classroom sync API",
        "Full business administration dashboard",
        "Dedicated success architect account manager"
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-[80vh] py-6 px-4 md:px-8 w-full max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Wallet Summary Banner */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fadeIn">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded">
            Your Clarity Wallet
          </span>
          <h2 className="text-2xl font-display font-bold text-slate-900 mt-2">
            Secure Request-Based Balance
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Free users are limited to initial trial requests. Subscribe to Starter, Pro, Creator, or Enterprise plans to replenish.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">Available Balance</p>
            <p className="text-3xl font-display font-bold text-slate-900">
              {userProfile ? userProfile.requestLimit - userProfile.requestsUsed : 0}
              <span className="text-sm font-sans font-medium text-slate-400 ml-1">Credits</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Total assigned: {userProfile?.requestLimit || 10} requests
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {paymentStatus && (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-start gap-3.5 animate-fadeIn">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-bold text-sm text-emerald-900 uppercase tracking-wide">
              Payment Verified Successfully!
            </h3>
            <p className="text-xs mt-1 text-emerald-700">
              Successfully allocated <span className="font-bold font-mono">{paymentStatus.creditsAllocated} Credits</span> to your account wallet! Order ID: <span className="font-mono">{paymentStatus.orderId}</span>.
            </p>
            {paymentStatus.isMock && (
              <span className="inline-block mt-2 text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono px-2 py-0.5 rounded font-semibold">
                Simulated Sandbox Checkout Verification
              </span>
            )}
          </div>
        </div>
      )}

      {/* Active Subscription Status Dashboard */}
      {subDetails && subDetails.status !== "none" && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden animate-fadeIn">
          <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10">
            <ShieldCheck className="w-64 h-64 text-indigo-400" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shrink-0 border border-indigo-500/30">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-indigo-500 text-white px-2 py-0.5 rounded uppercase">
                    {subDetails.status === "active" ? "Active Subscription" : "Auto-Renew Cancelled"}
                  </span>
                  <span className="text-xs font-mono text-slate-400">ID: {subDetails.subscriptionId}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white mt-1 uppercase tracking-wide">
                  {subDetails.planId} Scholar Edition
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Billing cycle: Monthly recurring plan (₹{subDetails.amount}) via PayU mandate system.
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Next Renewal Date: <span className="text-indigo-400 font-mono font-semibold">{new Date(subDetails.nextBillingDate).toLocaleDateString()}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {subDetails.status === "active" ? (
                <button
                  onClick={handleCancelSubscription}
                  disabled={loadingSub}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold uppercase transition duration-300 disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {loadingSub ? "Cancelling..." : "Cancel Auto-Renewal"}
                </button>
              ) : (
                <span className="text-xs font-mono font-semibold text-rose-400 bg-rose-950/40 border border-rose-800/40 px-3 py-2 rounded-lg">
                  Scheduled for termination at end of billing cycle
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inner Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-5 py-3 text-xs font-mono font-bold uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === "plans"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          Subscription Plans
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-5 py-3 text-xs font-mono font-bold uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === "history"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          Ledger Statement
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`px-5 py-3 text-xs font-mono font-bold uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === "invoices"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          Tax Invoices
        </button>
      </div>

      {activeTab === "plans" ? (
        <div className="flex flex-col gap-6">
          
          {/* Standing Instructions Banner */}
          <div className="bg-slate-100/70 border border-slate-200/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-200 text-slate-700 shrink-0">
                <CreditCard className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-slate-900 uppercase">PayU recurring mandating</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Secure standing instructions (SI) are created using UPI AutoPay, Card Mandates or eNACH. Fully compliant with RBI directives.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>RBI COMPLIANT MANDATES</span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {plans.map((p) => {
              const isActivePlan = subDetails?.planId === p.id && subDetails?.status !== "none";
              return (
                <div
                  key={p.id}
                  className={`bg-white border rounded-2xl p-5 flex flex-col justify-between transition-all relative ${
                    p.popular 
                      ? "border-indigo-600 ring-2 ring-indigo-600/10 shadow-md" 
                      : "border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white font-mono font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-lg uppercase tracking-wider">{p.name}</h3>
                    <p className="text-slate-400 text-[11px] mt-0.5 font-medium">{p.subtext}</p>
                    
                    <div className="my-4">
                      <div className="flex items-baseline gap-1">
                        <p className="text-3xl font-display font-black text-slate-950">{p.price}</p>
                        <span className="text-xs text-slate-400 font-medium">/month</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-wide bg-indigo-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                        {p.credits}
                      </span>
                    </div>

                    <hr className="border-slate-100 my-4" />

                    <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    {isActivePlan ? (
                      <button
                        disabled
                        className="w-full text-center py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 font-mono text-[11px] uppercase tracking-wider font-bold"
                      >
                        ✓ Your Active Plan
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyPlan(p.id)}
                        disabled={checkoutLoading !== null}
                        className="w-full cursor-pointer text-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display text-xs uppercase tracking-wider font-bold transition duration-300 active:scale-[0.98] disabled:opacity-50"
                      >
                        {DISABLE_PAYMENTS_FOR_HACKATHON ? "Hackathon Preview" : checkoutLoading === p.id ? "Connecting..." : `Subscribe ${p.price}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Referral Widget */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                Referral Program
              </span>
              <h3 className="text-lg font-display font-bold text-slate-900 mt-2">
                Invite friends. Earn unlimited requests.
              </h3>
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                Share your personalized code below. When a new user signs up or applies your code, <span className="font-bold text-slate-900">both of you instantly earn 5 premium request credits!</span>
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex-1 flex items-center justify-between font-mono text-sm">
                  <span className="text-slate-400 font-semibold select-none">CODE:</span>
                  <span className="font-bold text-slate-950 text-base">{userProfile?.referralCode || "..."}</span>
                </div>
                <button
                  onClick={copyReferralCode}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-2 text-xs font-semibold cursor-pointer border border-slate-200"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <Users className="w-4 h-4" />
                <span>Invited: {userProfile?.referralsCount || 0} friends</span>
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                Enter Invitation Code
              </h4>
              <p className="text-slate-500 text-xs mb-3">
                Were you referred by a friend? Insert their referral code below to claim 5 free credits.
              </p>

              <form onSubmit={handleApplyReferral} className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., CLARITY_B28"
                    value={referralCodeInput}
                    onChange={(e) => setReferralCodeInput(e.target.value)}
                    disabled={userProfile?.referredBy !== undefined}
                    className="flex-1 bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white uppercase font-mono tracking-wider"
                  />
                  <button
                    type="submit"
                    disabled={applyingReferral || userProfile?.referredBy !== undefined}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase transition disabled:opacity-40 cursor-pointer"
                  >
                    {applyingReferral ? "Applying..." : "Apply Code"}
                  </button>
                </div>

                {userProfile?.referredBy && (
                  <p className="text-[11px] text-emerald-600 font-semibold font-mono">
                    ✓ Code successfully linked! You have claimed your referral reward.
                  </p>
                )}

                {referralSuccess && (
                  <p className="text-[11px] text-emerald-600 font-semibold font-mono">
                    ✓ {referralSuccess}
                  </p>
                )}

                {referralError && (
                  <p className="text-[11px] text-rose-600 font-semibold font-mono">
                    ⚠ {referralError}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      ) : activeTab === "history" ? (
        /* History logs / Ledger statement */
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider">
                Immutable Ledger Balance Sheets
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Every subscription credit allocation and audit trial gets securely logged in the ledger.
              </p>
            </div>
            <button
              onClick={() => { fetchTransactions(); fetchSubscriptionStatus(); }}
              disabled={loadingTx}
              className="text-[11px] font-mono text-slate-400 hover:text-slate-700 transition flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingTx ? "animate-spin" : ""}`} />
              Reload Ledger
            </button>
          </div>

          {loadingTx ? (
            <div className="py-12 text-center text-xs font-mono text-slate-400">
              Loading financial transactions...
            </div>
          ) : ledgers.length === 0 && transactions.length === 0 ? (
            <div className="py-12 text-center">
              <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-xs font-medium">No transactions recorded yet.</p>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Upgrade or apply a referral to begin logs.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 font-mono uppercase tracking-wider text-slate-400 text-[10px] font-bold">
                    <th className="py-2.5 px-3">Ledger ID / Hash ID</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Transaction Type</th>
                    <th className="py-2.5 px-3">Audit Log Description</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Credit Balance Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {ledgers.length > 0 ? (
                    ledgers.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 truncate max-w-[150px]" title={l.id}>
                          {l.id}
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                          {new Date(l.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                            l.type === "renewal" 
                              ? "bg-indigo-50 text-indigo-700" 
                              : l.type === "debit" 
                              ? "bg-rose-50 text-rose-700" 
                              : "bg-emerald-50 text-emerald-700"
                          }`}>
                            {l.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {l.description}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          {l.amount > 0 ? `₹${l.amount}` : "—"}
                        </td>
                        <td className={`py-3 px-3 text-right font-mono font-bold ${l.credits >= 0 ? "text-indigo-600" : "text-rose-600"}`}>
                          {l.credits >= 0 ? `+${l.credits}` : l.credits}
                        </td>
                      </tr>
                    ))
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {tx.orderId || tx.id}
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                          {new Date(tx.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                            tx.type === "payment" 
                              ? "bg-blue-50 text-blue-700" 
                              : tx.type === "referral_bonus" 
                              ? "bg-purple-50 text-purple-700" 
                              : "bg-amber-50 text-amber-700"
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {tx.description}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          {tx.amount > 0 ? `₹${tx.amount}` : "—"}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-indigo-600">
                          +{tx.creditsAllocated}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Tax Invoices Log */
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider">
                Compliant GST Invoice Receipts
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Download fully detailed commercial tax invoices with calculated CGST (9%) and SGST (9%).
              </p>
            </div>
            <button
              onClick={fetchSubscriptionStatus}
              disabled={loadingSub}
              className="text-[11px] font-mono text-slate-400 hover:text-slate-700 transition flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingSub ? "animate-spin" : ""}`} />
              Reload Receipts
            </button>
          </div>

          {invoices.length === 0 ? (
            <div className="py-12 text-center">
              <Download className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-xs font-medium">No invoices generated yet.</p>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Invoices appear automatically after successful PayU renewals.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 font-mono uppercase tracking-wider text-slate-400 text-[10px] font-bold">
                    <th className="py-2.5 px-3">Invoice Number</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Plan/Credits</th>
                    <th className="py-2.5 px-3 text-right">Base Amount</th>
                    <th className="py-2.5 px-3 text-right">CGST (9%)</th>
                    <th className="py-2.5 px-3 text-right">SGST (9%)</th>
                    <th className="py-2.5 px-3 text-right">Gross Total</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                        {new Date(inv.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 uppercase">{inv.planId} Pack</div>
                        <div className="text-[10px] text-indigo-600 font-mono">+{inv.creditsAllocated} Credits</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">
                        ₹{(inv.amount - inv.cgst - inv.sgst).toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        ₹{inv.cgst.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        ₹{inv.sgst.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{inv.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => {
                            setCustomAlert({
                              title: `Tax Receipt - ${inv.invoiceNumber}`,
                              message: `Readability AI Compliant Receipt\n\nPlan: ${inv.planId.toUpperCase()} Scholar\nAllocated: ${inv.creditsAllocated} Credits\nBase Amount: ₹${(inv.amount - inv.cgst - inv.sgst).toFixed(2)}\nCGST (9%): ₹${inv.cgst.toFixed(2)}\nSGST (9%): ₹${inv.sgst.toFixed(2)}\nTotal Paid: ₹${inv.amount.toFixed(2)}\nPayment Mode: PayU Mandate CC/UPI\nGSTIN: 27AAAAA1111A1Z1 (Demo Commercial Registration)`,
                              type: "success"
                            });
                          }}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition text-[10px] font-mono font-bold uppercase cursor-pointer"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Custom Modal for simulated payment checkout (safely handles sandbox iframe restrictions) */}
      {simulatedCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl p-6 flex flex-col gap-4 relative animate-scaleUp">
            <button 
              onClick={() => {
                setSimulatedCheckout(null);
                setCheckoutLoading(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                  Secure Wallet Simulation
                </h3>
                <p className="text-[10px] font-mono font-bold text-slate-400">STATUS: READY TO DISPATCH</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col gap-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-1.5">
                <span className="text-slate-400 font-semibold">PLAN SELECTED:</span>
                <span className="font-bold text-slate-800 uppercase">{simulatedCheckout.planName} Pack</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-1.5">
                <span className="text-slate-400 font-semibold">CREDITS ALLOCATED:</span>
                <span className="font-bold text-indigo-600 font-sans">+{simulatedCheckout.credits} Requests</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-1.5">
                <span className="text-slate-400 font-semibold">AMOUNT DUE:</span>
                <span className="font-bold text-slate-900 text-sm font-sans">₹{simulatedCheckout.order_amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">ORDER ID:</span>
                <span className="font-bold text-slate-600 text-[10px] truncate max-w-[180px]">{simulatedCheckout.order_id}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              You are currently running in the <strong>AI Studio Preview Environment</strong>. To complete this transaction successfully without real-world Indian credit/debit card processing, click simulate payment below.
            </p>

            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={() => confirmSimulatedPayment(
                  simulatedCheckout.order_id,
                  simulatedCheckout.credits,
                  simulatedCheckout.order_amount,
                  simulatedCheckout.planName
                )}
                className="w-full text-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display text-xs uppercase tracking-wider font-bold transition duration-300 cursor-pointer shadow"
              >
                Simulate Successful Payment
              </button>
              <button
                onClick={() => {
                  setSimulatedCheckout(null);
                  setCheckoutLoading(null);
                }}
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-mono text-[11px] uppercase tracking-wider font-bold transition duration-300 cursor-pointer"
              >
                Cancel / Decline Simulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Modal for clean error communication inside iframe */}
      {customAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full shadow-2xl p-6 flex flex-col gap-4 relative animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                customAlert.type === "error" 
                  ? "bg-rose-50 text-rose-600" 
                  : customAlert.type === "success" 
                  ? "bg-emerald-50 text-emerald-600" 
                  : "bg-blue-50 text-blue-600"
              }`}>
                {customAlert.type === "error" ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>
              <h3 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wide">
                {customAlert.title}
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-wrap">
              {customAlert.message}
            </p>

            <button
              onClick={() => setCustomAlert(null)}
              className="w-full text-center py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display text-xs uppercase tracking-wider font-bold transition duration-300 cursor-pointer mt-2"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
