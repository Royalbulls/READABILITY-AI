import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { Copy, Check, Download, Volume2, VolumeX, Sparkles, Shield, Share2, FileText, ThumbsUp, ThumbsDown, FolderPlus } from "lucide-react";
import SaveToProjectModal from "./SaveToProjectModal";

interface OutputDisplayProps {
  text: string;
  isLoading: boolean;
  user?: any;
  onSpeechStateChange?: (isSpeaking: boolean) => void;
}

export default function OutputDisplay({ text, isLoading, user, onSpeechStateChange }: OutputDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  
  // New reaction & portfolio states
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const isSpeechSupported = typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined" && !!window.speechSynthesis;

  // Stop reading if component unmounts or text changes
  useEffect(() => {
    return () => {
      if (isSpeechSupported) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {
          console.warn("Speech cancellation check:", e);
        }
      }
    };
  }, [isSpeechSupported]);

  useEffect(() => {
    if (isSpeechSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn("Speech reset check:", e);
      }
    }
    setIsSpeaking(false);
    if (onSpeechStateChange) onSpeechStateChange(false);
    
    // Reset reaction states on new output generation
    setLiked(false);
    setDisliked(false);
  }, [text, isLoading, isSpeechSupported]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Simplified_by_ReadabilityAI.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSavePDF = () => {
    if (!contentRef.current) return;
    const contentHtml = contentRef.current.innerHTML;

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Readability AI - Simplified Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            line-height: 1.6;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          header {
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .logo-area h1 {
            font-size: 24px;
            font-weight: 800;
            color: #4f46e5;
            margin: 0;
            letter-spacing: -0.025em;
            text-transform: uppercase;
          }
          .logo-area p {
            font-size: 11px;
            color: #64748b;
            margin: 4px 0 0 0;
          }
          .meta-area {
            text-align: right;
            font-size: 11px;
            color: #64748b;
            font-family: monospace;
          }
          .content-area {
            font-size: 14px;
          }
          .content-area h2 {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 8px;
            margin-top: 24px;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .content-area h3 {
            font-size: 15px;
            font-weight: 600;
            color: #1e293b;
            margin-top: 18px;
            margin-bottom: 8px;
          }
          .content-area p {
            margin-top: 0;
            margin-bottom: 16px;
            color: #334155;
          }
          .content-area ul {
            list-style-type: disc;
            padding-left: 20px;
            margin-bottom: 16px;
            color: #334155;
          }
          .content-area li {
            margin-bottom: 6px;
          }
          .content-area strong {
            color: #4f46e5;
            font-weight: 600;
          }
          .content-area em {
            color: #475569;
            font-style: italic;
          }
          .content-area code {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            background-color: #f8fafc;
            padding: 2px 6px;
            border-radius: 4px;
            color: #0f172a;
            border: 1px solid #e2e8f0;
          }
          footer {
            margin-top: 50px;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
            font-size: 10px;
            color: #94a3b8;
            text-align: center;
            font-family: monospace;
          }
          @media print {
            body { padding: 20px; }
            footer { position: fixed; bottom: 0; left: 0; right: 0; }
          }
        </style>
      </head>
      <body>
        <header>
          <div class="logo-area">
            <h1>READABILITY AI <span style="font-weight: 400; font-size: 12px; color: #64748b; margin-left: 5px;">v2.5</span></h1>
            <p>Clarity and simplification report</p>
          </div>
          <div class="meta-area">
            <div>Date: ${new Date().toLocaleDateString()}</div>
            <div>Engine: Mr. Kilvish Active</div>
          </div>
        </header>
        <div class="content-area">
          ${contentHtml}
        </div>
        <footer>
          &copy; ${new Date().getFullYear()} READABILITY AI. ALL RIGHTS OF CLARITY PRESERVED.
        </footer>
      </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(fullHtml);
      doc.close();

      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    } else {
      document.body.removeChild(iframe);
    }
  };

  const handleSpeech = () => {
    if (!isSpeechSupported) return;

    if (isSpeaking) {
       try {
         window.speechSynthesis.cancel();
       } catch (e) {
         console.warn("Speech pause cancellation:", e);
       }
       setIsSpeaking(false);
       if (onSpeechStateChange) onSpeechStateChange(false);
       return;
    }

    if (!text) return;

    try {
      // Cancel previous playback to prevent overlapping
      window.speechSynthesis.cancel();

      // Clean text of markdown characters before speaking for smoother reading
      const cleanText = text
        .replace(/[#*`~_]/g, "") // Remove markdown syntax
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // Keep link text, discard urls

      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Attempt to select a deeper, tech-vibe voice if available
      const voices = window.speechSynthesis.getVoices();
      const optimalVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Male")));
      if (optimalVoice) {
        utterance.voice = optimalVoice;
      }
      
      utterance.rate = 1.05; // Slightly faster for efficiency
      utterance.pitch = 0.95; // Slightly lower pitch for Mr. Kilvish's deep authority

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onSpeechStateChange) onSpeechStateChange(false);
      };

      utterance.onerror = (e) => {
        if (e.error !== "interrupted") {
          console.warn("Speech utterance event notification:", e.error || e);
        }
        setIsSpeaking(false);
        if (onSpeechStateChange) onSpeechStateChange(false);
      };

      setSpeechUtterance(utterance);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      if (onSpeechStateChange) onSpeechStateChange(true);
    } catch (err) {
      console.warn("Speech synthesis initial execution notice:", err);
      setIsSpeaking(false);
      if (onSpeechStateChange) onSpeechStateChange(false);
    }
  };

  // Render when loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[350px] bg-slate-50 rounded-2xl border border-dashed border-slate-200 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[bounce_2.5s_infinite]" />

        <div className="z-10 flex flex-col items-center text-center max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white mb-4 animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="font-display font-bold text-slate-900 text-base tracking-wide uppercase">
            DECODING JARGON
          </h3>
          <p className="text-slate-500 text-xs mt-2 leading-relaxed font-sans">
            Banish the noise, synthesize the facts. Mr. Kilvish is analyzing the data structures and formulating optimal readability.
          </p>

          <div className="w-full bg-slate-200 h-1 rounded-full mt-6 overflow-hidden">
            <div className="bg-slate-900 h-full w-full rounded-full animate-[shimmer_1.5s_infinite] origin-left scale-x-50" />
          </div>
        </div>
      </div>
    );
  }

  // Render when empty state
  if (!text) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[350px] bg-white rounded-2xl border border-slate-200 text-center relative shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
          <Shield className="w-7 h-7" />
        </div>
        <h3 className="font-display font-bold text-slate-900 text-base">
          Readability Output
        </h3>
        <p className="text-slate-500 text-xs mt-2 max-w-sm leading-relaxed">
          Provide complex legal text, academic papers, messy notes, or medical records on the left panel, then trigger simplification.
        </p>
        <div className="mt-4 px-3 py-1.5 rounded bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600 font-semibold uppercase tracking-widest">
          STANDBY: Awaiting Jargon Stream
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
      {/* Control Actions Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
            Simplified Output
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Read Aloud Button */}
          {isSpeechSupported ? (
            <button
              type="button"
              onClick={handleSpeech}
              className={`p-2 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                isSpeaking
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100"
                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
              title={isSpeaking ? "Stop narrative" : "Narrate with Mr. Kilvish voice"}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-indigo-600" />
                  <span>Mute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>Listen</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="p-2 rounded-lg border border-slate-100 bg-slate-50 text-slate-400 text-xs font-mono font-semibold flex items-center gap-1.5 opacity-60 cursor-not-allowed"
              title="Speech synthesis is not supported on this browser or environment."
            >
              <VolumeX className="w-4 h-4 text-slate-300" />
              <span>Listen (N/A)</span>
            </button>
          )}

          {/* Reaction Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 shrink-0">
            <button
              type="button"
              onClick={() => {
                setLiked(!liked);
                if (!liked) setDisliked(false);
              }}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                liked 
                  ? "bg-emerald-100/70 text-emerald-600 shadow-xs font-bold" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Like output"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setDisliked(!disliked);
                if (!disliked) setLiked(false);
              }}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                disliked 
                  ? "bg-rose-100/70 text-rose-600 shadow-xs font-bold" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Dislike output"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all duration-300"
            title="Copy to Clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          {/* Download Markdown Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all duration-300 cursor-pointer"
            title="Download as Markdown (.md)"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Save to PDF Button */}
          <button
            type="button"
            onClick={handleSavePDF}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
            title="Save as PDF"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span className="text-[10px] font-mono font-bold text-slate-500 hidden sm:inline">PDF</span>
          </button>

          {/* Save to Project Button */}
          {user && (
            <button
              type="button"
              onClick={() => setSaveModalOpen(true)}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent rounded-lg text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs shrink-0"
              title="Save to Project Portfolio"
            >
              <FolderPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Save Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Styled Output Render Container */}
      <div className="p-6 overflow-y-auto max-h-[600px] leading-relaxed font-sans text-slate-800 select-text bg-white">
        {/* Custom CSS overrides on standard Markdown output tags inside .markdown-body */}
        <div ref={contentRef} className="markdown-body space-y-5 text-sm font-sans [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:border-b [&_h2]:border-slate-100 [&_h2]:pb-2 [&_h2]:mt-6 [&_h2]:tracking-wide [&_h2]:uppercase [&_h3]:font-display [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-4 [&_p]:text-slate-700 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-slate-600 [&_strong]:text-blue-700 [&_strong]:font-semibold [&_em]:text-slate-800 [&_code]:font-mono [&_code]:text-xs [&_code]:bg-slate-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-blue-800 [&_code]:border [&_code]:border-slate-150">
          <Markdown>{text}</Markdown>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50 text-[10px] font-mono text-slate-500 font-semibold">
        <span className="flex items-center gap-1">
          <Share2 className="w-3.5 h-3.5 text-slate-400" />
          Format: Markdown Source
        </span>
        <span>Verified by Kilvish Algorithmic Engine</span>
      </div>

      {/* Save to Project Modal Overlay */}
      {user && (
        <SaveToProjectModal
          isOpen={saveModalOpen}
          onClose={() => setSaveModalOpen(false)}
          userId={user.uid}
          contentToSave={text}
          defaultCategory="Simplifier"
          defaultTitle="Clarity Summary Log"
        />
      )}
    </div>
  );
}
