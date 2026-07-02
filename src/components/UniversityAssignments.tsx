import React, { useState } from "react";
import { 
  FileText, 
  Send, 
  RefreshCw, 
  Award, 
  Info,
  CheckCircle,
  FileDown
} from "lucide-react";

interface UniversityAssignmentsProps {
  topic: string;
  studentAssignmentText: string;
  setStudentAssignmentText: (val: string) => void;
  isGradingAssignment: boolean;
  setIsGradingAssignment: (val: boolean) => void;
  assignmentGrade: { score: number; letter: string; feedback: string } | null;
  setAssignmentGrade: (val: any) => void;
  userXP: number;
  setUserXP: React.Dispatch<React.SetStateAction<number>>;
  onRefreshProfile: () => void;
}

export default function UniversityAssignments({
  topic,
  studentAssignmentText,
  setStudentAssignmentText,
  isGradingAssignment,
  setIsGradingAssignment,
  assignmentGrade,
  setAssignmentGrade,
  userXP,
  setUserXP,
  onRefreshProfile
}: UniversityAssignmentsProps) {
  const [assignmentAttachedName, setAssignmentAttachedName] = useState<string | null>(null);

  const handleGradeAssignment = () => {
    if (studentAssignmentText.trim().length < 10) return;

    setIsGradingAssignment(true);
    setAssignmentGrade(null);

    setTimeout(() => {
      setIsGradingAssignment(false);
      const text = studentAssignmentText.trim();
      const wordCount = text.split(/\s+/).length;
      
      let scoreVal = 50;
      let letter = "C";
      let feedback = "";

      const topicKeywords = [(topic || "Artificial Intelligence").toLowerCase(), "the", "system", "structure", "optimization", "model", "variable", "ledger", "api", "catalyst", "equilibrium"];
      let matchedKeywordsCount = 0;
      topicKeywords.forEach(kw => {
        if (text.toLowerCase().includes(kw)) {
          matchedKeywordsCount++;
        }
      });

      if (wordCount < 15) {
        scoreVal = 60;
        letter = "C+";
        feedback = `The response is a bit too brief. The Dean of Mr. Kilvish AI Academy expects at least a couple of paragraphs detailing the practical execution of ${topic || "Artificial Intelligence"}. Please resubmit with more elaborate descriptions.`;
      } else if (matchedKeywordsCount >= 3 && wordCount >= 35) {
        scoreVal = 95;
        letter = "A+";
        feedback = `Superb academic articulation! You have described the primary structural parameters of '${topic || "Artificial Intelligence"}' with exceptional clarity. Your argument is technically rich, structurally flawless, and displays honors-level cognitive understanding. Approved for university credits.`;
      } else if (wordCount >= 25) {
        scoreVal = 85;
        letter = "A";
        feedback = `Great work! Your text clearly demonstrates solid comprehension of the active chapter parameters. You address the practical task outline perfectly. Keep up the high standard of work!`;
      } else {
        scoreVal = 75;
        letter = "B";
        feedback = `Good overall effort. While your outline is conceptually valid, introducing deeper practical analogies and specific definitions from the curriculum would elevate your final honors grade. Please continue practicing.`;
      }

      setAssignmentGrade({ score: scoreVal, letter, feedback });
      setUserXP(prev => prev + 100); // Conferred XP
      onRefreshProfile();
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAssignmentAttachedName(file.name);
      // Mock populate some academic assignment text
      setStudentAssignmentText(`Draft submission for ${topic || "Artificial Intelligence"} Academic Assignment.\n\nConcerning the implementation and architectural parameters of the subject, we establish standard validation pipelines. The system operates on structured weights adaptation, optimizing dynamic nodes via gradient descent. This eliminates hardcoded conditional pathways in favor of soft probabilistic heuristics.`);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn">
      <div>
        <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText className="w-4.5 h-4.5 text-violet-600" />
          University Assignments & Practicums
        </h3>
        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
          Submit your conceptual essays or practical project write-ups based on <b>{topic || "Artificial Intelligence"}</b>. Our Readability AI assessment engine will immediately grade and offer extensive feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Write Your Submission Text
              </label>

              <label className="text-[10px] font-mono text-violet-600 font-bold hover:underline cursor-pointer">
                📂 Mock Upload File
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt,.pdf,.doc"
                  className="hidden"
                />
              </label>
            </div>

            {assignmentAttachedName && (
              <p className="text-[11px] font-mono text-slate-500">
                Attached Assignment Document: <b>{assignmentAttachedName}</b>
              </p>
            )}

            <textarea
              placeholder="e.g. In this project, we implement and audit the core parameters of the subject system. We configure dynamic REST endpoints that validate data structures..."
              value={studentAssignmentText}
              onChange={(e) => setStudentAssignmentText(e.target.value)}
              rows={10}
              className="w-full bg-slate-50 text-xs text-slate-800 p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-500 font-sans"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGradeAssignment}
              disabled={isGradingAssignment || studentAssignmentText.trim().length < 10}
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-3 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 shadow-sm"
            >
              {isGradingAssignment ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Reviewing Submission...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Assignment for Grading</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grades panel */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-100 p-5 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-200/50 pb-2">
              📜 Faculty Gradebook
            </h4>

            {assignmentGrade ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-violet-600 text-white rounded-2xl flex items-center justify-center font-display font-black text-2xl shadow-sm">
                    {assignmentGrade.letter}
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Consolidated Score</p>
                    <p className="text-lg font-black text-slate-800 font-display">{assignmentGrade.score} / 100</p>
                  </div>
                </div>

                <div className="p-4 bg-white border border-slate-100 rounded-2xl text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-wrap">
                  <strong>Examiner's Feedback</strong>: {assignmentGrade.feedback}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs font-medium space-y-2">
                <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center mx-auto text-slate-300">
                  <Award className="w-6 h-6" />
                </div>
                <p>No active grading records available. Submit your text to receive credentials feedback.</p>
              </div>
            )}
          </div>

          <div className="p-3.5 bg-violet-50/50 border border-violet-100/50 rounded-2xl flex gap-2.5">
            <Info className="w-4.5 h-4.5 text-violet-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Every graded A+ assignment awards <b>+100 XP</b> towards your total scholar standing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
