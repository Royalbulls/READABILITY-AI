import React from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Search, 
  BrainCircuit, 
  Volume2, 
  Layers, 
  Users, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react";

interface HomeSectionProps {
  onStartWorkspace: () => void;
  onExploreAbout: () => void;
  onSelectTopic: (topic: string) => void;
}

export default function HomeSection({ onStartWorkspace, onExploreAbout, onSelectTopic }: HomeSectionProps) {
  const popularTopics = [
    { title: "Quantum Computing", desc: "Understanding quantum superposition & qubits" },
    { title: "How Inflation Works", desc: "Why prices rise and central banks react" },
    { title: "What is Blockchain?", desc: "Distributed ledgers made simple" },
    { title: "CRISPR Gene Editing", desc: "How DNA scissors revolutionize medicine" }
  ];

  return (
    <div className="w-full flex flex-col gap-12 animate-fadeIn py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl px-6 py-12 md:p-16 border border-slate-800 shadow-xl flex flex-col items-center text-center">
        {/* Subtle decorative mesh background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-900 to-slate-950 opacity-90 z-0" />
        
        <div className="relative z-10 max-w-3xl flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider text-blue-400 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Empowered by Gemini-3.5 & Mr. Kilvish
          </div>

          <h2 className="font-display font-extrabold text-3xl md:text-5xl leading-tight tracking-tight text-white">
            Banish Complex Jargon.<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
              Reveal Crystal Clarity.
            </span>
          </h2>

          <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Translate dense academic research, complicated legal clauses, or medical terminology into terms a 10-year-old can master. Get instant breakdowns, real-world analogies, and voice readouts.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
            <button
              onClick={onStartWorkspace}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-950 font-display font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-slate-100 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
            <button
              onClick={onExploreAbout}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Explore Manifesto
            </button>
          </div>
        </div>

        {/* Floating statistics widget */}
        <div className="relative z-10 mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 pt-8 border-t border-slate-800 w-full max-w-4xl text-center">
          <div>
            <div className="text-2xl md:text-3xl font-display font-extrabold text-white">100%</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold mt-1">Jargon Banished</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-display font-extrabold text-blue-400">4+ Modes</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold mt-1">Adaptive Explainers</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-display font-extrabold text-indigo-400">OCR Live</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold mt-1">Screenshot Transcriber</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-display font-extrabold text-teal-400">&lt; 0.9s</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold mt-1">Synthesis Latency</div>
          </div>
        </div>
      </section>

      {/* Main Core Strengths & Features Section */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono text-blue-600 font-extrabold uppercase tracking-widest">
            CORE CAPABILITIES
          </span>
          <h3 className="font-display font-bold text-xl md:text-2xl text-slate-900 tracking-tight">
            How Readability Empowers You
          </h3>
          <p className="text-slate-500 text-xs md:text-sm max-w-2xl">
            Our platform doesn't just shorten text. It completely restructures, defines, and reads complex concepts using Gemini's high-fidelity intelligence.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Jargon translation */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
                Simultaneous Translations
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Rather than deleting terms, our engine inserts real-time, context-aware translations directly inside parenthetical annotations. Learn vocabulary as you read!
              </p>
            </div>
          </div>

          {/* Card 2: Multimodal vision scanner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
                Multimodal Image Extraction
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Have an academic slide, a medical prescription photo, or a legal lease agreement? Drop the image. Readability transcribes, processes, and refines it instantly.
              </p>
            </div>
          </div>

          {/* Card 3: Infinity Search Core */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
                Infinity Concept Explorer
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Need to understand an abstract concept from scratch? Just key in any topic name. The system drills down, fetches relevant blueprints, and presents the core truth.
              </p>
            </div>
          </div>

          {/* Card 4: Audio Synthesis */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
                Acoustic Readout Engine
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Listen to your simplified summaries in clean, localized, synthesized voice parameters. Perfect for auditory learners or multi-tasking professionals on the go.
              </p>
            </div>
          </div>

          {/* Card 5: Adaptive Explainer Personas */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
                Multi-Perspective Moods
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Select your clarity target: "Child Friendly" (for raw simplicity), "Analogy Master" (for story comparisons), or "Executive Summary" (for concise decision-making bullet points).
              </p>
            </div>
          </div>

          {/* Card 6: Permanent Clarity Logs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
            <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
                Persisted History Logs
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                All simplified outputs and searches are tracked in persistent local registers. Revisit old logs, check medical term differences, and rebuild your knowledge base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick-Test Search Panel */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h4 className="font-display font-bold text-sm text-slate-950 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
            Quick Topic Explainer
          </h4>
          <p className="text-slate-500 text-xs">
            Select an advanced concept below to immediately view details or run it in the workspace:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {popularTopics.map((topic, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectTopic(topic.title)}
              className="p-4 border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <h5 className="font-display font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-wider">
                  {topic.title}
                </h5>
                <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                  {topic.desc}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-blue-600 font-bold uppercase mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explain in Workspace</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Roadmap / Steps */}
      <section className="flex flex-col gap-6">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
          <span className="text-[10px] font-mono text-indigo-600 font-extrabold uppercase tracking-widest">
            SIMPLE WORKFLOW
          </span>
          <h3 className="font-display font-bold text-xl text-slate-900 tracking-tight">
            Three Steps to Full Comprehension
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center gap-3 relative">
            <div className="w-12 h-12 rounded-full bg-slate-950 text-white font-mono text-sm font-bold flex items-center justify-center shadow-md">
              01
            </div>
            <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider">
              Input Document or Search
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Paste your dense scientific excerpt, legal liability terms, or type any abstract topic you'd love explained.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center gap-3 relative">
            <div className="w-12 h-12 rounded-full bg-slate-950 text-white font-mono text-sm font-bold flex items-center justify-center shadow-md">
              02
            </div>
            <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider">
              Select Explanation Mode
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Pick the cognitive blueprint that fits your style. Whether you prefer playful stories, deep structured logs, or brevity.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center gap-3 relative">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-mono text-sm font-bold flex items-center justify-center shadow-md">
              03
            </div>
            <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider">
              Banish Complexity
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Get an annotated, audio-synthesized, multi-tier clean summary that guarantees absolute understanding.
            </p>
          </div>
        </div>
      </section>

      {/* Target Audiences / Use Cases */}
      <section className="bg-slate-100 border border-slate-200/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="md:w-1/2 flex flex-col gap-4">
          <span className="text-[10px] font-mono text-indigo-600 font-extrabold uppercase tracking-widest">
            WHO BENEFITS
          </span>
          <h3 className="font-display font-bold text-xl md:text-2xl text-slate-900 tracking-tight leading-tight">
            Unlocking Jargon for Every Professional
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Technical papers, legal terms, and jargon act as structural barriers that block growth. Readability breaks down those walls so anyone can keep up.
          </p>

          <div className="flex flex-col gap-2.5 mt-2">
            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-slate-900">Students & Researchers</strong>: Master advanced journal entries, complex mathematical models, and biological path mechanics quickly.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-slate-900">Patients & Healthcare Seekers</strong>: Interpret complex clinical trial results, lab reports, and medication side effects in terms that build peace of mind.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-slate-900">Lessees & Business Founders</strong>: Navigate multi-page service agreements, privacy disclosures, and legal NDAs without paying for costly reviews.</span>
            </div>
          </div>
        </div>

        {/* Visual Quotes Carousel (Testimonials) */}
        <div className="md:w-1/2 w-full grid grid-cols-1 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 italic text-xs leading-relaxed">
              "As a pre-med student, reading clinical papers took me hours. With Readability, I drop the PDF screenshots and instantly see definitions in brackets. It saved me at least 15 hours last week alone!"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-800">
                AP
              </div>
              <div>
                <div className="text-xs font-bold text-slate-950 font-display">Aria Patel</div>
                <div className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Pre-Med Student, Stanford</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 italic text-xs leading-relaxed">
              "We had a 12-page commercial lease written in heavy legal boilerplate. Readability's 'Executive Summary' mode pinpointed the security deposit liabilities and maintenance clauses in under 10 seconds!"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-800">
                MK
              </div>
              <div>
                <div className="text-xs font-bold text-slate-950 font-display">Marcus Vance</div>
                <div className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Founder, Vance Coffee Co.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Bar */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 text-center flex flex-col items-center gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/50 mix-blend-overlay" />
        <h3 className="font-display font-bold text-lg md:text-xl text-white relative z-10">
          Ready to experience true linguistic simplicity?
        </h3>
        <p className="text-slate-400 text-xs max-w-md leading-relaxed relative z-10">
          Drop a complex block of text or type a mysterious academic topic, and watch Mr. Kilvish banish the jargon.
        </p>
        <button
          onClick={onStartWorkspace}
          className="mt-2 px-8 py-3 bg-white text-slate-950 font-display font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 active:scale-[0.98] transition-all shadow-md relative z-10 cursor-pointer flex items-center gap-2"
        >
          <span>Open Jargon Banish Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
