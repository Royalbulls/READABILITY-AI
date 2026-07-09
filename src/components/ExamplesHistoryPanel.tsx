import React, { useState } from "react";
import { EXAMPLES_DATA } from "../examplesData";
import { InputHistoryItem, ExampleItem } from "../types";
import { 
  BookOpen, 
  History, 
  FileText, 
  Search, 
  Trash2, 
  ArrowUpRight, 
  Clock, 
  GraduationCap, 
  Globe, 
  Book, 
  Star, 
  X, 
  ChevronRight, 
  Sparkles, 
  Flame,
  Layers,
  BookMarked
} from "lucide-react";

interface ExamplesHistoryPanelProps {
  history: InputHistoryItem[];
  onSelectExample: (text: string, title: string) => void;
  onSelectHistory: (item: InputHistoryItem) => void;
  onClearHistory: () => void;
  academyCourses: any[];
  onSelectAcademyCourse: (id: string) => void;
}

export default function ExamplesHistoryPanel({
  history,
  onSelectExample,
  onSelectHistory,
  onClearHistory,
  academyCourses,
  onSelectAcademyCourse,
}: ExamplesHistoryPanelProps) {
  const [activeTab, setActiveTab] = useState<"presets" | "academy" | "history">("academy");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPresets = EXAMPLES_DATA.filter(
    (ex) =>
      ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAcademy = academyCourses.filter(
    (course) =>
      (course.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.topic || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.text || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.mode || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = history.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.simplifiedText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getModeLabel = (m: string) => {
    switch (m) {
      case "eli5": return "Explain Like I'm 5";
      case "pro": return "Professional Executive Summary";
      case "student": return "Academic Concept breakdown";
      case "academy": return "MKA Master Course Module";
      case "ebook": return "Premium E-Book";
      case "storybook": return "Narrative Story Book";
      case "webseries": return "Web Series Script";
      case "film": return "Cinematic Film Script";
      case "animation": return "Animation Storyboard";
      case "game": return "Game & App Blueprint";
      case "news": return "Journalistic Editorial";
      case "business": return "Strategic Proposal";
      default: return "Clarity Refined";
    }
  };

  const getCategoryStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case "academy":
        return "bg-indigo-50 text-indigo-700 border-indigo-150";
      case "legal":
        return "bg-amber-50 text-amber-700 border-amber-150";
      case "medical":
        return "bg-rose-50 text-rose-700 border-rose-150";
      case "tech":
        return "bg-sky-50 text-sky-700 border-sky-150";
      case "academic":
        return "bg-emerald-50 text-emerald-700 border-emerald-150";
      default:
        return "bg-slate-50 text-slate-700 border-slate-150";
    }
  };

  const getLanguageTag = (lang: string) => {
    switch (lang) {
      case "hi": return { flag: "🇮🇳", label: "Hindi" };
      case "hinglish": return { flag: "🗣️", label: "Hinglish" };
      default: return { flag: "🇬🇧", label: "English" };
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-full transition-all duration-300">
      
      {/* Tab Selector & Control Bar */}
      <div className="flex flex-col gap-3 pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-indigo-600 rounded-full" />
            <h3 className="font-display font-extrabold text-[11px] text-slate-800 tracking-wider uppercase">
              Clarity Repository
            </h3>
          </div>
          {activeTab === "history" && history.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 hover:text-rose-600 transition-all duration-300 bg-slate-50 hover:bg-rose-50 px-2 py-0.5 rounded border border-slate-200 cursor-pointer"
              title="Wipe local workspace logs"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Logs</span>
            </button>
          )}
        </div>
        
        {/* Segmented control tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setActiveTab("academy");
              setSearchTerm("");
            }}
            className={`flex flex-col xs:flex-row items-center justify-center gap-1 xs:gap-1.5 py-1.5 rounded-md text-[10px] sm:text-xs font-mono font-bold uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "academy"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
            }`}
          >
            <GraduationCap className={`w-3.5 h-3.5 ${activeTab === "academy" ? "text-indigo-600 animate-pulse" : ""}`} />
            <span>Academy</span>
            <span className={`text-[9px] font-sans font-extrabold px-1.5 py-0.2 rounded-full ${
              activeTab === "academy" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-slate-200 text-slate-600"
            }`}>
              {academyCourses.length}
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setActiveTab("presets");
              setSearchTerm("");
            }}
            className={`flex flex-col xs:flex-row items-center justify-center gap-1 xs:gap-1.5 py-1.5 rounded-md text-[10px] sm:text-xs font-mono font-bold uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "presets"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${activeTab === "presets" ? "text-indigo-600" : ""}`} />
            <span>Presets</span>
            <span className={`text-[9px] font-sans font-extrabold px-1.5 py-0.2 rounded-full ${
              activeTab === "presets" ? "bg-slate-200 text-slate-800" : "bg-slate-200 text-slate-600"
            }`}>
              {EXAMPLES_DATA.length}
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setActiveTab("history");
              setSearchTerm("");
            }}
            className={`flex flex-col xs:flex-row items-center justify-center gap-1 xs:gap-1.5 py-1.5 rounded-md text-[10px] sm:text-xs font-mono font-bold uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "history"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
            }`}
          >
            <History className={`w-3.5 h-3.5 ${activeTab === "history" ? "text-blue-600" : ""}`} />
            <span>Logs</span>
            <span className={`text-[9px] font-sans font-extrabold px-1.5 py-0.2 rounded-full ${
              activeTab === "history" ? "bg-slate-200 text-slate-800" : "bg-slate-200 text-slate-600"
            }`}>
              {history.length}
            </span>
          </button>
        </div>
      </div>

      {/* Search Input and status feedback */}
      <div className="relative mb-3 group">
        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        <input
          type="text"
          placeholder={
            activeTab === "presets" 
              ? "Search categories or keywords..." 
              : activeTab === "academy"
              ? "Search course syllabus titles & content..."
              : "Search raw logs..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50/70 text-xs text-slate-800 placeholder:text-slate-400 pl-8.5 pr-8 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white font-sans transition-all duration-300"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-2.5 top-2 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {searchTerm && (
        <div className="text-[10px] font-mono text-slate-400 font-bold uppercase mb-2.5 flex items-center justify-between px-1 animate-fadeIn">
          <span>Results for &quot;{searchTerm}&quot;</span>
          <span className="text-indigo-600 font-extrabold bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded">
            {activeTab === "academy" && `${filteredAcademy.length} found`}
            {activeTab === "presets" && `${filteredPresets.length} found`}
            {activeTab === "history" && `${filteredHistory.length} found`}
          </span>
        </div>
      )}

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto max-h-[380px] pr-1 flex flex-col gap-2.5 scrollbar-thin scrollbar-thumb-slate-200">
        
        {/* ACADEMY LIBRARY VIEW */}
        {activeTab === "academy" && (
          filteredAcademy.length > 0 ? (
            filteredAcademy.map((course) => {
              const langSpec = getLanguageTag(course.language);
              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => onSelectAcademyCourse(course.id)}
                  className="flex text-left rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all duration-300 group overflow-hidden cursor-pointer relative active:scale-[0.99] border-l-4 border-l-indigo-600 shadow-sm"
                >
                  <div className="p-3 w-full flex flex-col justify-between">
                    <div>
                      {/* Top Meta info */}
                      <div className="flex items-center justify-between gap-2 text-[9px] font-mono font-bold uppercase mb-1.5">
                        <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 tracking-wide">
                          {getModeLabel(course.mode)}
                        </span>
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-1 font-semibold">
                          <span>{langSpec.flag}</span>
                          <span>{langSpec.label}</span>
                        </span>
                      </div>

                      {/* Course Title */}
                      <h5 className="font-display font-extrabold text-xs text-slate-900 mt-1 flex items-center gap-1.5 line-clamp-1">
                        <Book className="w-3.5 h-3.5 text-indigo-600 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                        <span className="truncate flex-1 font-semibold text-slate-800">{course.title}</span>
                      </h5>

                      {/* Dynamic Syllabus Preview text */}
                      <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-sans">
                        {course.text 
                          ? course.text.replace(/[#*`_-]/g, "").slice(0, 160).trim() + "..." 
                          : "No syllabus modules available."}
                      </p>
                    </div>

                    {/* Bottom action trigger */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2.5">
                      <span className="text-[9px] font-mono font-bold text-indigo-600 flex items-center gap-0.5 uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 animate-spin-slow text-indigo-500" />
                        Interactive Course
                      </span>
                      <span className="text-[10px] text-indigo-600 font-mono font-bold uppercase flex items-center gap-0.5 translate-x-1 group-hover:translate-x-0 transition-transform duration-300">
                        Study Now
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-600" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 text-xs font-mono flex flex-col items-center justify-center p-5 gap-2.5">
              <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-700">No Academy Modules found</span>
              <span className="text-[10px] text-slate-400 max-w-[220px] leading-relaxed">
                Publish simplified course materials to the local database to build your premium learning dashboard!
              </span>
            </div>
          )
        )}

        {/* PRESET EXAMPLES VIEW */}
        {activeTab === "presets" && (
          filteredPresets.length > 0 ? (
            filteredPresets.map((ex) => {
              const catStyle = getCategoryStyles(ex.category);
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => onSelectExample(ex.text, ex.title)}
                  className="flex flex-col text-left p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all duration-300 group cursor-pointer relative active:scale-[0.99] shadow-sm border-l-4 border-l-slate-400 hover:border-l-indigo-600"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[9px] font-mono font-bold uppercase border px-1.5 py-0.5 rounded tracking-wide ${catStyle}`}>
                      {ex.category}
                    </span>
                    <span className="text-[10px] text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-0.5 font-mono font-bold uppercase">
                      Load preset
                      <ArrowUpRight className="w-3 h-3 text-indigo-600" />
                    </span>
                  </div>
                  
                  <h5 className="font-sans font-extrabold text-xs text-slate-800 mt-2 tracking-tight">
                    {ex.title}
                  </h5>
                  
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {ex.description}
                  </p>
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs font-mono">
              No matching preset categories.
            </div>
          )
        )}

        {/* CLARITY RAW LOGS HISTORY VIEW */}
        {activeTab === "history" && (
          filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectHistory(item)}
                className="flex flex-col text-left p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all duration-300 group cursor-pointer relative active:scale-[0.99] shadow-sm border-l-4 border-l-emerald-500"
              >
                {/* Meta details */}
                <div className="flex items-center justify-between w-full text-[9px] font-mono font-bold uppercase mb-1.5">
                  <span className="text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                    Mode: <span className="text-indigo-600">{item.mode}</span>
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Log title */}
                <h5 className="font-sans font-extrabold text-xs text-slate-800 mt-0.5 flex items-center gap-1.5 w-full">
                  <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate flex-1 font-semibold text-slate-700">{item.title}</span>
                </h5>

                {/* Rating Display */}
                {item.rating && (
                  <div className="flex items-center gap-1 mt-1.5" title={`Rated ${item.rating}/5 stars`}>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`w-3 h-3 ${s <= (item.rating || 0) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase">
                      ({item.rating}/5 stars)
                    </span>
                  </div>
                )}

                {/* Original complex source extract */}
                <p className="text-[10px] text-slate-400 mt-2 line-clamp-1 w-full font-mono bg-slate-50 p-1.5 rounded border border-slate-100">
                  {item.originalText}
                </p>
              </button>
            ))
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 text-xs font-mono flex flex-col items-center justify-center p-5 gap-2.5">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                <History className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-700">No session logs found</span>
              <span className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
                Your simplified documents and research queries will appear here chronologically for easy recall.
              </span>
            </div>
          )
        )}

      </div>
    </div>
  );
}
