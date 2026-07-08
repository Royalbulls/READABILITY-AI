# Readability AI

Readability AI simplifies and clarifies text (or text extracted from images) using the Gemini API. It exposes a small Express API and a frontend served by Vite for local development and deployment. The server uses a resilient Gemini client with retries and model fallback.

## Features
- Simplify or explain input text and image-extracted text.
- Topic-based deep explanations and several output modes (Default, ELI5, Pro, Student, Mr. Kilvish Academy).
- Resilient Gemini client with retries and model fallback to handle transient API errors.
- Dev-friendly: Vite + React frontend and simple Express server.

## Quick Links
- Live AI Studio app (if available): https://ai.studio/apps/e1614102-c3ab-48bc-bc08-2cf13797267a

## Prerequisites
- Node.js (recommended: current LTS)
- A Gemini API key

## Environment
Copy and edit `.env.example` to provide required secrets:

GEMINI_API_KEY (required)  
APP_URL (optional; used for callbacks / self-referential links)

Example (.env)
```
GEMINI_API_KEY="your_gemini_api_key_here"
APP_URL="https://your-app.example.com"
```

## Install & Run (development)
1. Install dependencies:
   npm install

2. Create a .env.local (or set environment variables) with GEMINI_API_KEY.

3. Start dev server:
   npm run dev

The dev script runs the server via tsx and uses Vite middleware for frontend development.

## Build & Run (production)
1. Build the frontend and bundle the server:
   npm run build

2. Start the bundled server:
   npm run start

## API Reference
- GET /api/health
  - Returns server health and timestamp.
  - Example: curl http://localhost:3000/api/health

- GET /api/config-status
  - Returns { hasApiKey: boolean } to indicate if GEMINI_API_KEY is configured.

- POST /api/simplify
  - Main endpoint for text/image/topic processing.
  - Request JSON:
    {
      "text": "Text to simplify or explain",
      "image": { "data": "<base64>", "mimeType": "image/png" }, // optional
      "mode": "academy|eli5|pro|student|default",
      "topic": "optional topic to deep-explain"
    }
  - Response:
    { "result": "<generated markdown/text>" }
  - Example curl:
    curl -X POST http://localhost:3000/api/simplify \
      -H "Content-Type: application/json" \
      -d '{"text":"Explain recursion simply","mode":"eli5"}'

Notes:
- At least one of text, image, or topic is required.
- Responses are generated using Gemini models; the server uses a fallback list and retry/backoff to handle transient errors.

## Behavior & Modes
- System persona: The server instructs the model to adopt a clear persona ("Mr. Kilvish") and enforces structured output rules (core concept + breakdown).  
- Supported modes:
  - Default: Balanced, clear summary + breakdown.
  - ELI5: Simple, analogy-driven explanations.
  - Pro: Concise, action-oriented output.
  - Student: Educational, step-by-step explanations.
  - Mr. Kilvish Academy: Long-form course-like output (very verbose).

## Implementation Notes
- The server lazy-initializes the Gemini client and throws an explicit error if GEMINI_API_KEY is missing.
- generateContentWithRetryAndFallback tries models in order:
  - gemini-3.5-flash
  - gemini-3.1-flash-lite
  - gemini-flash-latest
  with retries and exponential backoff for transient errors (503, 429, UNAVAILABLE, ResourceExhausted).
- Vite is used for the frontend in dev mode; in production the server serves static files from dist/.

## Troubleshooting
- "GEMINI_API_KEY environment variable is missing": ensure .env is present or that Secrets are configured in your hosting platform.
- Transient API errors: the server already retries; if you frequently see ResourceExhausted or 503, consider reducing request rate or using a higher quota/key.
- If frontend is not loading in production, confirm `npm run build` succeeded and `dist/index.html` exists.

## Contributing
- Fork the repo and open a PR with clear changes.
- Run type checks:
  npm run lint
- Keep changes focused and include tests where applicable (not included in this template).

## Security & Privacy
- Do not commit your GEMINI_API_KEY or any secrets.
- Handle user-uploaded images/text carefully if operating with sensitive data—consider redaction or explicit consent.

## License
No license file detected in repository. If you want to add a license, I can add a LICENSE file (MIT, Apache-2.0, etc.). Tell me which license you prefer.

## Next steps I can take
- Commit this README.md to the repository (default branch) — tell me the commit message you'd like (default: "chore: improve README").
- Add a LICENSE file (specify which license).
- Add badges (node version, build status) if you provide CI details.
