import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Copy, 
  Check, 
  Download, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Shield, 
  Share2, 
  FileDown, 
  Printer, 
  FileCode,
  AlertTriangle,
  Lightbulb,
  Info,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  FileText,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Terminal,
  BookOpen,
  Award,
  Trophy,
  BookMarked,
  HelpCircle,
  ArrowRight,
  Eye,
  Activity,
  Cpu,
  Star,
  Play,
  Pause,
  Sliders,
  Zap
} from "lucide-react";
import { OutputLanguage } from "../types";

// High-fidelity vector QR Code generator helper
const QRCodeSVG = () => (
  <svg width="68" height="68" viewBox="0 0 100 100" className="text-slate-900 shrink-0">
    <path d="M5,5 L25,5 L25,25 L5,25 Z M5,12 L5,5 L12,5" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <path d="M75,5 L95,5 L95,25 L75,25 Z M95,12 L95,5 L88,5" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <path d="M5,75 L25,75 L25,95 L5,95 Z M5,88 L5,95 L12,95" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <rect x="9" y="9" width="8" height="8" fill="currentColor" />
    <rect x="79" y="9" width="8" height="8" fill="currentColor" />
    <rect x="9" y="79" width="8" height="8" fill="currentColor" />
    <rect x="35" y="10" width="5" height="5" fill="currentColor" opacity="0.8" />
    <rect x="45" y="15" width="10" height="5" fill="currentColor" opacity="0.9" />
    <rect x="60" y="5" width="5" height="15" fill="currentColor" opacity="0.75" />
    <rect x="35" y="25" width="15" height="5" fill="currentColor" opacity="0.85" />
    <rect x="55" y="25" width="5" height="5" fill="currentColor" opacity="0.9" />
    <rect x="5" y="35" width="15" height="5" fill="currentColor" opacity="0.8" />
    <rect x="25" y="35" width="10" height="10" fill="currentColor" opacity="0.7" />
    <rect x="40" y="35" width="5" height="5" fill="currentColor" opacity="0.9" />
    <rect x="50" y="40" width="10" height="10" fill="currentColor" opacity="0.85" />
    <rect x="65" y="35" width="15" height="5" fill="currentColor" opacity="0.75" />
    <rect x="15" y="50" width="10" height="5" fill="currentColor" opacity="0.85" />
    <rect x="30" y="50" width="5" height="15" fill="currentColor" opacity="0.9" />
    <rect x="40" y="55" width="15" height="5" fill="currentColor" opacity="0.8" />
    <rect x="60" y="50" width="5" height="5" fill="currentColor" opacity="0.7" />
    <rect x="70" y="45" width="10" height="15" fill="currentColor" opacity="0.85" />
    <rect x="85" y="45" width="10" height="10" fill="currentColor" opacity="0.9" />
    <rect x="35" y="75" width="10" height="5" fill="currentColor" opacity="0.8" />
    <rect x="50" y="70" width="5" height="10" fill="currentColor" opacity="0.75" />
    <rect x="60" y="75" width="15" height="15" fill="currentColor" opacity="0.9" />
    <rect x="80" y="75" width="5" height="10" fill="currentColor" opacity="0.85" />
    <rect x="35" y="85" width="20" height="5" fill="currentColor" opacity="0.8" />
    <rect x="80" y="90" width="15" height="5" fill="currentColor" opacity="0.75" />
  </svg>
);

// Heraldic crest shield logo helper
const AcademyLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`relative ${className} shrink-0`}>
    <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5L85 20V50C85 71.54 70.08 91.13 50 95C29.92 91.13 15 71.54 15 50V20 L50 5Z" fill="currentColor"/>
      <path d="M50 11L79 23V47C79 63.5 68.5 79.5 50 84C31.5 79.5 21 63.5 21 47V23L50 11Z" fill="#ffffff"/>
      <path d="M50 18L69 26V47C69 58.5 61 69 50 72C39 69 31 58.5 31 47V26L50 18Z" fill="currentColor"/>
      <path d="M50 30 L64 36 L50 42 L36 36 Z" fill="#ffffff" />
      <path d="M42 39.5 L42 47.5 C42 50 45 52 50 52 C55 52 58 50 58 47.5 L58 39.5" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M64 36 L64 48 L61 49" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  </div>
);

// Helper to heal Hindi OCR and spacing errors dynamically
function healHindiOCR(str: string): string {
  if (!str) return "";
  let healed = str;

  // 1. Remove spaces between Devanagari characters and Devanagari non-spacing/spacing matras or halant
  healed = healed.replace(/([\u0900-\u097F])\s+([\u0901-\u0903\u093c\u093e-\u094d\u0951-\u0957\u0962-\u0963])/g, "$1$2");
  
  // 2. Remove spaces after a halant (्) inside Devanagari character streams
  healed = healed.replace(/([\u0900-\u097F]\u094d)\s+([\u0900-\u097F])/g, "$1$2");
  
  // 3. Remove spaces before punctuation/quotes/brackets inside Hindi texts
  healed = healed.replace(/([\u0900-\u097F])\s+([।॥?!=,:;])/g, "$1$2");

  // 4. Heal sequences of single Devanagari characters separated by single spaces (e.g., "ब द ला व" -> "बदलाव")
  for (let i = 0; i < 5; i++) {
    healed = healed.replace(/((?:^|[^a-zA-Z0-9\u0900-\u097F])[\u0900-\u097F][\u0901-\u0903\u093c\u093e-\u094d\u0951-\u0957\u0962-\u0963]?)\s+([\u0900-\u097F][\u0901-\u0903\u093c\u093e-\u094d\u0951-\u0957\u0962-\u0963]?(?=$|[^a-zA-Z0-9\u0900-\u097F]))/g, (match, p1, p2) => {
      return p1 + p2;
    });
  }

  // 5. Specific common Hindi OCR errors
  healed = healed.replace(/दे\s+वि\s+याँ/g, "देवियाँ");
  healed = healed.replace(/कां\s+त/g, "कांत");
  healed = healed.replace(/की\s+ल/g, "कील");
  healed = healed.replace(/वि\s+ष/g, "विष");

  return healed;
}

// Helper to recursively extract plain text from React elements (for custom Markdown components pattern matching)
const extractText = (node: any): string => {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node.props && node.props.children) return extractText(node.props.children);
  return "";
};

interface OutputDisplayProps {
  text: string;
  isLoading: boolean;
  language?: OutputLanguage;
  onSpeechStateChange?: (isSpeaking: boolean) => void;
  currentCourseId?: string | null;
  rating?: number;
  onRate?: (rating: number) => void;
}

export default function OutputDisplay({ text, isLoading, language = "en", onSpeechStateChange, currentCourseId, rating, onRate }: OutputDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Premium Gemini TTS states & refs
  const [ttsEngine, setTtsEngine] = useState<"gemini" | "webspeech">("gemini");
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [premiumVoice, setPremiumVoice] = useState<string>("Zephyr"); // Puck, Charon, Kore, Fenrir, Zephyr
  const premiumAudioCtxRef = useRef<AudioContext | null>(null);
  const premiumAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Stop narration if the component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (premiumAudioSourceRef.current) {
        try {
          premiumAudioSourceRef.current.stop();
        } catch (e) {}
      }
      if (premiumAudioCtxRef.current) {
        try {
          premiumAudioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  // Typewriter animation states
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(0.95);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Robustly load and matching voices available in the client browser
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        // Auto-select optimal voice: strongly prioritize Hindi India (hi_IN / hi-IN)
        let optimal = voices.find(v => v.lang.replace("_", "-").toLowerCase() === "hi-in" || v.lang.toLowerCase().startsWith("hi") || v.name.toLowerCase().includes("hindi") || v.name.toLowerCase().includes("india"));
        if (!optimal) {
          optimal = voices.find(v => v.name.toLowerCase().includes("aura"));
        }
        if (!optimal) {
          if (language === "hinglish") {
            optimal = voices.find(v => (v.lang.includes("IN") && v.lang.startsWith("en")) || v.lang.startsWith("hi"));
          }
          if (!optimal) {
            optimal = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Male") || v.name.includes("India")));
          }
          if (!optimal && voices.length > 0) {
            optimal = voices.find(v => v.lang.startsWith("en"));
          }
          if (!optimal && voices.length > 0) {
            optimal = voices[0];
          }
        }
        setSelectedVoice(optimal || null);
      }
    };

    updateVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [language]);

  // Digital courseware verification states
  const [issuedCode, setIssuedCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("success");

  // Gamified XP learning states
  const [userXp, setUserXp] = useState(100);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [chaptersCount, setChaptersCount] = useState(0);

  // Generate unique code when text changes
  useEffect(() => {
    if (text) {
      const charSum = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const simpleHash = Math.abs(charSum) % 10000;
      const codeString = `MKA-001-${simpleHash.toString().padStart(4, "7")}`;
      setIssuedCode(codeString);
      setEnteredCode("");
      setVerificationStatus("success");

      // Dynamically count H1 chapters to adjust gamification progress
      const h1Count = (text.match(/^#\s+.+/gm) || []).length;
      setChaptersCount(h1Count || 1);
      setCompletedChapters([]);
      setUserXp(100);
    }
  }, [text]);

  // Typewriter animation effect
  useEffect(() => {
    if (isLoading) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    if (!text) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    // Determine typewriter parameters based on text length to guarantee a fast but engaging animation
    const totalChars = text.length;
    const totalDuration = 2000; // Target total animation time of 2.0 seconds
    const intervalMs = 15; // Fast interval for fluid appearance
    const totalSteps = totalDuration / intervalMs; // ~133 steps
    const charsPerStep = Math.max(1, Math.ceil(totalChars / totalSteps));

    setDisplayedText("");
    setIsTyping(true);

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      currentIndex += charsPerStep;
      if (currentIndex >= totalChars) {
        setDisplayedText(text);
        setIsTyping(false);
        clearInterval(intervalId);
      } else {
        setDisplayedText(text.slice(0, currentIndex));
      }
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [text, isLoading]);

  const skipTypewriter = () => {
    setDisplayedText(text);
    setIsTyping(false);
  };

  const handleToggleChapter = (chapterTitle: string) => {
    setCompletedChapters((prev) => {
      const isCompleted = prev.includes(chapterTitle);
      if (isCompleted) {
        setUserXp((xp) => Math.max(100, xp - 100));
        return prev.filter((title) => title !== chapterTitle);
      } else {
        setUserXp((xp) => xp + 100);
        return [...prev, chapterTitle];
      }
    });
  };

  const handleVerifyCode = () => {
    if (enteredCode.trim().toUpperCase() === issuedCode) {
      setVerificationStatus("success");
    } else {
      setVerificationStatus("error");
    }
  };

  const handleAutofillCode = () => {
    setEnteredCode(issuedCode);
    setVerificationStatus("success");
  };

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

  const generateBrandedHTMLContent = (isForPrint: boolean) => {
    const markdownContent = document.querySelector(".markdown-body")?.innerHTML || "";
    
    const isHindi = language === "hi";
    const isHinglish = language === "hinglish";

    let labelTitle = "Mr. Kilvish Academy - Digital Courseware";
    let labelPrintBtn = "Print Courseware";
    let labelCloseBtn = "Close Window";

    if (isHindi) {
      labelTitle = "मिस्टर किल्विष एकेडमी - डिजिटल पाठ्यक्रम";
      labelPrintBtn = "पाठ्यक्रम प्रिंट करें";
      labelCloseBtn = "खिड़की बंद करें";
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${labelTitle}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@1,500;1,600&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4;
              margin: 20mm 15mm 25mm 15mm;
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              color: #0f172a;
              line-height: 1.65;
              font-size: 10.5pt;
              margin: 0;
              padding: ${isForPrint ? '0' : '40px max(20px, 5%)'};
              background-color: ${isForPrint ? '#ffffff' : '#f8fafc'};
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .page-container {
              max-width: 800px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: ${isForPrint ? '0' : '40px'};
              border-radius: ${isForPrint ? '0' : '16px'};
              border: ${isForPrint ? 'none' : '1px solid #e2e8f0'};
              box-shadow: ${isForPrint ? 'none' : '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)'};
              position: relative;
            }
            
            /* Premium Cover Page Styles */
            .cover-page {
              display: block;
              min-height: 250mm;
              height: 100%;
              padding: 40px;
              box-sizing: border-box;
              border: 10px double #0f172a;
              background-color: #ffffff;
              page-break-after: always;
              margin-bottom: 50px;
              text-align: center;
              position: relative;
            }
            .cover-academy-name {
              font-size: 26pt;
              font-weight: 800;
              letter-spacing: 0.1em;
              color: #0f172a;
              margin-top: 30px;
              text-transform: uppercase;
            }
            .cover-slogan {
              font-family: 'Playfair Display', Georgia, serif;
              font-style: italic;
              font-size: 13pt;
              color: #64748b;
              margin-top: 10px;
              margin-bottom: 40px;
            }
            .cover-crest {
              margin: 40px auto;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 130px;
              height: 130px;
              background: #0f172a;
              border-radius: 50%;
              box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.2);
            }
            .cover-crest svg {
              width: 75px;
              height: 75px;
            }
            .cover-title-group {
              margin: 50px 0;
            }
            .cover-main-title {
              font-size: 28pt;
              font-weight: 800;
              line-height: 1.2;
              color: #0f172a;
              text-transform: uppercase;
              margin: 0;
              letter-spacing: -0.01em;
            }
            .cover-subtitle {
              font-size: 12pt;
              font-weight: 600;
              color: #4f46e5;
              margin-top: 18px;
              letter-spacing: 0.05em;
              text-transform: uppercase;
            }
            .cover-meta-table {
              width: 320px;
              margin: 40px auto;
              border-collapse: collapse;
              font-size: 9.5pt;
            }
            .cover-meta-table td {
              border: none !important;
              padding: 6px 12px !important;
              background: transparent !important;
            }
            .cover-meta-label {
              font-family: 'JetBrains Mono', monospace;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
              text-align: left;
              width: 40%;
            }
            .cover-meta-value {
              font-weight: 700;
              color: #0f172a;
              text-align: right;
            }
            .cover-security-badge {
              border: 1px dashed #cbd5e1;
              padding: 12px;
              border-radius: 12px;
              background-color: #f8fafc;
              display: inline-block;
              font-family: 'JetBrains Mono', monospace;
              font-size: 8pt;
              color: #0f172a;
              margin-top: 20px;
            }
            .cover-footer {
              font-size: 8pt;
              color: #94a3b8;
              font-weight: 500;
              margin-top: 60px;
            }

            /* Academy Premium Header Layout */
            .academy-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #0f172a;
              padding-bottom: 18px;
              margin-bottom: 28px;
              gap: 20px;
              page-break-before: always;
            }
            .header-left {
              display: flex;
              align-items: center;
              gap: 16px;
              flex: 1;
            }
            .academy-logo-svg {
              width: 55px;
              height: 55px;
              flex-shrink: 0;
            }
            .academy-title-group {
              display: flex;
              flex-direction: column;
            }
            .academy-main-title {
              font-size: 16pt;
              font-weight: 800;
              letter-spacing: -0.01em;
              color: #0f172a;
              line-height: 1.1;
              text-transform: uppercase;
            }
            .academy-slogan {
              font-family: 'Playfair Display', Georgia, serif;
              font-style: italic;
              font-size: 10pt;
              color: #475569;
              margin-top: 4px;
            }
            .course-meta-tags {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-top: 8px;
              font-family: 'JetBrains Mono', monospace;
              font-size: 7.5pt;
              color: #64748b;
              font-weight: 600;
              text-transform: uppercase;
            }
            .meta-tag strong {
              color: #0f172a;
              font-weight: 700;
            }
            .meta-separator {
              color: #cbd5e1;
            }
            .header-right {
              display: flex;
              align-items: center;
              gap: 15px;
              flex-shrink: 0;
            }
            .qr-block {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border: 1px solid #e2e8f0;
              padding: 6px;
              border-radius: 8px;
              background-color: #f8fafc;
              width: 65px;
              box-sizing: border-box;
            }
            .qr-svg {
              width: 42px;
              height: 42px;
            }
            .qr-label {
              font-family: 'JetBrains Mono', monospace;
              font-size: 4.8pt;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
              margin-top: 4px;
              text-align: center;
              white-space: nowrap;
            }
            .access-code-block {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              border: 1px solid #e2e8f0;
              padding: 6px 10px;
              border-radius: 10px;
              background-color: #f8fafc;
              max-width: 140px;
              box-sizing: border-box;
            }
            .access-code-label {
              font-family: 'JetBrains Mono', monospace;
              font-size: 5.5pt;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
              margin-bottom: 3px;
              white-space: nowrap;
            }
            .access-code-badge {
              font-family: 'JetBrains Mono', monospace;
              font-size: 8pt;
              font-weight: 700;
              color: #4f46e5;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              background-color: #ffffff;
              border: 1px solid #e2e8f0;
              padding: 2px 6px;
              border-radius: 4px;
              box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
            }
            
            /* Main Content Styles */
            .content {
              padding-bottom: 30px;
            }
            h1, h2, h3, h4 {
              color: #0f172a;
              font-weight: 700;
              margin-top: 24px;
              margin-bottom: 10px;
              page-break-after: avoid;
            }
            h1 { 
              font-size: 18pt; 
              margin-top: 0; 
              border-bottom: 1.5px solid #0f172a; 
              padding-bottom: 8px; 
              page-break-before: always;
            }
            h2 { 
              font-size: 13pt; 
              border-bottom: 1px solid #f1f5f9; 
              padding-bottom: 6px; 
              text-transform: uppercase;
              letter-spacing: 0.02em;
              color: #1e293b;
            }
            h3 { 
              font-size: 11pt; 
              color: #334155;
            }
            p {
              margin-top: 0;
              margin-bottom: 14px;
              text-align: justify;
              color: #334155;
              font-size: 10pt;
            }
            strong {
              color: #4f46e5;
              font-weight: 700;
            }
            ul, ol {
              margin-top: 0;
              margin-bottom: 14px;
              padding-left: 20px;
            }
            li {
              margin-bottom: 6px;
              color: #334155;
              font-size: 10pt;
            }
            
            /* Tables rendering beautifully */
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 9pt;
            }
            th, td {
              border: 1px solid #e2e8f0;
              padding: 10px 12px;
              text-align: left;
            }
            th {
              background-color: #0f172a;
              color: #ffffff;
              font-weight: 700;
              text-transform: uppercase;
              font-size: 8pt;
              letter-spacing: 0.05em;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
            
            /* Professional Callout Styling inside Print PDF */
            blockquote {
              margin: 20px 0;
              padding: 15px 18px;
              background-color: #f8fafc;
              border-left: 4px solid #4f46e5;
              border-top: 1px solid #e2e8f0;
              border-right: 1px solid #e2e8f0;
              border-bottom: 1px solid #e2e8f0;
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
            }
            
            /* Professional Footer */
            .professional-footer {
              margin-top: 40px;
              border-top: 1.5px solid #0f172a;
              padding-top: 12px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-family: 'Inter', sans-serif;
              font-size: 8pt;
              color: #64748b;
              font-weight: 500;
            }
            .footer-pages {
              font-family: 'JetBrains Mono', monospace;
              font-size: 8pt;
              font-weight: 600;
              color: #475569;
            }
            
            /* Action bar on screen */
            .action-bar {
              display: ${isForPrint ? 'none' : 'flex'};
              justify-content: flex-end;
              gap: 10px;
              margin-bottom: 24px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 15px;
            }
            .btn {
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              font-weight: 700;
              padding: 8px 14px;
              border-radius: 6px;
              cursor: pointer;
              border: 1px solid #cbd5e1;
              background-color: #ffffff;
              color: #334155;
              transition: all 0.2s;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 5px;
            }
            .btn:hover {
              background-color: #f8fafc;
              border-color: #94a3b8;
              color: #0f172a;
            }
            .btn-primary {
              background-color: #0f172a;
              color: #ffffff;
              border-color: #0f172a;
            }
            .btn-primary:hover {
              background-color: #1e293b;
              color: #ffffff;
              border-color: #1e293b;
            }
            
            @media print {
              body {
                background-color: #ffffff;
                padding: 0 !important;
              }
              .page-container {
                padding: 0 !important;
                border: none !important;
                box-shadow: none !important;
              }
              .action-bar {
                display: none !important;
              }
              /* Footer at the bottom of the printed page */
              .professional-footer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
              }
            }
          </style>
        </head>
        <body>
          <!-- Premium Cover Page -->
          <div class="cover-page">
            <div style="border: 2px solid #0f172a; padding: 30px; height: calc(100% - 60px); display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; text-align: center;">
              <div>
                <div class="cover-academy-name">MR. KILVISH ACADEMY</div>
                <div class="cover-slogan">"Clarity is Power • Banish the Darkness"</div>
              </div>
              
              <div class="cover-crest">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 5L85 20V50C85 71.54 70.08 91.13 50 95C29.92 91.13 15 71.54 15 50V20 L50 5Z" fill="#ffffff"/>
                  <path d="M50 11L79 23V47C79 63.5 68.5 79.5 50 84C31.5 79.5 21 63.5 21 47V23L50 11Z" fill="#0f172a"/>
                  <path d="M50 18L69 26V47C69 58.5 61 69 50 72C39 69 31 58.5 31 47V26L50 18Z" fill="#ffffff"/>
                  <path d="M50 30 L64 36 L50 42 L36 36 Z" fill="#0f172a" />
                  <path d="M42 39.5 L42 47.5 C42 50 45 52 50 52 C55 52 58 50 58 47.5 L58 39.5" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round" />
                  <path d="M64 36 L64 48 L61 49" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
                </svg>
              </div>

              <div class="cover-title-group">
                <div style="font-family: 'JetBrains Mono', monospace; font-size: 9pt; font-weight: 700; color: #4f46e5; text-transform: uppercase; tracking: 0.15em; margin-bottom: 15px;">Sovereign Digital Study Book</div>
                <h1 class="cover-main-title">DE-JARGONIZED<br/>CURRICULUM MODULES</h1>
                <div style="width: 80px; height: 2px; background: #0f172a; margin: 25px auto;"></div>
                <div class="cover-subtitle">Mr. Kilvish Academy Premium Courseware</div>
              </div>

              <div>
                <table class="cover-meta-table">
                  <tr><td class="cover-meta-label">ACADEMY DEAN</td><td class="cover-meta-value">MR. KILVISH</td></tr>
                  <tr><td class="cover-meta-label">COURSE CODE</td><td class="cover-meta-value">MKA-001</td></tr>
                  <tr><td class="cover-meta-label">SYLLABUS ID</td><td class="cover-meta-value">BK-001</td></tr>
                  <tr><td class="cover-meta-label">VERSION</td><td class="cover-meta-value">v1.0 (Premium Release)</td></tr>
                </table>
                
                <div class="cover-security-badge">
                  <span style="color: #64748b; font-weight: 700;">CRYPTOGRAPHIC SIGNATURE:</span>
                  <span style="font-weight: bold; color: #4f46e5; margin-left: 5px;">${issuedCode} • SECURE</span>
                </div>
              </div>

              <div class="cover-footer">
                &copy; 2026 MR. KILVISH ACADEMY OF SCIENCES. ALL RIGHTS RESERVED. PRINTED COGNITIVE MEDIA.
              </div>
            </div>
          </div>

          <div class="page-container">
            <div class="action-bar">
              <button class="btn btn-primary" onclick="window.print()">${labelPrintBtn}</button>
              <button class="btn" onclick="window.close()">${labelCloseBtn}</button>
            </div>

            <!-- Premium Academy Header -->
            <div class="academy-header">
              <div class="header-left">
                <!-- SVG Crest Shield Logo -->
                <svg class="academy-logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 5L85 20V50C85 71.54 70.08 91.13 50 95C29.92 91.13 15 71.54 15 50V20 L50 5Z" fill="#0f172a"/>
                  <path d="M50 11L79 23V47C79 63.5 68.5 79.5 50 84C31.5 79.5 21 63.5 21 47V23L50 11Z" fill="#ffffff"/>
                  <path d="M50 18L69 26V47C69 58.5 61 69 50 72C39 69 31 58.5 31 47V26L50 18Z" fill="#0f172a"/>
                  <path d="M50 30 L64 36 L50 42 L36 36 Z" fill="#ffffff" />
                  <path d="M42 39.5 L42 47.5 C42 50 45 52 50 52 C55 52 58 50 58 47.5 L58 39.5" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round" />
                  <path d="M64 36 L64 48 L61 49" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" />
                </svg>
                <div class="academy-title-group">
                  <div class="academy-main-title">MR. KILVISH ACADEMY</div>
                  <div class="academy-slogan">"Clarity is Power"</div>
                  <div class="course-meta-tags">
                    <span class="meta-tag">Course Code: <strong>MKA-001</strong></span>
                    <span class="meta-separator">|</span>
                    <span class="meta-tag">Book ID: <strong>BK-001</strong></span>
                    <span class="meta-separator">|</span>
                    <span class="meta-tag">Version: <strong>v1.0</strong></span>
                  </div>
                </div>
              </div>
              
              <div class="header-right">
                <!-- QR Code Block -->
                <div class="qr-block">
                  <svg class="qr-svg" viewBox="0 0 100 100">
                    <path d="M5,5 L25,5 L25,25 L5,25 Z M5,12 L5,5 L12,5" stroke="#0f172a" stroke-width="2" fill="none" />
                    <path d="M75,5 L95,5 L95,25 L75,25 Z M95,12 L95,5 L88,5" stroke="#0f172a" stroke-width="2" fill="none" />
                    <path d="M5,75 L25,75 L25,95 L5,95 Z M5,88 L5,95 L12,95" stroke="#0f172a" stroke-width="2" fill="none" />
                    <rect x="9" y="9" width="8" height="8" fill="#0f172a" />
                    <rect x="79" y="9" width="8" height="8" fill="#0f172a" />
                    <rect x="9" y="79" width="8" height="8" fill="#0f172a" />
                    <rect x="35" y="10" width="5" height="5" fill="#0f172a" opacity="0.8" />
                    <rect x="45" y="15" width="10" height="5" fill="#0f172a" opacity="0.9" />
                    <rect x="60" y="5" width="5" height="15" fill="#0f172a" opacity="0.75" />
                    <rect x="35" y="25" width="15" height="5" fill="#0f172a" opacity="0.85" />
                    <rect x="55" y="25" width="5" height="5" fill="#0f172a" opacity="0.9" />
                    <rect x="5" y="35" width="15" height="5" fill="#0f172a" opacity="0.8" />
                    <rect x="25" y="35" width="10" height="10" fill="#0f172a" opacity="0.7" />
                    <rect x="40" y="35" width="5" height="5" fill="#0f172a" opacity="0.9" />
                    <rect x="50" y="40" width="10" height="10" fill="#0f172a" opacity="0.85" />
                    <rect x="65" y="35" width="15" height="5" fill="#0f172a" opacity="0.75" />
                    <rect x="15" y="50" width="10" height="5" fill="#0f172a" opacity="0.85" />
                    <rect x="30" y="50" width="5" height="15" fill="#0f172a" opacity="0.9" />
                    <rect x="40" y="55" width="15" height="5" fill="#0f172a" opacity="0.8" />
                    <rect x="60" y="50" width="5" height="5" fill="#0f172a" opacity="0.7" />
                    <rect x="70" y="45" width="10" height="15" fill="#0f172a" opacity="0.85" />
                    <rect x="85" y="45" width="10" height="10" fill="#0f172a" opacity="0.9" />
                    <rect x="35" y="75" width="10" height="5" fill="#0f172a" opacity="0.8" />
                    <rect x="50" y="70" width="5" height="10" fill="#0f172a" opacity="0.75" />
                    <rect x="60" y="75" width="15" height="15" fill="#0f172a" opacity="0.9" />
                    <rect x="80" y="75" width="5" height="10" fill="#0f172a" opacity="0.85" />
                    <rect x="35" y="85" width="20" height="5" fill="#0f172a" opacity="0.8" />
                    <rect x="80" y="90" width="15" height="5" fill="#0f172a" opacity="0.75" />
                  </svg>
                  <div class="qr-label">Scan to Read Online</div>
                </div>
                
                <!-- Access Code Block -->
                <div class="access-code-block">
                  <div class="access-code-label">Enter Access Code in App</div>
                  <div class="access-code-badge">${issuedCode || "MKA-001-ACTIVE"}</div>
                </div>
              </div>
            </div>
            
            <!-- Document Body Content -->
            <div class="content">
              ${markdownContent}

              <!-- MKA Companion Learning Grid Placeholder inside exported textbook -->
              <div style="margin-top: 50px; border-top: 2px solid #0f172a; padding-top: 30px;">
                <h3 style="font-size: 11pt; text-transform: uppercase; font-weight: 800; color: #0f172a; tracking: 0.05em; margin-bottom: 5px;">MKA Companion Learning Grid</h3>
                <p style="font-size: 8.5pt; color: #64748b; margin-bottom: 20px;">Scan these codes to unlock interactive training dimensions for this module.</p>
                
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                  <div style="border: 1px solid #e2e8f0; padding: 12px; border-radius: 12px; text-align: center; background: #f8fafc;">
                    <div style="font-size: 8pt; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 8px;">🎬 Video Class</div>
                    <div style="margin: 5px auto; width: 60px; height: 60px; border: 1px solid #cbd5e1; background: #ffffff; border-radius: 6px; padding: 4px; box-sizing: border-box;">
                      <svg viewBox="0 0 100 100" style="width:100%; height:100%; text-align:center;"><path d="M10,10 H90 V90 H10 Z" fill="none" stroke="#0f172a" stroke-width="4"/><rect x="25" y="25" width="20" height="20" fill="#0f172a"/><rect x="55" y="25" width="20" height="20" fill="#0f172a"/><rect x="25" y="55" width="20" height="20" fill="#0f172a"/><rect x="55" y="55" width="10" height="10" fill="#0f172a"/></svg>
                    </div>
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 5.5pt; color: #64748b; margin-top: 6px;">SCAN FOR MEDIA</div>
                  </div>
                  
                  <div style="border: 1px solid #e2e8f0; padding: 12px; border-radius: 12px; text-align: center; background: #f8fafc;">
                    <div style="font-size: 8pt; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 8px;">🎧 Audio Pod</div>
                    <div style="margin: 5px auto; width: 60px; height: 60px; border: 1px solid #cbd5e1; background: #ffffff; border-radius: 6px; padding: 4px; box-sizing: border-box;">
                      <svg viewBox="0 0 100 100" style="width:100%; height:100%; text-align:center;"><path d="M10,10 H90 V90 H10 Z" fill="none" stroke="#0f172a" stroke-width="4"/><rect x="25" y="25" width="20" height="20" fill="#0f172a"/><rect x="55" y="25" width="20" height="20" fill="#0f172a"/><rect x="25" y="55" width="20" height="20" fill="#0f172a"/><rect x="55" y="55" width="10" height="10" fill="#0f172a"/></svg>
                    </div>
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 5.5pt; color: #64748b; margin-top: 6px;">SCAN FOR AUDIO</div>
                  </div>
                  
                  <div style="border: 1px solid #e2e8f0; padding: 12px; border-radius: 12px; text-align: center; background: #f8fafc;">
                    <div style="font-size: 8pt; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 8px;">📝 Test/Quiz</div>
                    <div style="margin: 5px auto; width: 60px; height: 60px; border: 1px solid #cbd5e1; background: #ffffff; border-radius: 6px; padding: 4px; box-sizing: border-box;">
                      <svg viewBox="0 0 100 100" style="width:100%; height:100%; text-align:center;"><path d="M10,10 H90 V90 H10 Z" fill="none" stroke="#0f172a" stroke-width="4"/><rect x="25" y="25" width="20" height="20" fill="#0f172a"/><rect x="55" y="25" width="20" height="20" fill="#0f172a"/><rect x="25" y="55" width="20" height="20" fill="#0f172a"/><rect x="55" y="55" width="10" height="10" fill="#0f172a"/></svg>
                    </div>
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 5.5pt; color: #64748b; margin-top: 6px;">SCAN FOR STUDY</div>
                  </div>
                  
                  <div style="border: 1px solid #e2e8f0; padding: 12px; border-radius: 12px; text-align: center; background: #f8fafc;">
                    <div style="font-size: 8pt; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 8px;">🤖 Sovereign AI</div>
                    <div style="margin: 5px auto; width: 60px; height: 60px; border: 1px solid #cbd5e1; background: #ffffff; border-radius: 6px; padding: 4px; box-sizing: border-box;">
                      <svg viewBox="0 0 100 100" style="width:100%; height:100%; text-align:center;"><path d="M10,10 H90 V90 H10 Z" fill="none" stroke="#0f172a" stroke-width="4"/><rect x="25" y="25" width="20" height="20" fill="#0f172a"/><rect x="55" y="25" width="20" height="20" fill="#0f172a"/><rect x="25" y="55" width="20" height="20" fill="#0f172a"/><rect x="55" y="55" width="10" height="10" fill="#0f172a"/></svg>
                    </div>
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 5.5pt; color: #64748b; margin-top: 6px;">SCAN FOR TUTOR</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Professional Academy Footer -->
            <div class="professional-footer">
              <span>&copy; 2026 Mr. Kilvish Academy. All Rights Reserved.</span>
              <span class="footer-pages">Page 1 of 1</span>
            </div>
          </div>
          
          ${isForPrint ? `
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
          ` : ''}
        </body>
      </html>
    `;
  };

  const handleDownloadHTML = () => {
    const htmlContent = generateBrandedHTMLContent(false);
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Simplified_by_ReadabilityAI.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2); // 170mm

      // Metadata & Styling Colors
      const primaryColor = [15, 23, 42]; // Slate-900: #0f172a
      const accentColor = [79, 70, 229]; // Indigo-600: #4f46e5
      const secondaryColor = [51, 65, 85]; // Slate-700: #334155
      const bodyColor = [30, 41, 59]; // Slate-800: #1e293b
      const lightBg = [248, 250, 252]; // Slate-50: #f8fafc
      const borderColor = [226, 232, 240]; // Slate-200: #e2e8f0

      let currentPage = 1;

      // Helper function to draw header/footer on a page
      const drawHeaderFooter = (pageNum: number) => {
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        // Top accent line
        doc.rect(0, 0, pageWidth, 4, "F");

        // Running Header
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // Slate-400
        doc.text("MR. KILVISH CLARITY HUB", margin, 12);
        
        doc.setFont("Helvetica", "normal");
        doc.text("SIMPLIFIED LEARNING PLATFORM", pageWidth - margin - 52, 12);

        // Header separator line
        doc.setDrawColor(241, 245, 249); // Slate-100
        doc.setLineWidth(0.3);
        doc.line(margin, 15, pageWidth - margin, 15);

        // Running Footer
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // Slate-400
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 12);
        doc.text(`Page ${pageNum}`, pageWidth - margin - 15, pageHeight - 12);
        
        // Footer separator line
        doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
      };

      // Let's create a cover or introduction header section at the top of page 1!
      drawHeaderFooter(currentPage);

      // Document Title/Banner
      let y = 28;
      
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.setLineWidth(0.5);
      // Beautiful rounded-like title box
      doc.rect(margin, y, contentWidth, 24, "F");
      doc.rect(margin, y, contentWidth, 24, "S");

      // Left vertical accent line inside the box
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(margin + 1, y + 1, 3, 22, "F");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("CLARITY COURSEWARE REPORT", margin + 8, y + 9);

      doc.setFont("Helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text("Demystified & Jargon-Free Textbook Block", margin + 8, y + 15);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`Access Key Issued: ${issuedCode || "ACTIVE-KEY"}`, margin + 8, y + 20);

      y += 34; // Shift y below the title block

      // Parse and print the markdown content
      const lines = text.split("\n");
      
      const checkNewPage = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - 22) {
          doc.addPage();
          currentPage++;
          drawHeaderFooter(currentPage);
          y = 25; // Reset y for new page
        }
      };

      lines.forEach((line) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
          // Empty line: add a small paragraph space
          y += 4;
          return;
        }

        // 1. Heading 1: e.g. "# Heading 1"
        if (trimmedLine.startsWith("# ")) {
          const headingText = trimmedLine.replace("# ", "").trim();
          checkNewPage(18);
          
          y += 4;
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(15);
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          const splitHeading = doc.splitTextToSize(headingText, contentWidth);
          splitHeading.forEach((subLine: string) => {
            doc.text(subLine, margin, y);
            y += 5.5;
          });
          
          // Underline
          y += 1;
          doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
          doc.setLineWidth(0.6);
          doc.line(margin, y, margin + 45, y);
          y += 6;
        }
        // 2. Heading 2: e.g. "## Heading 2"
        else if (trimmedLine.startsWith("## ")) {
          const headingText = trimmedLine.replace("## ", "").trim();
          checkNewPage(14);

          y += 4;
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
          const splitHeading = doc.splitTextToSize(headingText, contentWidth);
          splitHeading.forEach((subLine: string) => {
            doc.text(subLine, margin, y);
            y += 5;
          });
          y += 3;
        }
        // 3. Heading 3: e.g. "### Heading 3"
        else if (trimmedLine.startsWith("### ")) {
          const headingText = trimmedLine.replace("### ", "").trim();
          checkNewPage(12);

          y += 3;
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          const splitHeading = doc.splitTextToSize(headingText, contentWidth);
          splitHeading.forEach((subLine: string) => {
            doc.text(subLine, margin, y);
            y += 4.5;
          });
          y += 2.5;
        }
        // 4. Bullet list items: e.g. "- Item" or "* Item"
        else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
          const rawItemText = trimmedLine.substring(2).trim();
          
          // Strip simple formatting markdown like `**` or `*` or `__` or `_`
          const cleanedItemText = rawItemText
            .replace(/\*\*/g, "")
            .replace(/__/g, "")
            .replace(/\*/g, "")
            .replace(/_/g, "");

          doc.setFont("Helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);

          const splitText = doc.splitTextToSize(cleanedItemText, contentWidth - 8);
          
          splitText.forEach((subLine: string, index: number) => {
            checkNewPage(6);
            if (index === 0) {
              // Draw a bullet dot
              doc.setFont("Helvetica", "bold");
              doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
              doc.text("\u2022", margin + 2, y);
              
              doc.setFont("Helvetica", "normal");
              doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
              doc.text(subLine, margin + 6, y);
            } else {
              doc.text(subLine, margin + 6, y);
            }
            y += 5.2;
          });
        }
        // 5. Numbered lists: e.g. "1. Item"
        else if (/^\d+\.\s/.test(trimmedLine)) {
          const matchResult = trimmedLine.match(/^(\d+\.)\s(.*)/);
          if (matchResult) {
            const numPrefix = matchResult[1];
            const rawItemText = matchResult[2].trim();
            const cleanedItemText = rawItemText
              .replace(/\*\*/g, "")
              .replace(/__/g, "")
              .replace(/\*/g, "")
              .replace(/_/g, "");

            doc.setFont("Helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);

            const splitText = doc.splitTextToSize(cleanedItemText, contentWidth - 8);
            
            splitText.forEach((subLine: string, index: number) => {
              checkNewPage(6);
              if (index === 0) {
                // Draw numbers
                doc.setFont("Helvetica", "bold");
                doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
                doc.text(numPrefix, margin + 1, y);
                
                doc.setFont("Helvetica", "normal");
                doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
                doc.text(subLine, margin + 7, y);
              } else {
                doc.text(subLine, margin + 7, y);
              }
              y += 5.2;
            });
          }
        }
        // 6. Blockquote or custom tip: e.g. "> Text"
        else if (trimmedLine.startsWith("> ")) {
          const blockText = trimmedLine.substring(2).trim();
          const cleanedText = blockText
            .replace(/\*\*/g, "")
            .replace(/__/g, "")
            .replace(/\*/g, "")
            .replace(/_/g, "");

          doc.setFont("Helvetica", "italic");
          doc.setFontSize(9.5);
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

          const splitText = doc.splitTextToSize(cleanedText, contentWidth - 12);
          
          // Draw block bg box
          const boxHeight = (splitText.length * 5.2) + 4;
          checkNewPage(boxHeight);

          doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
          doc.rect(margin, y - 1, contentWidth, boxHeight, "F");

          // Left border for blockquote
          doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
          doc.rect(margin, y - 1, 1.5, boxHeight, "F");

          splitText.forEach((subLine: string) => {
            doc.text(subLine, margin + 5, y + 2.5);
            y += 5.2;
          });
          y += 3;
        }
        // 7. Standard Paragraph
        else {
          const cleanedText = trimmedLine
            .replace(/\*\*/g, "")
            .replace(/__/g, "")
            .replace(/\*/g, "")
            .replace(/_/g, "");

          doc.setFont("Helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);

          const splitText = doc.splitTextToSize(cleanedText, contentWidth);
          
          splitText.forEach((subLine: string) => {
            checkNewPage(6);
            doc.text(subLine, margin, y);
            y += 5.2;
          });
        }
      });

      // Save document
      doc.save("Simplified_by_ReadabilityAI.pdf");
    } catch (error) {
      console.error("Failed to generate PDF document", error);
    }
  };

  const handlePrint = () => {
    // Attempt to open a styled print preview window
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const htmlContent = generateBrandedHTMLContent(false); // isForPrint=false to show action bar with Print/Close
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      // Fallback if window.open is blocked by pop-up blockers or iframe sandboxing
      // Create a temporary hidden iframe for print target
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document;
      if (!iframeDoc) return;

      const htmlContent = generateBrandedHTMLContent(true); // isForPrint=true to print directly and hide action bar

      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      // Safely remove the iframe after 10 seconds to allow printing to complete
      setTimeout(() => {
        try {
          if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        } catch (err) {
          console.error("Cleanup of print iframe failed:", err);
        }
      }, 10000);
    }
  };

  const handleSpeech = async () => {
    if (!text) return;

    if (isSpeaking) {
      // STOP PLAYING (Both engines)
      if (ttsEngine === "gemini") {
        if (premiumAudioSourceRef.current) {
          try {
            premiumAudioSourceRef.current.onended = null;
            premiumAudioSourceRef.current.stop();
          } catch (e) {}
          premiumAudioSourceRef.current = null;
        }
      } else {
        if (utteranceRef.current) {
          utteranceRef.current.onend = null;
          utteranceRef.current.onerror = null;
        }
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      }
      setIsSpeaking(false);
      if (onSpeechStateChange) onSpeechStateChange(false);
      return;
    }

    if (ttsEngine === "gemini") {
      // 1. PREMIUM GEMINI TTS FLOW
      try {
        setIsTtsLoading(true);

        // Cancel any existing playing audio first
        if (premiumAudioSourceRef.current) {
          try { premiumAudioSourceRef.current.stop(); } catch(e){}
          premiumAudioSourceRef.current = null;
        }

        const response = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: text,
            voiceName: premiumVoice
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to fetch AI narration.");
        }

        const data = await response.json();
        if (!data.audio) {
          throw new Error("No audio payload received.");
        }

        // Play the raw 16-bit PCM little-endian audio at 24000Hz using Web Audio API
        const base64Data = data.audio;
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const arrayBuffer = bytes.buffer;

        // Convert little-endian 16-bit PCM buffer to Float32 [-1.0, 1.0]
        const int16Data = new Int16Array(arrayBuffer);
        const float32Data = new Float32Array(int16Data.length);
        for (let i = 0; i < int16Data.length; i++) {
          float32Data[i] = int16Data[i] / 32768.0;
        }

        // Initialize AudioContext
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtxClass({ sampleRate: 24000 });
        premiumAudioCtxRef.current = audioCtx;

        const audioBuffer = audioCtx.createBuffer(1, float32Data.length, 24000);
        audioBuffer.getChannelData(0).set(float32Data);

        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        
        premiumAudioSourceRef.current = source;

        // Handle audio end
        source.onended = () => {
          setIsSpeaking(false);
          if (onSpeechStateChange) onSpeechStateChange(false);
          premiumAudioSourceRef.current = null;
        };

        source.start(0);
        setIsSpeaking(true);
        if (onSpeechStateChange) onSpeechStateChange(true);
      } catch (err: any) {
        console.error("Gemini Premium TTS Playback error:", err);
        alert(err.message || "Unable to play premium AI narrative. Falling back to browser speech.");
        // Fallback to webspeech if gemini fails
        setTtsEngine("webspeech");
      } finally {
        setIsTtsLoading(false);
      }
    } else {
      // 2. ROBUST BROWSER WEB SPEECH API FLOW
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      // Deep markdown cleanup to ensure beautiful, fluid reading without visual characters
      const cleanText = text
        .replace(/[#*`~_\-]/g, " ") // Replace markdown syntax with slight pauses (spaces)
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Extract text from links, scrap URLs
        .replace(/✔|✅/g, " Yes. ")
        .replace(/⚠️|❌/g, " Warning. ")
        .replace(/💡/g, " Key Tip. ")
        .replace(/\|/g, " ") // Clean up tables
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ") // Collapse whitespace
        .trim();

      // 1. Clear any active listeners on previous utterance to prevent stale state updates
      if (utteranceRef.current) {
        utteranceRef.current.onend = null;
        utteranceRef.current.onerror = null;
      }

      // 2. Clear browser speech queue
      window.speechSynthesis.cancel();

      // 3. A brief timeout of 80ms allows the browser audio thread to process the cancellation
      // and successfully accept the new speak command without immediate cancellation.
      setTimeout(() => {
        if (!text) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        } else {
          const voices = window.speechSynthesis.getVoices();
          let optimalVoice = voices.find(v => v.lang.replace("_", "-").toLowerCase() === "hi-in" || v.lang.toLowerCase().startsWith("hi") || v.name.toLowerCase().includes("hindi") || v.name.toLowerCase().includes("india"));
          if (!optimalVoice) {
            optimalVoice = voices.find(v => v.name.toLowerCase().includes("aura"));
          }
          if (!optimalVoice) {
            if (language === "hinglish") {
              optimalVoice = voices.find(v => (v.lang.includes("IN") && v.lang.startsWith("en")) || v.lang.startsWith("hi"));
            }
            if (!optimalVoice) {
              optimalVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Male") || v.name.includes("India")));
            }
          }
          if (optimalVoice) {
            utterance.voice = optimalVoice;
          }
        }
        
        utterance.rate = speechRate;
        utterance.pitch = speechPitch;

        const handleSpeechEnd = () => {
          setIsSpeaking(false);
          if (onSpeechStateChange) onSpeechStateChange(false);
          utteranceRef.current = null;
        };

        utterance.onend = handleSpeechEnd;

        utterance.onerror = (e) => {
          // 'interrupted' is normal when a new speech is triggered or cancelled manually
          if (e.error !== 'interrupted' && utteranceRef.current === utterance) {
            console.warn("Speech Synthesis finished or stopped:", e);
            setIsSpeaking(false);
            if (onSpeechStateChange) onSpeechStateChange(false);
            utteranceRef.current = null;
          }
        };

        // Keep a reference to prevent garbage collection on Chrome/Safari
        utteranceRef.current = utterance;
        (window as any)._activeUtterance = utterance;

        // In case the browser TTS got stuck in paused state, force resume first
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
        if (onSpeechStateChange) onSpeechStateChange(true);
      }, 80);
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
      <div className="flex flex-col items-center justify-center p-6 min-h-[260px] bg-white rounded-xl border border-slate-200 text-center relative shadow-sm">
        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
          <Shield className="w-5.5 h-5.5" />
        </div>
        <h3 className="font-display font-bold text-slate-900 text-sm">
          Readability Output
        </h3>
        <p className="text-slate-500 text-[11px] mt-1.5 max-w-sm leading-relaxed">
          Provide complex legal text, academic papers, messy notes, or medical records on the left panel, then trigger simplification.
        </p>
        <div className="mt-3.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-[9px] font-mono text-slate-600 font-bold uppercase tracking-widest">
          STANDBY: Awaiting Jargon Stream
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
      {/* Control Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:px-4.5 sm:py-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full transition-all duration-300 ${isTyping ? "bg-amber-500 animate-ping" : "bg-blue-600 animate-pulse"}`} />
          <span className="text-[11px] sm:text-xs font-mono text-slate-600 uppercase tracking-widest font-bold">
            {isTyping ? "Typing..." : "Simplified Output"}
          </span>
          {isTyping && (
            <button
              type="button"
              onClick={skipTypewriter}
              className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-600 font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              title="Skip typewriter animation and display full simplified text instantly"
            >
              <Zap className="w-2.5 h-2.5 animate-pulse text-indigo-600" />
              <span>Skip</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar max-w-full py-0.5">
          {/* Permanent Course Page link button */}
          {currentCourseId && (
            <button
              type="button"
              onClick={() => {
                window.history.pushState({}, "", `/course/${currentCourseId}`);
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="p-1.5 px-3 py-1.5 sm:p-2 sm:px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-[9px] sm:text-[10px] uppercase flex items-center gap-1 transition-all shadow-sm cursor-pointer shrink-0"
              title="Open the beautiful permanent online courseware page!"
            >
              <BookOpen className="w-3 h-3 text-white" />
              <span>OPEN COURSE PAGE</span>
            </button>
          )}

          {/* Read Aloud Button */}
          <button
            type="button"
            onClick={handleSpeech}
            disabled={verificationStatus !== "success"}
            className={`p-1.5 px-2 sm:p-2 sm:px-3 rounded-lg border text-[9px] sm:text-[10px] font-mono font-bold flex items-center gap-1 sm:gap-1.5 transition-all duration-300 shrink-0 ${
              verificationStatus !== "success"
                ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                : isSpeaking
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 cursor-pointer"
            }`}
            title={verificationStatus !== "success" ? "Verify code to listen" : isSpeaking ? "Stop narrative" : "Narrate with Mr. Kilvish voice"}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                <span>Mute</span>
              </>
            ) : (
              <>
                <Volume2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${verificationStatus !== "success" ? "text-slate-400" : "text-blue-600"}`} />
                <span>Listen</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={verificationStatus !== "success"}
            className={`p-1.5 sm:p-2 rounded-lg bg-white border text-slate-500 transition-all duration-300 flex items-center justify-center min-w-[30px] min-h-[30px] sm:min-w-[34px] sm:min-h-[34px] shrink-0 ${
              verificationStatus !== "success"
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed opacity-60"
                : "border-slate-200 hover:text-slate-800 hover:border-slate-300 cursor-pointer"
            }`}
            title={verificationStatus !== "success" ? "Verify code to copy" : "Copy to Clipboard"}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Download Markdown Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={verificationStatus !== "success"}
            className={`p-1.5 px-2 sm:p-2 rounded-lg bg-white border transition-all duration-300 flex items-center gap-1 shrink-0 ${
              verificationStatus !== "success"
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed opacity-60"
                : "border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 cursor-pointer"
            }`}
            title={verificationStatus !== "success" ? "Verify code to download" : "Download as Markdown (.md)"}
          >
            <Download className="w-3.5 h-3.5" />
            <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-0.5 ${verificationStatus !== "success" ? "text-slate-300" : "text-slate-600"}`}>MD</span>
          </button>

          {/* Download Branded HTML Button */}
          <button
            type="button"
            onClick={handleDownloadHTML}
            disabled={verificationStatus !== "success"}
            className={`p-1.5 px-2 sm:p-2 rounded-lg bg-white border transition-all duration-300 flex items-center gap-1 shrink-0 ${
              verificationStatus !== "success"
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed opacity-60"
                : "border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 cursor-pointer"
            }`}
            title={verificationStatus !== "success" ? "Verify code to download" : "Save & Download as Branded HTML (.html)"}
          >
            <FileCode className={`w-3.5 h-3.5 ${verificationStatus !== "success" ? "text-slate-300" : "text-emerald-600"}`} />
            <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-0.5 ${verificationStatus !== "success" ? "text-slate-300" : "text-emerald-600"}`}>HTML</span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={verificationStatus !== "success"}
            className={`p-1.5 px-2 sm:p-2 rounded-lg bg-white border transition-all duration-300 flex items-center gap-1 shrink-0 ${
              verificationStatus !== "success"
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed opacity-60"
                : "border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 cursor-pointer"
            }`}
            title={verificationStatus !== "success" ? "Verify code to download PDF" : "Download as formatted PDF (.pdf)"}
          >
            <FileText className={`w-3.5 h-3.5 ${verificationStatus !== "success" ? "text-slate-300" : "text-rose-600"}`} />
            <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-0.5 ${verificationStatus !== "success" ? "text-slate-300" : "text-rose-600"}`}>PDF</span>
          </button>

          {/* Print Branded Document Button */}
          <button
            type="button"
            onClick={handlePrint}
            disabled={verificationStatus !== "success"}
            className={`p-1.5 px-2 sm:p-2 rounded-lg bg-white border transition-all duration-300 flex items-center gap-1 shrink-0 ${
              verificationStatus !== "success"
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed opacity-60"
                : "border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 cursor-pointer"
            }`}
            title={verificationStatus !== "success" ? "Verify code to print" : "Print Document with Branding"}
          >
            <Printer className={`w-3.5 h-3.5 ${verificationStatus !== "success" ? "text-slate-300" : "text-blue-600"}`} />
            <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-0.5 ${verificationStatus !== "success" ? "text-slate-300" : "text-blue-600"}`}>PRINT</span>
          </button>
        </div>
      </div>

      {/* Styled Output Render Container */}
      <div className="p-3 sm:p-4 md:p-4.5 overflow-y-auto max-h-[650px] leading-relaxed font-sans text-slate-800 select-text bg-white">
        {verificationStatus !== "success" ? (
          <div className="flex flex-col items-center justify-center py-6 px-4 sm:px-6 min-h-[300px] bg-slate-50 border border-slate-100 rounded-xl shadow-inner max-w-xl mx-auto my-2 animate-[fadeIn_0.4s_ease-out]">
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white mb-3.5 shadow-sm">
              <Lock className="w-5.5 h-5.5 text-indigo-400" />
            </div>
            
            <h3 className="font-display font-extrabold text-slate-950 text-base sm:text-lg tracking-tight text-center">
              {language === "hi" ? "कोड दर्ज करें और पढ़ें" : "Enter Code and Read"}
            </h3>
            
            <p className="text-slate-500 text-xs mt-2 max-w-sm text-center leading-relaxed font-sans font-medium">
              {language === "hi" 
                ? "यह सरलीकृत अकादमिक ब्लॉक सुरक्षित है। पढ़ने के लिए नीचे दिए गए अद्वितीय एक्सेस कोड को दर्ज करें।" 
                : "This simplified academic textbook block is protected. Simply enter your access signature key below to unlock."}
            </p>

            {/* Generated Access Code for Simple User copy-paste */}
            <div className="mt-6 w-full max-w-sm p-4 bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
              <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-widest">Sovereign Key Signature</span>
              <div className="flex items-center gap-2">
                <code className="px-3 py-1 bg-white border border-slate-200 text-indigo-600 font-mono text-xs font-bold rounded-lg select-all">
                  {issuedCode}
                </code>
                <button
                  type="button"
                  onClick={handleAutofillCode}
                  className="px-2.5 py-1 text-[9px] font-mono font-extrabold uppercase text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  Autofill Code
                </button>
              </div>
            </div>

            {/* Simple Unlock Action form */}
            <div className="mt-6 w-full max-w-sm">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter access code here..."
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleVerifyCode();
                    }
                  }}
                  className="flex-1 px-3.5 py-2.5 text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-slate-400 text-slate-900 shadow-sm"
                />
                
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="px-4 py-2 text-xs font-mono font-bold text-white bg-slate-900 hover:bg-slate-850 rounded-xl cursor-pointer transition-all shrink-0 shadow-sm"
                >
                  Unlock
                </button>
              </div>

              {verificationStatus === "error" && (
                <div className="mt-3 flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-[10px] leading-relaxed">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider font-mono mr-1">Error:</span>
                    Invalid access key signature. Use Autofill for instant unlock.
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* On-screen Letterhead Branding */}
            <div className="mb-4 p-4 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AcademyLogo className="w-9 h-9 text-slate-900" />
            <div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight font-sans leading-none">MR. KILVISH ACADEMY</div>
              <div className="text-[11px] italic text-slate-500 font-serif mt-0.5">"Clarity is Power"</div>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[9px] font-mono text-slate-500 font-bold uppercase">
                <span className="bg-slate-200/60 px-1 py-0.2 rounded text-slate-600">Code: MKA-001</span>
                <span className="bg-slate-200/60 px-1 py-0.2 rounded text-slate-600">ID: BK-001</span>
                <span className="bg-slate-200/60 px-1 py-0.2 rounded text-slate-600">Ver: v1.0</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0 md:pl-5 shrink-0">
            {/* Live QR Code Preview */}
            <div className="flex flex-col items-center">
              <QRCodeSVG />
              <span className="text-[8px] font-mono font-bold text-slate-400 uppercase mt-1">Scan to Read</span>
            </div>

            {/* Access Code Display */}
            <div className="flex flex-col">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Access Code</span>
              <span className="mt-1 px-2.5 py-1 text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg select-all">
                {issuedCode}
              </span>
            </div>
          </div>
        </div>

        {/* Sovereign Student progress dashboard */}
        <div className="mb-4 p-4.5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shadow-inner shrink-0">
                <Trophy className="w-5.5 h-5.5 text-indigo-400 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-1.5 py-0.2 rounded-full border border-indigo-500/20">
                    Student Level
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-300">
                    {completedChapters.length === chaptersCount ? "🏆 Academic Master" : "📚 Academy Scholar"}
                  </span>
                </div>
                <h3 className="text-base font-extrabold font-sans text-white tracking-tight mt-0.5">
                  Level {Math.floor(userXp / 300) + 1} Clarity Explorer
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                  Banish darkness to earn XP. Completed <span className="text-indigo-300 font-bold font-mono">{completedChapters.length}</span> of <span className="text-slate-300 font-bold font-mono">{chaptersCount}</span> syllabus modules.
                </p>
              </div>
            </div>

            <div className="flex flex-col w-full md:w-56 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-5">
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-slate-300">
                <span>XP Points</span>
                <span className="text-indigo-400">{userXp} XP</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden border border-slate-700/50">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (userXp % 300) / 300 * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5 text-[9px] font-mono font-bold text-slate-500 uppercase">
                <span>{userXp % 300} / 300 XP</span>
                <span>Next Level</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sovereign Audio Companion - Narrator on the Go */}
        <div className="mb-5 p-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden text-white transition-all duration-300">
          {/* Subtle background glow when active */}
          {isSpeaking && (
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
          )}
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            
            {/* Left Side: Avatar, Speaker Info, & Accent Badge */}
            <div className="flex items-center gap-4 flex-1 min-w-0 text-center md:text-left flex-col md:flex-row">
              {/* Dynamic Interactive Speaker Button */}
              <button
                type="button"
                onClick={handleSpeech}
                disabled={isTtsLoading}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 relative cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  isSpeaking
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-4 ring-rose-500/20"
                    : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 ring-4 ring-indigo-600/10"
                } ${isTtsLoading ? "opacity-75 cursor-not-allowed" : ""}`}
                title={isSpeaking ? "Stop Narration" : "Start Narration"}
              >
                {/* Glowing ripple effect when speaking */}
                {isSpeaking && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-25" />
                    <span className="absolute -inset-2 rounded-full bg-rose-500/10 animate-pulse" />
                  </>
                )}
                
                {isTtsLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isSpeaking ? (
                  <Pause className="w-7 h-7 text-white fill-white" />
                ) : (
                  <Play className="w-7 h-7 text-white fill-white translate-x-0.5" />
                )}
              </button>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {ttsEngine === "gemini" ? "Gemini Premium AI" : "Browser Web Speech"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? "bg-rose-400 animate-ping" : "bg-emerald-400"}`} />
                    {isTtsLoading ? "Generating AI Voice..." : isSpeaking ? "Now Speaking" : "Ready"}
                  </span>
                </div>
                
                <h4 className="text-sm font-bold text-slate-100 mt-1.5 flex items-center gap-1.5 justify-center md:justify-start">
                  <span>Mr. Kilvish Sovereign Voice Guide</span>
                  {ttsEngine === "gemini" && <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 rounded font-bold uppercase">ULTRA HD</span>}
                </h4>
                
                <p className="text-xs text-slate-400 mt-1 flex items-center justify-center md:justify-start gap-1">
                  <span>Speaker Accent Language:</span>
                  <span className="font-semibold text-indigo-300">
                    {ttsEngine === "gemini" ? "Friendly Hindi India / Bilingual Hinglish" : "Hindi India (hi_IN)"}
                  </span>
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 italic truncate max-w-[280px] sm:max-w-md">
                  {ttsEngine === "gemini" 
                    ? `Premium AI Voice Persona: ${premiumVoice} (Ultra Natural Studio Speaker)`
                    : (selectedVoice ? `Active Voice: ${selectedVoice.name}` : "Auto-configured browser voice")
                  }
                </p>
              </div>
            </div>

            {/* Right Side: Waveform Visualizer & Engine Info */}
            <div className="flex flex-col items-center md:items-end justify-center shrink-0 w-full md:w-auto border-t md:border-t-0 border-slate-800/80 pt-4 md:pt-0">
              {/* Dynamic Sound Waveform */}
              <div className="flex items-end gap-1 h-7 px-4 justify-center mb-2">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-[3px] rounded-full transition-all duration-300 ${
                      isSpeaking ? "bg-indigo-400" : "bg-slate-700"
                    }`}
                    style={{
                      height: isSpeaking ? `${Math.sin(i * 0.5) * 60 + 80}%` : '20%',
                      transformOrigin: 'bottom',
                      animationName: isSpeaking ? 'soundwave' : 'none',
                      animationDuration: `${0.8 + (i % 3) * 0.2}s`,
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                      animationDirection: 'alternate',
                      animationDelay: `${i * 0.08}s`,
                      minHeight: '4px'
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest text-center">
                {isTtsLoading ? "GENERATING AUDIO NARRATIVE..." : isSpeaking ? "PLAYING AUDIO STREAM" : "TOUCH BUTTON TO LISTEN"}
              </span>
            </div>

          </div>

          {/* New Interactive Control & Custom Configurator Rail inside card */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row gap-4 justify-between items-center text-xs text-slate-300">
            {/* Engine Select Pill */}
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider mb-1">Speaker Mode Engine</span>
              <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    // stop current speaking if switching
                    if (isSpeaking) handleSpeech();
                    setTtsEngine("gemini");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    ttsEngine === "gemini" 
                      ? "bg-indigo-600 text-white shadow-md font-bold" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  Premium AI Voice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) handleSpeech();
                    setTtsEngine("webspeech");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    ttsEngine === "webspeech" 
                      ? "bg-indigo-600 text-white shadow-md font-bold" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Web Speech API
                </button>
              </div>
            </div>

            {/* Dynamic Voice configuration section */}
            <div className="flex flex-col gap-1 w-full md:w-auto flex-1 md:pl-6">
              {ttsEngine === "gemini" ? (
                <>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider mb-1">AI Narrator Style (Studio Speaker)</span>
                  <div className="grid grid-cols-5 gap-1.5 max-w-md bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {(["Zephyr", "Kore", "Puck", "Charon", "Fenrir"] as const).map((voice) => (
                      <button
                        key={voice}
                        type="button"
                        onClick={() => {
                          if (isSpeaking) handleSpeech();
                          setPremiumVoice(voice);
                        }}
                        className={`py-1.5 rounded-lg text-[10px] font-mono font-bold text-center transition-all cursor-pointer ${
                          premiumVoice === voice
                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                        }`}
                      >
                        {voice}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider mb-1">Web Speech Narrator Speed</span>
                  <div className="flex items-center gap-3 bg-slate-950 p-1.5 px-3 rounded-xl border border-slate-800">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <div className="flex gap-2 w-full justify-between">
                      {([0.8, 1.0, 1.2, 1.5] as const).map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setSpeechRate(rate)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono transition-all cursor-pointer ${
                            speechRate === rate
                              ? "bg-indigo-600 text-white"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>

        <div className="markdown-body space-y-7 text-[15px] leading-loose font-sans">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ node, ...props }) => (
                <div className="w-full my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-slate-700 min-w-full divide-y divide-slate-200" {...props} />
                  </div>
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead className="bg-slate-900 text-slate-100 font-semibold text-xs uppercase tracking-wider" {...props} />
              ),
              tbody: ({ node, ...props }) => (
                <tbody className="divide-y divide-slate-100 bg-white" {...props} />
              ),
              tr: ({ node, ...props }) => (
                <tr className="hover:bg-slate-50/85 transition-colors duration-150 odd:bg-slate-50/20" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th className="px-6 py-4 text-left font-bold tracking-wider text-slate-100" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="px-6 py-4.5 text-slate-600 font-sans leading-relaxed text-xs sm:text-sm border-r border-slate-50 last:border-r-0" {...props} />
              ),
              blockquote: ({ node, children, ...props }) => {
                const contentText = extractText(children);
                const isWarning = /⚠️|warning|error|alert|चेतावनी|गलती|danger|n'ts/i.test(contentText);
                const isTip = /💡|tip|expert|विशेषज्ञ|सलाह|सुझाव|अचूक/i.test(contentText);
                const isVerdict = /kilvish|किल्विष|फैसला|verdict/i.test(contentText);
                const isExample = /example|उदाहरण|प्रसंग|scenario|case study/i.test(contentText);
                const isActivity = /activity|exercise|drill|अभ्यास|गतिविधि/i.test(contentText);
                const isPrompt = /prompt|ask|chat|प्रश्न/i.test(contentText);

                let bgClass = "bg-slate-50 border-slate-300 text-slate-700";
                let borderClass = "border-l-4 border-slate-300";
                let icon = <Info className="w-5 h-5 text-slate-500 shrink-0" />;
                let title = language === "hi" ? "सूचना" : "Note";

                if (isWarning) {
                  bgClass = "bg-rose-50/90 border-rose-200 text-rose-950";
                  borderClass = "border-l-4 border-rose-500";
                  icon = <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />;
                  title = language === "hi" ? "चेतावनी (Warning)" : "Sovereign Warning Alert";
                } else if (isTip) {
                  bgClass = "bg-indigo-50/90 border-indigo-100 text-indigo-950";
                  borderClass = "border-l-4 border-indigo-500";
                  icon = <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0" />;
                  title = language === "hi" ? "विशेषज्ञ सलाह (Expert Tip)" : "Expert Tip";
                } else if (isVerdict) {
                  bgClass = "bg-slate-950 text-slate-50 shadow-xl border-slate-800";
                  borderClass = "border-l-4 border-indigo-500";
                  icon = <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />;
                  title = language === "hi" ? "श्री किल्विष का फैसला (Sovereign Verdict)" : "Mr. Kilvish's Verdict";
                } else if (isExample) {
                  bgClass = "bg-emerald-50/90 border-emerald-100 text-emerald-950";
                  borderClass = "border-l-4 border-emerald-500";
                  icon = <GraduationCap className="w-5 h-5 text-emerald-600 shrink-0" />;
                  title = language === "hi" ? "व्यावहारिक उदाहरण (Practical Example)" : "Practical Example / Case Study";
                } else if (isActivity) {
                  bgClass = "bg-amber-50/95 border-amber-200 text-amber-950";
                  borderClass = "border-l-4 border-amber-500";
                  icon = <Trophy className="w-5 h-5 text-amber-600 shrink-0" />;
                  title = language === "hi" ? "गतिविधि (Activity)" : "Interactive Learning Drill";
                } else if (isPrompt) {
                  bgClass = "bg-violet-50/95 border-violet-100 text-violet-950";
                  borderClass = "border-l-4 border-violet-500";
                  icon = <Terminal className="w-5 h-5 text-violet-600 shrink-0" />;
                  title = language === "hi" ? "AI प्रैक्टिस प्रॉम्प्ट" : "Kilvish AI Practice Prompt";
                }

                return (
                  <div className={`my-6 p-5 rounded-r-2xl border border-y border-r ${bgClass} ${borderClass} shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-xl bg-white shadow-sm shrink-0 flex items-center justify-center">
                        {icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1 opacity-90 flex items-center gap-1.5 text-slate-800">
                          {title}
                        </div>
                        <div className="text-xs sm:text-[14px] leading-relaxed font-sans prose prose-slate">
                          {children}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              },
              h1: ({ node, ...props }) => {
                const titleText = extractText(props.children);
                const isCompleted = completedChapters.includes(titleText);
                return (
                  <div className="my-8 rounded-2xl border border-slate-200 overflow-hidden shadow-md bg-white group hover:shadow-lg transition-all duration-300">
                    <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 p-6 text-white relative">
                      <div className="absolute top-0 right-0 w-32 h-full bg-indigo-500/5 pointer-events-none skew-x-12 transform origin-top-right transition-transform group-hover:scale-105" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                            Kilvish Study Block
                          </span>
                          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-snug mt-1" {...props} />
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => handleToggleChapter(titleText)}
                          className={`px-3.5 py-1.5 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
                            isCompleted
                              ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-400 hover:bg-emerald-500/30"
                              : "bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-sm"
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Done (+100 XP)</span>
                            </>
                          ) : (
                            <>
                              <Award className="w-3.5 h-3.5 text-indigo-200" />
                              <span>Complete Block (+100 XP)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              },
              h2: ({ node, ...props }) => (
                <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 border-b border-slate-100 pb-2 mt-8 mb-4 tracking-wide uppercase flex items-center gap-2" {...props}>
                  <ChevronRight className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span className="flex-1">{props.children}</span>
                </h2>
              ),
              h3: ({ node, ...props }) => (
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-800 mt-6 mb-3 tracking-wide border-l-2 border-slate-300 pl-2.5" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-slate-700 leading-relaxed text-xs sm:text-[14.5px] mb-4.5 text-justify animate-[fadeIn_0.5s_ease-out]" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="text-indigo-600 font-bold" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a className="text-indigo-600 hover:text-indigo-800 underline transition-colors inline-flex items-center gap-1" target="_blank" rel="noopener noreferrer" {...props}>
                  {props.children}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-6 my-4 space-y-2 text-slate-600 marker:text-slate-400" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="relative border-l border-indigo-200 ml-3.5 my-6 space-y-6 text-slate-700" {...props} />
              ),
              li: ({ node, ...props }) => {
                const isOrdered = (node as any)?.parent?.tagName === "ol";
                if (isOrdered) {
                  return (
                    <li className="relative pl-7 text-xs sm:text-[14.5px] leading-relaxed mb-4 list-none group">
                      <div className="absolute -left-[27px] top-1.5 w-[14px] h-[14px] rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                      </div>
                      <div className="p-4 bg-slate-50/70 border border-slate-100 hover:border-slate-200 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200">
                        {props.children}
                      </div>
                    </li>
                  );
                }
                return (
                  <li className="relative pl-5 text-xs sm:text-[14.5px] leading-relaxed mb-2 list-none">
                    <span className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {props.children}
                  </li>
                );
              }
            }}
          >
            {healHindiOCR(isTyping ? displayedText + " ▮" : displayedText)}
          </Markdown>
        </div>

        {/* Interactive Companion Learning Grid & AI Prompt Sandbox */}
        <div className="mt-10 border-t border-slate-100 pt-8 space-y-8">
          
          {/* MKA Companion Learning Grid */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600">
                <BookMarked className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                MKA Companion Learning Grid
              </h4>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 text-center transition-all group cursor-pointer hover:-translate-y-1">
                <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🎬</div>
                <div className="text-[11px] font-bold text-slate-900">Video Masterclass</div>
                <div className="text-[9px] text-slate-500 mt-1">Scan / Click to Watch</div>
                <div className="mt-2 mx-auto w-12 h-12 bg-white rounded border border-slate-200 p-1 flex items-center justify-center">
                  <QRCodeSVG />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 text-center transition-all group cursor-pointer hover:-translate-y-1">
                <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🎧</div>
                <div className="text-[11px] font-bold text-slate-900">Audio Podcast</div>
                <div className="text-[9px] text-slate-500 mt-1">Jargon Banish Pod</div>
                <div className="mt-2 mx-auto w-12 h-12 bg-white rounded border border-slate-200 p-1 flex items-center justify-center">
                  <QRCodeSVG />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 text-center transition-all group cursor-pointer hover:-translate-y-1">
                <div className="text-xl mb-1 group-hover:scale-110 transition-transform">📝</div>
                <div className="text-[11px] font-bold text-slate-900">Workbook & Quiz</div>
                <div className="text-[9px] text-slate-500 mt-1">Earn +500 XP Points</div>
                <div className="mt-2 mx-auto w-12 h-12 bg-white rounded border border-slate-200 p-1 flex items-center justify-center">
                  <QRCodeSVG />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 text-center transition-all group cursor-pointer hover:-translate-y-1">
                <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🤖</div>
                <div className="text-[11px] font-bold text-slate-900">Sovereign Tutor</div>
                <div className="text-[9px] text-slate-500 mt-1">24/7 Cognitive Support</div>
                <div className="mt-2 mx-auto w-12 h-12 bg-white rounded border border-slate-200 p-1 flex items-center justify-center">
                  <QRCodeSVG />
                </div>
              </div>
            </div>
          </div>

          {/* Ask Mr. Kilvish AI Sandbox */}
          <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-full bg-indigo-100/10 pointer-events-none -skew-x-12" />
            
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-indigo-600 animate-pulse" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Ask Mr. Kilvish AI: Practice Prompts
              </h4>
            </div>
            
            <p className="text-[11px] text-slate-600 leading-relaxed mb-4">
              Click any of the pre-validated sovereign prompts below to copy them, then paste into the chat on the left to deepen your mastery of this syllabus.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: "p1",
                  title: "Analogy Breakdown",
                  prompt: "Explain the core concept from this module using a highly simple real-world analogy.",
                  icon: <BookOpen className="w-3.5 h-3.5" />
                },
                {
                  id: "p2",
                  title: "Cognitive MCQ Test",
                  prompt: "Generate a 5-question multiple choice test based on this syllabus to check my understanding.",
                  icon: <Award className="w-3.5 h-3.5" />
                },
                {
                  id: "p3",
                  title: "Practical Scenario",
                  prompt: "Show me a real-world business case study or job application where this concept is used.",
                  icon: <Trophy className="w-3.5 h-3.5" />
                }
              ].map((item) => {
                const isCopied = copiedPrompt === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(item.prompt);
                        setCopiedPrompt(item.id);
                        setTimeout(() => setCopiedPrompt(null), 2000);
                      } catch (err) {
                        console.error("Failed to copy:", err);
                      }
                    }}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left cursor-pointer transition-all hover:shadow-sm flex flex-col justify-between h-28 group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="p-1 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform shrink-0">
                        {item.icon}
                      </span>
                      {isCopied ? (
                        <span className="text-[8px] font-mono font-bold text-emerald-600 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                          Copied
                        </span>
                      ) : (
                        <span className="text-[8px] font-mono font-bold text-slate-400 uppercase group-hover:text-indigo-600">
                          Copy
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[9px] text-slate-500 line-clamp-2 mt-1">
                        "{item.prompt}"
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5-Star Quality Rating System */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 animate-[fadeIn_0.4s_ease-out]">
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Star className={`w-4 h-4 ${rating ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                Rate Explanation Quality
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                How helpful was Mr. Kilvish's simplified breakdown? Rate it to save this rating metadata to your local clarity log history.
              </p>
            </div>
            
            <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => onRate && onRate(star)}
                    className="p-1 rounded-lg hover:bg-slate-200/80 transition-colors cursor-pointer group active:scale-95"
                    title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star 
                      className={`w-5.5 h-5.5 transition-all duration-150 ${
                        star <= (rating || 0)
                          ? "text-amber-500 fill-amber-500 scale-110"
                          : "text-slate-300 hover:text-amber-400"
                      } group-hover:scale-110`}
                    />
                  </button>
                ))}
              </div>
              {rating ? (
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 animate-[fadeIn_0.3s_ease-out]">
                  Thanks! Rated {rating}/5 Stars
                </span>
              ) : (
                <span className="text-[9px] font-mono font-semibold text-slate-400 uppercase">
                  Awaiting your rating
                </span>
              )}
            </div>
          </div>

        </div>
      </>
    )}
  </div>

      {/* Footer Meta */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between px-6 py-4.5 border-t border-slate-200 bg-slate-50 text-[10px] font-mono text-slate-500 font-semibold">
        <span className="flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5 text-slate-400" />
          Format: Markdown Source
        </span>
        <span>Verified by Kilvish Algorithmic Engine</span>
      </div>
    </div>
  );
}
