import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import { Copy, Check, Download, Volume2, VolumeX, Sparkles, Shield, Share2 } from "lucide-react";

interface OutputDisplayProps {
  text: string;
  isLoading: boolean;
  onSpeechStateChange?: (isSpeaking: boolean) => void;
}

export default function OutputDisplay({ text, isLoading, onSpeechStateChange }: OutputDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Stop reading if component unmounts or text changes
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (onSpeechStateChange) onSpeechStateChange(false);
  }, [text]);

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

  const handleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (onSpeechStateChange) onSpeechStateChange(false);
      return;
    }

    if (!text) return;

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

    utterance.onerror = () => {
      setIsSpeaking(false);
      if (onSpeechStateChange) onSpeechStateChange(false);
    };

    setSpeechUtterance(utterance);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    if (onSpeechStateChange) onSpeechStateChange(true);
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
          <button
            type="button"
            onClick={handleSpeech}
            className={`p-2 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all duration-300 ${
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
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all duration-300"
            title="Download as Markdown (.md)"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Styled Output Render Container */}
      <div className="p-6 overflow-y-auto max-h-[600px] leading-relaxed font-sans text-slate-800 select-text bg-white">
        {/* Custom CSS overrides on standard Markdown output tags inside .markdown-body */}
        <div className="markdown-body space-y-5 text-sm font-sans [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:border-b [&_h2]:border-slate-100 [&_h2]:pb-2 [&_h2]:mt-6 [&_h2]:tracking-wide [&_h2]:uppercase [&_h3]:font-display [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-4 [&_p]:text-slate-700 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-slate-600 [&_strong]:text-blue-700 [&_strong]:font-semibold [&_em]:text-slate-800 [&_code]:font-mono [&_code]:text-xs [&_code]:bg-slate-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-blue-800 [&_code]:border [&_code]:border-slate-150">
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
    </div>
  );
}
