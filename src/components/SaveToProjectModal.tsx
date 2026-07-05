import React, { useState, useEffect } from "react";
import { FolderPlus, FolderOpen, X, Check, Loader2, Sparkles, Plus, BookOpen, FileText } from "lucide-react";
import { SavedProject } from "../types";
import { fetchUserProjects, saveUserProject } from "../lib/firebase";

interface SaveToProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  contentToSave: string;
  defaultCategory?: string;
  defaultTitle?: string;
}

export default function SaveToProjectModal({
  isOpen,
  onClose,
  userId,
  contentToSave,
  defaultCategory = "Simplifier",
  defaultTitle = ""
}: SaveToProjectModalProps) {
  const [existingProjects, setExistingProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMode, setSaveMode] = useState<"new" | "existing">("new");
  
  // Form fields for new project
  const [newTitle, setNewTitle] = useState(defaultTitle || "");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState(defaultCategory);

  // Form fields for existing project
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [appendMode, setAppendMode] = useState<"append" | "replace">("append");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      loadProjects();
      setNewTitle(defaultTitle || "");
      setSaveSuccess(false);
      setError(null);
    }
  }, [isOpen, userId, defaultTitle]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const projects = await fetchUserProjects(userId);
      setExistingProjects(projects);
      if (projects.length > 0) {
        setSelectedProjectId(projects[0].id);
        setSaveMode("existing");
      } else {
        setSaveMode("new");
      }
    } catch (err) {
      console.error("Error loading user projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (saveMode === "new") {
        if (!newTitle.trim()) {
          throw new Error("Project title is required.");
        }

        const newProject: SavedProject = {
          id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          userId,
          title: newTitle.trim(),
          description: newDescription.trim(),
          category: newCategory,
          content: contentToSave,
          timestamp: Date.now()
        };

        await saveUserProject(userId, newProject);
      } else {
        // Save to existing project
        const existingProj = existingProjects.find(p => p.id === selectedProjectId);
        if (!existingProj) {
          throw new Error("Selected project not found.");
        }

        let updatedContent = "";
        if (appendMode === "append") {
          updatedContent = existingProj.content + "\n\n---\n### Added on " + new Date().toLocaleDateString() + "\n" + contentToSave;
        } else {
          updatedContent = contentToSave;
        }

        const updatedProject: SavedProject = {
          ...existingProj,
          content: updatedContent,
          timestamp: Date.now()
        };

        await saveUserProject(userId, updatedProject);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-indigo-600" />
            <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider">
              Save Content to Project
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {saveSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-pulse">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="font-display font-bold text-slate-900 text-base">
                Saved Successfully!
              </h4>
              <p className="text-slate-500 text-xs mt-1">
                Your content has been securely compiled into your workspace projects.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              {/* Mode Toggle */}
              {existingProjects.length > 0 && (
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setSaveMode("new")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono font-bold uppercase rounded-lg transition ${
                      saveMode === "new"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaveMode("existing")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono font-bold uppercase rounded-lg transition ${
                      saveMode === "existing"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    Existing Project ({existingProjects.length})
                  </button>
                </div>
              )}

              {saveMode === "new" ? (
                <div className="space-y-3.5 animate-fadeIn">
                  {/* Title */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Project Title / Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Marketing Copy Deck, Unit 2 Quiz Notes"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="bg-slate-50 text-xs text-slate-800 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 focus:bg-white transition-all duration-200 font-sans"
                      required
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="bg-slate-50 text-xs text-slate-800 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 focus:bg-white transition"
                    >
                      <option value="Simplifier">Document Simplifier</option>
                      <option value="Course">Academy Course</option>
                      <option value="Assignment">Course Assignment</option>
                      <option value="Business Plan">Business Studio Plan</option>
                      <option value="Startup Roadmap">Startup Growth Roadmap</option>
                      <option value="Creator OS">Creator Digital Product</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Short Description (Optional)
                    </label>
                    <textarea
                      placeholder="e.g., Condensed lecture summaries & key metaphors for reuse"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="bg-slate-50 text-xs text-slate-800 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 focus:bg-white transition min-h-[60px]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  {/* Select Existing */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Select Project
                    </label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="bg-slate-50 text-xs text-slate-800 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 focus:bg-white transition"
                    >
                      {existingProjects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Save Option */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Save Method
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setAppendMode("append")}
                        className={`p-2.5 rounded-lg border text-xs font-medium text-center transition ${
                          appendMode === "append"
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold"
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-bold">Append Content</div>
                        <div className="text-[9px] opacity-75 mt-0.5">Add to bottom of file</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAppendMode("replace")}
                        className={`p-2.5 rounded-lg border text-xs font-medium text-center transition ${
                          appendMode === "replace"
                            ? "bg-rose-50 border-rose-200 text-rose-700 font-semibold"
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-bold">Replace Content</div>
                        <div className="text-[9px] opacity-75 mt-0.5">Overwrite existing file</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-500 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Confirm Save</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
