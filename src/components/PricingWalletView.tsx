import React, { useState, useEffect } from "react";
import { CreditCard, ShieldCheck, Zap, Heart, Gift, Copy, Check, Users, RefreshCw, AlertTriangle } from "lucide-react";
import { User as FirebaseUser } from "../lib/firebase";
import { UserProfile, TransactionRecord } from "../types";

interface PricingWalletViewProps {
  user: FirebaseUser;
  userProfile: UserProfile | null;
  onRefreshProfile: () => void;
}

export default function PricingWalletView({ user, userProfile, onRefreshProfile }: PricingWalletViewProps) {
  const [activeTab, setActiveTab] = useState<"plans" | "history">("plans");
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);
  
  // Referral states
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [applyingReferral, setApplyingReferral] = useState(false);
  const [referralSuccess, setReferralSuccess] = useState("");
  const [referralError, setReferralError] = useState("");
  const [copied, setCopied] = useState(false);

  // Payment states
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<{
    success: boolean;
    orderId: string;
    creditsAllocated: number;
    amount: number;
    isMock: boolean;
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

  useEffect(() => {
    fetchTransactions();
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

  const handleBuyPlan = async (planId: string) => {
    setCheckoutLoading(planId);
    setPaymentStatus(null);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/payment/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ planId })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to initiate transaction.");
        setCheckoutLoading(null);
        return;
      }

      if (data.isMock) {
        // Run simulated sandbox payment flow (since cashfree secrets are missing on system sandbox container)
        const confirmPay = window.confirm(
          `[SIMULATION MODE] Verify Payment Setup:\n\n` +
          `Plan Selected: ${data.planName}\n` +
          `Amount Due: ₹${data.order_amount}\n` +
          `Order Reference ID: ${data.order_id}\n\n` +
          `Would you like to simulate a successful Cashfree payment verification?`
        );

        if (confirmPay) {
          // Verify simulation
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`
            },
            body: JSON.stringify({ orderId: data.order_id, simulateSuccess: true })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setPaymentStatus({
              success: true,
              orderId: data.order_id,
              creditsAllocated: data.credits,
              amount: data.order_amount,
              isMock: true
            });
            onRefreshProfile();
            fetchTransactions();
          } else {
            alert("Payment simulation failed or declined.");
          }
        }
      } else {
        // Real Cashfree payment gateway integration
        // Attempt to launch the Cashfree checkout SDK dynamically
        const orderId = data.order_id;
        const sessionId = data.payment_session_id;

        // Check if Cashfree script exists, else load it
        if (!(window as any).Cashfree) {
          const script = document.createElement("script");
          script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
          script.async = true;
          document.body.appendChild(script);
          await new Promise((resolve) => (script.onload = resolve));
        }

        const cashfree = (window as any).Cashfree({
          mode: "sandbox" // Default sandbox checkout
        });

        cashfree.checkout({
          paymentSessionId: sessionId,
          redirectTarget: "_self"
        });
      }
    } catch (err: any) {
      console.error(err);
      alert("Billing connection error: " + err.message);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free Trial",
      price: "₹0",
      subtext: "Request-limited free tier",
      credits: "10 free requests",
      isFree: true,
      features: [
        "10 default requests",
        "MR. KILVISH Elite intelligence",
        "ELI5 & Student modes",
        "Save 50 log items",
        "Ad-free dynamic workspace"
      ]
    },
    {
      id: "starter",
      name: "Starter",
      price: "₹99",
      subtext: "Great for light learning",
      credits: "50 dynamic credits",
      isFree: false,
      features: [
        "50 premium search credits",
        "No expiration date",
        "₹1.98 cost-per-request",
        "Image OCR and translation support",
        "Full support for all study presets"
      ]
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹299",
      subtext: "Highly recommended for students",
      credits: "200 premium credits",
      isFree: false,
      popular: true,
      features: [
        "200 premium search credits",
        "No expiration date",
        "₹1.49 cost-per-request (Save 25%)",
        "Prioritized model response times",
        "Deep academy course modules included"
      ]
    },
    {
      id: "business",
      name: "Business Elite",
      price: "₹999",
      subtext: "For continuous knowledge search",
      credits: "1,000 elite credits",
      isFree: false,
      features: [
        "1,000 premium search credits",
        "No expiration date",
        "₹0.99 cost-per-request (Save 50%)",
        "Dedicated workspace priority bandwidth",
        "Unlimited academy course syllabuses"
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-[80vh] py-6 px-4 md:px-8 w-full max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Wallet Summary Banner */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded">
            Your Clarity Wallet
          </span>
          <h2 className="text-2xl font-display font-bold text-slate-900 mt-2">
            Secure Request-Based Balance
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Free users are limited to initial trial requests. Buy Starter, Pro, or Business credits to replenish.
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
              Payment Complete!
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
          Select Credit Packages
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-5 py-3 text-xs font-mono font-bold uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === "history"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          Wallet History Statements
        </button>
      </div>

      {activeTab === "plans" ? (
        <div className="flex flex-col gap-8">
          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {plans.map((p) => (
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
                    <p className="text-3xl font-display font-black text-slate-950">{p.price}</p>
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
                  {p.isFree ? (
                    <button
                      disabled
                      className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-400 font-mono text-[11px] uppercase tracking-wider font-bold"
                    >
                      Active Trial Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuyPlan(p.id)}
                      disabled={checkoutLoading !== null}
                      className="w-full cursor-pointer text-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display text-xs uppercase tracking-wider font-bold transition duration-300 active:scale-[0.98] disabled:opacity-50"
                    >
                      {checkoutLoading === p.id ? "Initializing..." : `Replenish with ${p.price}`}
                    </button>
                  )}
                </div>
              </div>
            ))}
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
      ) : (
        /* History logs */
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider">
              Account Transaction History
            </h3>
            <button
              onClick={fetchTransactions}
              disabled={loadingTx}
              className="text-[11px] font-mono text-slate-400 hover:text-slate-700 transition flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingTx ? "animate-spin" : ""}`} />
              Reload Statement
            </button>
          </div>

          {loadingTx ? (
            <div className="py-12 text-center text-xs font-mono text-slate-400">
              Loading financial transactions...
            </div>
          ) : transactions.length === 0 ? (
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
                    <th className="py-2.5 px-3">Transaction ID / Order ID</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3">Credits Granted</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {transactions.map((tx) => (
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
                      <td className="py-3 px-3 font-mono font-bold text-indigo-600">
                        +{tx.creditsAllocated}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                          tx.status === "success"
                            ? "bg-emerald-50 text-emerald-700"
                            : tx.status === "pending"
                            ? "bg-amber-50 text-amber-700 animate-pulse"
                            : "bg-rose-50 text-rose-700"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
