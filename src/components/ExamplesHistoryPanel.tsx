import React, { useState } from "react";
import { EXAMPLES_DATA } from "../examplesData";
import { InputHistoryItem, ExampleItem } from "../types";
import { BookOpen, History, FileText, Search, Trash2, ArrowUpRight, Clock } from "lucide-react";

interface ExamplesHistoryPanelProps {
  history: InputHistoryItem[];
  onSelectExample: (text: string, title: string) => void;
  onSelectHistory: (item: InputHistoryItem) => void;
  onClearHistory: () => void;
}

export default function ExamplesHistoryPanel({
  history,
  onSelectExample,
  onSelectHistory,
  onClearHistory,
}: ExamplesHistoryPanelProps) {
  const [activeTab, setActiveTab] = useState<"presets" | "history">("presets");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPresets = EXAMPLES_DATA.filter(
    (ex) =>
      ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = history.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.simplifiedText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full">
      {/* Tabs Selector */}
      <div className="flex border-b border-slate-150 pb-2.5 mb-3.5 items-center justify-between">
        <div className="flex gap-2">
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
            activeTab === "presets" ? "Search preset categories..." : "Search logs..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white font-sans transition-all"
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto max-h-[300px] pr-1 flex flex-col gap-2">
        {activeTab === "presets" ? (
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
