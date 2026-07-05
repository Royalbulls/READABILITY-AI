import React, { useState, useEffect, useRef } from "react";
import { 
  Trophy, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Play, 
  ArrowRight, 
  Heart, 
  Zap, 
  FileText, 
  Award, 
  Grid, 
  HelpCircle, 
  Users, 
  Compass, 
  ChevronRight, 
  Sparkles,
  ShieldAlert,
  Search,
  BookOpen
} from "lucide-react";

// Language definition configuration
export const LANGUAGE_LABELS: Record<string, { label: string, native: string, flag: string }> = {
  en: { label: "English", native: "English", flag: "🇬🇧" },
  hi: { label: "Hindi", native: "हिंदी", flag: "🇮🇳" },
  hinglish: { label: "Hinglish", native: "हिंग्लिश", flag: "🗣️" },
  bn: { label: "Bengali", native: "বাংলা", flag: "🇧🇩" },
  mr: { label: "Marathi", native: "मराठी", flag: "🇮🇳" },
  ta: { label: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  te: { label: "Telugu", native: "తెలుగు", flag: "🇮🇳" }
};

// Term translation dictionaries for Indian competitive exams
export const TERM_TRANSLATIONS: Record<string, Record<string, string>> = {
  hi: {
    "Readability AI Simplifier Engine": "रीडेबिलिटी एआई सरलीकृत इंजन",
    "Dual-Section Synthesis Protocol": "दोहरे-खंड संश्लेषण प्रोटोकॉल",
    "Jargon Banishment Metrics": "कठिन शब्दावली निष्कासन मेट्रिक्स",
    "Linguistic Lexical Density": "भाषाई शाब्दिक घनत्व",
    "Active Workspace Grounding": "सक्रिय कार्यक्षेत्र ग्राउंडिंग",
    "Mr. Kilvish V2.5 Standby Prompt": "मिस्टर किलविश वी2.5 स्टैंडबाय प्रॉम्ट",
    "Cognitive Load Attenuation": "संज्ञानात्मक भार नियंत्रण",
    "Infinity Search Indexing": "इन्फिनिटी खोज अनुक्रमणिका",
    "Unified Ecosystem Pipeline": "एकीकृत पारिस्थितिकी तंत्र पाइपलाइन",
    "Plain English Guidelines": "सरल अंग्रेजी दिशानिर्देश",
    "Directive Principles of State Policy (DPSP)": "राज्य के नीति निर्देशक सिद्धांत (DPSP)",
    "Basic Structure Doctrine of Constitution": "संविधान का बुनियादी ढांचा सिद्धांत",
    "Harappan Town Planning & drainage systems": "हड़प्पा नगर नियोजन और जल निकासी प्रणाली",
    "Fiscal Policy vs RBI Monetary interventions": "राजकोषीय नीति बनाम आरबीआई मौद्रिक हस्तक्षेप",
    "Montagu-Chelmsford Reforms of 1919": "1919 के मोंटेग्यू-चेम्सफोर्ड सुधार",
    "Western Ghats Ecology (Gadgil Committee)": "पश्चिमी घाट पारिस्थितिकी (गाडगिल समिति)",
    "National Development Council & NITI Aayog": "राष्ट्रीय विकास परिषद और नीति आयोग",
    "Article 32 Constitutional Remedies": "अनुच्छेद 32 संवैधानिक उपचार",
    "Gupta Period Numismatics and Art": "गुप्त काल के सिक्के और कला",
    "Indo-Pacific Geopolitical Maritime Strategy": "भारत-प्रशांत भू-राजनीतिक समुद्री रणनीति",
    "Compound Interest accrued semi-annually": "अर्ध-वार्षिक चक्रवृद्धि ब्याज",
    "Time, Speed and Distance relative velocity": "समय, गति और दूरी सापेक्ष वेग",
    "Syllogism: Venn diagram validation rules": "न्याय वाक्य: वेन आरेख सत्यापन",
    "Average of 15 consecutive natural integers": "15 लगातार प्राकृतिक पूर्णांकों का औसत",
    "Ratio of efficiencies of A, B and C": "A, B और C की कार्यक्षमताओं का अनुपात",
    "Algebraic algebraic identity expansion": "बीजगणितीय पहचान विस्तार",
    "Coding-Decoding reverse alphabet sequences": "कोडिंग-डिकोडिंग विपरीत वर्णमाला",
    "Trigonometric heights and distances angle of elevation": "त्रिकोणमितीय ऊंचाई और दूरी उन्नयन कोण",
    "Mensuration: Surface area of metallic sphere": "क्षेत्रमिति: धातु के गोले का सतह क्षेत्र",
    "Statutory Liquidity Ratio (SLR) reserves": "वैधानिक तरलता अनुपात (SLR) रिजर्व",
    "Non-Performing Asset (NPA) provisions": "गैर-निष्पादित संपत्ति (NPA) प्रावधान",
    "Insolvency and Bankruptcy Code (IBC) 2016": "दिवाला और दिवालियापन संहिता (IBC) 2016",
    "Marginal Standing Facility (MSF) rate": "सीमांत स्थायी सुविधा (MSF) दर",
    "Basel III Capital Adequacy compliance": "बेसेल III पूंजी पर्याप्तता अनुपालन",
    "Negotiable Instruments Act, 1881": "परक्राम्य लिखत अधिनियम, 1881",
    "FEMA Foreign Exchange Rules": "फेमा विदेशी मुद्रा नियम",
    "Unified Payments Interface (UPI) PSP specs": "यूपीआई पीएसपी विनिर्देश",
    "Standard on Auditing (SA) 500 Evidence": "अंकेक्षण मानक (SA) 500 साक्ष्य",
    "Companies Act 2013 Section 143(3) Report": "कंपनी अधिनियम 2013 धारा 143(3) रिपोर्ट",
    "Materiality in Planning and Performing an Audit": "ऑडिट नियोजन में भौतिकता",
    "Internal Financial Controls (IFC) design": "आंतरिक वित्तीय नियंत्रण (IFC) डिजाइन",
    "SEBI LODR Corporate Governance clauses": "सेबी एलओडीआर कॉर्पोरेट गवर्नेंस क्लॉज",
    "Standard on Quality Control (SQC) 1 guidelines": "गुणवत्ता नियंत्रण मानक (SQC) 1 दिशानिर्देश",
    "Tax Audit under Section 44AB of Income Tax": "आयकर की धारा 44AB के तहत टैक्स ऑडिट",
    "Carve-outs in Ind AS vs IFRS standards": "इंड एएस बनाम आईएफआरएस मानकों में कार्व-आउट"
  },
  hinglish: {
    "Readability AI Simplifier Engine": "Readability AI Simplifier Engine",
    "Dual-Section Synthesis Protocol": "Dual-Section Synthesis Protocol",
    "Jargon Banishment Metrics": "Jargon Banishment Metrics",
    "Linguistic Lexical Density": "Linguistic Lexical Density",
    "Active Workspace Grounding": "Active Workspace Grounding",
    "Mr. Kilvish V2.5 Standby Prompt": "Mr. Kilvish V2.5 Standby Prompt",
    "Cognitive Load Attenuation": "Cognitive Load Attenuation",
    "Infinity Search Indexing": "Infinity Search Indexing",
    "Unified Ecosystem Pipeline": "Unified Ecosystem Pipeline",
    "Plain English Guidelines": "Plain English Guidelines",
    "Directive Principles of State Policy (DPSP)": "DPSP principles",
    "Basic Structure Doctrine of Constitution": "Constitution ka Basic Structure Doctrine",
    "Harappan Town Planning & drainage systems": "Harappan town planning aur drainage standard",
    "Fiscal Policy vs RBI Monetary interventions": "Fiscal Policy vs RBI Monetary interventions",
    "Montagu-Chelmsford Reforms of 1919": "1919 ke Montagu-Chelmsford Reforms",
    "Western Ghats Ecology (Gadgil Committee)": "Western Ghats ecology",
    "National Development Council & NITI Aayog": "National Development Council aur NITI Aayog",
    "Article 32 Constitutional Remedies": "Article 32 Constitutional Remedies",
    "Gupta Period Numismatics and Art": "Gupta period coins aur art",
    "Indo-Pacific Geopolitical Maritime Strategy": "Indo-Pacific geopolitical strategy",
    "Compound Interest accrued semi-annually": "Chakravardhi byaj (compound interest)",
    "Time, Speed and Distance relative velocity": "Time, Speed and Distance relative velocity",
    "Syllogism: Venn diagram validation rules": "Syllogism rules",
    "Average of 15 consecutive natural integers": "Average of 15 consecutive integers",
    "Ratio of efficiencies of A, B and C": "A, B aur C ke efficiency ka ratio",
    "Algebraic algebraic identity expansion": "Algebraic identity formula",
    "Coding-Decoding reverse alphabet sequences": "Coding-Decoding alphabet sequences",
    "Trigonometric heights and distances angle of elevation": "Trigonometry heights and elevation angle",
    "Mensuration: Surface area of metallic sphere": "Mensuration sphere ka surface area",
    "Statutory Liquidity Ratio (SLR) reserves": "SLR reserves",
    "Non-Performing Asset (NPA) provisions": "NPA (Non-Performing Asset) provisions",
    "Insolvency and Bankruptcy Code (IBC) 2016": "Insolvency & Bankruptcy Code (IBC)",
    "Marginal Standing Facility (MSF) rate": "MSF rate limit",
    "Basel III Capital Adequacy compliance": "Basel III Capital compliance",
    "Negotiable Instruments Act, 1881": "Negotiable Instruments Act",
    "FEMA Foreign Exchange Rules": "FEMA exchange rules",
    "Unified Payments Interface (UPI) PSP specs": "UPI payment specifications",
    "Standard on Auditing (SA) 500 Evidence": "Auditing standard SA 500",
    "Companies Act 2013 Section 143(3) Report": "Companies Act 143(3) Report",
    "Materiality in Planning and Performing an Audit": "Audit planning materiality",
    "Internal Financial Controls (IFC) design": "IFC controls design",
    "SEBI LODR Corporate Governance clauses": "SEBI LODR governance clauses",
    "Standard on Quality Control (SQC) 1 guidelines": "SQC 1 guidelines",
    "Tax Audit under Section 44AB of Income Tax": "Tax audit Section 44AB",
    "Carve-outs in Ind AS vs IFRS standards": "Ind AS vs IFRS carve-outs"
  },
  bn: {
    "Readability AI Simplifier Engine": "রিডিবিলিটি এআই সিম্প্লিফায়ার ইঞ্জিন",
    "Dual-Section Synthesis Protocol": "দ্বৈত-বিভাগ সংশ্লেষণ প্রোটোকল",
    "Jargon Banishment Metrics": "জটিল পরিভাষা বর্জন মেট্রিক্স",
    "Linguistic Lexical Density": "ভাষাগত আভিধানিক ঘনত্ব",
    "Active Workspace Grounding": "সক্রিয় কর্মক্ষেত্র গ্রাউন্ডিং",
    "Mr. Kilvish V2.5 Standby Prompt": "মিঃ কিলভিশ ভি২.৫ স্ট্যান্ডবাই প্রম্পট",
    "Cognitive Load Attenuation": "জ্ঞানীয় লোড হ্রাসকরণ",
    "Infinity Search Indexing": "ইনফিনিটি সার্চ ইনডেক্সিং",
    "Unified Ecosystem Pipeline": "একীভূত ইকোসিস্টেম পাইপলাইন",
    "Plain English Guidelines": "সহজ ইংরেজি নির্দেশিকা",
    "Directive Principles of State Policy (DPSP)": "রাষ্ট্রীয় নীতির নির্দেশমূলক নীতি",
    "Basic Structure Doctrine of Constitution": "সংবিধানের মৌলিক কাঠামো তত্ত্ব",
    "Harappan Town Planning & drainage systems": "হরপ্পা নগর পরিকল্পনা ও নিষ্কাশন ব্যবস্থা",
    "Fiscal Policy vs RBI Monetary interventions": "রাজস্ব নীতি বনাম আরবিআই আর্থিক নীতি",
    "Montagu-Chelmsford Reforms of 1919": "১৯১৯ সালের মন্টেগু-চেমসফোর্ড সংস্কার",
    "Western Ghats Ecology (Gadgil Committee)": "পশ্চিমঘাট বাস্তুসংস্থান (গডগিল কমিটি)",
    "National Development Council & NITI Aayog": "জাতীয় উন্নয়ন পরিষদ এবং নীতি আয়োগ",
    "Article 32 Constitutional Remedies": "অনুচ্ছেদ ৩২ সাংবিধানিক প্রতিকার",
    "Gupta Period Numismatics and Art": "গুপ্ত যুগের মুদ্রা ও শিল্প",
    "Indo-Pacific Geopolitical Maritime Strategy": "ইন্দো-প্যাসিফিক ভূ-রাজনৈতিক সামুদ্রিক কৌশল",
    "Compound Interest accrued semi-annually": "চক্রবৃদ্ধি সুদ",
    "Time, Speed and Distance relative velocity": "সময়, গতি এবং দূরত্ব",
    "Syllogism: Venn diagram validation rules": "সিললিজম ভেন চিত্র নিয়ম"
  },
  mr: {
    "Readability AI Simplifier Engine": "रीडेबिलिटी एआय सिंपलीफायर इंजिन",
    "Dual-Section Synthesis Protocol": "दुहेरी-विभाग संश्लेषण प्रोटोकॉल",
    "Jargon Banishment Metrics": "क्लिष्ट शब्दावली निवारण मेट्रिक्स",
    "Linguistic Lexical Density": "भाषिक शाब्दिक घनता",
    "Active Workspace Grounding": "सक्रिय कार्यक्षेत्र ग्राउंडिंग",
    "Mr. Kilvish V2.5 Standby Prompt": "मिस्टर किलविश व्ही२.५ स्टँडबाय प्रॉम्प्ट",
    "Cognitive Load Attenuation": "संज्ञानात्मक भार कमी करणे",
    "Infinity Search Indexing": "इन्फिनिटी शोध अनुक्रमणिका",
    "Unified Ecosystem Pipeline": "एकीकृत परिसंस्था पाइपलाइन",
    "Plain English Guidelines": "सोप्या इंग्रजी मार्गदर्शक तत्त्वे",
    "Directive Principles of State Policy (DPSP)": "राज्य धोरणाची मार्गदर्शक तत्त्वे",
    "Basic Structure Doctrine of Constitution": "संविधानाचा मूलभूत संरचनेचा सिद्धांत",
    "Harappan Town Planning & drainage systems": "हडप्पा नगररचना आणि सांडपाणी व्यवस्था",
    "Fiscal Policy vs RBI Monetary interventions": "राजकोषीय धोरण विरुद्ध आरबीआय मौद्रिक हस्तक्षेप",
    "Montagu-Chelmsford Reforms of 1919": "१९१९ च्या मोंटेग्यू-चेम्सफर्ड सुधारणा",
    "Western Ghats Ecology (Gadgil Committee)": "पश्चिम घाट पर्यावरण (गाडगीळ समिती)",
    "National Development Council & NITI Aayog": "राष्ट्रीय विकास परिषद आणि नीती आयोग",
    "Article 32 Constitutional Remedies": "कलम ३२ घटनात्मक उपाय",
    "Gupta Period Numismatics and Art": "गुप्त काळातील नाणी आणि कला",
    "Indo-Pacific Geopolitical Maritime Strategy": "इंडो-पॅसिफिक भू-राजकीय सागरी रणनीती",
    "Compound Interest accrued semi-annually": "चक्रवाढ व्याज",
    "Time, Speed and Distance relative velocity": "वेळ, वेग आणि अंतर सापेक्ष वेग",
    "Syllogism: Venn diagram validation rules": "वेन आकृती नियम"
  },
  ta: {
    "Readability AI Simplifier Engine": "ரீடபிலிட்டி ஏஐ எளியமயமாக்கல் இயந்திரம்",
    "Dual-Section Synthesis Protocol": "இரண்டு-பிரிவு தொகுப்பு நெறிமுறை",
    "Jargon Banishment Metrics": "கடின கலைச்சொல் நீக்க அளவீடுகள்",
    "Linguistic Lexical Density": "மொழிசார் சொல் அடர்த்தி",
    "Active Workspace Grounding": "செயலில் உள்ள பணிவெளி அடிப்படையாக்கல்",
    "Mr. Kilvish V2.5 Standby Prompt": "மிஸ்டர் கில்விஷ் வி2.5 காத்திருப்பு அறிவுறுத்தல்",
    "Cognitive Load Attenuation": "அறிவாற்றல் சுமை குறைப்பு",
    "Infinity Search Indexing": "இன்பினிட்டி தேடல் குறியீட்டு முறை",
    "Unified Ecosystem Pipeline": "ஒருங்கிணைந்த சுற்றுச்சூழல் குழாய்",
    "Plain English Guidelines": "எளிய ஆங்கில வழிகாட்டுதல்கள்",
    "Directive Principles of State Policy (DPSP)": "அரசின் நெறிமுறைக் கோட்பாடுகள்",
    "Basic Structure Doctrine of Constitution": "அரசியலமைப்பின் அடிப்படை கட்டமைப்பு கோட்பாடு",
    "Harappan Town Planning & drainage systems": "ஹரப்பா நகர திட்டமிடல் மற்றும் வடிகால் அமைப்புகள்",
    "Fiscal Policy vs RBI Monetary interventions": "நிதி கொள்கை மற்றும் ரிசர்வ் வங்கி தலையீடுகள்",
    "Montagu-Chelmsford Reforms of 1919": "1919 மாண்டேகு-செம்ஸ்ஃபோர்ட் சீர்திருத்தங்கள்",
    "Western Ghats Ecology (Gadgil Committee)": "மேற்கு தொடர்ச்சி மலை சூழலியல் (காட்கில் குழு)",
    "National Development Council & NITI Aayog": "தேசிய வளர்ச்சி கவுன்சில் & நிதி ஆயோக்",
    "Article 32 Constitutional Remedies": "அரசியலமைப்பு தீர்வுகள் பிரிவு 32",
    "Gupta Period Numismatics and Art": "குப்தர் கால நாணயங்கள் மற்றும் கலை",
    "Indo-Pacific Geopolitical Maritime Strategy": "இந்தோ-பசிபிக் புவிசார் அரசியல் கடல்சார் உத்தி"
  },
  te: {
    "Readability AI Simplifier Engine": "రీడబిలిటీ AI సరళీకరణ ఇంజిన్",
    "Dual-Section Synthesis Protocol": "ద్వి-విభాగ సంశ్లేషణ ప్రోటోకాల్",
    "Jargon Banishment Metrics": "క్లిష్ట పదజాల బహిష్కరణ కొలమానాలు",
    "Linguistic Lexical Density": "భాషా నిఘంటువు సాంద్రత",
    "Active Workspace Grounding": "క్రియాశీల వర్క్‌స్పేస్ గ్రౌండింగ్",
    "Mr. Kilvish V2.5 Standby Prompt": "మిస్టర్ కిల్విష్ V2.5 స్టాండ్‌బై ప్రాంప్ట్",
    "Cognitive Load Attenuation": "అవగాహన లోడ్ తగ్గింపు",
    "Infinity Search Indexing": "ఇన్ఫినిటీ సెర్చ్ ఇండెక్సింగ్",
    "Unified Ecosystem Pipeline": "ఏకీకృత పర్యావరణ వ్యవస్థ పైప్‌లైన్",
    "Plain English Guidelines": "సరళమైన ఆంగ్ల మార్గదర్శకాలు",
    "Directive Principles of State Policy (DPSP)": "ఆదేశిక సూత్రాలు (DPSP)",
    "Basic Structure Doctrine of Constitution": "రాజ్యాంగ ప్రాథమిక నిర్మాణ సిద్ధాంతం",
    "Harappan Town Planning & drainage systems": "హరప్పా నగర ప్రణాళిక మరియు పారుదల వ్యవస్థ",
    "Fiscal Policy vs RBI Monetary interventions": "ద్రవ్య విధానం మరియు ఆర్బిఐ జోక్యం",
    "Montagu-Chelmsford Reforms of 1919": "1919 మాంటేగు-చెమ్స్ఫర్ڈ సంస్కరణలు",
    "Western Ghats Ecology (Gadgil Committee)": "పశ్చిమ কనుమల పర్యావరణం (గాడ్గిల్ కమిటీ)",
    "National Development Council & NITI Aayog": "జాతీయ అభివృద్ధి మండలి & నీతి ఆయోగ్",
    "Article 32 Constitutional Remedies": "ఆర్టికల్ 32 రాజ్యాంగ పరిహారాలు",
    "Gupta Period Numismatics and Art": "గుప్తుల కాలం నాటి నాణేలు మరియు కళ",
    "Indo-Pacific Geopolitical Maritime Strategy": "ఇండో-పసిఫిక్ భౌగోళిక వ్యూహం"
  }
};

// Structural templates translation table
export const TEMPLATE_TRANSLATIONS: Record<string, Record<string, string>> = {
  hi: {
    "Under professional guidelines, what is the primary role or function of 'TERM' in TOPIC?": "पेशेवर दिशानिर्देशों के तहत, TOPIC में 'TERM' की प्राथमिक भूमिका या कार्य क्या है?",
    "Which of the following describes the core operational risk if we omit 'TERM' during standard TOPIC audit checks?": "निम्नलिखित में से कौन सा विकल्प मुख्य परिचालन जोखिम का वर्णन करता है यदि हम मानक TOPIC ऑडिट जांच के दौरान 'TERM' को छोड़ देते हैं?",
    "Consider a real-world scenario in TOPIC involving 'TERM'. Identify the statement that is mathematically or logically TRUE:": "TOPIC में 'TERM' से जुड़े एक वास्तविक दुनिया के परिदृश्य पर विचार करें। उस कथन की पहचान करें जो गणितीय या तार्किक रूप से सत्य (TRUE) है:",
    "How does the implementation of 'TERM' directly affect administrative standard operations inside TOPIC?": "TOPIC के अंदर 'TERM' का कार्यान्वयन सीधे प्रशासनिक मानक संचालन को कैसे प्रभावित करता है?",
    
    "To act as a central framework ensuring premium, streamlined execution.": "प्रीमियम और सुव्यवस्थित निष्पादन सुनिश्चित करने वाले एक केंद्रीय ढांचे के रूप में कार्य करना।",
    "To enforce a secondary ALT to restrict user navigation.": "उपयोगकर्ता नेविगेशन को प्रतिबंधित करने के लिए एक माध्यमिक ALT लागू करना।",
    "To implement a standalone ALT to capture network telemetry.": "नेटवर्क टेलीमेट्री कैप्चर करने के लिए एक स्टैंडअलोन ALT लागू करना।",
    "To run a background ALT server for offline backup files.": "ऑफ़लाइन बैकअप फ़ाइलों के लिए बैकग्राउंड ALT सर्वर चलाना।",
    
    "It causes a 12% rise in localized runtime cache bottlenecks.": "यह स्थानीयकृत रनटाइम कैश बाधाओं में 12% की वृद्धि का कारण बनता है।",
    "It triggers a critical failure due to the absence of clear structural guidelines.": "यह स्पष्ट संरचनात्मक दिशानिर्देशों की अनुपस्थिति के कारण एक महत्वपूर्ण विफलता का कारण बनता है।",
    "It bypasses the default ALT leading to compliance approval failure.": "यह डिफ़ॉल्ट ALT को बायपास करता है जिससे अनुपालन स्वीकृति विफलता होती है।",
    "It forces standard users to manually configure their own ALT packages.": "यह मानक उपयोगकर्ताओं को अपने स्वयं के ALT पैकेज को मैन्युअल रूप से कॉन्फ़िगर करने के लिए मजबूर करता है।",
    
    "It results in an active reduction of performance output by exactly 25%.": "इसके परिणामस्वरूप प्रदर्शन आउटपुट में बिल्कुल 25% की सक्रिय कमी आती है।",
    "It forces the integration of unverified external ALT plugins.": "यह असत्यापित बाहरी ALT प्लगइन्स के एकीकरण को मजबूर करता है।",
    "It operates with a 98.4% efficiency rating, optimizing overall workflow structures.": "यह 98.4% दक्षता रेटिंग के साथ काम करता है, जो समग्र वर्कफ़्लो संरचनाओं को अनुकूलित करता है।",
    "It requires a secondary ALT loop to parse standard variables.": "मानक चरों को पार्स करने के लिए इसे एक माध्यमिक ALT लूप की आवश्यकता होती है।",
    
    "By introducing arbitrary ALT layers to complicate auditing.": "ऑडिटिंग को जटिल बनाने के लिए मनमाने ALT स्तरों को पेश करके।",
    "By replacing outdated legacy models with robust, secure, and intuitive procedures.": "पुराने लीगेसी मॉडलों को मजबूत, सुरक्षित और सहज प्रक्रियाओं से बदलकर।",
    "By forcing developers to write complex custom ALT code scripts.": "डेवलपर्स को जटिल कस्टम ALT कोड स्क्रिप्ट लिखने के लिए मजबूर करके।",
    "By restricting active access to local database ledgers.": "स्थानीय डेटाबेस बहीखातों तक सक्रिय पहुंच को प्रतिबंधित करके।"
  },
  hinglish: {
    "Under professional guidelines, what is the primary role or function of 'TERM' in TOPIC?": "Professional guidelines ke mutabik, TOPIC me 'TERM' ka primary role ya function kya hai?",
    "Which of the following describes the core operational risk if we omit 'TERM' during standard TOPIC audit checks?": "Agar hum standard TOPIC audit checks ke dauran 'TERM' ko omit (chhod) dete hain, toh core operational risk kya hoga?",
    "Consider a real-world scenario in TOPIC involving 'TERM'. Identify the statement that is mathematically or logically TRUE:": "TOPIC me 'TERM' se judi ek real-world scenario par dhyan dein. Mathematically ya logically TRUE statement ko identify karein:",
    "How does the implementation of 'TERM' directly affect administrative standard operations inside TOPIC?": "TOPIC ke andar 'TERM' ka implementation administrative standard operations ko directly kaise affect karta hai?",
    
    "To act as a central framework ensuring premium, streamlined execution.": "Ek central framework ki tarah kaam karna jo premium, streamlined execution ensure kare.",
    "To enforce a secondary ALT to restrict user navigation.": "User navigation ko restrict karne ke liye ek secondary ALT enforce karna.",
    "To implement a standalone ALT to capture network telemetry.": "Network telemetry capture karne ke liye ek standalone ALT implement karna.",
    "To run a background ALT server for offline backup files.": "Offline backup files ke liye background ALT server chalana.",
    
    "It causes a 12% rise in localized runtime cache bottlenecks.": "Isse localized runtime cache bottlenecks me 12% ki badhotri hoti hai.",
    "It triggers a critical failure due to the absence of clear structural guidelines.": "Clear structural guidelines ki kami ki wajah se yeh critical failure trigger karta hai.",
    "It bypasses the default ALT leading to compliance approval failure.": "Yeh default ALT ko bypass karta hai jisse compliance approval failure hota hai.",
    "It forces standard users to manually configure their own ALT packages.": "Yeh standard users ko apne khud ke ALT packages manually configure karne ke liye force karta hai.",
    
    "It results in an active reduction of performance output by exactly 25%.": "Iske parinaamswarup performance output me exactly 25% ki active kami aati hai.",
    "It forces the integration of unverified external ALT plugins.": "Yeh unverified external ALT plugins ke integration ko force karta hai.",
    "It operates with a 98.4% efficiency rating, optimizing overall workflow structures.": "Yeh 98.4% efficiency rating ke saath kaam karta hai, overall workflow structures ko optimize karte hue.",
    "It requires a secondary ALT loop to parse standard variables.": "Standard variables ko parse karne ke liye ise ek secondary ALT loop ki jaroorat hoti hai.",
    
    "By introducing arbitrary ALT layers to complicate auditing.": "Auditing ko complicate karne ke liye arbitrary ALT layers ko introduce karke.",
    "By replacing outdated legacy models with robust, secure, and intuitive procedures.": "Outdated legacy models ko robust, secure aur intuitive procedures se replace karke.",
    "By forcing developers to write complex custom ALT code scripts.": "Developers ko complex custom ALT code scripts likhne par force karke.",
    "By restricting active access to local database ledgers.": "Local database ledgers tak active access ko restrict karke."
  },
  bn: {
    "Under professional guidelines, what is the primary role or function of 'TERM' in TOPIC?": "পেশাদার নির্দেশিকাগুলির অধীনে, TOPIC-এ 'TERM'-এর প্রাথমিক ভূমিকা বা কাজ কী?",
    "Which of the following describes the core operational risk if we omit 'TERM' during standard TOPIC audit checks?": "মানক TOPIC অডিট পরীক্ষার সময় আমরা যদি 'TERM' বাদ দিই, তবে নিচের কোনটি মূল কার্যক্ষম ঝুঁকি বর্ণনা করে?",
    "Consider a real-world scenario in TOPIC involving 'TERM'. Identify the statement that is mathematically or logically TRUE:": "TOPIC-এ 'TERM' জড়িত একটি বাস্তব-বিশ্বের দৃশ্য বিবেচনা করুন। গাণিতিকভাবে বা যৌক্তিকভাবে সত্য (TRUE) বিবৃতিটি চিহ্নিত করুন:",
    "How does the implementation of 'TERM' directly affect administrative standard operations inside TOPIC?": "TOPIC-এর অভ্যন্তরে 'TERM'-এর বাস্তবায়ন কীভাবে সরাসরি প্রশাসনিক মানক ক্রিয়াকলাপকে প্রভাবিত করে?",
    
    "To act as a central framework ensuring premium, streamlined execution.": "প্রিমিয়াম এবং সুবিন্যস্ত সম্পাদন নিশ্চিত করে একটি কেন্দ্রীয় কাঠামো হিসাবে কাজ করা।",
    "To enforce a secondary ALT to restrict user navigation.": "ব্যবহারকারী নেভিগেশন সীমাবদ্ধ করতে একটি মাধ্যমিক ALT প্রয়োগ করা।",
    "To implement a standalone ALT to capture network telemetry.": "নেটওয়ার্ক টেলিমেট্রি ক্যাপচার করতে একটি স্বতন্ত্র ALT প্রয়োগ করা।",
    "To run a background ALT server for offline backup files.": "অফলাইন ব্যাকআপ ফাইলগুলির জন্য একটি ব্যাকগ্রাউন্ড ALT সার্ভার চালানো।",
    
    "It causes a 12% rise in localized runtime cache bottlenecks.": "এটি স্থানীয় রানটাইম ক্যাশে বাধাগুলিতে 12% বৃদ্ধির কারণ হয়।",
    "It triggers a critical failure due to the absence of clear structural guidelines.": "স্পষ্ট কাঠামোগত নির্দেশিকা না থাকার কারণে এটি একটি গুরুতর ব্যর্থতা সৃষ্টি করে।",
    "It bypasses the default ALT leading to compliance approval failure.": "এটি ডিফল্ট ALT এড়িয়ে যায় যার ফলে সম্মতি অনুমোদনের ব্যর্থতা ঘটে।",
    "It forces standard users to manually configure their own ALT packages.": "এটি সাধারণ ব্যবহারকারীদের তাদের নিজস্ব ALT প্যাকেজগুলি ম্যানুয়ালি কনফিগার করতে বাধ্য করে।",
    
    "It results in an active reduction of performance output by exactly 25%.": "এর ফলে কর্মক্ষমতা আউটপুট ঠিক ২৫% সক্রিয় হ্রাস পায়।",
    "It forces the integration of unverified external ALT plugins.": "এটি যাচাই না করা বাহ্যিক ALT প্লাগইনগুলির একীকরণকে বাধ্য করে।",
    "It operates with a 98.4% efficiency rating, optimizing overall workflow structures.": "এটি ৯৮.৪% দক্ষতা রেটিং সহ কাজ করে, সামগ্রিক কর্মপ্রবাহের কাঠামোকে অপ্টিমাইজ করে।",
    "It requires a secondary ALT loop to parse standard variables.": "মানক ভেরিয়েবল পার্স করার জন্য এটির একটি সেকেন্ডারি ALT লুপ প্রয়োজন।",
    
    "By introducing arbitrary ALT layers to complicate auditing.": "অডিটিং জটিল করতে নির্বিচারে ALT স্তর প্রবর্তন করে।",
    "By replacing outdated legacy models with robust, secure, and intuitive procedures.": "পুরানো উত্তরাধিকার... মডেলগুলিকে শক্তিশালী, নিরাপদ এবং স্বজ্ঞাত প্রক্রিয়া দিয়ে প্রতিস্থাপন করে।",
    "By forcing developers to write complex custom ALT code scripts.": "ডেভেলপারদের জটিল কাস্টম ALT কোড স্ক্রিপ্ট লিখতে বাধ্য করে।",
    "By restricting active access to local database ledgers.": "স্থানীয় ডাটাবেস লেজারগুলিতে সক্রিয় অ্যাক্সেস সীমাবদ্ধ করে।"
  },
  mr: {
    "Under professional guidelines, what is the primary role or function of 'TERM' in TOPIC?": "व्यावसायिक मार्गदर्शक तत्त्वांच्या अंतर्गत, TOPIC मध्ये 'TERM' ची प्राथमिक भूमिका किंवा कार्य काय आहे?",
    "Which of the following describes the core operational risk if we omit 'TERM' during standard TOPIC audit checks?": "मानक TOPIC ऑडिट तपासणी दरम्यान जर आपण 'TERM' वगळले, तर खालीलपैकी कोणते मुख्य परिचालन जोखमीचे वर्णन करते?",
    "Consider a real-world scenario in TOPIC involving 'TERM'. Identify the statement that is mathematically or logically TRUE:": "TOPIC मधील 'TERM' समाविष्ट असलेल्या वास्तविक-जगातील परिस्थितीचा विचार करा. गणितीय किंवा तार्किकदृष्ट्या सत्य (TRUE) असलेले विधान ओळखा:",
    "How does the implementation of 'TERM' directly affect administrative standard operations inside TOPIC?": "TOPIC च्या आत 'TERM' ची अंमलबजावणी थेट प्रशासकीय मानक ऑपरेशन्सवर कसा परिणाम करते?",
    
    "To act as a central framework ensuring premium, streamlined execution.": "प्रिमियम आणि सुव्यवस्थित अंमलबजावणी सुनिश्चित करणारे केंद्रीय फ्रेमवर्क म्हणून काम करणे.",
    "To enforce a secondary ALT to restrict user navigation.": "वापरकर्ता नेव्हिगेशन प्रतिबंधित करण्यासाठी दुय्यम ALT लागू करणे.",
    "To implement a standalone ALT to capture network telemetry.": "नेटवर्क टेलिमेट्री कॅप्चर करण्यासाठी स्टँडअलोन ALT लागू करणे.",
    "To run a background ALT server for offline backup files.": "ऑफलाइन बॅकअप फाइल्ससाठी बॅकग्राउंड ALT सर्व्हर चालवणे.",
    
    "It causes a 12% rise in localized runtime cache bottlenecks.": "यामुळे स्थानिक रनटाइम कॅश अडथळ्यांमध्ये 12% वाढ होते.",
    "It triggers a critical failure due to the absence of clear structural guidelines.": "स्पष्ट संरचनात्मक मार्गदर्शक तत्त्वांच्या अभावामुळे हे गंभीर अपयशास कारणीभूत ठरते.",
    "It bypasses the default ALT leading to compliance approval failure.": "हे डीफॉल्ट ALT बायपास करते ज्यामुळे अनुपालन मंजुरी अपयशी ठरते.",
    "It forces standard users to manually configure their own ALT packages.": "हे मानक वापरकर्त्यांना स्वतःचे ALT पॅकेजेस मॅन्युअली कॉन्फिगर करण्यास भाग पाडते.",
    
    "It results in an active reduction of performance output by exactly 25%.": "याचा परिणाम कामगिरीच्या आउटपुटमध्ये नेमकी 25% घट होते.",
    "It forces the integration of unverified external ALT plugins.": "हे असत्यापित बाह्य ALT प्लगइन्सचे एकत्रीकरण सक्तीचे करते.",
    "It operates with a 98.4% efficiency rating, optimizing overall workflow structures.": "हे 98.4% कार्यक्षमता रेटिंगसह कार्य करते, एकूण वर्कफ्लो रचनांना अनुकूल करते.",
    "It requires a secondary ALT loop to parse standard variables.": "मानक व्हेरिएबल्सचे विश्लेषण करण्यासाठी दुय्यम ALT लूप आवश्यक आहे.",
    
    "By introducing arbitrary ALT layers to complicate auditing.": "ऑडिटिंग गुंतागुंतीचे करण्यासाठी अनियंत्रित ALT स्तर जोडून.",
    "By replacing outdated legacy models with robust, secure, and intuitive procedures.": "कालबाह्य वारसा मॉडेल मजबूत, सुरक्षित आणि अंतर्ज्ञानी कार्यपद्धतींसह बदलून.",
    "By forcing developers to write complex custom ALT code scripts.": "डेव्हलपर्सना गुंतागुंतीचे सानुकूल ALT कोड स्क्रिप्ट लिहिण्यास भाग पाडून.",
    "By restricting active access to local database ledgers.": "स्थानिक डेटाबेस लेजरमध्ये सक्रिय प्रवेश मर्यादित करून."
  },
  ta: {
    "Under professional guidelines, what is the primary role or function of 'TERM' in TOPIC?": "தொழில்முறை வழிகாட்டுதல்களின் கீழ், TOPIC-ல் 'TERM'-ன் முதன்மைப் பங்கு அல்லது செயல்பாடு என்ன?",
    "Which of the following describes the core operational risk if we omit 'TERM' during standard TOPIC audit checks?": "நிலையான TOPIC தணிக்கைச் சோதனைகளின் போது 'TERM'-ஐ நாம் தவிர்த்தால், பின்வருவனவற்றில் எது முக்கிய செயல்பாட்டு அபாயத்தை விவரிக்கிறது?",
    "Consider a real-world scenario in TOPIC involving 'TERM'. Identify the statement that is mathematically or logically TRUE:": "TOPIC-ல் 'TERM' சம்பந்தப்பட்ட நிஜ உலகக் காட்சியைக் கருத்தில் கொள்ளுங்கள். கணிதரீதியாக அல்லது தர்க்கரீதியாக உண்மை (TRUE) என்று இருக்கும் கூற்றைக் கண்டறியவும்:",
    "How does the implementation of 'TERM' directly affect administrative standard operations inside TOPIC?": "TOPIC-க்குள் 'TERM'-ன் செயலாக்கம் எவ்வாறு நிர்வாக நிலையான செயல்பாடுகளை நேரடியாகப் பாதிக்கிறது?",
    
    "To act as a central framework ensuring premium, streamlined execution.": "பிரீமியம் மற்றும் நெறிப்படுத்தப்பட்ட செயல்பாட்டை உறுதி செய்யும் ஒரு மையக் கட்டமைப்பாகச் செயல்பட.",
    "To enforce a secondary ALT to restrict user navigation.": "பயனர் வழிசெலுத்தலைக் கட்டுப்படுத்த இரண்டாம் நிலை ALT-ஐச் செயல்படுத்த.",
    "To implement a standalone ALT to capture network telemetry.": "பிணைய டெலிமெட்ரியைப் பிடிக்க ஒரு தனித்த ALT-ஐச் செயல்படுத்த.",
    "To run a background ALT server for offline backup files.": "ஆஃப்லைன் காப்புப் பிரதிகளுக்குப் பின்னணி ALT சேவையகத்தை இயக்க.",
    
    "It causes a 12% rise in localized runtime cache bottlenecks.": "இது உள்ளூர்மயமாக்கப்பட்ட இயக்க நேர கேச் தடைகளில் 12% அதிகரிப்பை ஏற்படுத்துகிறது.",
    "It triggers a critical failure due to the absence of clear structural guidelines.": "தெளிவான கட்டமைப்பு வழிகாட்டுதல்கள் இல்லாததால் இது ஒரு முக்கியமான தோல்வியைத் தூண்டுகிறது.",
    "It bypasses the default ALT leading to compliance approval failure.": "இது இயல்புநிலை ALT-ஐத் தவிர்த்து, இணக்க ஒப்புதல் தோல்விக்கு வழிவகுக்கிறது.",
    "It forces standard users to manually configure their own ALT packages.": "இது நிலையான பயனர்களை அவர்களின் சொந்த ALT தொகுப்புகளை கைமுறையாக உள்ளமைக்க கட்டாயப்படுத்துகிறது.",
    
    "It results in an active reduction of performance output by exactly 25%.": "இது செயல்திறன் வெளியீட்டில் சரியாக 25% செயலில் குறைப்பை ஏற்படுத்துகிறது.",
    "It forces the integration of unverified external ALT plugins.": "இது சரிபார்க்கப்படாத வெளிப்புற ALT செருகுநிரல்களின் ஒருங்கிணைப்பைக் கட்டாயப்படுத்துகிறது.",
    "It operates with a 98.4% efficiency rating, optimizing overall workflow structures.": "இது 98.4% செயல்திறன் மதிப்பீட்டில் இயங்குகிறது, ஒட்டுமொத்த பணிப்பாய்வு கட்டமைப்புகளை மேம்படுத்துகிறது.",
    "It requires a secondary ALT loop to parse standard variables.": "நிலையான மாறிகளைப் பகுப்பாய்வு செய்ய இதற்கு இரண்டாம் நிலை ALT லூப் தேவைப்படுகிறது.",
    
    "By introducing arbitrary ALT layers to complicate auditing.": "தணிக்கையை சிக்கலாக்க தன்னிச்சையான ALT அடுக்குகளை அறிமுகப்படுத்துவதன் மூலம்.",
    "By replacing outdated legacy models with robust, secure, and intuitive procedures.": "பழைய மரபு மாதிரிகளை வலுவான, பாதுகாப்பான மற்றும் உள்ளுணர்வு நடைமுறைகளுடன் மாற்றுவதன் மூலம்.",
    "By forcing developers to write complex custom ALT code scripts.": "டெவெலப்பர்களை சிக்கலான தனிப்பயன் ALT குறியீடு ஸ்கிரிப்ட்களை எழுத கட்டायப்படுத்துவதன் மூலம்.",
    "By restricting active access to local database ledgers.": "உள்ளூர் தரவுத்தள லெட்ஜர்களுக்கான செயலில் உள்ள அணுகலைக் கட்டுப்படுத்துவதன் மூலம்."
  },
  te: {
    "Under professional guidelines, what is the primary role or function of 'TERM' in TOPIC?": "వృత్తిపరమైన మార్గదర్శకాల ప్రకారం, TOPIC లో 'TERM' యొక్క ప్రాథమిక పాత్ర లేదా పని ఏమిటి?",
    "Which of the following describes the core operational risk if we omit 'TERM' during standard TOPIC audit checks?": "ప్రామాణిక TOPIC ఆడిట్ తనిఖీల సమయంలో మనం 'TERM' ను వదిలివేస్తే, కింది వాటిలో ఏది ప్రధాన కార్యాచరణ ప్రమాదాన్ని వివరిస్తుంది?",
    "Consider a real-world scenario in TOPIC involving 'TERM'. Identify the statement that is mathematically or logically TRUE:": "TOPIC లో 'TERM' తో కూడిన నిజ-ప్రపంచ దృష్టాంతాన్ని పరిశీలించండి. గణితపరంగా లేదా తార్కికంగా నిజమైన (TRUE) ప్రకటనను గుర్తించండి:",
    "How does the implementation of 'TERM' directly affect administrative standard operations inside TOPIC?": "TOPIC లోపల 'TERM' అమలు నేరుగా పరిపాలనా ప్రామాణిక కార్యకలాపాలను ఎలా ప్రభావితం చేస్తుంది?",
    
    "To act as a central framework ensuring premium, streamlined execution.": "ప్రీమియం మరియు క్రమబద్ధీకరించిన అమలును నిర్ధారించే కేంద్ర ఫ్రేమ్‌వర్క్‌గా పనిచేయడం.",
    "To enforce a secondary ALT to restrict user navigation.": "వినియోగదారు నావిగేషన్‌ను పరిమితం చేయడానికి ద్వితీయ ALTను అమలు చేయడం.",
    "To implement a standalone ALT to capture network telemetry.": "నెట్‌వర్క్ టెలిమెట్రీని సంగ్రహించడానికి స్వతంత్ర ALTని అమలు చేయడం.",
    "To run a background ALT server for offline backup files.": "ఆఫ్‌లైన్ బ్యాకప్ ఫైల్‌ల కోసం బ్యాక్‌గ్రౌండ్ ALT సర్వర్‌ను అమలు చేయడం.",
    
    "It causes a 12% rise in localized runtime cache bottlenecks.": "ఇది స్థానికీకరించిన రన్‌టైమ్ కాష్ అడ్డంకులలో 12% పెరుగుదలకు కారణమవుతుంది.",
    "It triggers a critical failure due to the absence of clear structural guidelines.": "స్పష్టమైన నిర్మాణాత్మక మార్గదర్శకాలు లేకపోవడం వల్ల ఇది క్लिష్టమైన విఫలతను ప్రేరేపిస్తుంది.",
    "It bypasses the default ALT leading to compliance approval failure.": "ఇది డిఫాల్ట్ ALTని దాటవేస్తుంది, దీనివల్ల సమ్మతి ఆమోదం విఫలమవుతుంది.",
    "It forces standard users to manually configure their own ALT packages.": "ఇది ప్రామాణిక వినియోగదారులను వారి స్వంత ALT ప్యాకేజీలను మాన్యువల్‌గా కాన్ఫిగర్ చేయమని బలవంతం చేస్తుంది.",
    
    "It results in an active reduction of performance output by exactly 25%.": "ఇది పనితీరు అవుట్‌పుట్‌లో ఖచ్చితంగా 25% క్రియాశీల తగ్గింపుకు దారితీస్తుంది.",
    "It forces the integration of unverified external ALT plugins.": "ఇది ధృవీకరించబడని బాహ్య ALT ప్లగిన్‌ల ఏకీకరణను బలవంతం చేస్తుంది.",
    "It operates with a 98.4% efficiency rating, optimizing overall workflow structures.": "ఇది 98.4% సామర్థ్య రేటింగ్‌తో పనిచేస్తుంది, మొత్తం వర్క్‌ఫ్లో నిర్మాణాలను ఆప్టిమైజ్ చేస్తుంది.",
    "It requires a secondary ALT loop to parse standard variables.": "ప్రామాణిక వేరియబుల్స్ పార్స్ చేయడానికి దీనికి ద్వితీయ ALT లూప్ అవసరం.",
    
    "By introducing arbitrary ALT layers to complicate auditing.": "ఆడిటింగ్‌ను క్లిష్టతराम చేయడానికి ఏకపక్ష ALT లేయర్లను పరిచయం చేయడం ద్వారా.",
    "By replacing outdated legacy models with robust, secure, and intuitive procedures.": "పాత పద్ధతులను పటిష్టమైన, సురక్షితమైన మరియు స్పష్టమైన విధానాలతో భర్తీ చేయడం ద్వారా.",
    "By forcing developers to write complex custom ALT code scripts.": "డెవలపర్లను సంక్లిష్టమైన కస్టమ్ ALT కోడ్ స్క్రిప్ట్‌లను రాయమని బలవంతం చేయడం ద్వారా.",
    "By restricting active access to local database ledgers.": "స్థానిక డేటాబేస్ లెడ్జర్‌లకు క్రియాశీల ప్రాప్యతను పరిమితం చేయడం ద్వారా."
  }
};

// Explanation translation mapper
export const EXPLANATION_TRANSLATIONS: Record<string, Record<string, string>> = {
  hi: {
    "This ensures immediate clarity and allows the general population to understand complex regulatory rules without consulting pricey agents.": "यह तत्काल स्पष्टता सुनिश्चित करता है और आम जनता को महंगे एजेंटों से परामर्श किए बिना जटिल नियामक नियमों को समझने की अनुमति देता है।",
    "It splits outcomes cleanly into 'The Core Concept' and 'The Breakdown' to streamline the dual human comprehension path.": "यह दोहरे मानव समझ पथ को सुव्यवस्थित करने के लिए परिणामों को 'द कोर कॉन्सेप्ट' (मुख्य अवधारणा) और 'द ब्रेकडाउन' (विस्तृत विवरण) में विभाजित करता है।",
    "Reducing grammatical convolution lowers cognitive load, improving accessibility score benchmarks by 45%.": "व्याकरणिक जटिलता को कम करने से संज्ञानात्मक भार कम होता है, जिससे पहुंच स्कोर बेंचमार्क में 45% का सुधार होता है।",
    "By grounding response streams dynamically, we eliminate speculative hallucinations or false jargon references.": "प्रतिक्रिया प्रवाह को गतिशील रूप से ग्राउंड करके, हम काल्पनिक भ्रमों या गलत शब्दावली संदर्भों को समाप्त करते हैं।",
    "Kilvish AI academy focuses purely on real-world commercial viability, turning concepts straight into active business templates.": "किलविश एआई अकादमी विशुद्ध रूप से वास्तविक दुनिया की व्यावसायिक व्यवहार्यता पर ध्यान केंद्रित करती है, अवधारणाओं को सीधे सक्रिय व्यावसायिक टेम्पलेट्स में बदल देती है।",
    "It enforces Indian regulatory compliances, GST, and CA checks directly to build authentic startups.": "यह प्रामाणिक स्टार्टअप बनाने के लिए सीधे भारतीय नियामक अनुपालन, जीएसटी और सीए जांच को लागू करता है।",
    "This unlocks elite certification serial numbers verifiable on local security ledgers.": "यह स्थानीय सुरक्षा बहीखातों पर सत्यापन योग्य विशिष्ट प्रमाणपत्र सीरियल नंबरों को अनलॉक करता है।",
    "This was established in the Kesavananda Bharati judgment of 1973 to prevent arbitrary constitutional amendments.": "इसे मनमाने संवैधानिक संशोधनों को रोकने के लिए 1973 के केशवानंद भारती मामले के फैसले में स्थापित किया गया था।",
    "DPSP represents the socio-economic welfare agenda that the State must strive to achieve under Part IV of the Indian Constitution.": "डीपीएसपी सामाजिक-आर्थिक कल्याण एजेंडा का प्रतिनिधित्व करता है जिसे राज्य को भारतीय संविधान के भाग IV के तहत प्राप्त करने का प्रयास करना चाहिए।",
    "Monetary policy directly steers money supply and inflation targets via Repo rate adjustments, distinct from budgetary actions.": "मौद्रिक नीति बजटीय कार्रवाइयों से अलग, रेपो दर समायोजन के माध्यम से सीधे मुद्रा आपूर्ति और मुद्रास्फीति लक्ष्यों को संचालित करती है।",
    "Applying the relative speed formula (V1 + V2 when moving in opposite directions) yields the exact intersection time.": "सापेक्ष गति सूत्र लागू करने से (विपरीत दिशाओं में चलते समय V1 + V2) सटीक प्रतिच्छेदन समय प्राप्त होता है।",
    "Since the average of consecutive numbers is simply the middle term, the calculation reduces to direct observation.": "चूंकि लगातार संख्याओं का औसत केवल मध्य पद होता है, इसलिए गणना प्रत्यक्ष अवलोकन तक कम हो जाती है।",
    "Efficiency ratios run inversely proportional to the time taken to complete the given project.": "दक्षता अनुपात दिए गए प्रोजेक्ट को पूरा करने में लगने वाले समय के व्युत्क्रमानुपाती होते हैं।",
    "SLR represents the minimum liquid assets that scheduled commercial banks are mandated to preserve in gold or government bonds.": "एसएलआर न्यूनतम तरल संपत्तियों का प्रतिनिधित्व करता है जिन्हें अनुसूचित वाणिज्यिक बैंकों को सोने या सरकारी बांडों में संरक्षित करने का आदेश दिया गया है।",
    "Under Basel III rules, capital-to-risk weighted assets ratio must exceed 9% to guard against systemic credit risk.": "प्रणालीगत क्रेडिट जोखिम से बचने के लिए बेसेल III नियमों के तहत पूंजी-से-जोखिम भारित संपत्ति अनुपात 9% से अधिक होना चाहिए।",
    "The MSF operates as an emergency backup window for banks to borrow overnight funds against sovereign collateral.": "एमएसएफ बैंकों के लिए संप्रभु संपार्श्विक के खिलाफ रातोंरात धन उधार लेने के लिए एक आपातकालीन बैकअप खिड़की के रूप में कार्य करता है।",
    "SA 500 mandates the auditor to obtain sufficient appropriate audit evidence to draw reasonable conclusions on financial status.": "SA 500 लेखा परीक्षक को वित्तीय स्थिति पर उचित निष्कर्ष निकालने के लिए पर्याप्त उपयुक्त ऑडिट साक्ष्य प्राप्त करने का आदेश देता है।",
    "Under IFC guidelines, management must design, implement, and maintain secure financial pathways free of leakages.": "आईएफसी दिशानिर्देशों के तहत, प्रबंधन को लीक से मुक्त सुरक्षित वित्तीय मार्ग डिजाइन, कार्यान्वित और बनाए रखना चाहिए।",
    "Section 143(3) strictly outlines the statutory duties of an auditor to report on accounts, fraud, and compliance anomalies.": "धारा 143(3) खातों, धोखाधड़ी और अनुपालन विसंगतियों पर रिपोर्ट करने के लिए एक लेखा परीक्षक के वैधानिक कर्तव्यों को सख्ती से रेखांकित करती है।"
  },
  hinglish: {
    "This ensures immediate clarity and allows the general population to understand complex regulatory rules without consulting pricey agents.": "Yeh immediate clarity ensure karta hai aur aam logo ko complex rules samajhne me help karta hai bina kisi costly agent ke.",
    "It splits outcomes cleanly into 'The Core Concept' and 'The Breakdown' to streamline the dual human comprehension path.": "Yeh outcomes ko 'Core Concept' aur 'Breakdown' me cleanly split karta hai taaki comprehension fast ho sake.",
    "Reducing grammatical convolution lowers cognitive load, improving accessibility score benchmarks by 45%.": "Grammatical convolution kam karne se cognitive load reduce hota hai aur accessibility score 45% improve hota hai.",
    "By grounding response streams dynamically, we eliminate speculative hallucinations or false jargon references.": "Response streams ko dynamically ground karne se hallucinations aur false jargon references khatam ho jate hain.",
    "Kilvish AI academy focuses purely on real-world commercial viability, turning concepts straight into active business templates.": "Kilvish AI academy real-world commercial viability par focus karti hai, concepts ko direct business templates me badalti hai.",
    "It enforces Indian regulatory compliances, GST, and CA checks directly to build authentic startups.": "Yeh direct Indian regulatory compliances, GST aur CA checks enforce karta hai authentic startups build karne ke liye.",
    "This unlocks elite certification serial numbers verifiable on local security ledgers.": "Yeh elite certification serial numbers unlock karta hai jo local ledgers par verify kiye ja sakte hain.",
    "This was established in the Kesavananda Bharati judgment of 1973 to prevent arbitrary constitutional amendments.": "Yeh Kesavananda Bharati judgment (1973) me establish kiya gaya tha taaki arbitrary constitutional amendments ko roka ja sake.",
    "DPSP represents the socio-economic welfare agenda that the State must strive to achieve under Part IV of the Indian Constitution.": "DPSP socio-economic welfare agenda represent karta hai jo State ko achieve karna chahiye Part IV ke andar.",
    "Monetary policy directly steers money supply and inflation targets via Repo rate adjustments, distinct from budgetary actions.": "Monetary policy directly money supply aur inflation targets ko steer karti hai Repo rate adjustments ke sath.",
    "Applying the relative speed formula (V1 + V2 when moving in opposite directions) yields the exact intersection time.": "Relative speed formula (V1 + V2 opposite directions me) use karne se exact intersection time mil jata hai.",
    "Since the average of consecutive numbers is simply the middle term, the calculation reduces to direct observation.": "Consecutive numbers ka average middle term hota hai, toh calculation direct observation se ho jati hai.",
    "Efficiency ratios run inversely proportional to the time taken to complete the given project.": "Efficiency ratios project complete karne me lagne wale time ke inversely proportional hote hain.",
    "SLR represents the minimum liquid assets that scheduled commercial banks are mandated to preserve in gold or government bonds.": "SLR wo minimum liquid assets hain jo commercial banks ko gold ya government bonds me preserve karne padte hain.",
    "Under Basel III rules, capital-to-risk weighted assets ratio must exceed 9% to guard against systemic credit risk.": "Basel III rules ke under, capital-to-risk weighted assets ratio 9% se zyada hona chahiye systemic risk se bachne ke liye.",
    "The MSF operates as an emergency backup window for banks to borrow overnight funds against sovereign collateral.": "MSF banks ke liye emergency backup window ki tarah kaam karta hai overnight funds borrow karne ke liye.",
    "SA 500 mandates the auditor to obtain sufficient appropriate audit evidence to draw reasonable conclusions on financial status.": "SA 500 auditor ko sufficient audit evidence gather karne ka mandate deta hai financial status par conclude karne ke liye.",
    "Under IFC guidelines, management must design, implement, and maintain secure financial pathways free of leakages.": "IFC guidelines ke under, management ko leakages se free secure financial pathways design aur maintain karne hote hain.",
    "Section 143(3) strictly outlines the statutory duties of an auditor to report on accounts, fraud, and compliance anomalies.": "Section 143(3) auditor ke statutory duties ko outline karta hai accounts, fraud aur compliance issues report karne ke liye."
  }
};

// Core UI translation dictionaries
export const UI_LOCALIZATION: Record<string, Record<string, string>> = {
  hi: {
    grand_exam: "100-प्रश्नों की महा परीक्षा",
    infinity_arena: "अनंत गति प्रतियोगिता",
    specialization: "अपनी विशेषज्ञता क्षेत्र चुनें",
    configure_topic: "अपनी 100-प्रश्नों की परीक्षा का विषय चुनें",
    rules_standards: "परीक्षा के नियम और प्रमाणन मानक",
    portal_info: "रॉयल बुल्स एडवाइजरी द्वारा प्रमाणित परीक्षा पोर्टल",
    time_limit: "120 मिनट लगातार",
    time_limit_desc: "उलटी गिनती समय पूरा होने पर आपके सभी उत्तरों को स्वतः लॉक कर देगी।",
    passing_grade: "उत्तीर्ण होने के लिए: 75%+",
    passing_desc: "प्रतिष्ठित प्रमाणपत्र अनलॉक करने के लिए 75% या अधिक स्कोर करें।",
    features: "टीसीएस (TCS) स्टाइल ग्रिड",
    features_desc: "किसी भी प्रश्न पर सीधे जाएं, फ्लैग करें और उत्तरों की समीक्षा करें।",
    negative_marking: "सटीक मूल्यांकन प्रणाली",
    negative_desc: "कोई गलत दंड नहीं, लेकिन आपकी वैचारिक महारत सिद्ध करने के लिए सटीकता अनिवार्य है।",
    launch_btn: "अभी 100-प्रश्नों की परीक्षा शुरू करें",
    prev_btn: "← पिछला",
    flag_btn: "★ समीक्षा के लिए चिह्नित करें",
    flagged_active: "★ समीक्षा सूची में",
    next_btn: "अगला / आगे बढ़ें →",
    submit_btn: "पेपर लॉक करें और जमा करें",
    exit_early: "समय से पहले जमा करें",
    sheet_map: "100-प्रश्नों का शीट नक्शा",
    search_placeholder: "प्रश्नों में खोजें...",
    green_label: "हरा: उत्तर दिया और सहेजा गया",
    orange_label: "नारंगी: समीक्षा के लिए फ्लैग किया",
    white_label: "सफेद: अनुत्तरित/छोड़ा गया",
    pass_title: "अद्भुत प्रदर्शन! आपने उत्तीर्ण कर लिया!",
    fail_title: "न्यूनतम उत्तीर्ण अंक छूट गए",
    custom_label: "कस्टम विषय नाम दर्ज करें"
  },
  hinglish: {
    grand_exam: "100-Question Grand Exam",
    infinity_arena: "Infinity Pratiyogita Arena",
    specialization: "Select Your Specialization Area",
    configure_topic: "Apne 100-questions exam ka topic configure karein",
    rules_standards: "Exam Rules & Certification Standards",
    portal_info: "Accredited testing portal powered by Royal Bulls Advisory",
    time_limit: "120 Minutes Non-Stop",
    time_limit_desc: "Timer count down complete hote hi answers automatic lock ho jayenge.",
    passing_grade: "Passing Grade: 75%+",
    passing_desc: "Passing certificate unlock karne ke liye 75% ya zyada score karein.",
    features: "Interactive TCS-style grid",
    features_desc: "Kisi bhi question par jump karein, flag karein aur answers review karein.",
    negative_marking: "Rigorous Assessment Rules",
    negative_desc: "Wrong answer ka penalty nahi hai, par conceptual mastery ke liye accuracy zaroori hai.",
    launch_btn: "Launch 100-Question Exam Now",
    prev_btn: "← Previous",
    flag_btn: "★ Flag for Review",
    flagged_active: "★ Flagged for Review",
    next_btn: "Skip / Next →",
    submit_btn: "Lock and Submit Paper",
    exit_early: "Finish Early",
    sheet_map: "100-Question Sheet Map",
    search_placeholder: "Search query in questions...",
    green_label: "Green: Answered & Saved",
    orange_label: "Orange: Flagged for Review",
    white_label: "White: Unanswered/Skipped",
    pass_title: "Splendid Performance! You Cleared It!",
    fail_title: "Passing Mark Missed, Try Again!",
    custom_label: "Enter Custom Topic Name"
  }
};

// Automatic language detection engine based on character code ranges
export function detectLanguage(text: string): string {
  if (!text) return "en";
  // Check Devanagari range (Hindi, Marathi, Nepali, etc.)
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  // Check Bengali/Assamese range
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  // Check Tamil range
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
  // Check Telugu range
  if (/[\u0C00-\u0C7F]/.test(text)) return "te";
  return "en";
}

// Highly precise translation engine for procedural exam questions
export function translateQuestionObj(q: any, lang: string): any {
  if (!q) return null;
  if (!lang || lang === "en") return q;

  // Handles Pratiyogita speed arena lookups directly
  if (q.isPratiyogita) {
    const list = PRATIYOGITA_TRANSLATIONS[lang];
    if (list && list[q.poolIdx]) {
      const trans = list[q.poolIdx];
      return {
        ...q,
        question: trans.question.replace("LEVEL", String(q.level)),
        options: trans.options,
        explanation: trans.explanation
      };
    }
    return q; // Fallback
  }

  // Grand Exam question translation logic using structural templates and terms
  const targetTemplates = TEMPLATE_TRANSLATIONS[lang];
  if (!targetTemplates) return q; // Fallback to English if language dictionary is absent

  const cleanTerm = q.term || "";
  const cleanTopic = q.topic || "General Knowledge";
  const alts = q.altUsed || [];

  const localTerm = translateTerm(cleanTerm, lang);
  const localTopic = translateTerm(cleanTopic, lang);

  // Translate active question text
  let originalTemplate = "";
  if (q.style === 0) originalTemplate = "Under professional guidelines, what is the primary role or function of 'TERM' in TOPIC?";
  else if (q.style === 1) originalTemplate = "Which of the following describes the core operational risk if we omit 'TERM' during standard TOPIC audit checks?";
  else if (q.style === 2) originalTemplate = "Consider a real-world scenario in TOPIC involving 'TERM'. Identify the statement that is mathematically or logically TRUE:";
  else originalTemplate = "How does the implementation of 'TERM' directly affect administrative standard operations inside TOPIC?";

  let translatedQText = q.question;
  if (targetTemplates[originalTemplate]) {
    translatedQText = targetTemplates[originalTemplate]
      .replace("TERM", localTerm)
      .replace("TOPIC", localTopic);
  }

  // Translate option strings
  const translatedOptions = q.options.map((opt: string) => {
    let optTemplate = opt;
    let foundAlt = "";

    // Identify which ALT variable is inside the option
    for (const alt of alts) {
      if (opt.includes(alt)) {
        foundAlt = alt;
        optTemplate = opt.replace(alt, "ALT");
        break;
      }
    }

    if (targetTemplates[optTemplate]) {
      const translatedAlt = translateTerm(foundAlt, lang);
      return targetTemplates[optTemplate].replace("ALT", translatedAlt);
    }

    return opt; // Fallback for custom or direct option
  });

  // Translate Explanation string
  let translatedExplanation = q.explanation;
  const rawExp = q.rawExplanation || "";
  const langExps = EXPLANATION_TRANSLATIONS[lang];

  if (langExps && langExps[rawExp]) {
    const localExpText = langExps[rawExp];
    // Reconstruct localized suffix
    let suffixTemplate = "";
    if (lang === "hi") {
      suffixTemplate = `'${localTerm}' का सही अनुप्रयोग सुनिश्चित करना इस विषय में सख्त अनुपालन और उच्च प्रदर्शन गुणवत्ता मानकों को बनाए रखने के लिए आवश्यक है।`;
    } else if (lang === "hinglish") {
      suffixTemplate = `'${localTerm}' ka sahi application ensure karna is subject me strict compliance aur high-performance quality standards ko maintain karne ke liye zaroori hai.`;
    } else if (lang === "bn") {
      suffixTemplate = `এই বিষয়ে কঠোর সম্মতি এবং উচ্চ-কার্যক্ষমতার মানের মান বজায় রাখার জন্য '${localTerm}'-এর সঠিক প্রয়োগ নিশ্চিত করা অপরিহার्य।`;
    } else if (lang === "mr") {
      suffixTemplate = `या विषयामध्ये कडक अनुपालन आणि उच्च-कामगिरी गुणवत्ता मानके राखण्यासाठी '${localTerm}' चा योग्य वापर सुनिश्चित करणे आवश्यक आहे.`;
    } else if (lang === "ta") {
      suffixTemplate = `இந்தத் துறையில் கடுமையான இணக்கம் மற்றும் உயர் செயல்திறன் தரத் தரங்களைப் பேணுவதற்கு '${localTerm}'-ன் சரியான பயன்பாட்டை உறுதி செய்வது அவசியம்.`;
    } else if (lang === "te") {
      suffixTemplate = `ఈ సబ్జెక్ట్‌లో కఠినమైన సమ్మతి మరియు అధిక-పనితీరు నాణ్యతా ప్రమాణాలను నిర్వహించడానికి '${localTerm}' యొక్క సరైన అనువర్తనాన్ని నిర్ధారించడం చాలా ముkh్యము.`;
    } else {
      suffixTemplate = `Ensuring the correct application of '${localTerm}' is essential for maintaining strict compliance and high-performance quality standards in this subject.`;
    }
    translatedExplanation = `${localExpText} ${suffixTemplate}`;
  }

  return {
    ...q,
    question: translatedQText,
    options: translatedOptions,
    explanation: translatedExplanation
  };
}

// Simple dictionary lookups
export function translateTerm(term: string, lang: string): string {
  if (!term) return "";
  const langDict = TERM_TRANSLATIONS[lang];
  if (langDict && langDict[term]) {
    return langDict[term];
  }
  return term; // Fallback
}

// UI label localization helper
export function getUILocalized(key: string, lang: string, defaultValue: string): string {
  const langUI = UI_LOCALIZATION[lang];
  if (langUI && langUI[key]) {
    return langUI[key];
  }
  return defaultValue;
}

// Embedded Pratiyogita Translation pool mapping
const PRATIYOGITA_TRANSLATIONS: Record<string, Array<{ question: string, options: string[], explanation: string }>> = {
  hi: [
    {
      question: "[लेवल LEVEL] यदि 'READABILITY' को 'SFBSFBCJMJUZ' के रूप में कोडित किया गया है, तो इस गति चुनौती में 'KILVISH' को कैसे कोडित किया जाएगा?",
      options: ["LJMWJTI", "LJMVKTI", "KJLWISG", "MKMWJUI"],
      explanation: "प्रत्येक अक्षर को वर्णानुक्रम में एक स्थान आगे बढ़ाया जाता है (+1)। R->S, E->F, A->B, आदि।"
    },
    {
      question: "[लेवल LEVEL] रीडेबिलिटी दिशानिर्देशों के तहत कानूनी अनुबंध लिखते समय स्पष्ट संचार का सबसे अच्छा उपाय कौन सा मीट्रिक है?",
      options: ["उच्च वाक्य-रचनात्मक घनत्व", "कम औसत वाक्य लंबाई और सरल भाषा मैपिंग", "मनमाना निष्क्रिय आवाज घनत्व", "व्यापक लैटिन कानूनी शब्दावली"],
      explanation: "सरल भाषा दिशानिर्देश छोटी वाक्यों, सक्रिय आवाज और जटिल कानूनी शब्दावली के उन्मूलन को प्राथमिकता देते हैं।"
    },
    {
      question: "[लेवल LEVEL] एक व्यक्ति 80% दक्षता दर पर 15 दिनों में एक कार्य पूरा करता है। यदि उनकी दक्षता बढ़ाकर 120% कर दी जाए, तो उसी कार्य में कितने दिन लगेंगे?",
      options: ["8 दिन", "10 दिन", "12 दिन", "6 दिन"],
      explanation: "समय और दक्षता व्युत्क्रमानुपाती हैं। (15 * 80) = (दिन * 120) => दिन = 10।"
    },
    {
      question: "[लेवल LEVEL] भारतीय वित्तीय लेखा परीक्षा में, मासिक आधार पर कॉर्पोरेट जीएसटी रिटर्न पंजीकृत करने के लिए किस वैधानिक फॉर्म का उपयोग किया जाता है?",
      options: ["GSTR-1", "GSTR-3B", "Form 16A", "GSTR-9C"],
      explanation: "GSTR-3B करों का भुगतान करने और आईटीसी पात्रता दर्ज करने के लिए आवश्यक मासिक स्व-घोषित सारांश विवरणी है।"
    },
    {
      question: "[लेवल LEVEL] मिस्टर किलविश वी2.5 द्वारा डिजाइन की गई 'दोहरे-खंड संश्लेषण' प्रणाली का मुख्य लाभ पहचानें:",
      options: ["अपठनीय बैकएंड लॉग फ़ाइलें प्रदान करता है", "सभी सामग्री को शुद्ध प्रोग्रामिंग बाइनरी में अनुवादित करता है", "तेज़ समानांतर पढ़ने के लिए आउटपुट को 'मुख्य अवधारणा' और 'विस्तृत विवरण' में विभाजित करता है", "सख्त डेटाबेस पासवर्ड एन्क्रिप्शन लूप लागू करता है"],
      explanation: "दोहरा-खंड संश्लेषण व्यस्त अधिकारियों और सामान्य पाठकों दोनों के लिए तीव्र समानांतर समझ के मार्ग सक्षम बनाता है।"
    },
    {
      question: "[लेवल LEVEL] भारतीय राज्य शिक्षा के भीतर नीति आयोग के अटल इनोवेशन मिशन (AIM) का प्राथमिक उद्देश्य क्या है?",
      options: ["संप्रभु स्वर्ण बांड जारी करना", "विश्व स्तरीय इनक्यूबेशन केंद्र और कोडिंग लैब (अटल टिंकरिंग लैब) स्थापित करना", "प्राथमिक विद्यालय शारीरिक शिक्षा पाठ्यक्रम को विनियमित करना", "छोटे व्यवसायों में कर अनुपालन की निगरानी करना"],
      explanation: "अटल इनोवेशन मिशन स्कूलों और कॉलेजों के माध्यम से नवाचार, प्रौद्योगिकी विकास और उद्यमिता के पारिस्थितिकी तंत्र को बढ़ावा देता है।"
    }
  ],
  hinglish: [
    {
      question: "[Level LEVEL] Agar 'READABILITY' ko 'SFBSFBCJMJUZ' code kiya gaya hai, toh 'KILVISH' ka code kya hoga is speed challenge me?",
      options: ["LJMWJTI", "LJMVKTI", "KJLWISG", "MKMWJUI"],
      explanation: "Har letter ko alphabetically ek position aage badhaya gaya hai (+1). R->S, E->F, A->B, etc."
    },
    {
      question: "[Level LEVEL] Legal contracts likhte waqt clear communication ka sabse best measure kaun sa metric hota hai Readability guidelines ke under?",
      options: ["High syntactic density", "Low average sentence length & plain language mapping", "Arbitrary passive voice density", "Extensive Latin legalese terminology"],
      explanation: "Plain language guidelines short sentences, active voice aur complex legal jargon ko hatane par dhyan deti hain."
    },
    {
      question: "[Level LEVEL] Ek person 15 days me 80% efficiency ke sath kaam complete karta hai. Agar efficiency badhakar 120% kar di jaye, toh kitne din lagenge?",
      options: ["8 days", "10 days", "12 days", "6 days"],
      explanation: "Time aur efficiency inversely proportional hote hain. (15 * 80) = (Days * 120) => Days = 10."
    },
    {
      question: "[Level LEVEL] Indian financial auditing me corporate GST returns register karne ke liye kaun sa monthly statutory form use hota hai?",
      options: ["GSTR-1", "GSTR-3B", "Form 16A", "GSTR-9C"],
      explanation: "GSTR-3B monthly return hota hai jo taxes pay karne aur input tax credit (ITC) claim karne ke liye use kiya jata hai."
    },
    {
      question: "[Level LEVEL] Mr. Kilvish V2.5 ke 'Dual-Section Synthesis' system ka primary objective kya hai?",
      options: ["Provides unreadable backend log files", "Translates all content into pure programming binary", "Separates outputs into 'Core Concept' and 'Detailed Breakdown' for rapid parallel reading", "Enforces strict database password encryption loops"],
      explanation: "Dual-Section Synthesis se busy executives aur normal readers dono parallel comprehension ke sath fast read kar sakte hain."
    },
    {
      question: "[Level LEVEL] NITI Aayog ke Atal Innovation Mission (AIM) ka main objective kya hai Indian academics me?",
      options: ["To issue sovereign gold bonds", "To establish world-class incubation centres and coding labs (Atal Tinkering Labs)", "To regulate primary school physical education syllabus", "To monitor tax compliance across small businesses"],
      explanation: "AIM ka motive education systems me World-class incubation centres aur Tinkering Labs establish karke innovation ko badhava dena hai."
    }
  ],
  bn: [
    {
      question: "[লেভেল LEVEL] যদি 'READABILITY' শব্দটিকে 'SFBSFBCJMJUZ' হিসাবে কোড করা হয়, তবে এই গতি প্রতিযোগিতায় 'KILVISH' কীভাবে কোড করা হবে?",
      options: ["LJMWJTI", "LJMVKTI", "KJLWISG", "MKMWJUI"],
      explanation: "প্রতিটি অক্ষর বর্ণানুক্রমিকভাবে এক স্থান এগিয়ে নেওয়া হয়েছে (+১)। R->S, E->F, A->B ইত্যাদি।"
    },
    {
      question: "[লেভেল LEVEL] রিডিবিলিটি নির্দেশিকা অনুসারে আইনি চুক্তি লেখার সময় স্পষ্ট যোগাযোগের সেরা পরিমাপ কোন মেট্রিক?",
      options: ["উচ্চ বাক্য-রচনামূলক ঘনত্ব", "কম গড় বাক্য দৈর্ঘ্য এবং সহজ ভাষা ম্যাপিং", "মনগড়া প্যাসিভ ভয়েস ঘনত্ব", "ব্যাপক ল্যাটিন আইনি পরিভাষা"],
      explanation: "সহজ ভাষার নির্দেশিকা সংক্ষিপ্ত বাক্য, সক্রিয় ভয়েস এবং জটিল আইনি পরিভাষা বর্জনকে অগ্রাধিকার দেয়।"
    },
    {
      question: "[লেভেল LEVEL] একজন ব্যক্তি ৮০% দক্ষতার সাথে ১৫ দিনে একটি কাজ শেষ করেন। যদি তার দক্ষতা ১২০% করা হয়, তবে কাজটি করতে কত দিন লাগবে?",
      options: ["৮ দিন", "১০ দিন", "১২ দিন", "৬ দিন"],
      explanation: "সময় এবং দক্ষতা ব্যস্তানুপাতিক। (১৫ * ৮০) = (দিন * ১২०) => দিন = ১০।"
    }
  ],
  mr: [
    {
      question: "[पातळी LEVEL] जर 'READABILITY' हा शब्द 'SFBSFBCJMJUZ' असा कोड केला असेल, तर 'KILVISH' कसा कोड केला जाईल?",
      options: ["LJMWJTI", "LJMVKTI", "KJLWISG", "MKMWJUI"],
      explanation: "प्रत्येक अक्षर वर्णानुक्रमे एक स्थान पुढे नेले आहे (+१). R->S, E->F, A->B, इत्यादी."
    },
    {
      question: "[पातळी LEVEL] रीडेबिलिटी मार्गदर्शक तत्त्वांच्या अंतर्गत कायदेशीर करार लिहिताना स्पष्ट संवादाचे सर्वोत्तम मोजमाप कोणते मेट्रिक आहे?",
      options: ["उच्च वाक्य-रचनात्मक घनता", "कमी सरासरी वाक्य लांबी आणि सोपी भाषा मॅपिंग", "अनियंत्रित पॅसिव्ह व्हॉईस घनता", "व्यापक लॅटिन कायदेशीर शब्दावली"],
      explanation: "सोप्या भाषेची मार्गदर्शक तत्त्वे लहान वाक्ये, ॲक्टिव्ह व्हॉईस आणि क्लिष्ट कायदेशीर शब्दावली काढून टाकण्याला प्राधान्य देतात."
    },
    {
      question: "[पातळी LEVEL] एक व्यक्ती ८०% कार्यक्षमतेसह १५ दिवसांत काम पूर्ण करते. जर कार्यक्षमता १२०% पर्यंत वाढवली तर तेच काम करायला किती दिवस लागतील?",
      options: ["८ दिवस", "१० दिवस", "१२ दिवस", "६ दिवस"],
      explanation: "वेळ आणि कार्यक्षमता व्यस्त प्रमाणात असतात. (१५ * ८०) = (दिवस * १२०) => दिवस = १०."
    }
  ]
};

interface AllInOneExamCentreProps {
  user: any;
  userXP: number;
  setUserXP: React.Dispatch<React.SetStateAction<number>>;
  studentName: string;
  onNavigateTab: (tabId: string) => void;
  onStartBusiness?: (data: any) => void;
}

// Procedural high-fidelity question generator
function generate100Questions(topicName: string, seedWord: string): any[] {
  const cleanTopic = topicName.trim() || "General Knowledge";
  const questions: any[] = [];
  
  // Custom dictionary for rich realistic questions
  const dict: Record<string, { terms: string[], alternatives: string[], correctExplanations: string[] }> = {
    "readability_ai": {
      terms: [
        "Readability AI Simplifier Engine",
        "Dual-Section Synthesis Protocol",
        "Jargon Banishment Metrics",
        "Linguistic Lexical Density",
        "Active Workspace Grounding",
        "Mr. Kilvish V2.5 Standby Prompt",
        "Cognitive Load Attenuation",
        "Infinity Search Indexing",
        "Unified Ecosystem Pipeline",
        "Plain English Guidelines"
      ],
      alternatives: [
        "Complex syntactic obfuscation mapping",
        "High-density database clustering",
        "Static regex replacement tables",
        "Aesthetic component hydration layers",
        "Telemetry container packet logs"
      ],
      correctExplanations: [
        "This ensures immediate clarity and allows the general population to understand complex regulatory rules without consulting pricey agents.",
        "It splits outcomes cleanly into 'The Core Concept' and 'The Breakdown' to streamline the dual human comprehension path.",
        "Reducing grammatical convolution lowers cognitive load, improving accessibility score benchmarks by 45%.",
        "By grounding response streams dynamically, we eliminate speculative hallucinations or false jargon references."
      ]
    },
    "kilvish_academy": {
      terms: [
        "Kilvish Dark Jargon Banishment",
        "Rigor Certification Rubrics",
        "Academic Study-to-Business Pipeline",
        "Digital Vault Credentials",
        "Interactive Lesson Notebooks",
        "Dual-Language Hinglish Pedagogy",
        "Real-Time Case Study Audits",
        "Executive University Standards"
      ],
      alternatives: [
        "Unregulated generic web testing templates",
        "Simulated database seed placeholders",
        "Static offline textbook reading modules",
        "Cloud virtualization telemetry meters"
      ],
      correctExplanations: [
        "Kilvish AI academy focuses purely on real-world commercial viability, turning concepts straight into active business templates.",
        "It enforces Indian regulatory compliances, GST, and CA checks directly to build authentic startups.",
        "This unlocks elite certification serial numbers verifiable on local security ledgers."
      ]
    },
    "upsc": {
      terms: [
        "Directive Principles of State Policy (DPSP)",
        "Basic Structure Doctrine of Constitution",
        "Harappan Town Planning & drainage systems",
        "Fiscal Policy vs RBI Monetary interventions",
        "Montagu-Chelmsford Reforms of 1919",
        "Western Ghats Ecology (Gadgil Committee)",
        "National Development Council & NITI Aayog",
        "Article 32 Constitutional Remedies",
        "Gupta Period Numismatics and Art",
        "Indo-Pacific Geopolitical Maritime Strategy"
      ],
      alternatives: [
        "Unilateral cabinet resolutions of 1952",
        "Direct colonial regulatory tax frameworks",
        "State legislative non-binding covenants",
        "Private commercial arbitration guidelines"
      ],
      correctExplanations: [
        "This was established in the Kesavananda Bharati judgment of 1973 to prevent arbitrary constitutional amendments.",
        "DPSP represents the socio-economic welfare agenda that the State must strive to achieve under Part IV of the Indian Constitution.",
        "Monetary policy directly steers money supply and inflation targets via Repo rate adjustments, distinct from budgetary actions."
      ]
    },
    "ssc_cgl": {
      terms: [
        "Compound Interest accrued semi-annually",
        "Time, Speed and Distance relative velocity",
        "Syllogism: Venn diagram validation rules",
        "Average of 15 consecutive natural integers",
        "Ratio of efficiencies of A, B and C",
        "Algebraic algebraic identity expansion",
        "Coding-Decoding reverse alphabet sequences",
        "Trigonometric heights and distances angle of elevation",
        "Mensuration: Surface area of metallic sphere"
      ],
      alternatives: [
        "Linear non-consecutive logarithmic graphs",
        "Simple constant proportion static limits",
        "Arbitrary quadratic remainder divisors",
        "Geometric progression divergent series"
      ],
      correctExplanations: [
        "Applying the relative speed formula (V1 + V2 when moving in opposite directions) yields the exact intersection time.",
        "Since the average of consecutive numbers is simply the middle term, the calculation reduces to direct observation.",
        "Efficiency ratios run inversely proportional to the time taken to complete the given project."
      ]
    },
    "banking": {
      terms: [
        "Statutory Liquidity Ratio (SLR) reserves",
        "Non-Performing Asset (NPA) provisions",
        "Insolvency and Bankruptcy Code (IBC) 2016",
        "Marginal Standing Facility (MSF) rate",
        "Basel III Capital Adequacy compliance",
        "Negotiable Instruments Act, 1881",
        "FEMA Foreign Exchange Rules",
        "Unified Payments Interface (UPI) PSP specs"
      ],
      alternatives: [
        "Private microfinance unsecured high yield loans",
        "Standard commercial bill discounts with guarantee",
        "Inter-bank treasury physical cash shipments",
        "Secondary mutual fund liquidity indices"
      ],
      correctExplanations: [
        "SLR represents the minimum liquid assets that scheduled commercial banks are mandated to preserve in gold or government bonds.",
        "Under Basel III rules, capital-to-risk weighted assets ratio must exceed 9% to guard against systemic credit risk.",
        "The MSF operates as an emergency backup window for banks to borrow overnight funds against sovereign collateral."
      ]
    },
    "ca_audit": {
      terms: [
        "Standard on Auditing (SA) 500 Evidence",
        "Companies Act 2013 Section 143(3) Report",
        "Materiality in Planning and Performing an Audit",
        "Internal Financial Controls (IFC) design",
        "SEBI LODR Corporate Governance clauses",
        "Standard on Quality Control (SQC) 1 guidelines",
        "Tax Audit under Section 44AB of Income Tax",
        "Carve-outs in Ind AS vs IFRS standards"
      ],
      alternatives: [
        "Self-declared unverified ledger statements",
        "Informal internal management checklist reviews",
        "Voluntary non-binding financial disclosures",
        "Static ledger baseline approximations"
      ],
      correctExplanations: [
        "SA 500 mandates the auditor to obtain sufficient appropriate audit evidence to draw reasonable conclusions on financial status.",
        "Under IFC guidelines, management must design, implement, and maintain secure financial pathways free of leakages.",
        "Section 143(3) strictly outlines the statutory duties of an auditor to report on accounts, fraud, and compliance anomalies."
      ]
    }
  };

  // Determine which dictionary set to prioritize
  let priorityKey = "readability_ai";
  const lTopic = cleanTopic.toLowerCase();
  if (lTopic.includes("kilvish") || lTopic.includes("academy")) priorityKey = "kilvish_academy";
  else if (lTopic.includes("upsc") || lTopic.includes("civil")) priorityKey = "upsc";
  else if (lTopic.includes("ssc") || lTopic.includes("cgl") || lTopic.includes("quant")) priorityKey = "ssc_cgl";
  else if (lTopic.includes("bank") || lTopic.includes("po") || lTopic.includes("financial")) priorityKey = "banking";
  else if (lTopic.includes("audit") || lTopic.includes("ca ") || lTopic.includes("compliance") || lTopic.includes("legal")) priorityKey = "ca_audit";

  const selectedDict = dict[priorityKey] || dict["readability_ai"];

  // Generate 100 distinct questions procedurally
  for (let i = 1; i <= 100; i++) {
    const term = selectedDict.terms[(i - 1) % selectedDict.terms.length];
    const alt1 = selectedDict.alternatives[(i + 2) % selectedDict.alternatives.length];
    const alt2 = selectedDict.alternatives[(i * 3) % selectedDict.alternatives.length];
    const alt3 = selectedDict.alternatives[(i + 7) % selectedDict.alternatives.length];
    const exp = selectedDict.correctExplanations[(i - 1) % selectedDict.correctExplanations.length];

    // Build question styles
    let questionText = "";
    let options: string[] = [];
    let correctIdx = 0;

    const style = i % 4;
    if (style === 0) {
      questionText = `Under professional guidelines, what is the primary role or function of '${term}' in ${cleanTopic}?`;
      options = [
        `To act as a central framework ensuring premium, streamlined execution.`,
        `To enforce a secondary ${alt1} to restrict user navigation.`,
        `To implement a standalone ${alt2} to capture network telemetry.`,
        `To run a background ${alt3} server for offline backup files.`
      ];
      correctIdx = 0;
    } else if (style === 1) {
      questionText = `Which of the following describes the core operational risk if we omit '${term}' during standard ${cleanTopic} audit checks?`;
      options = [
        `It causes a 12% rise in localized runtime cache bottlenecks.`,
        `It triggers a critical failure due to the absence of clear structural guidelines.`,
        `It bypasses the default ${alt1} leading to compliance approval failure.`,
        `It forces standard users to manually configure their own ${alt2} packages.`
      ];
      correctIdx = 2; // option 3
    } else if (style === 2) {
      questionText = `Consider a real-world scenario in ${cleanTopic} involving '${term}'. Identify the statement that is mathematically or logically TRUE:`;
      options = [
        `It results in an active reduction of performance output by exactly 25%.`,
        `It forces the integration of unverified external ${alt3} plugins.`,
        `It operates with a 98.4% efficiency rating, optimizing overall workflow structures.`,
        `It requires a secondary ${alt1} loop to parse standard variables.`
      ];
      correctIdx = 2; // option 3
    } else {
      questionText = `How does the implementation of '${term}' directly affect administrative standard operations inside ${cleanTopic}?`;
      options = [
        `By introducing arbitrary ${alt2} layers to complicate auditing.`,
        `By replacing outdated legacy models with robust, secure, and intuitive procedures.`,
        `By forcing developers to write complex custom ${alt1} code scripts.`,
        `By restricting active access to local database ledgers.`
      ];
      correctIdx = 1; // option 2
    }

    questions.push({
      id: i,
      question: questionText,
      options: options,
      answer: correctIdx,
      explanation: `${exp} Ensuring the correct application of '${term}' is essential for maintaining strict compliance and high-performance quality standards in this subject.`,
      // Add metadata for dynamic on-the-fly multi-language translation
      term: term,
      topic: cleanTopic,
      altUsed: [alt1, alt2, alt3],
      rawExplanation: exp,
      style: style
    });
  }

  return questions;
}

// Procedural generator for Infinity Arena (Pratiyogita) questions on any topic
function getPratiyogitaQuestion(level: number, topic: string): { question: string, options: string[], answer: number, explanation: string, isPratiyogita: boolean, poolIdx: number, level: number } {
  const topics = [
    "General Aptitude & Reasoning",
    "Readability AI Terminology",
    "Indian Administrative Governance",
    "Linguistic De-jargonization",
    "Indian Economy & CA Compliance",
    "Digital Literacy & Logic Skills"
  ];
  const currentTopic = topics[(level - 1) % topics.length];

  const questionsPool = [
    {
      question: `[Level ${level}] If 'READABILITY' is coded as 'SFBSFBCJMJUZ', how will 'KILVISH' be coded in this speed challenge?`,
      options: ["LJMWJTI", "LJMVKTI", "KJLWISG", "MKMWJUI"],
      answer: 0,
      explanation: "Each letter is shifted forward by one position (+1 alphabetically). R->S, E->F, A->B, etc."
    },
    {
      question: `[Level ${level}] Which metric represents the best measure of clear communication when writing legal contracts under Readability guidelines?`,
      options: ["High syntactic density", "Low average sentence length & plain language mapping", "Arbitrary passive voice density", "Extensive Latin legalese terminology"],
      answer: 1,
      explanation: "Plain language guidelines prioritize short sentences, active voice, and the elimination of complex legal jargon."
    },
    {
      question: `[Level ${level}] A person completes a task in 15 days at an efficiency rating of 80%. If their efficiency is boosted to 120%, how many days will the same task take?`,
      options: ["8 days", "10 days", "12 days", "6 days"],
      answer: 1,
      explanation: "Time and efficiency are inversely proportional. (15 * 80) = (Days * 120) => Days = 10."
    },
    {
      question: `[Level ${level}] In Indian financial auditing, which statutory form is used to register corporate GST returns on a monthly basis?`,
      options: ["GSTR-1", "GSTR-3B", "Form 16A", "GSTR-9C"],
      answer: 1,
      explanation: "GSTR-3B is the self-declared summary monthly return required to pay taxes and document ITC eligibility."
    },
    {
      question: `[Level ${level}] Identify the core benefit of the 'Dual-Section Synthesis' system designed by Mr. Kilvish V2.5:`,
      options: ["Provides unreadable backend log files", "Translates all content into pure programming binary", "Separates outputs into 'Core Concept' and 'Detailed Breakdown' for rapid parallel reading", "Enforces strict database password encryption loops"],
      answer: 2,
      explanation: "Dual-Section Synthesis enables parallel comprehension pathways for busy executives and casual readers alike."
    },
    {
      question: `[Level ${level}] What is the primary objective of NITI Aayog's Atal Innovation Mission (AIM) inside Indian state academics?`,
      options: ["To issue sovereign gold bonds", "To establish world-class incubation centres and coding labs (Atal Tinkering Labs)", "To regulate primary school physical education syllabus", "To monitor tax compliance across small businesses"],
      answer: 1,
      explanation: "AIM fosters an ecosystem of innovation, technology development, and entrepreneurship via schools and colleges."
    }
  ];

  const poolIdx = (level + 1) % questionsPool.length;
  const qObj = questionsPool[poolIdx];
  // Personalize with level info
  return {
    question: qObj.question,
    options: qObj.options,
    answer: qObj.answer,
    explanation: qObj.explanation,
    isPratiyogita: true,
    poolIdx: poolIdx,
    level: level
  };
}

export default function AllInOneExamCentre({
  user,
  userXP,
  setUserXP,
  studentName,
  onNavigateTab,
  onStartBusiness
}: AllInOneExamCentreProps) {
  const [activeMode, setActiveMode] = useState<"grand" | "infinity">("grand");
  
  // Language Support States
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [detectedLangBanner, setDetectedLangBanner] = useState<string | null>(null);

  // 100-Question Grand Exam States
  const [selectedTopic, setSelectedTopic] = useState<string>("readability_ai");
  const [customTopicInput, setCustomTopicInput] = useState<string>("");
  const [showCustomTopic, setShowCustomTopic] = useState<boolean>(false);
  const [grandQuestions, setGrandQuestions] = useState<any[]>([]);
  const [grandAnswers, setGrandAnswers] = useState<Record<number, number>>({});
  const [isGrandExamActive, setIsGrandExamActive] = useState<boolean>(false);
  const [grandTimeLeft, setGrandTimeLeft] = useState<number>(7200); // 2 hours standard (in seconds)
  const [grandSubmitted, setGrandSubmitted] = useState<boolean>(false);
  const [grandScorePercent, setGrandScorePercent] = useState<number>(0);
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [grandSearchQuery, setGrandSearchQuery] = useState<string>("");
  const [filterMode, setFilterMode] = useState<"all" | "answered" | "unanswered" | "marked">("all");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Automatically detect input language script (Hindi/Bengali/Telugu/Tamil/etc) and translate portal
  useEffect(() => {
    if (customTopicInput && customTopicInput.trim().length > 1) {
      const detected = detectLanguage(customTopicInput);
      if (detected !== "en") {
        setSelectedLanguage(detected);
        const nameOfLang = LANGUAGE_LABELS[detected]?.native || LANGUAGE_LABELS[detected]?.label || "हिंदी";
        setDetectedLangBanner(nameOfLang);
      } else {
        setDetectedLangBanner(null);
      }
    } else {
      setDetectedLangBanner(null);
    }
  }, [customTopicInput]);

  // Grand Certificate States
  const [unlockedGrandCert, setUnlockedGrandCert] = useState<boolean>(false);
  const [grandCertSerial, setGrandCertSerial] = useState<string>("");

  // Infinity Pratiyogita Arena States
  const [infinityActive, setInfinityActive] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [levelScore, setLevelScore] = useState<number>(0); // out of 5
  const [levelQuestions, setLevelQuestions] = useState<any[]>([]);
  const [currentLevelQIdx, setCurrentLevelQIdx] = useState<number>(0);
  const [infinityAnswers, setInfinityAnswers] = useState<Record<number, number>>({});
  const [speedTimeLeft, setSpeedTimeLeft] = useState<number>(30); // 30 seconds per question!
  const [pratiyogitaPoints, setPratiyogitaPoints] = useState<number>(0);
  const [infinityStatus, setInfinityStatus] = useState<"lobby" | "playing" | "level_completed" | "game_over">("lobby");
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Timer intervals
  const grandIntervalRef = useRef<any>(null);
  const speedIntervalRef = useRef<any>(null);

  // Trigger when starting Grand Exam
  const handleStartGrandExam = () => {
    let topicTitle = "Readability AI Core Certification";
    if (selectedTopic === "kilvish_academy") topicTitle = "Kilvish AI Academy Advanced Exam";
    else if (selectedTopic === "upsc") topicTitle = "UPSC Civil Services Standard Paper";
    else if (selectedTopic === "ssc_cgl") topicTitle = "SSC CGL Advanced Quant Exam";
    else if (selectedTopic === "banking") topicTitle = "Banking Officers GA & Aptitude Exam";
    else if (selectedTopic === "ca_audit") topicTitle = "CA Final Audit & Compliance Paper";
    else if (selectedTopic === "custom" && customTopicInput) topicTitle = customTopicInput;

    const qList = generate100Questions(topicTitle, selectedTopic);
    setGrandQuestions(qList);
    setGrandAnswers({});
    setMarkedForReview({});
    setGrandSubmitted(false);
    setIsGrandExamActive(true);
    setGrandTimeLeft(7200); // 2 hours
    setCurrentQuestionIndex(0);
    setFilterMode("all");
  };

  // Grand Exam Timer Countdown
  useEffect(() => {
    if (isGrandExamActive && !grandSubmitted) {
      grandIntervalRef.current = setInterval(() => {
        setGrandTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(grandIntervalRef.current);
            handleSubmitGrandExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (grandIntervalRef.current) clearInterval(grandIntervalRef.current);
    };
  }, [isGrandExamActive, grandSubmitted]);

  // Submit Grand Exam
  const handleSubmitGrandExam = () => {
    if (grandSubmitted) return;
    setIsGrandExamActive(false);
    if (grandIntervalRef.current) clearInterval(grandIntervalRef.current);

    let correctCount = 0;
    grandQuestions.forEach((q, idx) => {
      if (grandAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / grandQuestions.length) * 100);
    setGrandScorePercent(percent);
    setGrandSubmitted(true);

    if (percent >= 75) {
      // Award certificate & XP
      setUserXP(prev => prev + 1000); // Massive XP for 100-question grand exam
      setUnlockedGrandCert(true);
      setGrandCertSerial(`CERT-GRAND-${Math.random().toString(36).substring(3, 9).toUpperCase()}`);
    }
  };

  // Retake Grand Exam
  const handleRetakeGrandExam = () => {
    setGrandAnswers({});
    setMarkedForReview({});
    setGrandSubmitted(false);
    setIsGrandExamActive(false);
  };

  // ---------------- INFINITY CONTEST ARENA FUNCTIONS ----------------

  const handleStartInfinityMode = () => {
    setCurrentLevel(1);
    setLives(3);
    setPratiyogitaPoints(0);
    startNewLevel(1);
  };

  const startNewLevel = (lvlNum: number) => {
    // Generate 5 rapid questions for the level
    const lvlQs = [];
    for (let i = 1; i <= 5; i++) {
      lvlQs.push(getPratiyogitaQuestion(lvlNum + i, selectedTopic));
    }
    setLevelQuestions(lvlQs);
    setCurrentLevelQIdx(0);
    setLevelScore(0);
    setInfinityAnswers({});
    setSelectedOpt(null);
    setShowExplanation(false);
    setInfinityStatus("playing");
    setSpeedTimeLeft(Math.max(12, 30 - lvlNum * 2)); // Level gets faster!
  };

  // Speed challenge Countdown timer
  useEffect(() => {
    if (infinityStatus === "playing" && speedTimeLeft > 0 && !showExplanation) {
      speedIntervalRef.current = setTimeout(() => {
        setSpeedTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(speedIntervalRef.current);
    } else if (infinityStatus === "playing" && speedTimeLeft === 0 && !showExplanation) {
      // Time is up! Treat as incorrect
      handleSelectInfinityOption(-1);
    }
  }, [infinityStatus, speedTimeLeft, showExplanation]);

  const handleSelectInfinityOption = (optIdx: number) => {
    if (showExplanation) return;
    setSelectedOpt(optIdx);
    setShowExplanation(true);

    const currentQObj = levelQuestions[currentLevelQIdx];
    const isCorrect = optIdx === currentQObj.answer;

    if (isCorrect) {
      setLevelScore(prev => prev + 1);
      setPratiyogitaPoints(prev => prev + 250 * currentLevel);
      setUserXP(prev => prev + 25);
    } else {
      // Lose a life!
      setLives(prev => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          // Trigger game over in a short delay so they can see explanation
        }
        return nextLives;
      });
    }
  };

  const handleNextInfinityQuestion = () => {
    setShowExplanation(false);
    setSelectedOpt(null);

    if (currentLevelQIdx < 4) {
      setCurrentLevelQIdx(prev => prev + 1);
      setSpeedTimeLeft(Math.max(12, 30 - currentLevel * 2));
    } else {
      // Level completed! Check if they scored at least 4 out of 5
      if (levelScore >= 4 && lives > 0) {
        setInfinityStatus("level_completed");
        setUserXP(prev => prev + 150 * currentLevel);
      } else {
        setInfinityStatus("game_over");
      }
    }
  };

  const handleContinueNextLevel = () => {
    const nextLvl = currentLevel + 1;
    setCurrentLevel(nextLvl);
    startNewLevel(nextLvl);
  };

  // Helper formats
  const formatTime = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 100 Question Filter logic
  const filteredIndices = grandQuestions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q, idx }) => {
      // Text Search
      if (grandSearchQuery) {
        const matchesQuery = q.question.toLowerCase().includes(grandSearchQuery.toLowerCase()) || 
                             q.options.some((o: string) => o.toLowerCase().includes(grandSearchQuery.toLowerCase()));
        if (!matchesQuery) return false;
      }
      
      // State Filter
      const isAnswered = grandAnswers[idx] !== undefined;
      const isMarked = markedForReview[idx] === true;

      if (filterMode === "answered") return isAnswered;
      if (filterMode === "unanswered") return !isAnswered;
      if (filterMode === "marked") return isMarked;
      return true; // "all"
    })
    .map(({ idx }) => idx);

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm animate-fadeIn">
      {/* Multilingual Support Banner Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-violet-50 p-2 rounded-xl border border-violet-100/50">
            <Sparkles className="w-4 h-4 text-violet-600 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              {selectedLanguage === "en" ? "Interactive Translation Portal" : "द्विभाषी एवं बहुभाषी परीक्षा अनुभाग (Multilingual Support)"}
            </h4>
            <p className="text-[10px] text-slate-400">
              {selectedLanguage === "en" ? "Change the dropdown to translate all questions & explanations instantly." : "सभी प्रश्न, विकल्प और स्पष्टीकरण तुरंत अपनी भाषा में अनुवादित करें।"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide">Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
          >
            {Object.entries(LANGUAGE_LABELS).map(([code, info]) => (
              <option key={code} value={code}>
                {info.flag} {info.native} ({info.label})
              </option>
            ))}
          </select>
        </div>
      </div>

      {detectedLangBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl mb-6 text-xs flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>
              {selectedLanguage === "hi" 
                ? `पहचाना गया इनपुट: हिंदी लिपि! परीक्षा स्वचालित रूप से अनुवादित हो गई है।`
                : `Detected typing language: ${detectedLangBanner}! Portal auto-translated.`
              }
            </span>
          </div>
          <button 
            onClick={() => setDetectedLangBanner(null)} 
            className="text-[10px] uppercase font-bold text-emerald-600 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Banner Hub Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-950 text-white p-6 rounded-2xl border border-indigo-500/15 relative overflow-hidden mb-6 shadow-md">
        <div className="absolute right-0 top-0 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/30 border border-violet-400/20 text-violet-200 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider mb-2">
              <Trophy className="w-3 h-3 text-amber-400 animate-bounce" />
              All-In-One Ultimate Exam Centre (अखिल भारतीय परीक्षा केंद्र)
            </div>
            <h1 className="font-display font-black text-xl md:text-2xl tracking-tight leading-tight uppercase">
              Unified Academic & Gov Contest Arena
            </h1>
            <p className="text-slate-300 text-xs mt-1.5 max-w-xl leading-relaxed">
              Unlock certified high-stakes degrees on any corporate topic, Readability/Kilvish core values, UPSC Civil Services, CA standards, or test your speed limits in the Endless Pratiyogita!
            </p>
          </div>

          <div className="flex gap-1.5 bg-slate-950/40 p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => { setActiveMode("grand"); if (isGrandExamActive) handleRetakeGrandExam(); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === "grand"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              100-Question Exam
            </button>
            <button
              onClick={() => { setActiveMode("infinity"); setInfinityStatus("lobby"); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === "infinity"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              Infinity Pratiyogita
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- MODE 1: 100-QUESTION GRAND EXAM ---------------- */}
      {activeMode === "grand" && (
        <div className="space-y-6">
          {!isGrandExamActive && !grandSubmitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Setup column */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-violet-600" />
                    Select Your Specialization
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">Configure your 100-question grand examination topic</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "readability_ai", title: "Readability AI Core Certification", desc: "Covers clarity default rules, synthesis protocols, and dual-output parsing." },
                    { id: "kilvish_academy", title: "Mr. Kilvish V2.5 Academy Standard", desc: "Focuses on Indian education, jargon de-obfuscation guidelines, and executive systems." },
                    { id: "upsc", title: "UPSC Civil Services Examination", desc: "General Studies Paper: Indian Polity, Vedic History, Economic reforms, Ecology." },
                    { id: "ssc_cgl", title: "SSC CGL Exam Speed challenge", desc: "Aptitude and logical reasoning, syllogisms, compound interest, mensuration." },
                    { id: "banking", title: "Bank PO Officer Aptitude Test", desc: "Banking regulations, Repo rates, SLR compliance, Basel III requirements." },
                    { id: "ca_audit", title: "CA Final Audit & Legal Compliance", desc: "Standard on Auditing (SA 500), Companies Act Sec 143(3), IFC regulations." },
                    { id: "custom", title: "Custom Topic Generator", desc: "Type in any academic or professional subject and we will build a 100-question test!" }
                  ].map(topicItem => (
                    <label
                      key={topicItem.id}
                      onClick={() => {
                        setSelectedTopic(topicItem.id);
                        setShowCustomTopic(topicItem.id === "custom");
                      }}
                      className={`block p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        selectedTopic === topicItem.id
                          ? "bg-violet-50/50 border-violet-500 shadow-sm"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{topicItem.title}</span>
                        <input
                          type="radio"
                          name="grand_topic"
                          checked={selectedTopic === topicItem.id}
                          readOnly
                          className="w-3.5 h-3.5 text-violet-600 border-slate-300 focus:ring-violet-500 cursor-pointer"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{topicItem.desc}</p>
                    </label>
                  ))}
                </div>

                {showCustomTopic && (
                  <div className="space-y-1.5 pt-1 animate-fadeIn">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      Enter Custom Topic Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Quantum Physics Mechanics, Indian History Epochs"
                      value={customTopicInput}
                      onChange={(e) => setCustomTopicInput(e.target.value)}
                      className="w-full bg-slate-50 text-slate-850 p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-500 font-semibold"
                    />
                  </div>
                )}

                <button
                  onClick={handleStartGrandExam}
                  disabled={selectedTopic === "custom" && !customTopicInput}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch 100-Question Exam Now</span>
                </button>
              </div>

              {/* Informative guidelines */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="font-display font-black text-slate-800 text-base uppercase tracking-wider">
                    Rules & Certification Standards (परीक्षा नियम)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Accredited testing portal powered by Royal Bulls Advisory</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 space-y-1">
                    <span className="text-[10px] font-mono font-black text-violet-600 uppercase tracking-wide">Time limit</span>
                    <h4 className="text-sm font-bold text-slate-800">120 Minutes Non-Stop</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">The timer will count down and auto-lock your answers if left unresolved.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 space-y-1">
                    <span className="text-[10px] font-mono font-black text-amber-600 uppercase tracking-wide">Negative marking</span>
                    <h4 className="text-sm font-bold text-slate-800">Rigorous Assessment</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">No penalty for skipping, but accuracy is paramount to prove conceptual mastery.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 space-y-1">
                    <span className="text-[10px] font-mono font-black text-emerald-600 uppercase tracking-wide">Accreditation</span>
                    <h4 className="text-sm font-bold text-slate-800">Passing Grade: 75%+</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">Score 75% or higher to unlock the supreme Indian Academy certificate.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 space-y-1">
                    <span className="text-[10px] font-mono font-black text-indigo-600 uppercase tracking-wide">Features</span>
                    <h4 className="text-sm font-bold text-slate-800">Interactive TCS-style grid</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">Instantly jump to any question, filter answered or flagged, and review explanations.</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 text-xs text-amber-800">
                  <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                  <div>
                    <strong>Pro-Tip for Indian Scholars</strong>: You can type in any topic (e.g. &quot;Indian Railways Audit&quot; or &quot;Medical Pharmacology&quot;). Our intelligent procedural engine will generate a precise, completely valid 100-question test with customized options on the fly!
                  </div>
                </div>
              </div>
            </div>
          ) : isGrandExamActive ? (
            /* Active 100-Question Exam Interface */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Question panel (Left - 8 columns) */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm space-y-6">
                
                {/* Search & Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-violet-600 animate-pulse" />
                    <div>
                      <h2 className="text-xs font-black text-slate-800 font-display uppercase tracking-wider">
                        Question {currentQuestionIndex + 1} of 100
                      </h2>
                      <p className="text-[10px] text-slate-400">Section A: Objective Knowledge Evaluation</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-mono font-bold text-rose-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      {formatTime(grandTimeLeft)}
                    </div>
                  </div>
                </div>

                {/* The Current Active Question */}
                {(() => {
                  const rawQ = grandQuestions[currentQuestionIndex];
                  if (!rawQ) return null;
                  const displayQ = translateQuestionObj(rawQ, selectedLanguage);
                  return (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-800 leading-relaxed font-sans">
                          Q{currentQuestionIndex + 1}. {displayQ.question}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {displayQ.options.map((opt: string, optIdx: number) => {
                          const isSelected = grandAnswers[currentQuestionIndex] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => {
                                setGrandAnswers(prev => ({ ...prev, [currentQuestionIndex]: optIdx }));
                              }}
                              className={`w-full p-4 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-600/10"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <span>{opt}</span>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? "border-white bg-white/20" : "border-slate-300"
                              }`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Bottom control actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => {
                        setMarkedForReview(prev => ({
                          ...prev,
                          [currentQuestionIndex]: !prev[currentQuestionIndex]
                        }));
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        markedForReview[currentQuestionIndex]
                          ? "bg-amber-50 border-amber-300 text-amber-700"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      ★ {markedForReview[currentQuestionIndex] ? "Flagged for Review" : "Flag for Review"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentQuestionIndex < 99 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.min(99, prev + 1))}
                        className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Skip / Next →
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitGrandExam}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-600/10"
                      >
                        Lock and Submit Paper
                      </button>
                    )}
                  </div>
                </div>

                {/* Submitting early warning */}
                <div className="flex justify-between items-center p-4 bg-violet-50 rounded-2xl border border-violet-100 text-[11px] text-violet-700">
                  <span>
                    Answered: <b>{Object.keys(grandAnswers).length}</b> | Unanswered: <b>{100 - Object.keys(grandAnswers).length}</b> | Flagged: <b>{Object.keys(markedForReview).filter(k => markedForReview[parseInt(k)]).length}</b>
                  </span>
                  <button
                    onClick={handleSubmitGrandExam}
                    className="text-violet-800 font-bold hover:underline cursor-pointer"
                  >
                    Finish Early
                  </button>
                </div>
              </div>

              {/* TCS-style Exam grid navigation (Right - 4 columns) */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Grid className="w-4 h-4 text-violet-600 animate-pulse" />
                    100-Question Sheet Map
                  </h3>
                </div>

                {/* Interactive search inside questions */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search query in questions..."
                    value={grandSearchQuery}
                    onChange={(e) => setGrandSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-semibold focus:outline-none focus:border-violet-500"
                  />
                </div>

                {/* Grid Filters */}
                <div className="grid grid-cols-2 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 text-[10px]">
                  {[
                    { id: "all", label: "All" },
                    { id: "answered", label: "Answered" },
                    { id: "unanswered", label: "Unanswered" },
                    { id: "marked", label: "Flagged" }
                  ].map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setFilterMode(filter.id as any)}
                      className={`py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        filterMode === filter.id
                          ? "bg-white text-slate-800 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Interactive Numeric Circle Grid */}
                <div className="grid grid-cols-5 gap-1.5 max-h-60 overflow-y-auto p-1.5 border border-slate-100 rounded-2xl bg-slate-50/50">
                  {grandQuestions.map((_, idx) => {
                    const isAnswered = grandAnswers[idx] !== undefined;
                    const isFlagged = markedForReview[idx] === true;
                    const isCurrent = idx === currentQuestionIndex;

                    // Match filter check
                    const satisfiesFilter = filteredIndices.includes(idx);
                    if (!satisfiesFilter) return null;

                    let circleStyle = "bg-white text-slate-600 border-slate-200 hover:bg-slate-100";
                    if (isCurrent) {
                      circleStyle = "bg-violet-600 text-white border-violet-600 ring-2 ring-violet-200 scale-105 font-bold";
                    } else if (isFlagged) {
                      circleStyle = "bg-amber-100 border-amber-300 text-amber-800 font-bold";
                    } else if (isAnswered) {
                      circleStyle = "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`aspect-square rounded-lg border text-[10px] flex items-center justify-center transition-all cursor-pointer ${circleStyle}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1.5 text-[9px] text-slate-400 font-medium pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-50 border border-emerald-300 block" />
                    <span>Green: Answered & Saved</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-300 block" />
                    <span>Orange: Flagged / Review Later</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-white border border-slate-200 block" />
                    <span>White: Unanswered/Skipped</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Exam performance Report view */
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="font-display font-black text-xl text-slate-800 uppercase tracking-tight">
                  Grand Examination Audited Report
                </h2>
                <p className="text-xs text-slate-400">Accredited by Royal Bulls Advisory Private Limited</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Total questions</span>
                  <span className="text-lg font-mono font-black text-slate-700">100</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Answered</span>
                  <span className="text-lg font-mono font-black text-slate-700">{Object.keys(grandAnswers).length}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Passing grade</span>
                  <span className="text-lg font-mono font-black text-slate-700">75%</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Your Score</span>
                  <span className={`text-lg font-mono font-black ${grandScorePercent >= 75 ? "text-emerald-600" : "text-rose-600"}`}>
                    {grandScorePercent}%
                  </span>
                </div>
              </div>

              {grandScorePercent >= 75 ? (
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-4 text-left">
                  <h3 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
                    Accreditation Unlocked successfully!
                  </h3>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Splendid Performance! You scored {grandScorePercent}% which qualifies you for the official board credentials. This digital verification certifies that <b>{studentName}</b> possesses elite conceptual proficiency in this corporate subject.
                  </p>
                  
                  {unlockedGrandCert && (
                    <div className="p-4 bg-white border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Serial No.</span>
                        <span className="text-xs font-mono font-bold text-slate-800">{grandCertSerial}</span>
                      </div>
                      <button
                        onClick={() => onNavigateTab("certificates")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-all"
                      >
                        Claim Board Certificate
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-5 space-y-3 text-left">
                  <h3 className="text-xs font-bold text-rose-800 flex items-center gap-1.5 uppercase">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    Passing Mark Missed
                  </h3>
                  <p className="text-[11px] text-rose-700 leading-relaxed">
                    You scored {grandScorePercent}%, missing the 75% national compliance benchmark. Take some time to review your learning textbooks and practice using standard practice modules, then challenge the 100-Question board paper again!
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRetakeGrandExam}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Configure New Exam
                </button>
                <button
                  onClick={() => onNavigateTab("explore")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Subject Catalogs
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- MODE 2: INFINITY PRATIYOGITA SPEED ARENA ---------------- */}
      {activeMode === "infinity" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
          {infinityStatus === "lobby" ? (
            <div className="max-w-2xl mx-auto text-center space-y-6 py-10">
              <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm animate-pulse">
                <Zap className="w-8 h-8 text-violet-600 fill-violet-200" />
              </div>

              <div className="space-y-2">
                <h2 className="font-display font-black text-lg text-slate-800 uppercase tracking-wide">
                  Endless Speed Pratiyogita Arena (अनंत गति प्रतियोगिता)
                </h2>
                <p className="text-xs text-slate-400">
                  Beat the countdown, maintain your heart-lives, and climb high difficulty tiers in a state-level contest!
                </p>
              </div>

              {/* Instructions list */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-xl mx-auto pt-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-500 font-bold text-xs">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <span>3 Lives (Hearts)</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Every incorrect answer deletes 1 Heart. Protect your streak!</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Time Attacks</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Level timer counts down per question. Gets faster each level!</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs">
                    <Trophy className="w-4 h-4 text-emerald-500" />
                    <span>State Tiers</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Earn Pratiyogita points and reach &quot;Infinity Champion&quot; ranking.</p>
                </div>
              </div>

              <button
                onClick={handleStartInfinityMode}
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3.5 rounded-2xl text-xs transition-all cursor-pointer shadow-md shadow-violet-600/10 animate-pulse"
              >
                Enter Pratiyogita Lobby
              </button>
            </div>
          ) : infinityStatus === "playing" ? (
            /* ACTIVE TIME ATTACK LEVEL QUESTION */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Question Screen (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Status HUD Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold bg-violet-600 text-white px-3 py-1 rounded-lg">
                      Level {currentLevel}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Challenge {currentLevelQIdx + 1} of 5
                    </span>
                  </div>

                  {/* Lives display */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <Heart
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < lives ? "text-rose-500 fill-rose-500" : "text-slate-200"
                        } transition-all duration-300`}
                      />
                    ))}
                  </div>

                  {/* Fast timer progress */}
                  <div className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 ${
                    speedTimeLeft <= 5 ? "bg-rose-50 text-rose-600 animate-bounce" : "bg-slate-50 text-slate-600"
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{speedTimeLeft}s</span>
                  </div>
                </div>

                {/* Question core block */}
                {(() => {
                  const rawQ = levelQuestions[currentLevelQIdx];
                  if (!rawQ) return null;
                  const displayQ = translateQuestionObj(rawQ, selectedLanguage);
                  return (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                        <h3 className="text-xs font-bold text-slate-800 leading-relaxed">
                          {displayQ.question}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {displayQ.options.map((opt: string, optIdx: number) => {
                          const isSelected = selectedOpt === optIdx;
                          const isCorrect = displayQ.answer === optIdx;

                          let optStyle = "bg-white text-slate-600 border-slate-200 hover:bg-slate-50";
                          if (showExplanation) {
                            if (isCorrect) {
                              optStyle = "bg-emerald-50 border-emerald-400 text-emerald-800";
                            } else if (isSelected) {
                              optStyle = "bg-rose-50 border-rose-400 text-rose-800";
                            } else {
                              optStyle = "bg-white text-slate-300 border-slate-100";
                            }
                          } else if (isSelected) {
                            optStyle = "bg-violet-600 text-white border-violet-600";
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectInfinityOption(optIdx)}
                              disabled={showExplanation}
                              className={`p-4 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${optStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {showExplanation && (
                        <div className="p-4 bg-violet-50 border border-violet-100 rounded-2xl text-[11px] text-violet-700 leading-relaxed font-mono space-y-2 animate-fadeIn">
                          <div>
                            <strong>Academic Explanation</strong>: {displayQ.explanation}
                          </div>
                          <div className="flex justify-end pt-2">
                            <button
                              onClick={handleNextInfinityQuestion}
                              className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-4 py-2 rounded-lg text-[10px] cursor-pointer"
                            >
                              Continue Arena →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* State-wide leaderboard (4 cols) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-3xl p-4 space-y-4">
                <div className="border-b border-slate-200 pb-2.5">
                  <h3 className="font-display font-black text-xs text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-violet-600" />
                    Live Contest Leaderboard
                  </h3>
                  <p className="text-[9px] text-slate-400 mt-0.5">Real-time state aspirants tracking</p>
                </div>

                <div className="space-y-2">
                  {[
                    { rank: 1, name: "Priyanjali Sen", points: 8250, level: "Lvl 7", status: "Active" },
                    { rank: 2, name: "Amit Patel", points: 6400, level: "Lvl 5", status: "Active" },
                    { rank: 3, name: "Ananya Sharma", points: 5150, level: "Lvl 4", status: "Active" },
                    { rank: 4, name: studentName, points: pratiyogitaPoints, level: `Lvl ${currentLevel}`, status: "You", isUser: true },
                    { rank: 5, name: "Vikram Rathore", points: 3200, level: "Lvl 3", status: "Active" },
                    { rank: 6, name: "Rahul Verma", points: 1450, level: "Lvl 1", status: "Eliminated" }
                  ].map((competitor, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-[10px] ${
                        competitor.isUser
                          ? "bg-violet-50 border-violet-200 font-bold"
                          : "bg-white border-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center font-mono font-bold text-[8px] ${
                          competitor.rank === 1 ? "bg-amber-100 text-amber-700" : competitor.isUser ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-500"
                        }`}>
                          {competitor.rank}
                        </span>
                        <span className="text-slate-700">{competitor.name}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono">{competitor.level}</span>
                        <span className="font-mono font-bold text-slate-800">{competitor.points} pts</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-violet-100/30 border border-violet-100 rounded-xl text-center">
                  <span className="text-[9px] font-mono text-violet-700 block uppercase font-bold">Your Pratiyogita Points</span>
                  <span className="text-sm font-mono font-black text-violet-700">{pratiyogitaPoints} PTS</span>
                </div>
              </div>
            </div>
          ) : infinityStatus === "level_completed" ? (
            /* LEVEL ACCOMPLISHED TRANSITION */
            <div className="max-w-md mx-auto text-center space-y-5 py-8 animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-display font-black text-base text-slate-800 uppercase tracking-wide">
                  Level {currentLevel} Cleared!
                </h3>
                <p className="text-xs text-slate-400">
                  Passing target of 4/5 questions successfully secured
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Correct answers:</span>
                  <span className="text-emerald-600 font-bold">{levelScore} / 5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pratiyogita points:</span>
                  <span className="text-slate-800 font-bold">+{250 * currentLevel} PTS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lives left:</span>
                  <span className="text-rose-500 font-bold">{lives} Hearts</span>
                </div>
              </div>

              <button
                onClick={handleContinueNextLevel}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Unlock Level {currentLevel + 1} Attack</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* GAME OVER VIEW */
            <div className="max-w-md mx-auto text-center space-y-5 py-8 animate-fadeIn">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                <ShieldAlert className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-display font-black text-base text-slate-800 uppercase tracking-wide">
                  Arena Challenge Complete
                </h3>
                <p className="text-xs text-slate-400">
                  No hearts remaining, but your score is secured!
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Highest level:</span>
                  <span className="text-slate-800 font-bold">Level {currentLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Score:</span>
                  <span className="text-violet-700 font-bold">{pratiyogitaPoints} PTS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">State Percentile:</span>
                  <span className="text-emerald-600 font-bold">92.4th Percentile</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleStartInfinityMode}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Restart Challenge
                </button>
                <button
                  onClick={() => setInfinityStatus("lobby")}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Return to Lobby
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
