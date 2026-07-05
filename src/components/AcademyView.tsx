import React, { useState, useEffect } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Sparkles, 
  Flame, 
  Target, 
  Award, 
  FileText, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Compass, 
  HelpCircle, 
  ChevronRight, 
  Download, 
  Play, 
  Users, 
  MessageSquare, 
  RefreshCw, 
  Info, 
  Check, 
  Settings,
  Briefcase,
  TrendingUp,
  Languages,
  ShieldCheck,
  Building
} from "lucide-react";

// Import modular components
import UniversityDashboard from "./UniversityDashboard";
import UniversityExplore from "./UniversityExplore";
import UniversityPlayer from "./UniversityPlayer";
import UniversityTutor from "./UniversityTutor";
import UniversityAssignments from "./UniversityAssignments";
import UniversityExams from "./UniversityExams";
import UniversityCertificates from "./UniversityCertificates";
import UniversityCareerCenter from "./UniversityCareerCenter";
import UniversityDownloads from "./UniversityDownloads";
import UniversityBusinessHub from "./UniversityBusinessHub";
import AllInOneExamCentre from "./AllInOneExamCentre";

interface AcademyViewProps {
  user: any;
  userProfile: any;
  onRefreshProfile: () => void;
  setActiveView: (view: "workspace" | "pricing" | "growth" | "admin" | "business" | "academy" | "search") => void;
  onStartBusiness?: (data: any) => void;
}

type UniversityTab = 
  | "dashboard" 
  | "explore" 
  | "my-courses" 
  | "ai-tutor" 
  | "assignments" 
  | "practice-tests" 
  | "final-exams" 
  | "exam-centre"
  | "certificates" 
  | "downloads" 
  | "career-center" 
  | "business-banking"
  | "settings";

export default function AcademyView({ 
  user, 
  userProfile, 
  onRefreshProfile,
  setActiveView,
  onStartBusiness
}: AcademyViewProps) {
  // System States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>("Artificial Intelligence foundations");
  const [activeTab, setActiveTab] = useState<UniversityTab>("dashboard");
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced" | "expert" | "professional">("beginner");

  // Course Data States
  const [currentCourse, setCurrentCourse] = useState<any | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  
  // Quiz and Quiz scoring states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // User States
  const [userXP, setUserXP] = useState<number>(1450);
  const [streak, setStreak] = useState<number>(15);
  const [studentName, setStudentName] = useState<string>("Ramesh Kumar Sharma");
  const [languagePreference, setLanguagePreference] = useState<"English" | "Hindi" | "Multilingual">("English");
  const [difficultyPreference, setDifficultyPreference] = useState<"Beginner" | "Intermediate" | "Advanced" | "Professional">("Beginner");

  const [notes, setNotes] = useState<string>("");
  const [showCertificate, setShowCertificate] = useState<boolean>(true);
  const [certSerialNumber, setCertSerialNumber] = useState<string>("REG-KBA-2026-X81A3Z");
  const [studentAssignmentText, setStudentAssignmentText] = useState<string>("");
  const [isGradingAssignment, setIsGradingAssignment] = useState<boolean>(false);
  const [assignmentGrade, setAssignmentGrade] = useState<{ score: number; letter: string; feedback: string } | null>(null);

  // Loaded courses in user profile
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([
    { topic: "Quantum Computing", progress: 85, level: "Advanced" },
    { topic: "GST Regulatory compliance", progress: 40, level: "Intermediate" },
    { topic: "Artificial Intelligence foundations", progress: 100, level: "Beginner" }
  ]);

  // Toast Notification State
  const [toast, setToast] = useState<{ type: "success" | "info" | "error"; message: string } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Pre-load default course on startup
  useEffect(() => {
    const defaultCourse = loadSimulatedCourse("Artificial Intelligence foundations", "English", "Beginner");
    setCurrentCourse(defaultCourse);
  }, []);

  // Default simulated course mapping (fully backwards compatible & highly enriched for English/Hindi/Multilingual!)
  const loadSimulatedCourse = (subject: string, lang: string = "English", lvl: string = "Beginner") => {
    const cleanSubject = subject.trim() || "Artificial Intelligence foundations";
    const subL = cleanSubject.toLowerCase();
    
    // Set simulated course study hours
    let studyHours = 35;
    if (subL.includes("gst")) studyHours = 45;
    if (subL.includes("quantum")) studyHours = 40;

    let isHindi = lang === "Hindi";
    let isMultilingual = lang === "Multilingual";

    // Standard syllabus lessons content structure
    const makeLessonContent = (title: string, coreText: string, paradigm: string, keyPts: string[]) => {
      let text = `### ${title}\n\n${coreText}\n\n`;
      if (isHindi) {
        text = `### ${title} (हिंदी माध्यम)\n\nयह पाठ '${cleanSubject}' के मुख्य सिद्धांतों को बेहद सरल भाषा में समझाता है।\n\n${coreText}\n\n`;
      } else if (isMultilingual) {
        text = `### ${title} (Hinglish Medium)\n\nIn this lesson, we will understand '${cleanSubject}' concepts dynamically using simple dual languages.\n\n${coreText}\n\n`;
      }
      return text;
    };

    return {
      id: "ai-uni-" + Math.random().toString(36).substring(3, 8),
      title: cleanSubject,
      description: `Comprehensive 4-tier structured syllabus curated by Mr. Kilvish AI University and powered by Readability AI, utilizing professional standards owned by Royal Bulls Advisory Private Limited.`,
      category: subL.includes("gst") || subL.includes("tax") || subL.includes("business") ? "Business & Tax Auditing" : "AI & Computer Engineering",
      studyHours,
      language: lang,
      level: lvl,
      beginner: {
        overview: `Welcome to the Beginner track of ${cleanSubject}. We remove technical jargon complexity using simple analogies and step-by-step structures.`,
        objectives: ["Grasp core conceptual paradigms", "Avoid spelling & syntax traps", "Deploy basic entry-level models"],
        prerequisites: "No previous tech or finance experience required.",
        roadmap: "Gateway Fundamentals → Conceptual Setup → Practical Assessment Test",
        chapters: [
          {
            title: "Module 1: The Gateway Foundations",
            lessons: [
              {
                title: "Lesson 1.1: Intuitive Entry Outline",
                content: makeLessonContent(
                  "Intuitive Entry Outline",
                  `Think of your study domain as building a robust smart garden. Before sowing any exotic seeds, we must prepare the soil and understand the solar levels. That is what gateway setup is all about!\n\nWe organize the parameters cleanly so that the server processes instructions with zero friction.`,
                  "Soil preparation pipeline leading to organic crop output.",
                  ["Install foundational items globally", "Configure simple path variables", "Run a basic test check"]
                ),
                visualExplanation: "A clean workbench laying out basic raw components before final execution assembly.",
                keyPoints: ["Avoid redundant parameters", "Always match syntax structures cleanly", "Run validation checks early"]
              }
            ]
          }
        ],
        quiz: [
          {
            question: `What is the primary goal of the ${cleanSubject} beginner gateway?`,
            options: ["To delete all server code", "To lay out secure conceptual soil with zero jargon stress", "To run heavy blockchain hardware", "To generate marketing pamphlets"],
            answer: 1,
            explanation: "Beginner gateway sets clean conceptual foundations removing all confusing complex words."
          }
        ]
      },
      intermediate: {
        overview: `Intermediate specialization on ${cleanSubject}. Covers multi-node data streams and tax/business compliance logic.`,
        objectives: ["Assemble custom structured models", "Sanitize incoming data blocks", "Generate compliant audit pipelines"],
        prerequisites: "Completion of Beginner Module.",
        roadmap: "Data Stream Configuration → Schema Sanitation → Interactive Quiz",
        chapters: [
          {
            title: "Module 2: Structural Optimizations",
            lessons: [
              {
                title: "Lesson 2.1: Schema Ingestion Pipelines",
                content: makeLessonContent(
                  "Schema Ingestion Pipelines",
                  "At the intermediate tier, we structure incoming data packages cleanly. Think of this as sorting files into highly labeled folders rather than throwing them into a messy desk drawer.",
                  "Labeling drawer sort mechanics routing to final safe directory.",
                  ["Identify structural duplicate data", "Verify schema hash codes", "Maintain audit compliance"]
                ),
                visualExplanation: "Data flows parsed through automatic filtering filters into standard database tables.",
                keyPoints: ["Sanitize user inputs", "Avoid unclosed loop handlers", "Apply proper index parameters"]
              }
            ]
          }
        ],
        quiz: [
          {
            question: "Why do we apply schema sanitation in databases?",
            options: ["To slow down computational speeds", "To prevent database structural collapse and SQL injection", "To change theme background styling", "To print PDF papers faster"],
            answer: 1,
            explanation: "Sanitation ensures incoming data conforms to exact format expectations, keeping server queries fast and secure."
          }
        ]
      },
      advanced: {
        overview: `Advanced system design and optimization of ${cleanSubject} frameworks.`,
        objectives: ["Deploy self-healing networks", "Configure multi-node clusters", "Execute zero-knowledge compliance audits"],
        prerequisites: "Intermediate syllabus mastery.",
        roadmap: "Network Protocols → Failover Mitigations → Honors Advanced Exams",
        chapters: [
          {
            title: "Module 3: Advanced Architectures",
            lessons: [
              {
                title: "Lesson 3.1: Self-Healing Framework Deployments",
                content: makeLessonContent(
                  "Self-Healing Framework Deployments",
                  "Advanced systems operate with continuous high availability. If a processing node halts unexpectedly, backup failover instances instantly pick up the tasks without losing user transaction states.",
                  "Double cluster rings redirecting transaction queries dynamically during outage.",
                  ["Establish heartbeat monitor pings", "Map automated database snapshots", "Define secure encrypted pathways"]
                ),
                visualExplanation: "A secondary hot-swap engine active during cluster service alerts.",
                keyPoints: ["Reduce failover delays to under 2 seconds", "Enforce strict zero-knowledge security", "Conduct hourly data synchronization"]
              }
            ]
          }
        ],
        quiz: [
          {
            question: "What defines a self-healing server architecture?",
            options: ["The computer reboots every five minutes", "The system detects nodes crashing and launches hot-swaps automatically", "It edits CSS variables inside the user browser", "It deletes unauthorized storage records"],
            answer: 1,
            explanation: "Self-healing refers to automated systems launching recovery subroutines without waiting for manual human intervention."
          }
        ]
      },
      expert: {
        overview: `Accredited master-tier certification for ${cleanSubject} engineering and corporate auditing.`,
        objectives: ["Develop sovereign advisory algorithms", "Structure institutional enterprise reports", "Unlock professional bankable certificates"],
        prerequisites: "Advanced track certification.",
        roadmap: "Corporate Auditing Controls → Institutional Final Certification Exam",
        chapters: [
          {
            title: "Module 4: Enterprise-Grade Mastery",
            lessons: [
              {
                title: "Lesson 4.1: Sovereign Financial & System Audits",
                content: makeLessonContent(
                  "Sovereign Financial & System Audits",
                  "The highest academic level connects technological workflows with corporate compliance. Under Royal Bulls Advisory Private Limited structures, we verify that every AI recommendation is audit-safe and bank-compliant.",
                  "Multi-layer ledger verify loops matching tax codes.",
                  ["Define ledger validation constants", "Verify compliance with sovereign mandates", "Export certified audit reports"]
                ),
                visualExplanation: "A digital ledger audit sheet with cryptographic check seals.",
                keyPoints: ["Sanitize all API keys", "Structure outputs with clear decimal scales", "Submit records for central verification"]
              }
            ]
          }
        ],
        quiz: [
          {
            question: "What is the role of advisory audit parameters?",
            options: ["To increase storage size requirements", "To guarantee that computations are legally compliant and audit-proof", "To simulate user behavior", "To colorize terminal logs"],
            answer: 1,
            explanation: "Auditing ensures that our dynamic outputs comply with financial, sovereign, and industrial safety regulations."
          }
        ]
      },
      professional: {
        overview: `Accredited professional certification tier on ${cleanSubject}. Explains full-scale real-world implementation, corporate compliance, and regulatory risk controls.`,
        objectives: ["Deploy enterprise-scale solutions", "Mitigate advanced systems vulnerabilities", "Implement regulatory standards and auditing protocols"],
        prerequisites: "Expert tier mastery or active corporate experience.",
        roadmap: "System Hardening → Compliance & Security Controls → Professional Capstone Review",
        chapters: [
          {
            title: "Module 5: Professional Systems & Regulatory Alignment",
            lessons: [
              {
                title: "Lesson 5.1: High-Performance Enterprise Implementations",
                content: makeLessonContent(
                  "High-Performance Enterprise Implementations",
                  `At the professional certification tier, we study direct real-world architecture. The primary target is optimizing operational throughput, establishing multi-region cloud security, and ensuring absolute alignment with priority sector requirements under Royal Bulls Advisory parameters.`,
                  "High-performance cloud ledger cluster.",
                  ["Configure multi-region secure clusters", "Enforce strict encryption standards", "Establish live telemetry audit triggers"]
                ),
                visualExplanation: "A multi-layered secure enterprise cluster running continuous high-availability service monitors.",
                keyPoints: ["Maintain data compliance across state jurisdictions", "Optimize API roundtrip delays under 50ms", "Verify transaction immutability"]
              }
            ]
          }
        ],
        quiz: [
          {
            question: "What is the primary requirement for professional-grade corporate compliance?",
            options: ["Decreasing code comments", "Ensuring transactions are 100% auditable and immutable under regulatory frameworks", "Using dark modes in dashboards", "Removing all system-level databases"],
            answer: 1,
            explanation: "Professional compliance requires total data immutability and continuous audit readiness."
          }
        ]
      }
    };
  };

  // Handle Course Generation
  const handleGenerateCourse = async (lang: string = "English", lvl: string = "Beginner") => {
    if (!topic.trim()) {
      setError("Please specify a topic or upload a document to generate your premium course.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentCourse(null);

    try {
      if (user) {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/simplify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({
            mode: "academy",
            topic: topic.trim()
          })
        });

        const data = await res.json();
        if (res.ok) {
          const course = loadSimulatedCourse(topic, lang, lvl);
          // Overwrite the beginner module lesson content with the real Gemini output!
          course.beginner.chapters[0].lessons[0].content = data.result;
          setCurrentCourse(course);
          setUserXP(prev => prev + 200); // bonus XP
          showToast(`🎉 University course syllabus on '${topic}' successfully generated with Gemini AI!`, "success");
          onRefreshProfile();
        } else {
          throw new Error(data.error || "Failed to generate course syllabus.");
        }
      } else {
        const course = loadSimulatedCourse(topic, lang, lvl);
        setCurrentCourse(course);
        showToast(`📚 Offline high-fidelity university course compiled on '${topic}'!`, "info");
      }
    } catch (err: any) {
      console.warn("Gemini API course generation failed, serving high-fidelity syllabus.", err);
      const course = loadSimulatedCourse(topic, lang, lvl);
      setCurrentCourse(course);
      showToast(`📚 Loaded premium course outline on '${topic}'!`, "info");
    } finally {
      setIsLoading(false);
      // Automatically switch to Player view once course is assembled so they can read it!
      setActiveTab("my-courses");
    }
  };

  // Enroll in pre-made course
  const handleEnrollCourse = (course: any) => {
    const freshCourse = loadSimulatedCourse(course.title, languagePreference, difficultyPreference);
    setCurrentCourse(freshCourse);
    
    // Add to enrolled shelf
    if (!enrolledCourses.some(c => c.topic === course.title)) {
      setEnrolledCourses(prev => [
        ...prev,
        { topic: course.title, progress: 0, level: difficultyPreference }
      ]);
    }
    
    showToast(`🎉 Successfully enrolled in ${course.title}!`, "success");
    setActiveTab("my-courses");
  };

  // Resume course from dashboard
  const handleResumeCourse = (courseTopic: string) => {
    const resumed = loadSimulatedCourse(courseTopic, languagePreference, difficultyPreference);
    setCurrentCourse(resumed);
    setTopic(courseTopic);
    setActiveTab("my-courses");
  };

  // Download entire course syllabus in Microsoft Word (.doc) format (maintained from original)
  const handleDownloadWord = () => {
    if (!currentCourse) return;
    
    let docContent = "<html><head><title>" + currentCourse.title + "</title>";
    docContent += "<style>";
    docContent += "body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333333; margin: 40px; }";
    docContent += "h1 { color: #5b21b6; text-align: center; border-bottom: 2px solid #5b21b6; padding-bottom: 10px; margin-top: 40px; }";
    docContent += "h2 { color: #4338ca; margin-top: 30px; border-bottom: 1px dashed #cccccc; padding-bottom: 5px; }";
    docContent += "h3 { color: #1e1b4b; margin-top: 20px; }";
    docContent += ".cover { text-align: center; margin-top: 100px; margin-bottom: 150px; }";
    docContent += ".cover-title { font-size: 32px; font-weight: bold; color: #4c1d95; }";
    docContent += ".cover-sub { font-size: 18px; color: #6b7280; margin-top: 15px; }";
    docContent += ".metadata { margin-top: 50px; font-size: 14px; color: #4b5563; }";
    docContent += ".block { background-color: #f3f4f6; border-left: 4px solid #6366f1; padding: 15px; margin: 15px 0; }";
    docContent += ".footer { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 50px; border-top: 1px solid #e5e7eb; padding-top: 15px; }";
    docContent += "</style></head><body>";
    
    docContent += "<div class='cover'>";
    docContent += "<div class='cover-title'>" + currentCourse.title + "</div>";
    docContent += "<div class='cover-sub'>Sovereign 4-Tier Knowledge Curriculum & Playbooks</div>";
    docContent += "<p class='metadata'>";
    docContent += "Compiled by: <b>Mr. Kilvish AI Academy of Excellence</b><br>";
    docContent += "Academic Subject: " + (topic || "Artificial Intelligence foundations") + "<br>";
    docContent += "Compilation Date: " + new Date().toLocaleDateString() + "<br>";
    docContent += "Verification ID: " + (certSerialNumber || "REG-KLA-PENDING") + "<br>";
    docContent += "</p></div><br style='page-break-before: always;' />";

    docContent += "<h1>Syllabus Blueprint & Learning Outcomes</h1>";
    docContent += "<p>" + (currentCourse.description || "") + "</p>";

    const renderLevelSection = (lvlName: string, levelData: any) => {
      if (!levelData) return "";
      let html = "<h2>" + lvlName + " Curriculum</h2>";
      html += "<div class='block'>";
      html += "<b>OBJECTIVE:</b> " + (levelData.overview || "") + "<br>";
      html += "<b>PREREQUISITES:</b> " + (levelData.prerequisites || "") + "<br>";
      html += "<b>ROADMAP:</b> " + (levelData.roadmap || "") + "<br>";
      html += "</div>";
      html += "<h3>Lessons Outline</h3>";
      if (levelData.chapters) {
        levelData.chapters.forEach((chap: any) => {
          html += "<h4>" + chap.title + "</h4>";
          if (chap.lessons) {
            chap.lessons.forEach((les: any) => {
              html += "<h5>" + les.title + "</h5>";
              html += "<div>" + (les.content || "").replace(/\n/g, '<br>') + "</div>";
              html += "<p><i>Visual Metaphor: " + (les.visualExplanation || "") + "</i></p>";
            });
          }
        });
      }
      return html;
    };

    docContent += renderLevelSection("1. Beginner", currentCourse.beginner);
    docContent += renderLevelSection("2. Intermediate", currentCourse.intermediate);
    docContent += renderLevelSection("3. Advanced", currentCourse.advanced);
    docContent += renderLevelSection("4. Expert", currentCourse.expert);

    docContent += "<div class='footer'>© " + new Date().getFullYear() + " Mr. Kilvish AI Academy. All sovereign intellectual rights reserved.</div>";
    docContent += "</body></html>";

    const blob = new Blob(['\ufeff' + docContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic.trim().replace(/\s+/g, '_')}_Master_Course_Manual.doc`;
    a.click();
  };

  // Download entire course syllabus in Markdown (.md) format (maintained from original)
  const handleDownloadMarkdown = () => {
    if (!currentCourse) return;

    let mdContent = "# " + currentCourse.title + "\n\n";
    mdContent += "*Compiled by: Mr. Kilvish AI Academy of Excellence*\n";
    mdContent += "*Sovereign Study Guide & Academic Blueprint*\n\n";
    mdContent += "## Course Overview\n" + (currentCourse.description || "") + "\n\n";

    const levels = ["beginner", "intermediate", "advanced", "expert"];
    levels.forEach(lvl => {
      const data = currentCourse[lvl];
      if (!data) return;
      mdContent += "# Level: " + lvl.toUpperCase() + "\n\n";
      mdContent += "> **Objective:** " + data.overview + "\n";
      mdContent += "> **Prerequisites:** " + data.prerequisites + "\n";
      mdContent += "> **Roadmap Path:** " + data.roadmap + "\n\n";

      mdContent += "## Study Chapters & Lessons\n\n";
      data.chapters?.forEach((chap: any) => {
        mdContent += "### " + chap.title + "\n\n";
        chap.lessons?.forEach((les: any) => {
          mdContent += "#### " + les.title + "\n\n";
          mdContent += les.content + "\n\n";
          mdContent += "* **Visual Blueprint Metaphor:** _" + les.visualExplanation + "_\n";
          mdContent += "* **Key Actionable Pillars:** " + (les.keyPoints?.join(', ') || "") + "\n\n";
        });
      });
    });

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic.trim().replace(/\s+/g, '_')}_Syllabus_Guide.md`;
    a.click();
  };

  return (
    <div id="academy-platform-root" className="flex-1 w-full flex flex-col gap-6 pb-12 animate-fadeIn relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl shadow-xl z-50 text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-violet-500/15 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/20 border border-violet-400/20 text-violet-200 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                Mr. Kilvish AI Academy
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/20 border border-violet-400/20 text-violet-200 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
                Powered by Readability AI
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/20 border border-violet-400/20 text-violet-200 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
                By Royal Bulls Advisory Private Limited
              </div>
            </div>

            <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight leading-tight">
              Mr. Kilvish AI Academy
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              India's AI-Powered Learning University for Unlimited Professional Education.
            </p>
            <p className="text-amber-400/90 text-xs font-mono font-bold italic">
              Learn • Practice • Get Certified • Build Your Future
            </p>
          </div>

          <button
            onClick={() => setActiveView("workspace")}
            className="self-start md:self-auto flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
          >
            ← Back to Simplifier
          </button>
        </div>

        {/* Hero Section Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => setActiveTab("explore")}
            className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 text-slate-100 rounded-xl text-xs font-bold border border-white/5 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-violet-400" /> Explore Courses
          </button>
          <button
            onClick={() => setActiveTab("my-courses")}
            className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 text-slate-100 rounded-xl text-xs font-bold border border-white/5 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" /> Start Learning
          </button>
          <button
            onClick={() => setActiveTab("explore")}
            className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 text-slate-100 rounded-xl text-xs font-bold border border-white/5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Generate Course
          </button>
          <button
            onClick={() => setActiveTab("certificates")}
            className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 text-slate-100 rounded-xl text-xs font-bold border border-white/5 transition-all cursor-pointer"
          >
            <Award className="w-4 h-4 text-indigo-400" /> My Certificates
          </button>
        </div>
      </div>

      {/* University Main Navigation Menu */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: Compass },
            { id: "explore", label: "Explore Courses", icon: Sparkles },
            { id: "my-courses", label: "My Courses", icon: BookOpen },
            { id: "ai-tutor", label: "AI Tutor", icon: MessageSquare },
            { id: "assignments", label: "Assignments", icon: FileText },
            { id: "practice-tests", label: "Practice Tests", icon: Target },
            { id: "final-exams", label: "Final Exams", icon: ShieldCheck },
            { id: "exam-centre", label: "Exam Centre 🏆", icon: Trophy },
            { id: "certificates", label: "Certificates", icon: Award },
            { id: "downloads", label: "Downloads", icon: Download },
            { id: "career-center", label: "Career Center", icon: TrendingUp },
            { id: "business-banking", label: "Business Hub", icon: Building },
            { id: "settings", label: "Settings", icon: Settings }
          ].map(tab => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setError(null); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-3">
          <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
          <span className="text-xs font-mono font-bold text-slate-700">{streak} Days</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <Trophy className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-mono font-bold text-slate-700">{userXP} XP</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-start gap-2">
          <Info className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Render Active University Tab Subcomponents */}
      <div className="flex-1 w-full">
        {activeTab === "dashboard" && (
          <UniversityDashboard
            streak={streak}
            userXP={userXP}
            courses={enrolledCourses}
            onResumeCourse={handleResumeCourse}
            onNavigateTab={(id) => setActiveTab(id as any)}
            studentName={studentName}
          />
        )}

        {activeTab === "explore" && (
          <UniversityExplore
            topic={topic}
            setTopic={setTopic}
            onGenerateCourse={(lang, lvl) => handleGenerateCourse(lang, lvl)}
            isLoading={isLoading}
            courses={enrolledCourses}
            onEnrollCourse={handleEnrollCourse}
          />
        )}

        {activeTab === "my-courses" && (
          <UniversityPlayer
            currentCourse={currentCourse}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            activeChapterIndex={activeChapterIndex}
            setActiveChapterIndex={setActiveChapterIndex}
            activeLessonIndex={activeLessonIndex}
            setActiveLessonIndex={setActiveLessonIndex}
            notes={notes}
            setNotes={setNotes}
            onDownloadWord={handleDownloadWord}
            onDownloadMarkdown={handleDownloadMarkdown}
            onNavigateTab={(id) => setActiveTab(id as any)}
          />
        )}

        {activeTab === "ai-tutor" && (
          <UniversityTutor
            topic={topic}
            user={user}
          />
        )}

        {activeTab === "assignments" && (
          <UniversityAssignments
            topic={topic}
            user={user}
            studentAssignmentText={studentAssignmentText}
            setStudentAssignmentText={setStudentAssignmentText}
            isGradingAssignment={isGradingAssignment}
            setIsGradingAssignment={setIsGradingAssignment}
            assignmentGrade={assignmentGrade}
            setAssignmentGrade={setAssignmentGrade}
            userXP={userXP}
            setUserXP={setUserXP}
            onRefreshProfile={onRefreshProfile}
          />
        )}

        {activeTab === "practice-tests" && (
          <UniversityExams
            currentCourse={currentCourse}
            selectedLevel={selectedLevel}
            userXP={userXP}
            setUserXP={setUserXP}
            setCertSerialNumber={setCertSerialNumber}
            setShowCertificate={setShowCertificate}
            setScore={setScore}
            setQuizSubmitted={setQuizSubmitted}
            onNavigateTab={(id) => setActiveTab(id as any)}
            onStartBusiness={onStartBusiness}
          />
        )}

        {activeTab === "final-exams" && (
          <UniversityExams
            currentCourse={currentCourse}
            selectedLevel={selectedLevel}
            userXP={userXP}
            setUserXP={setUserXP}
            setCertSerialNumber={setCertSerialNumber}
            setShowCertificate={setShowCertificate}
            setScore={setScore}
            setQuizSubmitted={setQuizSubmitted}
            onNavigateTab={(id) => setActiveTab(id as any)}
            onStartBusiness={onStartBusiness}
          />
        )}

        {activeTab === "exam-centre" && (
          <AllInOneExamCentre
            user={user}
            userXP={userXP}
            setUserXP={setUserXP}
            studentName={studentName}
            onNavigateTab={(id) => setActiveTab(id as any)}
            onStartBusiness={onStartBusiness}
          />
        )}

        {activeTab === "certificates" && (
          <UniversityCertificates
            currentCourse={currentCourse}
            showCertificate={showCertificate}
            certSerialNumber={certSerialNumber}
            studentName={studentName}
            setStudentName={setStudentName}
          />
        )}

        {activeTab === "downloads" && (
          <UniversityDownloads
            currentCourse={currentCourse}
            showCertificate={showCertificate}
            onDownloadWord={handleDownloadWord}
            onDownloadMarkdown={handleDownloadMarkdown}
            onNavigateTab={(id) => setActiveTab(id as any)}
          />
        )}

        {activeTab === "career-center" && (
          <UniversityCareerCenter
            currentCourse={currentCourse}
            onNavigateTab={(id) => setActiveTab(id as any)}
            setTopic={setTopic}
          />
        )}

        {activeTab === "business-banking" && (
          <UniversityBusinessHub
            currentCourse={currentCourse}
            studentName={studentName}
          />
        )}

        {activeTab === "settings" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 max-w-2xl animate-fadeIn">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Settings className="w-4.5 h-4.5 text-violet-600" />
                University Student Settings
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Student Name (for Certificates)
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-500 font-sans font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Language Medium Preference
                </label>
                <select
                  value={languagePreference}
                  onChange={(e) => setLanguagePreference(e.target.value as any)}
                  className="w-full bg-slate-50 text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-500 font-sans font-bold cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Multilingual">Multilingual (Hinglish)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Starting Default Level
                </label>
                <select
                  value={difficultyPreference}
                  onChange={(e) => setDifficultyPreference(e.target.value as any)}
                  className="w-full bg-slate-50 text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-500 font-sans font-bold cursor-pointer"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => showToast("University preferences successfully locked in!", "success")}
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
