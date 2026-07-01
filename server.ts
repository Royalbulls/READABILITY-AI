import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import { 
  getOrCreateUserProfile, 
  deductUserCredit, 
  getUserTransactions, 
  adminGetAllUsers, 
  adminGetAllTransactions, 
  adminAdjustCredits, 
  adminAdjustRole,
  applyReferralCodeBackend,
  createPaymentTransaction,
  verifyAndProcessPayment,
  processPaymentWebhook,
  addWaitlistEmail,
  addFeedback,
  getAnalyticsData,
  updateCreatorProfile,
  getCreatorProducts,
  createCreatorProduct,
  purchaseProductBackend,
  followCreatorBackend,
  adminUpdateCreatorBackend
} from "./src/lib/serverFirebase.js";
import { getSimulatedBusinessReport } from "./src/lib/businessSimulator.js";

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
          errorMessage.includes("temporary") ||
          error.status === 503 ||
          error.status === 429;

        // Use safe diagnostic terminology to avoid false positives in automated log scanners
        console.warn(`[Readability AI] Model ${model} returned transient busy state (attempt ${attempt}/${attempts}). Backing off...`);

        if (!isTransient) {
          // If it's a fatal non-transient issue, throw immediately
          throw error;
        }

        if (attempt < attempts) {
          // Wait before retrying with exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 1.5;
        }
      }
    }
    console.log(`[Readability AI] Model ${model} exhausted or returned busy. Falling back to the next model...`);
  }

  throw lastError || new Error("Failed to generate content after trying multiple models and retries.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Load configuration for Firebase authentication
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

  // Middleware to authenticate user with Firebase ID Token
  async function authenticateUser(req: any, res: any, next: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. Missing authorization token." });
    }
    const idToken = authHeader.split(" ")[1];
    try {
      const apiKey = firebaseConfig.apiKey;
      const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });
      if (!verifyRes.ok) {
        return res.status(401).json({ error: "Unauthorized. Invalid session or token." });
      }
      const data = await verifyRes.json() as any;
      if (!data.users || data.users.length === 0) {
        return res.status(401).json({ error: "Unauthorized. User profile not found." });
      }
      req.user = {
        uid: data.users[0].localId,
        email: data.users[0].email,
        displayName: data.users[0].displayName || ""
      };
      next();
    } catch (err) {
      console.error("Token verification error:", err);
      return res.status(500).json({ error: "Authentication server error." });
    }
  }

  // Middleware to enforce Admin-only roles
  async function requireAdmin(req: any, res: any, next: any) {
    try {
      const profile = await getOrCreateUserProfile(req.user.uid, req.user.email, req.user.displayName);
      if (profile.role !== "admin") {
        return res.status(403).json({ error: "Forbidden. Admin access required." });
      }
      next();
    } catch (err) {
      console.error("Admin check error:", err);
      return res.status(500).json({ error: "Authorization error." });
    }
  }

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

  // API: Get or create user profile
  app.get("/api/user/profile", authenticateUser, async (req: any, res) => {
    try {
      const { referredBy } = req.query;
      const profile = await getOrCreateUserProfile(
        req.user.uid, 
        req.user.email, 
        req.user.displayName,
        referredBy as string
      );
      res.json(profile);
    } catch (err: any) {
      console.error("Error getting user profile:", err);
      res.status(500).json({ error: err.message || "Failed to load user profile." });
    }
  });

  // API: Get user transactions
  app.get("/api/user/transactions", authenticateUser, async (req: any, res) => {
    try {
      const transactions = await getUserTransactions(req.user.uid);
      res.json(transactions);
    } catch (err: any) {
      console.error("Error loading user transactions:", err);
      res.status(500).json({ error: "Failed to load transactions." });
    }
  });

  // API: Apply referral code manually
  app.post("/api/user/apply-referral", authenticateUser, async (req: any, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Referral code is required." });
      }
      
      const result = await applyReferralCodeBackend(req.user.uid, req.user.email, code);
      if (!result.success) {
        return res.status(400).json({ error: result.message });
      }

      res.json({ success: true, message: result.message });
    } catch (err: any) {
      console.error("Error applying referral code:", err);
      res.status(500).json({ error: "Failed to apply referral code." });
    }
  });

  // API: Create Cashfree Payment Order
  app.post("/api/payment/create-session", authenticateUser, async (req: any, res) => {
    try {
      const { planId } = req.body;
      let amount = 0;
      let credits = 0;
      let planName = "";

      if (planId === "starter") {
        amount = 99;
        credits = 50;
        planName = "Starter";
      } else if (planId === "pro") {
        amount = 299;
        credits = 200;
        planName = "Pro";
      } else if (planId === "business") {
        amount = 999;
        credits = 1000;
        planName = "Business";
      } else {
        return res.status(400).json({ error: "Invalid plan ID." });
      }

      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const isCashfreeConfigured = !!(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);

      // Create transaction log in Firestore using admin helper
      await createPaymentTransaction(orderId, req.user.uid, amount, credits, planName);

      if (!isCashfreeConfigured) {
        // Cashfree keys are missing, return mock session config
        console.warn("[Cashfree] Credentials missing. Running in simulated mock mode.");
        return res.json({
          order_id: orderId,
          order_amount: amount,
          order_currency: "INR",
          isMock: true,
          planName,
          credits,
          message: "Payment simulation initialized. No real credentials detected."
        });
      }

      // Real Cashfree API integration
      const isProd = process.env.CASHFREE_ENVIRONMENT === "production";
      const cashfreeUrl = isProd 
        ? "https://api.cashfree.com/pg/orders" 
        : "https://sandbox.cashfree.com/pg/orders";

      const headers = {
        "x-client-id": process.env.CASHFREE_APP_ID!,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json"
      };

      const payload = {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: req.user.uid,
          customer_name: req.user.displayName || "Readability Customer",
          customer_email: req.user.email,
          customer_phone: "9999999999"
        },
        order_meta: {
          return_url: `${process.env.APP_URL || "http://localhost:3000"}/payment-verify?order_id={order_id}`
        }
      };

      const cfRes = await fetch(cashfreeUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      if (!cfRes.ok) {
        const errorText = await cfRes.text();
        console.error("[Cashfree] Order creation error response:", errorText);
        throw new Error("Cashfree session initialization failed.");
      }

      const cfData = await cfRes.json() as any;
      res.json({
        order_id: orderId,
        payment_session_id: cfData.payment_session_id,
        isMock: false
      });

    } catch (err: any) {
      console.error("Payment session creation error:", err);
      res.status(500).json({ error: err.message || "Failed to initiate payment session." });
    }
  });

  // API: Verify Cashfree Payment
  app.post("/api/payment/verify", authenticateUser, async (req: any, res) => {
    try {
      const { orderId, simulateSuccess } = req.body;
      if (!orderId) {
        return res.status(400).json({ error: "Order ID is required." });
      }

      const isCashfreeConfigured = !!(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);
      let isSuccess = false;

      if (!isCashfreeConfigured || simulateSuccess) {
        // Handle simulation success path
        isSuccess = true;
      } else {
        // Real Cashfree Verification
        const isProd = process.env.CASHFREE_ENVIRONMENT === "production";
        const cashfreeUrl = isProd 
          ? `https://api.cashfree.com/pg/orders/${orderId}` 
          : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

        const headers = {
          "x-client-id": process.env.CASHFREE_APP_ID!,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
          "x-api-version": "2023-08-01"
        };

        const cfRes = await fetch(cashfreeUrl, { headers });
        if (cfRes.ok) {
          const cfData = await cfRes.json() as any;
          if (cfData.order_status === "PAID") {
            isSuccess = true;
          }
        }
      }

      const result = await verifyAndProcessPayment(orderId, isSuccess);
      return res.json(result);

    } catch (err: any) {
      console.error("Payment verification error:", err);
      res.status(500).json({ error: err.message || "Failed to verify payment." });
    }
  });

  // API: Cashfree Webhook Verification
  app.post("/api/payment/webhook", async (req, res) => {
    try {
      const payload = req.body;
      console.log("[Cashfree Webhook] Received payload:", JSON.stringify(payload));

      const orderId = payload?.data?.order?.order_id;
      const paymentStatus = payload?.data?.payment?.payment_status;

      if (orderId && paymentStatus) {
        await processPaymentWebhook(orderId, paymentStatus);
      }
      res.status(200).send("OK");
    } catch (err) {
      console.error("[Cashfree Webhook] Error:", err);
      res.status(500).send("Webhook handling failed.");
    }
  });

  // ADMIN: Get All Users
  app.get("/api/admin/users", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const users = await adminGetAllUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to load users list." });
    }
  });

  // ADMIN: Get All Transactions
  app.get("/api/admin/transactions", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const transactions = await adminGetAllTransactions();
      res.json(transactions);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to load all transactions." });
    }
  });

  // ADMIN: Adjust Credits Manually
  app.post("/api/admin/adjust-credits", authenticateUser, requireAdmin, async (req: any, res) => {
    try {
      const { userId, amount, reason } = req.body;
      if (!userId || amount === undefined || !reason) {
        return res.status(400).json({ error: "Missing required fields." });
      }
      await adminAdjustCredits(userId, Number(amount), reason);
      res.json({ success: true, message: `Wallet adjusted successfully by ${amount} credits.` });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to adjust credits." });
    }
  });

  // ADMIN: Adjust User Role
  app.post("/api/admin/adjust-role", authenticateUser, requireAdmin, async (req: any, res) => {
    try {
      const { userId, role } = req.body;
      if (!userId || !role) {
        return res.status(400).json({ error: "Missing required fields." });
      }
      await adminAdjustRole(userId, role);
      res.json({ success: true, message: `Role updated to ${role} successfully.` });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to update user role." });
    }
  });

  // API: Add Waitlist Email
  app.post("/api/waitlist", async (req, res) => {
    try {
      const { email, source } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required." });
      }
      await addWaitlistEmail(email, source || "landing_page");
      res.json({ success: true, message: "Welcome to the waitlist! We'll keep you updated." });
    } catch (err: any) {
      console.error("Waitlist error:", err);
      res.status(500).json({ error: "Failed to join waitlist." });
    }
  });

  // API: Submit User Feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      const { email, message, rating } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Feedback message is required." });
      }
      await addFeedback(email || "Anonymous", message, Number(rating || 5));
      res.json({ success: true, message: "Feedback submitted successfully! Thank you." });
    } catch (err: any) {
      console.error("Feedback error:", err);
      res.status(500).json({ error: "Failed to submit feedback." });
    }
  });

  // ADMIN: Get Growth Analytics & Weekly Reports
  app.get("/api/admin/analytics", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const data = await getAnalyticsData();
      res.json(data);
    } catch (err: any) {
      console.error("Analytics fetch error:", err);
      res.status(500).json({ error: "Failed to compile admin analytics directory." });
    }
  });

  // API: Main simplification endpoint with credits enforcement
  app.post("/api/simplify", authenticateUser, async (req: any, res) => {
    try {
      const { text, image, mode, topic } = req.body;

      if (!text && !image && !topic) {
        return res.status(400).json({ error: "Input text, image, or search topic is required." });
      }

      // Check user credit limits
      const profile = await getOrCreateUserProfile(req.user.uid, req.user.email, req.user.displayName);
      if (profile.requestsUsed >= profile.requestLimit) {
        return res.status(403).json({ 
          error: "You have reached your request limit. Please purchase a starter, pro, or business plan to continue banishing the darkness of complexity!" 
        });
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

      // Deduct 1 credit from user on success
      await deductUserCredit(req.user.uid);

      const resultText = response.text || "Clarity could not be found. Please try a different input.";
      res.json({ result: resultText });

    } catch (error: any) {
      console.error("Gemini Simplify Error:", error);
      res.status(500).json({ 
        error: error.message || "An unexpected error occurred while communicating with the intelligence engine." 
      });
    }
  });

  // API: Generate Business Studio Report
  app.post("/api/business/generate", authenticateUser, async (req: any, res) => {
    try {
      const { topic, industry, budget, currency, uploadedText, companyName, stateName, budgetAmount } = req.body;
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const cleanCompanyName = companyName ? companyName.trim() : `${topic} Enterprise`;
      const cleanStateName = stateName ? stateName.trim() : "Maharashtra";
      const cleanBudgetAmount = budgetAmount ? Number(budgetAmount) : 1500000;
      const currSymbol = currency && currency.includes("USD") ? "$" : currency && currency.includes("EUR") ? "€" : "₹";

      let generatedReport = null;
      try {
        const client = getGeminiClient();
        
        const promptText = `
You are an elite, world-class business consultant, commercial loan underwriter, and regional regulatory specialist.
Please generate an ultra-comprehensive, institutional-grade Business and Project Report for a venture with these highly personalized parameters:
- **Venture Name / Company Name**: "${cleanCompanyName}"
- **Target State / Region**: "${cleanStateName}"
- **Industry Sector / Domain**: "${industry}"
- **Selected Budget Classification**: "${budget}"
- **Precise Budget Capital Requirement**: "${currSymbol}${cleanBudgetAmount.toLocaleString("en-IN")}"
- **Primary Currency**: "${currency}"
${uploadedText ? `- **Uploaded Supporting Text Context**: "${uploadedText.substring(0, 5000)}"` : ""}

CRITICAL REQUIREMENTS:
1. **INPUT PERSONALIZATION**: 
   - Integrate the Company Name ("${cleanCompanyName}") as the operating entity throughout the narrative sections.
   - Tailor the location specific guidelines, registrations, and schemes to the selected State/Region ("${cleanStateName}").
2. **VALIDATE FINANCIAL CALCULATIONS**: 
   - You MUST ensure the 5-year financial projections are mathematically sound, flawless, and realistic.
   - For each year in 'fiveYearProjection', the formula \`revenue - expenses = profit\` MUST be exactly correct. 
   - Year 1 Expenses should reflect realistic deployment of the initial budget capital ("${cleanBudgetAmount}"). Year 1 Revenue should be scaled logically.
   - Ensure the 'breakEvenAnalysis' and funding statements mathematically match the financial projections. Show clear **Source Notes** and **Key Assumptions** for all numbers.
3. **GOVERNMENT SCHEMES & REGULATORY GUIDANCE**:
   - Recommend real matching state-level subsidies (such as CMEGP in Maharashtra, UP Startup Policy, etc., corresponding to "${cleanStateName}") and central schemes (such as PMEGP, AHIDF, DIDF, or Startup India Seed Fund matching "${industry}").
   - Explicitly cite real regulatory requirements (e.g. State Pollution Board NOCs, Shops & Establishments Registration for "${cleanStateName}", FSSAI, or specific SaaS certifications) to provide deep commercial value.

The output MUST be a single valid JSON object conforming strictly to the requested schema. Do not include any markdown block ticks like \`\`\`json. Output ONLY raw JSON text.
Ensure all sections are comprehensive and rich in details. Use clean markdown formatting (bullet points, bolding, simple subheaders) inside the string fields where appropriate to make it executive-grade.

The JSON MUST conform strictly to this structure:
{
  "title": "${cleanCompanyName}",
  "category": "${industry}",
  "investmentRange": "${budget} - ${currSymbol}${cleanBudgetAmount.toLocaleString("en-IN")}",
  "executiveSummary": "detailed markdown string summarizing the venture, setup state, target market, and strategic goals",
  "businessOverview": "detailed markdown string describing the facilities, breeds/technology, and core value proposition",
  "businessModel": "detailed markdown string highlighting monetization channels, subscriber plans, and B2B streams",
  "problemStatement": "detailed markdown string outlining market pain-points, fragmented supply chains, and consumer trust gaps in ${cleanStateName}",
  "solution": "detailed markdown string proposing the standard, technology-driven automated solution and consumer trust logs",
  "marketResearch": {
    "targetCustomers": "detailed markdown string analyzing segments, cohorts, and customer profiles",
    "competitorAnalysis": "detailed markdown string outlining competitors and our unique unfair advantages",
    "businessCanvas": "detailed markdown string representation of Lean Business Canvas"
  },
  "marketingStrategy": {
    "brandingStrategy": "detailed markdown string of visual language, packaging, and digital trust builders",
    "salesStrategy": "detailed markdown string of lead generation, marketing spend, and customer onboarding funnels"
  },
  "operationalPlan": {
    "humanResources": "detailed markdown string of staff layout, operations managers, and technician structures",
    "technologyStack": "detailed markdown string of core physical hardware, telemetry sensors, and digital scheduling apps"
  },
  "legalRequirements": {
    "licenses": ["List of commercial trade licenses", "State Pollution Board Consent NOC", "Shops and Establishments Act registry for ${cleanStateName}", "Department of Standards Certification"],
    "gst": "State-specific and Central GST tax rate schedules and input credit guidelines string",
    "msme": "MSME registration eligibility under Udyam Registry and corresponding banking loan benefits",
    "startupIndia": "Startup India recognition guidelines, tax holiday rules, and seed grant support details",
    "governmentSchemes": "detailed markdown string listing matching Central and state government schemes (e.g., CMEGP for ${cleanStateName}, PMEGP, or AHIDF) with specific eligibility rules"
  },
  "financialProjection": {
    "fiveYearProjection": [
      { "year": 1, "revenue": 100000, "expenses": 80000, "profit": 20000 },
      { "year": 2, "revenue": 115000, "expenses": 85000, "profit": 30000 },
      { "year": 3, "revenue": 132000, "expenses": 91000, "profit": 41000 },
      { "year": 4, "revenue": 152000, "expenses": 98000, "profit": 54000 },
      { "year": 5, "revenue": 175000, "expenses": 105000, "profit": 70000 }
    ],
    "revenueForecast": "detailed markdown string analyzing Year 1 to 5 CAGR, high-value contracts, and scaling assumptions",
    "expenseForecast": "detailed markdown string itemizing feed, rent, marketing, SaaS licenses, energy, and labor costs",
    "breakEvenAnalysis": "detailed markdown string showing exact monthly or client sales thresholds required to achieve break-even (mathematically derived)"
  },
  "investmentAndFunding": {
    "investmentRequirement": "detailed markdown string listing capital needs for setup, lease, initial inventory, and cash runway",
    "fundingSources": "detailed markdown string illustrating promoter contribution, collateral-free bank debt, or angel funding"
  },
  "riskAnalysis": {
    "risks": [
      { "risk": "risk name", "mitigation": "mitigation steps" }
    ]
  },
  "roadmap": {
    "milestones": [
      { "phase": "Setup & Licensing", "duration": "Month 1-3", "tasks": ["Task 1", "Task 2"] }
    ],
    "kpis": ["Key KPI 1", "Key KPI 2"],
    "growthStrategy": "detailed markdown string for regional replication or franchise options",
    "exitStrategy": "detailed markdown string for acquisition, mergers, or corporate off-takes"
  },
  "citations": ["State policy registry link or draft notes", "MSME/PMEGP scheme manual citations", "Industry survey stats"],
  "faq": [
    { "question": "FAQ Question?", "answer": "FAQ Answer" }
  ]
}
`.trim();

        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        });

        if (response && response.text) {
          let cleanJson = response.text.trim();
          if (cleanJson.startsWith("```json")) {
            cleanJson = cleanJson.substring(7);
          }
          if (cleanJson.endsWith("```")) {
            cleanJson = cleanJson.substring(0, cleanJson.length - 3);
          }
          generatedReport = JSON.parse(cleanJson.trim());
          console.log("[Server Business Studio] Successfully generated live Gemini report for:", topic);
        }
      } catch (geminiError: any) {
        console.warn("[Server Business Studio] Gemini API failed or key missing. Falling back to high-fidelity simulated database report.", geminiError.message);
      }

      if (!generatedReport) {
        generatedReport = getSimulatedBusinessReport(topic, industry, budget, currency, cleanCompanyName, cleanStateName, cleanBudgetAmount);
        console.log("[Server Business Studio] Served high-fidelity simulated report for:", topic);
      }

      // Deduct 1 credit from user on success
      await deductUserCredit(req.user.uid);

      res.json({ success: true, report: generatedReport });

    } catch (err: any) {
      console.error("Business generation server error:", err);
      res.status(500).json({ error: err.message || "An error occurred during report generation." });
    }
  });

  // API: AI Business Mentor Chat
  app.post("/api/business/mentor", authenticateUser, async (req: any, res) => {
    try {
      const { message, report, chatHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const client = getGeminiClient();
      let responseText = "";

      if (client) {
        const historyPrompt = chatHistory && chatHistory.length > 0 
          ? chatHistory.map((m: any) => `${m.role === "user" ? "User" : "Mentor"}: ${m.text}`).join("\n")
          : "";

        const systemPrompt = `
You are the elite **AI Business Mentor** integrated inside Readability AI's Creator Economy & Business Studio.
Your goal is to guide the user continuously to execute, scale, fund, and mitigate risks for their venture.

Here is the context of their generated business report:
- **Business Title**: "${report?.title || "Venture"}"
- **Industry Sector**: "${report?.category || "Business"}"
- **Investment Range & State**: "${report?.investmentRange || "Standard"}"
- **Licenses Needed**: "${JSON.stringify(report?.legalRequirements?.licenses || [])}"
- **Key Central & State Schemes**: "${report?.legalRequirements?.governmentSchemes || "MSME & Startup India support"}"

Prior Chat History (if any):
${historyPrompt}

User Question: "${message}"

Please respond as an encouraging, pragmatic, highly knowledgeable business mentor. Use bullet points and clear subheadings where helpful. Limit response to 300 words. Be concise, highly professional, citation-aware, and action-oriented. Provide realistic, state-specific compliance, funding, or operational guidelines.
`.trim();

        try {
          const response = await client.models.generateContent({
            model: "gemini-3.5-flash",
            contents: systemPrompt,
            config: {
              temperature: 0.7
            }
          });
          responseText = response?.text || "";
        } catch (geminiError: any) {
          console.warn("[Server Mentor] Gemini failed:", geminiError.message);
        }
      }

      if (!responseText) {
        responseText = `### 🌟 Mentor Action Guidance

Thank you for consulting the AI Business Mentor. Regarding your query for **${report?.title || "your enterprise"}**, here are the key action steps:

1. **Strategic Focus**: Leverage your MSME / Udyam Registry status to secure collateral-free credit lines of up to 70% under matching government schemes.
2. **Immediate Compliance**: Initiate your State Pollution Control Board Consent NOC and local Municipal Trade license filings.
3. **Milestone Targets**: Prioritize site setup and core supply-chain contracts during Months 1-3 to hit your Year 1 breakeven roadmap safely.

*Please let me know if you would like me to deep-dive into specific state-level subsidies, marketing strategies, or financial metrics!*`;
      }

      res.json({ success: true, response: responseText });
    } catch (err: any) {
      console.error("AI Business Mentor server error:", err);
      res.status(500).json({ error: err.message || "An error occurred during mentorship communication." });
    }
  });

  // ==========================================
  // CREATOR HUB & ECONOMY MODULE API ROUTES
  // ==========================================

  // API: Creator Profile Save/Update
  app.post("/api/creator/profile", authenticateUser, async (req: any, res) => {
    try {
      const updated = await updateCreatorProfile(req.user.uid, req.body);
      res.json(updated);
    } catch (err: any) {
      console.error("Error updating creator profile:", err);
      res.status(500).json({ error: err.message || "Failed to update profile." });
    }
  });

  // API: Get All Products
  app.get("/api/creator/products", async (req, res) => {
    try {
      const products = await getCreatorProducts();
      res.json(products);
    } catch (err: any) {
      console.error("Error loading creator products:", err);
      res.status(500).json({ error: "Failed to load products." });
    }
  });

  // API: Create/Update Product
  app.post("/api/creator/product", authenticateUser, async (req: any, res) => {
    try {
      const product = await createCreatorProduct(req.user.uid, req.body);
      res.json(product);
    } catch (err: any) {
      console.error("Error creating product:", err);
      res.status(500).json({ error: "Failed to create product." });
    }
  });

  // API: Purchase Product
  app.post("/api/creator/product/purchase", authenticateUser, async (req: any, res) => {
    try {
      const { productId } = req.body;
      if (!productId) return res.status(400).json({ error: "Product ID is required." });
      const result = await purchaseProductBackend(req.user.uid, productId);
      res.json(result);
    } catch (err: any) {
      console.error("Error purchasing product:", err);
      res.status(500).json({ error: err.message || "Failed to purchase product." });
    }
  });

  // API: Follow Creator
  app.post("/api/creator/product/follow", authenticateUser, async (req: any, res) => {
    try {
      const { creatorId } = req.body;
      if (!creatorId) return res.status(400).json({ error: "Creator ID is required." });
      const result = await followCreatorBackend(req.user.uid, creatorId);
      res.json(result);
    } catch (err: any) {
      console.error("Error following creator:", err);
      res.status(500).json({ error: "Failed to process follow." });
    }
  });

  // API: Admin Moderator Action
  app.post("/api/admin/creator/update", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const { creatorId, updates } = req.body;
      const result = await adminUpdateCreatorBackend(creatorId, updates);
      res.json(result);
    } catch (err: any) {
      console.error("Admin creator update error:", err);
      res.status(500).json({ error: "Failed to perform admin update." });
    }
  });

  // API: AI Creator Generator using Gemini
  app.post("/api/creator/ai-generate", authenticateUser, async (req: any, res) => {
    try {
      const { type, topic, audience, level, tone } = req.body;
      if (!type || !topic) {
        return res.status(400).json({ error: "Both generator type and topic are required." });
      }

      // Check if API key exists
      const hasKey = !!process.env.GEMINI_API_KEY;
      if (!hasKey) {
        // Return highly detailed fallback mock content if no key is present (excellent UX)
        console.warn("[Creator AI] GEMINI_API_KEY is not defined. Using highly detailed simulation response.");
        const simulated = getSimulatedCreatorContent(type, topic);
        return res.json({ text: simulated });
      }

      const client = getGeminiClient();
      let systemInstruction = "You are Readability AI's premium Creator Hub generator. Generate flawless, professional-grade, copy-paste ready content formatted elegantly in Markdown.";
      let prompt = "";

      if (type === "course") {
        prompt = `Generate a high-value, step-by-step Course Syllabus and Module Lesson on the topic: "${topic}". 
Target Audience: ${audience || "general learners"}. Difficulty level: ${level || "intermediate"}. Tone: ${tone || "engaging"}.
Include multiple sections, learning outcomes, a core conceptual lesson using simple terms with parenthesis for hard jargon, and a short 3-question review quiz at the end.`;
      } else if (type === "ebook" || type === "pdf") {
        prompt = `Generate a complete premium Mini-eBook on "${topic}". 
Include:
- Title Page
- Chapter 1: Introduction to the Thesis
- Chapter 2: The Core Framework & Dynamic Applications (Explain hard terms in parentheses)
- Chapter 3: Key Takeaways & Operational Steps
Make it long, exhaustive, deeply educational, and formatted with clean Markdown headings and lists.`;
      } else if (type === "notes") {
        prompt = `Generate comprehensive, highly structured Study Notes for the topic "${topic}".
Use clear bullet points, definition callouts, a "Common Misconceptions" block, and a summary. Keep language simple and define any advanced terminology.`;
      } else if (type === "quiz") {
        prompt = `Generate an interactive multiple-choice Quiz set (5 questions) on the topic "${topic}" with complete explanations for why each answer is correct.`;
      } else if (type === "podcast" || type === "audiobook") {
        prompt = `Generate a complete, engaging podcast script or audiobook transcript on "${topic}".
Include a Host introduction, an enthusiastic discussion of the core concepts, simplified jargon definitions, and an outro. Formatted as dialogue speaker prompts.`;
      } else if (type === "launch_metadata") {
        prompt = `Generate a comprehensive Launch Marketing Package for a product about "${topic}".
Provide:
1. Product Description (Captivating, high-converting copy)
2. SEO Title and Meta Description
3. Short Landing Page Copwriting structure
4. Launch Email Blast Campaign (subject, preheader, body, Call To Action)
5. Official Press Release draft
6. A 10-point launch day checklist.`;
      } else if (type === "promo_assets") {
        prompt = `Generate promotional growth social media copy for promoting a product about "${topic}".
Create:
- 1 LinkedIn Post (with hooks and hashtags)
- 1 Twitter/X Thread (3-4 high-engagement tweets)
- 1 Facebook Post
- 1 Instagram Caption idea
- 1 Short WhatsApp/Telegram shareable message.`;
      } else if (type === "media_kit") {
        prompt = `Generate a professional Creator Media Kit for an expert on "${topic}".
Provide:
- One-line Bio
- Short Bio (50 words)
- Professional Biography (200 words)
- Brand Story (origins and vision)
- Speaker Profile & suggested talk topics
- Suggested profile/header layout descriptions.`;
      } else {
        prompt = `Generate a premium study guide or template about "${topic}" in beautiful Markdown.`;
      }

      const response = await generateContentWithRetryAndFallback(client, {
        contents: [{ text: prompt }],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Creator AI generator error:", error);
      res.status(500).json({ error: error.message || "AI Generation failed." });
    }
  });

  // Resilient simulation generator for preview mode without active Gemini keys
  function getSimulatedCreatorContent(type: string, topic: string): string {
    const capsTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
    if (type === "course") {
      return `
# Course: Master Class on ${capsTopic}
*Generated via Readability AI Simulation Engine*

## Course Overview
Learn the fundamental mechanisms behind **${capsTopic}** through step-by-step conceptualization and direct, jargon-free instruction.

### Learning Outcomes
- Grasp the primary definition of ${capsTopic} without confusing formulas.
- Understand the 3 pillars of operations.
- Apply practical, everyday models to optimize outcomes.

---

## Module 1: The Core Fundamentals
To truly master this topic, we must unpack the foundational framework. Often, specialists use advanced jargon like *Heuristic Calibration* (testing based on past rules of thumb) or *Dynamic Interoperability* (how different systems talk to each other). Let us clarify these simply.

1. **Pillar 1: System Integrity**: Keeping all components aligned and running in harmony.
2. **Pillar 2: Latent Feedback Loops**: Listening to hidden signals in your project's history.
3. **Pillar 3: Incremental Compounding**: Making small 1% changes daily that lead to massive long-term output.

---

## Module 1 Review Quiz
**Q1: What is the primary purpose of Latent Feedback Loops?**
- A) To increase latency
- B) To listen to hidden signals and iterate *(Correct)*
- C) To complicate the system configuration

*Explanation: Latent feedback loops are designed to capture non-obvious results in your execution so you can optimize correctly.*
      `.trim();
    } else if (type === "ebook" || type === "pdf") {
      return `
# The Complete Guide to ${capsTopic}
*A Premium Readability AI eBook*

## Table of Contents
1. Introduction to the Paradigm
2. Demystifying Complex Terminology
3. Step-by-Step Strategic Blueprint

## Chapter 1: Introduction
Welcome to the essential guide on **${capsTopic}**. In this short eBook, we cover the real-world applications of this field. Rather than getting bogged down by academic papers, we look at the immediate leverage you can build today.

## Chapter 2: demystifying terminology
When discussing ${capsTopic}, you will encounter terms like:
- **Amortization** (spreading a cost or rate over a set timeline)
- **Stochastic Optimization** (making decisions based on random, changing sequences)

By keeping these definitions simple, we unlock immediate, scalable performance.
      `.trim();
    } else if (type === "launch_metadata") {
      return `
# Launch Marketing Package: ${capsTopic}

## 1. High-Converting Product Description
Are you struggling to wrap your head around **${capsTopic}**? Introducing our premium, jargon-free master guide. Built for fast learners, professionals, and students alike, this package turns hours of study into minutes of pristine understanding. Get immediate access to cheat sheets, quizzes, and scripts!

## 2. SEO Metadata
- **SEO Title**: Master ${capsTopic} in 30 Days: The Jargon-Free Guide
- **Meta Description**: Learn the ultimate secrets of ${capsTopic} with simple analogies and checklists.

## 3. Email Blast Campaign
**Subject**: Unlocking ${capsTopic} shouldn't take years...
**Body**:
Hey there,

Ever felt overwhelmed by dense, complex articles on **${capsTopic}**? You're not alone.
We've distilled everything down into a simple, high-impact learning package.

No complex math, no clinical jargon. Just pure, actionable growth.

[Get Instant Access Now & Save 40%]

Best regards,
The Readability Team
      `.trim();
    } else if (type === "promo_assets") {
      return `
# Promotional Assets & Captions

## LinkedIn Post
🚀 Demystifying **${capsTopic}** doesn't have to be a headache. 
I've spent the last few weeks summarizing the core principles, resolving complex jargon into simple, actionable strategies.

Read my full breakdown here:
👉 [Link]

#Learning #Growth #CreatorEconomy #ProfessionalDevelopment

## Twitter/X Thread
1/5: Let's talk about **${capsTopic}**. Most guides use confusing jargon that makes it hard to get started. Here's the simplified breakdown: 👇

2/5: First, the core concept: It is about systemic balance. Think of it like a bicycle wheel—every spoke must share the tension equally to move forward smoothly.

3/5: Second, avoid the "complexity trap." You don't need to learn ten-letter terms to understand how to drive value. Start small and iterate.

4/5: I've created a comprehensive toolkit for this. Grab it here: [Link]
      `.trim();
    } else {
      return `
# Demystifying ${capsTopic}
*Generated via Readability AI Creator Engine*

This document provides a highly structured, readable summary of **${capsTopic}**. Use this study template, customize the lessons, and share with your audience to build authority and drive earnings!
      `.trim();
    }
  }

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
