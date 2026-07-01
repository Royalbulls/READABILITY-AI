import React, { useState, useEffect, useRef } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Sparkles, 
  Flame, 
  Target, 
  Award, 
  Bookmark, 
  FileText, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Compass, 
  HelpCircle, 
  Eye, 
  ChevronRight, 
  Download, 
  Edit, 
  Play, 
  Users, 
  Heart, 
  MessageSquare, 
  RefreshCw, 
  Layers, 
  Info, 
  Check, 
  FileSpreadsheet, 
  BookMarked,
  Share2,
  Trash2,
  Lock,
  Star,
  Activity,
  Maximize2,
  Printer,
  X
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AcademyViewProps {
  user: any;
  userProfile: any;
  onRefreshProfile: () => void;
  setActiveView: (view: "workspace" | "pricing" | "growth" | "admin" | "business" | "academy" | "search") => void;
}

export default function AcademyView({ 
  user, 
  userProfile, 
  onRefreshProfile,
  setActiveView
}: AcademyViewProps) {
  // System States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "player" | "visualizer" | "leaderboard">("dashboard");
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced" | "expert">("beginner");

  // Course Data States
  const [currentCourse, setCurrentCourse] = useState<any | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  
  // Quiz and Quiz scoring states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Flipcard states
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<number[]>([]);

  // User Gamification states (stored locally to simulate real-time updates)
  const [userXP, setUserXP] = useState<number>(1250);
  const [streak, setStreak] = useState<number>(12);
  const [dailyGoals, setDailyGoals] = useState([
    { id: 1, text: "Complete 1 full chapter lesson", done: false, xp: 50 },
    { id: 2, text: "Master 5 term flashcards", done: false, xp: 30 },
    { id: 3, text: "Score 80%+ on any level quiz", done: false, xp: 100 }
  ]);
  const [notes, setNotes] = useState<string>("");
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [generatedHandbook, setGeneratedHandbook] = useState<string | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [certSerialNumber, setCertSerialNumber] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [studentAssignmentText, setStudentAssignmentText] = useState<string>("");
  const [isGradingAssignment, setIsGradingAssignment] = useState<boolean>(false);
  const [assignmentGrade, setAssignmentGrade] = useState<{ score: number; letter: string; feedback: string } | null>(null);

  // Visual Learning Engine States
  const [visualizationType, setVisualizationType] = useState<"mindmap" | "flowchart" | "tree" | "timeline" | "decision">("mindmap");
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  // Toast Notification State
  const [toast, setToast] = useState<{ type: "success" | "info" | "error"; message: string } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4500);
  };

  // SVG references for exporting
  const svgRef = useRef<SVGSVGElement>(null);

  // Achievements/Badges list
  const BADGES = [
    { id: "newbie", title: "First Ascent", desc: "Generated your first AI Course syllabus", icon: Award, color: "text-blue-500 bg-blue-50 border-blue-200", unlocked: true },
    { id: "streak3", title: "Habitual Scholar", desc: "Maintain a 3-day learning streak", icon: Flame, color: "text-amber-500 bg-amber-50 border-amber-200", unlocked: true },
    { id: "quiz_master", title: "Ultimate Recall", desc: "Scored 100% on an Expert quiz", icon: Trophy, color: "text-emerald-500 bg-emerald-50 border-emerald-200", unlocked: true },
    { id: "creator", title: "Knowledge Architect", desc: "Published a customized course", icon: Sparkles, color: "text-purple-500 bg-purple-50 border-purple-200", unlocked: false },
    { id: "viva_expert", title: "Declamator", desc: "Answered 15 Viva prep questions", icon: MessageSquare, color: "text-indigo-500 bg-indigo-50 border-indigo-200", unlocked: false }
  ];

  // Default simulated course mapping
  const loadSimulatedCourse = (subject: string) => {
    const cleanSubject = subject.trim() || "Artificial Intelligence";
    const subL = cleanSubject.toLowerCase();
    
    // Choose theme
    let theme = "general";
    if (subL.match(/(code|program|python|js|react|java|c\+\+|software|web|develop|html|css|tech|computer|node|backend|frontend|cyber|security|database)/)) {
      theme = "engineering";
    } else if (subL.match(/(gst|finance|tax|compliance|business|startup|money|marketing|sales|investment|accounting|economics|commerce|corporate|bank|loan)/)) {
      theme = "business";
    } else if (subL.match(/(science|physics|biology|chemistry|quantum|space|photosynthesis|math|medical|organic|astronomy|plant)/)) {
      theme = "science";
    }

    let beginner: any;
    let intermediate: any;
    let advanced: any;
    let expert: any;

    if (theme === "engineering") {
      beginner = {
        overview: `Welcome to the Beginner level of ${cleanSubject} Systems. Here, we demystify the core logical instructions, remove syntax intimidation, and focus on simple structural loops and basic execution models.`,
        objectives: [
          `Understand compiler pipelines and execution workflows.`,
          `Avoid common syntax bugs and spelling traps early on.`,
          `Configure your local workspace with zero friction.`
        ],
        prerequisites: "None. Open to all aspiring technical architects.",
        roadmap: "Local Workspace Setup → Fundamental Syntax Structures → Basic Logical Execution → Entry Level Assessment",
        chapters: [
          {
            title: "Module 1: The Workspace Gateway",
            lessons: [
              {
                title: "Lesson 1.1: Intuitive Local Environment setup",
                content: `### Setting up your environment for ${cleanSubject}\n\nThink of your computer as a highly specialized workshop. Before you start carving fine wooden sculptures, you need to sharpen your chisels and arrange your workbench. That is what setting up a 'local runtime environment' is all about!\n\nWe need to install the core compiler (or interpreter) and our IDE (Integrated Development Environment) to translate our simple human-readable instructions into secure machine commands.\n\n#### The Conveyor Belt Analogy:\nImagine running an automated assembly line. Code enters as raw blueprints, the interpreter acts as the foreman checking for mistakes, and the CPU acts as the worker fabricating the physical parts. Keep your assembly line clean!`,
                visualExplanation: "蓝图 (Blueprint) → 检查员 (Interpreter) → 执行者 (CPU) pipeline layout.",
                keyPoints: ["Install dependencies globally with care", "Keep path variables clean", "Always test with a simple 'Hello World' file first"]
              },
              {
                title: "Lesson 1.2: Standard Syntax & Common Spelling Traps",
                content: `### Banish Syntax Errors Forever\n\nWhen writing code for ${cleanSubject}, the computer is extremely literal. A misplaced semicolon, an unclosed brace, or a lowercase 'i' instead of uppercase 'I' can halt the entire process.\n\n*   **Variables**: Think of these as labeled jars on a kitchen shelf. If a jar is labeled 'Sugar', don't put salt in it!\n*   **Functions**: These are repeatable recipe cards. You supply the ingredients, and they yield the exact same baked dish every time.\n*   **Loops**: Repeatable instructions that continue spinning until a certain condition is met (e.g. 'Stir the soup until it boils').`,
                visualExplanation: "Standard data type jars and recipe card execution block.",
                keyPoints: ["Avoid redundant names", "Always match open brackets with closing brackets"]
              }
            ]
          }
        ],
        caseStudies: `### Case Study: Banishment of the Single Character Bug\n\nA global streaming platform suffered 45 minutes of server downtime because a junior engineer misspelled a single configuration key. By introducing automatic schema linters, they completely eliminated syntax anomalies and saved ₹4.5 Lakhs.`,
        flashcards: [
          { term: "The Runtime", definition: "The live container environment where your compiled programs execute and run operations." },
          { term: "The Compiler", definition: "A translation tool that converts human-readable high-level code into low-level computer instructions." },
          { term: "Syntax Error", definition: "A spelling or grammatical mistake in your code that makes it unreadable to the computer." }
        ],
        quiz: [
          {
            question: "What does the local environment compiler do?",
            options: [
              "It deletes all backup files",
              "It converts human code into secure computer instructions",
              "It optimizes screen brightness for developers",
              "It generates marketing templates"
            ],
            answer: 1,
            explanation: "The compiler is the core engine that parses code syntax and compiles it into machine instructions."
          },
          {
            question: "What is a Variable comparable to in everyday life?",
            options: [
              "A continuous stream of water",
              "A labeled storage jar containing specific items",
              "A heavy front door lock",
              "A map of the city streets"
            ],
            answer: 1,
            explanation: "Variables store specific types of data with a recognizable name label, exactly like labeled jars on a shelf."
          }
        ],
        assignments: "Write a short 150-word description of the differences between a Compiler and an Interpreter, using a simple translation analogy.",
        interviewPrep: [
          { question: "How do you explain compilation to a non-technical manager?", answer: "Compilation is translating a book written in Spanish into English ahead of time so the reader can read it smoothly without pausing to translate word-by-word." }
        ],
        vivaPrep: [
          { question: "What is the primary cause of a syntax error?", answer: "Spelling mistakes, unclosed parentheses, or violating the rigid grammatical rules of the programming language." }
        ],
        teacherGuide: "Draw a raw pipeline diagram on the whiteboard. Emphasize the differences between compile-time checks and run-time errors.",
        studentGuide: "Create your first 'Hello World' file, run it in the terminal, and intentionally break the spelling to observe the compiler error."
      };

      intermediate = {
        overview: `Transition from basic scripts into secure modular integrations, multi-channel data flow systems, and interface definitions.`,
        objectives: [
          `Connect isolated systems via structured APIs.`,
          `Calculate operational bandwidth and resolve pipeline bottlenecks.`
        ],
        prerequisites: "Comfort with basic syntax structures and runtime commands.",
        roadmap: "Module Declarations → API Connections → Bottleneck Analysis → Intermediate Exam",
        chapters: [
          {
            title: "Module 2: Structured APIs & Connectors",
            lessons: [
              {
                title: "Lesson 2.1: Designing Secure Handshakes",
                content: `### API Interfaces & Communication Handshakes\n\nIsolated scripts must communicate safely. An API (Application Programming Interface) acts as a restaurant waiter. You look at the menu, tell the waiter your order, and the waiter fetches it from the kitchen. You never enter the kitchen directly!\n\nThis keeps the kitchen secure and organized.`,
                visualExplanation: "Client Menu → Waiter (API) → Kitchen (Backend Database) handshake loop.",
                keyPoints: ["Never expose internal database credentials", "Structure payloads cleanly using standardized formats like JSON"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: Rebuilding the Booking Loop\n\nA ride-sharing application restructured their API connector queues. By introducing standardized JSON payload validation, they decreased reservation delays from 4 seconds to 12 milliseconds.",
        flashcards: [
          { term: "API Gateway", definition: "A centralized security gatekeeper that receives requests and routes them to appropriate backends." },
          { term: "JSON Payload", definition: "A lightweight, human-readable text standard used to pack and transmit structured database items." }
        ],
        quiz: [
          {
            question: "Why do we use an API instead of direct database access?",
            options: [
              "To make the application run slower",
              "To isolate the database and secure the system from direct intrusion",
              "To change the color themes of the web application",
              "To increase the count of server computers"
            ],
            answer: 1,
            explanation: "An API provides an abstract, secure layer of communication, preventing malicious entities from tampering with core records."
          }
        ],
        assignments: "Sketch a simple payload map representing a user profile with fields for name, role, and email.",
        interviewPrep: [
          { question: "Explain JSON in simple terms.", answer: "JSON is like a standardized shipping label with clear key-value pairs that any logistics carrier can read instantly." }
        ],
        vivaPrep: [
          { question: "What does API stand for?", answer: "Application Programming Interface." }
        ],
        teacherGuide: "Simulate a restaurant order roleplay with students to illustrate API request-response mechanics.",
        studentGuide: "Practice mapping out standard JSON parameters for a shopping cart checkout payload."
      };

      advanced = {
        overview: `Enter the realm of scaling, horizontal node replicas, self-healing architectures, and high-volume performance.`,
        objectives: [
          `Architect self-healing nodes that spin up under stress.`,
          `Implement high-availability load balancers.`
        ],
        prerequisites: "Fluent connection skills and database query understanding.",
        roadmap: "Load Balancing → Autoscaling triggers → Failover protocols → Advanced Exam",
        chapters: [
          {
            title: "Module 3: Scalability & High Availability",
            lessons: [
              {
                title: "Lesson 3.1: Self-healing System Loops",
                content: `### Autoscaling & Automated Failovers\n\nWhen a massive rush of users hits your system (e.g., Black Friday sales), a single server will crash under pressure. We must configure load balancers to distribute traffic and use autoscaling protocols to spin up brand new clones automatically.\n\nWhen the rush ends, the system automatically shuts down the extra clones to save cost.`,
                visualExplanation: "Telemetry Monitor → High CPU Warn → Spin up clone nodes → Balance traffic.",
                keyPoints: ["Set CPU thresholds at 75-80%", "Automate container replication"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: Surviving the Ticket Rush\n\nA ticketing startup introduced autoscaling replica groups. When a viral concert went live, 1.2 million users joined instantly; 45 container replicas booted within 15 seconds, securing 100% booking success.",
        flashcards: [
          { term: "Autoscaling", definition: "The process of automatically adding or removing computing resources based on real-time traffic volumes." },
          { term: "Load Balancer", definition: "A smart traffic director that sits in front of your servers and distributes requests evenly to prevent single-node crashes." }
        ],
        quiz: [
          {
            question: "What is the key benefit of a Load Balancer?",
            options: [
              "It stores user passwords securely",
              "It routes traffic evenly across multiple servers to prevent crashes",
              "It compiles typescript files",
              "It acts as a physical backup power battery"
            ],
            answer: 1,
            explanation: "A load balancer distributes requests across healthy backend instances, preventing any single machine from becoming a bottleneck."
          }
        ],
        assignments: "Draw a block diagram of a system using a Load Balancer in front of three server instances.",
        interviewPrep: [
          { question: "How do you justify the cost of high-availability setups?", answer: "The cost of running backup instances is minuscule compared to the massive losses, brand damage, and user anger of a prolonged system outage." }
        ],
        vivaPrep: [
          { question: "Define horizontal scaling.", answer: "Horizontal scaling means adding more machines (clones) to your network, as opposed to vertical scaling which means putting a bigger CPU/RAM inside one machine." }
        ],
        teacherGuide: "Use water pipeline metaphors to explain how a splitter divides water flow into multiple tubes.",
        studentGuide: "Draft threshold rules in your notebook for scaling up vs scaling down."
      };

      expert = {
        overview: `The highest tier of software craftsmanship. Master Zero-Trust micro-perimeters, end-to-end cryptography, and global secure networks.`,
        objectives: [
          `Eliminate security assumptions and verify everything.`,
          `Configure secure cryptographic keys for distributed nodes.`
        ],
        prerequisites: "Perfect scores on advanced materials or extensive industry deployment.",
        roadmap: "Zero-Trust Philosophy → Cryptographic Keys → Global Isolation → Expert Final Board Exam",
        chapters: [
          {
            title: "Module 4: Zero-Trust Sovereign Architectures",
            lessons: [
              {
                title: "Lesson 4.1: Continuous Cryptographic Verification",
                content: `### The Core Axiom of Zero-Trust\n\nTraditional network security is like a castle with a huge moat: once someone gets inside, they can roam freely and steal everything. Zero-Trust completely throws this out!\n\nInstead, Zero-Trust is like a high-security research facility where *every single door* requires a separate fingerprint scan, security card, and authorization token. We assume the castle has already been breached, and protect every individual micro-perimeter.`,
                visualExplanation: "Double security check at every room door, completely ignoring general perimeter pass.",
                keyPoints: ["Never trust default local networks", "Encrypt data both at rest and in transit", "Adopt granular role-based access rules"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: High-Security Banking Upgrade\n\nA central financial cooperative migrated to a Zero-Trust perimeter scheme. During a major cyber intrusion event, hackers got a basic login token but were instantly blocked from moving laterally, saving ₹18 Crores in deposits.",
        flashcards: [
          { term: "Zero-Trust", definition: "A security framework where no device or user is trusted by default, requiring continuous validation at every step." },
          { term: "Micro-segmentation", definition: "Dividing a network into tiny, isolated zones to prevent attackers from moving laterally after a breach." }
        ],
        quiz: [
          {
            question: "What is the fundamental philosophy of Zero-Trust security?",
            options: [
              "Trust employees but verify external users",
              "Never trust, always verify, assume breach status",
              "Allow free access inside the local Wi-Fi",
              "Encrypt data only when it is stored on cloud drives"
            ],
            answer: 1,
            explanation: "Zero-Trust assumes that threats exist both inside and outside the perimeter; hence, every single device and request must be continuously authenticated."
          }
        ],
        assignments: "Write a brief 250-word security proposal explaining why a company should not trust its own internal office Wi-Fi network.",
        interviewPrep: [
          { question: "How do you introduce Zero-Trust to non-tech executives?", answer: "I explain that it's like setting up digital security keypads on every drawer inside the bank, rather than just relying on the security guard at the front entrance." }
        ],
        vivaPrep: [
          { question: "What is lateral movement?", answer: "Lateral movement is when a cyber attacker gains access to one low-security computer and uses it to jump across to high-security database servers inside the same network." }
        ],
        teacherGuide: "Compare network perimeters to airport boarding protocols (constant passport checks) versus a simple movie theater ticket check.",
        studentGuide: "Draw a multi-room floor plan showing separate security locks for the safe, file-cabinets, and pantry."
      };
    } else if (theme === "business") {
      beginner = {
        overview: `Welcome to the Beginner level of ${cleanSubject} Systems. Master the fundamental ledgers, transaction taxations, and early-stage startup compliance frameworks.`,
        objectives: [
          `Demystify GST rules, tax brackets, and compliance requirements.`,
          `Set up your basic accounting books with pristine clarity.`,
          `Avoid common administrative registry traps for micro-enterprises.`
        ],
        prerequisites: "None. Open to all ambitious entrepreneurs and advisors.",
        roadmap: "Registry and Onboarding → Taxation Foundations → Simple Accounting Bookkeeping → Core Assessment",
        chapters: [
          {
            title: "Module 1: The Entrepreneurial Entryway",
            lessons: [
              {
                title: "Lesson 1.1: MSME & GST Registration Secrets",
                content: `### Registering Your Enterprise for ${cleanSubject}\n\nThink of starting a business like entering a major public sports tournament. Before you can play on the field, you must register your team, collect your jersey number, and agree to follow the tournament rules. That is what MSME (Micro, Small & Medium Enterprises) registry and GST (Goods and Services Tax) are all about!\n\nBy registering under the official MSME registry, you gain access to low-interest bank loans, matching government subsidies, and deep compliance protection.\n\n#### The Tax Reservoir Analogy:\nImagine running a water distribution cooperative. Instead of everyone charging separate, chaotic fees, the government sets up a standard meter. That's GST! It consolidates multiple messy taxes into a single, clean reservoir.`,
                visualExplanation: "Centralized tax stream dividing cleanly into local and national shares.",
                keyPoints: ["Always register under MSME (Udyam) for interest concessions", "Understand your GST registration threshold (e.g., ₹20-40 Lakhs turnover)"]
              },
              {
                title: "Lesson 1.2: Essential Ledgers & The Single Source of Truth",
                content: `### Double-Entry Bookkeeping Demystified\n\nIn business operations for ${cleanSubject}, tracking every single rupee is vital. Never mix personal expenses with company capital!\n\n*   **The Journal**: A daily chronological log of every incoming transaction and outgoing cost. It is your business diary.\n*   **The General Ledger**: The structured master summary that sorts journal entries into clear categories (e.g. Sales, Rent, Travel, Hardware).\n*   **Tax Liability account**: A separate reserve pocket where you set aside GST collected, ensuring you never spend tax money as profit.`,
                visualExplanation: "Daily Journal entries feeding into clean categorical Ledger drawers.",
                keyPoints: ["Reconcile books weekly", "Keep physical receipt scans securely stored in cloud drives"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: Banishment of the Auditing Nightmare\n\nA small manufacturing venture faced a tax penalty due to mixed accounting files. By separating personal expenses, applying automated GST filing ledgers, and registering their MSME status, they saved ₹1.2 Lakhs in auditing fees and qualified for an immediate 9.5% p.a. bank expansion loan.",
        flashcards: [
          { term: "MSME (Udyam)", definition: "An official government registry for Indian micro, small, and medium businesses that unlocks loans and subsidies." },
          { term: "GST Composition", definition: "A simplified tax scheme designed for small businesses with turnovers under ₹1.5 Crores, reducing filing paperwork." },
          { term: "General Ledger", definition: "The master database of accounts summarizing all company financial logs by separate categories." }
        ],
        quiz: [
          {
            question: "What is the primary benefit of registering your business under MSME Udyam?",
            options: [
              "It makes your office look cleaner",
              "It unlocks low-interest bank loans and government subsidies",
              "It increases your local electricity bill",
              "It allows you to bypass tax filings entirely"
            ],
            answer: 1,
            explanation: "MSME registration is a highly beneficial credential that guarantees low-interest rates, tender preferences, and subsidy support."
          },
          {
            question: "Why should you maintain a separate Tax Liability account?",
            options: [
              "To hide profits from partners",
              "To ensure tax money collected is never accidentally spent as company profit",
              "To store marketing image assets",
              "To pay for employee cafeteria lunches"
            ],
            answer: 1,
            explanation: "Isolating tax money ensures you are fully prepared to file returns without draining active working capital."
          }
        ],
        assignments: "Write a short 150-word description explaining why mixing personal bank accounts with business cash flows is a severe risk.",
        interviewPrep: [
          { question: "How do you explain the difference between revenue and profit?", answer: "Revenue is the total cash entering your store registers; profit is what remains in your pocket after paying for materials, rent, taxes, and salaries." }
        ],
        vivaPrep: [
          { question: "What is double-entry bookkeeping?", answer: "A financial system where every transaction is logged as both a debit (giving value) and a credit (receiving value), ensuring perfect balance sheets." }
        ],
        teacherGuide: "Create a mock lemonade stand ledger on the board. Work through a basic transaction containing 18% GST.",
        studentGuide: "Set up a clean mock spreadsheet log for your business, creating columns for Date, description, Category, and Tax."
      };

      intermediate = {
        overview: `Master the logistics of fiscal ratios, debt-equity configurations, and institutional capital fundraising formats.`,
        objectives: [
          `Calculate debt service coverage ratios (DSCR) for bank loan approvals.`,
          `Analyze working capital requirements and manage cash flow burn rates.`
        ],
        prerequisites: "Solid understanding of ledgers and tax filing brackets.",
        roadmap: "Amortization Math → Burn-Rate Calculations → Debt-Equity Structuring → Intermediate Quiz",
        chapters: [
          {
            title: "Module 2: Structured Corporate Finance & Debt",
            lessons: [
              {
                title: "Lesson 2.1: Managing Institutional Debt",
                content: `### Debt-Equity Ratios & Bank Loan Feasibility\n\nWhen scaling your business, you need capital. Banks supply low-cost debt, but they require a safety cushion. A standard debt-equity ratio is 70:30, meaning you provide 30% of the cost (Promoter contribution), and the bank lends the remaining 70%.\n\nTo approve the loan, banks calculate your DSCR (Debt Service Coverage Ratio) to prove your operating profit can comfortably pay off the monthly installments.`,
                visualExplanation: "Operating Income Drawer → Loan Payment (Safe 1.85x DSCR multiplier) → Surplus Reserve.",
                keyPoints: ["Target a DSCR above 1.5 for easy bank clearance", "Never borrow more than your projected cash flows can service"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: Scaling with the 70:30 Rule\n\nA logistics provider applied for a ₹10.5 Lakh loan to buy delivery vehicles. By showing a strong 1.85 DSCR and providing a clear 5-year repayment outline, they secured approval within 48 hours at a 9.5% p.a. interest rate.",
        flashcards: [
          { term: "DSCR Ratio", definition: "Debt Service Coverage Ratio, measuring a business's ability to pay off loans with its operating profits." },
          { term: "Working Capital", definition: "The cash resource cushion needed to handle daily operating expenses like rent and salaries before customers pay." }
        ],
        quiz: [
          {
            question: "What does a DSCR ratio of 1.85 mean to a bank?",
            options: [
              "The business is losing money quickly",
              "The business has 1.85 times the operating income needed to cover its monthly loan payments",
              "The interest rate will double in 1.85 months",
              "The company should fire 1.85% of its workforce"
            ],
            answer: 1,
            explanation: "A DSCR above 1.0 means positive safety; 1.85 indicates a highly secure, profitable enterprise easily capable of repaying debts."
          }
        ],
        assignments: "Calculate the required promoter contribution for a ₹20 Lakh project cost under a strict 70:30 debt-equity standard.",
        interviewPrep: [
          { question: "How do you explain DSCR to a prospective investor?", answer: "It is the proof that our monthly profits are nearly double our monthly loan obligations, making default virtually impossible." }
        ],
        vivaPrep: [
          { question: "What is a Debt-Equity Ratio?", answer: "The proportion of total project funding provided by bank loans (debt) versus the founders' own capital contribution (equity)." }
        ],
        teacherGuide: "Guide students through an amortization formula. Show them how interest rates behave over a 5-year period.",
        studentGuide: "Practice calculating different promoter contribution tiers for hypothetical business expansion proposals."
      };

      advanced = {
        overview: `Dive into detailed financial models, revenue forecast algorithms, and break-even analysis formulas for equity markets.`,
        objectives: [
          `Build 5-year dynamic profit and loss projection sheets.`,
          `Establish exact unit economics and calculate your break-even point.`
        ],
        prerequisites: "Fluent bookkeeping and loan repayment calculation skills.",
        roadmap: "P&L Projection → Unit Economics → Break-Even Formulas → Advanced Assessment",
        chapters: [
          {
            title: "Module 3: P&L Models & Unit Economics",
            lessons: [
              {
                title: "Lesson 3.1: Reaching the Break-Even Milestone",
                content: `### Master the Break-Even Formula\n\nMany businesses make sales but still go bankrupt because they do not understand fixed vs variable costs. Fixed costs (e.g. Rent, Server fees) stay identical regardless of sales volume, while Variable costs (e.g. ingredients, shipping) scale with every unit.\n\nYour Break-Even Point is the exact volume of units you must sell to cover ALL fixed costs and start generating net profits!`,
                visualExplanation: "Fixed Rent Floor + Variable Units Staircase = Total Cost line crossing Revenue line.",
                keyPoints: ["Calculate unit contribution margin first", "Focus heavily on reducing overhead fixed costs early on"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: Reaching Break-Even in Month 14\n\nA gourmet cloud kitchen spent ₹2.5 Lakhs monthly on rent and tools. By increasing their individual order margins by 12% and optimizing delivery routes, they shifted their break-even target from 1,200 orders to 800, hitting full profitability in Month 14.",
        flashcards: [
          { term: "Fixed Costs", definition: "Overhead expenses that remain constant regardless of whether you make zero sales or a million sales." },
          { term: "Contribution Margin", definition: "The selling price of a unit minus its direct variable costs, representing cash available to cover overhead fixed costs." }
        ],
        quiz: [
          {
            question: "How do you calculate the Break-Even Point?",
            options: [
              "By dividing total revenue by variable expenses",
              "By dividing total fixed overhead costs by the unit contribution margin",
              "By multiplying marketing costs by total employee counts",
              "By matching current bank balance with projected loan amounts"
            ],
            answer: 1,
            explanation: "Dividing fixed overhead costs by the unit margin tells you exactly how many units must be sold to cover all expenses and break even."
          }
        ],
        assignments: "If your monthly fixed rent is ₹50,000 and your contribution margin per unit is ₹100, calculate your break-even unit volume.",
        interviewPrep: [
          { question: "What happens to your break-even point if rent increases?", answer: "If fixed overhead costs increase, the break-even point shifts higher, meaning we must sell more units to survive." }
        ],
        vivaPrep: [
          { question: "Define Variable Costs.", answer: "Expenses that change in direct proportion to production volume, such as raw materials, packaging, and transaction swipe fees." }
        ],
        teacherGuide: "Illustrate a classic break-even chart on the chalkboard, marking the loss zone, profit zone, and equilibrium cross point.",
        studentGuide: "Map out your startup's fixed overhead costs and compare them to your expected variable margins."
      };

      expert = {
        overview: `Architect global corporate scale, orchestrate exit strategies (IPO/M&A), and deploy sovereign capital asset portfolios.`,
        objectives: [
          `Lead complex institutional mergers and equity diluting fundraising rounds.`,
          `Implement tax-optimized sovereign holdings structures.`
        ],
        prerequisites: "Perfect scores on advanced modeling exams or successful startup exit history.",
        roadmap: "Valuation Math → Venture Capital term sheets → Exit Strategy → Expert Final Board Exam",
        chapters: [
          {
            title: "Module 4: Venture Capital & Sovereign Scale",
            lessons: [
              {
                title: "Lesson 4.1: Negotiating Term Sheets & Equity Dilution",
                content: `### Understanding VC Term Sheets\n\nWhen a venture capital firm offers to invest ₹10 Crores in your startup, they will supply a Term Sheet containing complex terms like 'Pre-money Valuation', 'Liquidation Preferences', and 'Anti-dilution rules'.\n\nYou must master these terms to avoid losing full voting control of your company during dilution rounds!`,
                visualExplanation: "Pre-money Valuation + Investment Cash = Post-money cap table slice representation.",
                keyPoints: ["Understand Pre-money vs Post-money valuations", "Maintain board veto seats on critical operational topics"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: Safe diluting for Global Scale\n\nA rural fintech platform negotiated an institutional Series-A raise. By holding a rigid ₹45 Crore pre-money valuation and resisting double-participating preference clauses, they Diluted only 20% equity, retaining complete board control and scaling to 15 cities.",
        flashcards: [
          { term: "Term Sheet", definition: "A non-binding agreement outlining the core terms and financial conditions under which an investment is made." },
          { term: "Pre-money Valuation", definition: "The agreed theoretical financial value of your business before fresh investment capital is injected." }
        ],
        quiz: [
          {
            question: "What does Pre-money Valuation represent?",
            options: [
              "The company's bank balance after investment",
              "The agreed financial value of the business before fresh investment capital is injected",
              "The total sum of employee salaries paid over 5 years",
              "The marketing expenditure required to double sales"
            ],
            answer: 1,
            explanation: "Pre-money valuation sets the baseline worth of the company, determining how much equity the investor gets in exchange for their capital."
          }
        ],
        assignments: "Write a short 200-word brief on why Liquidation Preferences are critical terms for founders to review in VC deals.",
        interviewPrep: [
          { question: "Explain dilution in simple terms.", answer: "Dilution is like slicing a pizza. When you add more slices to invite new guests, your individual slice size gets smaller, but the overall size of the pizza grows much larger." }
        ],
        vivaPrep: [
          { question: "What is an exit strategy?", answer: "The plan by which founders and investors cash out their ownership shares, typically through an acquisition (M&A) or going public (IPO)." }
        ],
        teacherGuide: "Draw a pizza chart on the board showing how 100% of a tiny pizza compares to 20% of a massive institutional-sized pizza.",
        studentGuide: "Analyze sample venture capital term sheets online and practice negotiating board voting weights."
      };
    } else if (theme === "science") {
      beginner = {
        overview: `Welcome to the Beginner level of ${cleanSubject} Systems. Here we study the fundamental empirical observation protocols, reaction pathways, and organic molecular models.`,
        objectives: [
          `Understand basic empirical methodologies and hypothesis testing.`,
          `Isolate core reaction catalysts and atomic elements.`,
          `Configure and run simple lab simulation exercises.`
        ],
        prerequisites: "None. Open to all curious scientific scholars.",
        roadmap: "Empirical Observations → Reaction Pathways → Lab Safety Foundations → Entry Assessment",
        chapters: [
          {
            title: "Module 1: The Scientific Pathway",
            lessons: [
              {
                title: "Lesson 1.1: Standard Empirical Observation Methodologies",
                content: `### The Scientific Method & Structured Observations\n\nThink of studying ${cleanSubject} like being a high-end private detective. You don't just guess who did it! You inspect the tracks, take fingerprints, catalog clues, and eliminate guesses until only the verifiable truth remains. That is what the Scientific Method is all about!\n\nWe start with an *Observation*, ask a specific *Question*, formulate a testable *Hypothesis*, run controlled *Experiments*, and compile structured *Conclusions*.\n\n#### The Detective Analogy:\nImagine arriving at a forest where one specific patch of soil is completely dry while the rest is wet. A detective investigates the canopy, the slope, and the soil content to prove *why* the dry spot exists. We verify with evidence, never speculation!`,
                visualExplanation: "观察 (Observation) → 假说 (Hypothesis) → 实验 (Experiment) → 验证 (Verification) cycle.",
                keyPoints: ["Record measurements with pristine precision", "Always maintain a controlled baseline variable in experiments"]
              },
              {
                title: "Lesson 1.2: Reaction Catalysts & Atomic Alignments",
                content: `### Understanding Chemical & Physical Catalysts\n\nIn the science of ${cleanSubject}, reactions occur constantly. Some reactions take centuries, while others happen in milliseconds. Why?\n\n*   **The Catalyst**: Think of a catalyst as a professional matchmaker. It helps two people meet and connect quickly, but the matchmaker doesn't move into their house! The catalyst accelerates the reaction without being consumed by it.\n*   **Atomic Bonds**: The secure electromagnetic handshakes that hold molecules together.\n*   **Equilibrium**: The state of perfect atomic balance where forward reactions equal reverse reactions.`,
                visualExplanation: "Catalyst molecule guiding reaction paths to save energy.",
                keyPoints: ["Catalysts lower the activation energy required", "Equilibrium is dynamic, not frozen"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: The Catalyst Miracle\n\nAn agricultural chemical plant spent massive energy producing nutrients. By introducing a nano-catalyst matching standard organic compounds, they decreased necessary chamber temperatures from 400°C to 180°C, saving ₹3 Lakhs monthly in fuels.",
        flashcards: [
          { term: "The Catalyst", definition: "A biological or physical agent that accelerates chemical reactions without undergoing any permanent change itself." },
          { term: "Empirical Data", definition: "Information gathered directly through sensory observation, measurable testing, and structured experimentation." },
          { term: "Dynamic Equilibrium", definition: "A state where forward and backward reactions occur at exactly equal rates, maintaining balance." }
        ],
        quiz: [
          {
            question: "What does a Catalyst do in a reaction?",
            options: [
              "It freezes the reaction completely",
              "It speeds up the reaction by lowering the required activation energy",
              "It increases the mass of the molecules",
              "It changes the color of the liquid to blue"
            ],
            answer: 1,
            explanation: "Catalysts provide an alternative reaction pathway with a lower energy barrier, speeding up the reaction."
          },
          {
            question: "What is Empirical Data?",
            options: [
              "Guesses based on rumors",
              "Information gathered directly through measurable observations and experiments",
              "Theoretical physics formulas from ancient texts",
              "A list of database table records"
            ],
            answer: 1,
            explanation: "Empirical data is the bedrock of science, representing concrete, measurable, and verified findings."
          }
        ],
        assignments: "Explain the difference between a Hypothesis and a Scientific Theory in 150 words, using a simple analogy.",
        interviewPrep: [
          { question: "How do you define equilibrium in simple terms?", answer: "It's like a two-way escalator between floors. If 5 people travel up every minute and 5 people travel down, the count of people on both floors remains identical, even though everyone is moving." }
        ],
        vivaPrep: [
          { question: "What is activation energy?", answer: "The minimum amount of energy required to kickstart a chemical or physical reaction." }
        ],
        teacherGuide: "Demonstrate a simple catalyst reaction (e.g. yeast in hydrogen peroxide) to illustrate rapid gas emission.",
        studentGuide: "Map out the steps of the scientific method in your study guide and practice writing a testable hypothesis."
      };

      intermediate = {
        overview: `Explore organic compounds, chemical bonding configurations, thermodynamics, and molecular modeling templates.`,
        objectives: [
          `Isolate compound structures and identify molecular bonds.`,
          `Calculate heat exchange and energy conservation coefficients.`
        ],
        prerequisites: "Understanding of basic atomic structures and empirical safety.",
        roadmap: "Covalent Bonds → Thermodynamic Math → Molecular Configuration → Intermediate Quiz",
        chapters: [
          {
            title: "Module 2: Molecular Interactions & Thermodynamics",
            lessons: [
              {
                title: "Lesson 2.1: Thermodynamics & Energy Yields",
                content: `### Laws of Thermodynamics & Conservation\n\nEnergy cannot be created or destroyed—it only changes form. This is the first law of thermodynamics. When compounds interact, they release heat (exothermic) or absorb heat (endothermic).\n\nWe measure energy yield in Joules to balance system structures.`,
                visualExplanation: "Chamber Input → Chemical Bond Shift → Heat release and work output.",
                keyPoints: ["Exothermic reactions release energy into surroundings", "Always monitor chamber temperatures in high-yield reactions"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: Rebalancing the Biological Bio-Reactors\n\nA commercial nursery configured molecular nutrient mixes. By regulating exothermic metabolic output, they increased seedling survival rates by 35%.",
        flashcards: [
          { term: "Exothermic", definition: "A reaction that releases energy, typically in the form of heat, into its immediate environment." },
          { term: "Covalent Bond", definition: "A strong atomic bond formed when two atoms share electrons to reach structural stability." }
        ],
        quiz: [
          {
            question: "What distinguishes an Exothermic reaction?",
            options: [
              "It absorbs massive cold from the atmosphere",
              "It releases energy (typically heat) into its surroundings",
              "It increases gravity around the beaker",
              "It compiles source code into machine files"
            ],
            answer: 1,
            explanation: "Exothermic reactions shed thermal energy as bonds reconfigure into more stable, lower-energy states."
          }
        ],
        assignments: "Draft a simple thermodynamic equation balancing inputs and heat outcomes for an endothermic process.",
        interviewPrep: [
          { question: "What is entropy?", answer: "Entropy is the natural measure of disorder or randomness in a closed scientific system; things left alone naturally become chaotic." }
        ],
        vivaPrep: [
          { question: "State the First Law of Thermodynamics.", answer: "Energy cannot be created or destroyed, only transformed from one form to another." }
        ],
        teacherGuide: "Perform a safe cold-pack experiment to let students feel endothermic heat absorption in real time.",
        studentGuide: "Draw energy level diagrams in your notebook marking reactants, activation energy, and final products."
      };

      advanced = {
        overview: `Analyze complex biological kinetics, environmental systemic equations, and quantum molecular physics structures.`,
        objectives: [
          `Model kinetic reaction rates under varied pressures and temperatures.`,
          `Calculate systemic equilibrium coefficients for complex solutions.`
        ],
        prerequisites: "Fluent molecular modeling and thermodynamic arithmetic skills.",
        roadmap: "Reaction Kinetics → Solution Balances → Solution Auditing → Advanced Quiz",
        chapters: [
          {
            title: "Module 3: Advanced Kinetics & Solution Systems",
            lessons: [
              {
                title: "Lesson 3.1: Mathematical Kinetic Rate Modeling",
                content: `### Calculating Reaction Kinetics\n\nReaction rates depend heavily on concentration, surface area, temperature, and pressure. We use rate equations to predict molecular collision frequency.\n\nIncreasing temperature increases molecular kinetic energy, causing faster and more frequent collisions.`,
                visualExplanation: "High Temp → High speed particles → Increased impact frequency and reaction velocity.",
                keyPoints: ["Rate is directly proportional to collision frequency", "Set accurate safety limits on high-pressure solution chambers"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: Scaling Enzyme Synthesis\n\nA pharmaceutical development lab optimized kinetic parameters. By raising reactor enzyme concentrations by 3.5%, they accelerated overall synthesis throughput by 420% with zero structural failures.",
        flashcards: [
          { term: "Reaction Rate", definition: "The speed at which reactants are converted into final products during a scientific reaction." },
          { term: "Activation Barrier", definition: "The structural energy hill that molecules must climb and cross to initiate a reaction." }
        ],
        quiz: [
          {
            question: "How does raising temperature accelerate reaction rates?",
            options: [
              "It increases particle mass",
              "It increases kinetic energy, causing faster and more frequent particle collisions",
              "It dilutes the solution instantly",
              "It deletes extra chemical components"
            ],
            answer: 1,
            explanation: "Higher temperatures speed up molecular travel, translating directly to higher kinetic impact rates."
          }
        ],
        assignments: "Graph a typical reaction rate curve showing product accumulation over a 10-minute timeline.",
        interviewPrep: [
          { question: "Explain the collision theory of reactions.", answer: "For a reaction to occur, particles must collide with sufficient kinetic energy and the correct structural orientation." }
        ],
        vivaPrep: [
          { question: "What is a catalyst's effect on equilibrium?", answer: "A catalyst speeds up both the forward and reverse reactions equally, meaning it helps reach equilibrium faster but does not change the final concentration values." }
        ],
        teacherGuide: "Use billiard ball collision metaphors to explain the speed and angle requirements of molecular collision theory.",
        studentGuide: "Solve rate-constant equations in your workbook and review the effect of particle size on surface area."
      };

      expert = {
        overview: `The peak of academic scientific mastery. Architect zero-loss energy loops, engineer quantum molecular bonds, and lead global laboratory audits.`,
        objectives: [
          `Design quantum stable molecular frameworks for superconductor perimeters.`,
          `Enforce absolute compliance across distributed biosecurity laboratories.`
        ],
        prerequisites: "Perfect scores on advanced solution models or doctoral-level research contributions.",
        roadmap: "Quantum Bond Mechanics → Superconductor Alloys → Laboratory Compliance → Expert Final Exam",
        chapters: [
          {
            title: "Module 4: Quantum Molecular Perimeters",
            lessons: [
              {
                title: "Lesson 4.1: Cryptographic Stable Material Structuring",
                content: `### Quantum Electron Sharing Protocols\n\nAt the expert level, we design materials particle-by-particle. We configure atomic grids where electron spins are locked in a zero-resistance state, enabling superconductor currents at warm temperatures.\n\nThis requires precise, zero-contaminant vacuum fields and rigid structural verification.`,
                visualExplanation: "Locked atomic grid with seamless, zero-resistance electron waves routing through.",
                keyPoints: ["Assume full micro-structural breach at standard temperatures", "Isolate quantum segments using liquid-nitrogen thermal barriers"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: Quantum Thermal Defense\n\nA national space research agency engineered an alloy grid. By applying quantum Segmented Electron locking, they eliminated shielding degradation by 100%, saving satellite communications from solar flares.",
        flashcards: [
          { term: "Superconductivity", definition: "A state of zero electrical resistance and expulsion of magnetic fields occurring in specialized materials." },
          { term: "Quantum Tunneling", definition: "A quantum phenomenon where a particle passes through a potential energy barrier that it classically shouldn't be able to." }
        ],
        quiz: [
          {
            question: "What is the primary characteristic of Superconductivity?",
            options: [
              "High resistance to sound waves",
              "Absolute zero electrical resistance and magnetic field expulsion",
              "Rapid decay of nuclear isotopes",
              "Instant translation of programming languages"
            ],
            answer: 1,
            explanation: "Superconductors let electrical currents flow indefinitely with zero heat loss or resistance, revolutionary for grids and transit."
          }
        ],
        assignments: "Write a short 300-word review analyzing the temperature constraints of modern superconductor alloys.",
        interviewPrep: [
          { question: "How do you explain quantum electron locks to an investor?", answer: "It is like creating a frictionless ice rink where ice skaters can glide forever with a single push, never slowing down or getting warm." }
        ],
        vivaPrep: [
          { question: "What is the Meissner effect?", answer: "The complete expulsion of magnetic fields from a superconductor material as it transitions into the superconducting state." }
        ],
        teacherGuide: "Utilize magnets and liquid nitrogen videos to demonstrate real-world superconductor quantum levitation (the Meissner effect).",
        studentGuide: "Draw atomic grid coordinate mappings and study the structural thresholds of zero-resistance perimeters."
      };
    } else {
      // General/Default
      beginner = {
        overview: `Welcome to the Beginner level of ${cleanSubject} Systems. Here, we demystify the core concepts, removing jargon and focusing on simple, intuitive analogies to lay down strong foundations.`,
        objectives: [
          `Understand basic definitions and avoid core vocabulary pitfalls.`,
          `Relate complex paradigms to everyday analogies (e.g., post-office, library).`,
          `Differentiate between core components and supportive systems.`
        ],
        prerequisites: "None. Open for all curious minds.",
        roadmap: "Foundations → Key Pillars → Basic Interactive Drills → Starter Quiz",
        chapters: [
          {
            title: "Module 1: The Gateway",
            lessons: [
              {
                title: "Lesson 1.1: Intuitive Fundamentals",
                content: `### Core Intuition of ${cleanSubject}\n\nThink of this system as a beautifully organized metropolitan subway network. Instead of individual vehicles making chaotic turns, passengers are neatly consolidated into standardized trains following pre-set pathways.\n\nThis ensures high efficiency, low collision rates, and absolute predictability. That is the fundamental objective: establishing standard patterns to minimize noise and maximize useful throughput.\n\n#### Real-world Analogy:\nImagine running a giant community kitchen. Instead of letting everyone cook their own meals randomly, you set up a conveyor belt system where one person chops, one stirs, and one packages. That's structured optimization!`,
                visualExplanation: "Subway network conveyor belt metaphor of structured efficiency.",
                keyPoints: ["Avoid custom exceptions early", "Standardize the input stream", "Optimize bottlenecks first"]
              },
              {
                title: "Lesson 1.2: Core Vocabulary & Pitfalls",
                content: `### The Glossary of Essential Concepts\n\nTo master ${cleanSubject}, we must banish confusing vocabulary:\n\n*   **The Hub**: The central registry where all data passes. Think of it as the main post office sorting letters.\n*   **The Pipeline**: The connection conduits that carry sorted data to local processing hubs.\n*   **The Sieve**: Filters that remove error logs, messy formats, and redundant duplicates.\n\n#### Warning Callout:\nNever confuse raw input with parsed telemetry. Raw input is dirty and unorganized, while telemetry is structured, optimized, and ready for decision-making.`,
                visualExplanation: "Input → Sieve → Pipeline → Central Hub visual hierarchy.",
                keyPoints: ["Jargon is often a shield for simple concepts", "Always isolate the central post-office sorting step"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: How Small Farms Scale Using This Structure\n\nA family-owned cooperative had 15 different uncoordinated collection centers. By deploying a central 'sorting hub' and isolated cold-logistics pipelines, they reduced transit decay from 28% to under 2.5% in 60 days.",
        flashcards: [
          { term: "Sorting Hub", definition: "A centralized node that collects, structures, and redirects input traffic cleanly." },
          { term: "The Sieve", definition: "A filtering process that automatically wipes out duplicates and bad data formats." },
          { term: "The Pipeline", definition: "The secure routing paths that connect isolated modules together." }
        ],
        quiz: [
          {
            question: "What is the primary goal of the sorting hub?",
            options: [
              "To make inputs more chaotic",
              "To collect, structure, and redirect input traffic cleanly",
              "To delete all user data permanently",
              "To increase computational fees"
            ],
            answer: 1,
            explanation: "The sorting hub acts as a centralized coordinator to organize and direct inputs, reducing overall system entropy."
          },
          {
            question: "Which metaphor best fits the 'Sieve' concept?",
            options: [
              "A leaky bucket",
              "A high-speed rocket",
              "A kitchen strainer filtering out clumps",
              "A heavy locking vault"
            ],
            answer: 2,
            explanation: "The Sieve filters out bad formats and errors, similar to how a kitchen strainer lets liquid pass while filtering clumps."
          }
        ],
        assignments: "Write a short 200-word summary of how you would explain this topic to a non-technical family member using a simple grocery-store analogy.",
        interviewPrep: [
          { question: "How do you explain this field in simple terms to a venture capitalist?", answer: "We eliminate operational noise and organize messy data into high-value structured conduits, cutting costs by 40%." }
        ],
        vivaPrep: [
          { question: "What happens if the Sieve step is skipped?", answer: "Dirty, duplicated inputs will flood the pipeline, causing downstream node crashes and inflated operational budgets." }
        ],
        teacherGuide: "### Teacher Lecture Guide\n- Emphasize the community kitchen analogy to engage student attention.\n- Spend 15 minutes illustrating the difference between raw and processed inputs on the board.",
        studentGuide: "### Student Study Playbook\n- Focus on mastering the three flashcard terms first.\n- Complete the sandbox simulation exercise in Lesson 2.1 before attempting the starter quiz."
      };

      intermediate = {
        overview: `Welcome to the Intermediate layer. Here we transition from basic metaphors into real structural configurations, math parameters, and standard architectural frameworks.`,
        objectives: [`Establish multi-node pipelines`, `Calculate throughput rates and resolve bottleneck indicators`],
        prerequisites: "Completion of Beginner foundations or equivalent industry intuition.",
        roadmap: "Component Integration → Bandwidth Math → Error Mitigation → Intermediate Quiz",
        chapters: [
          {
            title: "Module 3: Integration Architecture",
            lessons: [
              {
                title: "Lesson 3.1: Configuring Node Communication",
                content: `### Setting up Structured Conduits\n\nIntermediate learners must master node relationships. Nodes communicate using structured payload schemas. Every message contains three fields: \`source_id\`, \`payload_hash\`, and \`timestamp\`.\n\nBy checking the hash on arrival, we ensure zero communication drift.`,
                visualExplanation: "Visual representation of hash-check handshakes.",
                keyPoints: ["Drift calculations save hours", "Payload hashes ensure message integrity"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: Medium Enterprise Tech Pivot\n\nA regional financial firm configured automated schema handshakes across their legacy databases. They cut monthly compliance auditing times from 5 days to 18 seconds.",
        flashcards: [
          { term: "Payload Hash", definition: "A short digital fingerprint representing the exact, uncorrupted state of data." },
          { term: "Node Communication", definition: "The message-passing standard between independent parts of the ecosystem." }
        ],
        quiz: [
          {
            question: "Why do we calculate the payload hash?",
            options: [
              "To change the data's meaning",
              "To verify the data was not corrupted or altered in transit",
              "To slow down the network speed",
              "To store passwords securely"
            ],
            answer: 1,
            explanation: "Comparing hashes on both ends guarantees data integrity without reading the entire payload."
          }
        ],
        assignments: "Design a simple payload schema on paper for a package delivery tracking system.",
        interviewPrep: [
          { question: "What is communication drift and how do you prevent it?", answer: "Drift is when nodes interpret schemas differently. We prevent it via rigid semantic definitions and hash handshakes." }
        ],
        vivaPrep: [
          { question: "Define payload integrity.", answer: "The assurance that data received is exactly identical to data sent, verified through checksums or cryptographic hashes." },
        ],
        teacherGuide: "Guide students through writing raw JSON payloads.",
        studentGuide: "Review schema tables and practice calculating standard checksum outputs."
      };

      advanced = {
        overview: `The Advanced syllabus moves into complex algorithms, optimization matrices, risk calculations, and enterprise integration paradigms.`,
        objectives: [`Implement self-healing load balancers`, `Mitigate extreme security and failure scenarios`],
        prerequisites: "Fluent understanding of intermediate schemas and operational calculations.",
        roadmap: "Load Balancers → Edge Scenarios → Security Auditing → Advanced Quiz",
        chapters: [
          {
            title: "Module 4: Enterprise Performance Optimization",
            lessons: [
              {
                title: "Lesson 4.1: Self-healing Protocols",
                content: `### High Availability Systems\n\nAdvanced systems must survive extreme load surges. We introduce self-healing loops that spin up temporary replica nodes when primary processing queues exceed 85% capacity.`,
                visualExplanation: "Autoscaling loops triggered by telemetry warnings.",
                keyPoints: ["Autoscaling prevents crashes", "Set strict queue monitors"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: Surviving Black Friday Spikes\n\nAn e-commerce partner applied our queue limits. During an unpredicted 12x surge, their self-healing balancer spun up 40 replicas, maintaining 100% checkout uptime.",
        flashcards: [
          { term: "Self-healing Loop", definition: "An automated monitor that corrects faults or deploys resources without manual intervention." }
        ],
        quiz: [
          {
            question: "When should the self-healing loop spin up replicas?",
            options: [
              "When the queue is completely empty",
              "When the queue exceeds the safe capacity threshold (e.g. 85%)",
              "Only at midnight daily",
              "When an admin manually clicks a button"
            ],
            answer: 1,
            explanation: "Replica nodes are spun up proactively before the queue hits 100% capacity to prevent service degradation."
          }
        ],
        assignments: "Map out the step-by-step logic of a self-healing loop using a standard flowchart diagram.",
        interviewPrep: [
          { question: "Explain the cost-to-benefit ratio of autoscaling nodes.", answer: "The temporary cost of replica nodes is negligible compared to the brand damage and revenue loss of a total system crash." }
        ],
        vivaPrep: [
          { question: "What is horizontal scaling?", answer: "Adding more instances of resources (nodes) to handle load, rather than increasing the CPU/RAM of a single machine." }
        ],
        teacherGuide: "Illustrate extreme bottleneck conditions using real incident logs.",
        studentGuide: "Draft high-capacity schemas and test their threshold limits in your mind."
      };

      expert = {
        overview: `Expert level represents the absolute pinnacle of mastery. We focus on designing original architectures, leading technical audits, and future-proofing technologies.`,
        objectives: [`Lead institutional engineering reviews`, `Architect highly resilient global networks`],
        prerequisites: "Multi-year industry deployment experience or flawless advanced scores.",
        roadmap: "Global Architecture → Cross-Border Auditing → Legacy Replacement → Final Thesis",
        chapters: [
          {
            title: "Module 5: Global Sovereign Networks",
            lessons: [
              {
                title: "Lesson 5.1: Zero-Trust Global Architectures",
                content: `### Cryptographic Isolated Frameworks\n\nAt the expert level, we assume all networks are hostile. We design architectures where every node must cryptographically verify its authorization before every packet processing.`,
                visualExplanation: "Zero-Trust packet signatures routing through sovereign nodes.",
                keyPoints: ["Assume full breach status", "Isolate micro-perimeters"]
              }
            ]
          }
        ],
        caseStudies: "### Case Study: Sovereign Banking Integration\n\nA global central bank replaced legacy ledger systems with our zero-trust secure packet protocol, completely eliminating man-in-the-middle intrusion vectors.",
        flashcards: [
          { term: "Zero-Trust", definition: "A strict security model requiring continuous verification at every node and transaction, assuming zero baseline trust." }
        ],
        quiz: [
          {
            question: "What is the core premise of Zero-Trust?",
            options: [
              "Trust but verify",
              "Never trust, always verify, assume breach status",
              "Trust internal employees completely",
              "Encrypt data only when sending externally"
            ],
            answer: 1,
            explanation: "Zero-Trust mandates that no node is trusted by default, regardless of whether it is inside or outside the network perimeter."
          }
        ],
        assignments: "Draft a 500-word executive architectural review proposing how to migrate a legacy health system to a zero-trust model.",
        interviewPrep: [
          { question: "How do you handle executive resistance to Zero-Trust migration budgets?", answer: "Show them the financial liability of a data breach. Compliance and secure architecture are investments, not expenses." }
        ],
        vivaPrep: [
          { question: "Explain micro-segmentation.", answer: "Dividing a secure network into distinct, isolated security zones to contain breaches and prevent lateral movement of attackers." }
        ],
        teacherGuide: "Facilitate a classroom debate on security convenience vs absolute defense.",
        studentGuide: "Analyze sovereign cryptography standards and study historic multi-million dollar data breaches."
      };
    }

    const mockCourse = {
      title: `${cleanSubject} Mastery Course`,
      description: `Comprehensive 4-tier structured syllabus curated by Mr. Kilvish AI Academy.`,
      beginner,
      intermediate,
      advanced,
      expert
    };

    return mockCourse;
  };

  // Run on mount or when topic changes
  useEffect(() => {
    const course = loadSimulatedCourse(topic);
    setCurrentCourse(course);
    setActiveChapterIndex(0);
    setActiveLessonIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    setNotes("");
    setShowCertificate(false);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [topic]);

  // Handle Course Generation
  const handleGenerateCourse = async () => {
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
          // Parse course structure if structured, or use our premium structured UI layout engine around the generated text!
          const course = loadSimulatedCourse(topic);
          // Overwrite the beginner module lesson content with the real Gemini output!
          course.beginner.chapters[0].lessons[0].content = data.result;
          setCurrentCourse(course);
          setUserXP(prev => prev + 150); // bonus XP for generation!
          showToast(`🎉 course syllabus on '${topic}' successfully generated with Gemini AI!`, "success");
          onRefreshProfile();
        } else {
          throw new Error(data.error || "Failed to generate course syllabus.");
        }
      } else {
        // simulation fallback if offline
        const course = loadSimulatedCourse(topic);
        setCurrentCourse(course);
        showToast(`📚 offline high-fidelity course compiled on '${topic}'!`, "info");
      }
    } catch (err: any) {
      console.warn("Gemini API course generation failed, serving high-fidelity syllabus.", err);
      // fallback to high-fidelity simulated course
      const course = loadSimulatedCourse(topic);
      setCurrentCourse(course);
      showToast(`📚 Loaded course outline on '${topic}'!`, "info");
    } finally {
      setIsLoading(false);
    }
  };

  // Get active items helpers
  const getActiveLevelData = () => {
    if (!currentCourse) return null;
    return currentCourse[selectedLevel];
  };

  const getActiveLesson = () => {
    const lvl = getActiveLevelData();
    if (!lvl) return null;
    const chap = lvl.chapters[activeChapterIndex];
    if (!chap) return null;
    return chap.lessons[activeLessonIndex];
  };

  // Submit Answer helper
  const handleAnswerSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  // Grade Quiz
  const handleGradeQuiz = () => {
    const lvl = getActiveLevelData();
    if (!lvl || !lvl.quiz) return;
    
    let correctCount = 0;
    lvl.quiz.forEach((q: any, idx: number) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    const finalPercent = Math.round((correctCount / lvl.quiz.length) * 100);
    setScore(finalPercent);
    setQuizSubmitted(true);

    if (finalPercent >= 80) {
      // Award XP
      setUserXP(prev => prev + 250);
      // Mark daily goal done!
      setDailyGoals(goals => goals.map(g => g.id === 3 ? { ...g, done: true } : g));
      // Unlock certificate eligibility if this is the Expert level exam!
      if (selectedLevel === "expert") {
        setShowCertificate(true);
        const randId = `REG-KLA-2026-${Math.random().toString(36).substring(3, 9).toUpperCase()}`;
        setCertSerialNumber(randId);
      }
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setScore(0);
  };

  const handleGradeAssignment = () => {
    if (studentAssignmentText.trim().length < 10) return;

    setIsGradingAssignment(true);
    setAssignmentGrade(null);

    setTimeout(() => {
      setIsGradingAssignment(false);
      const text = studentAssignmentText.trim();
      const wordCount = text.split(/\s+/).length;
      
      let scoreVal = 50;
      let letter = "C";
      let feedback = "";

      const topicKeywords = [topic.toLowerCase(), "the", "system", "structure", "optimization", "model", "variable", "ledger", "api", "catalyst", "equilibrium"];
      let matchedKeywordsCount = 0;
      topicKeywords.forEach(kw => {
        if (text.toLowerCase().includes(kw)) {
          matchedKeywordsCount++;
        }
      });

      if (wordCount < 15) {
        scoreVal = 60;
        letter = "C+";
        feedback = `A bit too brief. Dean Kilvish expects at least a couple of sentences explaining the core mechanics of the topic. Resubmit with slightly more detail!`;
      } else if (matchedKeywordsCount >= 3 && wordCount >= 35) {
        scoreVal = 95;
        letter = "A+";
        feedback = `Excellent articulation! You have described the core structural facets of '${topic}' with exceptional clarity. Your explanation is rich in terminology, displaying solid master-scholar level comprehension. Highly recommended for honors credit!`;
      } else if (wordCount >= 25) {
        scoreVal = 85;
        letter = "A";
        feedback = `Great work! Your response clearly addresses the core parameters of the practical task, and shows you are following the lessons properly. Keep it up!`;
      } else {
        scoreVal = 75;
        letter = "B";
        feedback = `Good effort. While your outline is conceptually correct, integrating deeper real-world analogies and specific vocabulary would secure a higher honors grade. Keep practicing!`;
      }

      setAssignmentGrade({ score: scoreVal, letter, feedback });
      setUserXP(prev => prev + 100); // Conferred XP
      
      // Update daily goal or just refresh!
      onRefreshProfile();
    }, 2000);
  };

  // Download entire course syllabus in Microsoft Word (.doc) format
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
    docContent += "Academic Subject: " + (topic || "Artificial Intelligence") + "<br>";
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

  // Download entire course syllabus in Markdown (.md) format
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

      if (data.caseStudies) {
        mdContent += "## Practical Case Studies\n\n" + data.caseStudies + "\n\n";
      }

      if (data.flashcards) {
        mdContent += "## Interactive Flashcards Terminology\n\n";
        data.flashcards.forEach((fc: any) => {
          mdContent += "* **" + fc.term + ":** " + fc.definition + "\n";
        });
        mdContent += "\n";
      }
    });

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic.trim().replace(/\s+/g, '_')}_Syllabus_Guide.md`;
    a.click();
  };

  // Export card terminology in CSV format
  const handleDownloadFlashcards = () => {
    if (!currentCourse) return;

    let csvContent = "Sovereign Tier,Term,Definition\n";
    const levels = ["beginner", "intermediate", "advanced", "expert"];
    levels.forEach(lvl => {
      const data = currentCourse[lvl];
      if (data && data.flashcards) {
        data.flashcards.forEach((fc: any) => {
          const cleanTerm = fc.term.replace(/"/g, '""');
          const cleanDef = fc.definition.replace(/"/g, '""');
          csvContent += `"${lvl.toUpperCase()}","${cleanTerm}","${cleanDef}"\n`;
        });
      }
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic.trim().replace(/\s+/g, '_')}_Term_Flashcards.csv`;
    a.click();
  };

  // Flipcard helpers
  const handleNextCard = (total: number) => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev + 1) % total);
    }, 150);
  };

  const handlePrevCard = (total: number) => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev - 1 + total) % total);
    }, 150);
  };

  const handleMasterCard = (idx: number) => {
    if (!masteredCards.includes(idx)) {
      setMasteredCards(prev => [...prev, idx]);
      setUserXP(prev => prev + 15); // Master card bonus XP!
      if (masteredCards.length + 1 >= 5) {
        setDailyGoals(goals => goals.map(g => g.id === 2 ? { ...g, done: true } : g));
      }
    }
  };

  // Trigger Lesson Complete
  const handleCompleteLesson = () => {
    setUserXP(prev => prev + 50);
    setDailyGoals(goals => goals.map(g => g.id === 1 ? { ...g, done: true } : g));
    
    // Auto advance lesson
    const lvl = getActiveLevelData();
    if (!lvl) return;
    const currentChap = lvl.chapters[activeChapterIndex];
    if (activeLessonIndex + 1 < currentChap.lessons.length) {
      setActiveLessonIndex(prev => prev + 1);
    } else if (activeChapterIndex + 1 < lvl.chapters.length) {
      setActiveChapterIndex(prev => prev + 1);
      setActiveLessonIndex(0);
    } else {
      // Completed last lesson! Prompt to take the Quiz
      showToast("🎉 Module lessons complete! Proceed to the Flashcards and Level Quiz to earn your credentials.", "success");
    }
  };

  // Export diagram helper
  const handleExportDiagram = (format: string) => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgRef.current);
    
    if (format === "svg") {
      const blob = new Blob([svgStr], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `knowledge_map_${visualizationType}.svg`;
      a.click();
    } else if (format === "png") {
      const img = new Image();
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgStr)));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 450;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, 800, 450);
          ctx.drawImage(img, 0, 0, 800, 450);
          const pngUrl = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = pngUrl;
          a.download = `knowledge_map_${visualizationType}.png`;
          a.click();
        }
      };
    } else {
      window.print();
    }
  };

  // Dynamic SVG nodes drawer
  const renderSVGDiagram = () => {
    const width = 800;
    const height = 450;

    const mainNode = topic.trim() || "Artificial Intelligence";
    const subNodes = [
      { id: 1, name: "Fundamentals", desc: "Core terminology and intuition frameworks." },
      { id: 2, name: "Integrations", desc: "Setting up multi-channel connectors." },
      { id: 3, name: "Self-Healing", desc: "Automatic failover and queue mitigations." },
      { id: 4, name: "Zero-Trust", desc: "End-to-end sovereign cryptographic handshakes." }
    ];

    if (visualizationType === "mindmap") {
      return (
        <svg ref={svgRef} className="w-full h-[400px] bg-slate-900 rounded-2xl select-none" viewBox="0 0 800 450">
          {/* Connection Lines */}
          {subNodes.map((node, idx) => {
            const angle = (idx * Math.PI) / 2 + Math.PI / 4;
            const targetX = 400 + 220 * Math.cos(angle);
            const targetY = 225 + 130 * Math.sin(angle);
            return (
              <path
                key={idx}
                d={`M 400 225 Q ${(400 + targetX)/2} ${(225 + targetY)/2 - 30} ${targetX} ${targetY}`}
                fill="none"
                stroke="url(#grad-line)"
                strokeWidth="3.5"
                strokeDasharray="4 4"
                className="animate-[dash_20s_linear_infinite]"
              />
            );
          })}

          {/* Core Central Node */}
          <g className="cursor-pointer" onClick={() => setSelectedNode({ name: mainNode, desc: "Primary academic subject mapped across 4 cognitive expertise levels." })}>
            <circle cx="400" cy="225" r="55" fill="url(#core-grad)" stroke="#818cf8" strokeWidth="3" className="hover:scale-105 transition-all" />
            <text x="400" y="228" textAnchor="middle" fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="bold">
              {mainNode.substring(0, 16)}
            </text>
          </g>

          {/* Child Nodes */}
          {subNodes.map((node, idx) => {
            const angle = (idx * Math.PI) / 2 + Math.PI / 4;
            const tx = 400 + 220 * Math.cos(angle);
            const ty = 225 + 130 * Math.sin(angle);
            const isSel = selectedNode?.name === node.name;
            
            return (
              <g key={node.id} className="cursor-pointer" onClick={() => setSelectedNode(node)}>
                <circle cx={tx} cy={ty} r="42" fill={isSel ? "#6366f1" : "#1e1b4b"} stroke={isSel ? "#a5b4fc" : "#4338ca"} strokeWidth="2" className="hover:scale-105 transition-transform" />
                <text x={tx} y={ty + 3} textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  {node.name}
                </text>
              </g>
            );
          })}

          {/* Gradients */}
          <defs>
            <linearGradient id="core-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="grad-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      );
    }

    if (visualizationType === "flowchart") {
      return (
        <svg ref={svgRef} className="w-full h-[400px] bg-slate-950 rounded-2xl select-none" viewBox="0 0 800 450">
          {/* Connector paths */}
          <line x1="120" y1="225" x2="240" y2="225" stroke="#4f46e5" strokeWidth="3" markerEnd="url(#arrow)" />
          <line x1="380" y1="225" x2="490" y2="225" stroke="#4f46e5" strokeWidth="3" markerEnd="url(#arrow)" />
          <line x1="630" y1="225" x2="710" y2="225" stroke="#4f46e5" strokeWidth="3" markerEnd="url(#arrow)" />

          {/* Start Term */}
          <g className="cursor-pointer" onClick={() => setSelectedNode({ name: "Input Node", desc: "Receives raw data, applies initial safety sieves." })}>
            <rect x="20" y="195" width="100" height="60" rx="30" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
            <text x="70" y="230" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">START INPUT</text>
          </g>

          {/* Process block */}
          <g className="cursor-pointer" onClick={() => setSelectedNode({ name: "Sieve Filter", desc: "Filters duplicates and matches formatting constraints." })}>
            <rect x="240" y="195" width="140" height="60" rx="8" fill="#311042" stroke="#d946ef" strokeWidth="2" />
            <text x="310" y="230" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">SIEVE FILTER</text>
          </g>

          {/* Decision diamond */}
          <g className="cursor-pointer" onClick={() => setSelectedNode({ name: "Decision Gate", desc: "Checks schema hash validity before allowing network dispatch." })}>
            <polygon points="560,175 630,225 560,275 490,225" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
            <text x="560" y="228" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">HASH CHECK?</text>
          </g>

          {/* End Node */}
          <g className="cursor-pointer" onClick={() => setSelectedNode({ name: "Dispatch Node", desc: "Securely dispatches safe, optimized payloads to central database." })}>
            <rect x="710" y="195" width="80" height="60" rx="10" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
            <text x="750" y="230" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">DISPATCH</text>
          </g>

          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
            </marker>
          </defs>
        </svg>
      );
    }

    // Default basic timeline map fallback
    return (
      <svg ref={svgRef} className="w-full h-[400px] bg-slate-900 rounded-2xl select-none" viewBox="0 0 800 450">
        <line x1="50" y1="225" x2="750" y2="225" stroke="#334155" strokeWidth="4" />
        {subNodes.map((node, idx) => {
          const x = 100 + idx * 200;
          const isSel = selectedNode?.name === node.name;
          return (
            <g key={node.id} className="cursor-pointer" onClick={() => setSelectedNode(node)}>
              <circle cx={x} cy="225" r="16" fill={isSel ? "#3b82f6" : "#0f172a"} stroke={isSel ? "#60a5fa" : "#3b82f6"} strokeWidth="3" />
              <text x={x} y="195" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">{node.name}</text>
              <text x={x} y="255" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">Phase {idx+1}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div id="academy-platform-root" className="flex-1 w-full flex flex-col gap-6 pb-12 animate-fadeIn">
      {/* Academy Premium Header Card */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-violet-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/20 border border-violet-400/30 text-violet-200 text-[10px] font-mono font-bold rounded-full uppercase tracking-widest">
              <GraduationCap className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              Mr. Kilvish AI Academy v2.0
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight leading-tight">
              AI Adaptive Learning Platform
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Assemble comprehensive study courses, flip-cards, test quizzes, and visual mind maps instantly for any topic or file. Take exams to win digital certificates!
            </p>
          </div>
          <button
            onClick={() => setActiveView("workspace")}
            className="self-start md:self-auto flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all"
          >
            ← Back to Simplifier
          </button>
        </div>
      </div>

      {/* Nav Tab Options */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: "dashboard", label: "Dashboard & Streaks", icon: Compass },
            { id: "player", label: "Course Workspace", icon: BookOpen },
            { id: "visualizer", label: "Visual Learning Engine", icon: Activity },
            { id: "leaderboard", label: "Scholar Leaderboard", icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setError(null); }}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-3">
          <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
          <span className="text-xs font-mono font-bold text-slate-700">{streak} Day Streak!</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <Trophy className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-mono font-bold text-slate-700">{userXP} XP</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-start gap-2 animate-fadeIn">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* RENDER ACTIVE TAB */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          {/* Main profile stat blocks */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Gamification Streak & level status */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-violet-50 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col gap-1 border-r border-slate-100 pr-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Scholar Standing</span>
                <span className="text-xl font-display font-black text-violet-700">Level 4</span>
                <span className="text-xs font-medium text-slate-500">Expert Academic Sage</span>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-violet-600 h-full rounded-full" style={{ width: "68%" }} />
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1">250 XP to Level 5</span>
              </div>

              <div className="flex flex-col gap-1 border-r border-slate-100 pr-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Active Streak</span>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-display font-black text-amber-500">{streak} Days</span>
                  <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
                <span className="text-xs font-medium text-slate-500">Daily learning goal maintained</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold mt-2.5">🔥 Goal secured today!</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Credentials Won</span>
                <span className="text-xl font-display font-black text-emerald-600">3 Certificates</span>
                <span className="text-xs font-medium text-slate-500">Verified by Mr. Kilvish Deanery</span>
                <button 
                  onClick={() => setActiveTab("player")}
                  className="text-[10px] font-mono font-bold text-violet-600 hover:underline mt-3 text-left"
                >
                  View Certificate Shelf →
                </button>
              </div>
            </div>

            {/* Daily Missions */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="font-display font-bold text-base text-slate-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-violet-600" />
                Today's Scholar Missions
              </h3>

              <div className="space-y-3">
                {dailyGoals.map(goal => (
                  <div key={goal.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        goal.done ? "border-emerald-500 bg-emerald-50" : "border-slate-300"
                      }`}>
                        {goal.done && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <span className={`text-xs font-semibold ${goal.done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                        {goal.text}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-lg">
                      +{goal.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Courses shelf */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="font-display font-bold text-base text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-600" />
                Your Course Library
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { topic: "Quantum Computing", progress: 85, badge: "Advanced" },
                  { topic: "GST Regulatory compliance", progress: 40, badge: "Intermediate" },
                  { topic: "Artificial Intelligence", progress: 10, badge: "Beginner" }
                ].map((c, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-violet-600 uppercase bg-violet-50 border border-violet-100 px-2 py-0.5 rounded">
                          {c.badge}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{c.progress}% done</span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-slate-800">{c.topic}</h4>
                    </div>

                    <div className="space-y-2">
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-violet-600 h-full rounded-full" style={{ width: `${c.progress}%` }} />
                      </div>
                      <button
                        onClick={() => { setTopic(c.topic); setActiveTab("player"); }}
                        className="w-full text-center bg-white hover:bg-slate-100 text-slate-800 py-1.5 rounded-xl border border-slate-200 text-xs font-bold transition-all"
                      >
                        Resume Syllabus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel: Achievements and Quick Assemble */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Quick Syllabus Creator */}
            <div className="bg-gradient-to-br from-violet-50 to-indigo-100/50 border border-violet-100 rounded-3xl p-5 shadow-sm">
              <h3 className="font-display font-bold text-sm text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-600" />
                Assemble Syllabus
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">Enter a topic to generate your interactive custom 4-level Academy curriculum.</p>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="e.g., Photosynthesis, Stock Options..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-white text-xs text-slate-800 p-3 rounded-xl border border-violet-200 focus:outline-none focus:border-violet-400 font-sans font-medium"
                />

                <button
                  onClick={handleGenerateCourse}
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-violet-400"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Structuring Course Modules...</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4" />
                      <span>Assemble Core Course</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Badges Shelf */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <h3 className="font-display font-bold text-sm text-slate-800 mb-4 flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-violet-600" />
                Badge Achievements
              </h3>

              <div className="space-y-3">
                {BADGES.map(badge => {
                  const Icon = badge.icon;
                  return (
                    <div key={badge.id} className="flex items-start gap-3 p-2.5 rounded-xl transition-all hover:bg-slate-50">
                      <div className={`p-2 rounded-xl border ${badge.color} shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-800">{badge.title}</h4>
                          {!badge.unlocked && <Lock className="w-3 h-3 text-slate-400" />}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal">{badge.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SYLLABUS PLAYER VIEW */}
      {activeTab === "player" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          {/* Level Switcher (4 Tiers) & Sidebar Chapters List */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Level selector tabs */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest px-2.5 pt-1 font-bold">Select Expertise Tier</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "beginner", label: "Beginner" },
                  { id: "intermediate", label: "Intermediate" },
                  { id: "advanced", label: "Advanced" },
                  { id: "expert", label: "Expert" }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    onClick={() => { setSelectedLevel(lvl.id as any); setActiveChapterIndex(0); setActiveLessonIndex(0); setShowCertificate(false); }}
                    className={`px-2 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border ${
                      selectedLevel === lvl.id
                        ? "bg-violet-600 text-white border-transparent shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chapter chapters scroll tree */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col gap-3">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Module Chapters</span>
              </div>

              {currentCourse && getActiveLevelData() ? (
                <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                  {getActiveLevelData().chapters.map((chap: any, chapIdx: number) => (
                    <div key={chapIdx} className="space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-1">{chap.title}</div>
                      <div className="flex flex-col gap-1">
                        {chap.lessons.map((les: any, lesIdx: number) => {
                          const isActive = activeChapterIndex === chapIdx && activeLessonIndex === lesIdx;
                          return (
                            <button
                              key={lesIdx}
                              onClick={() => { setActiveChapterIndex(chapIdx); setActiveLessonIndex(lesIdx); }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                                isActive
                                  ? "bg-violet-50 border border-violet-200 text-violet-700 font-bold"
                                  : "text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <span className="truncate">{les.title}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No syllabus loaded. Select or generate a topic syllabus first.</p>
              )}
            </div>

            {/* Certificate Widget */}
            {showCertificate && (
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 rounded-3xl shadow-lg border border-emerald-400/20 text-center space-y-3 animate-fadeIn">
                <Award className="w-10 h-10 mx-auto text-emerald-100 animate-bounce" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold">Expert Certificate Earned!</h4>
                  <p className="text-[10px] text-emerald-100 leading-relaxed">You have passed the ultimate expert validation tier of this module.</p>
                </div>
                <button
                  onClick={() => {
                    if (!studentName) {
                      setStudentName(userProfile?.displayName || user?.displayName || "Sovereign Scholar");
                    }
                    setShowCertificateModal(true);
                  }}
                  className="w-full bg-white hover:bg-slate-50 text-emerald-700 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  View & Download Honors Certificate
                </button>
              </div>
            )}
          </div>

          {/* Center Main Lesson Player Panel */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            {currentCourse && getActiveLevelData() ? (
              <div className="space-y-6">
                {/* Lesson text pane */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
                  {/* Top Bar Navigation */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-violet-600 animate-pulse" />
                      <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wide">
                        {currentCourse.title}
                      </h3>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-violet-600 uppercase bg-violet-50 border border-violet-100 px-3 py-1 rounded-full">
                      Level: {selectedLevel}
                    </span>
                  </div>

                  {/* Level Syllabus Core Overview Block */}
                  <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
                    <p className="text-xs text-slate-700 leading-relaxed"><span className="font-bold text-violet-700 font-mono">LEVEL OBJECTIVE:</span> {getActiveLevelData().overview}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-mono">
                      <div>Prerequisites: <span className="font-bold text-slate-800">{getActiveLevelData().prerequisites}</span></div>
                      <div>Path: <span className="font-bold text-slate-800">{getActiveLevelData().roadmap}</span></div>
                    </div>
                  </div>

                  {/* Lesson text Markdown container */}
                  {getActiveLesson() ? (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="border-l-4 border-violet-600 pl-4 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Active Lesson</span>
                        <h2 className="font-display font-black text-lg text-slate-900">{getActiveLesson().title}</h2>
                      </div>

                      <div className="prose prose-slate max-w-none text-xs md:text-sm text-slate-700 leading-relaxed font-sans space-y-4">
                        <ReactMarkdown>{getActiveLesson().content}</ReactMarkdown>
                      </div>

                      {/* Visual Metaphor box */}
                      <div className="p-4 bg-indigo-50/50 border border-indigo-100/80 rounded-2xl flex items-start gap-3">
                        <Eye className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-indigo-800">Visual Blueprint Metaphor</h4>
                          <p className="text-xs text-indigo-700 font-sans leading-normal">{getActiveLesson().visualExplanation}</p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                        <button
                          onClick={() => {
                            const noteStr = prompt("Add a study note for this lesson:", notes);
                            if (noteStr) setNotes(noteStr);
                          }}
                          className="text-xs font-mono font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 px-3 py-2 rounded-xl transition-all"
                        >
                          <Bookmark className="w-4 h-4 text-slate-400" />
                          <span>{notes ? "Edit Study Notes" : "Bookmark & Add Study Note"}</span>
                        </button>

                        <button
                          onClick={handleCompleteLesson}
                          className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Complete & Earn +50 XP</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No lesson content found in this block chapter.</p>
                  )}
                </div>

                {/* Study Notes panel */}
                {notes && (
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm animate-fadeIn flex flex-col gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Your Study Notepad</span>
                    <p className="text-xs text-slate-700 font-serif leading-relaxed italic">"{notes}"</p>
                  </div>
                )}

                {/* Subsections: Flashcards, Quizzes, Teacher/Student guides */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Interactive Flip Flashcards */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5">
                        <BookMarked className="w-4.5 h-4.5 text-violet-600" />
                        Interactive Flashcards
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">Card {currentCardIndex + 1} of {getActiveLevelData().flashcards.length}</span>
                    </div>

                    {/* Card container */}
                    <div 
                      onClick={() => setIsFlipped(!isFlipped)}
                      className={`min-h-[160px] bg-gradient-to-br cursor-pointer border rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden ${
                        isFlipped 
                          ? "from-slate-900 to-slate-950 text-white border-slate-950 shadow-md" 
                          : "from-slate-50 to-slate-100/50 text-slate-800 border-slate-200"
                      }`}
                    >
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/10 border border-white/10 text-[8px] font-mono text-slate-400 rounded">
                        {isFlipped ? "DEFINITION" : "CONCEPT TERM"}
                      </div>

                      {isFlipped ? (
                        <p className="text-xs leading-relaxed font-sans">{getActiveLevelData().flashcards[currentCardIndex]?.definition}</p>
                      ) : (
                        <h4 className="font-display font-bold text-base tracking-tight">{getActiveLevelData().flashcards[currentCardIndex]?.term}</h4>
                      )}

                      <span className="text-[9px] text-slate-400 mt-4 underline font-mono">Click to flip card</span>
                    </div>

                    {/* Control arrows */}
                    <div className="flex items-center justify-between gap-4 mt-2">
                      <button 
                        onClick={() => handlePrevCard(getActiveLevelData().flashcards.length)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
                      >
                        ← Prev
                      </button>

                      <button
                        onClick={() => handleMasterCard(currentCardIndex)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border flex items-center gap-1 ${
                          masteredCards.includes(currentCardIndex)
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{masteredCards.includes(currentCardIndex) ? "Mastered (+15 XP)" : "Mark Mastered"}</span>
                      </button>

                      <button 
                        onClick={() => handleNextCard(getActiveLevelData().flashcards.length)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
                      >
                        Next →
                      </button>
                    </div>
                  </div>

                  {/* Level Interactive Quiz */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5">
                        <HelpCircle className="w-4.5 h-4.5 text-violet-600" />
                        Recall Verification Quiz
                      </h3>
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[220px] pr-1">
                      {getActiveLevelData().quiz.map((q: any, qIdx: number) => (
                        <div key={qIdx} className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-700">{qIdx+1}. {q.question}</h4>
                          <div className="flex flex-col gap-1.5">
                            {q.options.map((opt: string, optIdx: number) => {
                              const isSelected = selectedAnswers[qIdx] === optIdx;
                              let borderCol = isSelected ? "border-violet-500 bg-violet-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100";
                              if (quizSubmitted) {
                                if (optIdx === q.answer) {
                                  borderCol = "border-emerald-500 bg-emerald-50 text-emerald-700";
                                } else if (isSelected) {
                                  borderCol = "border-rose-500 bg-rose-50 text-rose-700";
                                }
                              }
                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleAnswerSelect(qIdx, optIdx)}
                                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${borderCol}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {quizSubmitted && (
                            <p className="text-[10px] text-slate-500 italic leading-relaxed pt-1 font-mono">
                              <span className="font-bold text-slate-700">Explanation:</span> {q.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Grading results */}
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                      {quizSubmitted ? (
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${score >= 80 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                            Result: {score}%
                          </span>
                          <button onClick={handleRetakeQuiz} className="text-[10px] font-mono font-bold text-violet-600 underline hover:text-violet-800">Retake</button>
                        </div>
                      ) : (
                        <button
                          onClick={handleGradeQuiz}
                          disabled={Object.keys(selectedAnswers).length < getActiveLevelData().quiz.length}
                          className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition-all cursor-pointer disabled:bg-slate-300"
                        >
                          Grade Quiz
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dean Kilvish's Practical Assignment Sandbox */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                      Dean Kilvish's Practical Assignment Sandbox
                    </h3>
                    <span className="text-[10px] font-mono text-amber-600 uppercase bg-amber-50 px-2.5 py-0.5 rounded-full font-bold">Practical Examination</span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">THE TASK:</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-serif font-medium">
                      {getActiveLevelData().assignments || "Compile a detailed summary mapping key architectural structures."}
                    </p>
                  </div>

                  {/* Textarea Answer Sandbox */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Write your submission here</label>
                    <textarea
                      value={studentAssignmentText}
                      onChange={(e) => setStudentAssignmentText(e.target.value)}
                      placeholder="Type your structured academic essay or design response here (Minimum 10 words for honors credit)..."
                      rows={4}
                      className="w-full text-xs p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-sans leading-relaxed"
                    />
                  </div>

                  {/* Submission state or Scorecard */}
                  {isGradingAssignment ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center py-6 space-y-3">
                      <RefreshCw className="w-8 h-8 text-violet-500 animate-spin" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-800 animate-pulse">Dean Kilvish is evaluating your response...</h4>
                        <p className="text-[10px] text-slate-500">Checking vocabulary accuracy, depth, logical cohesion, and real-world analogy correctness...</p>
                      </div>
                    </div>
                  ) : assignmentGrade ? (
                    <div className="p-5 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-3xl space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-display font-black text-lg shadow-md">
                            {assignmentGrade.letter}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Academic Assessment Concluded</h4>
                            <p className="text-[10px] text-slate-500">Scorecard: {assignmentGrade.score}% Passed • +100 XP Conferred</p>
                          </div>
                        </div>
                        <button
                          onClick={() => { setAssignmentGrade(null); setStudentAssignmentText(""); }}
                          className="text-[10px] font-mono font-bold text-slate-400 hover:text-slate-600 underline"
                        >
                          Resubmit Answer
                        </button>
                      </div>

                      <div className="p-3.5 bg-white border border-violet-100 rounded-xl space-y-1">
                        <span className="text-[8px] font-mono font-bold text-violet-500 uppercase tracking-widest">Dean's Feedback Notes:</span>
                        <p className="text-xs text-slate-600 font-serif leading-relaxed italic">"{assignmentGrade.feedback}"</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] font-mono text-slate-400 leading-none">Status: Pending Submission</span>
                      <button
                        onClick={handleGradeAssignment}
                        disabled={studentAssignmentText.trim().length < 10}
                        className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all cursor-pointer disabled:bg-slate-200 disabled:text-slate-400"
                      >
                        Submit to Dean for Grading
                      </button>
                    </div>
                  )}
                </div>

                {/* Teacher / Student Playbooks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
                    <span className="text-[10px] font-mono font-bold text-violet-600 uppercase bg-violet-50 px-2 py-0.5 rounded-full inline-block">Dean's Teaching Blueprint</span>
                    <div className="prose prose-slate text-xs text-slate-600 leading-relaxed font-sans">
                      <ReactMarkdown>{getActiveLevelData().teacherGuide || "Review core analogies carefully with students."}</ReactMarkdown>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
                    <span className="text-[10px] font-mono font-bold text-violet-600 uppercase bg-violet-50 px-2 py-0.5 rounded-full inline-block">Student Revision Notebook</span>
                    <div className="prose prose-slate text-xs text-slate-600 leading-relaxed font-sans">
                      <ReactMarkdown>{getActiveLevelData().studentGuide || "Highlight flashcards to memorize fundamental concepts."}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm space-y-3">
                <GraduationCap className="w-12 h-12 mx-auto text-violet-300 animate-pulse" />
                <h3 className="font-display font-bold text-slate-800 text-base">Select or Assemble an Academy Course</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">Enter your focus subject in the dashboard quick assemble widget to build structured course syllabuses with tests, templates, and certifications.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VISUAL LEARNING ENGINE VISUALIZER */}
      {activeTab === "visualizer" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          {/* Controls column */}
          <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="border-b border-slate-100 pb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Visual Diagrams</span>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { id: "mindmap", label: "Mind Map" },
                { id: "flowchart", label: "Flowchart" },
                { id: "timeline", label: "Timeline Chart" }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setVisualizationType(opt.id as any); setSelectedNode(null); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    visualizationType === opt.id
                      ? "bg-violet-600 text-white border-transparent"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Export Formats</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleExportDiagram("svg")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>SVG</span>
                </button>

                <button
                  onClick={() => handleExportDiagram("png")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>PNG</span>
                </button>
              </div>

              <button
                onClick={() => handleExportDiagram("pdf")}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Print PDF</span>
              </button>
            </div>
          </div>

          {/* Interactive SVG Diagram canvas */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-[10px] font-mono font-bold text-violet-600 uppercase bg-violet-50 px-3 py-1 rounded-full">
                  Interactive Diagram Mode: {visualizationType.toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">[Click nodes to inspect nodes]</span>
              </div>

              {/* Render dynamic canvas */}
              {renderSVGDiagram()}

              {/* Explanatory Drawer for clicked node */}
              {selectedNode ? (
                <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-fadeIn space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase font-mono">{selectedNode.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{selectedNode.desc}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic text-center mt-4">Click any node on the diagram canvas above to inspect architectural definitions.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LEADERBOARD VIEW */}
      {activeTab === "leaderboard" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm animate-fadeIn max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-slate-800 flex items-center gap-1.5">
              <Users className="w-5 h-5 text-violet-600" />
              Academy Scholar Leaderboard
            </h3>
            <span className="text-xs font-mono text-slate-400">Weekly Performance Cycle</span>
          </div>

          <div className="space-y-3">
            {[
              { rank: 1, name: "Prerna Sharma", points: 4890, streak: 31, avatar: "P" },
              { rank: 2, name: "Anish Roy", points: 4120, streak: 24, avatar: "A" },
              { rank: 3, name: "Rohit Verma", points: 3650, streak: 18, avatar: "R" },
              { rank: 4, name: userProfile?.displayName || "You (Scholar)", points: userXP, streak: streak, avatar: "Y", isUser: true },
              { rank: 5, name: "Sanya Gupta", points: 940, streak: 6, avatar: "S" }
            ].map((schol, idx) => (
              <div key={idx} className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                schol.isUser 
                  ? "bg-violet-50/50 border-violet-200" 
                  : "bg-slate-50 border-slate-100 hover:border-slate-200"
              }`}>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-mono font-bold w-6 text-center ${
                    schol.rank === 1 ? "text-amber-500 font-extrabold" : schol.rank === 2 ? "text-slate-400" : schol.rank === 3 ? "text-amber-700" : "text-slate-500"
                  }`}>
                    #{schol.rank}
                  </span>

                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0">
                    {schol.avatar}
                  </div>

                  <span className={`text-xs font-bold ${schol.isUser ? "text-violet-700" : "text-slate-800"}`}>
                    {schol.name}
                  </span>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs">
                  <span className="text-slate-500">{schol.streak} Day streak 🔥</span>
                  <span className="text-slate-800 font-bold">{schol.points} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GOLDEN HONORS CERTIFICATE MODAL */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border-4 border-amber-500 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative space-y-6 overflow-hidden">
            {/* Ambient gold seals */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

            <button 
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Inner certificate border frame */}
            <div className="border-2 border-dashed border-amber-200/80 rounded-2xl p-6 text-center space-y-6">
              <div className="space-y-1">
                <div className="flex justify-center">
                  <Award className="w-16 h-16 text-amber-500 animate-pulse drop-shadow-md" />
                </div>
                <h3 className="font-serif font-black text-2xl tracking-wide uppercase text-amber-900">Certificate of Honors</h3>
                <p className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-widest">Sovereign Knowledge Academy of Excellence</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-500 font-sans italic">This is to officially certify that the scholar</p>
                
                {/* Editable Student Name input field */}
                <div className="max-w-md mx-auto relative group">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter Certificate Name..."
                    className="w-full text-center font-serif font-black text-xl text-slate-950 bg-transparent border-b-2 border-slate-200 group-hover:border-amber-400 focus:border-amber-500 focus:outline-none pb-1.5 transition-colors"
                  />
                  <div className="text-[8px] font-mono text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click name to customize before printing</div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-500 font-sans">has successfully completed the complete 4-tier intensive curriculum on</p>
                <h4 className="font-display font-black text-base text-violet-900 px-4 py-1 bg-violet-50 rounded-lg inline-block">{currentCourse?.title || topic}</h4>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">covering Beginner, Intermediate, Advanced, and Expert modules with honors distinction.</p>
              </div>

              {/* Certificate metadata */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 text-left max-w-md mx-auto">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-slate-400 uppercase block font-bold">Certification Date:</span>
                  <span className="text-xs font-bold text-slate-700 font-sans">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[8px] font-mono text-slate-400 uppercase block font-bold">Serial Registry ID:</span>
                  <span className="text-xs font-bold text-amber-700 font-mono block">{certSerialNumber || "REG-KLA-2026-X"}</span>
                </div>
              </div>
            </div>

            {/* Print and Export Buttons */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-[9px] font-mono text-slate-400">Dean of Academy: <b>Mr. Kilvish AI</b></span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => showToast("PDF format rendered. Ready to print or save via the print preview browser panel!", "info")}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Confer Honors</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4.5 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 text-xs font-semibold transform transition-all duration-300 hover:scale-[1.02] animate-fadeIn">
          {toast.type === "success" && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === "info" && <Info className="w-4 h-4 text-violet-400 shrink-0" />}
          {toast.type === "error" && <Info className="w-4 h-4 text-rose-400 shrink-0" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80 p-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      )}
    </div>
  );
}
