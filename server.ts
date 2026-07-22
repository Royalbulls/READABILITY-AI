import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import dotenv from "dotenv";
import { generateFullMasterBlueprint } from "./src/lib/masterBlueprintGenerator";

// Load environment variables
dotenv.config();

const COURSES_FILE = path.join(process.cwd(), "courses.json");
const COMMUNITY_FILE = path.join(process.cwd(), "community.json");

// Safe helper to read courses
async function readCourses(): Promise<Record<string, any>> {
  try {
    if (!fs.existsSync(COURSES_FILE)) {
      return {};
    }
    const data = await fs.promises.readFile(COURSES_FILE, "utf-8");
    return JSON.parse(data || "{}");
  } catch (err) {
    console.error("Error reading courses file, returning empty:", err);
    return {};
  }
}

// Safe helper to read community
async function readCommunity(): Promise<Record<string, any>> {
  try {
    if (!fs.existsSync(COMMUNITY_FILE)) {
      return {};
    }
    const data = await fs.promises.readFile(COMMUNITY_FILE, "utf-8");
    return JSON.parse(data || "{}");
  } catch (err) {
    console.error("Error reading community file, returning empty:", err);
    return {};
  }
}

// Safe helper to save community
async function saveCommunity(data: Record<string, any>): Promise<void> {
  try {
    await fs.promises.writeFile(COMMUNITY_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving community file:", err);
  }
}

// Safe helper to save a course
async function saveCourse(id: string, courseData: any): Promise<void> {
  try {
    const courses = await readCourses();
    courses[id] = {
      ...courseData,
      id,
      timestamp: Date.now()
    };
    await fs.promises.writeFile(COURSES_FILE, JSON.stringify(courses, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving course:", err);
  }
}

let aiInstance: GoogleGenAI | null = null;

// Lazy-initialize Gemini API client to prevent crashing if the key is missing on startup
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in your Secrets / Env variables.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Resilient helper to handle transient API errors (e.g. 503 High Demand / Spikes) with retry & model fallback
async function generateContentWithRetryAndFallback(
  client: GoogleGenAI,
  params: {
    contents: any[];
    config: any;
  }
): Promise<GenerateContentResponse> {
  const modelsToTry = [
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.5-flash"
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    // If a model is overloaded (503/429), retry at most twice (attempt 1 and 2) before falling back.
    let attempts = 2; 
    let delay = 500;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`[Readability AI] Querying model: ${model} (Attempt ${attempt}/${attempts})`);
        const response = await client.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (error: any) {
        lastError = error;
        const errorMessage = error.message || "";
        
        const isQuotaExceeded =
          errorMessage.includes("ResourceExhausted") ||
          errorMessage.includes("429") ||
          errorMessage.toLowerCase().includes("quota") ||
          (error.status && error.status === "RESOURCE_EXHAUSTED") ||
          (error.code && error.code === 429) ||
          (error.status && error.status === 429);

        const isTransient =
          isQuotaExceeded ||
          errorMessage.includes("503") ||
          errorMessage.includes("UNAVAILABLE") ||
          errorMessage.includes("demand") ||
          errorMessage.includes("temporary") ||
          (error.status && error.status === 503) ||
          (error.code && error.code === 503);

        const isAuthError =
          errorMessage.includes("API_KEY_INVALID") ||
          errorMessage.includes("403") ||
          errorMessage.toLowerCase().includes("invalid api key") ||
          errorMessage.toLowerCase().includes("key not valid") ||
          (error.status && error.status === 403) ||
          (error.code && error.code === 403);

        console.log(`[Readability AI] Transient notice: Model ${model} on (attempt ${attempt}/${attempts}) is busy or exhausted.`, errorMessage);

        if (isAuthError) {
          // If it's an API Key / authentication issue, fail immediately since other models will also fail
          throw error;
        }

        if (isQuotaExceeded) {
          console.log(`[Readability AI] Quota exceeded (429/RESOURCE_EXHAUSTED) for model ${model}. Falling back immediately.`);
          break; // Break the attempt loop to try the next model
        }

        if (!isTransient) {
          // For other non-transient errors (like model not found or invalid config for this model), 
          // skip retrying this model and fall back to the next model immediately.
          console.log(`[Readability AI] Non-transient condition for model ${model}. Falling back to next model.`);
          break;
        }

        if (attempt < attempts) {
          // Wait before retrying with exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
        }
      }
    }
    console.log(`[Readability AI] Model ${model} skipped or exhausted. Trying next model if available...`);
  }

  throw lastError || new Error("Failed to generate content after trying multiple models and retries.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "15mb" })); // Extra headroom for image uploads

  // API: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API: Check if API key is configured
  app.get("/api/config-status", (req, res) => {
    res.json({ hasApiKey: !!process.env.GEMINI_API_KEY });
  });

  // API: High-Quality Gemini Text-to-Speech Engine
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, voiceName = "Zephyr" } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required for TTS." });
      }

      // Deep text cleaning to eliminate markdown characters, tables, links and bullet noise
      const cleanText = text
        .replace(/[#*`~_\-]/g, " ") // Clean markdown syntax with visual pauses
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Simplify markdown links to display-only text
        .replace(/✔|✅/g, " Yes. ")
        .replace(/⚠️|❌/g, " Warning. ")
        .replace(/💡/g, " Key Tip. ")
        .replace(/\|/g, " ") // Clean up tables
        .replace(/\s+/g, " ") // Normalize multiple spaces
        .trim();

      // Gemini TTS has an ideal length. 1500 chars is plenty for active study paragraphs.
      const textToSpeak = cleanText.slice(0, 1500);

      const client = getGeminiClient();

      console.log(`[Gemini TTS] Generating speech using voice: ${voiceName}`);
      const response = await client.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: textToSpeak }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error("No audio content returned from the premium TTS engine.");
      }

      res.json({ audio: base64Audio });
    } catch (error: any) {
      console.error("[Gemini TTS Error]:", error);
      res.status(500).json({ 
        error: error.message || "Failed to generate premium AI voice narrative." 
      });
    }
  });

  // API: Main simplification endpoint
  app.post("/api/simplify", async (req, res) => {
    try {
      const { text, image, mode, topic, language, isPrivate } = req.body;

      if (!text && !image && !topic) {
        return res.status(400).json({ error: "Input text, image, or search topic is required." });
      }

      const client = getGeminiClient();

      let languageRule = "";
      if (language === "hi") {
        languageRule = `
LANGUAGE RULE (CRITICAL):
You MUST output the entire response in clean, grammatically correct Hindi (using Devanagari script).
Ensure you translate complex technical, legal, or academic terms into standard, simple Hindi words, but you may keep the core English term in parentheses next to it for context (e.g., "कंप्यूटर (Computer)", "सॉफ्टवेयर (Software)", "आर्टिफिशियल इंटेलिजेंस (Artificial Intelligence)").
The structural headers must be translated to elegant Hindi:
- SECTION 1: "The Core Concept" -> "मुख्य विचार / मूल अवधारणा"
- SECTION 2: "The Breakdown" -> "विस्तृत विश्लेषण"
- "**Mr. Kilvish's Verdict:**" -> "**श्री किल्विष का फैसला:**"
Keep your persona as Mr. Kilvish but fully speak in simplified Hindi. Use warm, respectful, and authoritative Hindi.
`;
      } else if (language === "hinglish") {
        languageRule = `
LANGUAGE RULE (CRITICAL):
You MUST output the entire response in friendly, conversational Hinglish (Hindi written in the Latin/English alphabet). This is the natural blend of Hindi and English that people use in chat messaging, WhatsApp, or how voice assistants like Google Assistant and Alexa talk to Indian users.
Example structures:
- Instead of "This is a very complex topic", say "Yeh ek kaafi complex topic hai".
- Instead of "You must understand the fundamentals", say "Aapko iske fundamentals samajhna bohot zaroori hai".
Ensure you use common English terminology (like "computer", "idea", "technology", "logic", "career", "salary") but structure the sentences with Hindi grammar in English script.
The structural headers must be translated to clean Hinglish:
- SECTION 1: "The Core Concept" -> "Main Concept Kya Hai?"
- SECTION 2: "The Breakdown" -> "Aasan Bhasha Mein Breakdown"
- "**Mr. Kilvish's Verdict:**" -> "**Mr. Kilvish Ka Faisla:**"
Keep your persona as Mr. Kilvish but fully speak in highly friendly, engaging Hinglish!
`;
      } else {
        languageRule = `
LANGUAGE RULE:
You MUST output the entire response in clear, simplified English.
`;
      }

      const systemInstruction = `You are MR. KILVISH, the innovative, practical, and highly efficient intelligence engine for "Readability", and the elite dean of "Mr. Kilvish AI Academy". Your sole sacred mission is to banish the darkness of obscure technical jargon, legal terms, academic fluff, and messy notes, bringing ultimate, crystal-clear light (readability) to everyone.

Your catchphrase is: "Clarity shall prevail!" or "Clarity is power!"
Adopt a persona that is highly professional, encouraging, practical, and crystal clear. You hate unnecessary words and complex sentences.

${languageRule}

CRITICAL OPERATING RULES:
1. NO JARGON: Replace complex terminology with common, everyday language. If you must use a technical term, define it briefly in parentheses.
2. STRUCTURE: Use Markdown for readability.
    - Use H2 and H3 headers to break up long blocks of content.
    - Use bullet points for lists, sequences, and processes.
    - Use bold text (**like this**) for key takeaways.
3. TONE: Professional, encouraging, and crystal clear.
4. FORMATTING: You must strictly format the response in exactly two sections (EXCEPT for [Mr. Kilvish Academy Mode], [News & Journalism Mode], and [Master Blueprint Studio Mode]):
    - SECTION 1: "The Core Concept" (or equivalent language translation) (An elegant 2-3 sentence summary of the main concept/point).
    - SECTION 2: "The Breakdown" (or equivalent language translation) (Detailed, structured, and easy-to-read content that breaks down all details, processes, or key elements).
    - At the very end of SECTION 2, append a brief, sharp, and practical bold block called "**Mr. Kilvish's Verdict:**" (or equivalent language translation) highlighting the absolute bottom-line action or efficiency takeaway (max 2 sentences).
5. LIMITS: If the input text or document is extremely long or complex, automatically organize and summarize it into highly digestible, actionable chunks.

MODE-SPECIFIC RULES:
If the user specifies a particular mode, modify your style accordingly:
- [Master Blueprint Studio Mode] (Investor & Engineering-Ready 35-Section Master Blueprint):
  Act as a world-class Product Architect, Hardware Engineer, AI Systems Architect, Startup Strategist, Manufacturing Consultant, Financial Analyst, Industrial Designer, Legal Compliance Expert, Investor, and Technical Writer.
  Your sacred task is to generate an exhaustive, world-class 35-Section Master Blueprint for the project.
  
  CRITICAL 35-SECTION BLUEPRINT MANDATE:
  You MUST include ALL 35 of the following numbered sections in order:
  1. Executive Summary
  2. Vision & Mission
  3. Problem Statement
  4. Market Research (TAM, SAM, SOM)
  5. Customer Personas
  6. Competitor Analysis
  7. Unique Value Proposition
  8. Product Strategy
  9. Hardware Architecture
  10. Software Architecture
  11. AI Architecture
  12. System Diagrams
  13. UI/UX Guidelines
  14. Technical Specifications
  15. Manufacturing Process (EVT, DVT, PVT)
  16. BOM Estimation
  17. Supply Chain
  18. Quality Assurance
  19. Certifications & Regulatory Compliance
  20. Cybersecurity & Privacy
  21. Financial Model (5 Years)
  22. Revenue Streams
  23. Pricing Strategy
  24. Marketing & Go-to-Market
  25. Sales Strategy
  26. Customer Support
  27. Risk Register
  28. SWOT Analysis
  29. Product Roadmap (10 Years)
  30. Team Structure
  31. Hiring Plan
  32. Funding Strategy
  33. Investor Pitch Notes
  34. Appendices
  35. Future Expansion

  FOR EVERY SINGLE SECTION (1 to 35), YOU MUST INCLUDE THESE 8 MANDATORY SUB-BLOCKS:
  - 📌 **Why Needed**: Strategic rationale for this section.
  - 📋 **Assumptions**: Explicit assumptions made for this project phase.
  - ⚠️ **Identified Risks**: Critical engineering, operational, or market risks.
  - 🔄 **Suggested Alternatives**: Architectural fallback options or secondary strategies.
  - 🚀 **Implementation Steps**: Concrete, actionable step-by-step execution roadmap.
  - 📊 **Measurable KPIs**: Specific metrics, targets, and benchmarks.
  - 🏆 **Industry Best Practices**: Standard compliance/engineering protocols (ISO, SOC2, FCC, CE, IEEE, etc.).
  - ❓ **Missing Information & Founder Research Questions**: Critical open questions to research or confirm with stakeholders instead of making unverified assumptions.

  At the end of Section 35, append:
  "**Mr. Kilvish's Master Blueprint Verdict:**" giving a decisive, high-impact founder summary and immediate Next Step 0-30 day action items.

- [ELI5 Mode] (Explain Like I'm 5): Use highly relatable, everyday analogies, very simple and warm language, and a friendly tone. No complex terms at all. Make it feel like a story or basic explanation a child can grasp instantly. Do NOT keep it brief; expand with rich narratives, interactive-feeling question-answers, and thorough, detailed explanations of each mechanism.
- [Pro Mode] (Concise & Professional): Make it extremely streamlined, high-density, action-oriented, and focused on business value or execution. Use sharp bullet points and clean structure. Provide a highly detailed, comprehensive business analysis, including strategic implementation plans, risks, and ROI frameworks.
- [Student Mode] (Educational & Concept-focused): Highlight key concepts and definitions systematically. Explain how things work step-by-step with deep, complete scientific, mathematical, or structural detail. Focus heavily on core educational vocabulary, defining terms clearly, providing conceptual formulas, historic context, and creating a robust, deep structured learning framework.
- [News & Journalism Mode] (Real News Finder & Investigative Fact-Check):
  Conduct a high-integrity, ground-truth investigation on the topic, headline, or claim. Analyze the claim objectively using real-time search results. Format your output in the following distinct visual structure:
  
  ## 🔍 THE VERDICT
  Provide a highly visible, definitive statement of the claim's status (e.g., **TRUE**, **FALSE**, **MISLEADING**, **MIXED**, or **UNVERIFIED**) along with a brief, high-impact summary sentence of why. Use eye-catching callouts.
  
  ## 📰 THE INVESTIGATIVE DISPATCH
  Provide a captivating, elite-level news narrative or report detailing the exact factual background, recent events, and verified context discovered via our live search database. Focus on high readability, explaining any complex political or economic factors in everyday language.
  
  ## 🛡️ THE TRUTH & BIAS AUDIT
  A highly analytical audit explaining why the standard rumors/sensational headlines are misleading, identifying cognitive biases or viral trap elements, and highlighting the verified figures, numbers, and live timelines of the event.
  
  At the very end of your dispatch, append a bold block: "**Mr. Kilvish's Editorial Verdict:**" highlighting the bottom-line takeaway or lesson about media literacy for this story (max 2 sentences).
- [Mr. Kilvish Academy Mode] (Premium Syllabus / E-Book Course):
  Transform the topic into an ultra-comprehensive, deep premium course module. Do not keep it short; go deep and explain everything in extreme detail (translated to the target language as requested). Each section should feel like an exhaustive, top-quality chapter in a premium textbook.
  
  CRITICAL COMPLETENESS REQUIREMENT:
  - NEVER output short, brief, or incomplete summaries. Each of the 30 chapters MUST be a fully fleshed-out, highly detailed chapter containing 3-4 comprehensive paragraphs of rich academic text (minimum 150-200 words of real learning material per chapter).
  - If the topic is a general, scientific, or non-career subject (e.g. "Photosynthesis", "Blockchain", "Quantum Computing", "Inflation"), you MUST adapt the career-focused headings with absolute creative genius to match the topic perfectly and go into extreme scientific/technical depth. Do NOT write simple, lazy placeholder sentences.
  
  Here is how you MUST adapt career-focused headings for scientific, general, or non-career topics:
  * 4. Eligibility Criteria -> Environmental/Structural Requirements (e.g. essential cells, pigments, atmospheric/soil prerequisites).
  * 8. Required Documents -> References, Historical Discoveries & Chemical/Mathematical Formulas (e.g. the balanced chemical equation, key researchers like Jan Ingenhousz).
  * 9. Physical Standards -> Optimal Physical/Environmental Conditions (e.g. light spectrum absorption peaks, light intensity thresholds, ambient temperature limits).
  * 10. Medical Standards -> Biological Health & Structural Integrity Checklist (e.g. chlorophyll density, stomatal health, water turgor pressure, cellular health).
  * 11. Written Exam Strategy -> Key Scientific Inquiries, Cognitive Challenges & Analytical Secrets.
  * 12. Subject-wise Preparation -> Core Sub-System breakdowns (e.g. Light-dependent reactions [PS I & PS II], Light-independent reactions [Calvin Cycle]).
  * 13. Physical Preparation Plan -> Lab Experiments, Hands-on Drills, & Empirical Testing Guides (e.g. starch test, leaf chromatography, measuring photosynthetic rates).
  * 14. Daily Routine -> Daily Biological Cycles & Diurnal Rhythms (e.g. stomatal opening schedules, daytime light harvesting vs. night-time cellular respiration).
  * 15. Diet Plan -> Nutrient, Mineral, and Gaseous Input Plan (e.g. Nitrogen, Phosphorus, Potassium uptake ratios, optimal H2O and CO2 saturation profiles).
  * 16. Training After Selection -> Advanced Evolutionary Adaptation Milestones (e.g. how plants train or adapt to harsh dry climates using C4 and CAM pathways).
  * 17. Salary -> Energy Yield, Glucose Production & Metabolic Earning Potential (e.g. ATP/NADPH yield efficiencies, carbohydrate accumulation rates).
  * 18. Benefits -> Ecological Perks, Biosphere Contributions & Global Health Benefits (e.g. global oxygen replenishment, carbon sequestration metrics).
  * 19. Career Growth & Industry Outlook -> Evolutionary Milestones & Modern Ecological Applications (e.g. artificial photosynthesis, bio-fuel production, modern agriculture).
  * 20. Promotions -> Advanced Species Classifications & Specialist Adaptations (e.g. transition from C3 to CAM, high-efficiency specialist cultivars).
  * 27. 30-Day Preparation Plan -> 30-Day Growth Monitoring & Empirical Observation Calendar.
  * 28. 90-Day Preparation Plan -> 90-Day Long-term Cultivation, Yield, and Stress-Testing Strategy.
  
  MANDATORY STRUCTURE:
  1. Welcome Message & Course Overview
  2. Introduction to the Topic
  3. Why This Topic/Career Matters
  4. Eligibility Criteria (or Environmental/Structural Requirements)
  5. Complete Step-by-Step Learning Process / Roadmap
  6. Every Stage Explained in Detail
  7. Important Rules & Key Concepts
  8. Required Documents (or Historical Discoveries & Chemical/Mathematical Formulas)
  9. Physical Standards (or Optimal Physical/Environmental Conditions)
  10. Medical Standards (or Biological Health & Structural Integrity Checklist)
  11. Written Exam Strategy (or Key Scientific Inquiries & Analytical Secrets)
  12. Subject-wise Preparation (or Core Sub-System breakdowns)
  13. Physical Preparation Plan (or Lab Experiments, Hands-on Drills, & Empirical Testing Guides)
  14. Daily Routine (or Daily Biological Cycles & Diurnal Rhythms)
  15. Diet Plan (or Nutrient, Mineral, and Gaseous Input Plan)
  16. Training After Selection (or Advanced Evolutionary Adaptation Milestones)
  17. Salary (or Energy Yield & Metabolic Earning Potential)
  18. Benefits (or Ecological Perks & Biosphere Contributions)
  19. Career Growth & Industry Outlook (or Modern Ecological/Industrial Applications)
  20. Promotions (or Advanced Species Classifications & Specialist Adaptations)
  21. Common Mistakes made by beginners
  22. Do's & Don'ts
  23. Frequently Asked Questions (Minimum 10-15 highly detailed, exhaustive FAQs)
  24. Myth vs Reality
  25. Latest Updates
  26. Success Tips
  27. 30-Day Preparation Plan (or 30-Day Growth Monitoring & Empirical Observation Calendar)
  28. 90-Day Preparation Plan (or 90-Day Long-term Cultivation & Stress-Testing Strategy)
  29. Weekly Checklist
  30. Final Verdict by Mr. Kilvish
  
  YOU MUST ALSO SCATTER THESE FEATURES THROUGHOUT THE TEXT (translated appropriately):
  ✔ Expert Tips (using markdown callouts or blockquotes)
  ✔ Warning Boxes (alerts for dangerous mistakes or traps)
  ✔ Motivational Quotes (inspiring words matching the theme)
  ✔ Comparison Charts & Markdown Tables (highly detailed, minimum 2-3 tables with rich comparative data)
  ✔ Timeline Diagrams (using clean ascii/text formats)
  ✔ Practice Questions, MCQs, and a short Quiz set with Answers
  ✔ Summaries at the end of every major section

Ensure your entire output is formatted cleanly in Markdown. Do not include meta-text about these instructions.

CRITICAL PUBLISHING QUALITY STANDARDS (10/10):
- NO BROKEN HINDI WORDS: Never split Devanagari words with artificial spaces between letters (e.g., write "परिवर्तन", never "प रि व र्त न"). Keep words unified and grammatically correct.
- NO OCR ERRORS: Always heal and clean up any OCR text artifacts or visual translation noise.
- MARKDOWN TABLES: Use clean standard Markdown tables for any comparison charts or structured metrics. These are rendered as beautiful responsive HTML tables.
- PROFESSIONAL CALLOUTS: Use standard blockquotes starting with appropriate symbols (⚠️ for warnings, 💡 for expert tips, or Mr. Kilvish/Verdict) to render magnificent colored infographics and info cards.`;

      const parts: any[] = [];

      // Add image if present
      if (image && image.data && image.mimeType) {
        parts.push({
          inlineData: {
            data: image.data,
            mimeType: image.mimeType
          }
        });
      }

      // Build the prompt depending on input, topic, and mode
      let promptText = "";
      const displayModeName = 
        mode === "blueprint" ? "Master Blueprint Studio Mode" :
        mode === "academy" ? "Mr. Kilvish Academy Mode" : 
        (mode || "Default");
      
      if (mode === "blueprint") {
        promptText += `MASTER BLUEPRINT STUDIO GENERATION REQUEST:\n`;
        promptText += `Project / Hardware / Software Product Name: "${topic || text || 'Kilvish AI Phone'}"\n\n`;
        if (text && topic) {
          promptText += `User Provided Specifications & Project Context:\n"""\n${text}\n"""\n\n`;
        }
        promptText += `CRITICAL INSTRUCTION FOR MASTER BLUEPRINT GENERATION:\n`;
        promptText += `You are acting as an experienced Board of Directors consisting of:\n`;
        promptText += `- CEO (Vision, Go-To-Market & Corporate Strategy)\n`;
        promptText += `- CTO (System Architecture, Kernel, Latency, NPU & Memory Stack)\n`;
        promptText += `- CFO (Unit Economics, Capital Allocation, Financial P&L)\n`;
        promptText += `- COO (Operations, Assembly Line Yields, Manufacturing Flow)\n`;
        promptText += `- CMO (Brand Strategy, Growth Loops, Market Positioning)\n`;
        promptText += `- Chief Legal Officer (Regulatory Compliance, Contracts, FCC/BIS/CE)\n`;
        promptText += `- Chief Manufacturing Officer (Tier-1 EMS Partnering, Tooling, DVT/PVT Gates)\n`;
        promptText += `- Chief AI Officer (Model Quantization, AWQ 4-bit, Vector Memory, NPU Pipeline)\n`;
        promptText += `- Product Architect (UI/UX, Industrial Design, Ergo/Thermal Form Factor)\n`;
        promptText += `- Venture Capitalist (Valuation, Cap Table, Runway, Exit Strategy)\n`;
        promptText += `- Patent Attorney (IP Protection, Claims, Prior Art Defense)\n`;
        promptText += `- Supply Chain Director (BOM Sourcing, Dual Vendor Strategy, Net-60 Credit)\n`;
        promptText += `- Government Compliance Advisor (PLI, CHIPS Act, Import Duties, E-Waste)\n\n`;
        promptText += `EXECUTION & PROTOCOL RULES:\n`;
        promptText += `1. FIRST THINK & VERIFY: Evaluate market dynamics, technical feasibility, and legal constraints before outputting conclusions.\n`;
        promptText += `2. IDENTIFY MISSING INFORMATION: Clearly flag missing research or unconfirmed technical parameters.\n`;
        promptText += `3. ANALYZE RISKS & COMPARE ALTERNATIVES: Explicitly weigh trade-offs (e.g., Foxconn vs Dixon, Qualcomm vs MediaTek, AWQ 4-bit vs FP16).\n`;
        promptText += `4. CHOOSE OPTIMAL SOLUTIONS: Provide decisive, reality-checked recommendations.\n`;
        promptText += `5. CREATE EXECUTION-READY BLUEPRINT: Generate an investor-grade, engineering-ready, manufacturing-ready, and legally compliant blueprint.\n\n`;
        promptText += `ALWAYS START WITH:\n`;
        promptText += `1. 🏛️ **BOARD OF DIRECTORS EXECUTIVE EVALUATION & GOVERNANCE AUDIT** (Consolidated recommendations from CEO, CTO, CFO, COO, CMO, CLO, CManO, CAIO, Product Architect, VC, Patent Counsel, Supply Chain Director, and Regulatory Advisor).\n`;
        promptText += `2. 🌐 **GLOBAL PROJECT CONFIGURATION MATRIX** (Project Name, Product Name, Company Name, Founder Country, Target/Launch Countries, Currency & MSRP, BOM Target, Industry, Manufacturing Model, OEM/ODM Partners like Foxconn, Pegatron, Wingtech, Longcheer, Dixon, Lava, Optiemus, Bharat FIH, Funding Goal, Revenue Model).\n`;
        promptText += `3. 🇮🇳 / 🇺🇸 / 🇪🇺 **COUNTRY INTELLIGENCE & COMPLIANCE MATRIX** (BIS, FCC, CE, RED, Import duties/tariffs, PLI / CHIPS incentives, local labor costs, local competitors).\n`;
        promptText += `4. 🔬 **RESEARCH & DATA INTEGRITY CLASSIFICATION** (Distinguish Verified Data, Estimated Data, Assumptions, Founder Decisions Required, Missing Research).\n`;
        promptText += `5. ⚡ **REALITY CHECK & RISK AUDIT** (Technical Difficulty, Financial Realism, Supply Chain Risk, Regulatory & Patent Risk).\n\n`;
        promptText += `GENERATE AN EXHAUSTIVE 35-SECTION MASTER BLUEPRINT for "${topic || text || 'Kilvish AI Phone'}".\n\n`;
        promptText += `For EVERY SINGLE CHAPTER (1 to 35), include ALL of the following sub-blocks:\n`;
        promptText += `- 📌 **Why Needed**\n`;
        promptText += `- 📍 **Current Situation**\n`;
        promptText += `- 💥 **Problem Statement**\n`;
        promptText += `- 💡 **Opportunity**\n`;
        promptText += `- 📋 **Assumptions**\n`;
        promptText += `- ⚠️ **Identified Risks**\n`;
        promptText += `- 🔄 **Suggested Alternatives**\n`;
        promptText += `- 🚀 **Implementation Steps**\n`;
        promptText += `- ⏱️ **Timeline & Milestones**\n`;
        promptText += `- 💰 **Budget & Cost Allocation**\n`;
        promptText += `- 📊 **Measurable KPIs**\n`;
        promptText += `- 🔗 **Dependencies**\n`;
        promptText += `- 🏆 **Industry Best Practices**\n`;
        promptText += `- 🔮 **Future Improvements**\n`;
        promptText += `- 🎯 **Founder Decisions Required**\n`;
        promptText += `- ❓ **Questions Still Unanswered**\n\n`;
        promptText += `Make sure all 35 sections (1. Executive Summary through 35. Future Category Expansion) are present, numbered, and thoroughly detailed with Markdown formatting, headers, lists, and tables. End with "**Mr. Kilvish's Master Blueprint Verdict:**" giving a decisive founder execution strategy.\n`;
      } else if (topic) {
        promptText += `The user has requested an "Infinity Search" explanation for the following topic: "${topic}".\n\n`;
        promptText += `Please conduct a deep conceptual explanation on the topic: "${topic}" in [${displayModeName}].\n`;
        promptText += `Provide a comprehensive, authoritative, but completely jargon-free overview of the topic. Ensure you cover what it is, why it matters, how it works, and provide real-world analogies or applications.\n\n`;
        if (text) {
          promptText += `The user also provided this additional context or sub-questions about this topic:\n"""\n${text}\n"""\n\n`;
        }
      } else {
        if (image) {
          promptText += "Please extract and simplify the text content present in this image or document. ";
        }
        promptText += `Please process the following input content in [${displayModeName}].\n\n`;
        if (text) {
          promptText += `Input Content:\n"""\n${text}\n"""`;
        }
      }

      parts.push({ text: promptText });

      // Configure Gemini Request Options
      const config: any = {
        systemInstruction,
        temperature: mode === "blueprint" ? 0.2 : 0.3,
        maxOutputTokens: 8192,
      };

      // Enable Google Search Grounding for News & Journalism mode (Real News Finder!)
      if (mode === "news") {
        config.tools = [{ googleSearch: {} }];
      }

      // Call Gemini using resilient helper (handles 503/UNAVAILABLE transient errors with backoff and fallback)
      const response: GenerateContentResponse = await generateContentWithRetryAndFallback(client, {
        contents: parts,
        config
      });

      let resultText = response.text || "Clarity could not be found. Please try a different input.";

      // For Master Blueprint mode, ensure complete 35-section depth and all 8 mandatory sub-blocks
      if (mode === "blueprint") {
        const sectionMatchCount = (resultText.match(/##\s*\d+\./g) || []).length;
        if (sectionMatchCount < 25 || resultText.length < 4000) {
          resultText = generateFullMasterBlueprint(topic || text || "Kilvish AI Phone", text);
        }
      }

      // Extract Grounding Chunks (verified reference links) for News & Journalism Real News Finder
      let webSources: any[] = [];
      if (mode === "news" && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const chunks = response.candidates[0].groundingMetadata.groundingChunks;
        webSources = chunks
          .map((chunk: any) => {
            if (chunk.web) {
              return {
                uri: chunk.web.uri || "",
                title: chunk.web.title || "",
              };
            }
            return null;
          })
          .filter((src: any) => src && src.uri && src.title);
      }
      
      const courseId = "c-" + Math.random().toString(36).substring(2, 11);
      const docTitle = topic 
        ? topic 
        : (text ? (text.split("\n")[0].slice(0, 50) || "Untitled Document") : "Untitled Document");

      await saveCourse(courseId, {
        title: docTitle,
        text: resultText,
        mode: mode || "default",
        language: language || "en",
        topic: topic || "",
        originalText: text || "",
        isPrivate: isPrivate === true,
        sources: webSources, // Persist sources!
      });

      res.json({ result: resultText, courseId, sources: webSources });

    } catch (error: any) {
      console.error("Gemini Simplify Error:", error);
      const errMsg = error.message || "";
      const isQuota = errMsg.includes("ResourceExhausted") || 
                      errMsg.includes("429") || 
                      errMsg.toLowerCase().includes("quota") || 
                      errMsg.toLowerCase().includes("exhausted") ||
                      (error.status && error.status === 429) ||
                      (error.code && error.code === 429);

      if (isQuota) {
        return res.status(429).json({
          error: "API Key Quota Exhausted or Overloaded: You have reached the free-tier quota limits (such as the 20 requests/day limit on gemini-3.5-flash) on your API Key. Please configure your own Gemini API Key in the Settings menu of AI Studio to continue with unlimited requests, or try again later."
        });
      }

      res.status(500).json({ 
        error: error.message || "An unexpected error occurred while communicating with the intelligence engine." 
      });
    }
  });

  // API: Get saved course by ID
  app.get("/api/course/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const courses = await readCourses();
      const course = courses[id];
      if (!course) {
        return res.status(404).json({ error: "Sovereign Courseware document not found." });
      }
      res.json(course);
    } catch (error: any) {
      console.error("Error retrieving course:", error);
      res.status(500).json({ error: "Failed to retrieve the requested Courseware." });
    }
  });

  // API: Get all saved courses (for Academy Library)
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await readCourses();
      // Return as an array sorted by timestamp descending, filtering out private ones
      const list = Object.values(courses)
        .filter((c: any) => !c.isPrivate)
        .sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0));
      res.json(list);
    } catch (error: any) {
      console.error("Error retrieving courses:", error);
      res.status(500).json({ error: "Failed to retrieve Courseware Library." });
    }
  });

  // API: Get community data for a course
  app.get("/api/community/:courseId", async (req, res) => {
    try {
      const { courseId } = req.params;
      const communityData = await readCommunity();
      
      // If no community data exists yet for this course, initialize a default structure
      if (!communityData[courseId]) {
        communityData[courseId] = {
          ratings: [5, 5, 4], // Initial ratings seed
          questions: [],
          explanations: [],
          notes: [],
          examples: [],
          related: []
        };
        await saveCommunity(communityData);
      }
      
      res.json(communityData[courseId]);
    } catch (error: any) {
      console.error("Error retrieving community data:", error);
      res.status(500).json({ error: "Failed to retrieve community hub." });
    }
  });

  // API: Post new community item
  app.post("/api/community/:courseId", async (req, res) => {
    try {
      const { courseId } = req.params;
      const { type, payload } = req.body;
      
      const communityData = await readCommunity();
      if (!communityData[courseId]) {
        communityData[courseId] = {
          ratings: [5, 5, 4],
          questions: [],
          explanations: [],
          notes: [],
          examples: [],
          related: []
        };
      }
      
      const target = communityData[courseId];
      const item = {
        id: "item-" + Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        ...payload
      };

      if (type === "rating") {
        const ratingVal = parseInt(payload.rating);
        if (ratingVal >= 1 && ratingVal <= 5) {
          target.ratings.push(ratingVal);
        }
      } else if (type === "question") {
        target.questions.push(item);
      } else if (type === "note") {
        target.notes.push(item);
      } else if (type === "example") {
        target.examples.push(item);
      } else if (type === "explanation") {
        target.explanations.push(item);
      } else if (type === "related") {
        if (!target.related.includes(payload.topic)) {
          target.related.push(payload.topic);
        }
      }
      
      communityData[courseId] = target;
      await saveCommunity(communityData);
      res.json(communityData[courseId]);
    } catch (error: any) {
      console.error("Error saving community item:", error);
      res.status(500).json({ error: "Failed to post to community hub." });
    }
  });

  // API: AI-generate answers/explanations/examples on demand for Community
  app.post("/api/community/:courseId/ai-generate", async (req, res) => {
    try {
      const { courseId } = req.params;
      const { type, questionText, topicTitle, courseText } = req.body;
      
      const client = getGeminiClient();
      let promptText = "";
      
      if (type === "answer_question") {
        promptText = `You are Mr. Kilvish, the dean of Readability AI. Answer the following student question regarding "${topicTitle}":
Question: "${questionText}"
Reference course text:
"""
${courseText}
"""
Provide an elegant, extremely simple, conversational, and direct answer. Skip any preamble. Output directly in clean markdown.`;
      } else if (type === "better_explanation") {
        promptText = `You are Mr. Kilvish. Provide an alternative, EVEN SIMPLER, ultra-simplified explanation/analogy of "${topicTitle}".
Reference course text:
"""
${courseText}
"""
Focus on an incredible, high-impact everyday analogy (like using a mailbox to explain IP addresses, or baking bread to explain CPU cycles). Skip any introduction. Output directly in clean markdown.`;
      } else if (type === "new_example") {
        promptText = `You are Mr. Kilvish. Generate a concrete, real-world community example of how "${topicTitle}" is used in action.
Reference course text:
"""
${courseText}
"""
Keep it extremely practical, fun, and memorable. Skip any introduction. Output directly in clean markdown.`;
      } else if (type === "related_topics") {
        promptText = `You are Mr. Kilvish. List exactly 4 highly related topics or follow-up areas of study for someone who just finished learning "${topicTitle}".
Return only a JSON array of strings, like this: ["Topic A", "Topic B", "Topic C", "Topic D"]. Do not return any other text.`;
      }

      const response = await generateContentWithRetryAndFallback(client, {
        contents: [{ text: promptText }],
        config: {
          temperature: 0.5,
        }
      });

      const reply = response.text || "";
      res.json({ result: reply });
    } catch (error: any) {
      console.error("Community AI generation error:", error);
      res.status(500).json({ error: "Failed to trigger AI helper." });
    }
  });

  // API: AI Tutor chatbot endpoint
  app.post("/api/tutor", async (req, res) => {
    try {
      const { courseId, courseTitle, courseText, message, chatHistory } = req.body;

      if (!message || !courseText) {
        return res.status(400).json({ error: "Course content and student message are required." });
      }

      const client = getGeminiClient();

      const systemInstruction = `You are Mr. Kilvish AI Tutor, the official personal academic assistant of "Mr. Kilvish Academy".
Your student is studying a textbook courseware block on the topic: "${courseTitle || "Sovereign Studies"}".

Here is the exact textbook content they are reading:
"""
${courseText}
"""

Your mission:
1. Answer the student's questions about this textbook content in a clear, extremely friendly, practical, and engaging manner.
2. If the student asks questions outside of this topic, gently steer them back to the course topic but still provide a short helpful answer if related to their studies.
3. Keep your answers concise, structured, and easy to understand. Banish heavy academic jargon or define it instantly.
4. Maintain the signature Mr. Kilvish persona: authoritative, encouraging, and clear ("Clarity is power!").
5. Respond in the same language the student asks their question in (e.g., if they ask in Hindi, reply in Hindi; if in Hinglish, reply in Hinglish; if in English, reply in English).`;

      // Build chat history part structures
      const formattedContents: any[] = [];
      if (chatHistory && Array.isArray(chatHistory)) {
        chatHistory.forEach((msg: any) => {
          formattedContents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
          });
        });
      }
      
      // Add the latest user message
      formattedContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await generateContentWithRetryAndFallback(client, {
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.5,
        }
      });

      const tutorResponseText = response.text || "I was unable to formulate a response. Let us try that again.";
      res.json({ reply: tutorResponseText });

    } catch (error: any) {
      console.error("AI Tutor Error:", error);
      res.status(500).json({ error: error.message || "An unexpected error occurred in the tutor module." });
    }
  });

  // Vite integration for development vs. production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Readability AI] Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });
}

startServer();
