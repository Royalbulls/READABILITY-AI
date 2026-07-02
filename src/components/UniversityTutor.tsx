import React, { useState } from "react";
import { 
  Sparkles, 
  MessageSquare, 
  Send, 
  RefreshCw, 
  FileText, 
  HelpCircle, 
  Layers, 
  Info,
  Check
} from "lucide-react";

interface UniversityTutorProps {
  topic: string;
  user: any;
}

export default function UniversityTutor({
  topic,
  user
}: UniversityTutorProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [simplicity, setSimplicity] = useState<"child" | "standard" | "professional">("standard");
  const [conversation, setConversation] = useState<Array<{ sender: "user" | "tutor"; text: string }>>([
    {
      sender: "tutor",
      text: `Greetings, Scholar! I am the **Readability AI Faculty Tutor** for Mr. Kilvish AI Academy. Ask me any question about **${topic || "Artificial Intelligence"}** or upload files, and I will explain them simply.`
    }
  ]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileAttachedName, setFileAttachedName] = useState<string | null>(null);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !fileAttachedName) return;

    const userMessage = query.trim() || `Analyze the uploaded document: ${fileAttachedName}`;
    setConversation(prev => [...prev, { sender: "user", text: userMessage }]);
    setQuery("");
    setIsLoading(true);

    try {
      // Simulate real-time university tutor explanation
      setTimeout(() => {
        let tutorExplanation = "";

        if (simplicity === "child") {
          tutorExplanation = `Let me explain this as if you are 10 years old! 👶\n\nThink of this like a video game. **${topic || "Artificial Intelligence"}** is basically like training a cute robotic dog. We don't write rules for every step, instead we show it treats and let it learn from its mistakes until it knows how to sit and shake hands!\n\nYour question was: *${userMessage}*.\n\nImagine feeding our robotic pup tons of pictures of cats. At first, it might confuse a dog for a cat, but with enough cookies (positive feedback), it learns exactly what makes a kitten different! Isn't that super cool?`;
        } else if (simplicity === "professional") {
          tutorExplanation = `### Executive Academic Digest (Corporate Level) 🏛️\n\nConcerning your query on **${topic || "Artificial Intelligence"}**:\n\n*   **Architectural Overview**: The implementation relies on multi-layer weights adaptation, optimizing dynamic nodes via gradient descent. This eliminates hardcoded conditional pathways in favor of soft probabilistic heuristics.\n*   **Regulatory & Risk Auditing Frameworks**: As highlighted by Royal Bulls Advisory Private Limited, establishing proper cognitive parameters is crucial. When deploying these models, data structures must be sanitized to comply with corporate sovereign audits.\n*   **Specific Assessment**: Concerning *"${userMessage}"*, the optimal path is establishing robust integration layers that allow clean REST calls into a zero-knowledge registry, ensuring maximum speed and security compliance.`;
        } else {
          tutorExplanation = `### Readability AI Standard Tutor Session 🎓\n\nLet us dive into your concept: *"${userMessage}"*.\n\nTo understand **${topic || "Artificial Intelligence"}** at an intermediate university level, we analyze three pillars:\n\n1.  **Data Ingestion**: Clean inputs define the precision boundaries of our models.\n2.  **Model Training**: Weights adjust incrementally so that the computer recognizes complex patterns.\n3.  **Inference**: The live system makes decisions based on prior training datasets.\n\n#### Direct Answer:\nYour query regarding how this applies is highly relevant. By applying the Readability simple syntax rule, we remove redundant jargon. We can view this as a structured lookup: instead of storing infinite responses, we establish a clean algorithm that generates correct values dynamically.`;
        }

        setConversation(prev => [...prev, { sender: "tutor", text: tutorExplanation }]);
        setFileAttachedName(null);
        setSelectedFile(null);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setConversation(prev => [...prev, { sender: "tutor", text: "Apologies, scholar. My neural connection is experiencing heavy static. Please retype your academic question." }]);
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileAttachedName(file.name);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
      {/* Left column:Simplicity adjustment and reference items */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 space-y-5 shadow-sm">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-violet-600" />
            Simplicity Controller
          </h3>
        </div>

        <div className="space-y-4">
          <p className="text-slate-500 text-xs leading-relaxed">
            Adjust the AI Tutor's pedagogical style. We use Readability AI schemas to simplify text in real-time.
          </p>

          <div className="space-y-2">
            {[
              { id: "child", title: "ELI5 (Explain like I'm 10)", desc: "Simplifies with simple metaphors and game concepts." },
              { id: "standard", title: "Standard Academic", desc: "Balanced university model with definitions and clear items." },
              { id: "professional", title: "Corporate Professional", desc: "Accredited terminology, executive-level summaries, and audits." }
            ].map(style => (
              <button
                key={style.id}
                type="button"
                onClick={() => setSimplicity(style.id as any)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  simplicity === style.id
                    ? "border-violet-600 bg-violet-50 text-violet-900"
                    : "border-slate-100 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                  simplicity === style.id ? "border-violet-600 bg-violet-600" : "border-slate-300 bg-white"
                }`}>
                  {simplicity === style.id && <Check className="w-2 text-white" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold font-display">{style.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{style.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-2.5">
            <Info className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-600 leading-relaxed font-sans">
              <strong>Tip</strong>: If you upload an assignment outline or legal document, set the simplicity mode to <strong>Standard Academic</strong> to extract key dates and clauses simply.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Active Interactive Chat Frame */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6 min-h-[500px]">
        {/* Chat History Header */}
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-700">Readability AI Tutor Online</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Academic Session #298A</span>
        </div>

        {/* Conversation Box */}
        <div className="flex-1 space-y-4 max-h-[350px] overflow-y-auto pr-1">
          {conversation.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
              <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed font-sans ${
                msg.sender === "user"
                  ? "bg-violet-600 text-white rounded-tr-none"
                  : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none whitespace-pre-wrap"
              }`}>
                {msg.sender === "user" ? (
                  <p className="font-semibold">{msg.text}</p>
                ) : (
                  <div className="space-y-2">
                    <p>{msg.text}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-violet-600" />
                <span>AI Tutor is drafting simplified response...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <form onSubmit={handleQuerySubmit} className="space-y-3 border-t border-slate-100 pt-4">
          {/* File attachment preview */}
          {fileAttachedName && (
            <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-mono text-slate-600">
              <span className="truncate">Attached File: {fileAttachedName}</span>
              <button
                type="button"
                onClick={() => { setFileAttachedName(null); setSelectedFile(null); }}
                className="text-rose-500 font-bold hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl cursor-pointer transition-all flex items-center justify-center shrink-0">
              <FileText className="w-4.5 h-4.5" />
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".txt,.pdf,.doc,.docx"
                className="hidden"
              />
            </label>

            <input
              type="text"
              placeholder="Ask anything about the syllabus, explain a paragraph, or parse attached file..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-slate-50 text-xs text-slate-800 p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-500 font-sans font-medium"
            />

            <button
              type="submit"
              disabled={isLoading || (!query.trim() && !fileAttachedName)}
              className="bg-violet-600 hover:bg-violet-700 text-white p-3.5 rounded-xl transition-all cursor-pointer disabled:bg-slate-200 shrink-0"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
