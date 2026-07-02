import React, { useState } from "react";
import { X, Shield, FileText, RefreshCw, Mail, Info, MapPin, Phone, Send, Check } from "lucide-react";

interface ComplianceModalProps {
  initialTab: "privacy" | "terms" | "refund" | "contact" | "about";
  onClose: () => void;
}

export default function ComplianceModal({ initialTab, onClose }: ComplianceModalProps) {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms" | "refund" | "contact" | "about">(initialTab);
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const tabs = [
    { id: "about" as const, label: "About Us", icon: Info },
    { id: "privacy" as const, label: "Privacy Policy", icon: Shield },
    { id: "terms" as const, label: "Terms & Conditions", icon: FileText },
    { id: "refund" as const, label: "Refund Policy", icon: RefreshCw },
    { id: "contact" as const, label: "Contact Us", icon: Mail },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full h-[85vh] shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close"
          id="compliance-modal-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-5 flex flex-col gap-5 shrink-0">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm font-display">
              R
            </div>
            <div>
              <p className="font-display font-black text-xs text-slate-900 tracking-wide">
                READABILITY AI
              </p>
              <p className="text-[9px] font-mono font-bold text-indigo-600 uppercase tracking-wider">COMPLIANCE CENTER</p>
            </div>
          </div>

          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0" id="compliance-modal-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition cursor-pointer text-left ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                  }`}
                  id={`tab-${tab.id}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex flex-col gap-1.5 mt-auto p-3.5 bg-indigo-50/50 border border-indigo-100/60 rounded-2xl text-[11px] leading-relaxed text-indigo-950 font-sans">
            <p className="font-bold uppercase tracking-wider font-mono text-[9px] text-indigo-600 mb-0.5">Trust & Safety</p>
            Readability AI is owned and operated by Royal Bulls Advisory. All payment transactions are encrypted using industrial security protocols.
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8" id="compliance-modal-content-container">
          
          {/* ABOUT US TAB */}
          {activeTab === "about" && (
            <div className="flex flex-col gap-5 animate-slideUp">
              <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">About Us</h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full" />
              
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Welcome to <strong>Readability AI</strong> (accessible via <a href="https://readability.rbaadvisor.com" className="text-indigo-600 font-semibold hover:underline">https://readability.rbaadvisor.com</a>), an initiative owned and managed by <strong>Royal Bulls Advisory</strong>.
                </p>
                <p>
                  Our singular mission is to <strong>banish the darkness of convoluted industrial jargon</strong>. In modern academic research, legal frameworks, and healthcare, complex terminology is often leveraged as a barrier to understanding. Important knowledge is locked behind heavy terminology that stops readers in their tracks.
                </p>
                <p>
                  Readability AI serves as an intelligent cognitive translation engine. We leverage advanced artificial intelligence pipelines (powered by Google's Gemini-3.5-Flash model) to parse technical source files and inject clear, natural parenthetical translations immediately alongside obscure terms. Instead of omitting critical parameters or rewriting the style, we expand comprehension while preserving original nuances.
                </p>
                <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider pt-2">Our Core Value System</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Cognitive Inclusion:</strong> Believing that knowledge shouldn't belong exclusively to specialists.</li>
                  <li><strong>Data Dignity:</strong> Zero-retention data pipelines ensuring files are processed safely and never stored or repurposed.</li>
                  <li><strong>Auditory Clarity:</strong> Immersive text-to-speech audio logs under our conversational assistant authority, Mr. Kilvish.</li>
                </ul>
                <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider pt-2">Corporate Information</h3>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase">Legal Business Entity</span>
                    <span className="text-slate-800 font-bold font-sans">Royal Bulls Advisory</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase">Corporate Email ID</span>
                    <span className="text-slate-800 font-bold font-sans">royalbullsadvisory412@gmail.com</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase">Digital Platform</span>
                    <span className="text-indigo-600 font-bold font-sans">Readability AI</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase">Official Website</span>
                    <span className="text-slate-800 font-bold font-sans">https://readability.rbaadvisor.com</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY TAB */}
          {activeTab === "privacy" && (
            <div className="flex flex-col gap-5 animate-slideUp">
              <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">Privacy Policy</h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full" />
              <p className="text-xs font-mono font-bold text-slate-400 uppercase">Effective Date: July 2, 2026</p>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  At <strong>Readability AI</strong> (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;), operated by <strong>Royal Bulls Advisory</strong>, the privacy of our visitors and active users is one of our primary priorities. This Privacy Policy document outlines the types of information we collect, record, and how we handle it.
                </p>
                
                <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider pt-2">1. Data Collection & Usage</h3>
                <p>
                  We only ask for personal information when it is absolutely required to provide the service to you. 
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Account Credentials:</strong> When you register or sign in with Google OAuth, we receive secure profile indicators (your name, email ID, and avatar photograph URL) via Firebase Authentication. We use this strictly to provision your account, secure your transaction wallet, and sync logs.</li>
                  <li><strong>Text and Image Uploads:</strong> Any texts, images, or documents you upload to Readability AI for cognitive translation are processed dynamically on secure servers. They are <strong>never stored</strong> on our hard servers, never logged, and are strictly discarded immediately after the API returns the simplified output. We maintain a strict zero-retention policy.</li>
                  <li><strong>Cookies & Analytics:</strong> We employ standard browser cookies strictly to preserve your user login session. We do not use third-party marketing cookies or aggressive tracker scripts.</li>
                </ul>

                <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider pt-2">2. Security of Data</h3>
                <p>
                  The security of your personal data is critical to us. We implement industry-standard security measures including HTTPS, end-to-end SSL/TLS certificates, secure Firestore rule guards, and sanitized token validation endpoints to safeguard against unauthorized modification, disclosure, or access.
                </p>

                <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider pt-2">3. Third-Party Services</h3>
                <p>
                  We transmit requests to secure AI API endpoints (Google Gemini) and processing nodes. None of your input text or files are utilized by external providers for machine learning training models.
                </p>

                <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider pt-2">4. Your Data Protection Rights</h3>
                <p>
                  You retain complete ownership over your account details. You may request deletion of your synchronized logs at any time via the &quot;Clear Workspace&quot; controller inside the application interface or by contacting our team at <a href="mailto:royalbullsadvisory412@gmail.com" className="text-indigo-600 font-semibold hover:underline">royalbullsadvisory412@gmail.com</a>.
                </p>
              </div>
            </div>
          )}

          {/* TERMS AND CONDITIONS TAB */}
          {activeTab === "terms" && (
            <div className="flex flex-col gap-5 animate-slideUp">
              <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">Terms & Conditions</h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full" />
              <p className="text-xs font-mono font-bold text-slate-400 uppercase">Last Updated: July 2, 2026</p>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Welcome to <strong>Readability AI</strong>. These Terms and Conditions govern your access to and usage of the digital platform located at <a href="https://readability.rbaadvisor.com" className="text-indigo-600 font-semibold hover:underline">https://readability.rbaadvisor.com</a>, owned and operated by <strong>Royal Bulls Advisory</strong>.
                </p>
                <p>
                  By accessing or registering on our platform, you acknowledge that you have read, understood, and agreed to be bound by these standard Terms. If you do not agree to all terms, you are forbidden from utilizing the application services.
                </p>

                <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider pt-2">1. Use of Service</h3>
                <p>
                  Readability AI provides a digital wallet system where users can purchase prepaid credits/requests. One credit corresponds to one successful document translation or Infinity Search execution.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You must provide accurate profile parameters during Google verification login.</li>
                  <li>You are responsible for keeping your login credentials confidential.</li>
                  <li>You agree not to utilize our text simplifier or search parameters for any malicious, illegal, or abusive operations.</li>
                </ul>

                <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider pt-2">2. Financial Terms & Credits</h3>
                <p>
                  All plan amounts are listed in Indian Rupees (INR) and are payable securely through PayU Subscription Services or other designated channels. Credits are assigned directly to your registered Google UID upon receipt of successful transaction indicators.
                </p>

                <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider pt-2">3. Disclaimer & Limitation of Liability</h3>
                <p>
                  Readability AI translates texts utilizing automated language models. While the engine is engineered to maximize readability, the resulting translations are designed for educational, auxiliary reference purposes only. They do not constitute formal legal advice, professional healthcare consulting, or official financial counsel. Royal Bulls Advisory shall not be liable for any errors or actions taken based on simplified summaries.
                </p>
              </div>
            </div>
          )}

          {/* REFUND AND CANCELLATION POLICY TAB */}
          {activeTab === "refund" && (
            <div className="flex flex-col gap-5 animate-slideUp">
              <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">Refund & Cancellation</h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full" />
              <p className="text-xs font-mono font-bold text-slate-400 uppercase">Policy Version: 2.0</p>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  At <strong>Readability AI</strong> (owned by <strong>Royal Bulls Advisory</strong>), we value customer satisfaction and strive to offer a transparent billing framework.
                </p>

                <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider pt-2">1. Cancellation Policy</h3>
                <p>
                  Since Readability AI operates on a prepaid, consumption-based credit balance model (rather than a recurring monthly subscription), there are <strong>no automatic renewals or monthly recurring charges</strong>. You are only billed when you explicitly purchase a credit pack (e.g. Starter Pack, Growth Pack, or Enterprise Pack). Consequently, there are no recurring cancellations required. Your account remains active and your unused credits will never expire.
                </p>

                <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider pt-2">2. Refund Eligibility</h3>
                <p>
                  We offer a <strong>7-Day money-back guarantee</strong> under the following conditions:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>The refund request is sent within <strong>7 days</strong> of your transaction date.</li>
                  <li>The purchased credit pack is completely **unused** (no requests have been consumed from the newly purchased pack).</li>
                  <li>If you have consumed some credits from your pack but encountered critical platform errors or system downtime, we will review your request and issue a prorated refund or allocate compensatory credits.</li>
                </ul>

                <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider pt-2">3. How to Request a Refund</h3>
                <p>
                  To request a refund, please write to our support team at <a href="mailto:royalbullsadvisory412@gmail.com" className="text-indigo-600 font-semibold hover:underline">royalbullsadvisory412@gmail.com</a>. Please provide:
                </p>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl font-mono text-[11px] leading-relaxed text-slate-700">
                  - Your Full Name & Google Account Email ID<br />
                  - Transaction Date & Time<br />
                  - Order Reference ID (e.g. cf_order_xxxx)<br />
                  - Brief explanation of the issue encountered
                </div>
                <p>
                  Refund requests are evaluated and processed by Royal Bulls Advisory within **3 to 5 business days**. Approved refunds will be credited back directly to the original payment instrument used during checkout.
                </p>
              </div>
            </div>
          )}

          {/* CONTACT US TAB */}
          {activeTab === "contact" && (
            <div className="flex flex-col gap-5 animate-slideUp">
              <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">Contact Us</h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-2">
                {/* Contact Coordinates */}
                <div className="md:col-span-5 flex flex-col gap-4 font-sans text-xs">
                  <p className="text-slate-500 leading-relaxed text-sm">
                    Have any questions, compliance queries, feedback, or need billing support? Feel free to contact the Royal Bulls Advisory support desk.
                  </p>

                  <div className="flex flex-col gap-3.5 mt-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">SUPPORT EMAIL ID</span>
                        <a href="mailto:royalbullsadvisory412@gmail.com" className="font-semibold text-slate-800 hover:text-indigo-600 transition">
                          royalbullsadvisory412@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">HEADQUARTERS ADDRESS</span>
                        <p className="font-semibold text-slate-800 leading-normal">
                          Royal Bulls Advisory<br />
                          Jaipur, Rajasthan, India
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">RESPONSE COMMITMENT</span>
                        <p className="font-semibold text-slate-800">
                          Within 24-48 Hours (Business Days)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Form */}
                <div className="md:col-span-7 bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center text-center p-6 gap-3 animate-scaleUp">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wide">Inquiry Registered Successfully</h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                        Thank you for reaching out to Royal Bulls Advisory. Our support executives will respond to your email shortly!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="flex flex-col gap-3 font-sans text-xs">
                      <h4 className="font-display font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-2">Send support message</h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                          <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder="e.g. John Doe"
                            className="bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-slate-300 font-sans text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder="e.g. john@example.com"
                            className="bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-slate-300 font-sans text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject / Purpose</label>
                        <input
                          type="text"
                          required
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          placeholder="e.g. Wallet Credits Verification, Billing Inquiry"
                          className="bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-slate-300 font-sans text-xs"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Message</label>
                        <textarea
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Provide details of your question here..."
                          className="bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-slate-300 font-sans text-xs resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                      >
                        {submitting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Transmitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Inquiry</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
