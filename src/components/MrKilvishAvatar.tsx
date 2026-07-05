import React from "react";
import { Sparkles, Terminal, Shield, Zap } from "lucide-react";

interface MrKilvishAvatarProps {
  status: "idle" | "loading" | "speaking";
}

export default function MrKilvishAvatar({ status }: MrKilvishAvatarProps) {
  return (
    <div className="relative flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full transition-all duration-300">
      {/* Ambient background glows */}
      <div className={`absolute -inset-10 rounded-full blur-3xl opacity-10 transition-all duration-1000 pointer-events-none ${
        status === "loading"
          ? "bg-blue-400 animate-pulse"
          : status === "speaking"
          ? "bg-indigo-400 animate-pulse"
          : "bg-slate-300"
      }`} />

      {/* Futuristic Cybernetic Core Orb (scaled down for horizontal compactness) */}
      <div className="relative w-16 h-16 flex items-center justify-center shrink-0 z-10 select-none">
        {/* Outer rotating/pulsing ring */}
        <div className={`absolute inset-0 rounded-full border border-dashed transition-all duration-1000 ${
          status === "loading"
            ? "border-blue-400 animate-spin"
            : status === "speaking"
            ? "border-indigo-400 animate-[spin_3s_linear_infinite]"
            : "border-slate-350"
        }`} />

        {/* Middle pulsing glow ring */}
        <div className={`absolute w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center transition-all duration-700 ${
          status === "loading"
            ? "scale-105 bg-blue-50 border-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.15)]"
            : status === "speaking"
            ? "scale-105 bg-indigo-50 border-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.15)]"
            : "bg-slate-50"
        }`}>
          {/* Inner Core Shield / Icon */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
            status === "loading"
              ? "bg-blue-100 text-blue-600"
              : status === "speaking"
              ? "bg-indigo-100 text-indigo-600"
              : "bg-slate-100 text-slate-700"
          }`}>
            {status === "loading" ? (
              <Zap className="w-4 h-4 animate-bounce" />
            ) : status === "speaking" ? (
              <Sparkles className="w-4 h-4 animate-pulse" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Dynamic audio waves when speaking */}
        {status === "speaking" && (
          <div className="absolute -bottom-0.5 flex items-end gap-0.5 h-3">
            <span className="w-0.5 bg-indigo-400 rounded-full animate-[bounce_0.8s_infinite] h-2" />
            <span className="w-0.5 bg-indigo-500 rounded-full animate-[bounce_0.5s_infinite] h-3" />
            <span className="w-0.5 bg-indigo-400 rounded-full animate-[bounce_0.7s_infinite] h-1.5" />
          </div>
        )}
      </div>

      {/* Info & Standby Dialog box aligned horizontally */}
      <div className="flex-1 flex flex-col justify-center min-w-0 z-10 w-full text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-slate-850" />
            <h3 className="font-display font-black text-slate-900 text-xs tracking-wider uppercase">
              MR. KILVISH V2.5
            </h3>
          </div>
          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
            status === "loading"
              ? "bg-blue-50 border-blue-200 text-blue-600 animate-pulse"
              : status === "speaking"
              ? "bg-indigo-50 border-indigo-200 text-indigo-600"
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}>
            {status === "loading"
              ? "DECODING..."
              : status === "speaking"
              ? "SPEAKING"
              : "STANDBY"}
          </span>
        </div>

        {/* Dialog bubble */}
        <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-150 text-xs font-mono text-slate-600 leading-relaxed text-left w-full">
          {status === "loading" ? (
            <span className="text-blue-600">
              &quot;Banish the darkness... Jargon cannot hide from my light.&quot;
            </span>
          ) : status === "speaking" ? (
            <span className="text-indigo-600 font-medium">
              &quot;Listen closely. Let the pure stream of simplified clarity fill your mind.&quot;
            </span>
          ) : (
            <span>
              &quot;Clarity is power! Feed me your text and let the truth prevail.&quot;
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
