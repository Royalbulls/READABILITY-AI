import React, { useEffect, useState } from "react";
import { Sparkles, Activity, ShieldCheck, ShieldAlert, Home, Terminal, Info } from "lucide-react";

interface HeaderProps {
  activeTab: "home" | "workspace" | "about";
  setActiveTab: (tab: "home" | "workspace" | "about") => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [apiKeyOk, setApiKeyOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/config-status")
      .then((res) => res.json())
      .then((data) => setApiKeyOk(data.hasApiKey))
      .catch(() => setApiKeyOk(false));
  }, []);

  return (
    <header className="relative border-b border-slate-200 bg-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 z-40">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div 
          onClick={() => setActiveTab("home")}
          className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xl font-display cursor-pointer transition-transform hover:scale-105"
        >
          K
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 
              onClick={() => setActiveTab("home")}
              className="font-display font-bold text-xl tracking-tight text-slate-950 uppercase cursor-pointer hover:text-slate-800 transition-colors"
            >
              READABILITY
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

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl self-start md:self-auto">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer ${
            activeTab === "home"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab("workspace")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer ${
            activeTab === "workspace"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Workspace</span>
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer ${
            activeTab === "about"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>About</span>
        </button>
      </nav>

      {/* Connection & Engine Status */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
        {/* Core Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
          <Activity className="w-3.5 h-3.5 text-blue-500 animate-[pulse_1.5s_infinite]" />
          <span>Engine: <span className="text-slate-900 font-semibold text-[11px]">MR. KILVISH</span></span>
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
      </div>
    </header>
  );
}
