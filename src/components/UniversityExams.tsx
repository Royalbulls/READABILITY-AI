import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Timer,
  Play,
  FileText,
  Bookmark,
  Check
} from "lucide-react";

interface UniversityExamsProps {
  currentCourse: any;
  selectedLevel: string;
  userXP: number;
  setUserXP: React.Dispatch<React.SetStateAction<number>>;
  setCertSerialNumber: (id: string) => void;
  setShowCertificate: (val: boolean) => void;
  setScore: (val: number) => void;
  setQuizSubmitted: (val: boolean) => void;
  onNavigateTab: (tabId: string) => void;
}

export default function UniversityExams({
  currentCourse,
  selectedLevel,
  userXP,
  setUserXP,
  setCertSerialNumber,
  setShowCertificate,
  setScore: setGlobalScore,
  setQuizSubmitted: setGlobalQuizSubmitted,
  onNavigateTab
}: UniversityExamsProps) {
  const [examType, setExamType] = useState<"practice" | "final">("practice");
  
  // Quiz states
  const [activeQuiz, setActiveQuiz] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [isExamActive, setIsExamActive] = useState(false);
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes standard
  const [timerInterval, setTimerInterval] = useState<any>(null);

  useEffect(() => {
    if (currentCourse) {
      const lvlData = currentCourse[selectedLevel] || currentCourse.beginner;
      if (lvlData && lvlData.quiz) {
        setActiveQuiz(lvlData.quiz);
      }
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [currentCourse, selectedLevel]);

  // Handle timer countdown
  useEffect(() => {
    if (isExamActive && timeLeft > 0 && !quizSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isExamActive && timeLeft === 0 && !quizSubmitted) {
      handleSubmitExam();
    }
  }, [isExamActive, timeLeft, quizSubmitted]);

  if (!currentCourse) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm animate-fadeIn">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="font-display font-bold text-base text-slate-800">
            Exam Center Inactive
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Please enroll in a course inside the catalog and navigate to the lessons workspace before starting certification exams.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab("explore")}
          className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
        >
          View Subject Catalog
        </button>
      </div>
    );
  }

  const startExam = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setScorePercent(0);
    setTimeLeft(negativeMarking ? 90 : 120); // harder if negative marking!
    setIsExamActive(true);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitExam = () => {
    if (quizSubmitted) return;
    setIsExamActive(false);

    let correctCount = 0;
    let wrongCount = 0;
    
    activeQuiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount++;
      } else if (selectedAnswers[idx] !== undefined) {
        wrongCount++;
      }
    });

    let scoreVal = correctCount;
    if (negativeMarking) {
      // Deduct 0.25 marks for incorrect answers
      scoreVal = Math.max(0, correctCount - (wrongCount * 0.25));
    }

    const calculatedPercent = Math.round((scoreVal / activeQuiz.length) * 100);
    setScorePercent(calculatedPercent);
    setQuizSubmitted(true);
    setGlobalScore(calculatedPercent);
    setGlobalQuizSubmitted(true);

    if (calculatedPercent >= 80) {
      // Grant credentials!
      setUserXP(prev => prev + 300);
      setShowCertificate(true);
      const randId = `REG-KLA-2026-${Math.random().toString(36).substring(3, 9).toUpperCase()}`;
      setCertSerialNumber(randId);
    }
  };

  const handleRetakeExam = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setScorePercent(0);
    setIsExamActive(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Exam Header Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
        <div className="flex gap-1">
          <button
            onClick={() => { setExamType("practice"); handleRetakeExam(); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              examType === "practice"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Practice Tests (Unlimited Retakes)
          </button>
          <button
            onClick={() => { setExamType("final"); handleRetakeExam(); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              examType === "final"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Final Certification Exam (Rigor Mode)
          </button>
        </div>

        <div className="flex items-center gap-3 px-3">
          <span className="text-xs font-semibold text-slate-500">Selected Subject Level:</span>
          <span className="text-xs font-mono font-bold bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-1 rounded-lg capitalize">
            {selectedLevel}
          </span>
        </div>
      </div>

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Exam Options Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 space-y-5 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2">
              <Timer className="w-4.5 h-4.5 text-violet-600" />
              Test Rigor settings
            </h3>
          </div>

          <div className="space-y-4">
            <p className="text-slate-500 text-xs leading-relaxed">
              {examType === "practice" 
                ? "Practice tests help solidify lessons before you attempt official credentials. Scoring rules are standard without time stress."
                : "Final exams are timed with negative marking options to simulate professional institution-grade audits. You need 80%+ to unlock official certificates."
              }
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80">
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Negative Marking</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Deduct 0.25 marks per error</p>
                </div>
                <input
                  type="checkbox"
                  checked={negativeMarking}
                  onChange={(e) => setNegativeMarking(e.target.checked)}
                  disabled={isExamActive}
                  className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 font-display">Minimum Passing Grade</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">For Accredited Credentials</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  80% Score
                </span>
              </div>
            </div>

            {!isExamActive && !quizSubmitted && (
              <button
                onClick={startExam}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Begin Timed {examType === "practice" ? "Practice" : "Final"} Exam</span>
              </button>
            )}

            {isExamActive && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-amber-800">Remaining Exam Time</h4>
                  <p className="text-sm font-mono font-black text-amber-700 mt-0.5">
                    {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Exam Questions Panel */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          {!isExamActive && !quizSubmitted ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="font-display font-bold text-base text-slate-800">
                  Ready to test your comprehension?
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  The examination covers key terminology, implementation syntax, and regulatory logic for <b>{currentCourse.title}</b>. Ensure you review the lesson notebook before launching!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Exam Metadata */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-800 font-display uppercase tracking-wider">
                    {examType === "practice" ? "Standard Practice Viva Test" : "Official Certification Paper"}
                  </h3>
                  <p className="text-[10px] text-slate-400">Section 1: Multi-Choice Direct Recall</p>
                </div>
                <div className="text-xs font-mono font-bold text-slate-500">
                  {Object.keys(selectedAnswers).length} of {activeQuiz.length} Completed
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {activeQuiz.map((q, qIdx) => (
                  <div key={qIdx} className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-4">
                    <div className="flex items-start gap-2.5">
                      <span className="text-xs font-mono font-bold bg-violet-100 text-violet-700 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        {qIdx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 leading-relaxed font-sans">
                        {q.question}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                      {q.options.map((opt: string, optIdx: number) => {
                        const isSelected = selectedAnswers[qIdx] === optIdx;
                        const isCorrect = q.answer === optIdx;
                        
                        let optStyle = "bg-white text-slate-600 border-slate-200 hover:bg-slate-50";
                        if (isSelected && !quizSubmitted) {
                          optStyle = "bg-violet-600 text-white border-violet-600";
                        } else if (quizSubmitted) {
                          if (isCorrect) {
                            optStyle = "bg-emerald-50 border-emerald-400 text-emerald-800";
                          } else if (isSelected) {
                            optStyle = "bg-rose-50 border-rose-400 text-rose-800";
                          } else {
                            optStyle = "bg-white text-slate-400 border-slate-100";
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(qIdx, optIdx)}
                            className={`p-3.5 rounded-xl border text-left text-[11px] font-semibold transition-all cursor-pointer ${optStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="pl-7 pt-2 text-[11px] text-slate-500 leading-relaxed font-sans border-t border-slate-100 mt-2 flex gap-1.5 items-start">
                        <AlertCircle className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Academic Explanation</strong>: {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Trigger */}
              {!quizSubmitted && (
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={handleSubmitExam}
                    disabled={Object.keys(selectedAnswers).length < activeQuiz.length}
                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 shadow-sm"
                  >
                    Lock and Submit Exam
                  </button>
                </div>
              )}

              {/* Results display */}
              {quizSubmitted && (
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                    <Trophy className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-display font-black text-lg text-slate-800">
                      Exam Performance Report
                    </h4>
                    <p className="text-xs text-slate-500">
                      Minimum Passing Score: <b>80%</b> | Negative marking applied: <b>{negativeMarking ? "Yes" : "No"}</b>
                    </p>
                  </div>

                  <div className="text-3xl font-mono font-black text-violet-700">
                    {scorePercent}%
                  </div>

                  {scorePercent >= 80 ? (
                    <div className="space-y-4">
                      <p className="text-xs font-semibold text-emerald-600 max-w-md mx-auto">
                        🎉 Congratulations, Scholar! You have exceeded the strict accreditation threshold. Your executive university-style digital certificate is now active inside your vault.
                      </p>
                      <button
                        onClick={() => onNavigateTab("certificates")}
                        className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
                      >
                        Claim Digital Certificate
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs font-semibold text-rose-600 max-w-sm mx-auto">
                        Unfortunately, you missed the passing benchmark this time. Standard Indian academy policy allows unlimited retakes on practice material. Review your notes and try again!
                      </p>
                      <button
                        onClick={handleRetakeExam}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
                      >
                        Retake Exam Option
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
