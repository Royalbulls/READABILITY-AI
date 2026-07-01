import React, { useEffect, useState } from "react";
import { Sparkles, Activity, ShieldCheck, ShieldAlert, LogIn, LogOut, FileText, CreditCard, Shield, Gift, TrendingUp } from "lucide-react";
import { User as FirebaseUser } from "../lib/firebase";

interface HeaderProps {
  user: FirebaseUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isAuthLoading: boolean;
  activeView: "workspace" | "pricing" | "growth" | "admin" | "business" | "academy" | "search";
  setActiveView: (view: "workspace" | "pricing" | "growth" | "admin" | "business" | "academy" | "search") => void;
  userProfile: any;
}

export default function Header({ 
  user, 
  onSignIn, 
  onSignOut, 
  isAuthLoading, 
  activeView, 
  setActiveView,
  userProfile 
}: HeaderProps) {
  const [apiKeyOk, setApiKeyOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/config-status")
      .then((res) => res.json())
      .then((data) => setApiKeyOk(data.hasApiKey))
      .catch(() => setApiKeyOk(false));
  }, []);

  const isAdmin = userProfile?.role === "admin";

  return (
    <header className="relative border-b border-slate-200 bg-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xl font-display">
          K
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-xl tracking-tight text-slate-950 uppercase">
              READABILITY <span className="text-slate-500 font-medium">AI</span>
            </h1>
            <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold">
              v2.5
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5 font-sans font-medium">
            Banish the darkness of technical jargon, legal terms, and academic noise with pure clarity.
          </p>
        </div>
      </div>

      {/* View Switcher Tabs (Only if user logged in) */}
      {user && (
        <div className="flex items-center bg-slate-100 p-1 rounded-xl mx-auto md:mx-0">
          <button
            onClick={() => setActiveView("workspace")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeView === "workspace"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Workspace
          </button>
          
          <button
            onClick={() => setActiveView("pricing")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeView === "pricing"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Buy Credits
          </button>

          <button
            onClick={() => setActiveView("growth")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeView === "growth"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Launch & Growth
          </button>

          <button
            onClick={() => setActiveView("business")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeView === "business"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            📊 Business Studio
          </button>

          <button
            onClick={() => setActiveView("academy")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeView === "academy"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            🎓 Academy 2.0
          </button>

          <button
            onClick={() => setActiveView("search")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeView === "search"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            🔍 Knowledge OS
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveView("admin")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeView === "admin"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-rose-600 hover:bg-rose-50"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
          )}
        </div>
      )}

      {/* Connection, Engine, & Auth Status */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono justify-end">
        {/* Wallet Balance Display (if loaded) */}
        {user && userProfile && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg">
            <Gift className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold">
              Credits: {userProfile.requestLimit - userProfile.requestsUsed} / {userProfile.requestLimit}
            </span>
          </div>
        )}

        {/* Core Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
          <Activity className="w-3.5 h-3.5 text-blue-500 animate-[pulse_1.5s_infinite]" />
          <span>Engine: <span className="text-slate-900 font-semibold">KILVISH ACTIVE</span></span>
        </div>

        {/* Authentication Widget */}
        <div className="flex items-center pl-2 border-l border-slate-200">
          {isAuthLoading ? (
            <div className="flex items-center gap-2 px-3 py-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 animate-pulse" />
              <span>Checking account...</span>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3 bg-indigo-50/40 border border-indigo-100 rounded-lg p-1.5 pr-3 text-sans font-sans">
              <img 
                src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
                alt={user.displayName || "User"} 
                className="w-6 h-6 rounded-full object-cover border border-indigo-200" 
                referrerPolicy="no-referrer"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-slate-900 font-semibold text-xs leading-none">{user.displayName}</span>
                <span className="text-[10px] text-indigo-600 leading-none mt-0.5 font-mono capitalize">
                  {userProfile?.role || "User"} Account
                </span>
              </div>
              <button 
                onClick={onSignOut}
                className="text-slate-400 hover:text-rose-600 transition p-1 hover:bg-slate-100/80 rounded cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onSignIn}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium hover:shadow-sm transition px-3.5 py-1.5 rounded-lg text-sans font-sans cursor-pointer text-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

