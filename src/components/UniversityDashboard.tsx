import React from "react";
import { 
  Compass, 
  BookOpen, 
  Trophy, 
  Award, 
  Target, 
  Flame, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Calendar,
  BookMarked
} from "lucide-react";

interface UniversityDashboardProps {
  streak: number;
  userXP: number;
  courses: any[];
  onResumeCourse: (topic: string) => void;
  onNavigateTab: (tabId: string) => void;
  studentName: string;
}

export default function UniversityDashboard({
  streak,
  userXP,
  courses,
  onResumeCourse,
  onNavigateTab,
  studentName
}: UniversityDashboardProps) {
  const completedCoursesCount = courses.filter(c => c.progress === 100).length;
  const inProgressCourses = courses.filter(c => c.progress > 0 && c.progress < 100);

  const stats = [
    { label: "Learning Hours Spent", value: "32.5 Hrs", icon: Clock, color: "text-blue-600 bg-blue-50" },
    { label: "Completed Lessons", value: "18 Lessons", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
    { label: "Certificates Earned", value: `${completedCoursesCount || 1}`, icon: Award, color: "text-violet-600 bg-violet-50" },
    { label: "Total Points / XP", value: `${userXP} XP`, icon: Trophy, color: "text-amber-600 bg-amber-50" }
  ];

  const dailyMissions = [
    { id: 1, text: "Explore & enroll in a new custom AI course", done: true, xp: 50 },
    { id: 2, text: "Consult the AI Tutor on an academic topic", done: false, xp: 30 },
    { id: 3, text: "Achieve 80%+ on any Final Certification Exam", done: false, xp: 100 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-md border border-violet-500/15 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-violet-500/20 border border-violet-400/20 text-violet-200 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
              Student Workspace Active
            </span>
            <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/20 text-amber-200 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
              {streak} Day Streak
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight">
              Welcome back, Scholar {studentName || "Ramesh Sharma"}!
            </h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Continue your academic journey inside India's premier AI Adaptive University. Access professional modules curated under Readability AI simple semantic architectures.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onNavigateTab("explore")}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              Explore Courses <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab("ai-tutor")}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
            >
              Consult AI Tutor
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color} shrink-0`}>
                <IconComp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-lg font-display font-black text-slate-800 mt-0.5">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Daily goals & resume courses */}
        <div className="lg:col-span-8 space-y-6">
          {/* Mission Goals */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2">
                <Target className="w-4.5 h-4.5 text-violet-600" />
                University Daily Missions
              </h3>
              <span className="text-[10px] font-mono text-slate-400">July 2026 Academic Cycle</span>
            </div>

            <div className="space-y-3">
              {dailyMissions.map((goal, idx) => (
                <div key={goal.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/70">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      goal.done ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-white"
                    }`}>
                      {goal.done && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className={`text-xs font-semibold ${goal.done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                      {goal.text}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-lg">
                    +{goal.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Courses */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-violet-600" />
                Resume Your Active Syllabi
              </h3>
            </div>

            {inProgressCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgressCourses.map((c, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-violet-600 uppercase bg-violet-50 border border-violet-100 px-2 py-0.5 rounded">
                          {c.level || "Beginner"}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{c.progress}% done</span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-slate-800">{c.topic}</h4>
                    </div>

                    <div className="space-y-2">
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-violet-600 h-full rounded-full" style={{ width: `${c.progress}%` }} />
                      </div>
                      <button
                        onClick={() => onResumeCourse(c.topic)}
                        className="w-full text-center bg-white hover:bg-slate-100 text-slate-800 py-1.5 rounded-xl border border-slate-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        Resume Syllabus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-xs text-slate-500">No active custom courses in progress yet.</p>
                <button
                  onClick={() => onNavigateTab("explore")}
                  className="bg-violet-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-violet-700 cursor-pointer"
                >
                  Assemble Your First Course
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: University Information Accent & Honor Code */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-3xl p-5 space-y-4">
            <h4 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-indigo-200/50 pb-2">
              🏛️ Institutional Protocol
            </h4>
            
            <div className="space-y-3 text-xs leading-relaxed text-slate-600">
              <p>
                <strong>Mr. Kilvish AI Academy</strong>, in collaboration with <strong>Readability AI</strong> and <strong>Royal Bulls Advisory Private Limited</strong>, upholds rigorous academic standards.
              </p>
              <p>
                All certificates are digitally signed and contain official QR matrices directly linked to our state registries for immediate bank and investor lookup.
              </p>
            </div>

            <div className="pt-2 border-t border-indigo-100 flex items-center gap-2 text-[11px] font-mono font-bold text-indigo-700">
              <Award className="w-4 h-4" />
              Accredited Advisory Partner
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3">
            <h4 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider">
              🔒 Academic Honor Code
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Completing final certification exams requires authentic participation. Collaboration, plagiarism, or visualizer manipulation will freeze eligibility scores. Maintain integrity to unlock your bankable document portfolio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
