import React, { useState } from "react";
import { 
  FileText, 
  CreditCard, 
  TrendingUp, 
  Shield, 
  LogOut, 
  Menu, 
  X, 
  Activity, 
  Sparkles,
  Layers,
  GraduationCap,
  BarChart3,
  Search,
  User as UserIcon,
  HelpCircle,
  Clock,
  Folder
} from "lucide-react";
import { User as FirebaseUser } from "../lib/firebase";

interface SidebarProps {
  user: FirebaseUser | null;
  onSignOut: () => void;
  activeView: "workspace" | "pricing" | "growth" | "admin" | "business" | "academy" | "search" | "projects";
  setActiveView: (view: "workspace" | "pricing" | "growth" | "admin" | "business" | "academy" | "search" | "projects") => void;
  userProfile: any;
}

export default function Sidebar({
  user,
  onSignOut,
  activeView,
  setActiveView,
  userProfile
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = userProfile?.role === "admin";
  const remainingCredits = userProfile ? userProfile.requestLimit - userProfile.requestsUsed : 0;
  const totalCredits = userProfile ? userProfile.requestLimit : 5;

  const menuItems = [
    { id: "workspace" as const, label: "Workspace", icon: FileText },
    { id: "pricing" as const, label: "Subscriptions", icon: CreditCard },
    { id: "growth" as const, label: "Creator Platform", icon: TrendingUp },
    { id: "business" as const, label: "📊 Business Studio", icon: BarChart3 },
    { id: "academy" as const, label: "🎓 Academy 2.0", icon: GraduationCap },
    { id: "projects" as const, label: "📂 Saved Projects", icon: Folder },
    { id: "search" as const, label: "🔍 Knowledge OS", icon: Search },
  ];

  const handleNavClick = (viewId: typeof activeView) => {
    setActiveView(viewId);
    setIsOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 font-sans">
      {/* Brand & Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl font-display shadow-lg shadow-indigo-600/25">
            K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-lg tracking-tight text-white uppercase">
                READABILITY <span className="text-indigo-400 font-medium">AI</span>
              </h1>
              <span className="text-[9px] bg-slate-800 text-slate-300 border border-slate-700 font-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold">
                v2.5
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-1 font-sans leading-relaxed">
              Banish the darkness of jargon with pure clarity.
            </p>
            <p className="text-indigo-400/80 text-[9px] mt-1.5 font-sans font-medium tracking-wide uppercase">
              Powered by Royal Bulls Advisory
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 block mb-2">
          Core Platform
        </span>

        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer text-left ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {isAdmin && (
          <div className="pt-4 space-y-1.5">
            <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 block mb-2">
              Administration
            </span>
            <button
              onClick={() => handleNavClick("admin")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer text-left ${
                activeView === "admin"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/10"
                  : "text-rose-400 hover:text-rose-300 hover:bg-rose-950/20"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Section (Credits & User Profile) */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-4">
        {/* Credits Indicator */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Credits Balance
            </span>
            <span className="font-semibold text-indigo-400 font-mono">
              {remainingCredits} / {totalCredits}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, (remainingCredits / totalCredits) * 100))}%` }}
            />
          </div>
        </div>

        {/* User Profile Widget */}
        {user && (
          <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
                alt={user.displayName || "User"} 
                className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0" 
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col text-left min-w-0">
                <span className="text-slate-100 font-bold text-xs truncate leading-none">
                  {user.displayName}
                </span>
                <span className="text-[9px] text-indigo-400 leading-none mt-1 font-mono uppercase tracking-wider font-bold truncate">
                  {userProfile?.role || "User"} Account
                </span>
              </div>
            </div>
            <button 
              onClick={onSignOut}
              className="text-slate-500 hover:text-rose-400 transition-all p-2 hover:bg-slate-800 rounded-lg cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Engine Status Tag */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-emerald-500 animate-[pulse_1.5s_infinite]" />
            <span>KILVISH ACTIVE</span>
          </div>
          <span>v2.5</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-slate-900 text-white border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm font-display">
            K
          </div>
          <span className="font-display font-black text-xs uppercase tracking-wider">
            READABILITY AI
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Quick Credit indicator on mobile bar */}
          <span className="text-[10px] font-mono font-bold bg-slate-800 text-indigo-400 px-2 py-1 rounded border border-slate-700">
            {remainingCredits}/{totalCredits} Cr
          </span>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            aria-label="Toggle sidebar menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 shrink-0 select-none z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Slide-out overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="relative w-80 max-w-[85vw] h-full flex flex-col z-10 animate-slideRight">
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
