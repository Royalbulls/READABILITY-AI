import React from "react";
import { 
  Briefcase, 
  TrendingUp, 
  Award, 
  Building, 
  ArrowRight,
  Sparkles,
  BookMarked
} from "lucide-react";

interface UniversityCareerCenterProps {
  currentCourse: any;
  onNavigateTab: (tabId: string) => void;
  setTopic: (topic: string) => void;
}

export default function UniversityCareerCenter({
  currentCourse,
  onNavigateTab,
  setTopic
}: UniversityCareerCenterProps) {
  const jobs = [
    { title: "Lead AI Systems Architect", company: "Royal Bulls Advisory Private Limited", location: "Mumbai / Bengaluru (Hybrid)", package: "₹18 - ₹24 LPA", match: "95% match with your AI track" },
    { title: "GST Compliance & Tax Auditor", company: "Premium Advisory Partners", location: "New Delhi (Onsite)", package: "₹12 - ₹16 LPA", match: "85% match with GST module" },
    { title: "Sovereign Risk Analyst", company: "Ministry of Finance Partner Audits", location: "Kolkata (Remote)", package: "₹10 - ₹14 LPA", match: "90% match with Business module" }
  ];

  const businessOpp = [
    { title: "MSME Business Capital Subsidies", source: "KVIC / PMEGP Scheme", grantSize: "Up to 35% on Project outlay of ₹50 Lakhs", focus: "Manufacturing & Food Processing" },
    { title: "Startup Accelerator Seed Financing", source: "Royal Bulls Advisory Ventures", grantSize: "₹10 Lakhs Equity-Free Grant", focus: "Readability AI & Simplification tech" }
  ];

  const govtExams = [
    { title: "GST Inspector & Customs Appraiser Exam", board: "Staff Selection Commission (SSC CGL)", eligibility: "Graduate + Certification from Mr. Kilvish AI", examCycle: "October 2026 Cycle" },
    { title: "Assistant Director of MSME Audits", board: "Union Public Service Commission (UPSC)", eligibility: "CA/MBA + Accredited AI degree", examCycle: "November 2026 Cycle" }
  ];

  const professionalCerts = [
    { title: "Sovereign Compliance & Readability Specialist", issuer: "Readability AI of Royal Bulls", duration: "12 Hours", fee: "Sponsored / Complimentary" },
    { title: "MSME Corporate Auditor Honors", issuer: "National Board of Advisory", duration: "30 Hours", fee: "₹4,500 (Scholar discount active)" }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="font-display font-bold text-base text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
          <TrendingUp className="w-5 h-5 text-violet-600" />
          University Career Placement & Advisory Center
        </h3>
        <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-2xl">
          Based on your course performance, lessons completed, and verified certificate achievements, we align your talent with elite corporate careers, government exam tracks, and capital business grants in India.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs recommendation */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Briefcase className="w-4.5 h-4.5 text-violet-600" /> Recommended Corporate Careers
          </h4>

          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-violet-600">{job.match}</span>
                    <span className="text-xs font-mono font-black text-slate-800">{job.package}</span>
                  </div>
                  <h5 className="font-display font-bold text-xs text-slate-800">{job.title}</h5>
                  <p className="text-[10px] text-slate-400 font-medium">{job.company} • {job.location}</p>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={() => alert(`Applying with Mr. Kilvish AI University credentials...`)}
                    className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capital business opportunities */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Building className="w-4.5 h-4.5 text-violet-600" /> Business Funding & MSME Opportunities
          </h4>

          <div className="space-y-4">
            {businessOpp.map((opp, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold bg-violet-50 text-violet-700 px-2 py-0.5 rounded border border-violet-100">
                    {opp.source}
                  </span>
                </div>
                <h5 className="font-display font-bold text-xs text-slate-800">{opp.title}</h5>
                <p className="text-slate-500 text-[11px] leading-relaxed font-sans">{opp.grantSize}</p>
                <p className="text-[9px] text-slate-400">Target Segment: <b>{opp.focus}</b></p>
              </div>
            ))}
          </div>
        </div>

        {/* Government Exams Track */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Award className="w-4.5 h-4.5 text-violet-600" /> Public Sector & Government Exams
          </h4>

          <div className="space-y-4">
            {govtExams.map((exam, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{exam.board}</span>
                  <span className="text-[9px] font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded">{exam.examCycle}</span>
                </div>
                <h5 className="font-display font-bold text-xs text-slate-800">{exam.title}</h5>
                <p className="text-[10px] text-slate-500">Eligibility Criteria: {exam.eligibility}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Certifications */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Sparkles className="w-4.5 h-4.5 text-violet-600" /> Next Accredited Specializations
          </h4>

          <div className="space-y-4">
            {professionalCerts.map((cert, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h5 className="font-display font-bold text-xs text-slate-800">{cert.title}</h5>
                  <p className="text-[10px] text-slate-400 font-medium">Issued by: {cert.issuer} • Duration: {cert.duration}</p>
                </div>

                <button 
                  onClick={() => {
                    setTopic(cert.title);
                    onNavigateTab("explore");
                  }}
                  className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[10px] font-bold cursor-pointer whitespace-nowrap"
                >
                  Join Track
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
