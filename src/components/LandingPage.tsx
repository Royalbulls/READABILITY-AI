import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowRightLeft,
  FileText, 
  Infinity, 
  Volume2, 
  Upload, 
  ShieldCheck, 
  Lock, 
  GraduationCap, 
  Scale, 
  HeartPulse, 
  BookOpen, 
  CheckCircle2, 
  ChevronDown, 
  Star,
  Zap,
  Users,
  Eye,
  LogIn
} from "lucide-react";

interface LandingPageProps {
  onSignIn: () => void;
  isAuthLoading: boolean;
}

export default function LandingPage({ onSignIn, isAuthLoading }: LandingPageProps) {
  // State for interactive Before vs After comparison
  const [activeComparison, setActiveComparison] = useState<"legal" | "medical" | "academic">("legal");
  
  // State for FAQ accordions
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Static content for Before vs After
  const comparisons = {
    legal: {
      before: "The Lessee shall indemnify, defend, and hold harmless the Lessor from and against any and all third-party claims, liabilities, losses, damages, or costs (including reasonable attorneys' fees) arising out of or resulting from Lessee's breach of any covenant herein.",
      after: "As the tenant (Lessee), you agree to protect, pay for legal defense, and cover any financial losses or damages for the landlord (Lessor) if someone sues them because you broke any part of this agreement.",
      jargon: ["Indemnify (protect/compensate)", "Lessor (landlord)", "Lessee (tenant)", "Covenant (agreement/promise)"]
    },
    medical: {
      before: "The patient presented with acute, transient episodes of idiopathic cephalea accompanied by microvascular vasospasms, necessitating immediate administration of acetylsalicylic acid to inhibit thromboxane synthesis.",
      after: "The patient experienced sudden, short-lived headaches of unknown cause along with temporary narrowing of small blood vessels in the brain, requiring immediate treatment with aspirin (acetylsalicylic acid) to prevent blood clots.",
      jargon: ["Transient (short-lived)", "Idiopathic (unknown cause)", "Cephalea (headache)", "Acetylsalicylic acid (aspirin)"]
    },
    academic: {
      before: "Our empirical methodology leverages a convoluted neural network architecture configured to extract heuristic parameters from heterogeneous metadata collections, culminating in optimized hyperparameter distribution.",
      after: "We used a complex computer network design (neural network) to pull practical rules of thumb (heuristic parameters) from diverse types of data (heterogeneous metadata) to automatically find the best settings.",
      jargon: ["Empirical methodology (practical testing)", "Convoluted neural network (complex computer network for images/patterns)", "Heterogeneous (diverse/different kinds)", "Hyperparameters (internal settings)"]
    }
  };

  const faqs = [
    {
      q: "What is Readability AI?",
      a: "Readability AI is a cognitive translation assistant that translates complex, high-jargon texts into clear, simple plain English. Unlike generic AI summary tools, it preserves the original depth of your material while explaining complex terminology inline using parenthetical translations so you can read without getting stuck."
    },
    {
      q: "Who is Mr. Kilvish?",
      a: "Mr. Kilvish is our conversational voice assistant and authority persona. When you translate your text or ask for search answers, you can listen to a beautiful, clear narration crafted with deeper vocal authority to help auditory learners absorb complex subjects effortlessly."
    },
    {
      q: "Is my personal document data secure?",
      a: "Absolutely. Security is our primary foundation. When you sign in with Google, all your synchronization flows securely through Firestore with strict user-level authentication guards. We have a zero-retention policy for AI inputs—your text is processed directly on secure servers and never used to train future public models."
    },
    {
      q: "Can I try it without registering?",
      a: "Yes! But to store logs, sync history across devices, access advanced modes, and secure continuous storage, we require a secure, one-click Sign In with Google. This keeps your records isolated and accessible only to you."
    },
    {
      q: "How does the 'Before vs After' compare to translation tools?",
      a: "Generic translation tools handle language-to-language translation, but they keep the same vocabulary level. Readability AI performs vocabulary-level translation (simplification) within the same language, breaking down complex syntax while retaining the original text structure."
    }
  ];

  return (
    <div className="w-full bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-28 px-6 bg-gradient-to-b from-white via-indigo-50/10 to-slate-50 border-b border-slate-100">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
        
        {/* Soft glowing circles in Material Design styling */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-48 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-mono font-bold uppercase rounded-full mb-6 tracking-wider shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-200" />
            <span>Readability AI v2.5 Released</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-950 tracking-tight leading-[1.1] mb-6 max-w-3xl">
            Banish the Darkness of <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 bg-clip-text text-transparent">Convoluted Jargon</span>
          </h1>

          {/* Subheading */}
          <p className="text-slate-600 text-base sm:text-lg md:text-xl font-normal leading-relaxed mb-10 max-w-2xl text-center">
            Upload legal agreements, medical files, or academic research. Readability AI instantly translates complex, heavy text into plain, clear, beautiful English without losing original details.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <button
              onClick={onSignIn}
              disabled={isAuthLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              {isAuthLoading ? (
                <span>Preparing secure gateway...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-indigo-300" />
                  <span>Start Simplification Free</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </>
              )}
            </button>
            <a
              href="#what-is-it"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-200 font-display font-bold text-sm tracking-wide shadow-sm hover:border-slate-300 transition-all"
            >
              <span>See How It Works</span>
            </a>
          </div>

          {/* Social Proof Text / Minimal Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono font-semibold">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> NO INSTANT CREDIT CARDS</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> GOOGLE SECURITY STANDARD</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> ZERO-RETENTION PIPELINE</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHAT IS READABILITY AI? */}
      <section id="what-is-it" className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 flex flex-col gap-4">
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
                Our Core Philosophy
              </span>
              <h2 className="font-display font-extrabold text-3xl text-slate-950 tracking-tight leading-tight">
                An Intelligent Translation Layer For Human Comprehension
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Jargon serves as a barrier, hiding crucial knowledge behind exclusive terminology. Whether reading a complicated tenant agreement, studying high-level medical results, or wading through doctoral research, complex words halt reading flow.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Readability AI acts as a smart translation layer. Instead of summarizing away key details, our custom-prompted Gemini model reads your text line-by-line, and injects translations inside parenthetical brackets directly where terms appear. You learn the vocabulary while gaining crystal-clear understanding.
              </p>
            </div>

            {/* Visual presentation card with modern glassmorphism/gradient accent */}
            <div className="lg:col-span-7 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-mono text-xs text-slate-400">READABILITY ENGINE v2.5</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-indigo-400 border border-slate-700">
                  Dual Output Active
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <h4 className="font-mono text-xs text-indigo-300 font-bold uppercase tracking-wider">
                    I. THE CORE CONCEPT
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                    Our cognitive platform simplifies complex text by replacing industrial jargon with clear, parenthetical definitions, helping readers understand obscure terminology without stopping their reading flow.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-mono text-xs text-blue-300 font-bold uppercase tracking-wider">
                    II. THE DETAIL BREAKDOWN
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
                      <span><strong>Terminology Mapping:</strong> Terms are translated in-line to reduce mental cognitive load.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
                      <span><strong>Retains Nuance:</strong> Core contextual values, figures, legal conditions, and scientific metrics remain completely unchanged.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURE GRID */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
              Capabilities Suite
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-950 tracking-tight mt-2">
              Equipped For Every Text Complexity
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg">
              Unlock powerful simplification tools designed to handle dense documents, images, and quick knowledge queries instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Document Simplification
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Paste long text sheets directly into our smart workspace. Get back perfectly formatted plain English that maps details in a beautiful structure.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Infinity className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Infinity Search Core
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Enter any complicated concept (like &quot;blockchain validation,&quot; &quot;arbitrage,&quot; or &quot;photosynthesis&quot;) and get back deep, clear breakdowns.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Multimodal Image Extraction
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Upload image screenshots or text photos. Our smart engine auto-extracts text via OCR and simplifies the extracted contents instantly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Read Aloud voice Engine
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Auditory learners can activate Mr. Kilvish&apos;s deep narrating speech voice to read the simplified results back with pristine pacing and volume.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Privacy Guard Sync
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Connect securely to Firebase Firestore to automatically back up and view your reading history across all your active desktop and mobile web devices.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Advanced Reading Modes
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Toggle between standard &quot;Plain English&quot; and structured &quot;Academy Mode&quot; to customize simplification formats based on your learning speed.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: WHO IS IT FOR? */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
              Target Audiences
            </span>
            <h2 className="font-display font-extrabold text-3xl text-slate-950 tracking-tight mt-2">
              Who Relies On Readability AI?
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg">
              Clarity is essential across every walk of life. Here is how specialized readers speed past barriers using our translation platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Target 1 */}
            <div className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Students & Researchers
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Understand difficult medical research, complex physics journals, and textbook readings. Study faster by avoiding hours of dictionary searches.
              </p>
            </div>

            {/* Target 2 */}
            <div className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Business & Legal Experts
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Decode confusing terms of service, non-disclosure agreements, and complex rental contracts without paying costly advisory rates.
              </p>
            </div>

            {/* Target 3 */}
            <div className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Patients & Consumers
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Translate doctor files, scan complex health diagnostics, and understand clinical prescriptions clearly to make confident health decisions.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: BEFORE VS AFTER COMPARISON */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
              Live Demonstration
            </span>
            <h2 className="font-display font-extrabold text-3xl text-slate-950 tracking-tight mt-2">
              Witness the Impact of Plain English
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg">
              Compare original documents with simplified translations side-by-side. Use the tabs below to view real-world translation examples.
            </p>
          </div>

          {/* Interactive tabs */}
          <div className="flex justify-center gap-2 mb-8 bg-slate-200/60 p-1.5 rounded-xl max-w-sm mx-auto">
            <button
              onClick={() => setActiveComparison("legal")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeComparison === "legal"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Legal Agreement
            </button>
            <button
              onClick={() => setActiveComparison("medical")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeComparison === "medical"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Medical Report
            </button>
            <button
              onClick={() => setActiveComparison("academic")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeComparison === "academic"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Research Paper
            </button>
          </div>

          {/* Dual Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Before (Obscured Jargon) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Original Jargon Document
                </span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed font-sans flex-1 italic bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                &ldquo;{comparisons[activeComparison].before}&rdquo;
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {comparisons[activeComparison].jargon.map((jargonItem, i) => (
                  <span key={i} className="px-2 py-0.5 bg-rose-50 border border-rose-100 text-[10px] font-mono text-rose-700 rounded">
                    {jargonItem.split(" ")[0]}
                  </span>
                ))}
              </div>
            </div>

            {/* After (Readability AI simplified) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md flex flex-col text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest">
                    Readability AI Simplified
                  </span>
                </div>
                <div className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[9px] text-emerald-400 font-mono font-bold">
                  100% Clarity Score
                </div>
              </div>

              <p className="text-slate-100 text-sm leading-relaxed font-sans flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
                &ldquo;{comparisons[activeComparison].after}&rdquo;
              </p>

              <div className="mt-4 border-t border-slate-800/80 pt-4 flex flex-col gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Extracted Inline Vocabulary Translations:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
                  {comparisons[activeComparison].jargon.map((jargonItem, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{jargonItem}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: WHY CHOOSE READABILITY AI */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
              Unique Value Proposition
            </span>
            <h2 className="font-display font-extrabold text-3xl text-slate-950 tracking-tight mt-2">
              Engineered For Cognitive Performance
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg">
              Generic summarization platforms omit complex items entirely. Readability AI is crafted to teach and explain, ensuring total information accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Core Value 1 */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono font-extrabold text-indigo-600">01 / DUAL PRESENTATION</span>
              <h4 className="font-display font-bold text-slate-950 text-base">Core & Breakdown</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Always delivers a concise unified concept summary first, followed by structured, bulleted terminological mappings.
              </p>
            </div>

            {/* Core Value 2 */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono font-extrabold text-blue-600">02 / ZERO ACCIDENT OMISSIONS</span>
              <h4 className="font-display font-bold text-slate-950 text-base">Preserves Numbers</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Retains all raw data, medical weights, monetary rates, and dates—preventing critical reading omissions.
              </p>
            </div>

            {/* Core Value 3 */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono font-extrabold text-teal-600">03 / INLINE DICTIONARY</span>
              <h4 className="font-display font-bold text-slate-950 text-base">Parenthetical Help</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Injects direct translations within reading parentheses so your eyes never have to navigate away to separate tabs.
              </p>
            </div>

            {/* Core Value 4 */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono font-extrabold text-rose-600">04 / MR. KILVISH PERSONALITY</span>
              <h4 className="font-display font-bold text-slate-950 text-base">Acoustic Authority</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Gives reading responses deep physical voice presence, enhancing retention and overall reading engagement.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: SECURITY & PRIVACY */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-lg">
                  Zero Trust Privacy
                </h3>
                <p className="text-slate-400 text-xs font-mono mt-1 font-semibold uppercase">
                  100% Data Protection
                </p>
              </div>
            </div>

            <div className="md:col-span-8 flex flex-col gap-4">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> SECURED STORAGE PROTOCOL
              </span>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Your private documentations should remain fully private. We operate with strict Firebase security rules that ensure reading logs are isolated under private user ID hashes. No other users or outside agents can access your files.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>No data used to train models</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Safe Google OAuth gateway</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Encrypted end-to-end payloads</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant history deletion at any time</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 8: TESTIMONIALS */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
              User Satisfaction
            </span>
            <h2 className="font-display font-extrabold text-3xl text-slate-950 tracking-tight mt-2">
              Loved By Readers Everywhere
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg">
              Hear how Readability AI saves hours of frustration and elevates clarity across diverse use cases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Testimonial 1 */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">
                  &ldquo;As a law student, reading through dense corporate litigation used to put me to sleep. Readability AI preserves the exact court clauses but translates the Latin jargon. It&apos;s a total game changer.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-200/60 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Sarah" 
                  className="w-9 h-9 rounded-full object-cover border border-slate-200" 
                />
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-xs">Sarah Jenkins</h4>
                  <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase">Law Student, Columbia</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">
                  &ldquo;I uploaded my mother&apos;s complex oncology report after her surgery. Being able to read through the results with simple parenthetical medical translations helped us ask the doctor the right questions.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-200/60 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" 
                  alt="David" 
                  className="w-9 h-9 rounded-full object-cover border border-slate-200" 
                />
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-xs">David Miller</h4>
                  <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase">Healthcare Consumer</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">
                  &ldquo;The Infinity Search engine is my favorite. I searched for complex cryptography details and got back a clean breakdown instantly. Listening to Mr. Kilvish read the audio completes the learning loop.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-200/60 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" 
                  alt="Elena" 
                  className="w-9 h-9 rounded-full object-cover border border-slate-200" 
                />
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-xs">Elena Rostova</h4>
                  <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase">Frontend Architect</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
              Common Inquiries
            </span>
            <h2 className="font-display font-extrabold text-3xl text-slate-950 tracking-tight mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              Everything you need to know about Readability AI and our secure translation core.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <span className="font-display font-bold text-slate-800 text-sm">
                    {faq.q}
                  </span>
                  <ChevronDown 
                    className={`w-4.5 h-4.5 text-slate-500 transition-transform duration-300 shrink-0 ml-2 ${
                      openFaqIndex === index ? "rotate-180" : ""
                    }`} 
                  />
                </button>
                
                {openFaqIndex === index && (
                  <div className="px-6 pb-5 pt-1 border-t border-slate-100 text-xs sm:text-sm text-slate-500 leading-relaxed bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: FINAL CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl mb-6 shadow-md shadow-indigo-150">
            R
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-950 tracking-tight mb-4">
            Embrace Clarity in Your Reading Now
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-8 max-w-lg leading-relaxed">
            No subscription loops. No credit cards. Get started instantly with one-click secure Google login and start simplifying technical material within minutes.
          </p>
          <button
            onClick={onSignIn}
            disabled={isAuthLoading}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-850 active:scale-95 text-white font-display font-bold text-sm tracking-wide rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            {isAuthLoading ? (
              <span>Activating pipeline...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-indigo-300" />
                <span>Get Started with Google</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </>
            )}
          </button>
        </div>
      </section>

      {/* SECTION 11: PROFESSIONAL FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-base font-display">
              R
            </div>
            <div>
              <p className="font-sans font-bold text-slate-800 tracking-wide">
                READABILITY <span className="text-slate-400 font-medium">AI</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Clarity-first document simplification</p>
            </div>
          </div>
          
          <div className="flex flex-col md:items-end text-center md:text-right gap-1.5 font-semibold">
            <p>&copy; {new Date().getFullYear()} READABILITY AI. ALL RIGHTS OF CLARITY PRESERVED.</p>
            <p className="text-[10px]">POWERED BY GEMINI-3.5-FLASH &bull; CORE ENGINE: MR. KILVISH</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
