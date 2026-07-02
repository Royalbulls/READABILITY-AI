import React, { useState, useEffect } from "react";
import { Shield, Users, CreditCard, PlusCircle, MinusCircle, RefreshCw, CheckCircle, Search, AlertCircle, TrendingUp } from "lucide-react";
import { User as FirebaseUser } from "../lib/firebase";
import { UserProfile, TransactionRecord } from "../types";

interface AdminConsoleViewProps {
  user: FirebaseUser;
}

export default function AdminConsoleView({ user }: AdminConsoleViewProps) {
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [transactionsList, setTransactionsList] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Adjustment form states
  const [selectedUserId, setSelectedUserId] = useState("");
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [submittingAdjustment, setSubmittingAdjustment] = useState(false);
  const [adjustmentMessage, setAdjustmentMessage] = useState("");

  // Role form states
  const [roleUserId, setRoleUserId] = useState("");
  const [roleValue, setRoleValue] = useState<"user" | "admin">("user");
  const [submittingRole, setSubmittingRole] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    setError("");
    setAdjustmentMessage("");
    try {
      const idToken = await user.getIdToken();
      
      // Fetch users list
      const usersRes = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (!usersRes.ok) throw new Error("Failed to load admin users registry.");
      const usersData = await usersRes.json();
      setUsersList(usersData);

      // Fetch transactions list
      const txRes = await fetch("/api/admin/transactions", {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (!txRes.ok) throw new Error("Failed to load admin ledger transactions.");
      const txData = await txRes.json();
      setTransactionsList(txData);

    } catch (err: any) {
      setError(err.message || "Unauthorized access or connectivity error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const handleAdjustCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !adjustmentAmount || !adjustmentReason) {
      alert("Please fill in all adjustment fields.");
      return;
    }

    setSubmittingAdjustment(true);
    setAdjustmentMessage("");
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/admin/adjust-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({
          userId: selectedUserId,
          amount: Number(adjustmentAmount),
          reason: adjustmentReason
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to adjust user balance.");
      } else {
        setAdjustmentMessage("Successfully updated user credits!");
        setAdjustmentAmount("");
        setAdjustmentReason("");
        fetchAdminData();
      }
    } catch (err: any) {
      alert("Failed to submit credit adjustment request.");
    } finally {
      setSubmittingAdjustment(false);
    }
  };

  const handleChangeRole = async (targetUid: string, targetRole: "user" | "admin") => {
    const confirmChange = window.confirm(`Are you sure you want to change user role to: ${targetRole.toUpperCase()}?`);
    if (!confirmChange) return;

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/admin/adjust-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({
          userId: targetUid,
          role: targetRole
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to alter user privileges.");
      } else {
        alert(data.message || "Role updated successfully.");
        fetchAdminData();
      }
    } catch (err: any) {
      alert("Role alteration request failed.");
    }
  };

  // Calculate metrics
  const totalUsersCount = usersList.length;
  const totalCreditsAllocated = usersList.reduce((acc, u) => acc + (u.requestLimit || 0), 0);
  const totalRequestsRun = usersList.reduce((acc, u) => acc + (u.requestsUsed || 0), 0);
  const totalSalesRevenue = transactionsList
    .filter(t => t.status === "success" && t.type === "payment")
    .reduce((acc, t) => acc + t.amount, 0);

  const filteredUsers = usersList.filter(u => 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.uid.includes(searchQuery)
  );

  return (
    <div className="bg-slate-50 min-h-[85vh] py-6 px-4 md:px-8 w-full max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Admin Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h2 className="text-xl font-display font-black text-slate-900 uppercase">
              Clarity Administrative Panel
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5 font-semibold">
              SECURE LEDGER ACCESS &middot; PRIVILEGED OPERATION CONSOLE
            </p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Registry Data
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-mono font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>ACCESS RESTRICTION ERROR: {error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Registered Users</p>
          <p className="text-2xl font-display font-bold text-slate-900 mt-1">{totalUsersCount}</p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Profiles sync active</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Total Credit Pool</p>
          <p className="text-2xl font-display font-bold text-slate-900 mt-1">{totalCreditsAllocated}</p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Authorized limits</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Total Requests Processed</p>
          <p className="text-2xl font-display font-bold text-slate-900 mt-1">{totalRequestsRun}</p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Kilvish processing count</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white">
          <p className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-wider">Total Sales Income</p>
          <p className="text-2xl font-display font-bold text-indigo-700 mt-1">₹{totalSalesRevenue}</p>
          <p className="text-[10px] text-indigo-500 font-mono mt-0.5">Success PayU subscriptions</p>
        </div>
      </div>

      {/* User Management Registry & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Registry List (8 columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider">
              Identity Registry Directory ({filteredUsers.length})
            </h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search email, name or UID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 w-full sm:w-60 focus:outline-none focus:border-slate-300 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 font-mono uppercase tracking-wider text-slate-400 text-[10px] font-bold">
                  <th className="py-2.5 px-2">Account Owner</th>
                  <th className="py-2.5 px-2">Role</th>
                  <th className="py-2.5 px-2 text-center">Requests Run / Limit</th>
                  <th className="py-2.5 px-2">Referrals</th>
                  <th className="py-2.5 px-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-50/50">
                    <td className="py-3 px-2">
                      <div className="font-bold text-slate-900">{u.displayName || "No Name"}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{u.email}</div>
                      <div className="text-[9px] text-slate-400 font-mono">UID: {u.uid}</div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                        u.role === "admin" 
                          ? "bg-slate-900 text-white" 
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-[11px] font-semibold text-slate-800">
                      {u.requestsUsed} / {u.requestLimit}
                    </td>
                    <td className="py-3 px-2 text-slate-500 font-mono text-[11px]">
                      {u.referralsCount || 0} friends
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedUserId(u.uid);
                            setAdjustmentAmount("10");
                            setAdjustmentReason("Admin custom incentive reward");
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-[10px] font-mono font-bold cursor-pointer transition text-slate-700"
                        >
                          Select Adjust
                        </button>
                        
                        {u.role === "admin" ? (
                          <button
                            onClick={() => handleChangeRole(u.uid, "user")}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-mono font-bold cursor-pointer transition"
                          >
                            Demote User
                          </button>
                        ) : (
                          <button
                            onClick={() => handleChangeRole(u.uid, "admin")}
                            className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[10px] font-mono font-bold cursor-pointer transition"
                          >
                            Make Admin
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Manual Adjustment Ledger (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Adjustment Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              Manual Credit Adjustment
            </h3>

            <form onSubmit={handleAdjustCredits} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Target UID</label>
                <input
                  type="text"
                  placeholder="Paste or select user UID..."
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Credit Increment / Decrement</label>
                <input
                  type="number"
                  placeholder="e.g., 50 or -25"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none font-bold"
                />
                <span className="text-[9px] text-slate-400">Positive value adds credits, negative deducts credits.</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Reason statement</label>
                <input
                  type="text"
                  placeholder="e.g. Compensated for payment lag"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                />
              </div>

              {adjustmentMessage && (
                <p className="text-[11px] text-emerald-600 font-mono font-semibold">
                  ✓ {adjustmentMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={submittingAdjustment}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase py-2.5 rounded-xl disabled:opacity-40 cursor-pointer tracking-wider"
              >
                {submittingAdjustment ? "Writing Adjustment..." : "Commit Transaction"}
              </button>
            </form>
          </div>

          {/* Ledger logs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider mb-3">
              Live System Audits
            </h3>
            <div className="max-h-[300px] overflow-y-auto flex flex-col gap-2.5 text-[11px]">
              {transactionsList.slice(0, 15).map((t) => (
                <div key={t.id} className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="flex justify-between font-mono font-bold text-[10px]">
                    <span className="text-slate-500 uppercase">{t.type}</span>
                    <span className={t.status === "success" ? "text-emerald-600" : "text-slate-400"}>
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-700 mt-1">{t.description}</p>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                    User: {t.userId.substring(0, 8)}... &bull; Value: {t.amount > 0 ? `₹${t.amount}` : "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
