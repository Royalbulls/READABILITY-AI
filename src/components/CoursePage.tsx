import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  Printer, 
  Lock, 
  Unlock, 
  User, 
  Sparkles, 
  Send, 
  MessageSquare, 
  LogOut, 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

interface CoursePageProps {
  id: string;
  courseData: {
    title: string;
    text: string;
    mode: string;
    language: string;
    topic?: string;
    originalText?: string;
    timestamp: number;
  };
  onBackToWorkspace: () => void;
}

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export default function CoursePage({ id, courseData, onBackToWorkspace }: CoursePageProps) {
  // URLs
  const permanentUrl = `https://readability.rbaadvisor.com/course/${id}`;
  const actualUrl = `${window.location.origin}/course/${id}`;

  // UI States
  const [copied, setCopied] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  
  // Interactive Book Reader states
  const [viewMode, setViewMode] = useState<"book" | "scroll">("book");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Helper to split text into formatted book pages
  const getPages = (textToSplit: string) => {
    if (!textToSplit) return [""];
    
    // Split on markdown horizontal rule lines like --- or ___ or *** with optional trailing whitespace
    const rawPages = textToSplit.split(/\n\s*(?:---|___|\*\*\*)\s*\n/g);
    
    // If it only split into 1 page, let's split by "## " (H2 headers) to offer beautiful chunked chapters
    if (rawPages.length <= 1) {
      const parts = textToSplit.split(/\n\s*(?=##\s+)/g);
      if (parts.length > 1) {
        return parts.filter(p => p.trim() !== "");
      }
    }
    return rawPages.filter(p => p !== null && p !== undefined);
  };

  const pages = getPages(courseData.text);

  // Keydown listener for page turning
  useEffect(() => {
    if (viewMode !== "book") return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentPageIndex((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [viewMode, pages.length]);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginName, setLoginName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");

  // AI Tutor States
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorMessage, setTutorMessage] = useState("");
  const [tutorHistory, setTutorHistory] = useState<ChatMessage[]>([]);
  const [isTutorLoading, setIsTutorLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Check login state on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("readability_academy_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load user state", e);
    }
  }, []);

  // Scroll tutor chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tutorHistory, isTutorLoading]);

  // Copy URL to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(actualUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share using Web Share API
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mr. Kilvish Academy: ${courseData.title}`,
          text: `Check out this clear, simplified Courseware module on "${courseData.title}".`,
          url: actualUrl
        });
      } catch (err) {
        console.warn("Share failed or canceled", err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Trigger print PDF layout
  const handlePrintPDF = () => {
    window.print();
  };

  // Auth Handling
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!loginEmail || !loginPassword) {
      setAuthError("Please fill out all fields.");
      return;
    }

    if (isRegistering && !loginName) {
      setAuthError("Please enter your name.");
      return;
    }

    // High fidelity simulate auth
    const userData = {
      email: loginEmail,
      name: isRegistering ? loginName : loginEmail.split("@")[0].toUpperCase()
    };

    localStorage.setItem("readability_academy_user", JSON.stringify(userData));
    setUser(userData);
    setShowLoginModal(false);
    
    // Reset forms
    setLoginEmail("");
    setLoginPassword("");
    setLoginName("");
    setIsRegistering(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("readability_academy_user");
    setUser(null);
  };

  // Tutor Chat Action
  const handleSendTutorMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorMessage.trim() || isTutorLoading) return;

    const userMsg = tutorMessage.trim();
    setTutorMessage("");
    
    // Add user message to history
    const updatedHistory: ChatMessage[] = [...tutorHistory, { role: "user", content: userMsg }];
    setTutorHistory(updatedHistory);
    setIsTutorLoading(true);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          courseId: id,
          courseTitle: courseData.title,
          courseText: courseData.text,
          message: userMsg,
          chatHistory: tutorHistory
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Tutor server failed to answer.");
      }

      setTutorHistory([...updatedHistory, { role: "model", content: data.reply }]);
    } catch (err: any) {
      console.error(err);
      setTutorHistory([...updatedHistory, { 
        role: "model", 
        content: `⚠️ [TUTOR DISCONNECTED]: ${err.message || "Could not synthesize tutor connection. Please try again."}` 
      }]);
    } finally {
      setIsTutorLoading(false);
    }
  };

  // Clean formatting display tags
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

  const getLangLabel = (l: string) => {
    switch (l) {
      case "hi": return "Hindi (हिन्दी)";
      case "hinglish": return "Hinglish (Chat Style)";
      default: return "English (Standard)";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-slate-200 selection:text-slate-900 print:bg-white print:p-0">
      
      {/* Course Reader Header - Hidden on Print */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between gap-4 z-40 sticky top-0 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToWorkspace}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            title="Back to Workspace"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-sm text-slate-900 tracking-tight uppercase">
                Mr. Kilvish Academy
              </span>
              <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono font-bold px-1.5 py-0.5 rounded">
                SOVEREIGN REPOSITORY
              </span>
            </div>
            <p className="text-slate-500 text-[10px] font-mono leading-none mt-1">
              Courseware ID: {id}
            </p>
          </div>
        </div>

        {/* Auth / Login status in Header */}
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800">{user.name}</span>
                <span className="text-[10px] font-mono text-indigo-600 font-semibold uppercase">Enrolled Student</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold font-mono text-sm border border-slate-700 shadow-sm">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold uppercase rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Login</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Grid: Left is Book Content, Right is Academic Controls & AI Tutor */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 xl:gap-12 print:block print:p-0">
        
        {/* LEFT COLUMN: The actual Book Reader Page */}
        <section className="lg:col-span-8 flex flex-col gap-6 print:w-full print:block">
          
          {/* Breadcrumb - Hidden on Print */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 print:hidden">
            <span className="cursor-pointer hover:text-slate-800" onClick={onBackToWorkspace}>Readability</span>
            <ChevronRight className="w-3 h-3" />
            <span className="cursor-pointer hover:text-slate-800" onClick={onBackToWorkspace}>Library</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800 font-bold max-w-[200px] truncate">{courseData.title}</span>
          </div>

          {/* Elegant Cover/Letterhead for the online text */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[600px] print:border-none print:shadow-none print:rounded-none">
            
            {/* Textbook Banner header */}
            <div className="p-8 sm:p-10 bg-slate-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 relative overflow-hidden print:bg-white print:text-slate-900 print:border-b-2 print:border-slate-900 print:p-0 print:pt-6">
              <div className="absolute inset-0 bg-radial-gradient from-indigo-900/40 via-transparent to-transparent opacity-50 pointer-events-none" />
              
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-400 border border-white/10 shrink-0 print:border-2 print:border-slate-900 print:text-slate-900 print:bg-slate-100">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight leading-tight">
                    {courseData.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[10px] text-slate-400 print:text-slate-600 font-semibold uppercase">
                    <span className="bg-white/10 px-2 py-0.5 rounded text-indigo-300 border border-white/5 print:border-slate-300 print:text-slate-800">
                      {getModeLabel(courseData.mode)}
                    </span>
                    <span>&bull;</span>
                    <span className="text-slate-300">{getLangLabel(courseData.language)}</span>
                  </div>
                </div>
              </div>

              {/* Working QR Code displayed on on-screen banner */}
              <div className="shrink-0 flex items-center gap-3 bg-white/5 border border-white/10 p-2.5 rounded-xl self-start md:self-auto print:border-slate-300 print:bg-slate-50 print:p-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(actualUrl)}`}
                  alt="Sovereign QR Code"
                  className="w-12 h-12 bg-white p-0.5 rounded-md shadow-sm shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider leading-none">Scan to share</span>
                  <span className="text-[10px] font-mono font-extrabold text-indigo-400 uppercase tracking-widest mt-1 leading-none print:text-indigo-600">MKA-BK</span>
                </div>
              </div>
            </div>

            {/* Structured Course Body Display */}
            <div className="p-8 sm:p-12 md:p-14 lg:p-16 overflow-y-auto leading-relaxed font-sans text-slate-800 select-text bg-white flex-1 markdown-body print:p-0 print:pt-8">
              <Markdown remarkPlugins={[remarkGfm]}>
                {courseData.text}
              </Markdown>
            </div>

            {/* Elegant Letterhead Footer */}
            <div className="border-t border-slate-100 px-8 py-5 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-slate-500 font-semibold print:bg-white print:border-t-2 print:border-slate-900 print:px-0">
              <p>&copy; {new Date().getFullYear()} READABILITY ACADEMY &bull; DEAN MR. KILVISH</p>
              <p className="text-slate-400 uppercase tracking-wider">SECURE COURSE KEY: {id.toUpperCase()}</p>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Permanent link, QR Code, Copy/Share controls, AI Tutor Chat */}
        <aside className="lg:col-span-4 flex flex-col gap-6 print:hidden">
          
          {/* Permanent Ledger Info Box */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col gap-5">
            <h3 className="font-display font-bold text-xs text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-3 bg-indigo-600 rounded-full" />
              Courseware Ledger
            </h3>

            {/* Permanent URL display */}
            <div className="flex flex-col gap-1.5 bg-slate-50 p-4 border border-slate-100 rounded-xl">
              <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">Permanent URL</span>
              <div className="flex items-center gap-1">
                <code className="text-[11px] font-mono font-semibold text-slate-600 truncate flex-1 select-all">
                  {permanentUrl}
                </code>
              </div>
            </div>

            {/* Main Action Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold uppercase transition-all duration-300 cursor-pointer shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase transition-all duration-300 cursor-pointer shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Share URL</span>
              </button>

              <button
                onClick={handlePrintPDF}
                className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wide transition-all duration-300 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Download Course PDF</span>
              </button>
            </div>

            {/* High fidelity QR Code Block */}
            <div className="border-t border-slate-100 pt-5 flex items-center gap-4 bg-white">
              <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(actualUrl)}`}
                  alt="Sovereign QR Link"
                  className="w-24 h-24 bg-white p-0.5 rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col gap-1 text-slate-600">
                <span className="text-[10px] font-mono font-extrabold text-indigo-600 uppercase tracking-wider">Interactive Study Grid</span>
                <h4 className="text-xs font-bold text-slate-800 leading-tight">Mobile Scanning Enabled</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  Scan this live code with your phone to automatically open this course reader on any device.
                </p>
              </div>
            </div>
          </div>

          {/* AI Tutor Chat Widget */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
            {/* Tutor Header */}
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-none">Dean's AI Tutor</h4>
                  <span className="text-[9px] font-mono text-indigo-300 leading-none mt-1 inline-block uppercase tracking-wider font-bold">Mr. Kilvish</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[8px] font-mono uppercase font-bold tracking-widest border border-indigo-400/20">
                Live Chat
              </span>
            </div>

            {/* Chat History Pane */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 max-h-[320px]">
              {tutorHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300" />
                  <h5 className="text-xs font-bold text-slate-800">Need Clarity on this course?</h5>
                  <p className="text-[10px] max-w-[200px] leading-relaxed text-slate-400">
                    Ask questions, clear up complex details, or seek a customized roadmap from Mr. Kilvish.
                  </p>
                </div>
              ) : (
                tutorHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-slate-900 text-white ml-auto rounded-tr-none"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
                    }`}
                  >
                    <span className={`text-[8px] font-mono font-bold uppercase mb-1 ${
                      msg.role === "user" ? "text-indigo-300" : "text-slate-400"
                    }`}>
                      {msg.role === "user" ? "You (Student)" : "Mr. Kilvish Tutor"}
                    </span>
                    <p className="font-sans whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))
              )}
              
              {isTutorLoading && (
                <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-100 rounded-xl rounded-tl-none max-w-[85%] text-xs text-slate-500 shadow-sm animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                  <span className="font-mono text-[10px]">Formulating clarity...</span>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendTutorMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Ask your tutor anything..."
                value={tutorMessage}
                onChange={(e) => setTutorMessage(e.target.value)}
                disabled={isTutorLoading}
                className="flex-1 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-sans"
              />
              <button
                type="submit"
                disabled={!tutorMessage.trim() || isTutorLoading}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer disabled:opacity-40 transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </aside>
      </main>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-[scaleUp_0.25s_ease-out]">
            
            {/* Modal Header */}
            <div className="bg-slate-950 p-6 text-white text-center relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-lg sm:text-xl tracking-tight">
                {isRegistering ? "Enroll in Kilvish Academy" : "Student Login Ledger"}
              </h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Unlock full PDF compilation and unlimited AI Tutor interaction.
              </p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleLoginSubmit} className="p-6 flex flex-col gap-4">
              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {isRegistering && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="student@rbaadvisor.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                  Sovereign Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md mt-2"
              >
                {isRegistering ? "Enroll Now" : "Authenticate Ledger"}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setAuthError("");
                  }}
                  className="hover:text-indigo-600 underline cursor-pointer"
                >
                  {isRegistering ? "Have an account? Login" : "New student? Enroll"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs font-mono text-slate-400 bg-white mt-auto font-semibold print:hidden">
        <p>&copy; {new Date().getFullYear()} READABILITY. ALL RIGHTS OF CLARITY PRESERVED.</p>
        <p className="text-[10px] mt-1 text-slate-400">POWERED BY GEMINI-3.5-FLASH &bull; CORE ENGINE: MR. KILVISH</p>
      </footer>
    </div>
  );
}
