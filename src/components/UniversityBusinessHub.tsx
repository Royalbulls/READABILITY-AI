import React, { useState, useEffect } from "react";
import { 
  Building, 
  TrendingUp, 
  Calculator, 
  ShieldCheck, 
  FileText, 
  DollarSign, 
  FileCheck, 
  Briefcase, 
  Percent, 
  PieChart, 
  Compass, 
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Info,
  CheckCircle,
  UserCheck
} from "lucide-react";

interface UniversityBusinessHubProps {
  currentCourse: any;
  studentName: string;
}

export default function UniversityBusinessHub({
  currentCourse,
  studentName
}: UniversityBusinessHubProps) {
  const [projectOutlay, setProjectOutlay] = useState<number>(2500000); // ₹25 Lakhs default
  const [promoterContribution, setPromoterContribution] = useState<number>(10); // 10% promoter contribution
  const [interestRate, setInterestRate] = useState<number>(9.5); // 9.5% SBI MSME loan interest
  const [loanTerm, setLoanTerm] = useState<number>(5); // 5 Years repayment
  const [hasCollateral, setHasCollateral] = useState<boolean>(true);
  const [annualRevenue, setAnnualRevenue] = useState<number>(12000000); // ₹1.2 Crore projected annual sales
  const [operatingExpenseRatio, setOperatingExpenseRatio] = useState<number>(65); // 65% opex

  const topic = currentCourse?.title || "AI and Technology Services";
  const isGstOrFinance = topic.toLowerCase().includes("gst") || topic.toLowerCase().includes("tax") || topic.toLowerCase().includes("finance") || topic.toLowerCase().includes("auditing");

  // Dynamic Financial Calculations
  const totalLoanRequested = Math.round(projectOutlay * (1 - promoterContribution / 100));
  
  // Equated Monthly Installment (EMI) Formula: [P x R x (1+R)^N]/[((1+R)^N)-1]
  const monthlyInterestRate = (interestRate / 12) / 100;
  const totalMonths = loanTerm * 12;
  const emiVal = totalLoanRequested > 0 
    ? Math.round((totalLoanRequested * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) / (Math.pow(1 + monthlyInterestRate, totalMonths) - 1))
    : 0;
  const annualEMIPayout = emiVal * 12;

  // Operating Calculations
  const opex = Math.round(annualRevenue * (operatingExpenseRatio / 100));
  const ebitda = annualRevenue - opex; // Operating Profit
  const depreciation = Math.round(projectOutlay * 0.15); // 15% depreciation block
  const interestPayoutYr1 = Math.round(totalLoanRequested * (interestRate / 100));
  const netProfitBeforeTax = ebitda - depreciation - interestPayoutYr1;
  const taxesPaid = Math.max(0, Math.round(netProfitBeforeTax * 0.25)); // 25% corporate tax slab
  const netProfitAfterTax = Math.max(0, netProfitBeforeTax - taxesPaid);

  // Cash Flow Calculations
  const cashInflowYr1 = netProfitAfterTax + depreciation; // Net cash generation
  
  // Debt Service Coverage Ratio (DSCR) = (Net Operating Profit + Depreciation) / (Interest + Principal Repayment)
  // Approximate principal repayment for Year 1
  const approximatePrincipalYr1 = Math.max(0, annualEMIPayout - interestPayoutYr1);
  const dscrVal = annualEMIPayout > 0 
    ? Number((cashInflowYr1 / annualEMIPayout).toFixed(2))
    : 0;

  // Break-Even Analysis
  // Fixed costs: Interest + Depreciation + 30% of Opex
  const fixedCosts = interestPayoutYr1 + depreciation + Math.round(opex * 0.3);
  const variableCosts = Math.round(opex * 0.7);
  const contributionMarginRatio = annualRevenue > 0 
    ? (annualRevenue - variableCosts) / annualRevenue 
    : 0;
  const breakEvenSales = contributionMarginRatio > 0 
    ? Math.round(fixedCosts / contributionMarginRatio) 
    : 0;

  // Loan Approval Readiness Score Calculation
  let readinessScore = 50;
  if (dscrVal >= 1.5) readinessScore += 15;
  else if (dscrVal >= 1.2) readinessScore += 5;
  else readinessScore -= 15; // low DSCR hurts approval score

  if (hasCollateral) readinessScore += 15;
  if (promoterContribution >= 20) readinessScore += 10;
  else if (promoterContribution < 10) readinessScore -= 5;

  if (isGstOrFinance) readinessScore += 10; // extra trust score for tax certified candidates

  // Clamp readiness score
  readinessScore = Math.max(10, Math.min(100, readinessScore));

  // Determine Government Scheme Matching
  const getSchemeMatches = () => {
    const matches = [];
    if (projectOutlay <= 5000000) {
      matches.push({
        name: "Prime Minister's Employment Generation Programme (PMEGP)",
        subsidy: "15% to 35% Capital Subsidy",
        description: "Excellent fit for manufacturing and service ventures under ₹50 Lakhs project outlay.",
        suitability: "High Match (95%)"
      });
    }
    if (projectOutlay <= 1000000) {
      matches.push({
        name: "Pradhan Mantri MUDRA Yojana (PMMY)",
        subsidy: "Collateral-Free Tarun Category Loan",
        description: "Best for business growth loans up to ₹10 Lakhs with low interest slabs.",
        suitability: "High Match (90%)"
      });
    }
    if (!hasCollateral && projectOutlay <= 50000000) {
      matches.push({
        name: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
        subsidy: "Collateral-Free Guarantee Coverage",
        description: "Trust covers default risk up to 85% for micro enterprise loans, bypassing standard collateral terms.",
        suitability: "Perfect Fit (100%)"
      });
    }
    if (matches.length === 0) {
      matches.push({
        name: "SIDBI Make in India Soft Loan Fund (SMILE)",
        subsidy: "Competitive soft interest loan with 3-year moratorium",
        description: "Appropriate for industrial MSME expansions exceeding standard corporate loan sizes.",
        suitability: "Moderate Match (75%)"
      });
    }
    return matches;
  };

  const schemeMatches = getSchemeMatches();

  // Dynamic Review Letters
  const getCAReviewText = () => {
    if (dscrVal < 1.1) {
      return `We have analyzed the proposed dynamic financials for '${topic}'. Under standard ICAI auditing protocols, the projected DSCR of ${dscrVal} is critical. It implies that your net operating cash flows are insufficient to reliably service your annual EMI obligations of ₹${(annualEMIPayout / 100000).toFixed(2)} Lakhs. We recommend lowering the project outlay or extending the loan tenure.`;
    }
    return `On behalf of Royal Bulls Advisory, we have vetted the 3-year CMA projections. The computed DSCR stands at a robust ${dscrVal}, reflecting a healthy cash-to-debt service index. Depreciations are mapped on the standard 15% Written Down Value (WDV) block. The business model is highly viable and fully recommended for immediate debt syndication.`;
  };

  const getBankManagerReviewText = () => {
    if (readinessScore >= 80) {
      return `RECOGNIZED FOR FAST-TRACK PRE-APPROVAL. The credit profile satisfies RBI's priority sector lending criteria perfectly. Strong promoter participation (${promoterContribution}%) paired with ${hasCollateral ? "collateral security" : "CGTMSE coverage matching"} ensures risk mitigation. Approved in-principle under Mudra/PMEGP scheme schedules.`;
    } else if (readinessScore >= 60) {
      return `CONDITIONALLY ACCEPTED. The financial structure is conceptually sound (DSCR: ${dscrVal}). However, credit officers require additional documentation, including a signed MSME Udyam certificate and verified ITR proofs of the promoter before final sanctioning.`;
    } else {
      return `HOLD / HIGHER COLLATERAL REQUESTED. The Debt Service Coverage Ratio (${dscrVal}) or collateral security is currently below commercial banking comfort bands. Please revise CMA inputs, reduce total debt reliance, or provide additional commercial security parameters.`;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-8 animate-fadeIn">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-200 text-amber-900 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5 text-amber-800" />
            Accredited Business & Banking Simulator
          </div>
          <h2 className="text-xl font-display font-black text-slate-800 leading-tight">
            Enterprise Feasibility & Project Report Engine
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Dynamic CMA Data, Detailed Project Report (DPR), and Credit Risk Assessment mapped for <b>{topic}</b>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">Applicant:</span>
          <span className="text-xs font-mono font-bold bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1 rounded-xl">
            {studentName || "Ramesh Kumar Sharma"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Interactive Variables Controller */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-5 rounded-3xl space-y-5">
          <h3 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200/50 pb-2.5">
            <Calculator className="w-4.5 h-4.5 text-violet-600" />
            Financial Model Input variables
          </h3>

          <div className="space-y-4 text-xs">
            {/* Outlay */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Total Project Outlay</span>
                <span className="font-mono font-bold text-slate-800">₹{(projectOutlay / 100000).toFixed(2)} Lakhs</span>
              </div>
              <input 
                type="range" 
                min={500000} 
                max={5000000} 
                step={100000}
                value={projectOutlay} 
                onChange={(e) => setProjectOutlay(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Contribution */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Promoter's Equity Contribution</span>
                <span className="font-mono font-bold text-slate-800">{promoterContribution}% (₹{(projectOutlay * promoterContribution / 100 / 100000).toFixed(2)} L)</span>
              </div>
              <input 
                type="range" 
                min={5} 
                max={40} 
                step={5}
                value={promoterContribution} 
                onChange={(e) => setPromoterContribution(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Interest */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">SBI MSME Base Interest Rate</span>
                <span className="font-mono font-bold text-slate-800">{interestRate}% p.a.</span>
              </div>
              <input 
                type="range" 
                min={7.5} 
                max={15} 
                step={0.25}
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Repayment Term */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Loan Repayment Period</span>
                <span className="font-mono font-bold text-slate-800">{loanTerm} Years</span>
              </div>
              <input 
                type="range" 
                min={3} 
                max={10} 
                step={1}
                value={loanTerm} 
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Projected Revenue */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Projected Year-1 Annual Sales</span>
                <span className="font-mono font-bold text-slate-800">₹{(annualRevenue / 100000).toFixed(2)} Lakhs</span>
              </div>
              <input 
                type="range" 
                min={2000000} 
                max={30000000} 
                step={500000}
                value={annualRevenue} 
                onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Operating Expense Ratio */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Operating Expense Ratio</span>
                <span className="font-mono font-bold text-slate-800">{operatingExpenseRatio}% of sales</span>
              </div>
              <input 
                type="range" 
                min={40} 
                max={85} 
                step={5}
                value={operatingExpenseRatio} 
                onChange={(e) => setOperatingExpenseRatio(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Collateral Security Switch */}
            <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200/60 shadow-xs">
              <div>
                <span className="font-bold text-slate-700 block">Offer Physical Collateral</span>
                <span className="text-[10px] text-slate-400">e.g. Land, property security</span>
              </div>
              <input 
                type="checkbox" 
                checked={hasCollateral} 
                onChange={(e) => setHasCollateral(e.target.checked)}
                className="w-4.5 h-4.5 text-violet-600 border-slate-300 rounded cursor-pointer"
              />
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-[10px] text-slate-600 leading-normal flex gap-2">
              <Info className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <span>
                All ratios, tax projections, and loan readiness indexes update in real-time as you drag parameters!
              </span>
            </div>
          </div>
        </div>

        {/* Right Financial Reports and Appraisal Panel */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wide">Total Loan Needed</span>
              <span className="text-base font-display font-black text-slate-800">₹{(totalLoanRequested / 100000).toFixed(2)} L</span>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wide">Estimated Monthly EMI</span>
              <span className="text-base font-display font-black text-slate-800">₹{emiVal.toLocaleString("en-IN")}</span>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wide">DSCR Ratio Index</span>
              <span className={`text-base font-display font-black ${dscrVal >= 1.5 ? "text-emerald-600" : dscrVal >= 1.2 ? "text-amber-600" : "text-rose-600"}`}>{dscrVal}</span>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wide">Break-Even Sales</span>
              <span className="text-base font-display font-black text-indigo-700">₹{(breakEvenSales / 100000).toFixed(2)} L</span>
            </div>
          </div>

          {/* Interactive Report Cards */}
          <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            {/* Headers */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <h4 className="font-display font-bold text-xs text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                Credit Monitoring Arrangement (CMA) Projected Statements
              </h4>
            </div>

            <div className="p-6 bg-white space-y-6 text-xs">
              {/* Income and P&L Sheet */}
              <div className="space-y-3">
                <h5 className="font-display font-bold text-slate-700 border-b border-slate-100 pb-1 flex items-center justify-between">
                  <span>Part I: Projected Profitability Statements (Year 1)</span>
                  <span className="font-mono text-[10px] text-slate-400 uppercase">Values in INR</span>
                </h5>

                <div className="space-y-2 font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                    <span>1. Projected Annual Gross Revenues</span>
                    <span className="font-bold text-slate-800">₹{annualRevenue.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                    <span>2. Less: Projected Operating Expenditures (Opex)</span>
                    <span className="text-rose-600">-₹{opex.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 text-slate-800 font-bold bg-slate-50/50 px-2 rounded">
                    <span>3. Earnings Before Interest, Tax & Depreciation (EBITDA)</span>
                    <span>₹{ebitda.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                    <span>4. Less: Depreciation (15% on plant block)</span>
                    <span className="text-slate-500">-₹{depreciation.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                    <span>5. Less: Term Loan Interest Payout (SBI Rate)</span>
                    <span className="text-slate-500">-₹{interestPayoutYr1.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 text-slate-700 font-bold">
                    <span>6. Net Profit Before Taxes (PBT)</span>
                    <span className={netProfitBeforeTax >= 0 ? "text-slate-800" : "text-rose-600"}>₹{netProfitBeforeTax.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                    <span>7. Less: Corporate Slabs Income Tax (25% rate)</span>
                    <span className="text-slate-500">-₹{taxesPaid.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 text-emerald-700 font-bold bg-emerald-50/60 px-2 rounded">
                    <span>8. Net Profit After Tax (PAT) / Retained Surplus</span>
                    <span>₹{netProfitAfterTax.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* CMA Financial Ratios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Part II: Cash Flow & Debt Coverage */}
                <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h5 className="font-display font-bold text-slate-700 uppercase tracking-wide text-[10px] border-b border-slate-200 pb-1.5">
                    Debt Service Coverage Analysis
                  </h5>
                  <div className="space-y-1.5 font-mono text-[11px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Annual PAT Cash:</span>
                      <span className="font-bold">₹{netProfitAfterTax.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Add: Depreciation:</span>
                      <span className="font-bold">₹{depreciation.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1.5 text-slate-800 font-semibold">
                      <span>Total Cash Inflow:</span>
                      <span>₹{cashInflowYr1.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual EMI Payout:</span>
                      <span className="font-bold text-rose-600">₹{annualEMIPayout.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1.5 text-violet-700 font-bold">
                      <span>Resultant DSCR Index:</span>
                      <span>{dscrVal}</span>
                    </div>
                  </div>
                </div>

                {/* Part III: SWOT Analysis & Feasibility */}
                <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h5 className="font-display font-bold text-slate-700 uppercase tracking-wide text-[10px] border-b border-slate-200 pb-1.5">
                    SWOT & Operational Risk index
                  </h5>
                  <ul className="space-y-1.5 font-sans text-[11px] text-slate-600">
                    <li className="flex gap-1.5 items-start">
                      <span className="text-emerald-600 font-bold">S:</span>
                      <span>Low break-even point (<b>₹{(breakEvenSales / 100000).toFixed(2)} L</b> sales) mitigates early-stage volume risks.</span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <span className="text-amber-500 font-bold">W:</span>
                      <span>Heavy operational sensitivity on expense ratio (currently <b>{operatingExpenseRatio}%</b>).</span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <span className="text-indigo-600 font-bold">O:</span>
                      <span>Eligible for subsidized sovereign grants (Mudra / PMEGP) minimizing interest outlays.</span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <span className="text-rose-500 font-bold">T:</span>
                      <span>Collateral criteria required unless backed by Central CGTMSE guarantee schemes.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Appraisal and Approvals Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Government Schemes and Checklists */}
            <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <h4 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                  🏦 Matches Govt Schemes
                </h4>

                <div className="space-y-3 text-xs">
                  {schemeMatches.map((scheme, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 truncate block max-w-[200px]">{scheme.name}</span>
                        <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">{scheme.suitability}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold font-mono">{scheme.subsidy}</p>
                      <p className="text-[10px] text-slate-500 leading-normal">{scheme.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents Checklist */}
              <div className="space-y-2.5">
                <h5 className="font-display font-bold text-[11px] text-slate-400 uppercase tracking-wide">Required Document Checklist</h5>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-600">
                  <div className="flex gap-1.5 items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Aadhaar & PAN Proof</span>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>CA Audited CMA Data</span>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>MSME Udyam Registry</span>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Detailed Project Report</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Credit Risk & Ratings (CA & Bank Manager Reviews) */}
            <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-5">
              <div className="space-y-4">
                {/* Score Dial */}
                <div className="space-y-1.5 text-center">
                  <span className="text-[9px] font-mono font-bold text-indigo-300 block uppercase tracking-widest">Sovereign Debt Appraiser</span>
                  <p className="text-sm font-display font-bold text-slate-200">Loan Approval Readiness Index</p>
                  
                  <div className="relative inline-flex items-center justify-center mt-2">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" fill="transparent" stroke="#1e1b4b" strokeWidth="8" />
                      <circle cx="48" cy="48" r="40" fill="transparent" stroke="#6366f1" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * readinessScore) / 100} />
                    </svg>
                    <span className="absolute text-xl font-mono font-black text-white">{readinessScore}%</span>
                  </div>
                </div>

                {/* CA Advisory Stamp */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-amber-300 block uppercase tracking-wider flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> CA Vetting Certificate
                  </span>
                  <p className="text-[10px] text-slate-300 leading-normal italic font-sans border-l-2 border-amber-400 pl-2">
                    "{getCAReviewText().substring(0, 140)}..."
                  </p>
                </div>

                {/* Bank Manager Stamp */}
                <div className="space-y-1 pt-2 border-t border-white/10">
                  <span className="text-[9px] font-mono font-bold text-emerald-400 block uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Bank Credit Sanction Stand
                  </span>
                  <p className="text-[10px] text-slate-300 leading-normal italic font-sans border-l-2 border-emerald-400 pl-2">
                    "{getBankManagerReviewText().substring(0, 140)}..."
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-center">
                <span className="text-[9px] font-mono text-indigo-200">
                  Bulls Advisory Sovereign Syndicate &copy; 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
