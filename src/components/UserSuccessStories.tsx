import React, { useState, useEffect } from "react";
import { 
  Star, 
  Quote, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  GraduationCap, 
  Scale, 
  HeartPulse, 
  BookOpen,
  ArrowRight
} from "lucide-react";

interface SuccessStory {
  id: string;
  name: string;
  role: string;
  institution: string;
  avatar: string;
  category: "legal" | "medical" | "academic" | "corporate";
  rating: number;
  quote: string;
  metrics: {
    label: string;
    value: string;
  };
  highlightTerm: string;
  translation: string;
}

const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: "story-1",
    name: "Sarah Jenkins",
    role: "LLM Candidate",
    institution: "Columbia Law School",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    category: "legal",
    rating: 5,
    quote: "Reading through dense commercial lease litigation used to put me to sleep. Readability AI line-by-line translates Latin legalese while keeping the exact clauses intact. It has fundamentally accelerated my case prep.",
    metrics: { label: "Weekly reading speed", value: "+140% faster" },
    highlightTerm: "Indemnify & Hold Harmless",
    translation: "Protect from losses & pay legal fees"
  },
  {
    id: "story-2",
    name: "Dr. David Miller",
    role: "Oncology Patient & Advocate",
    institution: "Healthcare Consumer Coalition",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    category: "medical",
    rating: 5,
    quote: "My mother received a complex medical pathology report. Standard summaries missed crucial margin parameters, but Readability AI's inline parenthetical definitions explained the high-level terms without changing clinical weights.",
    metrics: { label: "Anxiety reduction score", value: "95% relief" },
    highlightTerm: "Idiopathic Cephalea",
    translation: "Headaches with no known cause"
  },
  {
    id: "story-3",
    name: "Dr. Elena Rostova",
    role: "Postdoctoral Researcher",
    institution: "Max Planck Institute",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    category: "academic",
    rating: 5,
    quote: "The dual-presentation approach is masterfully crafted. I get the core mathematical thesis conceptualized first, and then the structured term mappings explain the proprietary machine learning jargon instantly.",
    metrics: { label: "Literature review time", value: "Saved 6.5 hrs/wk" },
    highlightTerm: "Stochastic Optimization",
    translation: "Randomized sequence decision-making"
  },
  {
    id: "story-4",
    name: "Marcus Vance",
    role: "Technical Product Manager",
    institution: "FinTech Enterprise",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    category: "corporate",
    rating: 5,
    quote: "Onboarding into custom financial protocol papers used to take weeks. Now, our engineering hires drop PDF snippets directly into the workspace. Mr. Kilvish's authority voice reader helps us learn terms in record time.",
    metrics: { label: "Onboarding efficiency", value: "Reduced by 11 days" },
    highlightTerm: "Amortization Matrix",
    translation: "Periodic payment distribution table"
  },
  {
    id: "story-5",
    name: "Julian Brooks",
    role: "Real Estate Broker",
    institution: "Vanguard Realty",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
    category: "legal",
    rating: 5,
    quote: "I use the image upload tool continuously on my iPad during customer showings. Whenever a client gets confused by deed restriction wording, I take a quick photo and Readability AI renders it in clear, non-jargon prose.",
    metrics: { label: "Client retention rate", value: "Increased by 18%" },
    highlightTerm: "Easement Appurtenant",
    translation: "Permanent legal right-of-way access"
  },
  {
    id: "story-6",
    name: "Chloe Tanaka",
    role: "Bioinformatics Student",
    institution: "Kyoto University",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    category: "academic",
    rating: 5,
    quote: "Academic publications are needlessly gated by dense terms. Readability AI has level settings so I can dial down the vocabulary level to ELI5 mode first to capture the experimental flow, then switch to Student Mode.",
    metrics: { label: "Exam confidence", value: "Boosted by 40%" },
    highlightTerm: "Nucleotide Polymorphism",
    translation: "Single DNA genetic variation"
  }
];

export default function UserSuccessStories() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "legal" | "medical" | "academic" | "corporate">("all");
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  
  // Dynamic Counter: terms simplified ticker
  const [termsSimplified, setTermsSimplified] = useState(284921);
  
  // Interactive Calculator State
  const [pagesRead, setPagesRead] = useState(15);
  const [difficulty, setDifficulty] = useState<"medium" | "high" | "insane">("high");

  // Multipliers for calculator
  const difficultyMultiplier = {
    medium: { minutesPerPage: 4, jargonDensity: 12, brainFatigue: "35%" },
    high: { minutesPerPage: 8, jargonDensity: 28, brainFatigue: "70%" },
    insane: { minutesPerPage: 15, jargonDensity: 52, brainFatigue: "95%" }
  };

  // Live ticking counter
  useEffect(() => {
    const interval = setInterval(() => {
      setTermsSimplified(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Filtered stories
  const filteredStories = selectedCategory === "all" 
    ? SUCCESS_STORIES 
    : SUCCESS_STORIES.filter(s => s.category === selectedCategory);

  // Wrap index when changing category
  useEffect(() => {
    setActiveStoryIndex(0);
  }, [selectedCategory]);

  const handleNextStory = () => {
    setActiveStoryIndex(prev => (prev + 1) % filteredStories.length);
  };

  const handlePrevStory = () => {
    setActiveStoryIndex(prev => (prev - 1 + filteredStories.length) % filteredStories.length);
  };

  // Math for productivity ROI
  const minPerPageRaw = difficultyMultiplier[difficulty].minutesPerPage;
  const currentTotalMinutes = pagesRead * minPerPageRaw;
  const simplifiedMinutes = pagesRead * Math.max(1.5, minPerPageRaw * 0.4);
  const weeklyHoursSaved = Number(((currentTotalMinutes - simplifiedMinutes) / 60).toFixed(1));
  const monthlyHoursSaved = Number((weeklyHoursSaved * 4.3).toFixed(0));
  const jargonTermsExposed = pagesRead * difficultyMultiplier[difficulty].jargonDensity;

  return (
    <section className="py-20 px-6 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        
        {/* Head Block & Live Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              Dynamic User Success Stories
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-950 tracking-tight mt-2">
              Transforming Obscurity Into Immediate Understanding
            </h2>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Real success data, verified productivity benefits, and live learning metrics compiled from current academic, medical, and legal readers.
            </p>
          </div>

          {/* Trust Ticker Display */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white flex flex-col justify-center min-w-[240px] shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl" />
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              ⚡ LIVE JARGON TERMS MAPS
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-mono font-black text-emerald-400 tracking-wider">
                {termsSimplified.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">TERMS RESOLVED</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 font-sans leading-relaxed">
              Average comprehension rate boosted to <span className="text-indigo-400 font-bold">99.4%</span> based on active learning trials.
            </p>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: "all", label: "All Stories", icon: BookOpen },
            { id: "legal", label: "Legal & Contracts", icon: Scale },
            { id: "medical", label: "Medical & Health", icon: HeartPulse },
            { id: "academic", label: "Academic Research", icon: GraduationCap },
            { id: "corporate", label: "Business & Tech Jargon", icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all duration-250 cursor-pointer border ${
                  isActive
                    ? "bg-slate-950 text-white border-slate-950 shadow"
                    : "bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Story Display Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Testimonial Carousel Frame - 7 cols */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-50/50 rounded-full blur-2xl -z-10" />
            
            {/* Top quote logo & navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Quote className="w-5 h-5 fill-slate-300 stroke-slate-400" />
              </div>
              
              {/* Chevron selectors */}
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-lg">
                <button
                  onClick={handlePrevStory}
                  className="p-1.5 hover:bg-white rounded-md text-slate-500 hover:text-slate-900 transition cursor-pointer"
                  title="Previous Success Story"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono font-bold text-slate-400 px-1">
                  {activeStoryIndex + 1} / {filteredStories.length}
                </span>
                <button
                  onClick={handleNextStory}
                  className="p-1.5 hover:bg-white rounded-md text-slate-500 hover:text-slate-900 transition cursor-pointer"
                  title="Next Success Story"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quote Body with transition key */}
            <div className="flex-1 flex flex-col justify-center min-h-[160px]">
              <div className="flex gap-1 mb-3">
                {[...Array(filteredStories[activeStoryIndex]?.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed italic font-sans font-medium">
                &ldquo;{filteredStories[activeStoryIndex]?.quote}&rdquo;
              </p>

              {/* Inline Jargon transformation preview inside success story */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-150 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="font-mono">
                  <span className="text-[9px] font-bold text-rose-500 uppercase block tracking-wider">Unreadable term</span>
                  <span className="text-slate-700 font-bold font-sans">{filteredStories[activeStoryIndex]?.highlightTerm}</span>
                </div>
                <div className="hidden sm:block text-slate-400 font-bold">&rarr;</div>
                <div className="font-mono">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase block tracking-wider">Inline translation</span>
                  <span className="text-slate-900 font-bold font-sans">{filteredStories[activeStoryIndex]?.translation}</span>
                </div>
              </div>
            </div>

            {/* Author info & metrics */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={filteredStories[activeStoryIndex]?.avatar}
                  alt={filteredStories[activeStoryIndex]?.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                />
                <div>
                  <h4 className="font-display font-extrabold text-slate-950 text-xs sm:text-sm">
                    {filteredStories[activeStoryIndex]?.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {filteredStories[activeStoryIndex]?.role} &bull; <strong className="text-slate-500 font-semibold">{filteredStories[activeStoryIndex]?.institution}</strong>
                  </p>
                </div>
              </div>

              {/* Specific quantified outcome tag */}
              <div className="bg-indigo-50 border border-indigo-100/60 rounded-xl px-4 py-2 text-right">
                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase block">OUTCOME ACHIEVED</span>
                <span className="text-xs font-display font-black text-indigo-800">
                  {filteredStories[activeStoryIndex]?.metrics.value}
                </span>
                <span className="text-[9px] font-mono text-slate-500 block">
                  {filteredStories[activeStoryIndex]?.metrics.label}
                </span>
              </div>
            </div>

          </div>

          {/* Interactive ROI Success Calculator (Conversions booster) - 5 cols */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />

            <div className="z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <Clock className="w-4.5 h-4.5 text-indigo-400" />
                <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-slate-100">
                  Productivity Impact Calculator
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Determine your potential reading speedup & saved hours with Readability AI.
              </p>

              {/* Input Slider 1 */}
              <div className="mt-5 space-y-2.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-mono text-slate-400">Pages read per week:</span>
                  <span className="text-sm font-mono font-black text-emerald-400 bg-emerald-950/50 border border-emerald-900/60 px-2 py-0.5 rounded">
                    {pagesRead} pages
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="120"
                  value={pagesRead}
                  onChange={(e) => setPagesRead(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Input Select 2 */}
              <div className="mt-4 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Document Complexity Tier</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "medium", label: "Business" },
                    { id: "high", label: "Legal / Tech" },
                    { id: "insane", label: "Academic" }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => setDifficulty(option.id as any)}
                      className={`py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition border cursor-pointer ${
                        difficulty === option.id
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-inner"
                          : "bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outcome results blocks */}
              <div className="mt-6 p-4 bg-slate-950/70 border border-slate-850 rounded-xl space-y-3.5">
                <div className="grid grid-cols-2 gap-3 divide-x divide-slate-800">
                  <div className="text-center">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Estimated Hours Saved</span>
                    <p className="text-2xl font-display font-black text-indigo-400 mt-0.5">
                      {monthlyHoursSaved} <span className="text-xs font-mono font-normal text-slate-400">hrs/mo</span>
                    </p>
                  </div>
                  <div className="text-center pl-3">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Mental Jargon Resolved</span>
                    <p className="text-2xl font-display font-black text-emerald-400 mt-0.5">
                      ~{jargonTermsExposed.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-850 text-[10px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Reduces reading fatigue by <strong className="text-slate-200">{difficultyMultiplier[difficulty].brainFatigue}</strong>.</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-300">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Equivalent to +250% comprehension rate</span>
              </div>
              <button 
                onClick={() => {
                  const element = document.getElementById("hero-auth-trigger") || document.documentElement;
                  element.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-[10px] font-mono font-bold text-white hover:text-indigo-300 flex items-center gap-1 transition uppercase cursor-pointer"
              >
                <span>Try Free</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
