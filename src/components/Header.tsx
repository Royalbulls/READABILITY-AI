import React, { useEffect, useState } from "react";
import { Sparkles, Activity, ShieldCheck, ShieldAlert, LogIn, LogOut, User } from "lucide-react";
import { User as FirebaseUser } from "../lib/firebase";

interface HeaderProps {
  user: FirebaseUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isAuthLoading: boolean;
}

export default function Header({ user, onSignIn, onSignOut, isAuthLoading }: HeaderProps) {
  const [apiKeyOk, setApiKeyOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/config-status")
      .then((res) => res.json())
      .then((data) => setApiKeyOk(data.hasApiKey))
      .catch(() => setApiKeyOk(false));
  }, []);

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

      {/* Connection, Engine, & Auth Status */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
        {/* Core Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
          <Activity className="w-3.5 h-3.5 text-blue-500 animate-[pulse_1.5s_infinite]" />
          <span>Engine: <span className="text-slate-900 font-semibold">KILVISH ACTIVE</span></span>
        </div>

        {/* API Key Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
          {apiKeyOk === null ? (
            <span className="w-2.5 h-2.5 bg-slate-300 rounded-full animate-ping" />
          ) : apiKeyOk ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-slate-600">API: <span className="text-emerald-600 font-semibold">CONNECTED</span></span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
              <span className="text-slate-600">API: <span className="text-amber-600 font-semibold">MISSING</span></span>
            </>
          )}
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
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-slate-900 font-semibold text-xs leading-none">{user.displayName}</span>
                <span className="text-[10px] text-indigo-600 leading-none mt-0.5 font-mono">Sync active</span>
              </div>
              <button 
                onClick={onSignOut}
                className="text-slate-400 hover:text-rose-600 transition p-1 hover:bg-slate-100/80 rounded"
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
