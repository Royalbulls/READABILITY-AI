# Readability AI - Google Cloud Gen AI Hackathon Submission

> **A Native Google Cloud Serverless & Multi-Modal AI Platform for Universal Document Simplification, Educational Curriculum Assembly, and Institutional Business Structuring.**
>
> 🚀 **Live Demo Hub:** [Readability AI Hackathon Preview](https://ais-dev-vr6d6c45pn62iltootxnvs-23107996963.asia-east1.run.app)
> 👥 **Sponsor Track:** Google Cloud Gen AI, Serverless Cloud Run, and Firebase Native Integrations

---

## 🎯 The Vision & Value Proposition

In an information-dense world, complex jargon is a barrier to equity. Critical legal terms, healthcare disclosure documents, educational textbooks, and complex business plans remain locked behind layers of professional terminology. 

**Readability AI** is a multi-modal, end-to-end cloud-native platform designed to translate high-friction professional text into citizen-friendly, highly structured, and multi-tier simplified documents. By combining the cognitive power of **Google Gemini models** with the horizontal scalability of **Google Cloud Run** and the real-time persistence of **Google Firebase (Firestore & Authentication)**, Readability AI makes knowledge accessible, actionable, and universally readable.

---

## 🏗️ Technical Architecture Overview

Readability AI is architected from the ground up as a fully containerized, stateless, high-availability full-stack application running on the Google Cloud Serverless suite.

```
                     ┌───────────────────────────────┐
                     │       Client Interface        │
                     │   (React 18, Vite, Tailwind)  │
                     └───────────────┬───────────────┘
                                     │ HTTPS
                                     ▼
                     ┌───────────────────────────────┐
                     │    Google Cloud Run Container │
                     │   (TypeScript Express Server) │
                     └───────────────┬───────────────┘
                                     │
            ┌────────────────────────┼────────────────────────┐
            ▼                        ▼                        ▼
┌───────────────────────┐┌───────────────────────┐┌───────────────────────┐
│     Google Gemini     ││   Firebase Firestore  ││ Firebase Auth Service │
│   Multi-modal APIs    ││ (NoSQL Document Store)││ (Secure OAuth & JWT)  │
└───────────────────────┘└───────────────────────┘└───────────────────────┘
```

### 1. Google Cloud Run (Hosting & Ingress)
- Runs a fully-optimized TypeScript + Express container with automated scaling.
- Configured with native environment variables and lightning-fast Cold Starts utilizing asset caching strategies.
- Operates behind Google Cloud's secure serverless routing layers.

### 2. Google Vertex AI / Gemini SDK (`@google/genai`)
- Leverages the modern unified SDK to facilitate complex text simplifications, interactive OCR extraction from images/PDFs, web page URL content harvesting, and real-time curricular syllabus compilation.
- Structured prompting techniques enforce strict formatting constraints (JSON and pristine Markdown structures).
- Built-in automatic API retries and model fallbacks ensure reliable execution.

### 3. Google Firebase Native Integration
- **Firebase Authentication:** Handles secure client-side and server-side state validations, keeping user credentials fully sandboxed and verified via standard JWT validation middleware.
- **Firebase Firestore:** A scalable cloud-hosted NoSQL database used to maintain:
  - **Sovereign User Histories:** Preserving simplified texts, URLs, and multi-modal image inputs.
  - **Custom Curriculums:** Tracking active courses assembled through the AI Academy.
  - **Detailed Project Reports:** Retaining market analyses, business canvas models, and pitches generated in the Business Studio.
  - **Sovereign Expert Index:** Cataloging qualified expert authors within the Creator Platform.

---

## ✨ Primary Core Capabilities

Readability AI is divided into modular, highly polished workspaces:

| Workspace | Description | Google Cloud Integration |
| :--- | :--- | :--- |
| **Sovereign Workspace** | Simplifies dense textual passages, uploaded PDFs/Word files, document images, or live URLs into 5 different target readability levels (Grade School, Non-Native Speaker, Professional, Executive Summary, Senior Citizen). | Gemini Multi-modal Vision API, Firestore persistence |
| **Mr. Kilvish AI Academy** | Instantly compiles a comprehensive, interactive 4-tier learning syllabus for any topic, complete with course progress trackers and live tests. | Gemini Text Generation, Firestore collections |
| **Business Studio** | Translates raw ideas into highly comprehensive business reports, complete with Target Customers, Competitor Maps, and an Investor Pitch Slide Deck. | Gemini Structured Schema Generation |
| **Launch & Growth Hub** | Guides creators and startup founders step-by-step through execution tactics with custom AI mentorship. | Gemini Real-Time Chat Engine |
| **Creator Platform** | Connects standard readers with certified experts who manually review, approve, and co-sign AI-simplified documents. | Firebase Auth (Roles), Firestore indexes |

---

## 🛠️ Post-Hackathon Production Readiness Audit

Prior to moving this prototype into production and submitting to final security audits, the following checklist outlines the transition roadmap:

### 1. Payment Gateway & Auto-Debit Re-activation
- [ ] **Billing Migration:** Toggle `DISABLE_PAYMENTS_FOR_HACKATHON` to `false` in `src/components/PricingWalletView.tsx` and `server.ts` to reconnect the live PayU production environment.
- [ ] **Standing Instructions:** Enable `PAYU_SI_ENABLED="true"` inside `.env` to support fully automated, recurring customer renewals.
- [ ] **Double-Signatures:** Audit webhook endpoint signatures (`/api/payu/webhook`) to handle pre-pended or appended charges on real production gateways.

### 2. Multi-modal Processing Enhancements
- [ ] **Large Document Chunking:** Integrate standard map-reduce vector text-splitting for PDFs exceeding 50+ pages.
- [ ] **Optical Character Recognition (OCR):** Fine-tune specific vision prompts to better isolate text from complex graphic structures in charts or tables.

### 3. Scalability & DB Optimization
- [ ] **Indexing:** Establish custom composite indexes in Firebase Firestore for advanced user history queries (e.g., sorting, categorical groupings, or specific text search criteria).
- [ ] **Cache layers:** Mount Redis MemoryStore instances on Google Cloud to cache highly popular general simplified documents (reducing duplicate Gemini token usage).

### 4. Security & Compliance
- [ ] **Data Locality:** Configure Firestore collections to run within the exact sovereign geo-regions (e.g., EU or India) corresponding to specific citizen data security mandates.
- [ ] **Compliance Filters:** Enable automated content moderation pipelines on Gemini API calls to flag legal or health documents that violate regulatory policies before saving to cloud storages.

---

## 🚀 Local Development Setup

To run the full-stack container environment on your local system, follow these steps:

### 1. Clone & Set Up Environment Variables
Create a `.env` file at your project's root based on the template:

```bash
# General Server Configuration
PORT=3000
NODE_ENV="development"
APP_URL="http://localhost:3000"

# Google Gemini API Secrets
GEMINI_API_KEY="your_google_gemini_api_key_here"

# PayU gateway settings (Disabled during Hackathon Preview)
PAYU_MERCHANT_KEY="test_key"
PAYU_MERCHANT_SALT="test_salt"
PAYU_ENVIRONMENT="test"
PAYU_SI_ENABLED="false"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
This boots up the unified Express backend with full hot-loading Vite client middleware on port `3000`:
```bash
npm run dev
```

### 4. Build for Production
This bundles client static files via Vite, and compiles the backend TypeScript server using Fast Esbuild Bundle configurations to output a CJS package within `dist/server.cjs`:
```bash
npm run build
npm start
```

---

## 📊 Google Cloud Services Utilized
* **Google Cloud Run:** Serverless Container Hosting, Auto-scaling, and secure ingress.
* **Google Vertex AI / Gemini 2.5:** Text Simplification, Vision Multi-modal Extraction, and Strategic Decision engines.
* **Google Firebase Firestore:** Globally distributed low-latency NoSQL Document Database.
* **Google Firebase Authentication:** Passwordless identity federation & state maintenance.

---

## ⚖️ Legal & Operational Pages
To comply with global hackathon directives, professional reference pages have been deployed to cover operational criteria:
- **About Readability AI:** Highlighting our mission to democratize academic, business, and legal text.
- **Privacy Policy:** Guaranteeing sovereign client data encapsulation and sandbox boundaries.
- **Terms of Service:** Outlining server and API utilization boundaries.
- **Refund Policy:** Specifying evaluation standards and subscription refund terms.
- **Contact Desk:** Providing immediate lines of communication for judges and hackathon evaluation teams.

---

*Prepared as an investor-ready, high-performance production candidate for the Google Cloud Gen AI Hackathon.*
