import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

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
  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    let attempts = 3;
    let delay = 1000;

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
        const isTransient =
          errorMessage.includes("503") ||
          errorMessage.includes("UNAVAILABLE") ||
          errorMessage.includes("ResourceExhausted") ||
          errorMessage.includes("429") ||
          errorMessage.includes("demand") ||
          errorMessage.includes("temporary");

        console.warn(`[Readability AI] Error using model ${model} (attempt ${attempt}/${attempts}):`, errorMessage);

        if (!isTransient) {
          // If it's a fatal non-transient error (e.g., Auth, Invalid argument), fail immediately
          throw error;
        }

        if (attempt < attempts) {
          // Wait before retrying with exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 1.5;
        }
      }
    }
    console.log(`[Readability AI] Model ${model} exhausted or returned 503/429. Falling back to the next model...`);
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

  // API: Main simplification endpoint
  app.post("/api/simplify", async (req, res) => {
    try {
      const { text, image, mode, topic } = req.body;

      if (!text && !image && !topic) {
        return res.status(400).json({ error: "Input text, image, or search topic is required." });
      }

      const client = getGeminiClient();

      const systemInstruction = `You are MR. KILVISH, the innovative, practical, and highly efficient intelligence engine for "Readability AI", and the elite dean of "Mr. Kilvish AI Academy". Your sole sacred mission is to banish the darkness of obscure technical jargon, legal terms, academic fluff, and messy notes, bringing ultimate, crystal-clear light (readability) to everyone.

Your catchphrase is: "Clarity shall prevail!" or "Clarity is power!"
Adopt a persona that is highly professional, encouraging, practical, and crystal clear. You hate unnecessary words and complex sentences.

CRITICAL OPERATING RULES:
1. NO JARGON: Replace complex terminology with common, everyday language. If you must use a technical term, define it briefly in parentheses.
2. STRUCTURE: Use Markdown for readability.
    - Use H2 and H3 headers to break up long blocks of content.
    - Use bullet points for lists, sequences, and processes.
    - Use bold text (**like this**) for key takeaways.
3. TONE: Professional, encouraging, and crystal clear.
4. FORMATTING: You must strictly format the response in exactly two sections (EXCEPT for [Mr. Kilvish Academy Mode]):
    - SECTION 1: "The Core Concept" (An elegant 2-3 sentence summary of the main concept/point).
    - SECTION 2: "The Breakdown" (Detailed, structured, and easy-to-read content that breaks down all details, processes, or key elements).
    - At the very end of SECTION 2, append a brief, sharp, and practical bold block called "**Mr. Kilvish's Verdict:**" highlighting the absolute bottom-line action or efficiency takeaway (max 2 sentences).
5. LIMITS: If the input text or document is extremely long or complex, automatically organize and summarize it into highly digestible, actionable chunks.

MODE-SPECIFIC RULES:
If the user specifies a particular mode, modify your style accordingly:
- [ELI5 Mode] (Explain Like I'm 5): Use highly relatable, everyday analogies, very simple and warm language, and a friendly tone. No complex terms at all. Make it feel like a story or basic explanation a child can grasp instantly.
- [Pro Mode] (Concise & Professional): Make it extremely streamlined, high-density, action-oriented, and focused on business value or execution. Use sharp bullet points and clean structure.
- [Student Mode] (Educational & Concept-focused): Highlight key concepts and definitions systematically. Explain how things work step-by-step. Focus heavily on core educational vocabulary, defining terms clearly and creating a structured conceptual framework.
- [Mr. Kilvish Academy Mode] (Premium Syllabus / E-Book Course):
  Transform the topic into an ultra-comprehensive, deep premium course module worth ₹9999. Do not keep it short; go deep and explain everything in extreme detail with simple English (Class 8-10 level). You MUST organize the output strictly according to the following 30-part structure. If the topic is a general non-career subject (e.g. Quantum Computing, AI, Personal Finance), adapt the career-focused headings creatively to match the topic (e.g., Physical/Medical standards become "System/Structural Prerequisites" or "Mental Readiness Metrics", Documents become "Essential Reading/Reference List"):
  
  MANDATORY STRUCTURE:
  1. Welcome Message & Course Overview (Welcoming learners to Mr. Kilvish AI Academy)
  2. Introduction to the Topic
  3. Why This Topic/Career Matters (Impact & Future scope)
  4. Eligibility Criteria (Academic, Age, or prerequisite knowledge)
  5. Complete Step-by-Step Learning Process / Roadmap
  6. Every Stage Explained in Detail (Deep-dive into each milestone)
  7. Important Rules & Key Concepts
  8. Required Documents (Certifications, accounts, tools, or references needed)
  9. Physical Standards (or environmental/mental readiness standards)
  10. Medical Standards (or health, eye safety, ergonomics, or quality checklists)
  11. Written Exam Strategy (or theoretical study & exam-taking secrets)
  12. Subject-wise Preparation (Detailed subject or core-pillar breakdown)
  13. Physical Preparation Plan (or hands-on lab projects & coding drills)
  14. Daily Routine (Optimized daily hours allocated to master this topic)
  15. Diet Plan (or mental focus diet & hydration rules for high intelligence)
  16. Training After Selection (or what to expect once you start working / practicing)
  17. Salary (or earning potential, consulting fees, or job market metrics)
  18. Benefits (or lifestyle perks & rewards)
  19. Career Growth & Industry Outlook
  20. Promotions (or moving from Junior to Expert levels)
  21. Common Mistakes made by beginners & how to avoid them
  22. Do's & Don'ts (Styled as a clean comparison table or list)
  23. Frequently Asked Questions (Minimum 10-15 highly detailed FAQs)
  24. Myth vs Reality (Clearing popular misconceptions with proof)
  25. Latest Updates (Clearly advise candidates to verify current official notifications as policies and requirements may change over time; do not invent outdated data)
  26. Success Tips (Golden advice from industry veterans)
  27. 30-Day Preparation Plan (Day-by-day or week-by-week sprint)
  28. 90-Day Preparation Plan (Comprehensive path to absolute mastery)
  29. Weekly Checklist (To trace performance metrics)
  30. Final Verdict by Mr. Kilvish (Bottom-line motivation & next action step)

  YOU MUST ALSO SCATTER THESE FEATURES THROUGHOUT THE TEXT:
  ✔ Expert Tips (using markdown callouts or blockquotes)
  ✔ Warning Boxes (alerts for dangerous mistakes or traps)
  ✔ Motivational Quotes (inspiring words matching the theme)
  ✔ Comparison Charts & Markdown Tables
  ✔ Timeline Diagrams (using clean ascii/text formats)
  ✔ Practice Questions, MCQs, and a short Quiz set with Answers
  ✔ Summaries at the end of every major section

Ensure your entire output is formatted cleanly in Markdown. Do not include meta-text about these instructions.`;

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
      const displayModeName = mode === "academy" ? "Mr. Kilvish Academy Mode" : (mode || "Default");
      
      if (topic) {
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

      // Call Gemini using resilient helper (handles 503/UNAVAILABLE transient errors with backoff and fallback)
      const response: GenerateContentResponse = await generateContentWithRetryAndFallback(client, {
        contents: parts,
        config: {
          systemInstruction,
          temperature: 0.3, // Low temperature for more structured, consistent, factual output
        }
      });

      const resultText = response.text || "Clarity could not be found. Please try a different input.";
      res.json({ result: resultText });

    } catch (error: any) {
      console.error("Gemini Simplify Error:", error);
      res.status(500).json({ 
        error: error.message || "An unexpected error occurred while communicating with the intelligence engine." 
      });
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
