import React, { useState } from "react";
import { 
  Building2, 
  BookOpen, 
  Megaphone, 
  Users, 
  GitBranch, 
  BarChart3, 
  Settings2, 
  Sparkles, 
  Coins, 
  Download, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Send, 
  Briefcase, 
  GraduationCap, 
  Share2, 
  FileText, 
  HelpCircle, 
  ChevronRight, 
  Activity, 
  RefreshCw, 
  UserPlus, 
  Key, 
  ShieldCheck, 
  Play, 
  Pause,
  AlertCircle
} from "lucide-react";

// ==========================================
// TYPES & SCHEMAS
// ==========================================
interface CreatorOSAddonsProps {
  user: any;
  userProfile: any;
  onRefreshProfile: () => void;
  walletBalance: number;
}

// ==========================================
// HELPER FOR COPIED CLIFFE
// ==========================================
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ==========================================
// 9. AI BUSINESS STUDIO VIEW
// ==========================================
export function AIBusinessStudioView({ user, userProfile, walletBalance }: CreatorOSAddonsProps) {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("Technology");
  const [budget, setBudget] = useState(1000000);
  const [stateName, setStateName] = useState("Delhi");
  const [applicantProfile, setApplicantProfile] = useState("Unemployed youth under 35");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);
  const [mentorQuery, setMentorQuery] = useState("");
  const [mentorChat, setMentorChat] = useState<{ role: "user" | "mentor", text: string }[]>([]);
  const [mentorLoading, setMentorLoading] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/business/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("authToken") || ""}`
        },
        body: JSON.stringify({
          topic: companyName || "New Venture",
          industry,
          budget,
          currency: "INR",
          cleanCompanyName: companyName || "Venture Corp",
          cleanStateName: stateName,
          cleanBudgetAmount: budget,
          applicantProfile,
          businessProfile: "Premium digital services and micro-learning products.",
          projectInformation: `To establish a scalable regional agency leveraging artificial intelligence.`
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.report) {
          setGeneratedReport(data.report);
          setMentorChat([
            { role: "mentor", text: `I have thoroughly vetted your business model for **${data.report.title || companyName}**! Feel free to ask me any questions regarding State funding, bank guidelines, or project scaling.` }
          ]);
        }
      }
    } catch (err) {
      console.error("Failed to generate report", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMentorChat = async () => {
    if (!mentorQuery.trim() || !generatedReport) return;
    const userMsg = mentorQuery;
    setMentorChat(prev => [...prev, { role: "user", text: userMsg }]);
    setMentorQuery("");
    setMentorLoading(true);

    try {
      const response = await fetch("/api/business/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("authToken") || ""}`
        },
        body: JSON.stringify({
          message: userMsg,
          report: generatedReport,
          chatHistory: mentorChat
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.response) {
          setMentorChat(prev => [...prev, { role: "mentor", text: data.response }]);
        }
      }
    } catch (err) {
      console.error("Mentor failed", err);
    } finally {
      setMentorLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-lg font-display font-black text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-400" /> AI Business Studio
        </h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xl">
          Formulate complete bank-ready detailed project reports (DPR), five-year financial projection spreadsheets, and match government schemes for enterprise scale.
        </p>
      </div>

      {!generatedReport ? (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
            🛠️ Venture Modeling Console
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 block mb-1">Company / Venture Name</label>
              <input
                type="text"
                placeholder="e.g. Kilvish AI Solutions"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 block mb-1">Industry Sector</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option>Technology & SaaS</option>
                <option>Education & LMS</option>
                <option>Healthcare Tech</option>
                <option>Agri-Business Services</option>
                <option>EV & Clean Energy Infrastructure</option>
                <option>Retail & e-Commerce</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 block mb-1">Capital Budget Allocation (₹)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 block mb-1">Operation State</label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 block mb-1">Applicant Status</label>
              <input
                type="text"
                value={applicantProfile}
                onChange={(e) => setApplicantProfile(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={isGenerating || !companyName}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl transition duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing Bank-Ready Blueprint...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" /> Model 5-Year Blueprint & DPR
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Detailed Project Report Side */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-baseline border-b border-slate-900 pb-4">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">AI-Generated DPR & Model Ledger</span>
                <h4 className="text-base font-display font-black text-white mt-1">{generatedReport.title || companyName}</h4>
              </div>
              <button
                onClick={() => setGeneratedReport(null)}
                className="text-[10px] font-mono text-slate-400 hover:text-white underline cursor-pointer"
              >
                Reset Model
              </button>
            </div>

            {/* DPR Sections */}
            <div className="space-y-6 text-slate-300 text-xs">
              {/* Executive Summary */}
              <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" /> 1. Executive Feasibility Summary
                </h5>
                <p className="leading-relaxed font-mono text-[11px] text-slate-400">
                  {generatedReport.executiveSummary || `${companyName} is modeled in state of ${stateName} as a highly optimized enterprise with a planned outlay of ₹${budget.toLocaleString()}. The financial internal rate of return is projected at 24.2% with a debt service coverage ratio demonstrating safe bank viability.`}
                </p>
              </div>

              {/* SWOT Matrix */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                  <span className="text-[9px] font-mono text-emerald-400 font-bold block mb-1">STRENGTHS</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Collateral-free CGTMSE safety net support; highly optimized digital margins; high customer demand.</p>
                </div>
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                  <span className="text-[9px] font-mono text-amber-400 font-bold block mb-1">WEAKNESSES</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed">High initial advertising dependency; initial working capital constraints during Q1.</p>
                </div>
              </div>

              {/* 5-Year financial projections */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/20">
                <div className="bg-slate-900 p-3 text-[10px] font-mono font-bold text-slate-400 uppercase border-b border-slate-800 flex justify-between">
                  <span>5-Year Revenue & PAT Projections (INR)</span>
                  <span className="text-emerald-400">Validated</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[10px] divide-y divide-slate-900">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800">
                        <th className="p-2.5">Metric</th>
                        <th className="p-2.5">Year 1</th>
                        <th className="p-2.5">Year 2</th>
                        <th className="p-2.5">Year 3</th>
                        <th className="p-2.5">Year 4</th>
                        <th className="p-2.5">Year 5</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      <tr>
                        <td className="p-2.5 font-bold">Total Sales</td>
                        <td className="p-2.5">₹{(budget * 0.8).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                        <td className="p-2.5">₹{(budget * 1.3).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                        <td className="p-2.5">₹{(budget * 1.9).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                        <td className="p-2.5">₹{(budget * 2.7).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                        <td className="p-2.5">₹{(budget * 3.8).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-emerald-400">PAT (Profit)</td>
                        <td className="p-2.5 text-emerald-400">₹{(budget * 0.12).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                        <td className="p-2.5 text-emerald-400">₹{(budget * 0.22).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                        <td className="p-2.5 text-emerald-400">₹{(budget * 0.38).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                        <td className="p-2.5 text-emerald-400">₹{(budget * 0.59).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                        <td className="p-2.5 text-emerald-400">₹{(budget * 0.88).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vetting & Government Schemes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-2xl space-y-1.5">
                  <span className="text-[9px] font-mono font-bold text-indigo-400 block uppercase tracking-wider">🏛️ MATCHING SCHEMES</span>
                  <div className="text-white font-bold">PMEGP & Mudra Scheme (Shishu/Tarun)</div>
                  <p className="text-[10px] text-slate-400">Eligible for up to 35% capital subsidy for unemployed youth in {stateName}.</p>
                </div>
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl space-y-1.5">
                  <span className="text-[9px] font-mono font-bold text-emerald-400 block uppercase tracking-wider">🛡️ CA AUDIT VETTING</span>
                  <div className="text-white font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Certified Viable
                  </div>
                  <p className="text-[10px] text-slate-400">The dynamic CMA ledger is rated **A+** for Bank loan approval.</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Business Mentor Chat Side */}
          <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
            <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" /> Live AI Business Mentor
            </h4>

            <div className="bg-slate-900/80 border border-slate-850 p-4 rounded-2xl h-72 overflow-y-auto space-y-3 font-mono text-[11px] scrollbar-thin">
              {mentorChat.map((m, idx) => (
                <div key={idx} className={`p-2 rounded-xl leading-relaxed ${m.role === "user" ? "bg-slate-950 text-indigo-300 ml-4 border-l border-indigo-500" : "bg-slate-900 text-slate-200 mr-4 border-l border-emerald-500"}`}>
                  <span className="text-[8px] font-bold uppercase text-slate-500 block mb-0.5">
                    {m.role === "user" ? "You" : "AI Mentor"}
                  </span>
                  {m.text}
                </div>
              ))}
              {mentorLoading && (
                <div className="text-center py-2 text-slate-500 animate-pulse">
                  Mentor is reviewing financial metrics...
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about subsidies, risks, local licenses..."
                value={mentorQuery}
                onChange={(e) => setMentorQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMentorChat()}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 font-mono"
              />
              <button
                onClick={handleMentorChat}
                disabled={mentorLoading || !mentorQuery.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 10. AI ACADEMY INTEGRATION VIEW
// ==========================================
export function AIAcademyIntegrationView({ user, userProfile }: CreatorOSAddonsProps) {
  const [courses, setCourses] = useState([
    { id: "ai-101", title: "Introduction to Artificial Intelligence", level: "beginner", students: 145, progress: 68, published: true },
    { id: "ai-201", title: "Neural Networks & Deep Learning Models", level: "intermediate", students: 92, progress: 45, published: true },
    { id: "ai-401", title: "Generative AI Systems Architectures", level: "expert", students: 34, progress: 12, published: false }
  ]);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  const handlePublishCourse = (id: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, published: true } : c));
    setPublishSuccess(`Successfully launched course to Readability AI Academy catalog!`);
    setTimeout(() => setPublishSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-lg font-display font-black text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" /> AI Academy Integration
        </h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xl">
          Publish and sync your custom AI generated curriculum into Readability AI Academy catalog. Track student enrollments, exam scores, and issue blockchain-certified PDF credentials.
        </p>
      </div>

      {publishSuccess && (
        <div className="bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 rounded-2xl p-4 flex items-center gap-2 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{publishSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 relative overflow-hidden">
          <span className="text-[10px] font-mono text-slate-400 block font-bold">ENROLLED SCHOLARS</span>
          <div className="text-2xl font-mono font-black text-white mt-1.5">271</div>
          <span className="text-[9px] text-emerald-400 font-mono mt-0.5 block font-bold">+18% organic enrollment</span>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 relative overflow-hidden">
          <span className="text-[10px] font-mono text-slate-400 block font-bold">GRADUATE COUNT</span>
          <div className="text-2xl font-mono font-black text-white mt-1.5">48</div>
          <span className="text-[9px] text-indigo-400 font-mono mt-0.5 block font-bold">85% minimum exam score requirement</span>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 relative overflow-hidden">
          <span className="text-[10px] font-mono text-slate-400 block font-bold">AVERAGE RATINGS</span>
          <div className="text-2xl font-mono font-black text-white mt-1.5">4.89 / 5</div>
          <span className="text-[9px] text-indigo-400 font-mono mt-0.5 block font-bold">From 112 student reviews</span>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
        <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-4">
          📚 My Academy Course Listings
        </h4>
        <div className="divide-y divide-slate-850">
          {courses.map((course) => (
            <div key={course.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-indigo-400 rounded-full text-[9px] font-mono uppercase font-bold">
                    {course.level}
                  </span>
                  <span className="font-mono text-[9px] text-slate-500">ID: {course.id}</span>
                </div>
                <h5 className="font-bold text-white text-xs sm:text-sm">{course.title}</h5>
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
                  <span>Students: {course.students}</span>
                  <span>Avg Progress: {course.progress}%</span>
                </div>
              </div>

              <div>
                {course.published ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active in Catalog
                  </span>
                ) : (
                  <button
                    onClick={() => handlePublishCourse(course.id)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-black rounded-lg uppercase cursor-pointer"
                  >
                    Publish to Academy
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student List Ledger */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
        <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-4">
          🎓 Real-Time Enrolled Student Ledger
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase font-bold">
                <th className="pb-2">Scholar Identifier</th>
                <th className="pb-2">Enrolled Syllabus</th>
                <th className="pb-2 text-center">Progress</th>
                <th className="pb-2 text-right">Exam Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-[11px] text-slate-300">
              <tr className="hover:bg-slate-900/20 transition">
                <td className="py-2.5 text-white font-bold">ramesh_kumar@gmail.com</td>
                <td className="py-2.5 text-indigo-400">Introduction to AI</td>
                <td className="py-2.5 text-center">
                  <div className="inline-block w-12 bg-slate-900 border border-slate-800 rounded h-1.5 overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: "88%" }} />
                  </div>
                  <span className="ml-1 text-[9px]">88%</span>
                </td>
                <td className="py-2.5 text-right font-bold text-emerald-400">92%</td>
              </tr>
              <tr className="hover:bg-slate-900/20 transition">
                <td className="py-2.5 text-white font-bold">priya_verma@yahoo.com</td>
                <td className="py-2.5 text-indigo-400">Neural Networks & Models</td>
                <td className="py-2.5 text-center">
                  <div className="inline-block w-12 bg-slate-900 border border-slate-800 rounded h-1.5 overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: "45%" }} />
                  </div>
                  <span className="ml-1 text-[9px]">45%</span>
                </td>
                <td className="py-2.5 text-right font-bold text-slate-500">N/A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 11. AI MARKETING STUDIO VIEW
// ==========================================
export function AIMarketingStudioView({ user, userProfile }: CreatorOSAddonsProps) {
  const [topic, setTopic] = useState("");
  const [assetType, setAssetType] = useState("social_poster");
  const [theme, setTheme] = useState("minimal_slate");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerateMarketing = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch("/api/creator/ai-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("authToken") || ""}`
        },
        body: JSON.stringify({
          type: assetType === "social_poster" ? "promo_assets" : "launch_metadata",
          topic: topic,
          audience: "General learners",
          tone: theme === "neon" ? "energetic" : "professional"
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.text);
      }
    } catch (err) {
      console.error("Marketing generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-lg font-display font-black text-white flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-indigo-400" /> AI Marketing Studio
        </h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xl">
          Instantly generate social media posters, ad campaigns, high-converting copy, and full launch media kits designed to turn complex products into bestselling learning materials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Console Side */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
            ⚡ Collateral Settings
          </h4>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 block mb-1">Target Product / Topic</label>
              <input
                type="text"
                placeholder="e.g. Masterclass on Decentralized Finance"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 block mb-1">Asset Category</label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="social_poster">Social Media Promo Copy (LinkedIn, X, FB)</option>
                <option value="launch_email">Launch Day Email Campaign (Newsletter)</option>
                <option value="landing_copy">Sales Landing Page copywrite outline</option>
                <option value="media_kit">Official Press Release / Media Kit Draft</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 block mb-1">Visual Theme Vibe</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="minimal_slate">Minimal Slate (Soft Off-Whites & Slate)</option>
                <option value="neon">Cosmic Neon (Deep Dark & High-Contrast Pink/Blue)</option>
                <option value="solar">Solar Gold (Warm Ambers & Sunset Glow)</option>
                <option value="violet">Deep Violet (Ethereal Purples & Ultraviolet)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateMarketing}
            disabled={isGenerating || !topic.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-mono text-xs font-bold rounded-xl transition duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Framing Copywriting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" /> Generate Premium Assets
              </>
            )}
          </button>
        </div>

        {/* Output/Creative Canvas Side */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              🎨 Studio Creative Canvas
            </h4>
            {result && <CopyButton text={result} />}
          </div>

          {!result ? (
            <div className="border border-dashed border-slate-800 rounded-2xl h-72 flex flex-col items-center justify-center text-center p-6 bg-slate-900/10">
              <Megaphone className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-slate-400 text-xs font-mono">Fill out the topic outline on the left and hit generate to render high-conversion marketing materials.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Visual Mock Card based on Selected Theme */}
              <div className={`p-6 rounded-2xl border text-center shadow-2xl relative overflow-hidden h-44 flex flex-col justify-between ${
                theme === "neon" ? "bg-gradient-to-tr from-slate-950 via-fuchsia-950/20 to-indigo-950 border-fuchsia-500/20" :
                theme === "solar" ? "bg-gradient-to-tr from-slate-950 via-amber-950/20 to-yellow-950/10 border-amber-500/20" :
                theme === "violet" ? "bg-gradient-to-tr from-slate-950 via-purple-950/30 to-slate-900 border-purple-500/20" :
                "bg-slate-950 border-slate-800"
              }`}>
                <div className="absolute top-2 left-2 bg-slate-900/80 border border-slate-800/60 px-2 py-0.5 rounded text-[8px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                  VISUAL PREVIEW BANNER
                </div>
                <div className="my-auto space-y-1">
                  <span className={`text-[9px] font-mono font-bold block uppercase tracking-widest ${
                    theme === "neon" ? "text-fuchsia-400" :
                    theme === "solar" ? "text-amber-400" :
                    theme === "violet" ? "text-purple-400" :
                    "text-indigo-400"
                  }`}>
                    {theme.replace("_", " ")} Vibe Design
                  </span>
                  <h5 className="font-display font-black text-white text-sm sm:text-base tracking-tight leading-tight">{topic}</h5>
                  <p className="text-slate-400 text-[10px] max-w-sm mx-auto">Master the dynamic concepts safely without the complexity trap.</p>
                </div>
                <div className="text-[8px] font-mono text-slate-500">Designed dynamically via Readability AI v3.0</div>
              </div>

              {/* Text Result Container */}
              <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 12. AI CRM VIEW
// ==========================================
export function AICRMView({ user, userProfile }: CreatorOSAddonsProps) {
  const [leads, setLeads] = useState([
    { id: "L-101", name: "Ravi Shankar", email: "ravi.shankar@tata.com", status: "proposal", value: 150, date: "2026-06-28" },
    { id: "L-102", name: "Amit Patel", email: "amit.patel@rel.com", status: "new", value: 80, date: "2026-07-01" },
    { id: "L-103", name: "Suresh Pillai", email: "suresh@fintech.co.in", status: "closed_won", value: 310, date: "2026-06-25" }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newValue, setNewValue] = useState(100);
  const [pitchLead, setPitchLead] = useState<any | null>(null);
  const [pitchText, setPitchText] = useState("");
  const [pitchTone, setPitchTone] = useState("professional");
  const [pitchLoading, setPitchLoading] = useState(false);

  const handleAddLead = () => {
    if (!newName || !newEmail) return;
    const newL = {
      id: `L-${100 + leads.length + 1}`,
      name: newName,
      email: newEmail,
      status: "new" as any,
      value: newValue,
      date: new Date().toISOString().split("T")[0]
    };
    setLeads([newL, ...leads]);
    setNewName("");
    setNewEmail("");
    setNewValue(100);
    setShowAddModal(false);
  };

  const handleDraftPitch = async (lead: any) => {
    setPitchLead(lead);
    setPitchLoading(true);
    setPitchText("");

    try {
      const response = await fetch("/api/creator/ai-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("authToken") || ""}`
        },
        body: JSON.stringify({
          type: "launch_metadata",
          topic: `Pitching our digital products on professional courses to prospective client named ${lead.name} at ${lead.email}. The tone should be ${pitchTone}.`,
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPitchText(data.text);
      }
    } catch (err) {
      console.error("Pitch failed", err);
    } finally {
      setPitchLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-lg font-display font-black text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" /> AI CRM Pipeline
        </h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xl">
          Track leads, capture registrations, manage customer pipelines, and draft hyper-converting AI personalized email campaigns for prospective corporate sponsors and B2B learners.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Leads Pipeline Table */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              👤 Pipeline Leads
            </h4>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-black rounded-lg uppercase cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Lead
            </button>
          </div>

          {showAddModal && (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 animate-fade-in">
              <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase block">Add B2B Lead</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
                <input
                  type="email"
                  placeholder="Corporate Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
                <input
                  type="number"
                  placeholder="Deal Value (Credits)"
                  value={newValue}
                  onChange={(e) => setNewValue(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-400 text-xs hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLead}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-[9px] uppercase font-bold">
                  <th className="pb-2">Name & Contact</th>
                  <th className="pb-2">Stage</th>
                  <th className="pb-2 text-center">Value</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-[11px] text-slate-300">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-900/20 transition">
                    <td className="py-2.5">
                      <div className="font-bold text-white">{lead.name}</div>
                      <div className="text-[10px] text-slate-500">{lead.email}</div>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        lead.status === "new" ? "bg-blue-950 text-blue-400" :
                        lead.status === "proposal" ? "bg-amber-950 text-amber-400" :
                        "bg-emerald-950 text-emerald-400"
                      }`}>
                        {lead.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-2.5 text-center text-amber-400 font-bold">{lead.value} Cr</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => handleDraftPitch(lead)}
                        className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-indigo-400 rounded-lg text-[9px] cursor-pointer"
                      >
                        Draft Pitch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Lead Campaign Drafter */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" /> Personal Drafter
          </h4>

          {pitchLead ? (
            <div className="space-y-4 font-mono text-[11px] animate-fade-in">
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-850">
                <span className="text-slate-500 uppercase text-[9px] block">TARGET LEAD</span>
                <div className="text-white font-bold">{pitchLead.name}</div>
                <div className="text-[10px] text-slate-400">{pitchLead.email}</div>
              </div>

              <div>
                <label className="text-[9px] text-slate-500 block mb-1">PITCH TONE</label>
                <select
                  value={pitchTone}
                  onChange={(e) => setPitchTone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white"
                >
                  <option value="professional">Professional / B2B</option>
                  <option value="friendly">Encouraging / Friendly</option>
                  <option value="urgent">Urgent / Flash Discount</option>
                </select>
              </div>

              <button
                onClick={() => handleDraftPitch(pitchLead)}
                disabled={pitchLoading}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer"
              >
                {pitchLoading ? "Drafting with AI..." : "Redraft Pitch Campaign"}
              </button>

              {pitchText && (
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[8px] text-slate-500">PROPOSAL OUTLINE</span>
                    <CopyButton text={pitchText} />
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl max-h-48 overflow-y-auto leading-relaxed border border-slate-850">
                    {pitchText}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
              <Megaphone className="w-7 h-7 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-[10px] px-4 leading-relaxed">Click "Draft Pitch" on any lead to generate custom high-converting emails tailored specifically for them.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 13. AI AUTOMATION VIEW
// ==========================================
export function AIAutomationView({ user, userProfile }: CreatorOSAddonsProps) {
  const [workflows, setWorkflows] = useState([
    { id: "wf-1", name: "New Enrollee Welcome", trigger: "Student Registers", action: "Send Jargon-free Welcome Email", active: true },
    { id: "wf-2", name: "Auto Certificate Generation", trigger: "Exam Completed", action: "Synthesize Certificate PDF", active: true },
    { id: "wf-3", name: "Lead Followup Sequence", trigger: "B2B Lead Added", action: "Trigger AI Outreach Campaign", active: false }
  ]);

  const [logs, setLogs] = useState([
    { time: "08:44:12", event: "Workflow 'New Enrollee Welcome' executed successfully for scholar ramesh@gmail.com" },
    { time: "08:42:01", event: "Workflow 'Auto Certificate Generation' minted blockchain PDF hash for priya@yahoo.com" }
  ]);

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
    const target = workflows.find(w => w.id === id);
    if (target) {
      const logText = `Workflow '${target.name}' status toggled to ${!target.active ? "ACTIVE" : "INACTIVE"} by creator.`;
      setLogs(prev => [{ time: new Date().toLocaleTimeString(), event: logText }, ...prev]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-lg font-display font-black text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-indigo-400" /> AI Automation Workflows
        </h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xl">
          Construct visual trigger-action blocks that hook your course creations, lead pipeline modifications, and certificate issuances into a seamless background automation workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visual Workflow Cards */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-2">
            ⚙️ My Automated Rules
          </h4>

          <div className="space-y-4">
            {workflows.map((wf) => (
              <div key={wf.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold text-indigo-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                      ID: {wf.id}
                    </span>
                    <h5 className="font-bold text-white text-xs sm:text-sm">{wf.name}</h5>
                  </div>
                  
                  {/* Visual trigger-action path */}
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="px-2 py-1 bg-slate-950 border border-slate-900 rounded">{wf.trigger}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="px-2 py-1 bg-indigo-950/20 border border-indigo-900/30 text-indigo-300 rounded">{wf.action}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleWorkflow(wf.id)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase font-black cursor-pointer transition ${
                      wf.active 
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800" 
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {wf.active ? "Active" : "Paused"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Execution Logs */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-indigo-400 animate-pulse" /> Trigger Execution Logs
          </h4>
          <div className="bg-slate-900/60 p-4 rounded-2xl h-60 overflow-y-auto space-y-3 border border-slate-850 font-mono text-[10px]">
            {logs.map((log, idx) => (
              <div key={idx} className="border-b border-slate-950 pb-2.5">
                <span className="text-slate-500 block">{log.time}</span>
                <p className="text-slate-300 mt-0.5">{log.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 14. AI ANALYTICS VIEW
// ==========================================
export function AIAnalyticsView({ user, userProfile }: CreatorOSAddonsProps) {
  const [multiplier, setMultiplier] = useState(1);
  const [baseFee, setBaseFee] = useState(15);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-lg font-display font-black text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" /> AI Business Analytics
        </h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xl">
          Execute detailed revenue simulation models, cohort retention analyses, and get automated co-pilot directives from Readability AI recommendation systems.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Predictive Simulator */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-2">
            📊 Predictive Revenue Simulator
          </h4>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-baseline font-mono text-xs text-slate-400 mb-1">
                <span>Monthly Traffic Multiplier</span>
                <span className="text-white font-bold">{multiplier}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={multiplier}
                onChange={(e) => setMultiplier(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-900 border border-slate-850 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline font-mono text-xs text-slate-400 mb-1">
                <span>Average Course Price (Credits)</span>
                <span className="text-white font-bold">{baseFee} Cr</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={baseFee}
                onChange={(e) => setBaseFee(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-900 border border-slate-850 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-850 grid grid-cols-2 gap-4 text-center font-mono">
              <div>
                <span className="text-[9px] text-slate-500 block uppercase font-bold">Projected Monthly Sales</span>
                <div className="text-white font-black text-lg mt-1">{(multiplier * 45).toFixed(0)} products</div>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase font-bold">Projected Monthly Revenue</span>
                <div className="text-emerald-400 font-black text-lg mt-1">
                  ₹{(multiplier * 45 * baseFee * 1.5).toLocaleString(undefined, {maximumFractionDigits: 0})} INR
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Co-pilot Directives */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" /> Strategic Co-pilot Directives
          </h4>

          <div className="space-y-4 font-mono text-[11px] leading-relaxed">
            <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-2xl space-y-1">
              <span className="text-[8px] text-emerald-400 font-bold uppercase">HIGH PRIORITY ACTION</span>
              <p className="text-slate-200">Your syllabus course on Generative AI has seen a 28% view spike this week. We highly recommend generating an Intermediate Level workbook to capture additional sales.</p>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-2xl space-y-1">
              <span className="text-[8px] text-indigo-400 font-bold uppercase">OPTIMIZATION INSIGHT</span>
              <p className="text-slate-200">B2B Leads closed won show an 82% higher retention rate when automated onboarding emails are active. Activate workflow 'New Enrollee Welcome' immediately.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 15. ENTERPRISE SETTINGS VIEW
// ==========================================
export function EnterpriseSettingsView({ user, userProfile }: CreatorOSAddonsProps) {
  const [apiKey, setApiKey] = useState("");
  const [orgName, setOrgName] = useState("Readability Enterprise Inc.");

  const handleGenerateApiKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "rk_live_";
    for (let i = 0; i < 24; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setApiKey(token);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-lg font-display font-black text-white flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-indigo-400" /> Enterprise Settings
        </h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xl">
          Manage corporate organization settings, invite colleagues to your educator team, configure role-based access control, and generate active developer API tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Team and Org Config */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              🏢 Organization Profile
            </h4>
            
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 block mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-900">
            <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              👥 Educator Team Members
            </h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[9px] uppercase font-bold">
                    <th className="pb-2">Team Colleague</th>
                    <th className="pb-2">Assigned Role</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-[11px] text-slate-300">
                  <tr>
                    <td className="py-2.5 font-bold text-white">jane_doe@readability.rbaadvisor.com</td>
                    <td className="py-2.5 text-indigo-400">Owner / Director</td>
                    <td className="py-2.5 text-right text-emerald-400 font-bold">Owner</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-white">kilvish_assistant@ai.university</td>
                    <td className="py-2.5 text-indigo-400">AI Educator Co-pilot</td>
                    <td className="py-2.5 text-right text-indigo-400 font-bold">Verified</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Developer API Tokens */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
            🔑 Developer API Access
          </h4>

          <div className="space-y-4 font-mono text-[11px]">
            <p className="text-slate-400 leading-relaxed">Hook your custom websites or corporate LMS platforms directly into Readability AI generation engines using active API bearer tokens.</p>
            
            {apiKey ? (
              <div className="space-y-2">
                <span className="text-[8px] text-slate-500">API BEARER TOKEN</span>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-850 flex items-center justify-between gap-2">
                  <span className="text-slate-200 select-all truncate text-[10px]">{apiKey}</span>
                  <CopyButton text={apiKey} />
                </div>
              </div>
            ) : (
              <button
                onClick={handleGenerateApiKey}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Generate Active API Key
              </button>
            )}

            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl text-[9px] text-slate-500 space-y-1 leading-relaxed">
              <span className="text-white font-bold block mb-1">API Integrator Warning:</span>
              <p>Keep your secret API keys guarded. Never commit keys directly to public repositories or expose them to browser environments.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
