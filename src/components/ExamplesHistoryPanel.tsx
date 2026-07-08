import React, { useState } from "react";
import { EXAMPLES_DATA } from "../examplesData";
import { InputHistoryItem, ExampleItem } from "../types";
import { BookOpen, History, FileText, Search, Trash2, ArrowUpRight, Clock, GraduationCap, Globe, Book } from "lucide-react";

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

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full">
      {/* Tabs Selector */}
      <div className="flex flex-col sm:flex-row border-b border-slate-150 pb-2.5 mb-3.5 items-start sm:items-center justify-between gap-2.5">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab("academy");
              setSearchTerm("");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-300 ${
              activeTab === "academy"
                ? "bg-indigo-600 text-white border border-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Academy Library ({academyCourses.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("presets");
              setSearchTerm("");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-300 ${
              activeTab === "presets"
                ? "bg-slate-900 text-white border border-slate-950"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Presets ({EXAMPLES_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("history");
              setSearchTerm("");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-300 ${
              activeTab === "history"
                ? "bg-slate-900 text-white border border-slate-950"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Clarity Logs ({history.length})
          </button>
        </div>

        {activeTab === "history" && history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-500 hover:text-rose-600 transition-all duration-300 bg-slate-50 hover:bg-rose-50 px-2.5 py-1 rounded border border-slate-200"
            title="Wipe local workspace logs"
          >
            <Trash2 className="w-3 h-3" />
            Wipe Logs
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative mb-3.5">
        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          placeholder={
            activeTab === "presets" 
              ? "Search preset categories..." 
              : activeTab === "academy"
              ? "Search database course titles, topics or content..."
              : "Search logs..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white font-sans transition-all"
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto max-h-[300px] pr-1 flex flex-col gap-2">
        {activeTab === "academy" ? (
          filteredAcademy.length > 0 ? (
            filteredAcademy.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => onSelectAcademyCourse(course.id)}
                className="flex flex-col items-start text-left p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 h-1.5 w-1.5 bg-indigo-600 rounded-bl-full" />
                <div className="flex items-center justify-between w-full text-[10px] font-mono font-bold uppercase">
                  <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                    {getModeLabel(course.mode)}
                  </span>
                  <span className="text-[10px] text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-0.5 font-mono font-extrabold uppercase">
                    Study Course
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h5 className="font-display font-extrabold text-xs text-slate-900 mt-2 flex items-center gap-1.5 w-full">
                  <Book className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate flex-1">{course.title}</span>
                </h5>
                <p className="text-[10px] font-mono font-semibold text-slate-400 mt-1 uppercase">
                  Language: {course.language === "hi" ? "Hindi" : course.language === "hinglish" ? "Hinglish" : "English"}
                </p>
                <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-sans">
                  {course.text ? course.text.replace(/[#*`_-]/g, "").slice(0, 140) + "..." : "No description available."}
                </p>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs font-mono flex flex-col items-center gap-2">
              <GraduationCap className="w-6 h-6 text-slate-300" />
              <span>No Academy Courses found.</span>
              <span className="text-[10px] text-slate-500">Simplify some documents to automatically publish them here!</span>
            </div>
          )
        ) : activeTab === "presets" ? (
          filteredPresets.length > 0 ? (
            filteredPresets.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => onSelectExample(ex.text, ex.title)}
                className="flex flex-col items-start text-left p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono font-semibold uppercase bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded">
                    {ex.category}
                  </span>
                  <span className="text-[10px] text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-0.5 font-mono font-semibold">
                    Load
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                <h5 className="font-display font-bold text-xs text-slate-800 mt-2">
                  {ex.title}
                </h5>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {ex.description}
                </p>
              </button>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs font-mono">
              No matching categories.
            </div>
          )
        ) : filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectHistory(item)}
              className="flex flex-col items-start text-left p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between w-full text-[10px] font-mono font-semibold">
                <span className="text-slate-500 capitalize">
                  Mode: <span className="text-blue-600">{item.mode}</span>
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <h5 className="font-display font-bold text-xs text-slate-800 mt-2 flex items-center gap-1.5 w-full">
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate flex-1">{item.title}</span>
              </h5>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 w-full font-mono">
                {item.originalText}
              </p>
            </button>
          ))
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs font-mono flex flex-col items-center gap-2">
            <History className="w-6 h-6 text-slate-300" />
            <span>No previous logs found.</span>
            <span className="text-[10px] text-slate-500">Simplifying documents will populate logs!</span>
          </div>
        )}
      </div>
    </div>
  );
}
