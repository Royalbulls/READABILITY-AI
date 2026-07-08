import React from "react";
import { 
  Shield, 
  Sparkles, 
  Info, 
  HelpCircle, 
  BookOpen, 
  Cpu, 
  Lock, 
  Eye, 
  ArrowRight,
  Terminal,
  FileText
} from "lucide-react";

interface AboutSectionProps {
  onBackToWorkspace: () => void;
}

export default function AboutSection({ onBackToWorkspace }: AboutSectionProps) {
  const manifestoPoints = [
    {
      title: "Democratic Access to Truth",
      desc: "Knowledge should never be gated behind archaic legal boilerplate, complex medical charts, or dry academic papers. We believe in absolute transparency."
    },
    {
      title: "Contextual Enhancement, Not Destruction",
      desc: "We don't just dumb down your files. We add context. By writing definitions inside parentheses next to complex vocabulary, you actually learn the jargon rather than avoiding it."
    },
    {
      title: "Cognitive Ergonomics",
      desc: "Our output visual layouts are custom-tailored to reduce cognitive load. Staggered headers, bold keywords, and a dual-perspective split make scanning a breeze."
    }
  ];

  const faqItems = [
    {
      q: "How does the jargon translation work under the hood?",
      a: "When you feed text to Readability, our Gemini model parses every noun and technical phrase. It compares them against a vast database of common knowledge, identifies complex jargon, and automatically appends immediate definitions in parentheses."
    },
    {
      q: "Can I simplify charts, slides, or screenshot text?",
      a: "Absolutely! The system utilizes Gemini's high-fidelity multimodal vision capabilities. When you upload a PNG or JPEG, our engine processes the image pixels, transcribes the written text, extracts key structures, and then runs our simplification formulas on them."
    },
    {
      q: "What is the 'Infinity Search' feature?",
      a: "If you don't have a source text but want to learn something complex (e.g., Quantum Computing or how CRISPR works), Infinity Search acts as an autonomous textbook. It builds a structured outline, defines advanced processes step-by-step, and delivers a robust conceptual summary."
    },
    {
      q: "Are my uploaded documents and private text secure?",
      a: "Yes! Your privacy is fully preserved. Your source texts, uploaded screenshot images, and simplified results are never persisted on any external cloud server. They are handled transiently in-memory during API calls, and saved exclusively inside your browser's private local storage."
    }
  ];

  return (
    <div className="w-full flex flex-col gap-10 animate-fadeIn py-4">
      {/* Introduction Banner */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-2/3 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase self-start">
            <Info className="w-3.5 h-3.5 text-slate-900" />
            Our Core Mission
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-slate-950 tracking-tight leading-tight">
            Democratizing Knowledge by Banishment of Obfuscation.
          </h2>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
            Readability was founded on a simple truth: <strong>the way we write is often broken</strong>. Academics write to look smart, lawyers write to minimize liability, and medical charts are designed for machines. This leaves students, patients, and citizens stranded in a sea of confusing noise.
          </p>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
            Our app banishes that darkness. We translate high-level definitions back into standard human conversation. Whether it's a tenant lease, a science blog post, or a health diagnostic summary, we give you the tools to command full comprehension in seconds.
          </p>
        </div>

        {/* Animated Cyber Shield graphic */}
        <div className="md:w-1/3 w-full flex justify-center">
          <div className="relative w-36 h-36 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col items-center justify-center p-4 text-center group shadow-inner">
            <div className="absolute inset-0 bg-radial-gradient from-blue-50/20 via-transparent to-transparent opacity-50 rounded-3xl" />
            <Shield className="w-12 h-12 text-slate-900 mb-2 transition-transform group-hover:scale-110 duration-500" />
            <span className="text-[10px] font-mono font-bold text-slate-900 uppercase">100% SECURE</span>
            <span className="text-[8px] font-mono text-slate-400 mt-0.5">LOCAL PERSISTENCE ONLY</span>
          </div>
        </div>
      </section>

      {/* The Legend of Mr. Kilvish */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops)) from-indigo-950/30 via-slate-900 to-slate-950 opacity-90 z-0" />
        
        <div className="md:w-1/3 flex flex-col items-center text-center z-10">
          <div className="w-20 h-20 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-indigo-400 mb-3 shadow-lg">
            <Cpu className="w-10 h-10 animate-pulse" />
          </div>
          <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-white">
            MR. KILVISH
          </h3>
          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-widest mt-1">
            CORE COGNITIVE DEFENDER
          </p>
        </div>

        <div className="md:w-2/3 flex flex-col gap-4 z-10">
          <h4 className="font-display font-bold text-base text-blue-400">
            Who is Mr. Kilvish?
          </h4>
          <p className="text-slate-300 text-xs leading-relaxed">
            In ancient literature, Kilvish represented absolute darkness. In our universe, <strong>Mr. Kilvish</strong> has been entirely reprogrammed. He is now the <strong>Guardian of Pure Clarity</strong>, who absorbs complex, confusing texts and uses his high-intensity core to emit pure, clean language.
          </p>
          <p className="text-slate-300 text-xs leading-relaxed">
            He works day and night to defend humans from "academic gatekeeping" and "corporate fine print." When you run a query, his core orb pulses, scans your files, and readouts the simplified text aloud so you can learn effortlessly.
          </p>
          <div className="text-xs font-mono text-indigo-300 italic">
            &quot;Banish the darkness of jargon. Let information stream freely!&quot;
          </div>
        </div>
      </section>

      {/* The Manifesto / Core Principles */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-950" />
          <h3 className="font-display font-extrabold text-xs text-slate-900 uppercase tracking-wider">
            Our Clarity Manifesto
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {manifestoPoints.map((point, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-2.5">
              <span className="text-[10px] font-mono text-blue-600 font-extrabold">0{idx + 1} / CONCEPT</span>
              <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wide">
                {point.title}
              </h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-indigo-600 font-extrabold uppercase tracking-widest">
            DETAILED QUESTIONS
          </span>
          <h3 className="font-display font-bold text-xl text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-slate-950 shrink-0" />
            Frequently Asked Questions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqItems.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-2">
              <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider flex items-start gap-1.5">
                <span className="text-blue-600 font-mono">Q:</span>
                <span>{item.q}</span>
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed pl-4">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center flex flex-col items-center gap-3">
        <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider">
          Ready to put these guidelines to the test?
        </h3>
        <p className="text-slate-500 text-xs max-w-md">
          Head straight back to the Workspace, enter your complex document or pick a suggested topic, and let Mr. Kilvish work his magic!
        </p>
        <button
          onClick={onBackToWorkspace}
          className="mt-2 px-6 py-2.5 bg-slate-950 hover:bg-slate-850 text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span>Go to Workspace Tool</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
