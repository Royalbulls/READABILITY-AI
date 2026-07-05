import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MrKilvishAvatar from "./components/MrKilvishAvatar";
import ModeSelector from "./components/ModeSelector";
import PersonaManager, { PersonaType } from "./components/PersonaManager";
import ExamplesHistoryPanel from "./components/ExamplesHistoryPanel";
import OutputDisplay from "./components/OutputDisplay";
import LocalizedErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./components/LandingPage";
import PricingWalletView from "./components/PricingWalletView";
import AdminConsoleView from "./components/AdminConsoleView";
import GrowthHubView from "./components/GrowthHubView";
import BusinessStudioView from "./components/BusinessStudioView";
import AcademyView from "./components/AcademyView";
import UniversalSearchView from "./components/UniversalSearchView";
import ProjectsHubView from "./components/ProjectsHubView";
import ComplianceModal from "./components/ComplianceModal";
import { InputHistoryItem, SimplificationMode, UserProfile } from "./types";
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
import { 
  auth, 
  googleProvider, 
  fetchUserHistory, 
  saveUserHistoryItem, 
  saveUserHistoryItemsBatch,
  deleteUserHistoryItem, 
  clearUserHistory,
  User
} from "./lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const TOPIC_SUGGESTIONS = [
  "Quantum Computing",
  "How Inflation Works",
  "What is Blockchain?",
  "CRISPR Gene Editing",
  "Artificial Neural Networks",
  "The Vagus Nerve"
];

export default function App() {
  // Authentication states
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeView, setActiveView] = useState<"workspace" | "pricing" | "growth" | "admin" | "business" | "academy" | "search" | "projects" | "create_earn">("workspace");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [complianceTab, setComplianceTab] = useState<"privacy" | "terms" | "refund" | "contact" | "about" | null>(null);

  // Pipeline & tab synchronization states
  const [pipelineBusinessData, setPipelineBusinessData] = useState<any>(null);
  const [growthHubInitialTab, setGrowthHubInitialTab] = useState<"dashboard" | "profile" | "creator" | "marketplace" | "launch" | "earnings" | "referrals" | "admin" | "business-studio" | "academy-integration" | "marketing-studio" | "crm" | "automation" | "analytics" | "enterprise-settings">("dashboard");

  // Input form states
  const [inputTab, setInputTab] = useState<"simplify" | "search">("simplify");
  const [searchTopic, setSearchTopic] = useState("");
  const [inputText, setInputText] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const [mode, setMode] = useState<SimplificationMode>("default");
  const [activePersona, setActivePersona] = useState<PersonaType>("default");
  
  // File upload states
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<"text" | "image" | null>(null);
  const [imageData, setImageData] = useState<string | null>(null); // base64 payload
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  
  // App system states
  const [devMode, setDevMode] = useState(false);
  const [output, setOutput] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [kilvishStatus, setKilvishStatus] = useState<"idle" | "loading" | "speaking">("idle");
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Persisted clarity logs (history)
  const [history, setHistory] = useState<InputHistoryItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUserProfile = async (currentUser: User) => {
    try {
      const idToken = await currentUser.getIdToken();
      
      // Check if referredBy code is in URL
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get("ref");
      const url = refCode ? `/api/user/profile?referredBy=${refCode}` : "/api/user/profile";

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    }
  };

  // Load history from localStorage on mount & sync with Firebase on auth changes
  useEffect(() => {
    // Check URL parameters for direct view routing (e.g., after payment redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get("view");
    if (viewParam && ["workspace", "pricing", "growth", "admin", "business", "academy", "search", "projects"].includes(viewParam)) {
      setActiveView(viewParam as any);
    }

    let unsubscribe = () => {};
    
    setIsAuthLoading(true);
    unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Load local history immediately so the UI is responsive from the start
      try {
        const localStored = localStorage.getItem("readability_ai_history_v2");
        if (localStored) {
          setHistory(JSON.parse(localStored));
        } else {
          setHistory([]);
        }
      } catch (e) {
        console.error("Failed to load local logs:", e);
      }

      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthLoading(false); // Unblock the UI immediately once user is determined
        
        // Fetch user wallet, credits, and role profile
        fetchUserProfile(firebaseUser);

        // Perform firestore cloud history fetch and synchronization in the background
        try {
          const cloudHistory = await fetchUserHistory(firebaseUser.uid);
          const localStored = localStorage.getItem("readability_ai_history_v2");
          const localItems: InputHistoryItem[] = localStored ? JSON.parse(localStored) : [];
          
          if (localItems.length > 0) {
            const cloudIds = new Set(cloudHistory.map(item => item.id));
            const itemsToSync = localItems.filter(item => item && item.id && !cloudIds.has(item.id));
            
            if (itemsToSync.length > 0) {
              const uniqueToSyncMap = new Map<string, InputHistoryItem>();
              itemsToSync.forEach(item => {
                uniqueToSyncMap.set(item.id, item);
              });
              const uniqueItemsToSync = Array.from(uniqueToSyncMap.values());

              try {
                await saveUserHistoryItemsBatch(firebaseUser.uid, uniqueItemsToSync);
              } catch (e) {
                console.error("Error batch syncing items to firestore:", e);
              }

              const mergedHistory = await fetchUserHistory(firebaseUser.uid);
              setHistory(mergedHistory);
              localStorage.setItem("readability_ai_history_v2", JSON.stringify(mergedHistory));
            } else {
              setHistory(cloudHistory);
              localStorage.setItem("readability_ai_history_v2", JSON.stringify(cloudHistory));
            }
          } else {
            setHistory(cloudHistory);
            localStorage.setItem("readability_ai_history_v2", JSON.stringify(cloudHistory));
          }
        } catch (err) {
          console.error("Error loading user cloud history:", err);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setActiveView("workspace");
        setIsAuthLoading(false); // Unblock the UI immediately for guests / landing page
      }
    });

    return () => unsubscribe();
  }, []);

  // Auth helper methods
  const handleSignIn = async () => {
    setIsAuthLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError("Failed to sign in with Google: " + (err.message || "Unknown error"));
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsAuthLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Signout error:", err);
      setError("Failed to sign out: " + err.message);
    } finally {
      setIsAuthLoading(false);
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

  const handleClearHistory = async () => {
    const confirmMsg = user 
      ? "Are you sure you want to clear all your saved clarity logs from both Cloud and local storage?"
      : "Are you sure you want to clear your saved clarity logs from your local workspace?";

    if (confirm(confirmMsg)) {
      setHistory([]);
      localStorage.removeItem("readability_ai_history_v2");
      
      if (user) {
        try {
          await clearUserHistory(user.uid, history);
        } catch (dbErr: any) {
          console.error("Firestore clear error:", dbErr);
          setError("Failed to clear cloud history: " + (dbErr.message || "Unknown error"));
        }
      }
    }
  };


  // Parse attached files
  const processFile = (file: File) => {
    if (!file) return;

    setError(null);
    const type = file.type;

    if (type.startsWith("image/")) {
      // Image parsing for OCR + simplification via multimodal Gemini with client-side scaling/optimization
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawDataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          // Target max dimension
          const MAX_DIM = 1200;
          let width = img.width;
          let height = img.height;

          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // Modern browsers automatically handle EXIF orientation when drawing to canvas
            ctx.drawImage(img, 0, 0, width, height);
            
            // Use image/jpeg for efficient compression, keeping text sharp with 0.85 quality
            const mimeType = "image/jpeg";
            const dataUrl = canvas.toDataURL(mimeType, 0.85);
            
            const commaIndex = dataUrl.indexOf(",");
            if (commaIndex !== -1) {
              setImageData(dataUrl.substring(commaIndex + 1));
              setImageMimeType(mimeType);
              setFileName(file.name);
              setFileType("image");
              
              if (!inputTitle) {
                setInputTitle(`Image: ${file.name.replace(/\.[^/.]+$/, "")}`);
              }
            } else {
              setError("Failed to optimize upload image.");
            }
          } else {
            // Fallback if canvas context is unavailable
            const commaIndex = rawDataUrl.indexOf(",");
            if (commaIndex !== -1) {
              setImageData(rawDataUrl.substring(commaIndex + 1));
              setImageMimeType(type);
              setFileName(file.name);
              setFileType("image");
              if (!inputTitle) {
                setInputTitle(`Image: ${file.name.replace(/\.[^/.]+$/, "")}`);
              }
            }
          }
        };
        img.onerror = () => {
          setError("Failed to load image for optimization.");
        };
        img.src = rawDataUrl;
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
    setDetectedLanguage("");

    try {
      const payload: any = {
        mode: mode,
        persona: activePersona,
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

      const headers: any = {
        "Content-Type": "application/json",
      };
      if (user) {
        const idToken = await user.getIdToken();
        headers["Authorization"] = `Bearer ${idToken}`;
      }

      const response = await fetch("/api/simplify", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to communicate with intelligence core.");
      }

      // Refresh user profile states (remaining credits)
      if (user) {
        fetchUserProfile(user);
      }

      setOutput(data.result);
      setDetectedLanguage(data.detectedLanguage || "en");
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

      const updatedHistory = [logItem, ...history].slice(0, 50);
      setHistory(updatedHistory);
      localStorage.setItem("readability_ai_history_v2", JSON.stringify(updatedHistory));

      if (user) {
        try {
          await saveUserHistoryItem(user.uid, logItem);
        } catch (dbErr: any) {
          console.error("Firestore save error:", dbErr);
          setError("Cloud sync delayed: " + (dbErr.message || "Unknown error"));
        }
      }

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

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-white font-bold text-2xl font-display shadow-md">
            K
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
            <span>Establishing secure clarity channel...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage onSignIn={handleSignIn} isAuthLoading={isAuthLoading} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col lg:flex-row selection:bg-slate-200 selection:text-slate-900">
      {/* Sidebar navigation */}
      <Sidebar 
        user={user}
        onSignOut={handleSignOut}
        activeView={activeView}
        setActiveView={setActiveView}
        userProfile={userProfile}
        devMode={devMode}
        setDevMode={setDevMode}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Global Unified Ecosystem Steps Navigation */}
        <div className="bg-slate-900 text-white p-3.5 border-b border-slate-800 flex items-center justify-center sticky top-0 z-10 shadow-md">
          {/* 5-Step Connected Pipeline Tracker */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto max-w-full">
            {[
              { step: 1, label: "Learn", desc: "Learn Anything", view: "academy", tab: "dashboard", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
              { step: 2, label: "Build", desc: "Business Planner", view: "business", tab: "dashboard", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
              { step: 3, label: "Launch", desc: "Grow My Business", view: "growth", tab: "launch", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
              { step: 4, label: "Earn", desc: "Create & Earn", view: "create_earn", tab: "creator", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
              { step: 5, label: "Scale", desc: "Our Clients & Grow", view: "growth", tab: "crm", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
            ].map((s) => {
              // Determine active status
              const isActive = (s.view === "create_earn" && activeView === "create_earn") ||
                (s.view === "growth" && s.tab === "creator" && activeView === "create_earn") ||
                (s.view === "growth" && s.tab !== "creator" && activeView === "growth" && growthHubInitialTab === s.tab) ||
                (s.view !== "growth" && s.view !== "create_earn" && activeView === s.view);
              return (
                <button
                  key={s.step}
                  onClick={() => {
                    if (s.view === "create_earn") {
                      setActiveView("create_earn");
                    } else {
                      setActiveView(s.view as any);
                      if (s.view === "growth") {
                        setGrowthHubInitialTab(s.tab as any);
                      }
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-2 text-left shrink-0 ${
                    isActive
                      ? "bg-slate-800 border-slate-750 shadow-sm scale-105"
                      : "border-transparent opacity-65 hover:opacity-100 hover:bg-slate-900"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black border ${s.color}`}>
                    {s.step}
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-tight leading-none text-white">{s.label}</div>
                    <div className="text-[8px] text-slate-400 font-mono tracking-wider font-semibold mt-0.5">{s.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Workspace Layout or Billing or Admin */}
        {activeView === "pricing" && user ? (
          <PricingWalletView 
            user={user}
            userProfile={userProfile}
            onRefreshProfile={() => fetchUserProfile(user)}
          />
        ) : (activeView === "growth" || activeView === "create_earn") && user ? (
          <GrowthHubView 
            user={user}
            userProfile={userProfile}
            onRefreshProfile={() => fetchUserProfile(user)}
            initialTab={activeView === "create_earn" ? "creator" : growthHubInitialTab}
            devMode={devMode}
          />
        ) : activeView === "business" && user ? (
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col items-center">
            <BusinessStudioView
              user={user}
              userProfile={userProfile}
              onRefreshProfile={() => fetchUserProfile(user)}
              setActiveView={setActiveView}
              pipelineBusinessData={pipelineBusinessData}
              clearPipelineBusinessData={() => setPipelineBusinessData(null)}
            />
          </div>
        ) : activeView === "academy" && user ? (
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col items-center">
            <AcademyView
              user={user}
              userProfile={userProfile}
              onRefreshProfile={() => fetchUserProfile(user)}
              setActiveView={setActiveView}
              onStartBusiness={(data) => {
                setPipelineBusinessData(data);
                setActiveView("business");
              }}
            />
          </div>
        ) : activeView === "search" ? (
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col items-center">
            <UniversalSearchView
              user={user}
              userProfile={userProfile}
              onRefreshProfile={() => fetchUserProfile(user)}
              setActiveView={setActiveView}
            />
          </div>
        ) : activeView === "projects" && user ? (
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col items-center">
            <ProjectsHubView
              user={user}
              onRefreshProfile={() => fetchUserProfile(user)}
              setActiveView={setActiveView}
            />
          </div>
        ) : activeView === "admin" && user && userProfile?.role === "admin" ? (
          <AdminConsoleView user={user} />
        ) : (
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Column (Controls & Forms): Width 5 columns on desktop */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full">
          
          {/* Mr. Kilvish Persona Widget */}
          <MrKilvishAvatar status={kilvishStatus} />

          {/* Persona Manager */}
          <PersonaManager activePersona={activePersona} onPersonaChange={setActivePersona} devMode={devMode} />

          {/* Core Input Panel */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-display font-bold text-sm text-slate-800 tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-3 bg-slate-900 rounded-full" />
                {devMode ? "Workspace Input" : "Your Input"}
              </h2>
              <button
                type="button"
                onClick={handleWipeForm}
                className="text-[11px] font-mono font-semibold text-slate-500 hover:text-rose-600 transition-all duration-300 flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded border border-slate-200 cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5" />
                {devMode ? "Clear Workspace" : "Start Fresh"}
              </button>
            </div>

            {/* Error Indicator */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold font-mono">{devMode ? "WORKSPACE ERROR:" : "ERROR:"}</span> {error}
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
                {devMode ? "Simplify Document" : "Explain Document"}
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
                {devMode ? "Infinity Search" : "Search & Learn"}
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
                    <span>{devMode ? "SYNTHESIZING..." : "Working..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{inputTab === "search" ? (devMode ? "Search & Explain" : "Search & Learn") : (devMode ? "Banish Jargon" : "Explain")}</span>
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
        <div className="lg:col-span-7 flex flex-col gap-4 h-full">
          
          {/* Main output terminal */}
          <LocalizedErrorBoundary>
            <OutputDisplay 
              text={output} 
              isLoading={isLoading} 
              user={user}
              detectedLanguage={detectedLanguage}
              devMode={devMode}
              onSpeechStateChange={(isSpeaking) => {
                setKilvishStatus(isSpeaking ? "speaking" : "idle");
              }}
            />
          </LocalizedErrorBoundary>

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
      )}

        {/* Decorative clean footer */}
        <footer className="border-t border-slate-200 py-6 text-center text-xs font-mono text-slate-400 bg-white mt-auto font-semibold flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
            <button onClick={() => setComplianceTab("about")} className="hover:text-indigo-600 transition cursor-pointer">About Us</button>
            <span>&bull;</span>
            <button onClick={() => setComplianceTab("privacy")} className="hover:text-indigo-600 transition cursor-pointer">Privacy Policy</button>
            <span>&bull;</span>
            <button onClick={() => setComplianceTab("terms")} className="hover:text-indigo-600 transition cursor-pointer">Terms & Conditions</button>
            <span>&bull;</span>
            <button onClick={() => setComplianceTab("refund")} className="hover:text-indigo-600 transition cursor-pointer">Refund Policy</button>
            <span>&bull;</span>
            <button onClick={() => setComplianceTab("contact")} className="hover:text-indigo-600 transition cursor-pointer">Contact Us</button>
          </div>
          <p>&copy; {new Date().getFullYear()} READABILITY AI. ALL RIGHTS OF CLARITY PRESERVED.</p>
          <p className="text-[10px] mt-1 text-slate-400 font-medium">POWERED BY GEMINI-3.5-FLASH &bull; CORE ENGINE: MR. KILVISH</p>
        </footer>

        {complianceTab && (
          <ComplianceModal 
            initialTab={complianceTab} 
            onClose={() => setComplianceTab(null)} 
          />
        )}
      </div>
    </div>
  );
}
