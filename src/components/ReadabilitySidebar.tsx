import React, { useState, useEffect } from "react";
import { 
  X, 
  TrendingUp, 
  Zap, 
  Brain, 
  BookOpen, 
  Activity, 
  CheckCircle,
  Sparkles,
  Flame,
  Layers,
  Wand2,
  Copy,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  Languages,
  Check,
  GraduationCap,
  Play,
  Share2,
  Code
} from "lucide-react";

interface ReadabilitySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  inputText: string;
  outputText: string;
}

interface CustomCard {
  id: string;
  term: string;
  definition: string;
}

export default function ReadabilitySidebar({ 
  isOpen, 
  onClose, 
  inputText, 
  outputText 
}: ReadabilitySidebarProps) {
  
  // Tab Navigation State
  const [activeSubTab, setActiveSubTab] = useState<"stats" | "deck" | "lab" | "actions">("stats");
  
  // Custom flashcard vocabulary list state
  const [customCards, setCustomCards] = useState<CustomCard[]>(() => {
    const saved = localStorage.getItem("kilvish_vocab_cards");
    return saved ? JSON.parse(saved) : [
      { id: "1", term: "Myocardial Infarction", definition: "Heart attack" },
      { id: "2", term: "Amortization", definition: "Paying off debt over time with regular payments" },
      { id: "3", term: "Obfuscation", definition: "Making something unclear, obscure, or unintelligible" }
    ];
  });

  const [newTerm, setNewTerm] = useState("");
  const [newDef, setNewDef] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Simulated TTS state inside sidebar
  const [speechRate, setSpeechRate] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechVoice, setSpeechVoice] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    localStorage.setItem("kilvish_vocab_cards", JSON.stringify(customCards));
  }, [customCards]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        const browserVoices = window.speechSynthesis.getVoices();
        setVoices(browserVoices);
        const auraVoice = browserVoices.find(v => v.name.toLowerCase().includes("aura"));
        if (auraVoice) {
          setSpeechVoice(auraVoice.name);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Text metrics calculator
  const getMetrics = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return { words: 0, chars: 0, readingTime: 0, grade: "N/A", density: 0, sentences: 0 };
    }
    const words = trimmed.split(/\s+/).filter(Boolean).length;
    const chars = trimmed.length;
    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
    const readingTime = Math.max(1, Math.ceil(words / 200)); // 200 words per minute average
    
    // Estimate complex words (words with length > 8 chars)
    const allWords = trimmed.split(/\s+/).filter(Boolean);
    const complexWordsCount = allWords.filter(w => w.length > 8).length;
    const density = Math.round((complexWordsCount / (allWords.length || 1)) * 100);
    
    // Readability grade estimation
    let grade = "A+ (Excellent)";
    if (density > 35) grade = "C (Complex)";
    else if (density > 25) grade = "B (Moderate)";
    else if (density > 15) grade = "A (Clean)";
    else grade = "A+ (Super Simple)";

    if (words > 150 && density > 40) grade = "D (Hard)";
    if (words > 250 && density > 48) grade = "F (Highly Cryptic)";

    return { words, chars, readingTime, grade, density, sentences };
  };

  const inputMetrics = getMetrics(inputText);
  const outputMetrics = getMetrics(outputText);

  // Parse jargon terms from output text that look like Term (Definition)
  const extractJargonPairs = (text: string): { term: string; definition: string }[] => {
    if (!text) return [];
    // Match terms followed by explanation in brackets e.g., "myocardial infarction (heart attack)"
    const regex = /([\w\s-]{4,30})\s*\(([^)]+)\)/gi;
    const pairs: { term: string; definition: string }[] = [];
    let match;
    const seen = new Set<string>();

    while ((match = regex.exec(text)) !== null) {
      const term = match[1].trim();
      const definition = match[2].trim();
      // Avoid matches that are just page numbers, dates or small notes
      if (term.length > 3 && definition.length > 2 && !/\d+/.test(term) && !seen.has(term.toLowerCase())) {
        seen.add(term.toLowerCase());
        pairs.push({ term, definition });
      }
    }
    return pairs;
  };

  const extractedPairs = extractJargonPairs(outputText);

  // Add custom vocab card
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm.trim() || !newDef.trim()) return;
    const card: CustomCard = {
      id: Date.now().toString(),
      term: newTerm.trim(),
      definition: newDef.trim()
    };
    setCustomCards([card, ...customCards]);
    setNewTerm("");
    setNewDef("");
  };

  // Remove vocab card
  const handleRemoveCard = (id: string) => {
    setCustomCards(customCards.filter(c => c.id !== id));
  };

  // Copy text to clipboard
  const handleCopyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Sidebar Speech Assistant
  const handleToggleSpeech = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = outputText || "Please enter some text in the main workspace to read out.";
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;
    
    if (speechVoice) {
      const selected = voices.find(v => v.name === speechVoice);
      if (selected) utterance.voice = selected;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Writing lab checklist
  const checkRules = [
    {
      id: "sentence-length",
      title: "Sentence Brevity Coach",
      desc: "Check if all sentences are under 20 words to reduce brain load.",
      isMet: inputText.trim().length > 0 && !inputText.split(/[.!?]+/).some(s => s.trim().split(/\s+/).length > 20),
      impact: "High"
    },
    {
      id: "jargon-density",
      title: "Jargon Density Guard",
      desc: "Keep heavy/complex words (>8 characters) below 18% density.",
      isMet: inputText.trim().length > 0 && inputMetrics.density <= 18,
      impact: "Medium"
    },
    {
      id: "logical-breaks",
      title: "Structural Formatting Checker",
      desc: "Requires at least 2 distinct paragraphs or custom bullet lists for clarity.",
      isMet: outputText.trim().length > 0 && (outputText.split("\n\n").length >= 2 || outputText.includes("-") || outputText.includes("###")),
      impact: "Medium"
    },
    {
      id: "plain-english",
      title: "Plain Conversation Tone",
      desc: "Active voice target. High score output verification success.",
      isMet: outputText.trim().length > 0 && !outputText.toLowerCase().includes("hereby") && !outputText.toLowerCase().includes("whereas"),
      impact: "High"
    }
  ];

  return (
    <>
      {/* Dimmed Overlay Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50 transition-opacity duration-300 animate-fadeIn"
          style={{ cursor: "pointer" }}
        />
      )}

      {/* Floating Side Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col transition-all duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4.5 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="w-7.5 h-7.5 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Brain className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-xs tracking-wider uppercase">
                CLARITY HUB V3.0
              </h2>
              <p className="text-[9px] font-mono font-bold text-indigo-300 uppercase tracking-widest leading-none mt-0.5">
                Multi-Functional Workspace
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer bg-slate-950"
            title="Close Drawer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tabbed Menu Navigation (Multiple Functions Capacity) */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1 gap-1">
          <button
            onClick={() => setActiveSubTab("stats")}
            className={`flex-1 py-2 text-center rounded-lg font-display font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeSubTab === "stats"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Stats</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab("deck")}
            className={`flex-1 py-2 text-center rounded-lg font-display font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeSubTab === "deck"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Deck</span>
            {(extractedPairs.length > 0 || customCards.length > 0) && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("lab")}
            className={`flex-1 py-2 text-center rounded-lg font-display font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeSubTab === "lab"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Lab</span>
          </button>

          <button
            onClick={() => setActiveSubTab("actions")}
            className={`flex-1 py-2 text-center rounded-lg font-display font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeSubTab === "actions"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Tools</span>
          </button>
        </div>

        {/* Scrollable Content Viewports */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-5 scrollbar-thin scrollbar-thumb-slate-200 bg-white">
          
          {/* TAB 1: REAL-TIME STATS */}
          {activeSubTab === "stats" && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex flex-col gap-1">
                <h3 className="font-display font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  📊 Cognitive Linguistics Analytics
                </h3>
                <p className="text-slate-500 text-[10px] leading-relaxed">
                  Real-time readability indices, lexical density metrics, and character comparisons.
                </p>
              </div>

              {/* Comparative Layout Grid */}
              <div className="flex flex-col gap-3">
                
                {/* Input Text Metrics Card */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 relative overflow-hidden flex flex-col gap-2">
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[8px] font-mono font-bold uppercase rounded">
                    INPUT METRICS
                  </div>
                  
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Jargon / Complex Density</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-display font-extrabold text-slate-900">{inputMetrics.density}%</span>
                    <span className="text-xs text-slate-500 font-mono">density score</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 border-t border-slate-200/50 pt-2.5 mt-1 text-[10px] text-slate-600">
                    <div>
                      <div className="font-mono text-slate-400">WORDS</div>
                      <div className="font-bold text-slate-800">{inputMetrics.words}</div>
                    </div>
                    <div>
                      <div className="font-mono text-slate-400">SENTENCES</div>
                      <div className="font-bold text-slate-800">{inputMetrics.sentences}</div>
                    </div>
                    <div>
                      <div className="font-mono text-slate-400">LEVEL</div>
                      <div className="font-bold text-slate-800 truncate">{inputMetrics.grade}</div>
                    </div>
                  </div>
                </div>

                {/* Output Text Metrics Card */}
                <div className="bg-blue-50/30 border border-indigo-100 rounded-xl p-3.5 relative overflow-hidden flex flex-col gap-2">
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[8px] font-mono font-bold uppercase rounded">
                    BANISHED OUTPUT
                  </div>
                  
                  <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-wider">Simplicity Rating</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-display font-extrabold text-indigo-700">
                      {inputText.trim() ? Math.max(100 - outputMetrics.density, 75) : 0}%
                    </span>
                    <span className="text-xs text-indigo-600 font-mono">clarity multiplier</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 border-t border-indigo-100/50 pt-2.5 mt-1 text-[10px] text-slate-600">
                    <div>
                      <div className="font-mono text-indigo-400">WORDS</div>
                      <div className="font-bold text-slate-800">{outputMetrics.words}</div>
                    </div>
                    <div>
                      <div className="font-mono text-indigo-400">READ TIME</div>
                      <div className="font-bold text-slate-800">{outputMetrics.readingTime} min</div>
                    </div>
                    <div>
                      <div className="font-mono text-indigo-400">TONE</div>
                      <div className="font-bold text-slate-800">Clear Standard</div>
                    </div>
                  </div>
                </div>

                {/* Comparison progress bar */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Jargon Reduction Impact</span>
                    <span className="font-bold text-emerald-600">
                      {inputText.trim() ? Math.max(0, inputMetrics.density - outputMetrics.density) : 0}% Simpler
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(10, Math.min(100, (inputMetrics.density - outputMetrics.density) * 2))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JARGON DECK & TERM EXTRACTOR */}
          {activeSubTab === "deck" && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex flex-col gap-1">
                <h3 className="font-display font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  🗂️ Jargon Vocabulary Decks
                </h3>
                <p className="text-slate-500 text-[10px] leading-relaxed">
                  We automatically extract complex parenthetical terms from your workspace outputs to build personalized studying cards!
                </p>
              </div>

              {/* Dynamic Extracted Words Section */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase tracking-widest flex items-center justify-between">
                  <span>Extracted Terms From Screen</span>
                  <span className="bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.2 rounded font-mono">
                    {extractedPairs.length} Detected
                  </span>
                </span>

                {extractedPairs.length === 0 ? (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center text-xs text-slate-400">
                    No parenthetical definitions (e.g. term (explanation)) found on screen yet. Type clinical or legal text to generate automatically.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                    {extractedPairs.map((pair, idx) => (
                      <div key={idx} className="bg-indigo-50/30 border border-indigo-100 rounded-xl p-2.5 flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-display font-bold text-[11px] text-indigo-950 uppercase tracking-wide truncate">
                            {pair.term}
                          </div>
                          <div className="text-slate-600 text-[10px] italic mt-0.5 leading-tight">
                            &quot;{pair.definition}&quot;
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (!customCards.some(c => c.term.toLowerCase() === pair.term.toLowerCase())) {
                              setCustomCards([{ id: Date.now().toString() + idx, term: pair.term, definition: pair.definition }, ...customCards]);
                            }
                          }}
                          className="p-1 rounded bg-white border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-600 transition-all text-[9px] font-mono font-bold cursor-pointer shrink-0 uppercase"
                          title="Save to study deck"
                        >
                          Save
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Flashcard Deck Section */}
              <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-4">
                <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase tracking-widest flex items-center justify-between">
                  <span>Saved Personal Vocabulary ({customCards.length})</span>
                  {customCards.length > 0 && (
                    <button 
                      onClick={() => setCustomCards([])}
                      className="text-[8px] text-rose-500 uppercase hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </span>

                {customCards.length === 0 ? (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center text-xs text-slate-400">
                    Your personal study deck is empty. Add a custom card below!
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                    {customCards.map((card, idx) => (
                      <div key={card.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-start justify-between gap-3 shadow-sm hover:border-slate-300 transition-all">
                        <div className="min-w-0 flex-1">
                          <div className="font-display font-bold text-[11px] text-slate-900 uppercase tracking-wide">
                            {card.term}
                          </div>
                          <div className="text-slate-500 text-[10px] leading-relaxed mt-0.5">
                            {card.definition}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleCopyToClipboard(`${card.term}: ${card.definition}`, idx)}
                            className="p-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                            title="Copy to clipboard"
                          >
                            {copiedIndex === idx ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            onClick={() => handleRemoveCard(card.id)}
                            className="p-1 rounded border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                            title="Delete card"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Custom Term Form */}
                <form onSubmit={handleAddCard} className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col gap-2 mt-1">
                  <span className="text-[8.5px] font-mono text-slate-500 font-bold uppercase">Add New Vocabulary Card</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newTerm}
                      onChange={(e) => setNewTerm(e.target.value)}
                      placeholder="e.g., Obfuscate"
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-[10.5px] font-sans focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={newDef}
                      onChange={(e) => setNewDef(e.target.value)}
                      placeholder="e.g., Confuse"
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-[10.5px] font-sans focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-display font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm mt-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create Vocab Card</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: WRITING LAB CHECKLIST */}
          {activeSubTab === "lab" && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex flex-col gap-1">
                <h3 className="font-display font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  ✍️ Writing Simplification Lab
                </h3>
                <p className="text-slate-500 text-[10px] leading-relaxed">
                  Real-time cognitive style checker ensuring your simplified output adheres strictly to standard human plain English guidelines.
                </p>
              </div>

              {/* Rules List */}
              <div className="flex flex-col gap-2.5">
                {checkRules.map((rule) => (
                  <div 
                    key={rule.id} 
                    className={`border rounded-xl p-3.5 flex items-start gap-3 transition-all duration-300 ${
                      rule.isMet 
                        ? "bg-emerald-50/20 border-emerald-100" 
                        : "bg-slate-50/50 border-slate-200"
                    }`}
                  >
                    <div className={`mt-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      rule.isMet 
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                        : "bg-slate-200 text-slate-400 border border-slate-300"
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <h4 className="font-display font-bold text-[11px] text-slate-900 leading-tight uppercase tracking-wide">
                          {rule.title}
                        </h4>
                        <span className={`text-[7.5px] font-mono font-extrabold px-1 py-0.2 rounded shrink-0 ${
                          rule.impact === "High" 
                            ? "bg-rose-50 text-rose-600 border border-rose-100" 
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}>
                          {rule.impact} IMPACT
                        </span>
                      </div>
                      <p className="text-slate-500 text-[10.5px] leading-relaxed mt-1">
                        {rule.desc}
                      </p>
                      
                      {/* Interactive guidance tag */}
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-slate-400" />
                        <span className="text-[8.5px] font-mono text-slate-400 uppercase">
                          {rule.isMet ? "Goal Achieved Successfully" : "Needs Optimization"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cognitive Score breakdown */}
              <div className="bg-slate-950 text-white rounded-xl p-3.5 flex flex-col gap-2 mt-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-indigo-950/40 via-transparent to-transparent opacity-80" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Workspace Health Index</span>
                  <span className="text-xs text-indigo-400 font-mono font-bold">V3.0 CORE</span>
                </div>
                <div className="relative z-10 flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-display font-extrabold text-white">
                    {inputText.trim() ? Math.round((checkRules.filter(r => r.isMet).length / checkRules.length) * 100) : 0}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Clarity Alignment</span>
                </div>
                <p className="relative z-10 text-[10px] text-slate-300 leading-relaxed mt-0.5">
                  Our algorithm processes word patterns, sentence complexities, and jargon definitions to safeguard standard reading levels.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: ACTION HUB & SPEECH CONTROL */}
          {activeSubTab === "actions" && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex flex-col gap-1">
                <h3 className="font-display font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  🔊 Acoustic Voice & workspace tools
                </h3>
                <p className="text-slate-500 text-[10px] leading-relaxed">
                  Synthesize summarized screen logs with localized speed, rate parameter adjustment, and offline audio outputs.
                </p>
              </div>

              {/* Text To Speech Control Widget */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col gap-3">
                <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase tracking-widest">Acoustic Audio Parameters</span>
                
                {/* Voice Selection */}
                {voices.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[9.5px] font-mono text-slate-500 uppercase">Synthesizer Voice</label>
                    <select
                      value={speechVoice}
                      onChange={(e) => setSpeechVoice(e.target.value)}
                      className="px-2 py-1.5 bg-white border border-slate-200 rounded text-[10.5px] font-mono text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="">Default OS Voice</option>
                      {voices.slice(0, 12).map((voice, idx) => (
                        <option key={`${voice.name}-${voice.lang}-${idx}`} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Speed rate adjustment slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-500 uppercase">
                    <span>Readout Speed Rate</span>
                    <span className="font-bold text-indigo-600">{speechRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-1"
                  />
                </div>

                {/* Core Speak Button */}
                <button
                  onClick={handleToggleSpeech}
                  className={`w-full py-2.5 rounded-lg font-display font-extrabold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isSpeaking 
                      ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md animate-pulse" 
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Stop Synthesized Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Synthesize Plain Summary</span>
                    </>
                  )}
                </button>
              </div>

              {/* Workspace Fast Action panel */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase tracking-widest">Core Workspace Tools</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCopyToClipboard(outputText || "Empty text", 999)}
                    className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-[10px] font-display font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {copiedIndex === 999 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Copy Output</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      const shareText = `Check out my simplified text:\n\n${outputText}`;
                      if (navigator.share) {
                        navigator.share({
                          title: "Banish Jargon Readout",
                          text: shareText
                        }).catch(() => {});
                      } else {
                        handleCopyToClipboard(shareText, 888);
                      }
                    }}
                    className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-[10px] font-display font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {copiedIndex === 888 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Link Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Share Output</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Developer Technical Specifications Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2 text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-1 text-slate-200 font-bold uppercase text-[9.5px]">
                  <Code className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Technical Specs</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Engine Module:</span>
                  <span className="text-slate-300">MrKilvishAI_V2.5</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>In-Iframe Browser:</span>
                  <span className="text-slate-300">Active Mode</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Pipeline:</span>
                  <span className="text-slate-300">Local Registers</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Status */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            Active Core Engine
          </span>
          <span className="font-bold text-slate-900 uppercase">MR. KILVISH AI</span>
        </div>
      </div>
    </>
  );
}
