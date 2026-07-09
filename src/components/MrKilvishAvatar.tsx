import React from "react";
import { Sparkles, Terminal, Shield, Zap } from "lucide-react";

interface MrKilvishAvatarProps {
  status: "idle" | "loading" | "speaking";
}

export default function MrKilvishAvatar({ status }: MrKilvishAvatarProps) {
  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Ambient background glows */}
      <div className={`absolute -inset-10 rounded-full blur-3xl opacity-10 transition-all duration-1000 ${
        status === "loading"
          ? "bg-blue-400 animate-pulse"
          : status === "speaking"
          ? "bg-indigo-400 animate-pulse"
          : "bg-slate-300"
      }`} />

      {/* Futuristic Cybernetic Core Orb */}
      <div className="relative w-20 h-20 flex items-center justify-center z-10">
        {/* Outer rotating/pulsing ring */}
        <div className={`absolute inset-0 rounded-full border border-dashed transition-all duration-1000 ${
          status === "loading"
            ? "border-blue-400 animate-spin"
            : status === "speaking"
            ? "border-indigo-400 animate-[spin_3s_linear_infinite]"
            : "border-slate-300 hover:border-slate-450"
        }`} />

        {/* Middle pulsing glow ring */}
        <div className={`absolute w-16 h-16 rounded-full border border-slate-100 flex items-center justify-center transition-all duration-700 ${
          status === "loading"
            ? "scale-105 bg-blue-50 border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            : status === "speaking"
            ? "scale-105 bg-indigo-50 border-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
            : "bg-slate-50"
        }`}>
          {/* Inner Core Shield / Icon */}
          <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 ${
            status === "loading"
              ? "bg-blue-100 text-blue-600"
              : status === "speaking"
              ? "bg-indigo-100 text-indigo-600"
              : "bg-slate-100 text-slate-700"
          }`}>
            {status === "loading" ? (
              <Zap className="w-5 h-5 animate-bounce" />
            ) : status === "speaking" ? (
              <Sparkles className="w-5 h-5 animate-pulse" />
            ) : (
              <Shield className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Dynamic soundwaves or scanning lines when speaking or loading */}
        {status === "speaking" && (
          <div className="absolute -bottom-1 flex items-end gap-1 h-4">
            <span className="w-1 bg-indigo-400 rounded-full animate-[bounce_0.8s_infinite] h-2.5" />
            <span className="w-1 bg-indigo-500 rounded-full animate-[bounce_0.5s_infinite] h-4" />
            <span className="w-1 bg-indigo-400 rounded-full animate-[bounce_0.7s_infinite] h-1.5" />
            <span className="w-1 bg-indigo-600 rounded-full animate-[bounce_0.6s_infinite] h-3" />
          </div>
        )}

        {status === "loading" && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/10 to-transparent w-full h-full animate-[bounce_2s_infinite] pointer-events-none" />
        )}
      </div>

      {/* Name and Tagline */}
      <div className="mt-2.5 text-center z-10">
        <div className="flex items-center justify-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-slate-850" />
          <h3 className="font-display font-bold text-slate-900 text-xs tracking-wide uppercase">
            MR. KILVISH V2.5
          </h3>
        </div>
        <p className="text-slate-500 text-[9px] mt-0.5 uppercase tracking-widest font-mono font-bold">
          {status === "loading"
            ? "DECODING COMPLEXITY..."
            : status === "speaking"
            ? "BROADCASTING CLARITY"
            : "INTELLIGENCE ENGINE STANDBY"}
        </p>
      </div>

      {/* Dialog box / Quote from Kilvish */}
      <div className="mt-2.5 px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-center text-[11px] font-mono max-w-[280px]">
        {status === "loading" ? (
          <span className="text-blue-600 animate-pulse">
            &quot;Banish the darkness... Jargon cannot hide from my analytical light.&quot;
          </span>
        ) : status === "speaking" ? (
          <span className="text-indigo-600">
            &quot;Listen closely. Let the pure stream of streamlined insight fill your mind.&quot;
          </span>
        ) : (
          <span className="text-slate-600">
            &quot;Clarity is power! Feed me your dense text and let the truth prevail.&quot;
          </span>
        )}
      </div>
    </div>
  );
}
