import React, { useState, useEffect } from "react";
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
  Cpu
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
}

export default function OutputDisplay({ text, isLoading, language = "en", onSpeechStateChange, currentCourseId }: OutputDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

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
    
    // Attempt to select an appropriate voice based on language
    const voices = window.speechSynthesis.getVoices();
    let optimalVoice;
    
    if (language === "hi") {
      optimalVoice = voices.find(v => v.lang.startsWith("hi") || v.lang.startsWith("in"));
    } else if (language === "hinglish") {
      optimalVoice = voices.find(v => (v.lang.includes("IN") && v.lang.startsWith("en")) || v.lang.startsWith("hi"));
    }
    
    if (!optimalVoice) {
      optimalVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Male")));
    }

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:px-8 sm:py-5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs sm:text-sm font-mono text-slate-600 uppercase tracking-widest font-bold">
            Simplified Output
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar max-w-full py-0.5">
          {/* Permanent Course Page link button */}
          {currentCourseId && (
            <button
              type="button"
              onClick={() => {
                window.history.pushState({}, "", `/course/${currentCourseId}`);
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="p-2 px-3.5 py-2 sm:p-2.5 sm:px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-[10px] sm:text-xs uppercase flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
              title="Open the beautiful permanent online courseware page!"
            >
              <BookOpen className="w-3.5 h-3.5 text-white" />
              <span>OPEN COURSE PAGE</span>
            </button>
          )}

          {/* Read Aloud Button */}
          <button
            type="button"
            onClick={handleSpeech}
            disabled={verificationStatus !== "success"}
            className={`p-2 px-2.5 sm:p-2.5 sm:px-3.5 rounded-xl border text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1 sm:gap-2 transition-all duration-300 shrink-0 ${
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
            className={`p-2 sm:p-2.5 rounded-xl bg-white border text-slate-500 transition-all duration-300 flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] shrink-0 ${
              verificationStatus !== "success"
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed opacity-60"
                : "border-slate-200 hover:text-slate-800 hover:border-slate-300 cursor-pointer"
            }`}
            title={verificationStatus !== "success" ? "Verify code to copy" : "Copy to Clipboard"}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>

          {/* Download Markdown Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={verificationStatus !== "success"}
            className={`p-2 px-2.5 sm:p-2.5 rounded-xl bg-white border transition-all duration-300 flex items-center gap-1 sm:gap-1.5 shrink-0 ${
              verificationStatus !== "success"
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed opacity-60"
                : "border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 cursor-pointer"
            }`}
            title={verificationStatus !== "success" ? "Verify code to download" : "Download as Markdown (.md)"}
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-0.5 ${verificationStatus !== "success" ? "text-slate-300" : "text-slate-600"}`}>MD</span>
          </button>

          {/* Download Branded HTML Button */}
          <button
            type="button"
            onClick={handleDownloadHTML}
            disabled={verificationStatus !== "success"}
            className={`p-2 px-2.5 sm:p-2.5 rounded-xl bg-white border transition-all duration-300 flex items-center gap-1 sm:gap-1.5 shrink-0 ${
              verificationStatus !== "success"
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed opacity-60"
                : "border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 cursor-pointer"
            }`}
            title={verificationStatus !== "success" ? "Verify code to download" : "Save & Download as Branded HTML (.html)"}
          >
            <FileCode className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${verificationStatus !== "success" ? "text-slate-300" : "text-emerald-600"}`} />
            <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-0.5 ${verificationStatus !== "success" ? "text-slate-300" : "text-emerald-600"}`}>HTML</span>
          </button>

          {/* Print Branded Document Button */}
          <button
            type="button"
            onClick={handlePrint}
            disabled={verificationStatus !== "success"}
            className={`p-2 px-2.5 sm:p-2.5 rounded-xl bg-white border transition-all duration-300 flex items-center gap-1 sm:gap-1.5 shrink-0 ${
              verificationStatus !== "success"
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed opacity-60"
                : "border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 cursor-pointer"
            }`}
            title={verificationStatus !== "success" ? "Verify code to print" : "Print Document with Branding"}
          >
            <Printer className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${verificationStatus !== "success" ? "text-slate-300" : "text-blue-600"}`} />
            <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-0.5 ${verificationStatus !== "success" ? "text-slate-300" : "text-blue-600"}`}>PRINT</span>
          </button>
        </div>
      </div>

      {/* Styled Output Render Container */}
      <div className="p-6 sm:p-10 overflow-y-auto max-h-[650px] leading-relaxed font-sans text-slate-800 select-text bg-white">
        {verificationStatus !== "success" ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 sm:px-8 min-h-[440px] bg-slate-50 border border-slate-100 rounded-2xl shadow-inner max-w-xl mx-auto my-4 animate-[fadeIn_0.4s_ease-out]">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white mb-5 shadow-sm">
              <Lock className="w-6 h-6 text-indigo-400" />
            </div>
            
            <h3 className="font-display font-extrabold text-slate-950 text-lg sm:text-xl tracking-tight text-center">
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
            <div className="mb-8 p-6 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <AcademyLogo className="w-12 h-12 text-slate-900" />
            <div>
              <div className="text-lg font-extrabold text-slate-900 tracking-tight font-sans leading-none">MR. KILVISH ACADEMY</div>
              <div className="text-xs italic text-slate-500 font-serif mt-1">"Clarity is Power"</div>
              <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[10px] font-mono text-slate-500 font-bold uppercase">
                <span className="bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-600">Code: MKA-001</span>
                <span className="bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-600">ID: BK-001</span>
                <span className="bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-600">Ver: v1.0</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-6 shrink-0">
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
        <div className="mb-8 p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shadow-inner">
                <Trophy className="w-7 h-7 text-indigo-400 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    Student Level
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {completedChapters.length === chaptersCount ? "🏆 Academic Master" : "📚 Academy Scholar"}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold font-sans text-white tracking-tight mt-1">
                  Level {Math.floor(userXp / 300) + 1} Clarity Explorer
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Banish darkness to earn XP. You have completed <span className="text-indigo-300 font-bold font-mono">{completedChapters.length}</span> of <span className="text-slate-300 font-bold font-mono">{chaptersCount}</span> syllabus modules.
                </p>
              </div>
            </div>

            <div className="flex flex-col w-full md:w-56 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
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
            {healHindiOCR(text)}
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
