import React from "react";
import { 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Rocket, 
  Search, 
  Check, 
  Sliders,
  Terminal
} from "lucide-react";

export type PersonaType = "default" | "business_consultant" | "ai_teacher" | "startup_mentor";

export interface PersonaDefinition {
  id: PersonaType;
  name: string;
  title: string;
  description: string;
  catchphrase: string;
  icon: React.ComponentType<any>;
  color: string;
  bgClass: string;
  borderClass: string;
  activeColor: string;
  tools: {
    name: string;
    description: string;
    status: "active" | "standby";
  }[];
}

const PERSONAS: PersonaDefinition[] = [
  {
    id: "default",
    name: "Mr. Kilvish (Default)",
    title: "Readability AI Core",
    description: "Elite jargon-banishing and core conceptual simplification engine.",
    catchphrase: "Clarity shall prevail!",
    icon: Sparkles,
    color: "text-indigo-600",
    bgClass: "bg-indigo-50/50",
    borderClass: "border-indigo-100",
    activeColor: "bg-indigo-600 text-white border-indigo-600",
    tools: [
      { name: "Google Search Grounding", description: "Real-time query grounding and factual verification", status: "active" },
      { name: "Dual-Section Synthesis", description: "Automated Core Concept + Breakdown format generator", status: "active" }
    ]
  },
  {
    id: "business_consultant",
    name: "Business Consultant",
    title: "Elite Chartered Accountant",
    description: "CA-level commercial viability audit, regional schemes, tax schedules & unit economic analysis.",
    catchphrase: "Mathematics is the language of clarity!",
    icon: Briefcase,
    color: "text-emerald-600",
    bgClass: "bg-emerald-50/50",
    borderClass: "border-emerald-100",
    activeColor: "bg-emerald-600 text-white border-emerald-600",
    tools: [
      { name: "Google Search Grounding", description: "Market research search grounding", status: "active" },
      { name: "GST & MSME Advisor", description: "State subsidy check & tax calculations", status: "active" },
      { name: "CA Financial Assessor", description: "Revenue/expense gross margins and viability health", status: "active" }
    ]
  },
  {
    id: "ai_teacher",
    name: "AI Teacher",
    title: "Syllabus Architect",
    description: "Conceptual education, systematic breakdown, phonetic pronunciation, and mock MCQ generation.",
    catchphrase: "Knowledge is the light that banishes ignorance!",
    icon: GraduationCap,
    color: "text-amber-600",
    bgClass: "bg-amber-50/50",
    borderClass: "border-amber-100",
    activeColor: "bg-amber-600 text-white border-amber-600",
    tools: [
      { name: "Google Search Grounding", description: "Historical and educational fact validation", status: "active" },
      { name: "Concept Visualizer", description: "Generates powerful real-world physical analogies", status: "active" },
      { name: "Quiz & MCQ Generator", description: "Composes conceptual mock test questions with explanations", status: "active" }
    ]
  },
  {
    id: "startup_mentor",
    name: "Startup Mentor",
    title: "VC & Growth Specialist",
    description: "Tech startup stress-testing, viral customer loops, acquisition metrics (LTV/CAC) & VC readiness.",
    catchphrase: "Build what users love, and scale like crazy!",
    icon: Rocket,
    color: "text-blue-600",
    bgClass: "bg-blue-50/50",
    borderClass: "border-blue-100",
    activeColor: "bg-blue-600 text-white border-blue-600",
    tools: [
      { name: "Google Search Grounding", description: "Competitive landscape research grounding", status: "active" },
      { name: "LTV/CAC Metric Optimizer", description: "Assesses customer acquisition & user retention health", status: "active" },
      { name: "Venture Funding Matcher", description: "Identifies optimal seed funding stages, ticket sizes & benchmarks", status: "active" }
    ]
  }
];

interface PersonaManagerProps {
  activePersona: PersonaType;
  onPersonaChange: (persona: PersonaType) => void;
}

export default function PersonaManager({ activePersona, onPersonaChange }: PersonaManagerProps) {
  const currentPersona = PERSONAS.find(p => p.id === activePersona) || PERSONAS[0];

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-display font-bold text-sm text-slate-800 tracking-wider uppercase flex items-center gap-2">
          <Sliders className="w-4 h-4 text-slate-900" />
          Intelligence Persona OS
        </h3>
        <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
          SWAPPABLE SYSTEM PROMPT
        </span>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {PERSONAS.map((p) => {
          const IconComponent = p.icon;
          const isSelected = p.id === activePersona;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPersonaChange(p.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col gap-1.5 ${
                isSelected
                  ? `bg-slate-900 border-slate-900 text-white shadow-md`
                  : `bg-slate-50 border-slate-250 hover:border-slate-300 text-slate-700 hover:bg-slate-100/70`
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-white/10 text-white' : `${p.bgClass} ${p.color}`
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold leading-none truncate w-full">
                  {p.id === "default" ? "Mr. Kilvish" : p.name}
                </div>
              </div>
              <p className={`text-[10px] leading-snug line-clamp-2 ${
                isSelected ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {p.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Dynamic Active Persona Details & Available Tools */}
      <div className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/50 flex flex-col gap-3 animate-fadeIn">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Active Role & Catchphrase
            </div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">
              {currentPersona.title} &bull; <span className="italic text-indigo-600">&quot;{currentPersona.catchphrase}&quot;</span>
            </div>
          </div>
        </div>

        {/* Available Workspace Tools section */}
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            Active Workspace Tools (No-Mock)
          </div>
          <div className="flex flex-col gap-1.5">
            {currentPersona.tools.map((t, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-150 text-xs">
                <div className="mt-0.5 w-4 h-4 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 leading-none">{t.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-snug">{t.description}</div>
                </div>
                <span className="ml-auto text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
