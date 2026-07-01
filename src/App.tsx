import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import MrKilvishAvatar from "./components/MrKilvishAvatar";
import ModeSelector from "./components/ModeSelector";
import ExamplesHistoryPanel from "./components/ExamplesHistoryPanel";
import OutputDisplay from "./components/OutputDisplay";
import { InputHistoryItem, SimplificationMode } from "./types";
import { 
  Upload, 
  X, 
  Eraser, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  ArrowRight,
  RefreshCw,
  HelpCircle,
  TrendingUp,
  Search,
  Infinity
} from "lucide-react";

const TOPIC_SUGGESTIONS = [
  "Quantum Computing",
  "How Inflation Works",
  "What is Blockchain?",
  "CRISPR Gene Editing",
  "Artificial Neural Networks",
  "The Vagus Nerve"
];

export default function App() {
  // Input form states
  const [inputTab, setInputTab] = useState<"simplify" | "search">("simplify");
  const [searchTopic, setSearchTopic] = useState("");
  const [inputText, setInputText] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const [mode, setMode] = useState<SimplificationMode>("default");
  
  // File upload states
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<"text" | "image" | null>(null);
  const [imageData, setImageData] = useState<string | null>(null); // base64 payload
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  
  // App system states
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [kilvishStatus, setKilvishStatus] = useState<"idle" | "loading" | "speaking">("idle");
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Persisted clarity logs (history)
  const [history, setHistory] = useState<InputHistoryItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("readability_ai_history_v2");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local logs:", e);
    }
  }, []);

  // Save history to localStorage whenever it changes
  const saveHistory = (updatedHistory: InputHistoryItem[]) => {
    try {
      setHistory(updatedHistory);
      localStorage.setItem("readability_ai_history_v2", JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to persist logs:", e);
    }
  };

  // Handle text examples loaded from Preset panel
  const handleSelectExample = (text: string, title: string) => {
    setInputTab("simplify");
    setInputText(text);
    setInputTitle(title);
    setError(null);
    // Auto clear any uploaded files when a preset is chosen to prevent confusion
    handleClearFile();
  };

  // Handle loading an item from previous logs
  const handleSelectHistory = (item: InputHistoryItem) => {
    const isSearch = item.originalText.startsWith("Infinity Search on ");
    if (isSearch) {
      setInputTab("search");
      // Extract topic from "Infinity Search on \"{topic}\""
      const match = item.originalText.match(/Infinity Search on "([^"]+)"/);
      if (match && match[1]) {
        setSearchTopic(match[1]);
      } else {
        setSearchTopic("");
      }
      // Extract optional focus context from item.originalText after " with focus: "
      const focusIndex = item.originalText.indexOf(" with focus: ");
      if (focusIndex !== -1) {
        setInputText(item.originalText.substring(focusIndex + " with focus: ".length));
      } else {
        setInputText("");
      }
      setInputTitle("");
      handleClearFile();
    } else {
      setInputTab("simplify");
      setInputText(item.originalText);
      setInputTitle(item.title);
      if (item.imageAttached && item.imageData && item.imageMimeType) {
        setFileName("Previous_Attachment.png");
        setFileType("image");
        setImageData(item.imageData);
        setImageMimeType(item.imageMimeType);
      } else {
        handleClearFile();
      }
    }

    setMode(item.mode);
    setOutput(item.simplifiedText);
    setError(null);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your saved clarity logs?")) {
      saveHistory([]);
    }
  };

  // Parse attached files
  const processFile = (file: File) => {
    if (!file) return;

    setError(null);
    const type = file.type;

    if (type.startsWith("image/")) {
      // Image parsing for OCR + simplification via multimodal Gemini
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        // Split out the header data:image/png;base64, to get raw base64 data for Gemini SDK
        const commaIndex = base64Data.indexOf(",");
        if (commaIndex !== -1) {
          setImageData(base64Data.substring(commaIndex + 1));
          setImageMimeType(type);
          setFileName(file.name);
          setFileType("image");
          
          // Pre-fill a title if empty
          if (!inputTitle) {
            setInputTitle(`Image: ${file.name.replace(/\.[^/.]+$/, "")}`);
          }
        }
      };
      reader.onerror = () => {
        setError("Failed to read image file.");
      };
      reader.readAsDataURL(file);
    } else if (
      type.startsWith("text/") || 
      file.name.endsWith(".md") || 
      file.name.endsWith(".json") || 
      file.name.endsWith(".csv") ||
      file.name.endsWith(".js") ||
      file.name.endsWith(".ts")
    ) {
      // Read simple text-based files directly on client side
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
        setFileName(file.name);
        setFileType("text");
        setImageData(null);
        setImageMimeType(null);

        // Pre-fill a title if empty
        if (!inputTitle) {
          setInputTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
      };
      reader.onerror = () => {
        setError("Failed to read text file.");
      };
      reader.readAsText(file);
    } else {
      setError("Unsupported file format. Please upload text documents (.txt, .md, .csv) or image documents (.png, .jpg).");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setFileName("");
    setFileType(null);
    setImageData(null);
    setImageMimeType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag & drop file handling
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Wipe current form input completely
  const handleWipeForm = () => {
    if (inputTab === "search") {
      setSearchTopic("");
      setInputText("");
      setInputTitle("");
    } else {
      setInputText("");
      setInputTitle("");
      handleClearFile();
    }
    setError(null);
  };

  // Call Express API endpoint to simplify content or search a topic
  const handleSimplify = async (e: React.FormEvent) => {
    e.preventDefault();

    const isSearchMode = inputTab === "search";

    if (isSearchMode && !searchTopic.trim()) {
      setError("Please enter a topic to search and explain.");
      return;
    }

    if (!isSearchMode && !inputText.trim() && !imageData) {
      setError("Provide a complex document text or drag in an image first.");
      return;
    }

    setIsLoading(true);
    setKilvishStatus("loading");
    setError(null);
    setOutput("");

    try {
      const payload: any = {
        mode: mode,
      };

      if (isSearchMode) {
        payload.topic = searchTopic.trim();
        if (inputText.trim()) {
          payload.text = inputText.trim();
        }
      } else {
        if (inputText.trim()) {
          payload.text = inputText.trim();
        }
        if (imageData) {
          payload.image = {
            data: imageData,
            mimeType: imageMimeType
          };
        }
      }

      const response = await fetch("/api/simplify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to communicate with intelligence core.");
      }

      setOutput(data.result);
      setKilvishStatus("idle");

      // Save to logs
      const finalTitle = isSearchMode 
        ? `Search: ${searchTopic.trim()}`
        : (inputTitle.trim() || `Clarity Log ${new Date().toLocaleDateString()}`);

      const logItem: InputHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        title: finalTitle,
        originalText: isSearchMode 
          ? `Infinity Search on "${searchTopic.trim()}"` + (inputText.trim() ? ` with focus: ${inputText.trim()}` : "")
          : (inputText.trim() || `Image text extracted from: ${fileName}`),
        mode: mode,
        simplifiedText: data.result,
        timestamp: Date.now(),
        imageAttached: !isSearchMode && !!imageData,
        imageData: (!isSearchMode && imageData) ? imageData : undefined,
        imageMimeType: (!isSearchMode && imageMimeType) ? imageMimeType : undefined
      };

      saveHistory([logItem, ...history].slice(0, 50)); // Limit to 50 logs for local storage
      if (!isSearchMode) {
        setInputTitle(finalTitle); // Ensure input title field reflects what was saved
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred. Check connectivity and secrets.");
      setKilvishStatus("idle");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-slate-200 selection:text-slate-900">
      {/* Branding Header bar */}
      <Header />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Controls & Forms): Width 5 columns on desktop */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full">
          
          {/* Mr. Kilvish Persona Widget */}
          <MrKilvishAvatar status={kilvishStatus} />

          {/* Core Input Panel */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-display font-bold text-sm text-slate-800 tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-3 bg-slate-900 rounded-full" />
                Workspace Input
              </h2>
              <button
                type="button"
                onClick={handleWipeForm}
                className="text-[11px] font-mono font-semibold text-slate-500 hover:text-rose-600 transition-all duration-300 flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded border border-slate-200"
              >
                <Eraser className="w-3.5 h-3.5" />
                Clear Workspace
              </button>
            </div>

            {/* Error Indicator */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold font-mono">WORKSPACE ERROR:</span> {error}
                </div>
              </div>
            )}

            {/* Workspace Modes Tab Selector */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setInputTab("simplify");
                  setError(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                  inputTab === "simplify"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <FileText className="w-4.5 h-4.5" />
                Simplify Document
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputTab("search");
                  setError(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                  inputTab === "search"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Infinity className="w-4.5 h-4.5" />
                Infinity Search
              </button>
            </div>

            <form onSubmit={handleSimplify} className="flex flex-col gap-4">
              
              {inputTab === "search" ? (
                <>
                  {/* Topic Search Input */}
                  <div className="flex flex-col gap-1.5 animate-fadeIn">
                    <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                      <span>Enter Topic to Explain</span>
                      <span className="text-blue-600 font-mono text-[10px] uppercase font-bold">[Infinity Core]</span>
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g., Quantum Computing, Photosynthesis, Stock Options..."
                        value={searchTopic}
                        onChange={(e) => setSearchTopic(e.target.value)}
                        className="w-full bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white font-sans transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Suggested Topics Pills */}
                  <div className="flex flex-col gap-1.5 animate-fadeIn">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                      Suggested Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {TOPIC_SUGGESTIONS.map((topicStr) => (
                        <button
                          key={topicStr}
                          type="button"
                          onClick={() => {
                            setSearchTopic(topicStr);
                            setError(null);
                          }}
                          className="px-2.5 py-1 text-[11px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors border border-transparent hover:border-slate-300 cursor-pointer"
                        >
                          {topicStr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Extra Focus Questions */}
                  <div className="flex flex-col gap-1.5 animate-fadeIn">
                    <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                      <span>Focus Context / Questions (Optional)</span>
                      <span className="text-slate-400 font-sans font-normal">[Adds precision]</span>
                    </label>
                    <textarea
                      placeholder="e.g., Focus on its environmental impact, explain how it works step-by-step, or describe how it affects humans..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="bg-slate-50 text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white font-sans min-h-[100px] resize-y transition-all duration-300"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Optional Title Input */}
                  <div className="flex flex-col gap-1.5 animate-fadeIn">
                    <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                      <span>Workspace Label / Title</span>
                      <span className="text-slate-400 font-sans font-normal">[Optional name for logs]</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Medical Report Summary, NDA Page 2"
                      value={inputTitle}
                      onChange={(e) => setInputTitle(e.target.value)}
                      className="bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white font-sans transition-all duration-300"
                    />
                  </div>

                  {/* Text Input area */}
                  <div className="flex flex-col gap-1.5 animate-fadeIn">
                    <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                      <span>Complex Text Source</span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {inputText.length} chars
                      </span>
                    </label>
                    <textarea
                      placeholder="Type or paste academic research, medical results, complex legal clauses, or select a Preset Example below..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="bg-slate-50 text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white font-sans min-h-[140px] resize-y transition-all duration-300"
                    />
                  </div>

                  {/* Custom File Upload Component (Drag and Drop) */}
                  <div className="flex flex-col gap-1.5 animate-fadeIn">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Attach Document or Screenshot
                    </span>
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                        dragActive
                          ? "border-blue-500 bg-blue-50/50"
                          : fileName
                          ? "border-slate-300 bg-slate-50"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50/40"
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".txt,.md,.json,.csv,.js,.ts,image/*"
                        className="hidden"
                      />

                      {fileName ? (
                        <div className="flex items-center justify-between w-full gap-2 text-xs">
                          <div className="flex items-center gap-2 text-slate-700 truncate">
                            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="truncate font-mono font-semibold">{fileName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearFile();
                            }}
                            className="p-1 rounded bg-slate-100 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300"
                            title="Remove file"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-slate-400 mb-2" />
                          <p className="text-slate-700 text-[11px] font-medium">
                            Drag & Drop or <span className="text-blue-600 font-semibold hover:underline">Browse</span>
                          </p>
                          <p className="text-[9px] text-slate-400 mt-1 uppercase font-mono font-semibold">
                            TEXT (.TXT, .MD) OR IMAGE (.PNG, .JPG)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Mode Selection */}
              <ModeSelector activeMode={mode} onChange={setMode} />

              {/* Submit trigger button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative py-3 px-4 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-850 active:scale-[0.99] disabled:opacity-50 transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>SYNTHESIZING...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{inputTab === "search" ? "Search & Explain" : "Banish Jargon"}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Examples & History Log lists */}
          <ExamplesHistoryPanel
            history={history}
            onSelectExample={handleSelectExample}
            onSelectHistory={handleSelectHistory}
            onClearHistory={handleClearHistory}
          />
        </div>

        {/* Right Column (Output Display & Visualizer): Width 7 columns on desktop */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          
          {/* Main output terminal */}
          <OutputDisplay 
            text={output} 
            isLoading={isLoading} 
            onSpeechStateChange={(isSpeaking) => {
              setKilvishStatus(isSpeaking ? "speaking" : "idle");
            }}
          />

          {/* Knowledge Insight Card: Simple UI decoration showing the rules in motion */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-900" />
              <h3 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider">
                How Readability AI Banishes Dark Jargon
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
                <span className="font-mono text-[10px] text-blue-600 uppercase font-bold">
                  Rule 1: No Jargon
                </span>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  All complex terms are replaced or followed by instant translations inside parentheses.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
                <span className="font-mono text-[10px] text-indigo-600 uppercase font-bold">
                  Rule 2: Structured
                </span>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Content is compartmentalized using bold key points, bullet lists, and header layouts.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
                <span className="font-mono text-[10px] text-slate-900 uppercase font-bold">
                  Rule 3: Dual Output
                </span>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Always presented in two sections: &quot;The Core Concept&quot; and &quot;The Breakdown&quot;.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative clean footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs font-mono text-slate-400 bg-white mt-auto font-semibold">
        <p>&copy; {new Date().getFullYear()} READABILITY AI. ALL RIGHTS OF CLARITY PRESERVED.</p>
        <p className="text-[10px] mt-1 text-slate-400">POWERED BY GEMINI-3.5-FLASH &bull; CORE ENGINE: MR. KILVISH</p>
      </footer>
    </div>
  );
}
