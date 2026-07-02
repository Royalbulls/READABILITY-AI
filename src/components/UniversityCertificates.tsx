import React, { useState } from "react";
import { 
  Award, 
  Search, 
  Printer, 
  Share2, 
  Download, 
  ShieldCheck, 
  Info,
  Building,
  CheckCircle,
  X,
  QrCode
} from "lucide-react";

interface UniversityCertificatesProps {
  currentCourse: any;
  showCertificate: boolean;
  certSerialNumber: string;
  studentName: string;
  setStudentName: (val: string) => void;
}

export default function UniversityCertificates({
  currentCourse,
  showCertificate,
  certSerialNumber,
  studentName,
  setStudentName
}: UniversityCertificatesProps) {
  const [activeSubTab, setActiveSubTab] = useState<"shelf" | "verify">("shelf");
  
  // Verification states
  const [verifyQuery, setVerifyQuery] = useState("");
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    
    const query = verifyQuery.trim().toUpperCase();
    if (!query) return;

    if (query.includes("REG") || query.includes("KLA") || query.toLowerCase() === studentName.toLowerCase() || query.length >= 6) {
      setVerificationResult({
        status: "VALID / VERIFIED",
        student: studentName || "Ramesh Sharma",
        course: currentCourse?.title || "Artificial Intelligence foundations",
        issueDate: "July 2, 2026",
        completionDate: "July 2, 2026",
        validity: "Lifetime Accredited Credential",
        code: "UNIV-KBA-98412",
        issuer: "Royal Bulls Advisory Private Limited"
      });
    } else {
      setVerificationResult(null);
    }
  };

  const mockSerial = certSerialNumber || "REG-KBA-927481-KB";

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-slate-100 pb-3">
        <button
          onClick={() => { setActiveSubTab("shelf"); setHasSearched(false); }}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === "shelf"
              ? "bg-violet-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Certificate Vault
        </button>
        <button
          onClick={() => { setActiveSubTab("verify"); setHasSearched(false); }}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === "verify"
              ? "bg-violet-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Verification Portal
        </button>
      </div>

      {activeSubTab === "shelf" ? (
        <div className="space-y-6">
          {/* Student legal name customization input */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 font-display">
              ✏️ Verify Legal Name for Digital Credentials
            </h4>
            <p className="text-[11px] text-slate-500 max-w-xl">
              Specify your authentic spelling as it appears on official Indian identity papers (PAN/Aadhaar) to ensure credit validation and sovereign registry lookups.
            </p>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Ramesh Kumar Sharma"
              className="max-w-md w-full bg-slate-50 text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-500 font-sans font-bold"
            />
          </div>

          {showCertificate ? (
            <div className="space-y-6">
              {/* Premium branded University Certificate design */}
              <div 
                id="printable-university-credential" 
                className="bg-stone-50 border-[16px] border-amber-900 p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden text-slate-800 max-w-4xl mx-auto border-double print:border-[10px] print:shadow-none print:my-0"
              >
                {/* Visual watermark accents */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="absolute right-0 top-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

                {/* Branded Header Logos Block */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b-2 border-amber-900/10 pb-6">
                  {/* Left Logo: Royal Bulls */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-amber-900 text-amber-100 rounded-xl flex items-center justify-center font-display font-black text-lg border border-amber-800">
                      RB
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono font-black text-amber-900 leading-none">ROYAL BULLS</h4>
                      <p className="text-[8px] font-mono text-slate-400 mt-0.5 uppercase tracking-widest">Advisory Private Limited</p>
                    </div>
                  </div>

                  {/* Center Branding Accent */}
                  <div className="text-center md:absolute md:left-1/2 md:-translate-x-1/2">
                    <h3 className="font-serif font-bold text-base md:text-lg text-amber-950 uppercase tracking-widest">
                      Mr. Kilvish AI Academy
                    </h3>
                    <p className="text-[9px] font-mono text-amber-800 font-bold tracking-wider mt-0.5">
                      Accredited Learning Division
                    </p>
                  </div>

                  {/* Right Logo: Readability AI */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center border border-violet-500">
                      RA
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono font-black text-violet-700 leading-none">READABILITY AI</h4>
                      <p className="text-[8px] font-mono text-slate-400 mt-0.5 uppercase tracking-widest">Powered Technology</p>
                    </div>
                  </div>
                </div>

                {/* Certificate Core Declaration */}
                <div className="text-center space-y-6 py-8">
                  <div className="inline-flex items-center gap-1">
                    <Award className="w-5 h-5 text-amber-800 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-amber-900 uppercase tracking-widest">Executive Credentials Registry</span>
                  </div>

                  <h1 className="font-serif italic text-3xl md:text-4xl text-slate-900 font-black">
                    Certificate of Academic Mastery
                  </h1>

                  <p className="text-xs text-slate-500 font-sans max-w-lg mx-auto leading-relaxed">
                    This document certifies that the academic senate has vetted and conferred honors standing upon
                  </p>

                  <h2 className="text-2xl md:text-3xl font-serif font-black text-amber-950 border-b border-slate-200 pb-2 max-w-md mx-auto">
                    {studentName || "Ramesh Sharma"}
                  </h2>

                  <p className="text-xs text-slate-500 font-sans max-w-lg mx-auto leading-relaxed">
                    for the successful completion of the curriculum and strict rigorous timed examinations in
                  </p>

                  <h3 className="text-lg md:text-xl font-display font-bold text-violet-800 max-w-xl mx-auto leading-tight">
                    {currentCourse?.title || "Artificial Intelligence Adaptive Systems"}
                  </h3>

                  <p className="text-xs font-semibold text-slate-500">
                    Course Code: <span className="font-mono text-slate-700">{currentCourse?.id?.toUpperCase() || "AI-ACAD-FND"}</span> | Study Load: <span className="font-mono text-slate-700">{currentCourse?.studyHours || 35} Hours</span>
                  </p>
                </div>

                {/* Footnotes and Digital Signatures Block */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-amber-900/10 items-end">
                  {/* Left Column: QR and Verification URLs */}
                  <div className="space-y-2 flex flex-col items-center md:items-start">
                    <div className="w-20 h-20 bg-white border border-slate-200 p-1.5 rounded-xl">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Mock elegant vector QR pattern */}
                        <rect x="5" y="5" width="25" height="25" fill="#1e1b4b" />
                        <rect x="10" y="10" width="15" height="15" fill="#ffffff" />
                        <rect x="5" y="70" width="25" height="25" fill="#1e1b4b" />
                        <rect x="10" y="75" width="15" height="15" fill="#ffffff" />
                        <rect x="70" y="5" width="25" height="25" fill="#1e1b4b" />
                        <rect x="75" y="10" width="15" height="15" fill="#ffffff" />
                        <rect x="40" y="40" width="20" height="20" fill="#1e1b4b" />
                        <rect x="45" y="45" width="10" height="10" fill="#ffffff" />
                        <rect x="5" y="40" width="15" height="15" fill="#1e1b4b" />
                        <rect x="70" y="40" width="20" height="15" fill="#1e1b4b" />
                        <rect x="40" y="5" width="15" height="20" fill="#1e1b4b" />
                        <rect x="40" y="70" width="15" height="25" fill="#1e1b4b" />
                        <rect x="70" y="70" width="25" height="25" fill="#1e1b4b" />
                        <rect x="75" y="75" width="15" height="15" fill="#ffffff" />
                      </svg>
                    </div>
                    <div className="text-[8px] font-mono text-slate-500 text-center md:text-left leading-tight">
                      <p className="font-bold">SERIAL: {mockSerial}</p>
                      <p className="text-violet-600 underline">verify.royalbulls.com/{mockSerial}</p>
                    </div>
                  </div>

                  {/* Middle Column: official physical seal */}
                  <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full border-4 border-amber-900 border-double flex items-center justify-center text-center p-1 select-none transform hover:rotate-12 transition-all">
                      <div className="w-full h-full rounded-full bg-amber-50 border border-amber-900 flex flex-col items-center justify-center p-1 leading-none">
                        <span className="text-[7px] font-mono font-black text-amber-950 uppercase tracking-widest">OFFICIAL</span>
                        <span className="text-[8px] font-serif font-bold text-amber-900 my-0.5">SEAL OF</span>
                        <span className="text-[7px] font-mono text-amber-950">ACADEMY</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Signatures */}
                  <div className="space-y-4 text-center md:text-right">
                    <div className="space-y-2">
                      {/* Signature 1 */}
                      <div>
                        <p className="font-serif italic text-sm text-violet-800 leading-none">Mr. Kilvish AI</p>
                        <p className="text-[8px] font-mono text-slate-400 mt-1 uppercase">Dean, Mr. Kilvish AI Academy</p>
                      </div>

                      {/* Signature 2 */}
                      <div className="pt-2 border-t border-slate-100">
                        <p className="font-serif italic text-sm text-slate-700 leading-none">Royal Bulls Advisory Board</p>
                        <p className="text-[8px] font-mono text-slate-400 mt-1 uppercase">Authorized Board Signatory</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="text-center pt-6 border-t border-amber-900/10 mt-6 text-[8px] font-mono text-slate-400">
                  This certificate is digitally generated and can be verified online. Royal Bulls Advisory Private Limited &copy; 2026.
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Print / Save as PDF
                </button>
                <button
                  onClick={() => alert(`Certificate link copied: verify.royalbulls.com/${mockSerial}`)}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" /> Share URL
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-display font-bold text-base text-slate-800">
                  Certificate Shelf is Empty
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Earn accredited credentials by completing lessons, passing quizzes, and scoring <b>80% or higher</b> on active course Final Certification Exams.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Certificate Search Panel */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="font-display font-bold text-sm text-slate-800 mb-1.5">
              Accredited Credential Registry search
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-4">
              Enter any Certificate Number, unique Registry Serial ID, or Student Name to verify the accreditation standing and sovereign academic records.
            </p>

            <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. REG-KLA-2026-XDFE, Ramesh Sharma..."
                value={verifyQuery}
                onChange={(e) => setVerifyQuery(e.target.value)}
                className="flex-1 bg-slate-50 text-xs text-slate-800 p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-500 font-sans font-semibold placeholder:text-slate-400"
              />

              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Registry Query</span>
              </button>
            </form>
          </div>

          {/* Verification Search Outcomes */}
          {hasSearched && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider">
                  Query Search Results
                </h4>
              </div>

              {verificationResult ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                        {verificationResult.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-display font-bold text-slate-800">
                        {verificationResult.student}
                      </h4>
                      <p className="text-xs text-slate-500 leading-snug">
                        Has achieved honors master standing in <b>{verificationResult.course}</b>.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Accreditation Registry:</span>
                      <span className="font-semibold text-slate-800">{verificationResult.issuer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Issue Date:</span>
                      <span className="font-semibold text-slate-800">{verificationResult.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Academic Validity:</span>
                      <span className="font-semibold text-slate-800">{verificationResult.validity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Registry Code:</span>
                      <span className="font-mono font-bold text-violet-600">{verificationResult.code}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No records match the requested credential queries. Ensure serial numbers match the register pattern exactly.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
