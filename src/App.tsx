import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import MrKilvishAvatar from "./components/MrKilvishAvatar";
import ModeSelector from "./components/ModeSelector";
import ExamplesHistoryPanel from "./components/ExamplesHistoryPanel";
import OutputDisplay from "./components/OutputDisplay";
import HomeSection from "./components/HomeSection";
import AboutSection from "./components/AboutSection";
import CoursePage from "./components/CoursePage";
import ReadabilitySidebar from "./components/ReadabilitySidebar";
import { InputHistoryItem, SimplificationMode, OutputLanguage, WebSource } from "./types";
import { EXAMPLES_DATA } from "./examplesData";
import { 
  Upload, 
  X, 
  Eraser, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  TrendingUp,
  Search,
  Infinity,
  Newspaper,
  KeyRound,
  Settings,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Compass,
  FolderKanban
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
  // Navigation active tab: 'home' | 'workspace' | 'about'
  const [activeTab, setActiveTab] = useState<"home" | "workspace" | "about">("home");
  
  // Input form states
  const [inputTab, setInputTab] = useState<"simplify" | "search" | "news" | "blueprint">("blueprint");
  const [searchTopic, setSearchTopic] = useState("");
  const [inputText, setInputText] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const [mode, setMode] = useState<SimplificationMode>("blueprint");
  const [language, setLanguage] = useState<OutputLanguage>("hi");
  
  // File upload states
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<"text" | "image" | null>(null);
  const [imageData, setImageData] = useState<string | null>(null); // base64 payload
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  
  // App system states
  const [output, setOutput] = useState(EXAMPLES_DATA[0].text);
  const [isLoading, setIsLoading] = useState(false);
  const [kilvishStatus, setKilvishStatus] = useState<"idle" | "loading" | "speaking">("idle");
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Persisted clarity logs (history)
  const [history, setHistory] = useState<InputHistoryItem[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [currentSources, setCurrentSources] = useState<WebSource[]>([]);
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Router States
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const [courseRouteId, setCourseRouteId] = useState<string | null>(null);
  const [courseRouteData, setCourseRouteData] = useState<any | null>(null);
  const [isCourseLoading, setIsCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState<string | null>(null);
  
  // Shared Academy Library Course list
  const [academyCourses, setAcademyCourses] = useState<any[]>([]);

  const fetchAcademyCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setAcademyCourses(data || []);
      }
    } catch (e) {
      console.error("Failed to load Academy Library courses:", e);
    }
  };

  // Monitor location path to support sharing permanent URLs cleanly
  useEffect(() => {
    const checkRoute = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/course/") || pathname.startsWith("/read/")) {
        const id = pathname.startsWith("/course/")
          ? pathname.substring("/course/".length)
          : pathname.substring("/read/".length);
        if (id) {
          setCourseRouteId(id);
          fetchCourseData(id);
        }
      } else {
        // Fallback search param
        const params = new URLSearchParams(window.location.search);
        const qId = params.get("course") || params.get("id");
        if (qId) {
          setCourseRouteId(qId);
          fetchCourseData(qId);
        } else {
          setCourseRouteId(null);
          setCourseRouteData(null);
        }
      }
    };

    // Check once on mount
    checkRoute();
    
    // Also load the initial Academy Library courses list!
    fetchAcademyCourses();

    // Listen to popstate for clean back/forward history navigation!
    window.addEventListener("popstate", checkRoute);
    return () => window.removeEventListener("popstate", checkRoute);
  }, []);

  const fetchCourseData = async (id: string) => {
    setIsCourseLoading(true);
    setCourseError(null);
    try {
      const res = await fetch(`/api/course/${id}`);
      if (!res.ok) {
        throw new Error("This Courseware module does not exist or has been archived.");
      }
      const data = await res.json();
      setCourseRouteData(data);
    } catch (err: any) {
      console.error("Fetch Course Error:", err);
      setCourseError(err.message || "Failed to load the requested Courseware module.");
    } finally {
      setIsCourseLoading(false);
    }
  };

  const handleNavigateToCourse = (id: string) => {
    window.history.pushState({}, "", `/course/${id}`);
    setCourseRouteId(id);
    fetchCourseData(id);
  };

  const handleBackToWorkspace = () => {
    window.history.pushState({}, "", "/");
    setCourseRouteId(null);
    setCourseRouteData(null);
    setCourseError(null);
    // Refresh the list of courses in case some were added
    fetchAcademyCourses();
  };

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("readability_ai_history_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
        if (parsed.length > 0) {
          setCurrentLogId(parsed[0].id);
          setCurrentSources(parsed[0].sources || []);
        }
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

  const handleRate = (rating: number) => {
    if (!currentLogId) {
      const defaultLogId = "default-landing-log";
      const logItem: InputHistoryItem = {
        id: defaultLogId,
        title: "Preset Example: Readability Landing",
        originalText: "Readability AI system landing template overview.",
        mode: mode,
        language: language,
        simplifiedText: output,
        timestamp: Date.now(),
        rating: rating,
      };
      saveHistory([logItem, ...history].slice(0, 50));
      setCurrentLogId(defaultLogId);
      return;
    }

    const updatedHistory = history.map((item) => {
      if (item.id === currentLogId) {
        return { ...item, rating };
      }
      return item;
    });
    saveHistory(updatedHistory);
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
    setCurrentLogId(item.id);
    
    if (item.mode === "news") {
      setInputTab("news");
      // Search topic extraction if formatted as "Infinity Search on..."
      const match = item.originalText.match(/Infinity Search on "([^"]+)"/);
      if (match && match[1]) {
        setSearchTopic(match[1]);
      } else {
        setSearchTopic("");
      }
      const focusIndex = item.originalText.indexOf(" with focus: ");
      if (focusIndex !== -1) {
        setInputText(item.originalText.substring(focusIndex + " with focus: ".length));
      } else {
        setInputText(item.originalText.startsWith("Infinity Search on ") ? "" : item.originalText);
      }
      setInputTitle("");
      handleClearFile();
    } else {
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
    }

    setMode(item.mode);
    setLanguage(item.language || "en");
    setOutput(item.simplifiedText);
    setCurrentSources(item.sources || []);
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
  const handleSimplify = async (e?: React.FormEvent, customTopic?: string) => {
    if (e) e.preventDefault();

    const currentTopicValue = customTopic !== undefined ? customTopic : searchTopic;
    const isBlueprintMode = inputTab === "blueprint" || mode === "blueprint";
    const isNewsMode = inputTab === "news";
    const isSearchMode = inputTab === "search" || isNewsMode || isBlueprintMode || customTopic !== undefined;
    const finalMode = isBlueprintMode ? "blueprint" : isNewsMode ? "news" : mode;

    if (isBlueprintMode && !currentTopicValue.trim() && !inputText.trim()) {
      setError("Please enter a project name/topic (e.g. 'Kilvish AI Phone') or details to build the master blueprint.");
      return;
    }

    if (isSearchMode && !isNewsMode && !isBlueprintMode && !currentTopicValue.trim()) {
      setError("Please enter a topic to search and explain.");
      return;
    }

    if (isNewsMode && !currentTopicValue.trim() && !inputText.trim() && !imageData) {
      setError("Please enter a news headline, paste an article, or upload an image to verify.");
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
    setCurrentSources([]);

    try {
      const payload: any = {
        mode: finalMode,
        language: language,
        isPrivate: isPrivate,
      };

      if (isBlueprintMode) {
        payload.topic = currentTopicValue.trim() || "Kilvish AI Phone";
        payload.text = inputText.trim();
      } else if (isSearchMode) {
        if (currentTopicValue.trim()) {
          payload.topic = currentTopicValue.trim();
        }
        if (inputText.trim()) {
          payload.text = inputText.trim();
        }
        if (isNewsMode && imageData) {
          payload.image = {
            data: imageData,
            mimeType: imageMimeType
          };
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
      setCurrentCourseId(data.courseId || null);
      setCurrentSources(data.sources || []);
      setKilvishStatus("idle");

      // Fetch the updated Academy library courses immediately
      fetchAcademyCourses();

      // Save to logs
      const finalTitle = isBlueprintMode
        ? `Master Blueprint: ${currentTopicValue.trim() || "Kilvish AI Phone"}`
        : isNewsMode
          ? `News: ${currentTopicValue.trim() || "Fact Check"}`
          : isSearchMode 
            ? `Search: ${currentTopicValue.trim()}`
            : (inputTitle.trim() || `Clarity Log ${new Date().toLocaleDateString()}`);

      const logItem: InputHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        title: finalTitle,
        originalText: isBlueprintMode
          ? `35-Section Master Blueprint for "${currentTopicValue.trim() || "Kilvish AI Phone"}"` + (inputText.trim() ? ` (Specs: ${inputText.trim()})` : "")
          : isSearchMode 
            ? `Infinity Search on "${currentTopicValue.trim()}"` + (inputText.trim() ? ` with focus: ${inputText.trim()}` : "")
            : (inputText.trim() || `Image text extracted from: ${fileName}`),
        mode: finalMode,
        language: language,
        simplifiedText: data.result,
        timestamp: Date.now(),
        imageAttached: !!imageData,
        imageData: imageData ? imageData : undefined,
        imageMimeType: imageMimeType ? imageMimeType : undefined,
        sources: data.sources || []
      };

      saveHistory([logItem, ...history].slice(0, 50)); // Limit to 50 logs for local storage
      setCurrentLogId(logItem.id);
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

  if (courseRouteId) {
    if (isCourseLoading) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
          <h2 className="text-sm font-mono font-extrabold uppercase text-slate-800">Retrieving Sovereign Courseware...</h2>
          <p className="text-xs text-slate-400 font-medium">Connecting to Readability.rbaadvisor.com repository</p>
        </div>
      );
    }

    if (courseError || !courseRouteData) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-display font-extrabold text-slate-900 uppercase">Archive Error</h2>
            <p className="text-xs text-slate-500 font-semibold max-w-md">{courseError || "This Courseware module does not exist or has been archived."}</p>
          </div>
          <button
            onClick={handleBackToWorkspace}
            className="flex items-center gap-2 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold uppercase cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Workspace</span>
          </button>
        </div>
      );
    }

    return (
      <CoursePage
        id={courseRouteId}
        courseData={courseRouteData}
        onBackToWorkspace={handleBackToWorkspace}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-slate-200 selection:text-slate-900">
      {/* Branding Header bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Dynamic Navigation Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-5 md:p-6 lg:p-7">
        {activeTab === "home" ? (
          <HomeSection 
            onStartWorkspace={() => setActiveTab("workspace")}
            onExploreAbout={() => setActiveTab("about")}
            onSelectTopic={(topic) => {
              setSearchTopic(topic);
              setInputTab("search");
              setActiveTab("workspace");
              setError(null);
            }}
            onAskAnything={(text, prefix) => {
              const fullTopic = `${prefix}${text}`;
              setSearchTopic(fullTopic);
              setInputTab("search");
              setActiveTab("workspace");
              setError(null);
              handleSimplify(undefined, fullTopic);
            }}
          />
        ) : activeTab === "about" ? (
          <AboutSection onBackToWorkspace={() => setActiveTab("workspace")} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 lg:gap-6 items-start">
            {/* Left Column (Controls & Forms): Width 5 columns on desktop */}
            <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 h-full">
              
              {/* Mr. Kilvish Persona Widget */}
              <MrKilvishAvatar status={kilvishStatus} />

              {/* Core Input Panel */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-3.5 sm:p-4.5 md:p-5 flex flex-col gap-3.5 sm:gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="font-display font-bold text-xs text-slate-800 tracking-wider uppercase flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-slate-900 rounded-full" />
                    Workspace Input
                  </h2>
                  <button
                    type="button"
                    onClick={handleWipeForm}
                    className="text-[10px] font-mono font-semibold text-slate-500 hover:text-rose-600 transition-all duration-300 flex items-center gap-1 px-2 py-0.5 bg-slate-50 rounded border border-slate-200"
                  >
                    <Eraser className="w-3 h-3" />
                    Clear
                  </button>
                </div>

                {/* Error Indicator */}
                {error && (() => {
                  const isQuotaError = 
                    error.toLowerCase().includes("quota") || 
                    error.toLowerCase().includes("exhausted") || 
                    error.toLowerCase().includes("429") ||
                    error.toLowerCase().includes("limit") ||
                    error.toLowerCase().includes("busy");
                  
                  if (isQuotaError) {
                    return (
                      <div className="p-5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-col gap-3.5 text-xs text-slate-800 shadow-sm animate-fadeIn">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                            <KeyRound className="w-5 h-5 animate-bounce" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide font-mono flex items-center gap-1.5">
                              Gemini API Key Quota Exhausted
                              <span className="px-1.5 py-0.5 rounded bg-amber-200/60 text-amber-800 text-[9px] font-mono font-bold">429</span>
                            </h4>
                            <p className="text-[11.5px] text-slate-600 mt-1 leading-relaxed">
                              The shared environment API key has reached its free-tier rate limits or daily quota.
                            </p>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setError(null)} 
                            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="border-t border-amber-200/50 pt-3 space-y-2.5">
                          <p className="text-[11px] font-medium text-slate-700">
                            👉 <strong className="text-slate-900 font-bold">Resolve this instantly</strong> with unlimited high-speed requests by adding your own free Gemini API key:
                          </p>

                          <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-600 pl-1">
                            <li>
                              Click the <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-semibold text-[10px]"><Settings className="w-3 h-3 text-slate-600" /> Settings</span> gear icon in the AI Studio UI (bottom-left or settings menu).
                            </li>
                            <li>
                              Find the <strong className="text-slate-800 font-mono text-[10.5px]">Secrets / Env Variables</strong> section.
                            </li>
                            <li>
                              Add a new secret variable named:
                              <div className="mt-1.5 flex items-center gap-1.5">
                                <code className="px-2 py-1 bg-white border border-slate-200 rounded font-mono text-[10.5px] font-bold text-slate-800">
                                  GEMINI_API_KEY
                                </code>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText("GEMINI_API_KEY");
                                    setCopiedKey(true);
                                    setTimeout(() => setCopiedKey(false), 2000);
                                  }}
                                  className="p-1 bg-white hover:bg-slate-50 border border-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer inline-flex items-center justify-center"
                                  title="Copy variable name"
                                >
                                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </li>
                            <li>
                              Set the value to your Gemini API key (obtainable instantly for free from Google AI Studio).
                            </li>
                            <li>
                              Click <strong className="text-slate-800 font-bold">Save Changes</strong> and try again!
                            </li>
                          </ol>

                          <div className="flex gap-2.5 mt-2 pt-1 border-t border-amber-200/30">
                            <a 
                              href="https://aistudio.google.com" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-950 hover:underline"
                            >
                              Get a Free API Key <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="flex items-start gap-2 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-semibold font-mono">ERROR:</span> {error}
                      </div>
                    </div>
                  );
                })()}

                {/* Workspace Modes Tab Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-100 p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setInputTab("blueprint");
                      setMode("blueprint");
                      setError(null);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 text-[10.5px] font-mono font-bold uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                      inputTab === "blueprint"
                        ? "bg-amber-600 text-white shadow-md ring-1 ring-amber-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 shrink-0" />
                    <span>Master Blueprint</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputTab("simplify");
                      setError(null);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 text-[10.5px] font-mono font-bold uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                      inputTab === "simplify"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>Simplify Text</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputTab("search");
                      setError(null);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 text-[10.5px] font-mono font-bold uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                      inputTab === "search"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <Infinity className="w-3.5 h-3.5 shrink-0" />
                    <span>Infinity Search</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputTab("news");
                      setMode("news");
                      setError(null);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 text-[10.5px] font-mono font-bold uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                      inputTab === "news"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <Newspaper className="w-3.5 h-3.5 shrink-0" />
                    <span>News Finder</span>
                  </button>
                </div>

                <form onSubmit={handleSimplify} className="flex flex-col gap-4.5">
                  
                  {inputTab === "blueprint" ? (
                    <div className="flex flex-col gap-4.5 animate-fadeIn">
                      {/* Project Name / Topic Input */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono font-bold text-amber-900 uppercase tracking-widest flex items-center justify-between">
                          <span>Project Name or Hardware/Software Concept</span>
                          <span className="text-amber-800 font-mono text-[9px] uppercase font-bold">[35-Sec Master Blueprint Engine]</span>
                        </label>
                        <div className="relative">
                          <FolderKanban className="absolute left-3 top-2.5 w-3.5 h-3.5 text-amber-800" />
                          <input
                            type="text"
                            placeholder="e.g., AI Smart Wearable Pin, Autonomous Agri Drone, EV Microgrid SaaS..."
                            value={searchTopic}
                            onChange={(e) => setSearchTopic(e.target.value)}
                            className="w-full bg-amber-50/40 text-xs text-slate-900 placeholder:text-slate-400 pl-8.5 pr-3 py-2 rounded-lg border border-amber-200 focus:outline-none focus:border-amber-400 focus:bg-white font-sans transition-all duration-300 font-semibold"
                          />
                        </div>
                      </div>

                      {/* Project Specs / Requirements / Notes */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                          <span>Project Features, Assumptions & Target Specs</span>
                          <span className="text-slate-400 font-sans font-normal text-[9px]">[Optional custom context]</span>
                        </label>
                        <textarea
                          placeholder="Describe target user, key hardware components (SoC, sensors), software stack, target price point, or initial funding goal..."
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          className="w-full bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white min-h-[90px] max-h-[220px] font-sans transition-all duration-300 resize-y"
                        />
                      </div>

                      {/* Presets / Templates */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                          Popular Master Blueprint Presets:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {[
                            "AI Smart Wearable Pin",
                            "Autonomous Agri Drone Fleet",
                            "AI Medical Diagnostic Station",
                            "EV Fleet Microgrid & Battery SaaS",
                            "Decentralized AI Compute Grid"
                          ].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => {
                                setSearchTopic(preset);
                                setInputText(`Build an investor-ready and engineering-ready 35-section master blueprint for: ${preset}. Include full hardware SoC choices, software stack, BOM estimates, EVT/DVT/PVT milestones, 5-year financials, risk register, 10-year roadmap, and specific founder questions.`);
                                setError(null);
                              }}
                              className="px-2 py-1 text-[9.5px] font-mono bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-md transition-colors border border-amber-200 cursor-pointer font-medium"
                            >
                              + {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : inputTab === "news" ? (
                    <div className="flex flex-col gap-4.5 animate-fadeIn">
                      {/* Claim/Headline Search Input */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                          <span>Headline, Topic or Claim to Fact-Check</span>
                          <span className="text-emerald-600 font-mono text-[9px] uppercase font-bold">[Live Grounding Active]</span>
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g., Tesla solar-powered car announcement, or NASA Mars discoveries?"
                            value={searchTopic}
                            onChange={(e) => setSearchTopic(e.target.value)}
                            className="w-full bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 pl-8.5 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white font-sans transition-all duration-300"
                          />
                        </div>
                      </div>

                      {/* Paste Claim context or full article */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                          <span>Pasted News Context / Rumor Text (Optional)</span>
                          <span className="text-slate-400 font-sans font-normal text-[9px]">[Pasted claim]</span>
                        </label>
                        <textarea
                          placeholder="Paste a suspicious social media claim, rumor post, or entire article text here for deep investigative analysis..."
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          className="w-full bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white min-h-[100px] max-h-[220px] font-sans transition-all duration-300 resize-y"
                        />
                      </div>

                      {/* Quick Topics */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                          Trending Hot Claims to Fact-Check:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {[
                            "India Gaganyaan spaceflight",
                            "AI generates infinite clean fusion",
                            "Universal Basic Income trial",
                            "Room temp superconductivity claim"
                          ].map((topicStr) => (
                            <button
                              key={topicStr}
                              type="button"
                              onClick={() => {
                                setSearchTopic(topicStr);
                                setError(null);
                              }}
                              className="px-1.5 py-0.5 text-[9.5px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors border border-transparent border-slate-200 cursor-pointer"
                            >
                              {topicStr}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : inputTab === "search" ? (
                    <>
                      {/* Topic Search Input */}
                      <div className="flex flex-col gap-1 animate-fadeIn">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                          <span>Enter Topic to Explain or Research</span>
                          <span className="text-blue-600 font-mono text-[9px] uppercase font-bold">[Infinity Core]</span>
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g., Kilvish AI Phone, Quantum Computing, Microgrid SaaS..."
                            value={searchTopic}
                            onChange={(e) => setSearchTopic(e.target.value)}
                            className="w-full bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 pl-8.5 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white font-sans transition-all duration-300 font-medium"
                          />
                        </div>
                      </div>

                      {/* Blueprint Shortcut Banner inside Infinity Search */}
                      <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-2.5 flex items-center justify-between gap-2 animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-amber-700 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold text-amber-950 uppercase tracking-wide">
                              35-Section Master Blueprint Mode
                            </span>
                            <span className="text-[9.5px] text-amber-800 font-sans">
                              Turn this search topic into an investor & engineering company blueprint.
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setMode("blueprint");
                            setInputTab("blueprint");
                            setError(null);
                          }}
                          className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-all shadow-sm cursor-pointer shrink-0"
                        >
                          Use Blueprint Mode
                        </button>
                      </div>

                      {/* Suggested Topics Pills */}
                      <div className="flex flex-col gap-1 animate-fadeIn">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                          Suggested Topics:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {TOPIC_SUGGESTIONS.map((topicStr) => (
                            <button
                              key={topicStr}
                              type="button"
                              onClick={() => {
                                setSearchTopic(topicStr);
                                setError(null);
                              }}
                              className="px-1.5 py-0.5 text-[9.5px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors border border-transparent hover:border-slate-300 cursor-pointer"
                            >
                              {topicStr}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Optional Extra Focus Questions */}
                      <div className="flex flex-col gap-1 animate-fadeIn">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                          <span>Focus Context (Optional)</span>
                          <span className="text-slate-400 font-sans font-normal text-[9px]">[Adds precision]</span>
                        </label>
                        <textarea
                          placeholder="e.g., Focus on environmental impact, or explain how it works step-by-step..."
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          className="bg-slate-50 text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white font-sans min-h-[70px] resize-y transition-all duration-300"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Optional Title Input */}
                      <div className="flex flex-col gap-1 animate-fadeIn">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                          <span>Workspace Label / Title</span>
                          <span className="text-slate-400 font-sans font-normal text-[9px]">[Optional]</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Medical Report Summary, NDA Page 2"
                          value={inputTitle}
                          onChange={(e) => setInputTitle(e.target.value)}
                          className="bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white font-sans transition-all duration-300"
                        />
                      </div>

                      {/* Text Input area */}
                      <div className="flex flex-col gap-1 animate-fadeIn">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                          <span>Complex Text Source</span>
                          <span className="text-slate-400 font-mono text-[9px]">
                            {inputText.length} chars
                          </span>
                        </label>
                        <textarea
                          placeholder="Type or paste academic research, medical results, complex legal clauses, or select a Preset Example below..."
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          className="bg-slate-50 text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white font-sans min-h-[100px] resize-y transition-all duration-300"
                        />
                      </div>

                      {/* Custom File Upload Component (Drag and Drop) */}
                      <div className="flex flex-col gap-1 animate-fadeIn">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                          Attach Document or Screenshot
                        </span>
                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border border-dashed rounded-lg p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
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
                            <div className="flex items-center justify-between w-full gap-2 text-[11px]">
                              <div className="flex items-center gap-1.5 text-slate-700 truncate">
                                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span className="truncate font-mono font-semibold">{fileName}</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClearFile();
                                }}
                                className="p-0.5 rounded bg-slate-100 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300"
                                title="Remove file"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-slate-400 mb-1" />
                              <p className="text-slate-700 text-[10px] font-medium">
                                Drag & Drop or <span className="text-blue-600 font-semibold hover:underline">Browse</span>
                              </p>
                              <p className="text-[8.5px] text-slate-400 mt-0.5 uppercase font-mono font-semibold">
                                TEXT OR IMAGE
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Mode Selection */}
                  {inputTab === "news" ? (
                    <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center gap-3 animate-fadeIn">
                      <div className="p-1 rounded bg-emerald-100 text-emerald-600 shrink-0">
                        <Newspaper className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">Locked: News & Journalism</div>
                        <div className="text-[9.5px] text-slate-500">Real-time web search grounding enabled for factual investigation.</div>
                      </div>
                    </div>
                  ) : (
                    <ModeSelector activeMode={mode} onChange={setMode} />
                  )}

                  {/* Language Selection */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                        Output Language
                      </label>
                      <span className="text-[9px] text-slate-500 font-mono font-semibold">
                        [Speech Match Engine]
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setLanguage("en")}
                        className={`flex flex-col items-center justify-center py-1.5 px-1.5 rounded-lg border text-center transition-all duration-300 cursor-pointer ${
                          language === "en"
                            ? "bg-slate-900 border-slate-950 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xs mb-0.5">🇬🇧</span>
                        <span className="text-[11px] font-bold">English</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setLanguage("hi")}
                        className={`flex flex-col items-center justify-center py-1.5 px-1.5 rounded-lg border text-center transition-all duration-300 cursor-pointer ${
                          language === "hi"
                            ? "bg-slate-900 border-slate-950 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xs mb-0.5">🇮🇳</span>
                        <span className="text-[11px] font-bold">हिन्दी</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLanguage("hinglish")}
                        className={`flex flex-col items-center justify-center py-1.5 px-1.5 rounded-lg border text-center transition-all duration-300 cursor-pointer ${
                          language === "hinglish"
                            ? "bg-slate-900 border-slate-950 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xs mb-0.5">🗣️</span>
                        <span className="text-[11px] font-bold">Hinglish</span>
                      </button>
                    </div>
                  </div>

                  {/* Public/Private Visibility Toggle */}
                  <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-wide">
                          Courseware Visibility
                        </span>
                        <span className="text-[9px] text-slate-400 font-sans leading-none mt-0.5">
                          {isPrivate 
                            ? "Sovereign Private - Kept safe in your clarity logs" 
                            : "Public Community - Share in Academy Library"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPrivate(!isPrivate)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isPrivate ? "bg-amber-600" : "bg-blue-600"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isPrivate ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Submit trigger button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full relative py-2.5 px-3.5 rounded-lg font-display font-bold text-[11px] uppercase tracking-wider text-white transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-1 ${
                      inputTab === "blueprint"
                        ? "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:brightness-110 active:scale-[0.99] border border-amber-500/50"
                        : "bg-slate-900 hover:bg-slate-850 active:scale-[0.99]"
                    } disabled:opacity-50`}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>SYNTHESIZING BLUEPRINT...</span>
                      </>
                    ) : (
                      <>
                        <Compass className="w-3.5 h-3.5" />
                        <span>{inputTab === "blueprint" ? "Generate Master Blueprint (35 Sections)" : inputTab === "search" ? "Search & Explain" : inputTab === "news" ? "Fact-Check Claim" : "Banish Jargon"}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
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
                academyCourses={academyCourses}
                onSelectAcademyCourse={handleNavigateToCourse}
              />
            </div>

            {/* Right Column (Output Display & Visualizer): Width 7 columns on desktop */}
            <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8 lg:gap-10 h-full">
              
              {/* Main output terminal */}
              <OutputDisplay 
                text={output} 
                isLoading={isLoading} 
                language={language}
                currentCourseId={currentCourseId}
                onSpeechStateChange={(isSpeaking) => {
                  setKilvishStatus(isSpeaking ? "speaking" : "idle");
                }}
                rating={history.find((item) => item.id === currentLogId)?.rating}
                onRate={handleRate}
                onSelectTopic={(topic) => {
                  setSearchTopic(topic);
                  setInputTab("search");
                  setError(null);
                  handleSimplify(undefined, topic);
                }}
                sources={currentSources}
              />

              {/* Knowledge Insight Card: Simple UI decoration showing the rules in motion */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col gap-6">
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4.5 h-4.5 text-slate-900 animate-pulse" />
                  <h3 className="font-display font-bold text-xs text-slate-800 uppercase tracking-widest">
                    How Readability Banishes Dark Jargon
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                    <span className="font-mono text-[10px] text-blue-600 uppercase font-bold tracking-wider">
                      Rule 1: No Jargon
                    </span>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      All complex terms are replaced or followed by instant translations inside parentheses.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                    <span className="font-mono text-[10px] text-indigo-600 uppercase font-bold tracking-wider">
                      Rule 2: Structured
                    </span>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      Content is compartmentalized using bold key points, bullet lists, and header layouts.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                    <span className="font-mono text-[10px] text-slate-900 uppercase font-bold tracking-wider">
                      Rule 3: Dual Output
                    </span>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      Always presented in two sections: &quot;The Core Concept&quot; and &quot;The Breakdown&quot;.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Decorative clean footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs font-mono text-slate-400 bg-white mt-auto font-semibold">
        <p>&copy; {new Date().getFullYear()} READABILITY. ALL RIGHTS OF CLARITY PRESERVED.</p>
        <p className="text-[10px] mt-1 text-slate-400">POWERED BY GEMINI-3.5-FLASH &bull; CORE ENGINE: MR. KILVISH</p>
      </footer>

      {/* Floating Clarity Sidebar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 bg-slate-950 hover:bg-slate-850 text-white rounded-full px-3.5 py-3 sm:px-4.5 sm:py-3.5 shadow-xl border border-slate-800 transition-all active:scale-95 duration-200 cursor-pointer flex items-center justify-center gap-1.5 group font-display font-bold text-[9px] sm:text-[10.5px] tracking-wider uppercase"
        title="Toggle Clarity Helper"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        <TrendingUp className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white transition-colors" />
        <span>Clarity Stats</span>
      </button>

      {/* Slide-out Sidebar Panel */}
      <ReadabilitySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        inputText={inputText}
        outputText={output}
      />
    </div>
  );
}
