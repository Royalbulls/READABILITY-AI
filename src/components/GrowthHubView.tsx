import React, { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  Coins, 
  Share2, 
  Award, 
  BookOpen, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  AlertCircle, 
  ArrowRight, 
  Upload, 
  Eye, 
  Download, 
  Shield, 
  Heart, 
  DollarSign, 
  Check, 
  Edit, 
  Plus, 
  Search, 
  Mail, 
  Compass, 
  Lock, 
  User, 
  Copy, 
  ChevronRight,
  RefreshCw,
  Sliders,
  Play,
  Settings,
  HelpCircle,
  Youtube,
  Instagram,
  Facebook,
  Github,
  Globe,
  Link,
  Phone,
  Languages,
  CheckCircle,
  Clock,
  Activity,
  ShoppingBag,
  Star
} from "lucide-react";
import { User as FirebaseUser } from "../lib/firebase";
import { UserProfile, CreatorProduct } from "../types";

interface GrowthHubViewProps {
  user: FirebaseUser;
  userProfile: UserProfile | null;
  onRefreshProfile: () => void;
}

export default function GrowthHubView({ user, userProfile, onRefreshProfile }: GrowthHubViewProps) {
  // Navigation tabs in Creator Hub
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "profile" | "creator" | "marketplace" | "launch" | "earnings" | "referrals" | "admin"
  >("dashboard");

  // General States
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Module 1: Creator Profile Form
  const [profilePhoto, setProfilePhoto] = useState(userProfile?.creatorProfile?.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80");
  const [coverBanner, setCoverBanner] = useState(userProfile?.creatorProfile?.coverBanner || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80");
  const [displayName, setDisplayName] = useState(userProfile?.creatorProfile?.displayName || userProfile?.displayName || "");
  const [username, setUsername] = useState(userProfile?.creatorProfile?.username || userProfile?.email.split("@")[0] || "");
  const [bio, setBio] = useState(userProfile?.creatorProfile?.bio || "AI Educator & Content Creator translating complexity for global learners.");
  const [skills, setSkills] = useState(userProfile?.creatorProfile?.skills?.join(", ") || "AI, Research, Medicine, Law");
  const [category, setCategory] = useState(userProfile?.creatorProfile?.category || "Education");
  const [location, setLocation] = useState(userProfile?.creatorProfile?.location || "Global");
  const [website, setWebsite] = useState(userProfile?.creatorProfile?.website || "https://readability.cloud");
  const [twitter, setTwitter] = useState(userProfile?.creatorProfile?.socialLinks?.twitter || "");
  const [linkedin, setLinkedin] = useState(userProfile?.creatorProfile?.socialLinks?.linkedin || "");
  const [brandLogo, setBrandLogo] = useState(userProfile?.creatorProfile?.brandLogo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80");
  const [brandName, setBrandName] = useState(userProfile?.creatorProfile?.brandName || "Readability Labs");
  const [portfolio, setPortfolio] = useState(userProfile?.creatorProfile?.portfolio || "https://portfolio.readability.cloud");
  const [email, setEmail] = useState(userProfile?.creatorProfile?.email || userProfile?.email || "");
  const [phone, setPhone] = useState(userProfile?.creatorProfile?.phone || "+1 (555) 019-2834");
  const [languages, setLanguages] = useState(userProfile?.creatorProfile?.languages || "English, Hindi, Spanish");
  const [youtube, setYoutube] = useState(userProfile?.creatorProfile?.socialLinks?.youtube || "");
  const [instagram, setInstagram] = useState(userProfile?.creatorProfile?.socialLinks?.instagram || "");
  const [facebook, setFacebook] = useState(userProfile?.creatorProfile?.socialLinks?.facebook || "");
  const [github, setGithub] = useState(userProfile?.creatorProfile?.socialLinks?.github || "");
  const [personalDomain, setPersonalDomain] = useState(userProfile?.creatorProfile?.personalDomain || "jane-doe.com");

  // Module 3: AI Creator Workspace State
  const [genTopic, setGenTopic] = useState("");
  const [contentType, setContentType] = useState("course");
  const [audience, setAudience] = useState("General Public");
  const [vocabLevel, setVocabLevel] = useState("student");
  const [tone, setTone] = useState("inspirational");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState("");
  const [editedTitle, setEditedTitle] = useState("");

  // Product Listings & Marketplace States
  const [allProducts, setAllProducts] = useState<CreatorProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CreatorProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [productPrice, setProductPrice] = useState(10);
  const [productStatus, setProductStatus] = useState<"free" | "paid" | "draft">("free");

  // Referral / Affiliate States
  const [refCodeInput, setRefCodeInput] = useState("");
  const [refError, setRefError] = useState("");
  const [refSuccess, setRefSuccess] = useState("");

  // Media Kit bio length
  const [bioLength, setBioLength] = useState<"short" | "long" | "speaker">("short");

  // Earnings/Withdraw States
  const [withdrawAmount, setWithdrawAmount] = useState(100);
  const [walletTxLoading, setWalletTxLoading] = useState(false);

  // Admin approval states (to manage creators)
  const [allUsersList, setAllUsersList] = useState<any[]>([]);
  const [adminActionLoading, setAdminActionLoading] = useState(false);

  const isAdmin = userProfile?.role === "admin";

  // Initial Data Fetch
  useEffect(() => {
    fetchProducts();
    if (userProfile?.role === "admin") {
      fetchAdminUsers();
    }
  }, [userProfile]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch("/api/creator/products");
      if (res.ok) {
        const data = await res.json();
        setAllProducts(data);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAllUsersList(data);
      }
    } catch (err) {
      console.error("Admin user load failed", err);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Module 1: Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const payload = {
        photo: profilePhoto,
        coverBanner,
        displayName,
        username,
        bio,
        skills: skills.split(",").map(s => s.trim()).filter(Boolean),
        category,
        location,
        website,
        brandLogo,
        brandName,
        portfolio,
        email,
        phone,
        languages,
        socialLinks: { twitter, linkedin, youtube, instagram, facebook, github, personalDomain }
      };

      const token = await user.getIdToken();
      const res = await fetch("/api/creator/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccessMsg("Your creator profile was successfully persisted!");
        onRefreshProfile();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to persist creator credentials.");
      }
    } catch (err) {
      setErrorMsg("Network or database error updating profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Module 3: Handle AI Creator Workspace Generation
  const handleAIGenerate = async () => {
    if (!genTopic.trim()) {
      setErrorMsg("Please specify a topic or keyword to conceptualize.");
      return;
    }

    setIsGenerating(true);
    setSuccessMsg("");
    setErrorMsg("");
    setGeneratedResult("");

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/creator/ai-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: contentType,
          topic: genTopic,
          audience,
          level: vocabLevel,
          tone
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedResult(data.text);
        setEditedTitle(`Advanced Jargon-Free Guide to ${genTopic.charAt(0).toUpperCase() + genTopic.slice(1)}`);
        setSuccessMsg("AI content was masterfully crafted and loaded below.");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to generate AI creator asset.");
      }
    } catch (err) {
      setErrorMsg("Error communicating with the generation server.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Module 4: Publish asset to Marketplace
  const handlePublishAsset = async () => {
    if (!generatedResult) return;
    setIsSaving(true);
    try {
      const token = await user.getIdToken();
      const payload = {
        title: editedTitle || `Jargon-Free Guide: ${genTopic}`,
        description: `District level master resource for ${genTopic}. Comprehensible and actionable structure.`,
        contentType,
        category: "Education",
        status: productStatus,
        price: productStatus === "free" ? 0 : productPrice,
        content: generatedResult,
        creatorName: userProfile?.creatorProfile?.displayName || userProfile?.displayName || "Anonymous Creator",
        creatorUsername: userProfile?.creatorProfile?.username || "creator"
      };

      const res = await fetch("/api/creator/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccessMsg("Asset successfully published in the Marketplace!");
        setGeneratedResult("");
        setGenTopic("");
        fetchProducts();
      } else {
        setErrorMsg("Failed to list product inside catalog.");
      }
    } catch (err) {
      setErrorMsg("Publishing error.");
    } finally {
      setIsSaving(false);
    }
  };

  // Module 4: Buy Product
  const handlePurchaseProduct = async (productId: string) => {
    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/creator/product/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      if (res.ok) {
        setSuccessMsg("Congratulations! Asset unlocked successfully.");
        onRefreshProfile();
        fetchProducts();
        // Set selected product to show content
        const prod = allProducts.find(p => p.id === productId);
        if (prod) {
          setSelectedProduct({ ...prod, downloadsCount: prod.downloadsCount + 1 });
        }
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Purchase transaction failed.");
      }
    } catch (err) {
      setErrorMsg("Transaction checkout error.");
    } finally {
      setIsSaving(false);
    }
  };

  // Module 11: Admin Approval Control
  const handleAdminApprove = async (creatorId: string, approved: boolean, verified: boolean) => {
    setAdminActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/creator/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          creatorId,
          updates: {
            creatorApproved: approved,
            verified: verified
          }
        })
      });

      if (res.ok) {
        setSuccessMsg(`Creator status updated successfully.`);
        fetchAdminUsers();
      } else {
        setErrorMsg("Failed to perform admin operation.");
      }
    } catch (err) {
      setErrorMsg("Admin dispatch error.");
    } finally {
      setAdminActionLoading(false);
    }
  };

  // Module 7: Apply Referral
  const handleApplyReferralCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refCodeInput.trim()) return;
    setRefError("");
    setRefSuccess("");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/user/apply-referral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code: refCodeInput })
      });

      if (res.ok) {
        setRefSuccess("Referral code claimed! +15 bonus credits allocated to your workspace wallet.");
        setRefCodeInput("");
        onRefreshProfile();
      } else {
        const data = await res.json();
        setRefError(data.error || "Failed to verify referral coupon.");
      }
    } catch (err) {
      setRefError("Network error checking referral code.");
    }
  };

  // Filtered products
  const filteredProducts = allProducts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.contentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.creatorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || p.contentType.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Calculate stats
  const creatorProducts = allProducts.filter(p => p.creatorId === userProfile?.uid);
  const walletBalance = userProfile?.walletBalance || 0;
  const referralEarnings = (userProfile?.referralsCount || 0) * 15;
  const followersCount = userProfile?.creatorProfile?.followers?.length || 0;
  
  const totalViews = creatorProducts.reduce((sum, p) => sum + (p.viewsCount || 0), 0) + (userProfile?.creatorProfile?.viewsCount || 0);
  const totalDownloads = creatorProducts.reduce((sum, p) => sum + (p.downloadsCount || 0), 0);
  const totalSalesRevenue = creatorProducts.reduce((sum, p) => sum + ((p.downloadsCount || 0) * p.price), 0);

  // Dynamic Onboarding Progression Levels
  const hasProfile = !!userProfile?.creatorProfile?.username;
  const hasProducts = creatorProducts.length > 0;

  let currentLevel = 1;
  let levelName = "Level 1: Novice Reader";
  let levelProgressPercent = 15;
  let levelDescription = "Set up your public Creator Profile to unlock the AI Content Generator.";

  if (hasProfile) {
    if (hasProducts) {
      currentLevel = 3;
      levelName = "Level 3: Master Educator";
      levelProgressPercent = 100;
      levelDescription = "You have unlocked the full suite of Creator, Marketplace, and Growth tools!";
    } else {
      currentLevel = 2;
      levelName = "Level 2: Apprentice Creator";
      levelProgressPercent = 55;
      levelDescription = "Use the AI Content Workspace to generate and publish your first jargon-free asset.";
    }
  }

  const isTabLocked = (tabId: string) => {
    return false;
  };

  const renderProgressiveLockScreen = (
    tabId: string, 
    requiredLevel: number, 
    levelTitle: string, 
    reason: string, 
    actionText: string, 
    targetTab: "profile" | "creator"
  ) => {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center space-y-6 max-w-2xl mx-auto shadow-2xl relative overflow-hidden animate-fade-in my-4">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto shadow-inner">
          <Lock className="w-6 h-6 text-indigo-400 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-900/60 text-indigo-400 text-[10px] font-mono font-bold uppercase tracking-wider">
            🔒 Unlocks at {levelTitle}
          </div>
          <h3 className="font-display font-black text-xl text-white">
            {tabId === "creator" && "AI Content Studio"}
            {tabId === "marketplace" && "Marketplace & Catalog"}
            {tabId === "launch" && "Automated Launch Suite"}
            {tabId === "earnings" && "Financial Earnings Ledger"}
          </h3>
          <p className="text-slate-300 text-xs max-w-md mx-auto leading-relaxed">
            {reason}
          </p>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
          {tabId === "creator" && (
            <>
              <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-400 block uppercase">⚡ AI SYLLABUS MAKER</span>
                <p className="text-[11px] text-slate-400">Instantly draft structured chapter plans, timelines, and guides using Gemini AI.</p>
              </div>
              <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400 block uppercase">🎯 VOCAB LEVEL LOCK</span>
                <p className="text-[11px] text-slate-400">Tailor reading difficulty from Elementary School level up to Academic Thesis level.</p>
              </div>
            </>
          )}

          {tabId === "marketplace" && (
            <>
              <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-400 block uppercase">🛒 EARN COGNITIVE ROYALTIES</span>
                <p className="text-[11px] text-slate-400">List and sell courses or booklets for active workspace credits.</p>
              </div>
              <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-amber-400 block uppercase">📖 PREMIUM DOCUMENT VIEWER</span>
                <p className="text-[11px] text-slate-400">Read unlocked summaries clutter-free and copy full text to your workspace.</p>
              </div>
            </>
          )}

          {tabId === "launch" && (
            <>
              <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-400 block uppercase">📣 ONE-CLICK SOCIAL CAMPAIGNS</span>
                <p className="text-[11px] text-slate-400">Generate viral Twitter threads, LinkedIn summaries, and newsletters.</p>
              </div>
              <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400 block uppercase">🖼️ OPEN GRAPH GENERATORS</span>
                <p className="text-[11px] text-slate-400">Build interactive card images dynamically with custom branding badges.</p>
              </div>
            </>
          )}

          {tabId === "earnings" && (
            <>
              <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400 block uppercase">🏦 REDEEM CREDITS FOR INR</span>
                <p className="text-[11px] text-slate-400">Convert credits directly back into cash bank transfers (1 Cr = ₹1.50 INR).</p>
              </div>
              <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-400 block uppercase">📊 DETAILED LEDGER TRACKER</span>
                <p className="text-[11px] text-slate-400">Keep track of all sales, referrals, downloads, and withdrawals.</p>
              </div>
            </>
          )}
        </div>

        <div className="pt-2">
          <button
            onClick={() => setActiveTab(targetTab)}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-2 mx-auto cursor-pointer"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Render Alert Boxes
  const renderAlerts = () => {
    if (successMsg) {
      return (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-4 flex items-start gap-2 text-xs font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>{successMsg}</div>
        </div>
      );
    }
    if (errorMsg) {
      return (
        <div className="bg-rose-50 border border-rose-200 text-rose-950 rounded-xl p-4 flex items-start gap-2 text-xs font-medium animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>{errorMsg}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-24">
      {/* Module 13 UI Header */}
      <div className="bg-slate-950 border-b border-slate-800 py-6 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full tracking-widest">
                LAUNCH ECONOMY v3.0
              </span>
              {userProfile?.creatorApproved && (
                <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <Shield className="w-2.5 h-2.5" /> Approved Creator
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight mt-1 flex items-center gap-2 text-white">
              Creator Economy Platform
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5 font-medium tracking-wide">
              Create • Learn • Publish • Launch • Grow • Earn
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Wallet Stat */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Coins className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Wallet Balance</span>
                <span className="text-sm font-mono font-extrabold text-white">
                  {walletBalance.toLocaleString()} <span className="text-emerald-400 text-xs">Cr</span>
                </span>
              </div>
            </div>

            {/* Referrals Stat */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Share2 className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Referral Earned</span>
                <span className="text-sm font-mono font-extrabold text-white">
                  {referralEarnings} <span className="text-indigo-400 text-xs">Cr</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar Drawer */}
        <aside className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-3xl p-4 space-y-1.5 shadow-xl">
          <div className="px-3 py-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
            CREATOR CORE PLATFORM
          </div>
          
          {[
            { id: "dashboard", label: "Creator Dashboard", icon: TrendingUp },
            { id: "profile", label: "Creator Profile", icon: User },
            { id: "creator", label: "AI Content Creator", icon: Sparkles },
            { id: "marketplace", label: "Marketplace Catalog", icon: Compass },
            { id: "launch", label: "Launch & Promos", icon: Award },
            { id: "earnings", label: "Earnings & Wallet", icon: DollarSign },
            { id: "referrals", label: "Referral Program", icon: Share2 },
            ...(isAdmin ? [{ id: "admin", label: "Admin Moderate", icon: Shield }] : [])
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const locked = isTabLocked(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSuccessMsg("");
                  setErrorMsg("");
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-mono font-bold transition duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/10" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span>{tab.label}</span>
                </div>
                {locked && (
                  <Lock className={`w-3.5 h-3.5 ${isActive ? "text-white animate-pulse" : "text-slate-600"}`} />
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-800 mt-4 px-3">
            <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-3 text-center">
              <span className="text-[9px] font-mono text-indigo-400 block font-bold tracking-wider uppercase">Your Creator Journey</span>
              <span className="text-xs font-extrabold text-white mt-1 block">{levelName.split(":")[1]}</span>
              <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-850">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-slate-400 block mt-1.5 leading-tight">{levelDescription}</span>
            </div>
          </div>
        </aside>

        {/* Primary Workspace Panel */}
        <main className="lg:col-span-9 space-y-6">
          {renderAlerts()}

          {/* TAB 1: CREATOR DASHBOARD & ANALYTICS */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* 60-Second Onboarding Tour Banner */}
              <div className="bg-gradient-to-r from-indigo-950/40 via-slate-950 to-indigo-950/40 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                      ⚡ Quick Start Checklist
                    </div>
                    <h2 className="text-lg font-display font-black text-white mt-2">
                      Understand Readability Launch Hub in 60 Seconds
                    </h2>
                    <p className="text-slate-400 text-xs max-w-xl">
                      Welcome to your learning economy launchpad! Transform complex concepts into jargon-free, high-value study materials, list them for credits, and cash out to real currency.
                    </p>
                  </div>
                  <div className="flex flex-col items-center shrink-0 bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-2.5 text-center min-w-[110px]">
                    <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">Completed</span>
                    <span className="text-xl font-mono font-black text-white mt-0.5">
                      {Math.round((( (hasProfile ? 1 : 0) + (hasProducts ? 1 : 0) + (walletBalance > 100 ? 1 : 0) + (referralEarnings > 0 ? 1 : 0) ) / 4) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Milestone Checkboxes */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/60">
                  {/* Step 1 */}
                  <div className={`p-4 rounded-2xl border transition duration-200 flex flex-col justify-between h-full ${
                    hasProfile 
                      ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-100" 
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Step 1</span>
                        {hasProfile ? (
                          <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded">Completed</span>
                        ) : (
                          <span className="bg-amber-500/10 text-amber-400 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded">Required</span>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-xs mt-2.5">Set Public Handle</h3>
                      <p className="text-[10px] text-slate-400 mt-1">Configure your @username, biography, and location in your Creator Profile.</p>
                    </div>
                    {!hasProfile && (
                      <button
                        onClick={() => setActiveTab("profile")}
                        className="mt-4 w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[9px] font-bold rounded-lg transition text-center cursor-pointer"
                      >
                        Create Profile
                      </button>
                    )}
                  </div>

                  {/* Step 2 */}
                  <div className={`p-4 rounded-2xl border transition duration-200 flex flex-col justify-between h-full ${
                    hasProducts 
                      ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-100" 
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Step 2</span>
                        {hasProducts ? (
                          <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded">Completed</span>
                        ) : (
                          <span className="bg-slate-800 text-slate-400 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded">Locked</span>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-xs mt-2.5">Synthesize Asset</h3>
                      <p className="text-[10px] text-slate-400 mt-1">Use the AI workspace to draft a jargon-free learning syllabus or study guide.</p>
                    </div>
                    {!hasProducts && (
                      <button
                        disabled={!hasProfile}
                        onClick={() => setActiveTab("creator")}
                        className="mt-4 w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 text-white font-mono text-[9px] font-bold rounded-lg transition text-center cursor-pointer"
                      >
                        {hasProfile ? "Open Generator" : "🔒 Profile First"}
                      </button>
                    )}
                  </div>

                  {/* Step 3 */}
                  <div className={`p-4 rounded-2xl border transition duration-200 flex flex-col justify-between h-full ${
                    hasProducts 
                      ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-100" 
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Step 3</span>
                        {hasProducts ? (
                          <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded">Completed</span>
                        ) : (
                          <span className="bg-slate-800 text-slate-400 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded">Locked</span>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-xs mt-2.5">List on Storefront</h3>
                      <p className="text-[10px] text-slate-400 mt-1">Publish your compiled study materials to the community catalog for free or paid credits.</p>
                    </div>
                    {!hasProducts && (
                      <button
                        disabled={!hasProducts}
                        onClick={() => setActiveTab("marketplace")}
                        className="mt-4 w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 text-white font-mono text-[9px] font-bold rounded-lg transition text-center cursor-pointer"
                      >
                        {hasProducts ? "View Catalog" : "🔒 Asset First"}
                      </button>
                    )}
                  </div>

                  {/* Step 4 */}
                  <div className={`p-4 rounded-2xl border transition duration-200 flex flex-col justify-between h-full ${
                    referralEarnings > 0 
                      ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-100" 
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Step 4</span>
                        {referralEarnings > 0 ? (
                          <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded">Completed</span>
                        ) : (
                          <span className="bg-amber-500/10 text-amber-400 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded">Bonus</span>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-xs mt-2.5">Invite 1 Learner</h3>
                      <p className="text-[10px] text-slate-400 mt-1">Share your custom affiliate link. Earn 15 Cr for every friend who joins.</p>
                    </div>
                    {referralEarnings === 0 && (
                      <button
                        onClick={() => setActiveTab("referrals")}
                        className="mt-4 w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[9px] font-bold rounded-lg transition text-center cursor-pointer"
                      >
                        Share Invite Link
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {/* Module 2: Creator Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl" />
                  <span className="text-[10px] font-mono text-slate-400 block font-bold">TOTAL FOLLOWERS</span>
                  <div className="text-2xl font-mono font-black text-white mt-1.5">{followersCount}</div>
                  <span className="text-[9px] text-emerald-400 font-mono mt-0.5 block font-bold">+12% this week</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl" />
                  <span className="text-[10px] font-mono text-slate-400 block font-bold">PRODUCT VIEWS</span>
                  <div className="text-2xl font-mono font-black text-white mt-1.5">{(totalViews || 230).toLocaleString()}</div>
                  <span className="text-[9px] text-emerald-400 font-mono mt-0.5 block font-bold">+28% growth spike</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
                  <span className="text-[10px] font-mono text-slate-400 block font-bold">TOTAL DOWNLOADS</span>
                  <div className="text-2xl font-mono font-black text-white mt-1.5">{totalDownloads || 14}</div>
                  <span className="text-[9px] text-indigo-400 font-mono mt-0.5 block font-bold">100% organic conversion</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl" />
                  <span className="text-[10px] font-mono text-slate-400 block font-bold">CREATOR REVENUE</span>
                  <div className="text-2xl font-mono font-black text-white mt-1.5">{(totalSalesRevenue || 140).toLocaleString()} <span className="text-xs text-amber-400">Credits</span></div>
                  <span className="text-[9px] text-indigo-400 font-mono mt-0.5 block font-bold">Equal to ₹{( (totalSalesRevenue || 140) * 1.5 ).toFixed(0)} INR</span>
                </div>

              </div>

              {/* Advanced Analytics Custom SVG Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Chart 1: Daily Views Performance */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="font-display font-extrabold text-sm text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-400" /> Daily Traffic & Views
                    </h3>
                    <span className="text-[9px] font-mono text-slate-400 font-semibold uppercase">PAST 7 DAYS</span>
                  </div>
                  
                  {/* Inline SVG Chart */}
                  <div className="h-44 w-full flex items-end justify-between pt-4">
                    {[
                      { day: "Mon", val: 32 },
                      { day: "Tue", val: 45 },
                      { day: "Wed", val: 89 },
                      { day: "Thu", val: 120 },
                      { day: "Fri", val: 68 },
                      { day: "Sat", val: 154 },
                      { day: "Sun", val: 198 }
                    ].map((item, i) => {
                      const pct = `${(item.val / 200) * 100}%`;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          <div className="text-[9px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition duration-150 font-bold bg-slate-900 border border-slate-800 px-1 py-0.5 rounded-md -translate-y-1">
                            {item.val}
                          </div>
                          <div className="w-8 bg-indigo-600 hover:bg-indigo-400 rounded-t-lg transition-all duration-300 shadow-md relative" style={{ height: pct }}>
                            <div className="absolute inset-x-0 top-0 h-1 bg-white/20 rounded-full" />
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 font-bold mt-1">{item.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chart 2: Earnings & Wallet Activity */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="font-display font-extrabold text-sm text-white flex items-center gap-2">
                      <Coins className="w-4.5 h-4.5 text-emerald-400" /> Monthly Creator Earnings (Credits)
                    </h3>
                    <span className="text-[9px] font-mono text-slate-400 font-semibold uppercase">YTD 2026</span>
                  </div>

                  {/* SVG Area spline projection */}
                  <div className="h-44 w-full flex items-end justify-between pt-4">
                    {[
                      { mon: "Jan", val: 20 },
                      { mon: "Feb", val: 80 },
                      { mon: "Mar", val: 140 },
                      { mon: "Apr", val: 310 },
                      { mon: "May", val: 240 },
                      { mon: "Jun", val: 490 },
                      { mon: "Jul", val: 680 }
                    ].map((item, i) => {
                      const pct = `${(item.val / 800) * 100}%`;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          <div className="text-[9px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition duration-150 font-bold bg-slate-900 border border-slate-800 px-1 py-0.5 rounded-md -translate-y-1">
                            {item.val}Cr
                          </div>
                          <div className="w-8 bg-emerald-500 hover:bg-emerald-300 rounded-t-lg transition-all duration-300 shadow-md relative" style={{ height: pct }}>
                            <div className="absolute inset-x-0 top-0 h-1 bg-white/20 rounded-full" />
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 font-bold mt-1">{item.mon}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Module 8: Performance Breakdown list */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
                <h3 className="font-display font-black text-sm text-white mb-4">
                  My Live Products & Engagement
                </h3>
                {creatorProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400 text-xs">You haven't published any content products yet.</p>
                    <button 
                      onClick={() => setActiveTab("creator")}
                      className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Generate AI Asset
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-850">
                    {creatorProducts.map((p, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-mono font-bold uppercase text-[9px]">
                            {p.contentType}
                          </span>
                          <div>
                            <h4 className="font-bold text-white text-xs">{p.title}</h4>
                            <p className="text-[10px] text-slate-400">Created: {new Date(p.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <span className="text-[9px] font-mono text-slate-500 uppercase block">VIEWS</span>
                            <span className="font-mono text-white font-extrabold">{p.viewsCount || 24}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-mono text-slate-500 uppercase block">DOWNLOADS</span>
                            <span className="font-mono text-white font-extrabold">{p.downloadsCount || 2}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-mono text-slate-500 uppercase block">PRICE</span>
                            <span className="font-mono text-amber-400 font-extrabold">{p.price > 0 ? `${p.price} Cr` : "Free"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: CREATOR PROFILE CREATOR/EDIT */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-fade-in">
              {/* Form Side */}
              <div className="xl:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="border-b border-slate-850 pb-4">
                  <h3 className="font-display font-black text-lg text-white">
                    Creator Profile Details
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Design a professional persona that showcases your expertise to the community.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Category: Visual Assets */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                      🎨 Visual Identity Assets
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Avatar Photo URL</label>
                        <input
                          type="text"
                          value={profilePhoto}
                          onChange={(e) => setProfilePhoto(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Cover Banner URL</label>
                        <input
                          type="text"
                          value={coverBanner}
                          onChange={(e) => setCoverBanner(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Brand Logo URL</label>
                        <input
                          type="text"
                          value={brandLogo}
                          onChange={(e) => setBrandLogo(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category: Professional Persona */}
                  <div className="space-y-4 pt-4 border-t border-slate-850">
                    <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                      💼 Professional Persona
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Display Name</label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          required
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Username Handle</label>
                        <div className="flex">
                          <span className="bg-slate-900 border border-r-0 border-slate-800 px-3 py-2.5 text-xs font-mono text-slate-500 rounded-l-xl">@</span>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full bg-slate-900 border border-slate-800 rounded-r-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Brand Name / Agency</label>
                        <input
                          type="text"
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Personal Domain</label>
                        <input
                          type="text"
                          value={personalDomain}
                          onChange={(e) => setPersonalDomain(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Short Biography</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Skills (Comma separated)</label>
                        <input
                          type="text"
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Primary Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option>Education</option>
                          <option>Business</option>
                          <option>Legal</option>
                          <option>Medical</option>
                          <option>Technology</option>
                          <option>Finance</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Location</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Languages Spoken</label>
                        <input
                          type="text"
                          value={languages}
                          onChange={(e) => setLanguages(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Contact Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Contact Phone</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Website URL</label>
                        <input
                          type="text"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Portfolio Link</label>
                        <input
                          type="text"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category: Social Channels */}
                  <div className="space-y-4 pt-4 border-t border-slate-850">
                    <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                      🌐 Connected Social Ecosystem
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Twitter / X URL</label>
                        <input
                          type="text"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          placeholder="https://x.com/handle"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">LinkedIn URL</label>
                        <input
                          type="text"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/handle"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">YouTube Channel URL</label>
                        <input
                          type="text"
                          value={youtube}
                          onChange={(e) => setYoutube(e.target.value)}
                          placeholder="https://youtube.com/c/handle"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Instagram URL</label>
                        <input
                          type="text"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          placeholder="https://instagram.com/handle"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Facebook URL</label>
                        <input
                          type="text"
                          value={facebook}
                          onChange={(e) => setFacebook(e.target.value)}
                          placeholder="https://facebook.com/handle"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-400 block mb-1">GitHub Profile URL</label>
                        <input
                          type="text"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="https://github.com/handle"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end border-t border-slate-850">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>Save Creator Profile Settings</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Preview Card Side */}
              <div className="xl:col-span-4 space-y-6 sticky top-8">
                <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest px-1">
                  👁️ LIVE PUBLIC PREVIEW
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
                  {/* Banner image background */}
                  <div className="h-32 bg-slate-900 relative overflow-hidden">
                    <img src={coverBanner} alt="Banner Preview" className="w-full h-full object-cover" />
                    {brandLogo && (
                      <div className="absolute top-4 right-4 bg-slate-950/80 border border-slate-800 p-1.5 rounded-xl">
                        <img src={brandLogo} alt="Logo" className="w-7 h-7 rounded-lg object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Avatar overlapping */}
                  <div className="px-6 -mt-10 relative z-10 flex items-end justify-between">
                    <img src={profilePhoto} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-slate-950 shadow-xl" />
                    <div className="flex gap-1.5 pb-2">
                      <span className="bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Award className="w-3 h-3" /> Level 3
                      </span>
                      <span className="bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  </div>

                  {/* Creator Info */}
                  <div className="p-6 pt-3 space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-black text-lg text-white leading-tight">
                          {displayName || user?.displayName || "Jane Doe"}
                        </h4>
                        <div className="flex items-center text-amber-400 gap-0.5 text-xs font-bold font-mono">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>4.9</span>
                        </div>
                      </div>
                      <span className="text-xs text-indigo-400 font-mono font-semibold block">
                        @{username || "creator_handle"}
                      </span>
                      {brandName && (
                        <span className="text-[10px] font-mono text-slate-400 block">
                          Agency: <strong className="text-slate-300">{brandName}</strong>
                        </span>
                      )}
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed font-sans">
                      {bio || "AI Educator & Content Creator translating complexity for global learners."}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-900/50 border border-slate-900 rounded-2xl p-3 text-center">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Followers</span>
                        <span className="text-sm font-mono font-extrabold text-white">1.2K</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Following</span>
                        <span className="text-sm font-mono font-extrabold text-white">348</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Category</span>
                        <span className="text-xs font-mono font-bold text-indigo-400 truncate block mt-0.5">{category}</span>
                      </div>
                    </div>

                    {/* Meta Lists */}
                    <div className="space-y-2 text-xs text-slate-400">
                      {location && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-slate-500" />
                          <span>Located in <strong className="text-slate-300">{location}</strong></span>
                        </div>
                      )}
                      {languages && (
                        <div className="flex items-center gap-2">
                          <Languages className="w-3.5 h-3.5 text-slate-500" />
                          <span>Languages: <strong className="text-slate-300">{languages}</strong></span>
                        </div>
                      )}
                      {personalDomain && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-indigo-400" />
                          <a href={`https://${personalDomain}`} target="_blank" rel="noreferrer" className="hover:underline text-indigo-300">
                            {personalDomain}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Skills rendering */}
                    {skills && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Skills & Focus</span>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.split(",").map((s, i) => {
                            const trimmed = s.trim();
                            if (!trimmed) return null;
                            return (
                              <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-850 rounded text-[10px] font-mono text-slate-300">
                                {trimmed}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Social links block */}
                    <div className="flex items-center gap-3.5 pt-3 border-t border-slate-900 text-slate-500">
                      <a href={twitter || "#"} target="_blank" rel="noreferrer" className="hover:text-sky-400 transition">
                        <Youtube className="w-4 h-4" />
                      </a>
                      <a href={linkedin || "#"} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition">
                        <Users className="w-4 h-4" />
                      </a>
                      <a href={youtube || "#"} target="_blank" rel="noreferrer" className="hover:text-rose-500 transition">
                        <Youtube className="w-4 h-4" />
                      </a>
                      <a href={instagram || "#"} target="_blank" rel="noreferrer" className="hover:text-pink-500 transition">
                        <Instagram className="w-4 h-4" />
                      </a>
                      <a href={facebook || "#"} target="_blank" rel="noreferrer" className="hover:text-blue-500 transition">
                        <Facebook className="w-4 h-4" />
                      </a>
                      <a href={github || "#"} target="_blank" rel="noreferrer" className="hover:text-white transition">
                        <Github className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Public URL widget */}
                    <div className="bg-slate-900/80 border border-slate-900 rounded-2xl p-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Public URL</span>
                        <span className="text-xs font-mono font-bold text-indigo-300 truncate block">
                          readability.ai/@{username || "creator"}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`readability.ai/@${username || "creator"}`, "public-url")}
                        className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
                        title="Copy Public Link"
                      >
                        {copiedText === "public-url" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI CONTENT CREATOR WORKSPACE */}
          {activeTab === "creator" && isTabLocked("creator") && (
            renderProgressiveLockScreen(
              "creator",
              2,
              "Level 2: Apprentice Creator",
              "Unlock Gemini's powerful, jargon-free document and course builder. Design professional lessons, eBooks, or notes instantly based on complex source materials.",
              "Complete Public Profile Setup",
              "profile"
            )
          )}

          {activeTab === "creator" && !isTabLocked("creator") && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI CREATOR STUDIO WORKSPACE
                  </span>
                  <h3 className="font-display font-black text-lg text-white mt-1">
                    Generate Infinite Learning Products
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Select a format, enter a complex topic or core research theme, and let Gemini render pristine, ready-to-sell intellectual content.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Format Type</label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="course">Premium Course Syllabus & Lessons</option>
                      <option value="ebook">Comprehensive eBook (.EPUB / .PDF)</option>
                      <option value="notes">Structured Study Summary Notes</option>
                      <option value="quiz">Interactive MCQ Challenge Quiz Set</option>
                      <option value="podcast">Podcast Script / Audio Transcript</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Vocab Simplification Level</label>
                    <select
                      value={vocabLevel}
                      onChange={(e) => setVocabLevel(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="eli5">ELI5 Mode (Highly relatable & simple)</option>
                      <option value="student">Student Mode (Clear, educational terms)</option>
                      <option value="pro">Pro Mode (High-density, business-focused)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Target Audience</label>
                    <input
                      type="text"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Narrator Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="inspirational">Inspirational & Authoritative</option>
                      <option value="casual">Casual & Conversational</option>
                      <option value="technical">Direct Technical Insight</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Topic or Snapped Document Text</label>
                  <textarea
                    value={genTopic}
                    onChange={(e) => setGenTopic(e.target.value)}
                    rows={3}
                    placeholder="e.g. Quantum Computing, High-frequency Trading, Microvascular Surgery, Commercial Lease Clauses..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                  >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Generate AI Content Blueprint</span>
                  </button>
                </div>
              </div>

              {/* Generated Workspace editor */}
              {generatedResult && (
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-850 pb-4 gap-4">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-emerald-400 block">GENERATION DRAFT COMPLETED</span>
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-base font-bold bg-transparent border-b border-dashed border-slate-700 text-white focus:outline-none focus:border-indigo-500 mt-1 w-full sm:w-96"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={productStatus}
                        onChange={(e) => setProductStatus(e.target.value as any)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                      >
                        <option value="free">List as Free Product</option>
                        <option value="paid">List as Premium Paid</option>
                        <option value="draft">Save in Draft Folder</option>
                      </select>

                      {productStatus === "paid" && (
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                          <input
                            type="number"
                            value={productPrice}
                            onChange={(e) => setProductPrice(Number(e.target.value))}
                            className="bg-transparent font-mono text-white w-10 font-bold focus:outline-none"
                          />
                          <span className="text-slate-400 font-mono text-[10px]">Cr</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Markdown Preview Field */}
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 h-80 overflow-y-auto text-xs text-slate-300 leading-relaxed font-sans prose prose-invert">
                    <textarea
                      value={generatedResult}
                      onChange={(e) => setGeneratedResult(e.target.value)}
                      className="w-full h-full bg-transparent text-slate-100 font-mono text-xs focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <button
                      onClick={() => copyToClipboard(generatedResult, "draft_asset")}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-xl text-slate-300 font-mono text-[10px] font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedText === "draft_asset" ? "Copied!" : "Copy Full Markdown"}</span>
                    </button>

                    <button
                      onClick={handlePublishAsset}
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>Publish Asset to Storefront</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MARKETPLACE */}
          {activeTab === "marketplace" && isTabLocked("marketplace") && (
            renderProgressiveLockScreen(
              "marketplace",
              3,
              "Level 3: Master Educator",
              "Explore lists of simplified documents, notes, and lessons generated by the community, or publish your own files to earn credits from learners.",
              "Generate Your First AI Asset",
              "creator"
            )
          )}

          {activeTab === "marketplace" && !isTabLocked("marketplace") && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                
                {/* Marketplace Search Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-black text-lg text-white">
                      Marketplace Catalog
                    </h3>
                    <p className="text-slate-400 text-xs">
                      Unlock premium simplified notes, syllabus lessons, and ebooks from creators worldwide.
                    </p>
                  </div>

                  {/* Search input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search books, notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none w-full sm:w-64"
                    />
                  </div>
                </div>

                {/* Filter tags */}
                <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-850">
                  {["All", "Course", "eBook", "Notes", "Quiz", "Podcast"].map(cat => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase cursor-pointer border ${
                          isActive 
                            ? "bg-white text-slate-950 border-white shadow-md" 
                            : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Product Grid */}
                {productsLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto mb-2" />
                    <span className="text-xs font-mono text-slate-500">Retrieving catalog records...</span>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Compass className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <span className="text-xs text-slate-400 font-mono">No products matched this search query.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProducts.map((p, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <span className="px-2 py-0.5 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-indigo-400 font-mono text-[9px] font-bold uppercase">
                              {p.contentType}
                            </span>
                            
                            <span className="font-mono text-xs font-extrabold text-amber-400">
                              {p.price > 0 ? `${p.price} Credits` : "Free"}
                            </span>
                          </div>

                          <h4 className="font-bold text-white text-xs sm:text-sm mt-3 leading-snug">{p.title}</h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-1">
                            By @{p.creatorUsername} &bull; <strong className="text-slate-300 font-semibold">{p.creatorName}</strong>
                          </p>
                          <p className="text-[11px] text-slate-300 mt-2 line-clamp-2">{p.description}</p>
                        </div>

                        <div className="pt-4 border-t border-slate-850/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Download className="w-3.5 h-3.5 text-slate-500" /> {p.downloadsCount || 0}
                            </span>
                          </div>

                          {p.creatorId === userProfile?.uid ? (
                            <span className="text-slate-500 italic">Your product</span>
                          ) : (
                            <button
                              onClick={() => {
                                if (p.price === 0) {
                                  // Free products unlock immediately
                                  setSelectedProduct(p);
                                } else {
                                  handlePurchaseProduct(p.id);
                                }
                              }}
                              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold uppercase rounded-lg transition text-[9px] cursor-pointer"
                            >
                              {p.price > 0 ? "Unlock Asset" : "View Free Asset"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected unlocked product content viewer */}
              {selectedProduct && (
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                    <div>
                      <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold">UNLOCKED IP BLUEPRINT</span>
                      <h3 className="font-bold text-white text-base mt-0.5">{selectedProduct.title}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="text-slate-400 hover:text-white text-xs font-mono font-bold"
                    >
                      Close Reader
                    </button>
                  </div>

                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 max-h-96 overflow-y-auto text-xs text-slate-300 leading-relaxed font-sans prose prose-invert">
                    <pre className="whitespace-pre-wrap font-mono text-xs text-slate-100">{selectedProduct.content}</pre>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => copyToClipboard(selectedProduct.content, "unlocked_asset")}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copiedText === "unlocked_asset" ? "Copied!" : "Copy Unlocked Document Content"}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: LAUNCH CENTER & GROWTH MARKETING */}
          {activeTab === "launch" && isTabLocked("launch") && (
            renderProgressiveLockScreen(
              "launch",
              3,
              "Level 3: Master Educator",
              "Automate your launch day marketing! Generate high-converting social campaigns, press releases, newsletters, and OpenGraph social banner cards using the power of Gemini.",
              "Synthesize Your First Product",
              "creator"
            )
          )}

          {activeTab === "launch" && !isTabLocked("launch") && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> LAUNCH CENTER & GROWTH SUITE
                  </span>
                  <h3 className="font-display font-black text-lg text-white mt-1">
                    Automate Your Product Launch Day
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Select any of your listed products to automatically generate landing page copy, social posts, press kits, and promotional OpenGraph descriptors.
                  </p>
                </div>

                {creatorProducts.length === 0 ? (
                  <div className="text-center py-10 bg-slate-900/50 border border-slate-850 rounded-2xl">
                    <Sliders className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400 text-xs font-mono">Create an AI asset first in Tab 3 to unlock Launch Day features.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Launch Checklist */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block tracking-wider">
                        📋 CREATOR LAUNCH DAY CHECKLIST
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {[
                          "Confirm inline definitions are clear",
                          "Configure pricing tier & wallet permissions",
                          "Generate promotional social media thread",
                          "Dispatch Launch day promo newsletter campaign",
                          "Set up custom affiliate referral code",
                          "Verify website link integration works"
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2.5 text-slate-300">
                            <input type="checkbox" defaultChecked={i < 3} className="rounded accent-indigo-500 w-4 h-4 cursor-pointer" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Marketing Material Generator Trigger */}
                    <div className="bg-gradient-to-r from-indigo-950/20 to-emerald-950/20 border border-indigo-900/40 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="max-w-md">
                        <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider">⚡ AI Promotion Assistant</h4>
                        <p className="text-[11px] text-slate-300 mt-1">
                          Synthesize LinkedIn posts, Twitter threads, email campaign pitches, and media bios instantly based on your draft.
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          setIsGenerating(true);
                          setSuccessMsg("");
                          setGeneratedResult("");
                          try {
                            const token = await user.getIdToken();
                            const res = await fetch("/api/creator/ai-generate", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`
                              },
                              body: JSON.stringify({
                                type: "launch_metadata",
                                topic: creatorProducts[0].title
                              })
                            });
                            if (res.ok) {
                              const data = await res.json();
                              setGeneratedResult(data.text);
                              setEditedTitle("Automated Social Launch Kit");
                              setSuccessMsg("Launch Kit successfully compiled by Gemini!");
                            }
                          } catch (err) {
                            setErrorMsg("Error generating promo assets.");
                          } finally {
                            setIsGenerating(false);
                          }
                        }}
                        disabled={isGenerating}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                      >
                        {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>Synthesize Launch Day Kit</span>
                      </button>
                    </div>

                    {/* Social Shares / OG Generator Mockup */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block tracking-wider">
                        🖼️ OPEN GRAPH & PROMO PREVIEW GENERATOR (MODULE 6)
                      </span>
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-w-sm mx-auto shadow-inner">
                        <div className="aspect-[1.91/1] w-full bg-gradient-to-br from-indigo-900 to-slate-900 rounded-lg p-4 flex flex-col justify-between border border-indigo-500/20 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
                          <div className="text-[8px] font-mono text-indigo-400 font-bold uppercase tracking-widest">
                            readability.cloud
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                              {creatorProducts[0]?.title || "How To Master Micro-Investing"}
                            </h4>
                            <p className="text-[9px] text-slate-400 mt-1 line-clamp-1">
                              By @{userProfile?.creatorProfile?.username || "creator"} &bull; Demystified Learning Notes
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] text-emerald-400 font-mono font-bold">✓ VERIFIED SOURCE</span>
                            <span className="text-[8px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-md font-mono">10 Cr</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: EARNINGS & WALLET WITHDRAWAL */}
          {activeTab === "earnings" && isTabLocked("earnings") && (
            renderProgressiveLockScreen(
              "earnings",
              3,
              "Level 3: Master Educator",
              "Track your sales revenue, download numbers, referral rewards, and easily withdraw your earned credits into real INR bank transfers.",
              "Synthesize Your First Product",
              "creator"
            )
          )}

          {activeTab === "earnings" && !isTabLocked("earnings") && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> CREATOR EARNINGS & FINANCIAL WALLET
                  </span>
                  <h3 className="font-display font-black text-lg text-white mt-1">
                    Cash out your Cognitive Dividends
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Every credit earned from document downloads has a guaranteed cash redemption rate of <strong className="text-emerald-400 font-bold">₹1.50 INR</strong> per credit. Set donation setups, tiers, or trigger withdrawals.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Ledger Balance */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">REDEEMABLE CREATOR LEDGER</span>
                    <div className="text-3xl font-mono font-black text-white">
                      {walletBalance.toLocaleString()} <span className="text-xs font-sans text-indigo-400 font-bold">Credits</span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      Estimated value: <strong className="text-emerald-400">₹{(walletBalance * 1.5).toLocaleString()} INR</strong>
                    </div>

                    <div className="pt-2">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                          max={walletBalance}
                          min={50}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white w-20 focus:outline-none"
                        />
                        <button
                          onClick={async () => {
                            if (withdrawAmount > walletBalance) {
                              setErrorMsg("Cannot cashout more credits than present in your active ledger wallet.");
                              return;
                            }
                            setWalletTxLoading(true);
                            setSuccessMsg("");
                            try {
                              await new Promise(resolve => setTimeout(resolve, 1500));
                              setSuccessMsg(`Withdrawal of ₹${(withdrawAmount * 1.5).toFixed(0)} INR successfully initialized securely using verified banking node.`);
                              onRefreshProfile();
                            } catch (err) {
                              setErrorMsg("Withdrawal gateway error.");
                            } finally {
                              setWalletTxLoading(false);
                            }
                          }}
                          disabled={walletTxLoading || walletBalance < 50}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-mono text-[10px] font-bold transition disabled:opacity-50 cursor-pointer"
                        >
                          {walletTxLoading ? "Processing..." : "Cash Out to UPI/Bank"}
                        </button>
                      </div>
                      <span className="text-[9px] text-slate-500 block mt-1.5 font-mono">Minimum redemption: 50 credits</span>
                    </div>
                  </div>

                  {/* Creator Donation Tier setups */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">💡 COGNITIVE PATRONAGE & DONATIONS (MODULE 10)</span>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      Allow your students or corporate readers to tip you directly on your public cards.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                        <span>Buy me a coffee tip:</span>
                        <strong className="text-white">Enabled &bull; 5 Cr</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                        <span>Monthly Support level:</span>
                        <strong className="text-white">Enabled &bull; 30 Cr / mo</strong>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 7: REFERRAL ENGINE PROGRAM */}
          {activeTab === "referrals" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" /> REVENUE & REF REGISTRATION SYSTEM (MODULE 7)
                  </span>
                  <h3 className="font-display font-black text-lg text-white mt-1">
                    Double Your Credits On Referral Actions
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    When you invite scholars, educators, or researchers, they receive <strong className="text-white font-semibold">15 free credits</strong>, and you receive <strong className="text-emerald-400 font-bold">15 credits</strong> on their first valid document simplification.
                  </p>
                </div>

                {/* Referral Coupon Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">YOUR ACTIVE REFERRAL COUPON</span>
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between border-dashed border-indigo-500/20">
                      <span className="font-mono font-black text-lg text-white tracking-widest select-all">
                        {userProfile?.referralCode || "READ-MEMBER-X"}
                      </span>
                      <button
                        onClick={() => copyToClipboard(userProfile?.referralCode || "READ-MEMBER-X", "referral_code")}
                        className="p-2 bg-slate-900 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                        title="Copy Referral Code"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    {copiedText === "referral_code" && (
                      <span className="text-[10px] font-mono text-emerald-400 block font-bold">Copied code to dashboard clipboard!</span>
                    )}
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">CLAIM REFERRAL COUPON</span>
                    <form onSubmit={handleApplyReferralCode} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. READ-5544"
                        value={refCodeInput}
                        onChange={(e) => setRefCodeInput(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 flex-1"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Claim Credit
                      </button>
                    </form>
                    {refSuccess && <span className="text-[10px] font-mono text-emerald-400 block font-bold mt-1">{refSuccess}</span>}
                    {refError && <span className="text-[10px] font-mono text-rose-400 block font-bold mt-1">{refError}</span>}
                  </div>
                </div>

                {/* Media Kit Section (Module 9) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">📁 COMPRESSED MEDIA KIT & SPEAKER PROFILE (MODULE 9)</span>
                  <div className="flex gap-2 border-b border-slate-800 pb-2">
                    {["short", "long", "speaker"].map(len => (
                      <button
                        key={len}
                        onClick={() => setBioLength(len as any)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase cursor-pointer ${
                          bioLength === len ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {len} Bio
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-xs text-slate-300 leading-relaxed italic">
                    {bioLength === "short" ? (
                      <p>&ldquo;{userProfile?.creatorProfile?.displayName || userProfile?.displayName || "Jane Doe"} is an expert in {category} simplifying complex subjects into beautiful, high-retention study resources.&rdquo;</p>
                    ) : bioLength === "long" ? (
                      <p>&ldquo;{userProfile?.creatorProfile?.displayName || userProfile?.displayName || "Jane Doe"} is an author, educator, and content creator specializing in {category} with verified mastery of {skills}. Based in {location}, they focus on translating high-complexity technical jargon into simple, step-by-step analogies for global learners.&rdquo;</p>
                    ) : (
                      <p>&ldquo;Keynote: Demystifying the Complexity Trap in Modern {category}. Speaker {userProfile?.creatorProfile?.displayName || userProfile?.displayName || "Jane Doe"} covers high-retention education and structural understanding frameworks.&rdquo;</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 8: ADMIN MODERATION CONTROL CONSOLE */}
          {activeTab === "admin" && isAdmin && (
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="border-b border-slate-850 pb-4">
                <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-400" /> Admin Moderation Panel (Module 11)
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Review creator requests, verify expert badges, and moderate community content catalog records.
                </p>
              </div>

              {allUsersList.length === 0 ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-6 h-6 text-slate-600 animate-spin mx-auto mb-2" />
                  <span className="text-xs text-slate-500 font-mono">Loading user list...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                        <th className="pb-3">NAME & EMAIL</th>
                        <th className="pb-3">ROLE</th>
                        <th className="pb-3">CREATOR RECRUIT</th>
                        <th className="pb-3 text-right">ACTION COMMANDS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {allUsersList.map((usr, i) => (
                        <tr key={i} className="hover:bg-slate-900/40 transition">
                          <td className="py-3">
                            <div className="font-bold text-white">{usr.displayName || "Scholar"}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{usr.email}</div>
                          </td>
                          <td className="py-3 font-mono">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${usr.role === "admin" ? "bg-rose-950 text-rose-400" : "bg-slate-900 text-slate-400"}`}>
                              {usr.role}
                            </span>
                          </td>
                          <td className="py-3 font-mono">
                            {usr.isCreator ? (
                              <div className="flex items-center gap-1.5 text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                              </div>
                            ) : (
                              <span className="text-slate-500">No</span>
                            )}
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => handleAdminApprove(usr.uid, true, true)}
                              disabled={adminActionLoading}
                              className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 font-mono text-[9px] font-bold rounded-lg border border-emerald-800 transition cursor-pointer"
                            >
                              Approve & Verify
                            </button>
                            <button
                              onClick={() => handleAdminApprove(usr.uid, false, false)}
                              disabled={adminActionLoading}
                              className="px-2 py-1 bg-rose-950 hover:bg-rose-900 text-rose-400 font-mono text-[9px] font-bold rounded-lg border border-rose-950 transition cursor-pointer"
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
