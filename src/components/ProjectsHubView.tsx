import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { 
  Folder, 
  FolderOpen, 
  Search, 
  Trash2, 
  Edit3, 
  Save, 
  Copy, 
  Check, 
  Download, 
  Volume2, 
  VolumeX, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  ArrowLeft, 
  FileText, 
  Sparkles, 
  Plus,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Briefcase,
  Share2
} from "lucide-react";
import { SavedProject } from "../types";
import { fetchUserProjects, saveUserProject, deleteUserProject } from "../lib/firebase";

interface ProjectsHubViewProps {
  user: any;
  onRefreshProfile?: () => void;
  setActiveView: (view: any) => void;
}

export default function ProjectsHubView({
  user,
  onRefreshProfile,
  setActiveView
}: ProjectsHubViewProps) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Selected Project for Expanded View / Editing
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  
  // Clipboard/TTS feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const categories = [
    "All",
    "Simplifier",
    "Course",
    "Assignment",
    "Business Plan",
    "Startup Roadmap",
    "Creator OS"
  ];

  const categoryLabels: Record<string, string> = {
    "All": "📁 All saved files",
    "Simplifier": "📄 Document Summaries",
    "Course": "🎓 Course Materials",
    "Assignment": "✏️ Study Assignments",
    "Business Plan": "📊 Business Studio Plans",
    "Startup Roadmap": "🚀 Scaling Roadmaps",
    "Creator OS": "💻 Digital Products"
  };

  const isSpeechSupported = typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined" && !!window.speechSynthesis;

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  useEffect(() => {
    filterAndSearch();
  }, [projects, searchQuery, activeCategory]);

  // Clean TTS if we unmount
  useEffect(() => {
    return () => {
      if (isSpeechSupported) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {
          console.warn(e);
        }
      }
    };
  }, [isSpeechSupported]);

  const loadProjects = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const items = await fetchUserProjects(user.uid);
      setProjects(items);
    } catch (err) {
      console.error("Error loading projects in hub:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSearch = () => {
    let result = [...projects];

    // Filter by Category
    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        p => p.title.toLowerCase().includes(q) || 
             (p.description || "").toLowerCase().includes(q) ||
             p.content.toLowerCase().includes(q)
      );
    }

    setFilteredProjects(result);
  };

  const handleDelete = async (projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently delete this project?")) return;

    try {
      await deleteUserProject(user.uid, projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const handleToggleLike = async (project: SavedProject, action: "like" | "dislike", e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    let updatedProj = { ...project };
    if (action === "like") {
      updatedProj.liked = !project.liked;
      if (updatedProj.liked) updatedProj.disliked = false;
    } else {
      updatedProj.disliked = !project.disliked;
      if (updatedProj.disliked) updatedProj.liked = false;
    }

    try {
      await saveUserProject(user.uid, updatedProj);
      setProjects(prev => prev.map(p => p.id === project.id ? updatedProj : p));
      if (selectedProject?.id === project.id) {
        setSelectedProject(updatedProj);
      }
    } catch (err) {
      console.error("Failed to update reaction status:", err);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy project content:", err);
    }
  };

  const handleDownload = (project: SavedProject) => {
    const blob = new Blob([project.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.title.replace(/\s+/g, "_")}_Readability.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSpeech = (text: string) => {
    if (!isSpeechSupported) return;

    if (isSpeaking) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      
      const cleanText = text
        .replace(/[#*`~_]/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } catch (err) {
      console.warn(err);
      setIsSpeaking(false);
    }
  };

  const startEditing = (project: SavedProject) => {
    setEditedContent(project.content);
    setEditedTitle(project.title);
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedProject) return;
    if (!editedTitle.trim()) return;

    const updatedProject: SavedProject = {
      ...selectedProject,
      title: editedTitle.trim(),
      content: editedContent,
      timestamp: Date.now()
    };

    try {
      await saveUserProject(user.uid, updatedProject);
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
      setSelectedProject(updatedProject);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save edited project:", err);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col font-sans select-text pb-12">
      {/* Upper Action Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-indigo-600" />
            <h2 className="font-display font-bold text-base text-slate-900 uppercase tracking-wider">
              Project Hub & Workspace Portfolio
            </h2>
          </div>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">
            Your centralized archive of simplified files, startup roadmaps, courses, and business plans compiled by Readability AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("workspace")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Simplify New Document</span>
          </button>
        </div>
      </div>

      {/* Main Grid Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 items-start">
        
        {/* Left pane: Filter & Project List (5 Cols or Full if no select) */}
        <div className={`flex flex-col gap-5 ${selectedProject ? "lg:col-span-5" : "lg:col-span-12"}`}>
          
          {/* Controls Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects by title, notes, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white transition"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-[11px] font-mono font-bold uppercase rounded-lg transition border cursor-pointer ${
                    activeCategory === cat
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project List */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-2xl min-h-[250px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2" />
              <span className="text-xs font-mono font-bold text-slate-500">RECONCILING ARCHIVES...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-dashed border-slate-200 rounded-2xl min-h-[250px] text-center">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 mb-3">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">No Projects Found</h4>
              <p className="text-slate-500 text-[11px] mt-1.5 max-w-xs leading-relaxed">
                {searchQuery ? "No matches found for your search filters. Try typing a different keyword." : "You haven't saved any assets here yet! Try simplifying content or creating courses and saving them to your portfolio."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3.5">
              {filteredProjects.map((p) => {
                const isCurrent = selectedProject?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProject(p);
                      setIsEditing(false);
                      if (isSpeaking) {
                        try { window.speechSynthesis.cancel(); } catch (e) {}
                        setIsSpeaking(false);
                      }
                    }}
                    className={`p-4 bg-white border rounded-2xl shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between group relative ${
                      isCurrent
                        ? "border-indigo-600 bg-indigo-50/10 shadow-sm ring-1 ring-indigo-500/15"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    {/* Top row */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[9px] font-mono font-bold bg-slate-100 group-hover:bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded uppercase border border-slate-200/45 tracking-wider">
                          {p.category}
                        </span>
                        
                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          {/* Like feedback on grid */}
                          <button
                            onClick={(e) => handleToggleLike(p, "like", e)}
                            className={`p-1 rounded-md hover:bg-slate-100 text-slate-400 ${p.liked ? "text-emerald-600" : ""}`}
                            title="Like Project"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleToggleLike(p, "dislike", e)}
                            className={`p-1 rounded-md hover:bg-slate-100 text-slate-400 ${p.disliked ? "text-rose-600" : ""}`}
                            title="Dislike Project"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(p.id, e)}
                            className="p-1 rounded-md hover:bg-rose-50 hover:text-rose-600 text-slate-400"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition truncate pr-4">
                        {p.title}
                      </h3>
                      {p.description && (
                        <p className="text-slate-500 text-[11px] mt-1 leading-relaxed line-clamp-2">
                          {p.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom stats row */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-4 pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-300" />
                        {new Date(p.timestamp).toLocaleDateString()}
                      </span>
                      
                      <span className="text-[9px] font-bold text-indigo-500 flex items-center gap-1">
                        Open Project <ArrowRight className="w-3 h-3 text-indigo-500" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right pane: Selected project view / Edit Workspace (7 Cols) */}
        {selectedProject && (
          <div className="lg:col-span-7 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-slideLeft">
            
            {/* Header section with expanded control buttons */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setIsEditing(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition cursor-pointer flex lg:hidden"
                  title="Back to list"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                    {selectedProject.category}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Saved on {new Date(selectedProject.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Tools */}
              <div className="flex items-center gap-1.5">
                {/* Listen */}
                {isSpeechSupported && (
                  <button
                    onClick={() => handleSpeech(isEditing ? editedContent : selectedProject.content)}
                    className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                      isSpeaking
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100"
                        : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                    title={isSpeaking ? "Mute reader" : "Read project content aloud"}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 text-indigo-600" /> : <Volume2 className="w-4 h-4 text-indigo-500" />}
                    <span className="text-[11px] font-mono hidden sm:inline">{isSpeaking ? "Mute" : "Listen"}</span>
                  </button>
                )}

                {/* Edit Toggle */}
                {isEditing ? (
                  <button
                    onClick={handleSaveChanges}
                    className="p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    title="Save edited file changes"
                  >
                    <Save className="w-4 h-4" />
                    <span className="text-[11px] font-mono hidden sm:inline">Save</span>
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(selectedProject)}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    title="Edit project file"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-[11px] font-mono hidden sm:inline">Edit</span>
                  </button>
                )}

                {/* Copy */}
                <button
                  onClick={() => handleCopy(isEditing ? editedContent : selectedProject.content, selectedProject.id)}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition"
                  title="Copy to clipboard"
                >
                  {copiedId === selectedProject.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>

                {/* Download */}
                <button
                  onClick={() => handleDownload(selectedProject)}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition"
                  title="Download Markdown (.md)"
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(selectedProject.id)}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition"
                  title="Delete file permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title display/input */}
            <div className="px-6 pt-5 pb-3 border-b border-slate-100">
              {isEditing ? (
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Project Name</label>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full font-display font-bold text-sm text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-slate-300 focus:bg-white"
                  />
                </div>
              ) : (
                <>
                  <h1 className="font-display font-bold text-sm md:text-base text-slate-950 uppercase tracking-wide">
                    {selectedProject.title}
                  </h1>
                  {selectedProject.description && (
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed font-sans italic">
                      {selectedProject.description}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Main content display area */}
            <div className="p-6 overflow-y-auto max-h-[500px] leading-relaxed select-text bg-white">
              {isEditing ? (
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Content Editor (Markdown Supported)</label>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full text-xs leading-relaxed text-slate-800 p-4 border border-slate-200 rounded-xl min-h-[350px] font-sans focus:outline-none focus:border-slate-300 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              ) : (
                <div className="markdown-body space-y-5 text-sm font-sans [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:border-b [&_h2]:border-slate-100 [&_h2]:pb-2 [&_h2]:mt-6 [&_h2]:tracking-wide [&_h2]:uppercase [&_h3]:font-display [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-4 [&_p]:text-slate-700 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-slate-600 [&_strong]:text-blue-700 [&_strong]:font-semibold [&_em]:text-slate-800 [&_code]:font-mono [&_code]:text-xs [&_code]:bg-slate-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-blue-800 [&_code]:border [&_code]:border-slate-150">
                  <Markdown>{selectedProject.content}</Markdown>
                </div>
              )}
            </div>

            {/* Footer with reaction feedback */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-slate-500 font-mono">Feedback:</span>
                <button
                  onClick={() => handleToggleLike(selectedProject, "like")}
                  className={`flex items-center gap-1.5 px-3 py-1 border rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                    selectedProject.liked
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold"
                      : "bg-white border-slate-200 text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{selectedProject.liked ? "Liked!" : "Like"}</span>
                </button>
                <button
                  onClick={() => handleToggleLike(selectedProject, "dislike")}
                  className={`flex items-center gap-1.5 px-3 py-1 border rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                    selectedProject.disliked
                      ? "bg-rose-50 border-rose-200 text-rose-700 font-bold"
                      : "bg-white border-slate-200 text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>{selectedProject.disliked ? "Disliked!" : "Dislike"}</span>
                </button>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                <Share2 className="w-3.5 h-3.5" />
                <span>Format: Markdown</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
