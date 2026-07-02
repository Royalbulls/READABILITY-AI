import React from "react";
import { 
  Download, 
  FileText, 
  BookMarked, 
  CheckCircle, 
  Award,
  Sparkles
} from "lucide-react";

interface UniversityDownloadsProps {
  currentCourse: any;
  showCertificate: boolean;
  onDownloadWord: () => void;
  onDownloadMarkdown: () => void;
  onNavigateTab: (tabId: string) => void;
}

export default function UniversityDownloads({
  currentCourse,
  showCertificate,
  onDownloadWord,
  onDownloadMarkdown,
  onNavigateTab
}: UniversityDownloadsProps) {
  const downloadItems = [
    { title: "Syllabus Curricula Pack (.doc)", desc: "Microsoft Word blueprint of entire academic modules, pre-requisites & objectives.", type: "word", active: !!currentCourse },
    { title: "Course Lessons Markdown (.md)", desc: "Formatted lessons files including simplified paradigms & actionable pillars.", type: "md", active: !!currentCourse },
    { title: "Accredited Student Certificate (.pdf)", desc: "Branded physical-ready credential certifying honors mastery on selected level.", type: "cert", active: showCertificate },
    { title: "Mock Practice Sheets Pack (.pdf)", desc: "Formulated practice questions and solutions keys compiled by AI Faculty.", type: "practice", active: !!currentCourse },
    { title: "Sovereign Audits Assignments Guide (.pdf)", desc: "Practical workbook for CA tax audits and corporate system architectures.", type: "assignment", active: !!currentCourse }
  ];

  const handleDownload = (type: string) => {
    if (type === "word") {
      onDownloadWord();
    } else if (type === "md") {
      onDownloadMarkdown();
    } else if (type === "cert") {
      onNavigateTab("certificates");
    } else {
      // Simulate downloadable pdf compilation
      const blob = new Blob([`Accredited Mr. Kilvish AI Academy Study Pack\nTopic: ${currentCourse?.topic || "Artificial Intelligence"}\nType: ${type.toUpperCase()}\nCompiled Date: ${new Date().toLocaleDateString()}`], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentCourse?.topic ? currentCourse.topic.replace(/\s+/g, '_') : 'Academy'}_${type}_Study_Material.pdf`;
      a.click();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn">
      <div>
        <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <BookMarked className="w-4.5 h-4.5 text-violet-600" />
          University Downloads & Learning Notes Hub
        </h3>
        <p className="text-slate-500 text-xs mt-1.5">
          Access high-fidelity study papers, exam blueprints, assignment checklists, and verified diplomas compiled securely for your local workspace and personal offline study.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {downloadItems.map((item, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
              item.active 
                ? "bg-slate-50 border-slate-200" 
                : "bg-stone-50 border-stone-100 opacity-60"
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold bg-white text-slate-500 border border-slate-200 px-2 py-0.5 rounded capitalize">
                  {item.type} Pack
                </span>
                {item.active && <CheckCircle className="w-4 h-4 text-emerald-600" />}
              </div>
              <h4 className="font-display font-bold text-xs text-slate-800">{item.title}</h4>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">{item.desc}</p>
            </div>

            <div className="flex justify-end pt-1">
              {item.active ? (
                <button
                  onClick={() => handleDownload(item.type)}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  Locked
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
