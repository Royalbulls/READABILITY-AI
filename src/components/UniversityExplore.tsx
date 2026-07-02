import React, { useState } from "react";
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  RefreshCw, 
  GraduationCap, 
  Clock, 
  Star,
  Languages,
  Check
} from "lucide-react";

interface UniversityExploreProps {
  topic: string;
  setTopic: (val: string) => void;
  onGenerateCourse: (selectedLanguage: string, selectedLevel: string) => void;
  isLoading: boolean;
  courses: any[];
  onEnrollCourse: (course: any) => void;
}

export default function UniversityExplore({
  topic,
  setTopic,
  onGenerateCourse,
  isLoading,
  courses,
  onEnrollCourse
}: UniversityExploreProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [langPreference, setLangPreference] = useState<"English" | "Hindi" | "Multilingual">("English");
  const [levelPreference, setLevelPreference] = useState<"Beginner" | "Intermediate" | "Advanced" | "Professional">("Beginner");

  const popularSyllabi = [
    { id: "ai_eng", title: "Artificial Intelligence Foundations", category: "Engineering", rating: 4.9, hours: 30 },
    { id: "gst_compliance", title: "GST Regulatory & CA Auditing Compliance", category: "Business", rating: 5.0, hours: 45 },
    { id: "quantum_comp", title: "Quantum Computing Algorithms", category: "Science", rating: 4.8, hours: 40 },
    { id: "fintech_risk", title: "Fintech Risk Mitigation & Sovereign Lending", category: "Finance", rating: 4.9, hours: 35 },
    { id: "saas_scaling", title: "SaaS Product Design & Capital Audits", category: "Business", rating: 4.7, hours: 25 },
    { id: "data_science", title: "Data Science & Predictive Statistical Models", category: "Science", rating: 4.8, hours: 38 }
  ];

  const filteredPopular = popularSyllabi.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Dynamic Course Generator Card */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-100/40 border border-violet-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 border border-violet-200 text-violet-700 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-spin" />
              Dynamic AI Course Builder
            </div>
            
            <h2 className="text-xl md:text-2xl font-display font-bold text-slate-800 tracking-tight leading-tight">
              Assemble Any Subject into an Accredited University Syllabus
            </h2>
            
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-xl">
              Input any technical field, complex academic concept, regulatory GST framework, or business domain. Gemini and Readability AI will immediately compile a full, multi-tier curriculum.
            </p>

            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Language Preference */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Course Medium Language
                  </label>
                  <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200">
                    {["English", "Hindi", "Multilingual"].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLangPreference(lang as any)}
                        className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          langPreference === lang
                            ? "bg-violet-600 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Preference */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Starting Subject Level
                  </label>
                  <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200">
                    {["Beginner", "Intermediate", "Advanced", "Professional"].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLevelPreference(lvl as any)}
                        className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          levelPreference === lvl
                            ? "bg-violet-600 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {lvl.substring(0, 4)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Topic Input */}
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="e.g., Prime Minister Mudra Yojana (PMMY), Python Compiler Mechanics, GST Section 12 Audits..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="flex-1 bg-white text-xs text-slate-800 p-3.5 rounded-xl border border-violet-200 focus:outline-none focus:border-violet-400 font-sans font-semibold placeholder:text-slate-400 shadow-sm"
                />

                <button
                  onClick={() => onGenerateCourse(langPreference, levelPreference)}
                  disabled={isLoading || !topic.trim()}
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-violet-400 shadow-sm md:w-auto"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating Syllabus Modules...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Assemble & Generate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-5 p-6 bg-white border border-violet-100 rounded-3xl shadow-sm space-y-4">
            <h4 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider">
              🛡️ Accredited Syllabus Output
            </h4>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex gap-2 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-1.5 shrink-0" />
                <p>Generates high-fidelity chapters mapped precisely for India-focused industrial standards.</p>
              </div>
              <div className="flex gap-2 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-1.5 shrink-0" />
                <p>Curates interactive glossary flashcards to simplify technical jargon.</p>
              </div>
              <div className="flex gap-2 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-1.5 shrink-0" />
                <p>Automatically bundles customized practice tests and timed final certification tests.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-display font-bold text-base text-slate-800">
              Institutional Course Catalog
            </h3>
            <p className="text-slate-400 text-xs">Accredited curricula ready for instantaneous launch and learning.</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-violet-500 font-sans text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPopular.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-violet-200 hover:shadow-md transition-all flex flex-col justify-between gap-5">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded">
                    {c.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    {c.rating}
                  </div>
                </div>

                <h4 className="font-display font-bold text-sm text-slate-800 leading-snug">
                  {c.title}
                </h4>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {c.hours} Hrs
                </div>

                <button
                  onClick={() => {
                    setTopic(c.title);
                    onEnrollCourse(c);
                  }}
                  className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg text-xs transition-all cursor-pointer shadow-sm flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3" /> Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
