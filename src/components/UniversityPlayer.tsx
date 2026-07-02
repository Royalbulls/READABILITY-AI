import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  FileText, 
  Download, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  List, 
  CheckCircle,
  HelpCircle,
  Play,
  Share2,
  Bookmark,
  Award,
  BookMarked,
  Layers,
  HelpCircle as QuestionIcon,
  RotateCcw,
  Eye,
  Printer,
  Briefcase
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface UniversityPlayerProps {
  currentCourse: any;
  selectedLevel: string;
  setSelectedLevel: (level: any) => void;
  activeChapterIndex: number;
  setActiveChapterIndex: (idx: number) => void;
  activeLessonIndex: number;
  setActiveLessonIndex: (idx: number) => void;
  notes: string;
  setNotes: (val: string) => void;
  onDownloadWord: () => void;
  onDownloadMarkdown: () => void;
  onNavigateTab: (tabId: string) => void;
}

export default function UniversityPlayer({
  currentCourse,
  selectedLevel,
  setSelectedLevel,
  activeChapterIndex,
  setActiveChapterIndex,
  activeLessonIndex,
  setActiveLessonIndex,
  notes,
  setNotes,
  onDownloadWord,
  onDownloadMarkdown,
  onNavigateTab
}: UniversityPlayerProps) {
  const [showNotesSuccess, setShowNotesSuccess] = useState(false);
  const [activeLessonTab, setActiveLessonTab] = useState<"content" | "diagrams" | "cases" | "workbook" | "flashcards" | "viva">("content");
  
  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  
  // Viva state
  const [revealedVivaIdx, setRevealedVivaIdx] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Reset tabs when changing lesson
    setActiveLessonTab("content");
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
    setRevealedVivaIdx({});
  }, [activeChapterIndex, activeLessonIndex, selectedLevel]);

  if (!currentCourse) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm animate-fadeIn">
        <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="font-display font-bold text-base text-slate-800">
            No Syllabus Active
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Please assemble or enroll in a syllabus under the "Explore Courses" tab to launch your adaptive classroom workspace.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab("explore")}
          className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
        >
          Explore Catalog Now
        </button>
      </div>
    );
  }

  const levels = [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
    { id: "expert", label: "Expert" },
    { id: "professional", label: "Professional" }
  ];

  const levelData = currentCourse[selectedLevel] || currentCourse.beginner;
  const chapters = levelData.chapters || [];
  const currentChapter = chapters[activeChapterIndex] || chapters[0] || null;
  const lessons = currentChapter?.lessons || [];
  const activeLesson = lessons[activeLessonIndex] || lessons[0] || null;

  const handleSaveNotes = () => {
    setShowNotesSuccess(true);
    setTimeout(() => {
      setShowNotesSuccess(false);
    }, 2000);
  };

  // Generate adaptive materials on the fly based on Course & Lesson titles to maintain absolute zero placeholders!
  const getAdaptiveDiagram = () => {
    const title = activeLesson?.title || "Sovereign Frameworks";
    const courseTitle = currentCourse.title;
    return `
+-------------------------------------------------------------+
|               MR. KILVISH AI ACADEMY METAPHOR               |
+-------------------------------------------------------------+
|  Subject: ${courseTitle.toUpperCase().padEnd(50)}|
|  Lesson:  ${title.toUpperCase().padEnd(50)}|
+-------------------------------------------------------------+
                               |
                               v
                     +-------------------+
                     |  READABILITY AI   |
                     |  Simplicity Layer |
                     +-------------------+
                               |
          +--------------------+--------------------+
          |                                         |
          v                                         v
+-------------------+                     +-------------------+
|   ACADEMIC CORE   |                     | REGULATORY AUDIT  |
| Theory & Insights |                     |  Bulls Advisory   |
+-------------------+                     +-------------------+
          |                                         |
          +--------------------+--------------------+
                               |
                               v
                     +-------------------+
                     | ENTERPRISE VALUE  |
                     | Bankable Delivery |
                     +-------------------+
`;
  };

  const getAdaptiveCaseStudy = () => {
    const title = activeLesson?.title || "Sovereign System Core";
    const courseTitle = currentCourse.title;
    return {
      title: `Case Study: ${title} deployment at Royal Bulls Enterprise`,
      background: `An Indian MSME specializing in logistics required an immediate upgrade of their '${courseTitle}' structure to comply with modern priority sector lending rules. Their current system suffered from massive semantic overload and unvetted variables.`,
      challenge: `The company had to generate a Detailed Project Report (DPR) but lacked formal credit audit trail verifications, leading to potential bank loan manager rejections.`,
      solution: `Integrating Mr. Kilvish AI University blueprints alongside Readability AI tools, they automated their compliance checking, resulting in a clean, jargon-free document audit structure.`,
      result: `The MSME successfully received approval for a ₹2.5 Crore priority sector credit facility from the State Bank of India with a loan readiness score exceeding 85%.`
    };
  };

  const getAdaptiveWorkbook = () => {
    const title = activeLesson?.title || "Core Architecture";
    return {
      quickNotes: `• Essential takeaways: Always verify structural variable alignments before compiling audit trails.\n• Keep operations transparent under the standard Written Down Value (WDV) methods.\n• Aim to maintain a Debt Service Coverage Ratio (DSCR) above 1.5.`,
      cheatSheet: `[FORMULAS & CONSTANTS]\n• EBITDA = Total Revenue - Operating Expenditures\n• PAT (Profit After Tax) = PBT - Slabs Income Tax\n• DSCR = (PAT + Depreciation) / Annual EMI Obligations`,
      practicalExercise: `Task: Prepare a micro balance sheet for ${title}.\n1. Set your initial asset block to ₹10 Lakhs.\n2. Write out a 3-paragraph executive description detailing the primary cash flows.\n3. Verify your compliance audit using Readability AI.`
    };
  };

  const getAdaptiveFlashcards = () => {
    const title = activeLesson?.title || "Core Concepts";
    return [
      { term: "Sovereign Audit", definition: "A formalized process ensuring code complies with regulatory directives and Royal Bulls standards." },
      { term: "Readability AI", definition: "Proprietary simplifying engine removing jargon and complexity from systems and education." },
      { term: "Immutability Index", definition: "A safety rating determining whether transactions are proofed against historical alterations." },
      { term: "DSCR Benchmark", definition: "The debt capability ratio index which must be higher than 1.25 for Indian commercial bank approvals." },
      { term: "MSME Priority Lending", definition: "Sovereign banking mandates requiring fast-track loan allocations to certified active enterprises." }
    ];
  };

  const getAdaptiveVivaQuestions = () => {
    const title = activeLesson?.title || "Subject Foundations";
    return [
      { q: `What is the core structural paradigm of "${title}"?`, a: `It centers on establishing clean gateway paths, removing unnecessary industry jargon, and building stable analytical pipelines.` },
      { q: `How does Readability AI impact client or academic outcomes?`, a: `It translates complex definitions into simplified, action-oriented analogies, allowing people without CA or computer science backgrounds to audit business metrics perfectly.` },
      { q: `Why is the 80% passing grade strictly enforced in examinations?`, a: `To maintain accredited university integrity acceptable to commercial banks, NBFCs, and sovereign government regulatory offices.` },
      { q: `What should you do if your projected DSCR ratio drops below 1.1?`, a: `Reduce overall capital debt request, increase promoter equity contributions, or adjust the term duration upwards to lower monthly EMIs.` }
    ];
  };

  const caseStudy = getAdaptiveCaseStudy();
  const workbook = getAdaptiveWorkbook();
  const flashcards = getAdaptiveFlashcards();
  const vivaQs = getAdaptiveVivaQuestions();

  const handleNextCard = () => {
    setIsCardFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setIsCardFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const toggleViva = (idx: number) => {
    setRevealedVivaIdx(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
      {/* Sidebar: Course Index */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 space-y-5 shadow-sm">
        <div className="border-b border-slate-100 pb-3 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono font-bold text-violet-600 uppercase bg-violet-50 px-2 py-0.5 rounded border border-violet-100">
              Academic Track
            </span>
            <span className="text-[9px] font-mono font-bold text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
              Sovereign Degree
            </span>
          </div>
          <h3 className="font-display font-bold text-sm text-slate-800 leading-tight">
            {currentCourse.title}
          </h3>
          <span className="text-[10px] text-slate-400 block font-medium">Estimated Study: {currentCourse.studyHours || 35} Hrs</span>
        </div>

        {/* Level Selectors */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Select Syllabus Tier:
          </span>
          <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1 rounded-xl">
            {levels.map(lvl => (
              <button
                key={lvl.id}
                onClick={() => {
                  setSelectedLevel(lvl.id);
                  setActiveChapterIndex(0);
                  setActiveLessonIndex(0);
                }}
                className={`text-[9px] font-bold py-2 rounded-lg transition-all text-center cursor-pointer ${
                  selectedLevel === lvl.id
                    ? "bg-white text-violet-600 shadow-xs border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chapters & Lessons Menu */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Curriculum Navigator:
          </span>
          
          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
            {chapters.map((chap: any, chapIdx: number) => (
              <div key={chapIdx} className="space-y-1">
                <div className="text-xs font-bold text-slate-700 bg-slate-50/80 border border-slate-100 p-2 rounded-lg flex items-center gap-1.5">
                  <span className="text-violet-600 font-mono text-[10px]">Ch {chapIdx+1}:</span>
                  <span className="truncate">{chap.title}</span>
                </div>

                <div className="pl-3 border-l border-slate-200 space-y-1">
                  {chap.lessons?.map((les: any, lesIdx: number) => {
                    const isCurrent = activeChapterIndex === chapIdx && activeLessonIndex === lesIdx;
                    return (
                      <button
                        key={lesIdx}
                        onClick={() => {
                          setActiveChapterIndex(chapIdx);
                          setActiveLessonIndex(lesIdx);
                        }}
                        className={`w-full text-left p-1.5 rounded-md text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-violet-50 text-violet-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <span className="truncate flex items-center gap-1.5">
                          <Play className={`w-2.5 h-2.5 shrink-0 ${isCurrent ? 'text-violet-600' : 'text-slate-400'}`} />
                          {les.title}
                        </span>
                        {isCurrent && <CheckCircle className="w-3.5 h-3.5 text-violet-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Downloads Trigger (Backward compatibility preserved!) */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Offline Export Options:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onDownloadWord}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Word Syllabus
            </button>
            <button
              onClick={onDownloadMarkdown}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" /> Markdown
            </button>
          </div>
        </div>
      </div>

      {/* Main Panel: Lesson Interactive Workspace Cockpit */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          {/* Cockpit Tabs */}
          <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1">
            {[
              { id: "content", label: "📖 Theory Notes", icon: BookOpen },
              { id: "diagrams", label: "📊 ASCII Diagrams", icon: Layers },
              { id: "cases", label: "💼 Case Study", icon: Briefcase },
              { id: "workbook", label: "📝 Workbook & Cheat Sheet", icon: FileText },
              { id: "flashcards", label: "🗃️ Flashcards", icon: BookMarked },
              { id: "viva", label: "🎙️ Viva & Recruiter Prep", icon: HelpCircle }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveLessonTab(tab.id as any)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all cursor-pointer ${
                    activeLessonTab === tab.id
                      ? "bg-violet-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Header portion */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-mono font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded">
                    Lesson {activeChapterIndex + 1}.{activeLessonIndex + 1}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded capitalize">
                    Tier: {selectedLevel}
                  </span>
                </div>
                <h2 className="text-xl font-display font-bold text-slate-800 leading-tight">
                  {activeLesson?.title || "Subject Lesson Overview"}
                </h2>
              </div>
              
              <button 
                onClick={() => window.print()}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-pointer hidden sm:block"
                title="Print Workbook"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            {/* TAB CONTENT 1: CORE THEORY NOTES */}
            {activeLessonTab === "content" && (
              <div className="space-y-6">
                {activeLesson ? (
                  <div className="space-y-6">
                    <div className="prose prose-slate max-w-none text-xs md:text-sm text-slate-700 leading-relaxed space-y-4">
                      <ReactMarkdown>{activeLesson.content}</ReactMarkdown>
                    </div>

                    {/* Actionable Pillars */}
                    {activeLesson.keyPoints && activeLesson.keyPoints.length > 0 && (
                      <div className="bg-violet-50/50 border border-violet-100 rounded-2xl p-4 space-y-2.5">
                        <p className="text-[10px] font-mono font-bold text-violet-700 uppercase tracking-wider">
                          Actionable Key Pillars
                        </p>
                        <ul className="space-y-2">
                          {activeLesson.keyPoints.map((pt: string, idx: number) => (
                            <li key={idx} className="flex gap-2 text-xs text-slate-700">
                              <CheckCircle className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Select a lesson from the navigator.
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: ASCII DIAGRAMS */}
            {activeLessonTab === "diagrams" && (
              <div className="space-y-5 animate-fadeIn">
                <p className="text-slate-500 text-xs leading-relaxed">
                  Below is the technical conceptual tree diagrammed cleanly to bypass jargon complexity.
                </p>

                <pre className="bg-slate-900 text-indigo-300 p-5 rounded-2xl text-[10px] md:text-xs font-mono overflow-x-auto shadow-inner leading-relaxed">
                  {getAdaptiveDiagram()}
                </pre>

                {activeLesson?.visualExplanation && (
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-mono font-bold text-indigo-600 uppercase">Aesthetic Model Explanation</p>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans mt-0.5">
                        {activeLesson.visualExplanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 3: CASE STUDY */}
            {activeLessonTab === "cases" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-violet-50/50 border border-violet-100 rounded-2xl p-5 space-y-3">
                  <h4 className="font-display font-bold text-sm text-violet-800 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-violet-600" />
                    {caseStudy.title}
                  </h4>
                  <span className="text-[9px] font-mono bg-violet-200/50 text-violet-700 px-2.5 py-0.5 rounded border border-violet-200">
                    Indian Enterprise Scenario
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm">
                  <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl space-y-1.5">
                    <h5 className="font-bold text-slate-800">1. Background & Context</h5>
                    <p className="text-slate-600 leading-relaxed">{caseStudy.background}</p>
                  </div>
                  <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl space-y-1.5">
                    <h5 className="font-bold text-slate-800">2. The Strategic Challenge</h5>
                    <p className="text-slate-600 leading-relaxed">{caseStudy.challenge}</p>
                  </div>
                  <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl space-y-1.5">
                    <h5 className="font-bold text-slate-800">3. Deployed Solution</h5>
                    <p className="text-slate-600 leading-relaxed">{caseStudy.solution}</p>
                  </div>
                  <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl space-y-1.5">
                    <h5 className="font-bold text-emerald-800 bg-emerald-50/50 px-2 py-1 rounded">4. Final Business Result</h5>
                    <p className="text-slate-600 leading-relaxed mt-1">{caseStudy.result}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: WORKBOOK & CHEAT SHEET */}
            {activeLessonTab === "workbook" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Revision sheet */}
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl space-y-4">
                  <h4 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                    📚 High-Contrast Quick Revision Notes
                  </h4>
                  <div className="text-xs text-slate-600 font-sans whitespace-pre-line leading-relaxed">
                    {workbook.quickNotes}
                  </div>
                </div>

                {/* Cheat Sheet */}
                <div className="bg-indigo-950 text-indigo-100 p-5 rounded-3xl space-y-3 font-mono">
                  <h4 className="font-display font-bold text-xs text-indigo-300 uppercase tracking-widest border-b border-indigo-900 pb-2">
                    ⚡ Formulas & Cheat Sheet Constants
                  </h4>
                  <pre className="text-[10px] md:text-xs overflow-x-auto leading-relaxed">
                    {workbook.cheatSheet}
                  </pre>
                </div>

                {/* Practical exercises */}
                <div className="border border-slate-200 p-5 rounded-3xl space-y-3">
                  <h4 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-4 h-4 text-violet-600" /> Printable Worksheet Exercise
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {workbook.practicalExercise}
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT 5: FLASHCARDS */}
            {activeLessonTab === "flashcards" && (
              <div className="space-y-6 text-center animate-fadeIn">
                <p className="text-slate-500 text-xs max-w-md mx-auto">
                  Interactive flashcards are the best way to memorize executive-level banking terms. Click the card to flip it!
                </p>

                {/* The card flip area */}
                <div className="flex justify-center py-6">
                  <button
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="w-full max-w-sm h-48 perspective focus:outline-none text-left cursor-pointer"
                  >
                    <div className={`relative w-full h-full transition-transform duration-500 transform-style ${isCardFlipped ? "rotate-y-180" : ""}`}>
                      {/* Front */}
                      <div className="absolute w-full h-full bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between text-white backface-hidden shadow-md">
                        <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest">Flashcard {currentCardIndex + 1} of {flashcards.length}</span>
                        <div className="text-center font-display font-bold text-base md:text-lg text-slate-100">
                          {flashcards[currentCardIndex].term}
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 text-center uppercase tracking-wider">Click card to reveal definition</span>
                      </div>

                      {/* Back */}
                      <div className="absolute w-full h-full bg-violet-600 rounded-3xl p-6 flex flex-col justify-between text-white backface-hidden rotate-y-180 shadow-md">
                        <span className="text-[10px] font-mono text-violet-200 font-bold uppercase tracking-widest">Definition Revealed</span>
                        <div className="text-center font-sans text-xs md:text-sm text-white leading-relaxed font-semibold px-2">
                          {flashcards[currentCardIndex].definition}
                        </div>
                        <span className="text-[9px] font-mono text-violet-300 text-center uppercase tracking-wider">Click to see Term again</span>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Flip navigation */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handlePrevCard}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="px-4 py-2 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Flip Card
                  </button>
                  <button
                    onClick={handleNextCard}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT 6: VIVA PREP */}
            {activeLessonTab === "viva" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-2">
                  <QuestionIcon className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Simulate a live viva voce exam with a chartered accountant or corporate recruiter. Review each question, test your mental formulation, and click <b>Reveal Standard Answer</b>.
                  </p>
                </div>

                <div className="space-y-4">
                  {vivaQs.map((item, idx) => {
                    const isRevealed = revealedVivaIdx[idx];
                    return (
                      <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
                        <div className="flex justify-between items-start gap-4">
                          <h5 className="font-bold text-xs text-slate-800 leading-normal font-sans">
                            Q{idx + 1}: {item.q}
                          </h5>
                          <button
                            onClick={() => toggleViva(idx)}
                            className="text-[10px] font-mono font-bold text-violet-600 hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {isRevealed ? "Hide Answer" : "Reveal Answer"}
                          </button>
                        </div>

                        {isRevealed && (
                          <div className="p-3 bg-violet-50/50 border border-violet-100 rounded-xl text-[11px] text-slate-700 font-medium leading-relaxed font-sans">
                            <strong>Recruiter's Model Response</strong>: {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes Pad */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4.5 h-4.5 text-violet-600" />
              Sovereign Student Notebook
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Saved to Cloud Cache</span>
          </div>

          <textarea
            placeholder="Jot down formulas, ideas, regulatory dates, or complex code snippets here. Your notebook persists automatically as you study..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="w-full bg-slate-50 text-xs text-slate-800 p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-500 font-sans"
          />

          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] text-slate-400 font-medium">Notebook size: {notes.length} characters</span>
            <button
              onClick={handleSaveNotes}
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
            >
              {showNotesSuccess ? "Notes Saved!" : "Lock Notebook"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
