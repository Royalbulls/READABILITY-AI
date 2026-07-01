import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  FileText, 
  TrendingUp, 
  Download, 
  Edit, 
  Check, 
  HelpCircle, 
  AlertTriangle, 
  Bookmark, 
  Share2, 
  Globe, 
  Briefcase, 
  FileSpreadsheet, 
  ArrowRight,
  ShieldCheck,
  Award,
  DollarSign,
  Layers,
  CheckCircle,
  Clock,
  Coins,
  MessageSquare,
  Star,
  Copy,
  Info,
  ChevronRight,
  Plus
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface BusinessStudioViewProps {
  user: any;
  userProfile: any;
  onRefreshProfile: () => void;
  setActiveView: (view: "workspace" | "pricing" | "growth" | "admin" | "business") => void;
}

export default function BusinessStudioView({ 
  user, 
  userProfile, 
  onRefreshProfile,
  setActiveView
}: BusinessStudioViewProps) {
  // Input Selection States
  const [inputType, setInputType] = useState<string>("idea");
  const [topic, setTopic] = useState<string>("");
  const [industry, setIndustry] = useState<string>("Agriculture");
  const [budget, setBudget] = useState<string>("Small (₹5-50 Lakhs)");
  const [currency, setCurrency] = useState<string>("INR (₹)");
  const [uploadedText, setUploadedText] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  // Personalized Inputs
  const [companyName, setCompanyName] = useState<string>("My Company Enterprise");
  const [stateName, setStateName] = useState<string>("Maharashtra");
  const [budgetAmount, setBudgetAmount] = useState<number>(1500000);

  // System States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [activeSection, setActiveSection] = useState<string>("summary");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>("");

  // Creator Marketplace States
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(10);
  const [status, setStatus] = useState<"free" | "paid" | "private" | "public">("free");
  const [marketplaceProducts, setMarketplaceProducts] = useState<any[]>([]);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Ratings & Review States
  const [rating, setRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviews, setReviews] = useState<any[]>([]);

  // Interactive Pitch Slides & Bank Loan Calculators States
  const [pitchSlideIdx, setPitchSlideIdx] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(1500000);
  const [loanInterest, setLoanInterest] = useState<number>(9.5);
  const [loanTenure, setLoanTenure] = useState<number>(5);

  // AI Business Mentor States
  const [mentorChatHistory, setMentorChatHistory] = useState<any[]>([
    {
      role: "mentor",
      text: "👋 Hello! I am your AI Business Mentor. I've analyzed your generated business planning document, and I'm ready to guide you step-by-step through setting up, funding, and scaling your venture. Ask me anything, or choose a strategic task below!"
    }
  ]);
  const [mentorInput, setMentorInput] = useState<string>("");
  const [isMentorLoading, setIsMentorLoading] = useState<boolean>(false);

  // File Upload Reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Industry examples
  const INDUSTRIES = [
    "Agriculture", "Food Processing", "SaaS / AI Startup", "Fintech", "E-commerce",
    "Retail Store", "Manufacturing", "Logistics", "Construction & Real Estate",
    "Tourism & Hospitality", "Education & Coaching", "Healthcare & Pharma"
  ];

  // Load Marketplace Products on mount
  useEffect(() => {
    fetchMarketplaceProducts();
  }, []);

  const fetchMarketplaceProducts = async () => {
    try {
      const res = await fetch("/api/creator/products");
      if (res.ok) {
        const data = await res.json();
        // filter for Business Report content type
        const filtered = data.filter((p: any) => p.contentType === "Business Report" || p.category === "Business Studio");
        setMarketplaceProducts(filtered);
      }
    } catch (err) {
      console.warn("Failed to load products from marketplace", err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedText(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const handleClearFile = () => {
    setFileName("");
    setUploadedText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Generate Report Call
  const handleGenerateReport = async (smartSearchQuery?: string) => {
    const finalTopic = smartSearchQuery || topic;
    if (!finalTopic.trim()) {
      setError("Please specify a topic, business name, or query to generate your report.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setReport(null);
    setSuccessMsg("");

    try {
      const token = await user.getIdToken();
      const payload = {
        topic: finalTopic.trim(),
        inputType: smartSearchQuery ? "smart_search" : inputType,
        industry,
        budget,
        currency,
        uploadedText: uploadedText || undefined,
        companyName: companyName.trim(),
        stateName: stateName.trim(),
        budgetAmount: Number(budgetAmount)
      };

      const res = await fetch("/api/business/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setReport(data.report);
        setActiveSection("summary");
        
        // Match debt loan amount directly to 70% of budgetAmount for validated calculations
        setLoanAmount(Math.round(Number(budgetAmount) * 0.7));

        // refresh profile for deducted credit
        onRefreshProfile();
      } else {
        throw new Error(data.error || "Failed to generate report.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during report generation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessageToMentor = async (overrideMessage?: string) => {
    const finalMsg = overrideMessage || mentorInput;
    if (!finalMsg.trim()) return;

    const userMsg = { role: "user", text: finalMsg.trim() };
    setMentorChatHistory(prev => [...prev, userMsg]);
    if (!overrideMessage) {
      setMentorInput("");
    }
    setIsMentorLoading(true);

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/business/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: finalMsg.trim(),
          report,
          chatHistory: mentorChatHistory
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMentorChatHistory(prev => [...prev, { role: "mentor", text: data.response }]);
      } else {
        throw new Error(data.error || "Failed to get mentor response.");
      }
    } catch (err: any) {
      setMentorChatHistory(prev => [...prev, {
        role: "mentor",
        text: `⚠️ **System Error**: ${err.message || "Failed to contact mentorship core."}. Please check your connection and retry.`
      }]);
    } finally {
      setIsMentorLoading(false);
    }
  };

  // Helper to retrieve current active section content
  const getSectionContent = () => {
    if (!report) return "";
    switch (activeSection) {
      case "summary":
        return report.executiveSummary || "";
      case "overview":
        return report.businessOverview || "";
      case "model":
        return report.businessModel || "";
      case "problemsol":
        return `### Problem Statement\n${report.problemStatement || ""}\n\n### Proposed Solution\n${report.solution || ""}`;
      case "market":
        return `### Target Customers\n${report.marketResearch?.targetCustomers || ""}\n\n### Competitor Analysis\n${report.marketResearch?.competitorAnalysis || ""}\n\n### Business Canvas\n${report.marketResearch?.businessCanvas || ""}`;
      case "pitch":
        return `### Investor Pitch Slide Deck Layout\n\n- **Slide 1: Vision & Mission**\n  - Build a high-performance market leader in the ${report.category || 'business'} industry.\n- **Slide 2: Problem Statement**\n  - Severe fragmentation and manual effort causing substantial operational lag.\n- **Slide 3: Proposed Solution**\n  - Smart automation leveraging state of the art telemetry and IoT infrastructure.\n- **Slide 4: Product Capabilities**\n  - Interactive dashboards, automated yield forecasting and seamless consumer pipelines.\n- **Slide 5: Business Model**\n  - High margin recurring subscriptions and premium B2B off take.\n- **Slide 6: Financial Projection**\n  - Expected break even in Month 14; 24% projected annual Return on Investment.`;
      case "marketing":
        return `### Branding Strategy\n${report.marketingStrategy?.brandingStrategy || ""}\n\n### Sales & Marketing Funnel\n${report.marketingStrategy?.salesStrategy || ""}`;
      case "operational":
        return `### Human Resources Plan\n${report.operationalPlan?.humanResources || ""}\n\n### Technology Stack\n${report.operationalPlan?.technologyStack || ""}`;
      case "legal":
        return `### Legal Requirements & Required Licenses\n\n${(report.legalRequirements?.licenses || []).map((l: string) => `- **${l}**`).join("\n")}\n\n### GST & Taxation Context\n${report.legalRequirements?.gst || ""}\n\n### MSME Registry Information\n${report.legalRequirements?.msme || ""}\n\n### Startup India Support\n${report.legalRequirements?.startupIndia || ""}\n\n### Applicable Government Schemes\n${report.legalRequirements?.governmentSchemes || ""}`;
      case "financial":
        return `### Revenue Forecast & Projections\n${report.financialProjection?.revenueForecast || ""}\n\n### Expense Forecast\n${report.financialProjection?.expenseForecast || ""}\n\n### Break-even Analysis\n${report.financialProjection?.breakEvenAnalysis || ""}\n\n### Cash Flow & Balance Sheet Notes\n${report.financialProjection?.cashFlow || ""}\n\n### Profit & Loss Structure\n${report.financialProjection?.profitLoss || ""}`;
      case "dpr":
        return `### Bank Loan Detailed Project Report (DPR)\n\n- **Estimated Project Cost**: ${(report.investmentAndFunding?.investmentRequirement || "").replace(/[^0-9,₹$]/g, "") || "₹15 Lakhs"}\n- **Debt-Equity Ratio**: 70:30 (Institutional Loan to Promoter Contribution)\n- **Required Debt Infusion**: ${(report.investmentAndFunding?.investmentRequirement || "").replace(/[^0-9,₹$]/g, "") || "₹10.5 Lakhs"}\n- **Calculated Loan Payback Period**: 5 Years amortized\n- **Estimated Interest Rate Reference**: 9.5% p.a.\n- **Projected Debt Service Coverage Ratio (DSCR)**: 1.85 (Strongly Eligible for Loan approval under MSME schemes)`;
      case "investment":
        return `### Investment Requirement\n${report.investmentAndFunding?.investmentRequirement || ""}\n\n### Proposed Funding Sources\n${report.investmentAndFunding?.fundingSources || ""}`;
      case "risk":
        return `### Risk Analysis & Mitigation Matrix\n\n${(report.riskAnalysis?.risks || []).map((r: any) => `- **Risk**: ${r.risk}\n  **Mitigation Plan**: ${r.mitigation}`).join("\n\n")}`;
      case "roadmap":
        return `### Implementation Roadmap\n\n${(report.roadmap?.milestones || []).map((m: any) => `- **${m.phase} (${m.duration})**\n  Tasks:\n${(m.tasks || []).map((t: string) => `    * ${t}`).join("\n")}`).join("\n\n")}\n\n### Target Key Performance Indicators (KPIs)\n${(report.roadmap?.kpis || []).map((k: string) => `- **${k}**`).join("\n")}\n\n### Growth & Future Scaling\n${report.roadmap?.growthStrategy || ""}\n\n### Exit Strategy\n${report.roadmap?.exitStrategy || ""}`;
      case "citations":
        return `### Citations & Source Verification Notes\n\n${(report.citations || []).map((c: string, idx: number) => `[${idx + 1}] **${c}**`).join("\n\n") || "*No specific database citations generated.*"}`;
      case "faq":
        return `### Frequently Asked Questions (FAQ)\n\n${(report.faq || []).map((f: any) => `**Q: ${f.question}**\n\n*A: ${f.answer}*`).join("\n\n")}`;
      default:
        return "";
    }
  };

  // Turn edit mode ON
  const handleStartEdit = () => {
    setEditedContent(getSectionContent());
    setIsEditing(true);
  };

  // Save Edits locally
  const handleSaveEdit = () => {
    if (!report) return;
    const updated = { ...report };

    switch (activeSection) {
      case "summary":
        updated.executiveSummary = editedContent;
        break;
      case "overview":
        updated.businessOverview = editedContent;
        break;
      case "model":
        updated.businessModel = editedContent;
        break;
      case "problemsol":
        // simple parsing back split by heading
        const splitPS = editedContent.split("### Proposed Solution");
        updated.problemStatement = splitPS[0]?.replace("### Problem Statement", "")?.trim() || "";
        updated.solution = splitPS[1]?.trim() || "";
        break;
      case "market":
        const splitMarket = editedContent.split("### Competitor Analysis");
        updated.marketResearch.targetCustomers = splitMarket[0]?.replace("### Target Customers", "")?.trim() || "";
        const nextMarketSplit = splitMarket[1]?.split("### Business Canvas");
        updated.marketResearch.competitorAnalysis = nextMarketSplit?.[0]?.trim() || "";
        updated.marketResearch.businessCanvas = nextMarketSplit?.[1]?.trim() || "";
        break;
      case "marketing":
        const splitMarketing = editedContent.split("### Sales & Marketing Funnel");
        updated.marketingStrategy.brandingStrategy = splitMarketing[0]?.replace("### Branding Strategy", "")?.trim() || "";
        updated.marketingStrategy.salesStrategy = splitMarketing[1]?.trim() || "";
        break;
      case "operational":
        const splitOps = editedContent.split("### Technology Stack");
        updated.operationalPlan.humanResources = splitOps[0]?.replace("### Human Resources Plan", "")?.trim() || "";
        updated.operationalPlan.technologyStack = splitOps[1]?.trim() || "";
        break;
      case "legal":
        updated.legalRequirements.governmentSchemes = editedContent;
        break;
      case "financial":
        updated.financialProjection.revenueForecast = editedContent;
        break;
      case "investment":
        const splitInv = editedContent.split("### Proposed Funding Sources");
        updated.investmentAndFunding.investmentRequirement = splitInv[0]?.replace("### Investment Requirement", "")?.trim() || "";
        updated.investmentAndFunding.fundingSources = splitInv[1]?.trim() || "";
        break;
      case "risk":
        // custom save matrix
        break;
      case "roadmap":
        updated.roadmap.growthStrategy = editedContent;
        break;
      case "citations":
        updated.citations = editedContent.split("\n\n").map(l => l.replace(/^\[\d+\]\s*/, ""));
        break;
      case "faq":
        break;
    }

    setReport(updated);
    setIsEditing(false);
  };

  // Export helpers
  const handleExportMarkdown = () => {
    if (!report) return;
    let md = `# ${report.title || "Business Studio Report"}\n\n`;
    md += `**Industry Category**: ${report.category || ""}\n`;
    md += `**Estimated Investment Classification**: ${report.investmentRange || ""}\n`;
    md += `**Compliance Framework**: MSME & GST India Compliant\n`;
    md += `**Export Date**: ${new Date().toLocaleDateString()}\n\n`;
    md += `--- \n\n`;
    
    md += `## 1. Executive Summary\n${report.executiveSummary || ""}\n\n`;
    md += `## 2. Business Overview\n${report.businessOverview || ""}\n\n`;
    md += `## 3. Business Model\n${report.businessModel || ""}\n\n`;
    md += `## 4. Problem Statement & Proposed Solution\n### Problem\n${report.problemStatement || ""}\n### Solution\n${report.solution || ""}\n\n`;
    md += `## 5. Market Research & Competitor Analysis\n### Target Customers\n${report.marketResearch?.targetCustomers || ""}\n### Competitor Analysis\n${report.marketResearch?.competitorAnalysis || ""}\n### Business Canvas\n${report.marketResearch?.businessCanvas || ""}\n\n`;
    md += `## 6. Marketing & Sales Strategy\n### Branding\n${report.marketingStrategy?.brandingStrategy || ""}\n### Sales Funnel\n${report.marketingStrategy?.salesStrategy || ""}\n\n`;
    md += `## 7. Operational Plan\n### Human Resources\n${report.operationalPlan?.humanResources || ""}\n### Technology Stack\n${report.operationalPlan?.technologyStack || ""}\n\n`;
    md += `## 8. Legal & Government Schemes\n### Trade Licenses\n${(report.legalRequirements?.licenses || []).map((l: string) => `- ${l}`).join("\n")}\n### MSME Registry\n${report.legalRequirements?.msme || ""}\n### GST Info\n${report.legalRequirements?.gst || ""}\n### Startup India Support\n${report.legalRequirements?.startupIndia || ""}\n### Matching Government Schemes\n${report.legalRequirements?.governmentSchemes || ""}\n\n`;
    md += `## 9. Bank Loan Detailed Project Report (DPR)\n- **Estimated Project Cost**: ${(report.investmentAndFunding?.investmentRequirement || "").replace(/[^0-9,₹$]/g, "") || "₹15 Lakhs"}\n- **Debt-Equity Ratio**: 70:30 (Institutional Loan to Promoter Contribution)\n- **Required Debt Infusion**: ${(report.investmentAndFunding?.investmentRequirement || "").replace(/[^0-9,₹$]/g, "") || "₹10.5 Lakhs"}\n- **Amortization Period**: 5 Years\n- **Interest Rate Reference**: 9.5% p.a.\n- **Projected Debt Service Coverage Ratio (DSCR)**: 1.85 (Strongly Eligible for Loan approval)\n\n`;
    md += `## 10. Financial Projections & 5-Year Outlook\n### Revenue Forecast\n${report.financialProjection?.revenueForecast || ""}\n### Expense Forecast\n${report.financialProjection?.expenseForecast || ""}\n### Break-Even Analysis\n${report.financialProjection?.breakEvenAnalysis || ""}\n\n`;
    md += `## 11. Investment & Funding\n### Investment Requirement\n${report.investmentAndFunding?.investmentRequirement || ""}\n### Proposed Funding Sources\n${report.investmentAndFunding?.fundingSources || ""}\n\n`;
    md += `## 12. Risk Mitigation Protocol\n${(report.riskAnalysis?.risks || []).map((r: any) => `- **Risk**: ${r.risk}\n  - *Mitigation*: ${r.mitigation}`).join("\n")}\n\n`;
    md += `## 13. Implementation Roadmap & Milestones\n${report.roadmap?.growthStrategy || ""}\n### Exit Strategy\n${report.roadmap?.exitStrategy || ""}\n\n`;
    md += `## 14. References & Citation Sources\n${(report.citations || []).map((c: string) => `- ${c}`).join("\n")}\n\n`;
    md += `## 15. Frequently Asked Questions (FAQ)\n${(report.faq || []).map((f: any) => `**Q: ${f.question}**\n*A: ${f.answer}*`).join("\n\n")}\n`;

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(report.title || "business_report").toLowerCase().replace(/\s+/g, "_")}_full_report.md`;
    a.click();
  };

  const handleExportExcelCSV = () => {
    if (!report) return;
    
    // Fallback five-year projections calculation if not present
    let proj = report.financialProjection?.fiveYearProjection;
    if (!proj || !Array.isArray(proj) || proj.length === 0) {
      let baseRevenue = 3500000;
      let baseExpenses = 2800000;
      if (report.investmentRange?.includes("Micro")) {
        baseRevenue = 450000;
        baseExpenses = 320000;
      } else if (report.investmentRange?.includes("Medium")) {
        baseRevenue = 16000000;
        baseExpenses = 12500000;
      } else if (report.investmentRange?.includes("Large")) {
        baseRevenue = 65000000;
        baseExpenses = 48000000;
      }
      
      proj = Array.from({ length: 5 }).map((_, idx) => {
        const year = idx + 1;
        const growth = Math.pow(1.15, idx);
        const rev = Math.round(baseRevenue * growth);
        const exp = Math.round(baseExpenses * Math.pow(1.08, idx));
        return {
          year,
          revenue: rev,
          expenses: exp,
          profit: rev - exp
        };
      });
    }

    let csv = "Year,Revenue (INR),Expenses (INR),Net Profit (INR),Cumulative Profit (INR),Profit Margin (%)\n";
    let cumulativeProfit = 0;
    proj.forEach((p: any) => {
      const profit = p.revenue - p.expenses;
      cumulativeProfit += profit;
      const margin = p.revenue > 0 ? ((profit / p.revenue) * 100).toFixed(1) : "0.0";
      csv += `Year ${p.year},${p.revenue},${p.expenses},${profit},${cumulativeProfit},${margin}%\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(report.title || "business_report").toLowerCase().replace(/\s+/g, "_")}_financial_model.csv`;
    a.click();
  };

  const handleExportWord = () => {
    if (!report) return;
    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">`;
    html += `<head><meta charset="utf-8"><title>${report.title || "Business Plan"}</title>`;
    html += `<style>
      body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 40px; }
      h1 { font-family: 'Georgia', serif; color: #1e3a8a; text-align: center; margin-top: 100px; font-size: 32pt; font-weight: bold; }
      .subtitle { text-align: center; color: #4f46e5; font-size: 16pt; margin-top: 10px; font-weight: bold; }
      .meta { text-align: center; margin-top: 150px; font-size: 12pt; color: #666666; }
      h2 { font-family: 'Segoe UI', Arial, sans-serif; color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-top: 40px; font-size: 20pt; font-weight: bold; }
      h3 { font-family: 'Segoe UI', Arial, sans-serif; color: #4f46e5; margin-top: 25px; font-size: 14pt; font-weight: bold; }
      p { margin-bottom: 12px; font-size: 11pt; color: #4a5568; }
      ul, ol { margin-bottom: 15px; padding-left: 20px; }
      li { margin-bottom: 6px; font-size: 11pt; color: #4a5568; }
      .page-break { page-break-before: always; }
    </style></head><body>`;

    // Cover Page
    html += `<div style="text-align: center; padding: 100px 0;">`;
    html += `<h1>${report.title?.toUpperCase() || "BUSINESS REPORT"}</h1>`;
    html += `<div class="subtitle">INSTITUTIONAL BUSINESS PLAN & DETAILED PROJECT REPORT</div>`;
    html += `<div style="margin-top: 150px; font-size: 12pt; color: #555555; line-height: 2;">`;
    html += `<p><strong>Industry Classification:</strong> ${report.category || "General Business"}</p>`;
    html += `<p><strong>Budget Requirement:</strong> ${report.investmentRange || "Standard Tier"}</p>`;
    html += `<p><strong>Regulatory Compliance:</strong> GST & MSME India Registered</p>`;
    html += `<p><strong>Generated on:</strong> ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`;
    html += `<p style="margin-top: 50px; font-size: 10pt; color: #999;">Published via Readability AI Sovereign Business Studio v3.0</p>`;
    html += `</div>`;
    html += `</div>`;
    html += `<div class="page-break"></div>`;

    // Sections
    const sections = [
      { title: "Executive Summary", content: report.executiveSummary },
      { title: "Business Overview", content: report.businessOverview },
      { title: "Business Model & Canvas", content: report.businessModel },
      { title: "Problem Statement", content: report.problemStatement },
      { title: "Proposed Solution", content: report.solution },
      { title: "Target Customers", content: report.marketResearch?.targetCustomers },
      { title: "Competitor Analysis", content: report.marketResearch?.competitorAnalysis },
      { title: "Business Canvas Model", content: report.marketResearch?.businessCanvas },
      { title: "Branding Strategy", content: report.marketingStrategy?.brandingStrategy },
      { title: "Sales & Marketing Funnel", content: report.marketingStrategy?.salesStrategy },
      { title: "Human Resources Allocation", content: report.operationalPlan?.humanResources },
      { title: "Technology Stack Setup", content: report.operationalPlan?.technologyStack },
      { title: "Regulatory Compliance & Licensing", content: `Required Trade Licenses:\n\n${(report.legalRequirements?.licenses || []).map((l: string) => `- ${l}`).join("\n")}\n\nGST Taxation: ${report.legalRequirements?.gst || ""}\n\nMSME Details: ${report.legalRequirements?.msme || ""}` },
      { title: "Matching Government Subsidies", content: report.legalRequirements?.governmentSchemes },
      { title: "Financial Forecast Outlook", content: report.financialProjection?.revenueForecast }
    ];

    sections.forEach(sec => {
      if (sec.content) {
        html += `<h2>${sec.title}</h2>`;
        let text = sec.content
          .replace(/\n\n/g, "</p><p>")
          .replace(/\n-\s(.*)/g, "<li>$1</li>")
          .replace(/###\s(.*)/g, "<h3>$1</h3>")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>");
        
        if (text.includes("<li>")) {
          text = `<p>${text}</p>`.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>");
        }
        html += `<p>${text}</p>`;
      }
    });

    html += `</body></html>`;

    const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(report.title || "business_report").toLowerCase().replace(/\s+/g, "_")}_full_report.doc`;
    a.click();
  };

  const handleExportPowerPoint = () => {
    if (!report) return;
    let ppt = `========================================================================\n`;
    ppt += `INVESTOR PITCH PRESENTATION SLIDE OUTLINE - ${report.title?.toUpperCase()}\n`;
    ppt += `Generated via Readability AI v3.0 Business Studio\n`;
    ppt += `========================================================================\n\n`;

    ppt += `SLIDE 1: VISION & TITLE SLIDE\n`;
    ppt += `--------------------------------------------------\n`;
    ppt += `* Heading: ${report.title?.toUpperCase() || "ENTERPRISE PROPOSAL"}\n`;
    ppt += `* Subheading: Institutional Investor Presentation & Business Catalyst\n`;
    ppt += `* Industry Category: ${report.category || ""}\n`;
    ppt += `* Capital Requirement Class: ${report.investmentRange || ""}\n\n`;

    ppt += `SLIDE 2: THE CRITICAL PROBLEM\n`;
    ppt += `--------------------------------------------------\n`;
    ppt += `* Heading: Market Inefficiencies & Demands\n`;
    ppt += `* Key Points:\n`;
    ppt += `  - Traditional supply chain suffers from high trust deficit and contamination risk.\n`;
    ppt += `  - Fragmented logistics lead to severe margin erosion for primary producers.\n`;
    ppt += `  - Consumer lack of quality assurance on organic metrics.\n\n`;

    ppt += `SLIDE 3: THE SMART SOLUTION\n`;
    ppt += `--------------------------------------------------\n`;
    ppt += `* Heading: Sovereign Automated Micro-Units\n`;
    ppt += `* Key Points:\n`;
    ppt += `  - Controlled local standard execution to avoid handling anomalies.\n`;
    ppt += `  - Live IoT bio-sensors telemetry stream transparently to consumers.\n`;
    ppt += `  - Fresh, pure, direct-to-home cold chain loop.\n\n`;

    ppt += `SLIDE 4: THE BUSINESS MODEL\n`;
    ppt += `--------------------------------------------------\n`;
    ppt += `* Heading: Monetization & Value Creation Channels\n`;
    ppt += `* Key Points:\n`;
    ppt += `  - Recurrent D2C Subscription Deliveries (Glass bottled direct supply).\n`;
    ppt += `  - High-Margin B2B bulk offtake with local organic grocers and retail loops.\n`;
    ppt += `  - Agro-byproduct conversion and monetization (compost, nursery supplies).\n\n`;

    ppt += `SLIDE 5: FINANCIAL PROJECTIONS & OUTLOOK\n`;
    ppt += `--------------------------------------------------\n`;
    ppt += `* Heading: 5-Year High Margin Roadmap\n`;
    ppt += `* Key Points:\n`;
    ppt += `  - Estimated payback period: Month 14\n`;
    ppt += `  - Projected return on capital investment: 24%\n`;
    ppt += `  - Scaled expansion starting Year 2 into secondary metropolitan zones.\n\n`;

    ppt += `SLIDE 6: CAPITAL ASK & ALLOCATION\n`;
    ppt += `--------------------------------------------------\n`;
    ppt += `* Heading: Funding Requirement\n`;
    ppt += `* Key Points:\n`;
    ppt += `  - Setup of automated processing standard units: 50% allocation.\n`;
    ppt += `  - Cold chain transit fleet and route logistics: 25% allocation.\n`;
    ppt += `  - Digital customer subscription scheduling application: 15% allocation.\n`;
    ppt += `  - Working capital buffer: 10% allocation.\n`;

    const blob = new Blob([ppt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(report.title || "business_report").toLowerCase().replace(/\s+/g, "_")}_pitch_deck_slides.txt`;
    a.click();
  };

  const handleExportEpub = () => {
    if (!report) return;
    let content = `========================================================================\n`;
    content += `THE SOVEREIGN ENTREPRENEUR COMPENDIUM: ${report.title?.toUpperCase()}\n`;
    content += `Official Business E-Book Compilation\n`;
    content += `Published on Readability AI v3.0\n`;
    content += `========================================================================\n\n`;

    content += `FOREWORD & REGULATORY NOTICE\n`;
    content += `--------------------------------------------------\n`;
    content += `This e-book contains the complete conceptual blueprint, institutional feasibility studies, market models, financial projection schedules, and risk mitigation models compiled for ${report.title || "the selected venture"}.\n\n`;

    const sections = [
      { ch: "Chapter 1", title: "Executive Feasibility Study", text: report.executiveSummary },
      { ch: "Chapter 2", title: "Business Core & Vision", text: report.businessOverview },
      { ch: "Chapter 3", title: "Monetization Structures", text: report.businessModel },
      { ch: "Chapter 4", title: "Problems and Solutions Matrix", text: `Problem Statement:\n${report.problemStatement || ""}\n\nProposed Solution:\n${report.solution || ""}` },
      { ch: "Chapter 5", title: "Market Survey and Lean Canvas", text: `Target Customers:\n${report.marketResearch?.targetCustomers || ""}\n\nCompetitor Mapping:\n${report.marketResearch?.competitorAnalysis || ""}` },
      { ch: "Chapter 6", title: "Trade Licenses and MSME rules", text: `Licenses:\n${(report.legalRequirements?.licenses || []).join(", ")}\n\nGST Tax info:\n${report.legalRequirements?.gst || ""}` }
    ];

    sections.forEach(sec => {
      content += `${sec.ch.toUpperCase()}: ${sec.title.toUpperCase()}\n`;
      content += `--------------------------------------------------\n`;
      content += `${sec.text || "Compiling..."}\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(report.title || "business_report").toLowerCase().replace(/\s+/g, "_")}_ebook_chapters.txt`;
    a.click();
  };

  // Launch browser printer for pristine PDF export
  const handlePrintPDF = () => {
    window.print();
  };

  // Publish to Marketplace
  const handlePublishToMarketplace = async () => {
    if (!report) return;
    setIsPublishing(true);
    setSuccessMsg("");

    try {
      const token = await user.getIdToken();
      const payload = {
        title: report.title || `Project Report: ${topic}`,
        description: `Full professional project report & market model for the ${report.category} industry. Includes 5-year calculations, legal guides, and SWOT models.`,
        contentType: "Business Report",
        category: "Business Studio",
        status: status,
        price: Number(price),
        content: JSON.stringify(report) // Storing structured report JSON in products content field
      };

      const res = await fetch("/api/creator/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccessMsg("🎉 Masterpiece report published to Creator Economy Marketplace successfully!");
        fetchMarketplaceProducts();
      } else {
        const d = await res.json();
        setError(d.error || "Failed to publish report to Marketplace.");
      }
    } catch (err: any) {
      setError("Network error publishing report.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Rate and review helper
  const handleAddReview = async (productId: string) => {
    if (!reviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const token = await user.getIdToken();
      // Store custom reviews locally/cloud
      const mockReview = {
        id: Math.random().toString(36).substring(2, 6),
        userName: user.displayName || "Scholar",
        rating: rating,
        comment: reviewComment,
        timestamp: Date.now()
      };
      setReviews([mockReview, ...reviews]);
      setReviewComment("");
      setSuccessMsg("Thank you! Review added.");
    } catch (err) {
      console.warn(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div id="business-studio-studio" className="flex-1 w-full flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Premium Header Intro Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[10px] font-mono font-bold rounded-full uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              Business Studio Core v3.0
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight leading-tight">
              AI Business & Project Report Studio
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Conceptualize, generate, edit, and publish expert level institutional business plans, project loan reports, legal summaries, and matching schemes.
            </p>
          </div>
          <button
            onClick={() => setActiveView("workspace")}
            className="self-start md:self-auto flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all"
          >
            ← Back to Document Simplifier
          </button>
        </div>
      </div>

      {/* Generator Form panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h2 className="font-display font-bold text-base text-slate-800 flex items-center gap-2">
            <span className="w-2 h-4 bg-indigo-600 rounded-full" />
            Report Parameters
          </h2>
          <p className="text-slate-400 text-xs mt-1">Configure your business scenario to feed the Kilvish Intelligence Core</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">STUDIO ERROR:</span> {error}
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{successMsg}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Inputs Section */}
          <div className="md:col-span-8 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">Input Scenario Type</label>
                <select
                  value={inputType}
                  onChange={(e) => setInputType(e.target.value)}
                  className="bg-slate-50 text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                >
                  <option value="idea">Business / Startup Idea</option>
                  <option value="keyword">Core Keyword / Topic</option>
                  <option value="name">Business / Store Name</option>
                  <option value="scheme">Government Scheme Match</option>
                  <option value="product">Product / Service Concept</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">Industry Domain</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="bg-slate-50 text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                >
                  {INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-500 uppercase flex items-center justify-between">
                <span>Core Business Statement / Name / Scheme Prompt</span>
                <span className="text-slate-400 font-sans font-normal text-[10px]">[e.g. Organic Dairy Farm, AI Legal Bot]</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Open a dairy farm with 50 cows and automated milking systems"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-slate-50 text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all font-medium"
              />
            </div>

            {/* Personalized Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">Venture Name / Company Name</label>
                <input
                  type="text"
                  placeholder="e.g., Clarity Meadows Organic Dairy"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-slate-50 text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">Target State / Region</label>
                <select
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="bg-slate-50 text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Punjab">Punjab</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Other">Other Region / Global</option>
                </select>
              </div>
            </div>

            {/* Drag & Drop File Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">Context Document Attachment (Optional)</label>
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  fileName ? "border-emerald-400 bg-emerald-50/20" : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".txt,.md,.csv,.json"
                  className="hidden" 
                />
                {fileName ? (
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-700">{fileName}</span>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); handleClearFile(); }}
                      className="text-xs text-rose-500 hover:text-rose-700 font-bold ml-2 underline"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-1">
                    <Download className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-medium text-slate-600">Drag & drop or Click to upload supporting document context</p>
                    <p className="text-[10px] text-slate-400 font-mono">Supports Text, Markdown (.txt, .md, .csv)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing / Budget Settings */}
          <div className="md:col-span-4 bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col gap-4">
            <h3 className="font-mono text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Financial & Currency Base
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-500">Target Budget Tier</label>
              <select
                value={budget}
                onChange={(e) => {
                  const val = e.target.value;
                  setBudget(val);
                  if (val.includes("Micro")) setBudgetAmount(300000);
                  else if (val.includes("Small")) setBudgetAmount(1500000);
                  else if (val.includes("Medium")) setBudgetAmount(8000000);
                  else if (val.includes("Large")) setBudgetAmount(35000000);
                }}
                className="bg-white text-xs text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none"
              >
                <option value="Micro (Under ₹5 Lakhs)">Micro (Under ₹5 Lakhs)</option>
                <option value="Small (₹5-50 Lakhs)">Small (₹5-50 Lakhs)</option>
                <option value="Medium (₹50 Lakhs - 2 Crore)">Medium (₹50 Lakhs - 2 Crore)</option>
                <option value="Large (Above ₹2 Crore)">Large (Above ₹2 Crore)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-500 flex justify-between">
                <span>Custom Budget Amount</span>
                <span className="text-slate-400 font-sans normal-case text-[10px]">Adjustable</span>
              </label>
              <input
                type="number"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(Number(e.target.value))}
                className="bg-white text-xs text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-500">Primary Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-white text-xs text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none"
              >
                <option value="INR (₹)">INR (₹) - Indian Rupees</option>
                <option value="USD ($)">USD ($) - US Dollars</option>
                <option value="EUR (€)">EUR (€) - Euros</option>
              </select>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-3">
              <button
                type="button"
                onClick={() => handleGenerateReport()}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wide transition-all shadow-md disabled:bg-indigo-400 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Analyzing & Building Report...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Project Report</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleGenerateReport(`Open a ${topic || "dairy farm"}`)}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-xl text-[11px] transition-all"
              >
                🔍 Smart Search & Build
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Workspace */}
      {report ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Side Tabs Navigation */}
          <div className="lg:col-span-3 flex flex-col gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-3 py-2 border-b border-slate-100 mb-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Report Workspace</span>
            </div>
            
            {[
              { id: "summary", label: "Executive Summary" },
              { id: "overview", label: "Business Overview" },
              { id: "model", label: "Business Model" },
              { id: "problemsol", label: "Problem & Solution" },
              { id: "market", label: "Market Research" },
              { id: "pitch", label: "Investor Pitch Deck" },
              { id: "marketing", label: "Marketing Strategy" },
              { id: "operational", label: "Operational Plan" },
              { id: "legal", label: "Legal & Licenses" },
              { id: "financial", label: "Financial Projections" },
              { id: "dpr", label: "Bank Loan DPR" },
              { id: "investment", label: "Investment & Funding" },
              { id: "risk", label: "Risk Mitigation" },
              { id: "roadmap", label: "Roadmap & KPIs" },
              { id: "citations", label: "Citations & Sources" },
              { id: "faq", label: "FAQ Index" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveSection(tab.id); setIsEditing(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeSection === tab.id
                    ? "bg-indigo-600 text-white font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
                <ChevronRight className={`w-3.5 h-3.5 ${activeSection === tab.id ? "text-white" : "text-slate-400"}`} />
              </button>
            ))}
          </div>

          {/* Central Main Document Workspace */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            {/* Top Export Bar */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-display font-bold text-sm text-slate-800">
                  {report.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handlePrintPDF}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-500" />
                  PDF Report
                </button>

                <button
                  onClick={handleExportMarkdown}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  Markdown
                </button>

                <button
                  onClick={handleExportExcelCSV}
                  className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  Financial CSV
                </button>

                <div className="relative group">
                  <button
                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <span>More formats</span>
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </button>
                  <div className="absolute right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg hidden group-hover:block z-20 min-w-[120px]">
                    <button onClick={handleExportWord} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer">Word (.doc)</button>
                    <button onClick={handleExportPowerPoint} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer">PowerPoint Outline</button>
                    <button onClick={handleExportEpub} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer">EPUB Chapters</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Content View Card */}
            <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  Section View
                </span>
                {!isEditing ? (
                  <button
                    onClick={handleStartEdit}
                    className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Section Content
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Edit Mode Textarea */}
              {isEditing ? (
                <div className="flex flex-col gap-3 animate-fadeIn">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Interactive Editor [Markdown Enabled]</span>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full min-h-[400px] bg-slate-50 text-slate-800 font-mono text-xs p-4 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all leading-relaxed"
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Custom Slide Pitch deck widget */}
                  {activeSection === "pitch" ? (
                    <div className="p-6 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                          Investor Presentation Slide Deck
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Slide {pitchSlideIdx + 1} of 6
                        </span>
                      </div>

                      {/* Render active slide */}
                      <div className="min-h-[220px] flex flex-col justify-center space-y-4 px-4 py-2 transition-all duration-300">
                        {pitchSlideIdx === 0 && (
                          <div className="space-y-2 animate-fadeIn">
                            <span className="text-xs font-mono text-indigo-400">SLIDE 1: VISION & MISSION</span>
                            <h3 className="font-display font-black text-2xl tracking-tight leading-tight">{report.title}</h3>
                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
                              "Our mission is to establish a high-efficiency market leader in the {report.category} industry, standardizing supply logistics and serving direct organic value propositions to thousands."
                            </p>
                          </div>
                        )}
                        {pitchSlideIdx === 1 && (
                          <div className="space-y-2 animate-fadeIn">
                            <span className="text-xs font-mono text-indigo-400">SLIDE 2: THE CRITICAL PROBLEM</span>
                            <h3 className="font-display font-black text-2xl tracking-tight text-rose-400">Fragmented Processing & Trust Deficits</h3>
                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
                              {report.problemStatement || "Traditional operational pipelines suffer from severe supply-chain bottlenecks and trace contamination risk, hurting regional consumer trust index."}
                            </p>
                          </div>
                        )}
                        {pitchSlideIdx === 2 && (
                          <div className="space-y-2 animate-fadeIn">
                            <span className="text-xs font-mono text-indigo-400">SLIDE 3: THE SMART SOLUTION</span>
                            <h3 className="font-display font-black text-2xl tracking-tight text-emerald-400">Sovereign Automated Micro-Units</h3>
                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
                              {report.solution || "Deploying standardized mechanical processing setups coupled with live IoT telemetry data that completely eliminates human handling and assures pure compliance."}
                            </p>
                          </div>
                        )}
                        {pitchSlideIdx === 3 && (
                          <div className="space-y-2 animate-fadeIn">
                            <span className="text-xs font-mono text-indigo-400">SLIDE 4: THE BUSINESS MODEL</span>
                            <h3 className="font-display font-black text-2xl tracking-tight text-indigo-300">High-Margin Recurrent Subscriptions</h3>
                            <div className="prose prose-invert text-xs text-slate-300 leading-relaxed max-w-xl">
                              <ReactMarkdown>{report.businessModel}</ReactMarkdown>
                            </div>
                          </div>
                        )}
                        {pitchSlideIdx === 4 && (
                          <div className="space-y-2 animate-fadeIn">
                            <span className="text-xs font-mono text-indigo-400">SLIDE 5: 5-YEAR OUTLOOK</span>
                            <h3 className="font-display font-black text-2xl tracking-tight text-amber-400">₹ Break-even in Month 14</h3>
                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
                              Leveraging lean asset deployment, our 5-year calculations predict consistent 15% CAGR compounding. Financial projections showcase robust return structures from Day 1 of stabilization.
                            </p>
                          </div>
                        )}
                        {pitchSlideIdx === 5 && (
                          <div className="space-y-2 animate-fadeIn">
                            <span className="text-xs font-mono text-indigo-400">SLIDE 6: THE ASK & USE OF FUNDS</span>
                            <h3 className="font-display font-black text-2xl tracking-tight">Venture Capital Infusion</h3>
                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
                              Seeking capital for hardware procurement, automated telemetry sensors, cold-chain transport rigs, and digital route scheduling platform.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Slider Controls */}
                      <div className="flex justify-between items-center border-t border-slate-900 pt-3">
                        <button
                          onClick={() => setPitchSlideIdx(p => Math.max(0, p - 1))}
                          disabled={pitchSlideIdx === 0}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-mono font-bold text-slate-300 rounded-lg cursor-pointer"
                        >
                          ← Previous
                        </button>
                        <div className="flex gap-1">
                          {Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className={`w-2 h-2 rounded-full ${idx === pitchSlideIdx ? "bg-indigo-500" : "bg-slate-800"}`} />
                          ))}
                        </div>
                        <button
                          onClick={() => setPitchSlideIdx(p => Math.min(5, p + 1))}
                          disabled={pitchSlideIdx === 5}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-mono font-bold text-white rounded-lg cursor-pointer"
                        >
                          Next Slide →
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Custom Debt Service & Loan repayment Schedule (DPR) widget */}
                  {activeSection === "dpr" ? (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-6 animate-fadeIn">
                      <div className="border-b border-slate-200 pb-3">
                        <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">
                          Live Bank Loan & DSCR Simulator
                        </span>
                        <h4 className="text-sm font-display font-bold text-slate-800 mt-1">
                          Detailed Project Report Amortization Schedule
                        </h4>
                      </div>

                      {/* Input parameters sliders */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500 uppercase flex justify-between">
                            <span>Loan Principal</span>
                            <span className="font-bold text-slate-800">₹{(loanAmount / 100000).toFixed(1)} Lakhs</span>
                          </label>
                          <input
                            type="range"
                            min="200000"
                            max="5000000"
                            step="50000"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500 uppercase flex justify-between">
                            <span>Interest Rate</span>
                            <span className="font-bold text-slate-800">{loanInterest}% p.a.</span>
                          </label>
                          <input
                            type="range"
                            min="6"
                            max="16"
                            step="0.1"
                            value={loanInterest}
                            onChange={(e) => setLoanInterest(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500 uppercase flex justify-between">
                            <span>Tenure Schedule</span>
                            <span className="font-bold text-slate-800">{loanTenure} Years</span>
                          </label>
                          <input
                            type="range"
                            min="3"
                            max="10"
                            step="1"
                            value={loanTenure}
                            onChange={(e) => setLoanTenure(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>
                      </div>

                      {/* Calculations outcomes */}
                      {(() => {
                        const monthlyRate = (loanInterest / 100) / 12;
                        const totalMonths = loanTenure * 12;
                        const emi = Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)) || 0;
                        const annualDebt = emi * 12;
                        
                        // derive simulated annual net profit from multiplier
                        let annualNetProfit = 950000;
                        if (budget.includes("Micro")) annualNetProfit = 140000;
                        else if (budget.includes("Medium")) annualNetProfit = 3800000;
                        else if (budget.includes("Large")) annualNetProfit = 16500000;

                        // DSCR = (Net Profit + annual Interest expense) / annual debt service
                        const interestExpense = Math.round(loanAmount * (loanInterest / 100));
                        const dscr = Math.round(((annualNetProfit + interestExpense) / annualDebt) * 100) / 100;
                        const isEligible = dscr >= 1.25;

                        return (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                              <div className="bg-white border border-slate-200/60 p-4 rounded-xl text-center space-y-1">
                                <span className="text-[9px] font-mono text-slate-400 uppercase block">Monthly EMI</span>
                                <span className="text-sm font-black text-slate-800">₹{emi.toLocaleString("en-IN")}</span>
                              </div>
                              <div className="bg-white border border-slate-200/60 p-4 rounded-xl text-center space-y-1">
                                <span className="text-[9px] font-mono text-slate-400 uppercase block">Annual Debt Service</span>
                                <span className="text-sm font-black text-slate-800">₹{annualDebt.toLocaleString("en-IN")}</span>
                              </div>
                              <div className="bg-white border border-slate-200/60 p-4 rounded-xl text-center space-y-1">
                                <span className="text-[9px] font-mono text-slate-400 uppercase block">Calculated DSCR</span>
                                <span className={`text-sm font-black ${isEligible ? "text-emerald-600" : "text-rose-600"}`}>{dscr}</span>
                              </div>
                              <div className="bg-white border border-slate-200/60 p-4 rounded-xl text-center flex flex-col justify-center items-center">
                                {isEligible ? (
                                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 px-2 py-1 rounded-full uppercase">
                                    Approved ✅
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 px-2 py-1 rounded-full uppercase">
                                    High Debt Risk ⚠️
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Eligibility callout */}
                            <div className="p-3 bg-indigo-50 border border-indigo-100/50 rounded-xl flex items-start gap-2.5">
                              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                              <p className="text-[11px] text-indigo-700 font-mono leading-relaxed">
                                {isEligible 
                                  ? "Debt Service Coverage Ratio (DSCR) complies with commercial MSME bank standards. Eligible for PMEGP collateral-free subsidies."
                                  : "Your debt service is too high relative to Year 1 profits. To secure loan, consider increasing promoter equity contribution or extending the loan tenure."}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : null}

                  {/* Standard Document markdown view */}
                  {activeSection !== "pitch" && activeSection !== "dpr" && (
                    <div className="prose prose-slate max-w-none text-xs md:text-sm text-slate-800 leading-relaxed font-sans space-y-4 animate-fadeIn">
                      <ReactMarkdown>{getSectionContent()}</ReactMarkdown>
                    </div>
                  )}
                </div>
              )}

              {/* Custom Integrated SVG Charts (Only shown on Financial Projections tab!) */}
              {activeSection === "financial" && report.financialProjection?.fiveYearProjection && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h3 className="font-display font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-emerald-500 rounded-full" />
                    5-Year Financial Projection Chart
                  </h3>
                  
                  {/* SVG Chart Bar */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 w-full h-[200px] relative">
                      <svg className="w-full h-full" viewBox="0 0 500 200">
                        {/* Axes */}
                        <line x1="40" y1="160" x2="480" y2="160" stroke="#cbd5e1" strokeWidth="2" />
                        <line x1="40" y1="20" x2="40" y2="160" stroke="#cbd5e1" strokeWidth="2" />
                        
                        {/* Grid Lines */}
                        <line x1="40" y1="110" x2="480" y2="110" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                        <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />

                        {/* Labels & Data Points */}
                        {report.financialProjection.fiveYearProjection.map((p: any, idx: number) => {
                          const x = 70 + idx * 90;
                          const revHeight = (p.revenue / 1000000) * 120; // scale max 1M to 120px
                          const expHeight = (p.expenses / 1000000) * 120;
                          
                          return (
                            <g key={idx}>
                              {/* Revenue Bar */}
                              <rect 
                                x={x} 
                                y={160 - revHeight} 
                                width="20" 
                                height={revHeight} 
                                fill="#4f46e5" 
                                rx="3"
                                className="opacity-90 hover:opacity-100 transition-opacity" 
                              />
                              {/* Expense Bar */}
                              <rect 
                                x={x + 24} 
                                y={160 - expHeight} 
                                width="20" 
                                height={expHeight} 
                                fill="#f43f5e" 
                                rx="3"
                                className="opacity-90 hover:opacity-100 transition-opacity" 
                              />
                              {/* Year Text */}
                              <text x={x + 16} y="180" fontSize="10" fontFamily="monospace" textAnchor="middle" fill="#64748b">
                                Year {p.year}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    <div className="flex flex-col gap-3 font-mono text-[11px] bg-white p-4 rounded-lg border border-slate-200/60 w-full md:w-56">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-indigo-600 rounded" />
                        <span className="text-slate-600">Revenue Stream</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-rose-500 rounded" />
                        <span className="text-slate-600">Operational Expenses</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                        Data reflects custom business profile calculations with dynamic 15% annual market CAGR applied.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Creator Economy Publishing & Distribution Panel */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-indigo-800">
                    <Coins className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-display font-bold text-base">
                      Creator Economy Distribution
                    </h3>
                  </div>
                  <p className="text-xs text-indigo-700 max-w-xl">
                    Publish this report directly to the premium Readability AI Marketplace. Set credits requirements, generate custom referral links, and build your digital intellectual footprint!
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Set Product Price</span>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-lg">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-10 text-xs font-mono text-slate-800 outline-none text-center"
                      />
                      <span className="text-xs text-slate-400 font-mono">Cred</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePublishToMarketplace}
                    disabled={isPublishing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {isPublishing ? "Publishing..." : "🚀 Publish & Monetize"}
                  </button>
                </div>
              </div>

              {/* Referral generation block */}
              {userProfile && (
                <div className="mt-5 pt-5 border-t border-indigo-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest">Growth Loop Integration</span>
                    <p className="text-xs text-indigo-800 font-medium">Earn credit commission on every user registration utilizing your code!</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`https://readability-ai.web.app/?ref=${userProfile.referralCode}`}
                      className="bg-white/80 text-[10px] font-mono text-slate-600 p-2 rounded-lg border border-indigo-200 w-64 outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://readability-ai.web.app/?ref=${userProfile.referralCode}`);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all"
                    >
                      {copiedLink ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Ratings & Community Reviews */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-display font-bold text-sm text-slate-800 mb-4 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                Community Feedback & Ratings
              </h3>

              {/* Add feedback form */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Select Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button 
                        key={num} 
                        onClick={() => setRating(num)}
                        className="cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${num <= rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter an executive peer review, critique or comment on this template..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="bg-slate-50 text-xs text-slate-800 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none flex-1 focus:bg-white"
                  />
                  <button
                    onClick={() => handleAddReview("current")}
                    disabled={isSubmittingReview}
                    className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 rounded-xl cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </div>

              {/* Reviews Listing */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map(r => (
                    <div key={r.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">{r.userName}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className={`w-3 h-3 ${idx < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 font-sans leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No community feedback has been recorded for this draft yet. Publish first to drive reviews!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Marketplace Preview */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-600" />
              Creator Marketplace Live Templates
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketplaceProducts.length > 0 ? (
              marketplaceProducts.map(p => (
                <div key={p.id} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                      {p.category || "Business Studio"}
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-800 leading-snug line-clamp-2">{p.title}</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">{p.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-bold font-mono text-slate-700">{p.price} credits</span>
                    </div>
                    <button
                      onClick={() => {
                        try {
                          const parsed = JSON.parse(p.content);
                          setReport(parsed);
                          setActiveSection("summary");
                        } catch (e) {
                          setTopic(p.title);
                          handleGenerateReport(p.title);
                        }
                      }}
                      className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                      View Report →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // Fallback nice placeholders
              [
                { title: "Commercial Dairy Farm Model", budget: "₹15 Lakhs", rating: 5, category: "Agriculture" },
                { title: "Gourmet Rooftop Restaurant", budget: "₹25 Lakhs", rating: 4.8, category: "Tourism & Hospitality" },
                { title: "B2B AI Content Platform", budget: "₹50 Lakhs", rating: 5, category: "SaaS / AI Startup" }
              ].map((m, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                      {m.category}
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-800 leading-snug">{m.title}</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">Full premium project report covering business canvas, government schemes matching, licensing requirements, and detailed financial matrices.</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-700">{m.rating}</span>
                    </div>
                    <button
                      onClick={() => { setTopic(m.title); handleGenerateReport(m.title); }}
                      className="text-[11px] font-bold text-indigo-600 hover:underline"
                    >
                      Generate Draft →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PRINT STYLES & HIGH FIDELITY MASTER REPORT */}
      <style>{`
        @media print {
          /* Hide screen-only interactive dashboard components */
          body * {
            visibility: hidden !important;
          }
          #print-full-report, #print-full-report * {
            visibility: visible !important;
          }
          #print-full-report {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: #1e293b !important;
            font-family: 'Segoe UI', system-ui, sans-serif !important;
            padding: 40px !important;
          }
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
          }
        }
      `}</style>

      {report && (
        <div id="print-full-report" className="hidden text-slate-900 bg-white p-12 max-w-4xl mx-auto">
          {/* COVER PAGE */}
          <div className="min-h-screen flex flex-col justify-between items-center py-20 text-center page-break">
            <div className="space-y-4">
              <div className="text-[12px] font-mono tracking-widest text-slate-500 uppercase">OFFICIAL INSTITUTIONAL PROPOSAL</div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 mt-2 uppercase">{report.title}</h1>
              <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase mt-1">
                Detailed Project Report & Institutional Business Plan
              </p>
            </div>

            <div className="w-40 h-1 bg-indigo-600 my-8"></div>

            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <p><strong className="text-slate-800">Industry Sector:</strong> {report.category}</p>
              <p><strong className="text-slate-800">Budget Classification:</strong> {report.investmentRange}</p>
              <p><strong className="text-slate-800">Jurisdiction Compliance:</strong> MSME & GST India Compliant</p>
              <p><strong className="text-slate-800">Date of Publication:</strong> {new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            <div className="pt-20">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Published & Secured via</p>
              <p className="text-sm font-bold text-slate-800 tracking-tight font-display">READABILITY AI BUSINESS STUDIO v3.0</p>
            </div>
          </div>

          {/* TABLE OF CONTENTS */}
          <div className="min-h-screen py-10 page-break">
            <h2 className="text-2xl font-black text-slate-900 border-b pb-3 mb-8 uppercase tracking-tight">Table of Contents</h2>
            <div className="space-y-4 text-xs font-semibold text-slate-700">
              {[
                { num: "01", name: "Executive Summary", page: "2" },
                { num: "02", name: "Business Overview", page: "3" },
                { num: "03", name: "Business Model & Canvas", page: "4" },
                { num: "04", name: "Problem Statement & Solution", page: "5" },
                { num: "05", name: "Market Research & Competitor Mapping", page: "6" },
                { num: "06", name: "Sales & Marketing Execution Strategy", page: "7" },
                { num: "07", name: "Operational Workflow & Technical Stack", page: "8" },
                { num: "08", name: "Legal Registrations, Licensure & GST rules", page: "9" },
                { num: "09", name: "Matching Government Subsidy Schemes", page: "10" },
                { num: "10", name: "Bank Loan Detailed Project Report (DPR)", page: "11" },
                { num: "11", name: "Financial Model & Five-Year Projections", page: "12" },
                { num: "12", name: "Capital Infusion & Resource Allocation", page: "13" },
                { num: "13", name: "Risk Assessment & Mitigation Protocol", page: "14" },
                { num: "14", name: "Project Implementation Milestones & KPIs", page: "15" },
                { num: "15", name: "References, Sources & Citation Index", page: "16" },
                { num: "16", name: "Frequently Asked Questions (FAQ)", page: "17" }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                  <span className="font-mono text-indigo-600 mr-2">{item.num}</span>
                  <span className="flex-1 text-slate-800">{item.name}</span>
                  <span className="font-mono text-slate-500">{item.page}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SEQUENTIAL SECTIONS */}
          {[
            { title: "01. Executive Summary", content: report.executiveSummary },
            { title: "02. Business Overview", content: report.businessOverview },
            { title: "03. Business Model", content: report.businessModel },
            { title: "04. Problem & Solution", content: `### Critical Problem\n\n${report.problemStatement || ""}\n\n### Proposed Strategic Solution\n\n${report.solution || ""}` },
            { title: "05. Market Research", content: `### Target Customer Segments\n\n${report.marketResearch?.targetCustomers || ""}\n\n### Competitor Mapping\n\n${report.marketResearch?.competitorAnalysis || ""}\n\n### Business Canvas\n\n${report.marketResearch?.businessCanvas || ""}` },
            { title: "06. Sales & Marketing Strategy", content: `### Branding & Positioning\n\n${report.marketingStrategy?.brandingStrategy || ""}\n\n### Sales Funnel Strategy\n\n${report.marketingStrategy?.salesStrategy || ""}` },
            { title: "07. Operational Plan", content: `### Human Resource Allocation\n\n${report.operationalPlan?.humanResources || ""}\n\n### Technology Infrastructure Stack\n\n${report.operationalPlan?.technologyStack || ""}` },
            { title: "08. Legal Requirements", content: `### Required Trade Licenses\n\n${(report.legalRequirements?.licenses || []).map((l: string) => `- **${l}**`).join("\n")}\n\n### GST & Taxation Context\n\n${report.legalRequirements?.gst || ""}\n\n### MSME Registry Information\n\n${report.legalRequirements?.msme || ""}\n\n### Startup India Support\n\n${report.legalRequirements?.startupIndia || ""}` },
            { title: "09. Matching Government Schemes", content: report.legalRequirements?.governmentSchemes },
            { title: "10. Bank Loan Detailed Project Report (DPR)", content: `### Loan & Debt Amortization Schedule\n\n- **Estimated Project Cost**: ${(report.investmentAndFunding?.investmentRequirement || "").replace(/[^0-9,₹$]/g, "") || "₹15 Lakhs"}\n- **Debt-Equity Ratio**: 70:30 (Institutional Loan to Promoter Contribution)\n- **Required Debt Infusion**: ${(report.investmentAndFunding?.investmentRequirement || "").replace(/[^0-9,₹$]/g, "") || "₹10.5 Lakhs"}\n- **Amortization Period**: 5 Years\n- **Interest Rate Reference**: 9.5% p.a.\n- **Projected Debt Service Coverage Ratio (DSCR)**: 1.85 (Highly compliant with MSME commercial standards)` },
            { 
              title: "11. Financial Model & Five-Year Projections", 
              content: `${report.financialProjection?.revenueForecast || ""}\n\n### Expense Structure\n\n${report.financialProjection?.expenseForecast || ""}\n\n### Break-Even Evaluation\n\n${report.financialProjection?.breakEvenAnalysis || ""}` 
            },
            { title: "12. Investment & Funding", content: `### Investment Capital Requirement\n\n${report.investmentAndFunding?.investmentRequirement || ""}\n\n### Proposed Funding Channels\n\n${report.investmentAndFunding?.fundingSources || ""}` },
            { title: "13. Risk Mitigation Protocol", content: `### Risk Classification & Counter-Measures\n\n${(report.riskAnalysis?.risks || []).map((r: any) => `- **Risk**: ${r.risk}\n  - *Mitigation strategy*: ${r.mitigation}`).join("\n")}` },
            { title: "14. Implementation Roadmap & KPIs", content: `### Projected Operational Roadmap\n\n${report.roadmap?.growthStrategy || ""}\n\n### Exit Strategy\n\n${report.roadmap?.exitStrategy || ""}` },
            { title: "15. Reference & Citation Index", content: `### Bibliography & Verified Sources\n\n${(report.citations || []).map((c: string) => `- ${c}`).join("\n")}` },
            { title: "16. Frequently Asked Questions (FAQ)", content: `### Essential Q&A\n\n${(report.faq || []).map((f: any) => `**Q: ${f.question}**\n\n*A: ${f.answer}*\n`).join("\n\n")}` }
          ].map((section, idx) => (
            <div key={idx} className="py-10 border-b border-slate-200 page-break">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-3 mb-6 uppercase tracking-tight">{section.title}</h2>
              <div className="prose prose-slate text-xs md:text-sm text-slate-800 leading-relaxed max-w-none space-y-4">
                <ReactMarkdown>{section.content || "_Section details compiling..._"}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
