import React from "react";
import { SimplificationMode } from "../types";
import { Sparkles, Baby, Briefcase, GraduationCap, BookOpen } from "lucide-react";

interface ModeSelectorProps {
  activeMode: SimplificationMode;
  onChange: (mode: SimplificationMode) => void;
}

interface ModeConfig {
  id: SimplificationMode;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<any>;
  activeColor: string;
  borderColor: string;
  textColor: string;
}

const MODES: ModeConfig[] = [
  {
    id: "default",
    title: "Clarity Default",
    badge: "Balanced",
    description: "Replaces jargon with easy terms while keeping the overall shape and tone of the information.",
    icon: Sparkles,
    activeColor: "bg-slate-900 text-white border-slate-950 shadow-md",
    borderColor: "hover:border-slate-300 hover:bg-slate-50 border-slate-200 text-slate-700 bg-white",
    textColor: "text-white"
  },
  {
    id: "eli5",
    title: "ELI5 Mode",
    badge: "ELI5",
    description: "Explain Like I'm 5. Uses basic words, cozy analogies, and zero complex terminology.",
    icon: Baby,
    activeColor: "bg-blue-600 text-white border-blue-700 shadow-md",
    borderColor: "hover:border-slate-300 hover:bg-slate-50 border-slate-200 text-slate-700 bg-white",
    textColor: "text-white"
  },
  {
    id: "pro",
    title: "Pro Mode",
    badge: "Executive",
    description: "Highly concise, action-oriented, and structured for quick professional decision-making.",
    icon: Briefcase,
    activeColor: "bg-slate-800 text-white border-slate-900 shadow-md",
    borderColor: "hover:border-slate-300 hover:bg-slate-50 border-slate-200 text-slate-700 bg-white",
    textColor: "text-white"
  },
  {
    id: "student",
    title: "Student Mode",
    badge: "Educational",
    description: "Focuses on terminology. Breaks down definitions, concepts, and steps for deep comprehension.",
    icon: GraduationCap,
    activeColor: "bg-indigo-600 text-white border-indigo-700 shadow-md",
    borderColor: "hover:border-slate-300 hover:bg-slate-50 border-slate-200 text-slate-700 bg-white",
    textColor: "text-white"
  },
  {
    id: "academy",
    title: "Mr. Kilvish Academy",
    badge: "Premium Course",
    description: "Transform topics into comprehensive e-books, course modules, or syllabus-level study materials with MCQs, checklists, and 30-day plans.",
    icon: BookOpen,
    activeColor: "bg-gradient-to-r from-violet-600 to-indigo-700 text-white border-violet-800 shadow-lg ring-2 ring-violet-400/20",
    borderColor: "hover:border-violet-300 hover:bg-violet-50/30 border-slate-200 text-slate-700 bg-white",
    textColor: "text-white"
  }
];

export default function ModeSelector({ activeMode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
          Operating Mode
        </label>
        <span className="text-[10px] text-slate-500 font-mono font-semibold">
          [Alters simplifier rules]
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange(mode.id)}
              className={`flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-300 ${
                isActive ? mode.activeColor : mode.borderColor
              }`}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <div className={`p-1.5 rounded-lg flex items-center justify-center ${
                  isActive ? "bg-white/10 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono border uppercase tracking-wider font-semibold ${
                  isActive 
                    ? "bg-white/10 text-white border-transparent"
                    : "bg-slate-50 text-slate-500 border-slate-200"
                }`}>
                  {mode.badge}
                </span>
              </div>

              <h4 className={`font-display font-bold text-sm mt-3 ${
                isActive ? "text-white" : "text-slate-900"
              }`}>
                {mode.title}
              </h4>
              <p className={`text-xs mt-1 font-sans leading-relaxed ${
                isActive ? "text-slate-100" : "text-slate-500"
              }`}>
                {mode.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
