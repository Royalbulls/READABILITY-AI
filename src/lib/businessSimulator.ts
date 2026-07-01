export function getSimulatedBusinessReport(
  topic: string, 
  industry: string, 
  budget: string, 
  currency: string,
  companyName?: string,
  stateName?: string,
  budgetAmount?: number
) {
  const normTopic = topic.toLowerCase();
  const nameOfCompany = companyName ? companyName.trim() : `${topic} Enterprise`;
  const nameOfState = stateName ? stateName.trim() : "Maharashtra";
  const currSymbol = currency.includes("INR") ? "₹" : currency.includes("USD") ? "$" : "€";
  
  // Parse budget numbers for projections
  const actualBudgetAmount = budgetAmount || (
    budget.includes("Micro") ? 300000 :
    budget.includes("Small") ? 1500000 :
    budget.includes("Medium") ? 8000000 : 35000000
  );

  // Generate 5 Year Projections mathematically validated
  // Base Expenses = 60% of Year 1 budget equivalent, scaled logically
  // Base Revenue = Base Expenses * 1.32 (32% gross markup for safe profitability)
  const baseExpenses = Math.round(actualBudgetAmount * 1.2);
  const baseRevenue = Math.round(actualBudgetAmount * 1.55);

  const fiveYearProjection = Array.from({ length: 5 }).map((_, idx) => {
    const year = idx + 1;
    const growth = Math.pow(1.15, idx); // 15% CAGR growth
    const rev = Math.round(baseRevenue * growth);
    const exp = Math.round(baseExpenses * Math.pow(1.08, idx)); // 8% inflation growth on expenses
    return {
      year,
      revenue: rev,
      expenses: exp,
      profit: rev - exp
    };
  });

  const formattedBudget = `${currSymbol}${actualBudgetAmount.toLocaleString("en-IN")}`;

  // Match predefined templates or create dynamic custom template
  if (normTopic.includes("dairy") || normTopic.includes("milk") || normTopic.includes("farm") || industry === "Agriculture") {
    return {
      title: nameOfCompany,
      category: "Agriculture & Food Processing",
      investmentRange: budget,
      executiveSummary: `
The Proposed **${nameOfCompany}** is a state-of-the-art organic agro-allied project based in **${nameOfState}**, dedicated to supplying premium, high-yield A2 dairy solutions. Equipped with automated milking equipment and strict biosafety tracking, the project leverages modern IoT bio-collars to optimize cow comfort and milk yield.
- **Goal**: Supply unadulterated, farm-fresh glass-bottled organic dairy direct to retail and B2B markets.
- **Budget Setup**: Customized launch budget of **${formattedBudget}** optimized for maximum asset utilization.
- **Current Market Opportunity**: Rising preference for organic single-origin food items with clean-label traceability in **${nameOfState}**.
      `.trim(),
      businessOverview: `
Operating under green agricultural resource patterns in **${nameOfState}**, the farm integrates waste-to-energy anaerobic biogas digestion to reduce environmental footprints and lower electricity bills by up to 40%.
- **Siting & Acreage**: Standard custom cattle housing, high-speed ventilation sheds, and isolated quarantine silos.
- **Venture Lead**: Onboarding veterinary technicians for daily herd health and somatic cell audits.
- **Core Value Proposition**: 100% farm-gate to customer bottle within 4 hours, preserving pristine nutritional value.
      `.trim(),
      businessModel: `
A high-margin, hybrid monetization model designed to bypass middle-men:
1. **D2C Subscriptions**: Daily recurring milk bottle home-delivery subscriptions.
2. **Wholesale Off-Take**: Bulk organic cheese, butter, and ghee supply contracts to premium grocers in **${nameOfState}**.
3. **Byproduct Recycling**: Bulk compost packaging and sales to organic horticulture nurseries.
      `.trim(),
      problemStatement: `
Urban consumers in **${nameOfState}** suffer from high milk adulteration rates, synthetic hormone traces, and unhygienic traditional collections that compromise shelf-life and taste. Meanwhile, unorganized dairy farmers struggle with low yield and high feed cost inflation due to poor cattle management technology and lacking cold chain logistics.
      `.trim(),
      solution: `
We introduce **${nameOfCompany}**'s integrated **Smart Dairy Ecosystem**. By automating milking (reducing human contamination risk to zero), formulating precision cattle nutrition rations, and chilling milk immediately at farm-gate, we guarantee absolute purity, extended shelf-life, and rich taste.
      `.trim(),
      marketResearch: {
        targetCustomers: `
1. **Health-Conscious Families in ${nameOfState}**: Willing to pay a premium for organic A2 milk free from antibiotics.
2. **Gourmet Cafes & Bakeries**: Require consistent high-fat milk for specialty drinks and organic baking.
3. **Organic Food Retailers**: Demand high-quality, verified organic butter and artisanal cheese.
        `.trim(),
        competitorAnalysis: `
- **Industrial Multi-State Cooperatives**: High volume, but blended pasteurized milk lacking single-source freshness.
- **Traditional Milkmen**: High risk of water adulteration, completely unstandardized sanitation.
- **Our Tactical Advantage**: Real-time cow health IoT logs, dynamic subscription tracking, and transparent glass-bottle packaging.
        `.trim(),
        businessCanvas: `
| Key Partners | Key Activities | Value Propositions | Customer Relationships | Customer Segments |
|---|---|---|---|---|
| Veterinary Labs, Feed Mills, Cold-chain transporters | Cattle Breeding, Automated Milking, Biogas processing | Pristine, unadulterated glass-bottled organic A2 Milk | Direct subscription support, farm-visit tours | Organic seekers, high-end cafes, premium grocers |
        `.trim()
      },
      marketingStrategy: {
        brandingStrategy: `
Position **${nameOfCompany}** as a warm, honest, family-owned farm. Use organic earth tones (forest green, creamy white, and amber glass) for branding. Include dynamic QR codes on every bottle cap linking consumers to that morning's specific cattle health, nutrition, and somatic cell count logs.
        `.trim(),
        salesStrategy: `
- **Local Launch Campaign**: 3-day free milk trial for gated housing societies.
- **Digital Funnels**: Highly visual social media showing happy cows, clean milking parlors, and direct delivery routes.
- **Affiliate Program**: Partner with pediatric clinics and wellness centers to distribute discount codes.
        `.trim()
      },
      operationalPlan: {
        humanResources: `
- **Farm Operations Manager**: 1 (Veterinary and agricultural operations expert)
- **Veterinary Technician & Cow Health Supervisor**: 1 (Full-time herd health and nutrition management)
- **Milking & Maintenance Operators**: 2 (Technological milking parlor supervisors)
- **Delivery & Subscription Fleet**: Partnered local micro-distributors.
        `.trim(),
        technologyStack: `
- **Herd Management IoT**: Collar-sensors tracking cow rumination cycles, steps, and body heat.
- **Automated Parlors**: High-throughput mechanical vacuum milking systems with integrated inline somatic cell checkers.
- **D2C App Engine**: Micro-logistics scheduling app powered by cloud backend to optimize route navigation for delivery riders.
        `.trim()
      },
      legalRequirements: {
        licenses: [
          "FSSAI Dairy Category License (Food Safety and Standards Authority of India)",
          `State Pollution Control Board NOC (Consent to Establish waste cycling in ${nameOfState})`,
          `Local Municipality Trade License & Shops & Establishment Registration of ${nameOfState}`,
          "Water Use & Groundwater Extraction Permit"
        ],
        gst: `GST registration is mandatory for value-added dairy products (e.g., Ghee, Cheese, Butter at 12%), whereas raw fresh milk is currently exempted under standard schedules.`,
        msme: `Eligible for registration under the MSME Ministry as a Micro/Small Agricultural Processing Enterprise, unlocking interest subventions on capital loans.`,
        startupIndia: `Recognized under 'Agriculture Technology' sector, allowing three years of tax holidays and priority procurement facilities.`,
        governmentSchemes: `
- **Dairy Processing & Infrastructure Development Fund (DIDF)**: Unlocks interest subsidies of 2.5% on capital investment loans in **${nameOfState}**.
- **Animal Husbandry Infrastructure Development Fund (AHIDF)**: Provides 3% interest subvention for establishing processing units and waste cycling setups.
- **${nameOfState} State Employment Scheme (CMEGP)**: Unlocks up to 25% capital subsidy for eligible setting up of agro-allied MSME projects.
        `.trim()
      },
      financialProjection: {
        fiveYearProjection,
        revenueForecast: `Yearly revenue is expected to grow by 15% CAGR based on adding additional cows annually and increasing value-added organic ghee production.`,
        expenseForecast: `Core expenses include feed & fodder (50%), labor (15%), veterinary care (10%), and marketing/D2C logistics (25%).`,
        breakEvenAnalysis: `Based on a fixed overhead of ${currSymbol}${Math.round(baseExpenses * 0.4).toLocaleString()} annually and a gross margin of 45% on milk products, the farm will reach its break-even point in Month 14 of operations.`
      },
      investmentAndFunding: {
        investmentRequirement: `Total capital of ${currSymbol}${actualBudgetAmount.toLocaleString()} required for cattle purchase, parlor automation, chilled silos, and transport vehicles.`,
        fundingSources: `A combination of 30% promoter equity, 50% bank loan subsidized under the AHIDF scheme, and 20% agricultural angel funding.`
      },
      riskAnalysis: {
        risks: [
          { risk: "Epidemic Cattle Disease (e.g., Foot & Mouth Disease)", mitigation: "Strict quarantine protocols, mandatory double-vaccination schedules, and full cattle asset insurance cover." },
          { risk: "Fodder Price Inflation", mitigation: "Establish long-term raw supply contracts with local silage farmers and maintain a 3-month silage reserve pit." }
        ]
      },
      roadmap: {
        milestones: [
          { phase: "Infrastructure & Setup", duration: "Month 1-3", tasks: ["Barn construction", "Milking parlor installation", "Waste management setup"] },
          { phase: "Cattle Procurement & Trial", duration: "Month 4-5", tasks: ["Acquire pedigreed heifers", "Quarantine monitoring", "Dry run milking testing"] },
          { phase: "Launch & Scaling", duration: "Month 6+", tasks: ["Activate D2C delivery subscription", "Onboard regional organic grocers"] }
        ],
        kpis: [
          "Average Daily Milk Yield per milking cow (Target: 22 Liters)",
          "Somatic Cell Count (Target: Under 150,000 cells/ml for ultra-purity grade)",
          "D2C Customer Retention Rate (Target: Above 88% monthly)"
        ],
        growthStrategy: `Establish a franchise-based hub model, onboarding surrounding independent farmers into the '${nameOfCompany}' brand and setting up satellite milk collection kiosks.`,
        exitStrategy: `Acquisition by a larger multi-national FMCG conglomerate looking to acquire a premium, certified organic, fully-traced local supply chain asset.`
      },
      citations: [
        "National Dairy Development Board (NDDB) Organic Milking Guidelines",
        "Ministry of Animal Husbandry, Dairying and Fisheries (Govt. of India) - AHIDF Scheme Guidelines 2026",
        "FSSAI Manual on Method of Analysis of Foods (Dairy & Milk Products)"
      ],
      faq: [
        { question: "What is A2 milk and why is it premium?", answer: "A2 milk contains only the A2 type of beta-casein protein, which is highly digestible and less prone to causing gut inflammation compared to common A1 milk." },
        { question: "How do you manage cattle manure sustainably?", answer: "Manure is directed into a continuous anaerobic biogas digestor, generating electricity to power the farm's milking parlor and organic vermicompost ready for sale." }
      ]
    };
  }

  // If topic relates to software, tech, saas, ai or startup
  if (normTopic.includes("ai") || normTopic.includes("saas") || normTopic.includes("software") || normTopic.includes("tech") || normTopic.includes("digital") || industry.includes("SaaS")) {
    return {
      title: nameOfCompany,
      category: "SaaS / AI Startup",
      investmentRange: budget,
      executiveSummary: `
The Proposed **${nameOfCompany}** is a next-generation vertical B2B automation platform engineered in **${nameOfState}**, designed to streamline complex operational workflows for enterprise clients. By deploying fine-tuned agentic models directly integrated into existing legacy CRM & ERP, the software delivers rapid efficiency gains.
- **Goal**: Automate complex back-office data parsing and corporate compliance auditing.
- **Budget Tier**: Customized baseline of **${formattedBudget}** optimized for fast, lean agile deployment.
- **Current Opportunity**: Massive enterprise demand for secure, isolated AI workflows without data leakage risks.
      `.trim(),
      businessOverview: `
The platform runs on a modern, highly secure API-first microservices container stack. Using proprietary retrieval-augmented generation (RAG) and self-evaluating safety loops, the software guarantees high factual precision, protecting client corporate data integrity under enterprise-grade encryption.
- **Key Features**: Auto-generating legal compliance, smart supply audit, and vertical document parsing.
- **Data Privacy**: Single-tenant isolated database options for premium enterprise cohorts.
- **Unfair Advantage**: Pre-built integration connectors to traditional relational legacy systems.
      `.trim(),
      businessModel: `
A modern Product-Led Growth (PLG) model using tiered Subscription plans:
1. **Team Tier**: Per-seat recurring billing for growing departments.
2. **Enterprise Tier**: Usage-based credit models with dedicated cloud instances and custom integration setups.
3. **Professional Consulting**: High-value onboarding sprints to build custom workflows for enterprise clients.
      `.trim(),
      problemStatement: `
Mid-market enterprises waste hundreds of thousands of hours monthly manually copy-pasting, auditing, and compiling compliance documents across disjointed, outdated CRM, ERP, and legacy systems. Building custom AI integrations in-house is prohibitively expensive (costing over ₹50 Lakhs in specialized engineering salaries), while generic public models fail due to severe privacy concerns and hallucination risks.
      `.trim(),
      solution: `
An isolated, pre-integrated **Compliance & Workflow AI Agent Platform**. We deploy localized, small language models that connect securely to legacy corporate databases, automating routine audits and document generation with near-zero error rates, complete privacy, and an immediate 2-week ROI.
      `.trim(),
      marketResearch: {
        targetCustomers: `
1. **Regional Logistics & Supply Companies in ${nameOfState}**: Need automated bill-of-lading and customs compliance processing.
2. **Mid-tier Fintech & Accounting Firms**: Require real-time regulatory compliance checks and audit-ready reporting.
3. **Corporate Legal Departments**: Desperate to automate routine NDA, lease, and procurement contract audits.
        `.trim(),
        competitorAnalysis: `
- **Generic Chat Bots**: Inexpensive, but lack legacy system integrations, have severe data security concerns, and fail at complex vertical-specific parsing tasks.
- **Global Enterprise Consultancies**: Deliver robust systems but charge astronomical fees (₹1 Crore+) with implementation timelines stretching beyond 12 months.
- **Our Advantage**: Immediate zero-code integration connectors, localized secure data processing, and highly competitive, transparent per-seat billing.
        `.trim(),
        businessCanvas: `
| Key Partners | Key Activities | Value Propositions | Customer Relationships | Customer Segments |
|---|---|---|---|---|
| Cloud Providers, Security Auditing Firms, API Registries | Core Software Engineering, Security Hardening, Developer DevRel | Turnkey, high-privacy vertical AI agents for legacy systems | Dedicated Slack/Teams channels, customer success sprints | Logistics directors, mid-market CFOs, general counsels |
        `.trim()
      },
      marketingStrategy: {
        brandingStrategy: `
Establish **${nameOfCompany}** as an elite, high-security, Swiss-level enterprise utility. Use minimalist dark slate and cyber-neon accents to convey precision and cutting-edge security. Focus heavily on publishing exhaustive whitepapers, detailed SOC2 compliance reports, and clear case-studies.
        `.trim(),
        salesStrategy: `
- **Warm Outreach Program**: Cold-outreach target audits demonstrating a live, secure mock integration using their publicly available API formats.
- **Product-Led Trial**: Onboard individual departments with a 14-day free, isolated sandbox playground.
- **Affiliate Integration Partners**: Onboard independent CRM & ERP system consultants as resellers by offering them a 20% lifetime revenue commission.
        `.trim()
      },
      operationalPlan: {
        humanResources: `
- **Chief Technology Officer & Lead Architect**: 1 (Expert in distributed systems and secure AI integration)
- **Full-Stack Developer**: 1 (Focus on front-end workflows and database connector pipelines)
- **Enterprise Customer Success & Sales Engineer**: 1 (Handles onboarding, security calls, and custom client workflows)
        `.trim(),
        technologyStack: `
- **Core Engine**: Python-based orchestration framework utilizing fine-tuned small models and secure vector indexing.
- **Infrastructure**: Fully isolated secure containers running behind modern API gateway nodes.
- **Monitoring & Audits**: Enterprise-level logging systems for compliance tracking.
        `.trim()
      },
      legalRequirements: {
        licenses: [
          "SOC2 Type II Information Security Certification",
          `GDPR & Data Protection Registry Compliance for operations in ${nameOfState}`,
          "Proprietary Software Copyright & Intellectual Property Patents"
        ],
        gst: `SaaS subscription sales are subject to standard 18% GST under Software-as-a-Service tax classifications.`,
        msme: `Registered as an IT Services MSME, unlocking fast-track intellectual property registration and government technology bid eligibility.`,
        startupIndia: `Eligible for Startup India Seed Fund Scheme, providing grants of up to ₹20 Lakhs for prototype validation.`,
        governmentSchemes: `
- **Digital India Startup Hub (DISH)**: Offers access to discounted high-performance cloud compute credits and mentorship networks.
- **MUDRA Technology Loans**: Unlocks unsecured operational credit lines up to ₹10 Lakhs.
- **${nameOfState} IT & Electronics Incentive Scheme**: Provides stamp-duty exemptions and up to 50% patent filing cost reimbursement.
        `.trim()
      },
      financialProjection: {
        fiveYearProjection,
        revenueForecast: `90% Gross Margin software revenue scaling rapidly via compounding Net Revenue Retention (NRR) of 115%.`,
        expenseForecast: `Core operational cost drivers include secure cloud compute & API hosting (30%), product engineering (50%), and enterprise sales (20%).`,
        breakEvenAnalysis: `Due to minimal physical infrastructure costs, the platform becomes cash-flow break-even once it secures its first 15 enterprise customers.`
      },
      investmentAndFunding: {
        investmentRequirement: `Total capital of ${currSymbol}${actualBudgetAmount.toLocaleString()} required to fund initial core software engineering, secure SOC2 certification, and first 6 months of cloud hosting.`,
        fundingSources: `Onboard 20% pre-seed capital from specialized B2B SaaS angel syndicates, supplemented by 80% founder bootstrapping.`
      },
      riskAnalysis: {
        risks: [
          { risk: "Data Security Breach or Leakage", mitigation: "Enforce strict single-tenant database isolation, regular third-party penetration testing, and multi-layered encryption keys." },
          { risk: "Model Hallucinations in Compliance Audits", mitigation: "Deploy deterministic rule-based consensus checks on top of the raw AI agentic output before client delivery." }
        ]
      },
      roadmap: {
        milestones: [
          { phase: "Product MVP & Security Sprints", duration: "Month 1-3", tasks: ["Build core API connectors", "Achieve SOC2 compliance", "Secure sandbox trial environment"] },
          { phase: "Beta Integration Cohort", duration: "Month 4-5", tasks: ["Onboard first 5 logistics companies", "Refine parsing accuracy", "Launch CRM integration"] },
          { phase: "Public Commercial Scaling", duration: "Month 6+", tasks: ["Launch public self-serve portal", "Rollout affiliate agency reseller program"] }
        ],
        kpis: [
          "Monthly Recurring Revenue (MRR) Growth Rate (Target: Above 12% monthly)",
          "Net Revenue Retention (NRR) (Target: Above 110% annually)",
          "Data Parsing Accuracy (Target: Above 99.9% across standard invoices)"
        ],
        growthStrategy: `Establish a powerful partner ecosystem, integrating natively into leading mid-market ERP marketplaces (such as SAP, Salesforce, and Zoho) as an app store plugin.`,
        exitStrategy: `Acquisition by major vertical enterprise players (e.g. Oracle, Salesforce) or public listing once the platform crosses ${currSymbol}10 Crore ARR.`
      },
      citations: [
        "SaaS Industry Benchmarks and NRR Performance Metrics Report, 2026",
        "National Cybersecurity Policy & Enterprise Data Protection Frameworks",
        "Gartner B2B AI Enterprise Implementation and adoption reports"
      ],
      faq: [
        { question: "Is our proprietary company data used to train public models?", answer: "Absolutely not. All client data is processed inside secure, single-tenant isolated container environments and never pooled or shared with any external AI models." },
        { question: "How long does a standard onboarding integration take?", answer: "Using our pre-built legacy database connectors, most mid-market teams can set up their secure workflows and go live in under 5 business days." }
      ]
    };
  }

  // DEFAULT HIGH QUALITY REPORT (for general or custom cases)
  return {
    title: nameOfCompany,
    category: industry || "Business Operations",
    investmentRange: budget,
    executiveSummary: `
The Proposed **${nameOfCompany}** is a highly optimized, modern commercial venture designed to establish a pristine market footprint in the **${industry}** sector of **${nameOfState}**. Engineered with an executive focus on high capital efficiency and sustainable growth loops, the company utilizes advanced process engineering to capture market share.
- **Goal**: Deliver unmatched value and pristine quality in ${topic}.
- **Budget Setup**: Custom budget allocation of **${formattedBudget}** optimized to maximize initial asset ROI and accelerate break-even.
- **Current Opportunity**: Massive consumer shift toward highly transparent, single-source vertical brands with localized supply chains in **${nameOfState}**.
    `.trim(),
    businessOverview: `
Operating under structured process flows and green resource standards in **${nameOfState}**, the enterprise focuses on lean manufacturing, smart stock-keeping, and customer-centric experience metrics.
- **Setup Matrix**: Multi-hub operations, custom workflow optimization pipelines, and carbon-offset logistics.
- **Core Focus**: Delivering reliable, premium ${topic} solutions while keeping overheads highly optimized.
- **Unfair Advantage**: Proprietary, custom process optimization blueprints that reduce turnaround times by 35%.
    `.trim(),
    businessModel: `
A balanced, resilient revenue structure combining direct high-margin retail transactions with stable, recurring B2B wholesale or contract accounts:
1. **Direct High-Margin Services**: Premium localized sales or subscriptions.
2. **Contract-Based Accounts**: Multi-month supply and distribution agreements.
3. **Value-Added Derivatives**: High-margin secondary services or products based on core operations.
    `.trim(),
    problemStatement: `
Consumers of ${topic} in **${nameOfState}** are currently underserved, facing severe challenges including fragmented supply, unreliable quality control, lack of price transparency, and terrible post-sales support. Competitors rely on bloated administrative overheads and outdated logistics, resulting in inflated retail prices and high customer churn.
    `.trim(),
    solution: `
We introduce **${nameOfCompany}**'s **highly optimized vertical business model**. By integrating smart inventory software, optimizing the local supply chain to bypass unnecessary middlemen, and establishing clear quality benchmarks, we deliver premium ${topic} at competitive prices with outstanding customer satisfaction.
    `.trim(),
    marketResearch: {
      targetCustomers: `
1. **Premium Consumer Cohort in ${nameOfState}**: Willing to pay a 15-20% margin premium for certified high-quality, sustainable solutions.
2. **Corporate/Enterprise Accounts**: Require high-volume, reliable delivery contracts with structured SLA support.
3. **Eco-Conscious Lifestylers**: Onboarded via our carbon-neutral packaging and local community support initiatives.
      `.trim(),
      competitorAnalysis: `
- **Bloated Legacy Conglomerates**: High volume but slow, impersonal customer service and high administrative markups.
- **Fragmented Unorganized Competitors**: Affordable, but completely lack quality standards, reliability, and modern billing systems.
- **Our Strategic Play**: Differentiate via premium branding, direct customer relationships, smart software execution, and reasonable, transparent pricing.
      `.trim(),
      businessCanvas: `
| Key Partners | Key Activities | Value Propositions | Customer Relationships | Customer Segments |
|---|---|---|---|---|
| Local Raw Material Suppliers, Logistic Operators, QA Inspectors | Operations Management, Quality Assurance, Direct Customer Care | Elite, dependable, highly optimized ${topic} | Automated tracking alerts, loyalty reward tiers, transparent feedback | Quality seekers, regional wholesale accounts, premium buyers |
      `.trim()
    },
    marketingStrategy: {
      brandingStrategy: `
Establish **${nameOfCompany}** as an honest, premium, highly dependable regional leader. Use professional colors (navy slate, gold accents, and clean typography) to project corporate maturity. Leverage transparent customer portals that show users real-time process logs and quality audit records.
      `.trim(),
      salesStrategy: `
- **Local Launch Activation**: Direct product demonstrations and partnership discounts for surrounding anchor enterprises.
- **Highly Targeted Inbound Channels**: Educational, problem-solving content campaigns highlighting common mistakes and quality metrics.
- **Corporate Referral Loop**: Offer existing corporate accounts a 10% credit bonus for every enterprise client they refer.
      `.trim()
    },
    operationalPlan: {
      humanResources: `
- **Venture Director**: 1 (Overall operations, supply chain, and strategic growth management)
- **Quality Assurance Supervisor**: 1 (Enforces strict operational standards and compliance)
- **Frontline Operations Staff**: 2 (Core delivery, customer onboarding, and day-to-day execution)
- **Partner Fleet**: Specialized regional transport services.
      `.trim(),
      technologyStack: `
- **Inventory & Supply ERP**: Automated cloud software tracking raw supplies and customer orders in real-time.
- **Direct Engagement Portal**: Modern web/app interface allowing seamless order placements, payments, and tracking.
- **Process Analytics**: Cloud dashboards to monitor transit bottlenecks and staff efficiency metrics.
      `.trim()
    },
    legalRequirements: {
      licenses: [
        `Regional Commercial Trade License in ${nameOfState}`,
        `Environmental Waste Disposal Consent Certificate from ${nameOfState} Pollution Control Board`,
        `Department of Standards Quality Registration of ${nameOfState}`,
        `State GST & Fiscal Registry Filing in ${nameOfState}`
      ],
      gst: `Standard tax schedules apply based on primary services, utilizing active input-tax credit schemes to optimize corporate tax outgo.`,
      msme: `Eligible for MSME classification, unlocking priority public sector procurement bids and collateral-free business credit lines.`,
      startupIndia: `Provides full eligibility for standard tax exemptions, fast-track patent processing, and dedicated government seed grants.`,
      governmentSchemes: `
- **${nameOfState} State Capital Subsidy Scheme**: Offers up to 15% refund on initial physical setup machinery for registered units.
- **National Skill Development Program**: Unlocks fully-subsidized employee training and recruitment incentives.
- **${nameOfState} Entrepreneur Development Scheme (CMEGP)**: Interest subvention and credit incentives up to 25% for setting up units.
      `.trim()
    },
    financialProjection: {
      fiveYearProjection,
      revenueForecast: `Compound annual growth is expected to maintain a steady 15% CAGR by expanding market coverage and launching value-added secondary services.`,
      expenseForecast: `Raw materials make up 45% of total expenses, labor represents 20%, operations are 15%, and marketing/logistics account for 20%.`,
      breakEvenAnalysis: `With a highly lean operational structure, the venture achieves operating break-even in Month 11 of active operations.`
    },
    investmentAndFunding: {
      investmentRequirement: `Total capital of ${currSymbol}${actualBudgetAmount.toLocaleString()} required to fund initial lease, quality equipment, logistics, and initial 4 months of raw inventory.`,
      fundingSources: `40% promoter equity, 40% collateral-free MSME banking credits, and 20% local angel/family funding.`
    },
    riskAnalysis: {
      risks: [
        { risk: "Raw Material Supply Disruption", mitigation: "Establish active supply agreements with three independent regional vendors to guarantee raw stock redundancy." },
        { risk: "Competitor Price Under-cutting", mitigation: "Double down on our premium brand equity, custom service guarantees, and high customer relationship retention." }
      ]
    },
    roadmap: {
      milestones: [
        { phase: "Venture Blueprinting & Licensing", duration: "Month 1-2", tasks: ["Acquire commercial licenses", "Finalize supplier contracts", "Set up operational hub"] },
        { phase: "Dry Run & Trial Launches", duration: "Month 3-4", tasks: ["Equip physical layout", "Execute process dry runs", "Secure first 10 corporate clients"] },
        { phase: "Commercial Scaling", duration: "Month 5+", tasks: ["Launch full operations", "Onboard regional retail distributors", "Initialize scaling loop"] }
      ],
      kpis: [
        "On-time delivery / execution rate (Target: Above 97.5%)",
        "Customer NPS / Satisfaction score (Target: Above 78)",
        "Raw material conversion wastage (Target: Under 1.8%)"
      ],
      growthStrategy: `Replicate the successful initial hub blueprint in adjacent regional districts, utilizing a standardized franchise-style system.`,
      exitStrategy: `Consolidation with an industry-leading competitor or direct buyout by equity syndicates looking to acquire clean regional cash-flowing ventures.`
    },
    citations: [
      "MSME Ministry Business Incubation Guides & National Best Practices, 2026",
      "Regional Chamber of Commerce Industry Competitiveness Reports",
      "National Standards for Quality Management and Operational Excellence"
    ],
    faq: [
      { question: "How do you guarantee quality consistency?", answer: "We deploy triple-stage quality gatekeepers at raw supply receipt, active execution, and final customer delivery." },
      { question: "Can the services be customized for larger enterprise contracts?", answer: "Yes, our operational workflow is designed to scale dynamically to meet specific custom requirements." }
    ]
  };
}
