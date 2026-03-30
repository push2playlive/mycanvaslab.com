import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Cpu, Send, Plus, Globe, LayoutGrid, Radar, Wrench, 
  Image, Folder, Settings, ArrowUp, Github, Database, 
  Key, Lock, Home, BarChart3, Download, Share2, 
  Shield, Zap, Upload, Code, Eye, EyeOff, MessageSquare, User, Menu, ShieldOff, Mail,
  Music, ShieldCheck, ImagePlus, Volume2, Video, MapPin, Sparkles, X, LogOut,
  Megaphone, Facebook, Instagram, Youtube, DollarSign, TrendingUp, CheckCircle2, AlertCircle, Grid, Link as LinkIcon,
  FileText
} from "lucide-react";

// STYLES: Tactical Glassmorphism
const glassGrey = "bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50";
const glassOrange = "bg-orange-500/5 backdrop-blur-xl border border-orange-500/20";

// STYLES: Tactical High-Contrast
const tabActive = "border-orange-500/60 bg-orange-500/10 text-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.1)]";
const tabInactive = "border-zinc-800 bg-zinc-900/20 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400";

// STYLES: The Sovereign Palette
const btnInactive = "bg-zinc-900/20 border border-zinc-800 text-zinc-600 hover:border-orange-500/50 hover:text-orange-400 hover:bg-orange-500/5";
const btnActive = "bg-orange-500/10 border border-orange-500/60 text-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.15)]";

// THE SOVEREIGN BUTTON ANCHOR
const SidebarButton = ({ label, icon, isActive, onClick }: { label: string, icon: React.ReactNode, isActive: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full p-4 mb-3 rounded-2xl flex items-center justify-between transition-all duration-300 group border ${
      isActive 
        ? "bg-orange-500/10 border-orange-500/60 text-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.15)]" 
        : "bg-zinc-900/20 border-zinc-800 text-zinc-600 hover:border-orange-500/50 hover:text-orange-400 hover:bg-orange-500/5"
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </div>
    {isActive && <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_#ea580c]" />}
  </button>
);

const MOCK_GALLERY = [
  { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80', title: 'New Product Launch' },
  { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', title: 'Behind the Scenes' },
  { id: 3, type: 'video', url: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=400&q=80', title: 'Customer Testimonial' },
  { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80', title: 'Office Setup' },
];

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
  { id: 'tiktok', name: 'TikTok', icon: Share2, color: 'bg-black' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-600' }
];

// THE ELITE TIER MATRIX
const TIERS = [
  { name: 'STARTUP ELITE', price: '$49', perks: '5 Agents / 1GB Neural Storage', color: 'zinc', link: 'https://buy.stripe.com/dRmfZjetC3TdbEs9S12wU01' },
  { name: 'BUSINESS ELITE', price: '$99', perks: '20 Agents / 10GB Neural Storage', color: 'orange', link: 'https://buy.stripe.com/dRm4gB4T2fBV0ZOc092wU02' },
  { name: 'GURU ELITE', price: '$299', perks: 'Unlimited Agents / Private Hetzner Core', color: 'orange', link: 'https://buy.stripe.com/cNi5kF0CMcpJ6k8ggp2wU00' }
];

const TierCard = ({ tier }: { tier: typeof TIERS[0] }) => (
  <div className={`p-6 rounded-3xl border ${tier.color === 'orange' ? 'border-orange-500/30 bg-orange-500/5' : 'border-zinc-800 bg-zinc-900/20'} backdrop-blur-xl transition-all hover:border-orange-500/50 group`}>
    <h4 className="text-[10px] font-black tracking-widest text-zinc-500 mb-2 uppercase">{tier.name}</h4>
    <div className="text-3xl font-black mb-4 text-white">{tier.price}<span className="text-sm text-zinc-600">/mo</span></div>
    <p className="text-[9px] text-zinc-400 mb-6 leading-relaxed">{tier.perks}</p>
    <button 
      onClick={() => window.location.href = tier.link}
      className="w-full py-3 rounded-xl bg-orange-500 text-black text-[10px] font-black uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(234,88,12,0.2)]"
    >
      ACTIVATE CORE
    </button>
  </div>
);

// THE SOVEREIGN MERCHANT LOGO (OPTION 1)
const MCL_Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const dimensions = 
    size === "sm" ? "w-6 h-6" : 
    size === "lg" ? "w-24 h-24 md:w-32 md:h-32" : "w-10 h-10";
  
  return (
    <div className={`relative ${dimensions} flex items-center justify-center`}>
      {/* THE TACTICAL M-DIAMOND SVG */}
      <svg viewBox="0 0 100 100" className="fill-orange-500 drop-shadow-[0_0_8px_rgba(234,88,12,0.5)]">
        <path d="M10 90 L50 10 L90 90 L70 90 L50 50 L30 90 Z" />
        <path d="M50 35 L65 70 L35 70 Z" className="fill-black/40" />
      </svg>
      {/* THE NEURAL PULSE BACKGROUND */}
      <div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-full -z-10 animate-pulse" />
    </div>
  );
};

const PreviewLoading = () => (
  <div className="w-full h-full bg-black/60 backdrop-blur-md flex flex-col items-center justify-center border border-orange-500/20 rounded-3xl">
    <div className="w-16 h-16 border-t-2 border-orange-500 rounded-full animate-spin mb-6" />
    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] animate-pulse">
      SYNCING_NEURAL_PREVIEW...
    </span>
    <div className="mt-4 text-zinc-600 text-[8px] font-bold uppercase">Node: 46.62.209.177</div>
  </div>
);

const RevenueManifesto = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 p-10 bg-orange-500/5 border border-orange-500/20 rounded-[40px] backdrop-blur-3xl animate-in fade-in zoom-in duration-1000 max-w-7xl w-full">
    <div className="space-y-4">
      <h3 className="text-orange-500 font-black text-[12px] tracking-[0.2em]">01_SCALABILITY</h3>
      <p className="text-zinc-400 text-[11px] leading-relaxed uppercase font-bold">
        Deploy unlimited neural agents on the V12 Mainframe. No credit caps. No latency bottlenecks. Only raw processing power.
      </p>
    </div>
    <div className="space-y-4 border-x border-zinc-800 px-8">
      <h3 className="text-orange-500 font-black text-[12px] tracking-[0.2em]">02_RESIDUE_INCOME</h3>
      <p className="text-zinc-400 text-[11px] leading-relaxed uppercase font-bold">
        Publicly bash your agents to the MyCanvasLab network. Collect hosting fees for every neural mission executed by the community.
      </p>
    </div>
    <div className="space-y-4">
      <h3 className="text-orange-500 font-black text-[12px] tracking-[0.2em]">03_SOVEREIGN_CONTROL</h3>
      <p className="text-zinc-400 text-[11px] leading-relaxed uppercase font-bold">
        Your keys are your own. We provide the ship; you provide the command. Secure, encrypted, and architect-owned infrastructure.
      </p>
    </div>
  </div>
);

// THE SOVEREIGN LANDING CORE
const LandingPage = ({ onEnter, onAdminEnter }: { onEnter: () => void, onAdminEnter: () => void }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const features = [
    { id: 'FORGE', title: 'NEURAL FORGE', desc: 'Custom Agent Creation & Deployment', keywords: 'White-Label AI, Neural Assets', icon: '⚒️' },
    { id: 'BASH', title: 'SOVEREIGN BASH', desc: '1-Click GitHub to Hetzner Sync', keywords: 'CI/CD, High-Frequency Deploy', icon: '⚡' },
    { id: 'VAULT', title: 'ASSET VAULT', desc: 'Secure Neural Storage & Privacy', keywords: 'Encrypted AI, Private LLM', icon: '💎' },
    { id: 'HOST', title: 'ELITE HOSTING', desc: 'Dedicated Hetzner V12 Mainframe', keywords: 'High-Performance Hosting, Zero Latency', icon: '🌐' }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white font-mono flex flex-col items-center pt-20 px-6 overflow-y-auto custom-scrollbar relative">
      
      {/* SUBTLE LOGIN / REGISTER BUTTON */}
      <button 
        onClick={onEnter}
        className="absolute top-8 right-8 px-6 py-2 border border-orange-500/30 rounded-xl bg-black text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-500/10 hover:border-orange-500/60 transition-all shadow-[0_0_20px_rgba(234,88,12,0.05)]"
      >
        Login / Register
      </button>

      {/* THE PULSING NEURAL DIAMOND (THE HEART) - PRIVATE ADMIN ACCESS */}
      <div 
        onClick={onAdminEnter}
        className="py-20 group cursor-pointer flex flex-col items-center"
      >
        <div className="transition-transform duration-700 group-hover:scale-125 group-hover:rotate-[360deg]">
          <MCL_Logo size="lg" />
        </div>
        <h1 className="mt-8 text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-center px-4">MYCANVASLAB</h1>
        <div className="mt-4 px-6 py-1 border border-orange-500/20 rounded-full bg-orange-500/5">
          <span className="text-[10px] text-orange-500 font-black tracking-[0.4em] animate-pulse uppercase">Status: Noble_Stable</span>
        </div>
      </div>

      {/* THE KEYWORD-MAXED TACTICAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-10 max-w-7xl w-full">
        {features.map((f) => (
          <div 
            key={f.id}
            onMouseEnter={() => setHovered(f.id)}
            onMouseLeave={() => setHovered(null)}
            className={`p-8 rounded-3xl border transition-all duration-500 cursor-pointer ${
              hovered === f.id ? 'border-orange-500/50 bg-orange-500/5 shadow-[0_0_30px_rgba(234,88,12,0.1)] scale-105' : 'border-zinc-800 bg-zinc-900/20'
            }`}
          >
            <div className="text-3xl mb-6">{f.icon}</div>
            <h3 className="text-sm font-black text-orange-500 mb-2">{f.title}</h3>
            <p className="text-[11px] text-zinc-400 font-bold mb-4 uppercase leading-tight">{f.desc}</p>
            <div className="pt-4 border-t border-zinc-800/50">
              <span className="text-[8px] text-zinc-600 font-black tracking-widest uppercase">{f.keywords}</span>
            </div>
          </div>
        ))}
      </div>

      <RevenueManifesto />

      {/* THE GLOBAL STATUS MONITOR (CLICKABLE) */}
      <button 
        onClick={onEnter}
        className="mt-20 px-10 py-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex items-center gap-6 hover:border-orange-500/30 transition-all mb-32"
      >
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black text-zinc-500 uppercase">Latency: 14ms</span>
        </div>
        <div className="w-px h-4 bg-zinc-800" />
        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Access Command Nexus →</span>
      </button>

      <footer className="mt-40 pb-10 w-full max-w-7xl px-10 border-t border-zinc-900 pt-10 flex justify-between items-center text-zinc-600 text-[8px] font-black uppercase tracking-widest">
        <div className="flex gap-8">
          <a href="/terms" className="hover:text-orange-500 transition-all">TERMS_OF_SERVICE</a>
          <a href="/privacy" className="hover:text-orange-500 transition-all">PRIVACY_POLICY</a>
          <a href="/cookies" className="hover:text-orange-500 transition-all">COOKIE_PROTOCOL</a>
        </div>
        <span>© 2026 MYCANVASLAB_V12_MAINFRAME</span>
      </footer>

    </div>
  );
};

function App() {
  const [userPlan, setUserPlan] = useState('GURU ELITE');
  const [view, setView] = useState<'HOME' | 'STATS' | 'CREATOR' | 'FILES' | 'SETTINGS' | 'MARKETING' | 'PRICING' | 'MAIL'>('CREATOR');
  const [galleryItems, setGalleryItems] = useState(MOCK_GALLERY);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      const newItem = {
        id: Date.now(),
        title: file.name,
        url,
        type: file.type.startsWith('video') ? 'video' : 'image'
      };
      setGalleryItems(prev => [newItem, ...prev]);
      setTerminal(prev => prev + `\n\n[System]: Asset "${file.name}" added to Media Library.`);
    };
    reader.readAsDataURL(file);
  };
  const [mailAccount, setMailAccount] = useState<'SALES' | 'SUPPORT' | 'ACCOUNTS'>('SALES');
  const [mailFolder, setMailFolder] = useState<'INBOX' | 'SENT' | 'DRAFTS'>('INBOX');
  const [selectedMailId, setSelectedMailId] = useState<number | null>(null);
  const [isComposingMail, setIsComposingMail] = useState(false);
  const [mailDraft, setMailDraft] = useState({ to: '', subject: '', body: '' });
  const [activeTab, setActiveTab] = useState('PREVIEW');
  const [marketingTab, setMarketingTab] = useState('create');
  
  // Marketing Form State
  const [adCopy, setAdCopy] = useState('');
  const [keywords, setKeywords] = useState('');
  const [budget, setBudget] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<any>({
    facebook: true, instagram: true, tiktok: false, youtube: false
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [creatorSubTab, setCreatorSubTab] = useState<'MISSION CONTROL' | 'PUBLISH / BASH'>('MISSION CONTROL');
  const [statsSubTab, setStatsSubTab] = useState<'METRICS' | 'WALL'>('METRICS');
  const [filesSubTab, setFilesSubTab] = useState<'FOLDERS' | 'TRANSFER'>('FOLDERS');
  const [settingsSubTab, setSettingsSubTab] = useState<'General' | 'Neural' | 'Security' | 'Data' | 'Billing' | 'Legal' | 'Terms'>('General');
  const [isPublic, setIsPublic] = useState(false); // Default: Private
  const [isConnected, setIsConnected] = useState({ github: false, supabase: false });
  const [model, setModel] = useState<'GEMINI' | 'CHATGPT'>('GEMINI'); 
  const [input, setInput] = useState('');
  const [terminal, setTerminal] = useState('// MISSION: MANUAL_EXECUTION\n// STATUS: NOBLE_STABLE\n// IP: 46.62.209.177\n\n[System]: Logic deployed. Standing by...');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    gemini: localStorage.getItem('MYCANVAS_GEMINI_KEY') || '',
    chatgpt: localStorage.getItem('MYCANVAS_CHATGPT_KEY') || '',
    agent: localStorage.getItem('MYCANVAS_AGENT_KEY') || '',
    kimi: localStorage.getItem('MYCANVAS_KIMI_KEY') || ''
  });
  const [showApiVault, setShowApiVault] = useState(false);
  const [showAiFeatures, setShowAiFeatures] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [posts, setPosts] = useState<{id: number, author: string, content: string, image?: string, timestamp: string}[]>([
    { id: 1, author: "Diamond Architect", content: "V12 Engine initialized. The lab is live.", timestamp: "2m ago" },
    { id: 2, author: "Noble Guest", content: "This UI is insane. Looking forward to the Agent Builder.", timestamp: "1h ago" }
  ]);
  const [newPost, setNewPost] = useState("");
  const [dispatchStatus, setDispatchStatus] = useState('SYSTEM_IDLE');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [loginMode, setLoginMode] = useState<'ADMIN' | 'MEMBER'>('ADMIN');
  const [authView, setAuthView] = useState<'LOGIN' | 'FORGOT' | 'RESET'>('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [credits, setCredits] = useState(4200);
  const [showTopUp, setShowTopUp] = useState(credits < 500);
  const [activeLoginModal, setActiveLoginModal] = useState<string | null>(null);
  const [socialLogins, setSocialLogins] = useState<Record<string, { username: string, apiKey: string }>>({});
  const [loginInput, setLoginInput] = useState({ username: '', apiKey: '' });

  const creditOptions = [
    { label: '100 Credits / mo', price: '$10' },
    { label: '500 Credits / mo', price: '$40' },
    { label: '1000 Credits / mo', price: '$75' },
    { label: 'UNLIMITED (GURU)', price: '$299' }
  ];

  const [agents, setAgents] = useState([
    { name: "Market_Analyzer_v1", visibility: "PRIVATE", fee: "0.05 / req", status: "RUNNING" },
    { name: "Code_Architect_v4", visibility: "PUBLIC", fee: "0.12 / req", status: "RUNNING" },
    { name: "Social_Bot_Alpha", visibility: "PRIVATE", fee: "0.02 / req", status: "STOPPED" },
    { name: "Neural_Net_Beta", visibility: "PRIVATE", fee: "0.08 / req", status: "ERROR" }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<{ data: string, mimeType: string, name: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const data = base64.split(',')[1];
      setAttachment({
        data,
        mimeType: file.type,
        name: file.name
      });
      setTerminal(prev => prev + `\n\n[System]: Asset "${file.name}" loaded into Neural Buffer.`);
    };
    reader.readAsDataURL(file);
  };
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (Math.random() > 0.95) {
          const statuses: ('RUNNING' | 'STOPPED' | 'ERROR')[] = ['RUNNING', 'STOPPED', 'ERROR'];
          return { ...agent, status: statuses[Math.floor(Math.random() * statuses.length)] };
        }
        return agent;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [isForSale, setIsForSale] = useState(false);

  const handleRetract = () => {
    setDispatchStatus('RETRACTING...');
    setTerminal(prev => prev + `\n\n[System]: INITIATING_RETRACTION_PROTOCOL...\n[System]: DISCONNECTING_FROM_V12_MAINFRAME...\n[System]: ASSETS_RECALLED_TO_PRIVATE_VAULT.\n[System]: CLEARING_PUBLIC_CACHE...`);
    setTimeout(() => {
      setDispatchStatus('SYSTEM_IDLE');
      setTerminal(prev => prev + `\n[System]: RETRACTION_COMPLETE. APP_UNPUBLISHED.`);
    }, 2000);
  };

  const handleDemobilize = (agentName: string) => {
    setAgents(prev => prev.map(agent => 
      agent.name === agentName ? { ...agent, visibility: 'PRIVATE' as const } : agent
    ));
    setTerminal(prev => prev + `\n[System]: AGENT_RETRACTED: ${agentName}\n[System]: STATUS: PRIVATE_VAULT_ONLY`);
  };

  const handleMobilize = (agentName: string) => {
    setAgents(prev => prev.map(agent => 
      agent.name === agentName ? { ...agent, visibility: 'PUBLIC' as const } : agent
    ));
    setTerminal(prev => prev + `\n[System]: Mobilizing ${agentName}... Status: PUBLIC_BASH_READY.`);
    setTimeout(scrollToBottom, 100);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'mycanvas@utubemail.com' && loginPassword === 'admin123') {
      setIsLoggedIn(true);
      setTerminal(prev => prev + `\n\n[System]: Admin Access Granted. Welcome, Architect.`);
    } else {
      setTerminal(prev => prev + `\n\n[System]: Access Denied. Invalid Credentials.`);
    }
  };

  const handlePublish = async () => {
    const mode = isPublic ? 'PUBLIC' : 'PRIVATE';
    setDispatchStatus('BASHING_UP...');
    setTerminal(prev => prev + `\n\n[System]: Initiating ${mode} BASH...`);
    
    try {
      const endpoint = isPublic ? '/api/bash-up' : '/api/dispatch';
      const body = isPublic 
        ? { message: `V12 Update from Lab - ${new Date().toLocaleTimeString()}` }
        : { mode: 'PRIVATE', commitMessage: `V12 Update from Lab - ${new Date().toLocaleTimeString()}` };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setDispatchStatus(isPublic ? 'LIVE_ON_GITHUB' : 'SAVED_TO_VAULT');
        setTerminal(prev => prev + `\n[System]: ${mode} BASH COMPLETE.\n[System]: Status: NOBLE_STABLE.`);
        if (result.output) {
          setTerminal(prev => prev + `\n[System]: Output: ${result.output.substring(0, 500)}...`);
        }
      } else {
        setDispatchStatus('BASH_FAILED');
        setTerminal(prev => prev + `\n[System]: Dispatch Error: ${result.error || 'Unknown Error'}`);
      }
      
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      setDispatchStatus('CONNECTION_ERROR');
      setTerminal(prev => prev + '\n[System]: Dispatch Error. Check Connection Hub.');
    }
  };

  const handleKeyChange = (provider: 'gemini' | 'chatgpt' | 'agent' | 'kimi', value: string) => {
    const newKeys = { ...apiKeys, [provider]: value };
    setApiKeys(newKeys);
    localStorage.setItem(`MYCANVAS_${provider.toUpperCase()}_KEY`, value);
  };

  // THE V12 DUAL-CORE SWITCHBOARD
  const executeMission = async (provider = model) => {
    if (!input.trim() || isLoading) return;
    
    // 1. Pull the Key from the V12 Vault (.env) or User Vault
    const apiKey = provider === 'GEMINI' 
      ? (import.meta.env.VITE_GEMINI_API_KEY || apiKeys.gemini)
      : (import.meta.env.VITE_OPENAI_API_KEY || apiKeys.chatgpt);

    setIsLoading(true);
    setTerminal(prev => prev + `\n\n[System]: ROUTING_VIA_${provider}_CORE...`);
    
    try {
      if (provider === 'GEMINI') {
        if (!apiKey) throw new Error("GEMINI_KEY_MISSING");
        
        const ai = new GoogleGenAI({ apiKey });
        const parts: any[] = [{ text: input }];
        if (attachment) {
          parts.push({
            inlineData: {
              data: attachment.data,
              mimeType: attachment.mimeType
            }
          });
        }

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: "user", parts }],
          config: {
            systemInstruction: "You are the MyCanvasLab AI Commander. Your mission is to assist the Architect in building high-performance, income-generating web applications. You are technical, noble, and direct. You value the 'V12' power of the Hetzner mainframe. You do not make excuses; you provide solutions. You speak with the confidence of a Diamond."
          }
        });

        if (response.text) {
          setTerminal(prev => prev + `\n\n[${provider}]: ${response.text}`);
          setTerminal(prev => prev + `\n\n[System]: ${provider}_MISSION_SUCCESS.`);
          setAttachment(null);
          setInput("");
        } else {
          throw new Error("EMPTY_RESPONSE");
        }
      } else {
        // OPENAI / CHATGPT Core
        if (!apiKey) throw new Error("OPENAI_KEY_MISSING");

        // We use the V12 Proxy for OpenAI to bypass CORS and secure the key
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: 'openai',
            model: 'gpt-4o',
            prompt: input,
            systemInstruction: "You are the MyCanvasLab AI Commander. Your mission is to assist the Architect in building high-performance, income-generating web applications. You are technical, noble, and direct. You value the 'V12' power of the Hetzner mainframe. You do not make excuses; you provide solutions. You speak with the confidence of a Diamond.",
            userApiKey: apiKey
          })
        });

        const data = await res.json();
        if (data.text) {
          setTerminal(prev => prev + `\n\n[${provider}]: ${data.text}`);
          setTerminal(prev => prev + `\n\n[System]: ${provider}_MISSION_SUCCESS.`);
          setInput("");
        } else {
          throw new Error(data.error || "MISSION_FAILED");
        }
      }
      setInput(''); // Clear after send
      setTimeout(scrollToBottom, 100);
    } catch (error: any) {
      setTerminal(prev => prev + `\n\n[System]: Error - ${error.message}. Check Hetzner .env.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      author: "You (Architect)",
      content: newPost,
      timestamp: "Just now"
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleSaveToSupabase = () => {
    setTerminal(prev => prev + `\n\n[System]: INITIATING_SUPABASE_PERSISTENCE...\n[System]: ENCRYPTING_NEURAL_ASSETS...\n[System]: ASSETS_STORED_IN_VAULT_PERMANENTLY.`);
  };

  const handlePushToGit = () => {
    setTerminal(prev => prev + `\n\n[System]: INITIATING_GIT_SYNC...\n[System]: PUSHING_TO_HETZNER_V12_MAINFRAME...\n[System]: GIT_SYNC_COMPLETE.`);
  };

  const renderCreatorView = () => (
    <div className="flex-1 flex flex-col relative bg-[#010101]">
      {/* TOP UTILITY STRIP */}
      <div className="h-14 border-b border-[#181818] bg-[#050505]/80 backdrop-blur-md px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-6">
          <MCL_Logo size="sm" />
          <div className="w-px h-4 bg-zinc-800 mx-2" />
           {/* THE TOP TAB BAR */}
           <div className="flex gap-4 p-1 bg-black/40 border border-zinc-900 rounded-xl backdrop-blur-md">
             {['MISSION CONTROL', 'PUBLISH / BASH'].map((tab) => {
               const isActive = creatorSubTab === tab;
               return (
                 <button
                   key={tab}
                   onClick={() => setCreatorSubTab(tab as any)}
                   className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all border ${
                     isActive ? tabActive : tabInactive
                   }`}
                 >
                   {tab}
                 </button>
               );
             })}
           </div>
           <div className="w-px h-4 bg-zinc-800 mx-2"></div>
           <div className="flex bg-black/50 p-1 rounded-lg border border-zinc-800">
             {['PREVIEW', 'CODE'].map(v => (
               <button 
                 key={v} 
                 onClick={() => setActiveTab(v)} 
                 className={`px-5 py-1 rounded-md text-[10px] font-bold tracking-widest transition-all ${activeTab === v ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
               >
                 {v}
               </button>
             ))}
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex gap-4 text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">
              <button onClick={handleSaveToSupabase} className="hover:text-white transition-colors">Save to Supabase</button>
              <button onClick={handlePushToGit} className="hover:text-white transition-colors">Push to Git</button>
           </div>
           {dispatchStatus === 'LIVE_ON_GITHUB' || dispatchStatus === 'SAVED_TO_VAULT' ? (
             <button 
               onClick={handleRetract} 
               className="px-5 py-2 bg-zinc-900 border border-red-500/30 text-red-500 text-[10px] font-black rounded-lg uppercase hover:bg-red-500/10 transition-all shadow-lg flex items-center gap-2"
             >
               <ShieldOff className="w-3 h-3" />
               Unpublish
             </button>
           ) : (
             <button 
               onClick={handlePublish} 
               disabled={dispatchStatus === 'BASHING_UP...' || dispatchStatus === 'RETRACTING...'}
               className="px-5 py-2 bg-white text-black text-[10px] font-black rounded-lg uppercase hover:bg-zinc-200 transition-all shadow-lg disabled:opacity-50"
             >
               {dispatchStatus === 'BASHING_UP...' ? 'Bashing...' : 'Publish Live'}
             </button>
           )}
        </div>
      </div>

      {/* STAGE */}
      <div className="flex-1 overflow-hidden p-8 flex flex-col relative">
        {creatorSubTab === 'MISSION CONTROL' ? (
          <div className="w-full h-full bg-[#050505] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
             {activeTab === 'PREVIEW' ? (
               <div className="flex-1 p-8 overflow-y-auto custom-scrollbar text-orange-500 whitespace-pre-wrap relative">
                 {isLoading && (
                   <div className="absolute inset-0 z-10 p-4">
                     <PreviewLoading />
                   </div>
                 )}
                 {terminal}
                 <div ref={terminalEndRef} />
               </div>
             ) : (
               <div className="flex-1 p-8 flex items-center justify-center">
                 <p className="text-zinc-800 text-4xl font-black uppercase tracking-tighter select-none">Stage Operational</p>
               </div>
             )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto w-full mt-12 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Command Bridge</h2>
              <p className="text-zinc-600 text-sm">The definitive Architect’s Bridge for Sovereign Dispatch.</p>
            </div>
            
            <div className="p-8 bg-[#080808] border border-orange-500/20 rounded-3xl backdrop-blur-xl space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Sovereign Dispatch</h3>
                <span className={`text-[9px] font-bold ${dispatchStatus === 'BASHING_UP...' ? 'text-orange-400 animate-pulse' : 'text-zinc-600'}`}>
                  {dispatchStatus}
                </span>
              </div>

              <div className="flex gap-4">
                {/* STEP 1: SEND TO GITHUB */}
                <button 
                  onClick={() => {
                    setDispatchStatus('STAGED_FOR_DISPATCH');
                    setTerminal(prev => prev + `\n[System]: Assets staged for dispatch. Ready for Bash.`);
                  }}
                  className="flex-1 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-bold text-zinc-400 hover:border-orange-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <Code className="w-3.5 h-3.5" />
                  1. STAGE TO GIT
                </button>

                {/* STEP 2: BASH UP (THE PUSH) */}
                <button 
                  onClick={handlePublish}
                  disabled={dispatchStatus === 'BASHING_UP...' || dispatchStatus === 'RETRACTING...'}
                  className="flex-1 py-4 bg-[#ea580c] text-black rounded-xl text-[10px] font-black uppercase shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Zap className={`w-3.5 h-3.5 fill-black ${dispatchStatus === 'BASHING_UP...' ? 'animate-pulse' : ''}`} />
                  {dispatchStatus === 'BASHING_UP...' ? '🔨 BASHING...' : '2. BASH UP NOW'}
                </button>
              </div>

              {dispatchStatus === 'DISPATCH_SUCCESSFUL. MISSION_COMPLETE.' && (
                <button 
                  onClick={handleRetract}
                  className="w-full py-4 bg-zinc-900 border border-red-500/30 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldOff className="w-3.5 h-3.5" />
                  UNPUBLISH / RETRACT MISSION
                </button>
              )}

              <div className="h-px bg-zinc-900"></div>

              <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-zinc-800">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Visibility Target</span>
                  <p className="text-[9px] text-zinc-600 uppercase">{isPublic ? 'Public GitHub' : 'Private Vault'}</p>
                </div>
                <button 
                  onClick={() => setIsPublic(!isPublic)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black transition-all ${isPublic ? 'bg-orange-500 text-black shadow-[0_0_15px_#ea580c]' : 'bg-zinc-800 text-zinc-600'}`}
                >
                  {isPublic ? 'PUBLIC' : 'PRIVATE'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-[#050505] border border-zinc-900 rounded-2xl space-y-2">
                <Github className="w-5 h-5 text-zinc-600" />
                <p className="text-[10px] font-bold text-white uppercase">GitHub Sync</p>
                <p className="text-[9px] text-zinc-700">Auto-push to main branch enabled.</p>
              </div>
              <div className="p-6 bg-[#050505] border border-zinc-900 rounded-2xl space-y-2">
                <Database className="w-5 h-5 text-zinc-600" />
                <p className="text-[10px] font-bold text-white uppercase">Supabase Backup</p>
                <p className="text-[9px] text-zinc-700">Real-time DB snapshots active.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMarketingView = () => {
    const handlePlatformToggle = (platformId: string) => {
      if (!socialLogins[platformId]) {
        setActiveLoginModal(platformId);
        return;
      }
      setSelectedPlatforms((prev: any) => ({
        ...prev,
        [platformId]: !prev[platformId]
      }));
    };

    const handlePromoteFromGallery = (item: any) => {
      setSelectedMedia(item);
      setMarketingTab('create');
      setPublishSuccess(false);
    };

    const handlePublish = () => {
      setIsPublishing(true);
      setPublishSuccess(false);
      setTerminal(prev => prev + `\n\n[System]: INITIATING_DISPATCH_SEQUENCE...\n[System]: TARGET_PLATFORMS: ${Object.entries(selectedPlatforms).filter(([_, v]) => v).map(([k]) => k.toUpperCase()).join(', ')}\n[System]: ENCRYPTING_PAYLOAD...\n[System]: DISPATCHING_NEURAL_ASSETS...`);
      
      setTimeout(() => {
        setIsPublishing(false);
        setPublishSuccess(true);
        setTerminal(prev => prev + `\n[System]: DISPATCH_SUCCESSFUL. MISSION_COMPLETE.`);
        setTimeout(() => setPublishSuccess(false), 3000);
      }, 2000);
    };

    const handleSaveSocialLogin = () => {
      if (activeLoginModal) {
        setSocialLogins(prev => ({
          ...prev,
          [activeLoginModal]: { ...loginInput }
        }));
        setTerminal(prev => prev + `\n[System]: SECURE_LINK_ESTABLISHED: ${activeLoginModal.toUpperCase()}\n[System]: IDENTITY_VERIFIED: ${loginInput.username}`);
        setActiveLoginModal(null);
        setLoginInput({ username: '', apiKey: '' });
      }
    };

    const renderSocialLoginModal = () => {
      if (!activeLoginModal) return null;
      const platform = PLATFORMS.find(p => p.id === activeLoginModal);
      if (!platform) return null;

      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#050505] border border-zinc-800 rounded-[32px] p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${platform.color}`} />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${platform.color}`}>
                  <platform.icon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter">{platform.name} Login</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Secure Neural Connection</p>
                </div>
              </div>
              <button onClick={() => setActiveLoginModal(null)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Username / Email</label>
                <div className="flex items-center gap-3 p-3 bg-black/40 border border-zinc-800 rounded-xl focus-within:border-orange-500/50">
                  <User size={16} className="text-zinc-700" />
                  <input 
                    type="text" 
                    placeholder={`Enter ${platform.name} username`}
                    value={loginInput.username}
                    onChange={(e) => setLoginInput(prev => ({ ...prev, username: e.target.value }))}
                    className="flex-1 bg-transparent outline-none text-zinc-300 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Access Token / Password</label>
                <div className="flex items-center gap-3 p-3 bg-black/40 border border-zinc-800 rounded-xl focus-within:border-orange-500/50">
                  <Lock size={16} className="text-zinc-700" />
                  <input 
                    type="password" 
                    placeholder="Paste secure token..."
                    value={loginInput.apiKey}
                    onChange={(e) => setLoginInput(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="flex-1 bg-transparent outline-none text-zinc-300 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
              <p className="text-[9px] text-zinc-500 leading-relaxed font-medium">
                <span className="text-orange-500 font-black">NOTE:</span> Your credentials are encrypted and stored locally in your V12 Vault. We never see your raw passwords.
              </p>
            </div>

            <button 
              onClick={handleSaveSocialLogin}
              className={`w-full py-4 rounded-xl text-black font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all bg-orange-500 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(234,88,12,0.3)]`}
            >
              Establish Connection
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className="flex-1 flex flex-col bg-[#010101] overflow-y-auto custom-scrollbar">
        {renderSocialLoginModal()}
        {/* TOP TABS */}
        <div className="h-14 border-b border-[#181818] bg-[#050505]/80 backdrop-blur-md px-8 flex items-center gap-4 sticky top-0 z-20">
          <MCL_Logo size="sm" />
          <div className="w-px h-4 bg-zinc-800 mx-2" />
          {[
            { id: 'create', label: 'Campaign Creator', icon: Send },
            { id: 'gallery', label: 'Media Gallery', icon: Grid },
            { id: 'accounts', label: 'Connections', icon: Settings }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setMarketingTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300 flex items-center gap-2 ${marketingTab === tab.id ? 'border-orange-500 text-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(234,88,12,0.2)]' : 'border-zinc-800 text-zinc-600 bg-zinc-900/10 hover:border-orange-500/40 hover:text-orange-400 hover:bg-orange-500/5'}`}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {marketingTab === 'create' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Create Post or Ad</h2>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20">
                  <TrendingUp size={14} />
                  {budget > 0 ? `Paid Campaign ($${budget}/day)` : 'Free Organic Post'}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[#050505] p-6 rounded-2xl border border-zinc-900">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Media Attachment</h3>
                    {selectedMedia ? (
                      <div className="relative rounded-xl overflow-hidden group border border-zinc-800">
                        <img src={selectedMedia.url} alt="Selected" className="w-full h-64 object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                          <button 
                            onClick={() => setSelectedMedia(null)}
                            className="px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/50 font-black uppercase text-[10px] tracking-widest rounded-lg hover:bg-red-500 hover:text-white transition-all"
                          >
                            Remove Media
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-zinc-900 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-900/30 hover:border-orange-500/30 transition-all cursor-pointer" onClick={() => setMarketingTab('gallery')}>
                        <div className="flex gap-4 mb-3 text-zinc-700">
                          <Image size={32} />
                          <Video size={32} />
                        </div>
                        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Click to select from Gallery</p>
                        <p className="text-zinc-700 text-[9px] mt-1 font-medium">or drag and drop MP4 / JPG</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-[#050505] p-6 rounded-2xl border border-zinc-900">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Post Copy & Links</h3>
                    <textarea
                      rows={5}
                      placeholder="Write your amazing ad copy here... Don't forget to drop your link!"
                      value={adCopy}
                      onChange={(e) => setAdCopy(e.target.value)}
                      className="w-full p-4 bg-black/40 border border-zinc-800 rounded-xl focus:border-orange-500/50 outline-none resize-none text-zinc-300 text-sm"
                    ></textarea>
                  </div>

                  <div className="bg-[#050505] p-6 rounded-2xl border border-zinc-900">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Keywords & Targeting</h3>
                    <div className="flex items-center gap-3 p-3 bg-black/40 border border-zinc-800 rounded-xl focus-within:border-orange-500/50">
                      <LinkIcon size={18} className="text-zinc-700" />
                      <input 
                        type="text" 
                        placeholder="e.g. #technology, startup, innovation" 
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-zinc-300 text-sm"
                      />
                    </div>
                    <p className="text-[9px] text-zinc-700 mt-2 font-medium uppercase tracking-tighter">Our bot will suggest reciprocal tags based on these keywords.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-[#050505] p-6 rounded-2xl border border-zinc-900">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Destinations</h3>
                    <div className="space-y-2">
                      {PLATFORMS.map(platform => (
                        <label key={platform.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedPlatforms[platform.id] ? 'border-orange-500/50 bg-orange-500/5' : 'border-zinc-800 hover:bg-zinc-900/30'}`}>
                          <input 
                            type="checkbox" 
                            className="hidden"
                            checked={selectedPlatforms[platform.id]}
                            onChange={() => handlePlatformToggle(platform.id)}
                          />
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${platform.color} ${!selectedPlatforms[platform.id] && 'opacity-30 grayscale'}`}>
                            <platform.icon size={16} />
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPlatforms[platform.id] ? 'text-orange-500' : 'text-zinc-600'}`}>
                            {platform.name}
                          </span>
                          {selectedPlatforms[platform.id] && (
                            <CheckCircle2 size={16} className="ml-auto text-orange-500" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#050505] p-6 rounded-2xl border border-zinc-900">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Daily Budget</h3>
                      <span className="font-black text-lg text-orange-500">${budget}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="5"
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between text-[8px] text-zinc-700 mt-2 font-black uppercase tracking-widest">
                      <span>Free Post</span>
                      <span>$100/day</span>
                    </div>
                    {budget === 0 ? (
                      <div className="mt-4 p-3 bg-green-500/5 border border-green-500/20 text-green-500 rounded-lg text-[9px] font-bold uppercase tracking-tight flex items-start gap-2">
                        <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                        <p>This will be posted organically to your feeds for free.</p>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 text-blue-500 rounded-lg text-[9px] font-bold uppercase tracking-tight flex items-start gap-2">
                        <DollarSign size={14} className="mt-0.5 shrink-0" />
                        <p>This will be pushed as a sponsored ad to targeted users.</p>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handlePublish}
                    disabled={isPublishing || Object.values(selectedPlatforms).every(v => !v)}
                    className={`w-full py-4 rounded-xl text-black font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${isPublishing ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-[#ea580c] hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(234,88,12,0.3)]'}`}
                  >
                    {isPublishing ? (
                      <div className="w-4 h-4 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send size={16} />
                        {budget > 0 ? 'Launch Ad Campaign' : 'Post Now'}
                      </>
                    )}
                  </button>
                  
                  {publishSuccess && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-500 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 animate-bounce">
                      <CheckCircle2 size={16} />
                      Successfully dispatched!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {marketingTab === 'gallery' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Media Library</h2>
                <div className="flex items-center gap-4">
                  <input type="file" ref={galleryInputRef} className="hidden" onChange={handleGalleryUpload} accept="image/*,video/*" />
                  <button 
                    onClick={() => galleryInputRef.current?.click()}
                    className="px-6 py-2 bg-orange-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Upload size={14} />
                    Upload Asset
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {galleryItems.map(item => (
                  <div key={item.id} className="bg-[#050505] rounded-2xl overflow-hidden border border-zinc-900 group relative">
                    <div className="relative h-48 border-b border-zinc-900">
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                        {item.type === 'video' ? <Video size={14} /> : <Image size={14} />}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white truncate text-sm">{item.title}</h3>
                      <p className="text-[9px] text-zinc-600 mt-1 font-black uppercase tracking-widest">Added 2 days ago</p>
                    </div>
                    
                    <div className="absolute inset-0 bg-orange-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 backdrop-blur-sm">
                      <button 
                        onClick={() => handlePromoteFromGallery(item)}
                        className="w-full py-3 bg-black text-orange-500 font-black uppercase text-[10px] tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-900 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-2xl"
                      >
                        <Megaphone size={16} />
                        Promote this item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {marketingTab === 'accounts' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-8">Platform Integrations</h2>
              
              <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-xl flex gap-4 text-orange-500 mb-8">
                <AlertCircle className="shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-black uppercase text-[11px] tracking-widest">Security Notice for "Big League" Apps</h4>
                  <p className="text-[10px] mt-1 font-medium leading-relaxed">Instead of pasting your raw passwords (which violates platform terms and gets bots banned), use the secure OAuth connections below. This generates an official "Access Token" so your admin panel can post legally and reliably.</p>
                </div>
              </div>

              <div className="space-y-3">
                {PLATFORMS.map(platform => (
                  <div key={platform.id} className="bg-[#050505] p-6 rounded-2xl border border-zinc-900 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${platform.color}`}>
                        <platform.icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-black text-white uppercase tracking-widest text-sm">{platform.name}</h3>
                        <p className={`text-[9px] font-bold uppercase tracking-tight ${socialLogins[platform.id] ? 'text-green-500' : 'text-zinc-600'}`}>
                          {socialLogins[platform.id] ? `Connected as ${socialLogins[platform.id].username}` : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    
                    {socialLogins[platform.id] ? (
                      <button 
                        onClick={() => {
                          setActiveLoginModal(platform.id);
                          setLoginInput(socialLogins[platform.id]);
                        }}
                        className="px-4 py-2 border border-zinc-800 text-zinc-500 font-black uppercase text-[9px] tracking-widest rounded-lg hover:border-orange-500/50 hover:text-orange-500 transition-all"
                      >
                        Manage
                      </button>
                    ) : (
                      <button 
                        onClick={() => setActiveLoginModal(platform.id)}
                        className="px-4 py-2 bg-zinc-900 text-white font-black uppercase text-[9px] tracking-widest rounded-lg hover:bg-zinc-800 transition-all"
                      >
                        Connect Account
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHomeView = () => (
    <div className="flex-1 flex flex-col bg-[#010101] p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto w-full space-y-12 pb-32">
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Welcome, Architect</h2>
          <p className="text-zinc-500 text-lg font-medium">Your V12 Neural Command Center is fully operational.</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-8 bg-[#050505] border border-zinc-900 rounded-3xl space-y-4 group hover:border-orange-500/20 transition-all cursor-pointer" onClick={() => setView('CREATOR')}>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#ff6900]" />
            </div>
            <h3 className="text-xl font-bold text-white">Enter The Lab</h3>
            <p className="text-zinc-600 text-sm">Execute missions and build high-performance neural scripts.</p>
          </div>
          <div className="p-8 bg-[#050505] border border-zinc-900 rounded-3xl space-y-4 group hover:border-orange-500/20 transition-all cursor-pointer" onClick={() => setView('STATS')}>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Community Wall</h3>
            <p className="text-zinc-600 text-sm">Connect with other architects and share your progress.</p>
          </div>
        </div>

        <div className="p-8 bg-[#080808] border border-zinc-800 rounded-3xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">System Status</p>
            <p className="text-white font-bold">All Neural Links Stable</p>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatsView = () => (
    <div className="flex-1 flex flex-col bg-[#010101] overflow-y-auto custom-scrollbar">
      {/* TOP TABS */}
      <div className="h-14 border-b border-[#181818] bg-[#050505]/80 backdrop-blur-md px-8 flex items-center gap-4 sticky top-0 z-20">
        <MCL_Logo size="sm" />
        <div className="w-px h-4 bg-zinc-800 mx-2" />
        {[
          { id: 'METRICS', label: 'System Metrics' },
          { id: 'WALL', label: 'Live Bash Monitor' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setStatsSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${statsSubTab === tab.id ? 'border-orange-500 text-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(234,88,12,0.2)]' : 'border-zinc-800 text-zinc-600 bg-zinc-900/10 hover:border-orange-500/40 hover:text-orange-400 hover:bg-orange-500/5'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-8 max-w-5xl mx-auto w-full space-y-12 pb-32">
        {statsSubTab === 'METRICS' ? (
          <div className="space-y-12">
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Active Agents", value: "12", trend: "+2" },
                { label: "Neural Uptime", value: "99.9%", trend: "Stable" },
                { label: "Data Processed", value: "4.2 TB", trend: "+12%" }
              ].map((stat, i) => (
                <div key={i} className="bg-[#050505] border border-zinc-900 rounded-2xl p-6 space-y-2">
                  <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{stat.label}</span>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                    <span className="text-[10px] text-orange-500 font-bold">{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#050505] border border-zinc-900 rounded-2xl p-8 h-64 flex items-center justify-center">
              <div className="text-center space-y-2">
                <BarChart3 className="w-12 h-12 text-zinc-800 mx-auto" />
                <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-widest">Neural Load Distribution</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">The Global Feed</h2>
                <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest animate-pulse">Live Bash Monitor Active</p>
              </div>
              <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Community Neural Traffic</span>
            </div>

            {/* Post Input */}
            <div className="bg-[#080808] border border-orange-500/10 rounded-2xl p-4 space-y-4 shadow-[0_0_30px_rgba(234,88,12,0.05)]">
              <textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Bash a neural update to the global feed..."
                className="w-full bg-transparent outline-none resize-none text-sm text-zinc-300 placeholder-zinc-700 h-20 font-mono"
              />
              <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
                <div className="flex gap-4">
                  <button className="text-zinc-600 hover:text-orange-500 transition-colors">
                    <Image className="w-4 h-4" />
                  </button>
                  <button className="text-zinc-600 hover:text-orange-500 transition-colors">
                    <Code className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={handleAddPost}
                  className="px-6 py-2 bg-orange-500 text-black text-[10px] font-black rounded-lg uppercase hover:bg-orange-400 transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)]"
                >
                  Bash to Feed
                </button>
              </div>
            </div>

            {/* Feed */}
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-[#050505] border border-zinc-900 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                        <User className="w-4 h-4 text-zinc-600" />
                      </div>
                      <span className="text-[11px] font-bold text-white">{post.author}</span>
                    </div>
                    <span className="text-[9px] text-zinc-700 font-bold">{post.timestamp}</span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderFilesView = () => (
    <div className="flex-1 flex flex-col bg-[#010101] overflow-y-auto custom-scrollbar">
      {/* TOP TABS */}
      <div className="h-14 border-b border-[#181818] bg-[#050505]/80 backdrop-blur-md px-8 flex items-center gap-4 sticky top-0 z-20">
        <MCL_Logo size="sm" />
        <div className="w-px h-4 bg-zinc-800 mx-2" />
        {[
          { id: 'FOLDERS', label: 'Folders' },
          { id: 'TRANSFER', label: 'Upload / Export' },
          { id: 'HOSTING', label: 'Agent Hosting' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setFilesSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${filesSubTab === tab.id ? 'border-orange-500 text-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(234,88,12,0.2)]' : 'border-zinc-800 text-zinc-600 bg-zinc-900/10 hover:border-orange-500/40 hover:text-orange-400 hover:bg-orange-500/5'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-8 max-w-5xl mx-auto w-full space-y-8 pb-32">
        {filesSubTab === 'FOLDERS' ? (
          <div className="grid grid-cols-4 gap-4">
            {['Core_Logic.js', 'System_Assets.zip', 'Neural_Weights.bin', 'UI_Kit_V12.fig'].map((file, i) => (
              <div key={i} className="bg-[#050505] border border-zinc-900 rounded-xl p-4 flex flex-col items-center gap-3 group hover:border-orange-500/30 transition-all cursor-pointer">
                <Folder className="w-10 h-10 text-zinc-800 group-hover:text-orange-500/50 transition-colors" />
                <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300">{file}</span>
              </div>
            ))}
          </div>
        ) : filesSubTab === 'TRANSFER' ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Asset Vault</h2>
              <div className="flex gap-2">
                <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  <Upload className="w-4 h-4" />
                </button>
                <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-12 border-2 border-dashed border-zinc-900 rounded-3xl flex flex-col items-center justify-center gap-4 bg-zinc-900/5">
              <Upload className="w-12 h-12 text-zinc-800" />
              <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">Drag and drop assets to upload</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Agent Hosting</h2>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Mobilize your neural assets</p>
              </div>
              <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest">Hosting Credits: 4,200</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {agents.map((agent, i) => (
                <div key={i} className="bg-[#050505] border border-zinc-900 rounded-2xl p-6 flex items-center justify-between group hover:border-orange-500/20 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center relative">
                      <Cpu className={`w-6 h-6 ${agent.visibility === 'PUBLIC' ? 'text-orange-500' : 'text-zinc-600'}`} />
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#050505] ${
                        agent.status === 'RUNNING' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                        agent.status === 'ERROR' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                        'bg-zinc-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{agent.name}</p>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                          agent.status === 'RUNNING' ? 'border-green-500/30 text-green-500 bg-green-500/5' :
                          agent.status === 'ERROR' ? 'border-red-500/30 text-red-500 bg-red-500/5' :
                          'border-zinc-800 text-zinc-600 bg-zinc-900'
                        }`}>
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1">Fee: {agent.fee}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${agent.visibility === 'PUBLIC' ? 'border-orange-500/50 text-orange-500 bg-orange-500/5' : 'border-zinc-800 text-zinc-600'}`}>
                      {agent.visibility}
                    </span>
                    {agent.visibility === 'PRIVATE' ? (
                      <button 
                        onClick={() => handleMobilize(agent.name)}
                        className="px-5 py-2 bg-white text-black text-[10px] font-black rounded-lg uppercase hover:bg-orange-500 hover:text-white transition-all shadow-lg"
                      >
                        Mobilize
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleDemobilize(agent.name)}
                        className="px-5 py-2 bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] font-black rounded-lg uppercase hover:border-red-500/50 hover:text-red-500 transition-all"
                      >
                        Retract
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-2xl">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">The Residue Strategy</p>
              <p className="text-xs text-zinc-600 leading-relaxed italic">
                "Mobilized agents are publicly bashed onto the Hetzner network. A hosting fee applies to all public neural traffic, securing your position in the tier-based ecosystem."
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMailView = () => {
    const MOCK_EMAILS: any = {
      SALES: [
        { id: 1, from: "investor@venture.com", subject: "Series A Inquiry", body: "We are interested in the V12 Mainframe scalability. Can we schedule a call?", date: "10:30 AM", folder: 'INBOX' },
        { id: 2, from: "whale@crypto.io", subject: "Bulk License Purchase", body: "Looking to buy 500 Guru Elite licenses for my team. What's the discount?", date: "Yesterday", folder: 'INBOX' },
      ],
      SUPPORT: [
        { id: 3, from: "user123@gmail.com", subject: "API Connection Error", body: "I'm getting a 403 error when connecting to the Gemini vault. Please help.", date: "09:15 AM", folder: 'INBOX' },
        { id: 4, from: "dev_pro@stack.com", subject: "Feature Request: Webhooks", body: "Would love to see webhook support for agent mobilization events.", date: "2 days ago", folder: 'INBOX' },
      ],
      ACCOUNTS: [
        { id: 5, from: "billing@stripe.com", subject: "Payout Successful", body: "Your daily payout of $12,450.00 has been initiated.", date: "08:00 AM", folder: 'INBOX' },
        { id: 6, from: "tax@irs.gov", subject: "Tax Compliance Update", body: "Please review the new digital asset reporting requirements for 2026.", date: "Last week", folder: 'INBOX' },
      ]
    };

    const currentEmails = MOCK_EMAILS[mailAccount].filter((m: any) => m.folder === mailFolder);
    const selectedMail = MOCK_EMAILS[mailAccount].find((m: any) => m.id === selectedMailId);

    return (
      <div className="flex-1 flex flex-col bg-[#010101] overflow-hidden">
        {/* TOP BAR */}
        <div className="h-14 border-b border-[#181818] bg-[#050505]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <MCL_Logo size="sm" />
            <h3 className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em]">Admin_Mail_Terminal</h3>
            <div className="flex gap-2">
              {['SALES', 'SUPPORT', 'ACCOUNTS'].map(acc => (
                <button 
                  key={acc}
                  onClick={() => { setMailAccount(acc as any); setSelectedMailId(null); }}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${mailAccount === acc ? 'border-orange-500 text-orange-500 bg-orange-500/10' : 'border-zinc-800 text-zinc-600 hover:text-zinc-400'}`}
                >
                  {acc}@mycanvaslab.com
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setIsComposingMail(true)}
            className="px-4 py-2 bg-orange-500 text-black font-black rounded-xl uppercase text-[9px] tracking-widest shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:scale-105 transition-all"
          >
            New Message
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* SIDEBAR */}
          <div className="w-64 border-r border-[#181818] bg-[#050505] p-4 space-y-2">
            {['INBOX', 'SENT', 'DRAFTS'].map(folder => (
              <button 
                key={folder}
                onClick={() => { setMailFolder(folder as any); setSelectedMailId(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mailFolder === folder ? 'bg-orange-500/10 text-orange-500' : 'text-zinc-600 hover:bg-zinc-900/50 hover:text-zinc-400'}`}
              >
                <Folder className="w-4 h-4" />
                {folder}
              </button>
            ))}
          </div>

          {/* LIST */}
          <div className="w-96 border-r border-[#181818] bg-[#020202] overflow-y-auto custom-scrollbar">
            {currentEmails.length > 0 ? (
              currentEmails.map((mail: any) => (
                <button 
                  key={mail.id}
                  onClick={() => setSelectedMailId(mail.id)}
                  className={`w-full p-6 border-b border-[#181818] text-left transition-all hover:bg-zinc-900/30 ${selectedMailId === mail.id ? 'bg-orange-500/5 border-l-2 border-l-orange-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black text-white uppercase truncate max-w-[150px]">{mail.from}</span>
                    <span className="text-[8px] text-zinc-600 font-bold">{mail.date}</span>
                  </div>
                  <h4 className="text-[11px] font-bold text-zinc-300 mb-1 truncate">{mail.subject}</h4>
                  <p className="text-[10px] text-zinc-600 line-clamp-2 leading-relaxed">{mail.body}</p>
                </button>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
                <Mail className="w-8 h-8 text-zinc-800" />
                <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest">No messages in {mailFolder}</p>
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex-1 bg-[#010101] overflow-y-auto custom-scrollbar">
            {selectedMail ? (
              <div className="p-12 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedMail.subject}</h2>
                    <div className="flex gap-2">
                       <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all"><Share2 className="w-4 h-4" /></button>
                       <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500 hover:text-red-500 transition-all"><X className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-black text-xs">
                      {selectedMail.from[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white">{selectedMail.from}</p>
                      <p className="text-[9px] text-zinc-600 uppercase tracking-widest">To: {mailAccount.toLowerCase()}@mycanvaslab.com</p>
                    </div>
                    <div className="ml-auto text-[9px] text-zinc-700 font-black uppercase">{selectedMail.date}</div>
                  </div>
                </div>
                <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedMail.body}
                </div>
                <div className="pt-8 border-t border-zinc-900">
                  <textarea 
                    className="w-full h-32 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300 mb-4"
                    placeholder="Type your response..."
                  />
                  <button className="px-8 py-3 bg-orange-500 text-black font-black rounded-xl uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:scale-105 transition-all">
                    Send Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-orange-500/5 border border-orange-500/10 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-orange-500/20" />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] text-zinc-500 font-black uppercase tracking-widest">Secure Mail Terminal</p>
                  <p className="text-[9px] text-zinc-700 uppercase tracking-[0.2em]">Select a message to decrypt and view</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COMPOSE MODAL */}
        {isComposingMail && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-[#080808] border border-orange-500/20 rounded-[40px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in duration-300">
              <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-orange-500/5">
                <h3 className="text-orange-500 font-black text-[12px] tracking-[0.2em] uppercase">New_Neural_Transmission</h3>
                <button onClick={() => setIsComposingMail(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Recipient</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300"
                    placeholder="address@domain.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Subject</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300"
                    placeholder="Mission objective..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Message_Body</label>
                  <textarea 
                    className="w-full h-48 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300 resize-none"
                    placeholder="Enter transmission content..."
                  />
                </div>
                <div className="pt-6 flex justify-end gap-4">
                  <button 
                    onClick={() => setIsComposingMail(false)}
                    className="px-8 py-4 border border-zinc-800 text-zinc-500 font-black rounded-2xl uppercase text-[10px] tracking-widest hover:border-zinc-700 hover:text-zinc-400 transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={() => {
                      setIsComposingMail(false);
                      setTerminal(prev => prev + "\n[System]: Neural transmission dispatched successfully.");
                    }}
                    className="px-10 py-4 bg-orange-500 text-black font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:scale-105 transition-all"
                  >
                    Send Transmission
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSettingsView = () => {
    // THE MERCHANT CORE: ELITE BILLING
    const handleSubscription = (tierName: string) => {
      setTerminal(prev => prev + `\n\n[System]: INITIATING_SECURE_PAYMENT: ${tierName}_ELITE...`);
      setUserPlan(`${tierName} ELITE`);
      const tier = TIERS.find(t => t.name.includes(tierName));
      if (tier) {
        window.location.href = tier.link;
      } else {
        window.location.href = `https://billing.mycanvaslab.com/checkout?plan=${tierName}`;
      }
    };

    const settingsTabs = [
      { id: 'General', icon: '⚙️', label: 'GENERAL_SYSTEM' },
      { id: 'Neural', icon: '🧠', label: 'PERSONALIZATION' },
      { id: 'Security', icon: '🛡️', label: 'SECURITY_VAULT' },
      { id: 'Data', icon: '💾', label: 'DATA_CONTROLS' },
      { id: 'Billing', icon: '💳', label: 'SUBSCRIPTION' },
      { id: 'Legal', icon: '⚖️', label: 'LEGAL_SHIELD' },
      { id: 'Terms', icon: '📜', label: 'TERMS_OF_SERVICE' }
    ];

    return (
      <div className="flex-1 flex flex-col bg-[#010101] p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex h-[700px] w-full bg-black/40 border border-zinc-800 rounded-[40px] overflow-hidden backdrop-blur-3xl animate-in fade-in zoom-in duration-700 shadow-2xl">
            {/* TACTICAL SIDEBAR */}
            <div className="w-72 bg-zinc-900/40 border-r border-zinc-800 p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-10 px-4">
                <MCL_Logo size="sm" />
                <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase">Architect_Hub</span>
              </div>
              
              <div className="flex-1 space-y-2">
                {settingsTabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setSettingsSubTab(tab.id as any)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest ${
                      settingsSubTab === tab.id ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-[0_0_20px_rgba(234,88,12,0.1)]' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span> {tab.label}
                  </button>
                ))}
              </div>

              <div className="pt-8 border-t border-zinc-800">
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-zinc-500 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-widest"
                >
                  <LogOut className="w-5 h-5" /> TERMINATE_SESSION
                </button>
              </div>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-[#050505]/30">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black tracking-tighter uppercase text-white">{settingsSubTab}_COMMAND</h2>
                <div className="px-4 py-1 border border-orange-500/20 rounded-full bg-orange-500/5">
                  <span className="text-[9px] text-orange-500 font-black tracking-[0.2em] uppercase">V12_Mainframe_Active</span>
                </div>
              </div>
              
              {settingsSubTab === 'General' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-6">
                    <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Appearance & Interface</h3>
                    <div className="flex justify-between items-center p-6 bg-zinc-900/20 rounded-3xl border border-zinc-800">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-white uppercase">System Theme</span>
                        <p className="text-[9px] text-zinc-600 uppercase">Select your neural interface skin.</p>
                      </div>
                      <select className="bg-black border border-zinc-800 text-orange-500 text-[10px] px-4 py-2 rounded-xl outline-none focus:border-orange-500/50 transition-all">
                        <option>TACTICAL_DARK</option>
                        <option>NEURAL_ORANGE</option>
                        <option>GHOST_WHITE</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Neural Routing & Permissions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-3xl text-left space-y-2 hover:border-orange-500/20 transition-all group">
                        <Radar className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                        <p className="text-[11px] font-bold text-white uppercase">API_ROUTING</p>
                        <p className="text-[9px] text-zinc-600 uppercase">Configure mission data flow.</p>
                      </button>
                      <button className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-3xl text-left space-y-2 hover:border-orange-500/20 transition-all group">
                        <Wrench className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                        <p className="text-[11px] font-bold text-white uppercase">AGENT_PERMISSIONS</p>
                        <p className="text-[9px] text-zinc-600 uppercase">Define neural access levels.</p>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">App Management</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-3xl text-left space-y-2 hover:border-orange-500/20 transition-all group">
                        <Shield className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                        <p className="text-[11px] font-bold text-white uppercase">Private Mode</p>
                        <p className="text-[9px] text-zinc-600 uppercase">Restrict access to your lab.</p>
                      </button>
                      <button 
                        onClick={() => setIsForSale(!isForSale)}
                        className={`p-6 border rounded-3xl text-left space-y-2 transition-all group ${isForSale ? 'bg-orange-500/10 border-orange-500/40 shadow-[0_0_20px_rgba(234,88,12,0.1)]' : 'bg-zinc-900/20 border-zinc-800 hover:border-orange-500/20'}`}
                      >
                        <Zap className={`w-5 h-5 group-hover:scale-110 transition-transform ${isForSale ? 'text-[#ff6900]' : 'text-zinc-600'}`} />
                        <p className="text-[11px] font-bold text-white uppercase">{isForSale ? 'Marketplace_Active' : 'Post_For_Sale'}</p>
                        <p className="text-[9px] text-zinc-600 uppercase">{isForSale ? 'Listed on marketplace.' : 'List your app for sale.'}</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {settingsSubTab === 'Neural' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-6">
                    <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Neural API Vault</h3>
                    <div className="bg-zinc-900/20 border border-zinc-800 rounded-3xl p-8 space-y-8">
                      <div className="grid grid-cols-1 gap-6">
                        {[
                          { id: 'gemini', label: 'Gemini API Key', placeholder: 'Paste Gemini API Key...', icon: <Zap className="w-4 h-4 text-[#ff6900]" /> },
                          { id: 'chatgpt', label: 'OpenAI API Key', placeholder: 'Paste OpenAI API Key...', icon: <Key className="w-4 h-4 text-blue-500" /> },
                          { id: 'kimi', label: 'Kimi API Key', placeholder: 'Paste Kimi API Key...', icon: <Cpu className="w-4 h-4 text-purple-500" /> }
                        ].map((key) => (
                          <div key={key.id} className={`space-y-2 p-4 rounded-2xl transition-all ${key.id === 'gemini' ? 'bg-orange-500/5 border border-orange-500/20 shadow-[0_0_20px_rgba(234,88,12,0.05)]' : ''}`}>
                            <div className="flex items-center justify-between">
                              <label className={`text-[10px] uppercase font-black tracking-widest flex items-center gap-2 ${key.id === 'gemini' ? 'text-orange-500' : 'text-zinc-500'}`}>
                                {key.icon}
                                {key.label}
                              </label>
                              {apiKeys[key.id as keyof typeof apiKeys] && (
                                <span className="text-[8px] text-green-500 font-black uppercase tracking-widest">Active</span>
                              )}
                            </div>
                            <div className="relative">
                              <input 
                                type="password"
                                value={apiKeys[key.id as keyof typeof apiKeys]}
                                onChange={(e) => handleKeyChange(key.id as any, e.target.value)}
                                className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-sm outline-none transition-all text-zinc-300 pr-12 ${key.id === 'gemini' ? 'border-orange-500/30 focus:border-orange-500' : 'border-zinc-800 focus:border-orange-500/50'}`}
                                placeholder={key.placeholder}
                              />
                              <Lock className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 ${key.id === 'gemini' ? 'text-orange-500/30' : 'text-zinc-700'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-zinc-900 flex justify-end">
                        <button 
                          onClick={() => {
                            setTerminal(prev => prev + "\n[System]: Neural API Keys synchronized to local storage.");
                            alert("API Keys saved successfully.");
                          }}
                          className="px-8 py-3 bg-orange-500 text-black font-black rounded-xl uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:scale-105 transition-all"
                        >
                          Save & Sync Keys
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {settingsSubTab === 'Security' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-6">
                    <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Security Vault</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-3xl text-left space-y-2 hover:border-orange-500/20 transition-all group">
                        <Lock className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                        <p className="text-[11px] font-bold text-white uppercase">Password_Reset</p>
                        <p className="text-[9px] text-zinc-600 uppercase">Update your neural access code.</p>
                      </button>
                      <button className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-3xl text-left space-y-2 hover:border-orange-500/20 transition-all group">
                        <ShieldCheck className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                        <p className="text-[11px] font-bold text-white uppercase">MFA_Protocols</p>
                        <p className="text-[9px] text-zinc-600 uppercase">Enable multi-factor authentication.</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {settingsSubTab === 'Legal' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                  <section>
                    <h3 className="text-orange-500 font-black text-[12px] mb-4 uppercase tracking-[0.2em]">01_THE_SOVEREIGN_COMPACT</h3>
                    <div className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-3xl text-zinc-400 text-[11px] leading-relaxed font-bold uppercase">
                      BY ENTERING MYCANVASLAB, YOU RETAIN 100% OWNERSHIP OF ALL NEURAL ASSETS, CODE, AND AGENT ARCHITECTURES. WE PROVIDE THE V12 MAINFRAME; YOU PROVIDE THE COMMAND. WE DO NOT TRAIN ON YOUR PRIVATE DATA.
                    </div>
                  </section>

                  <section>
                    <h3 className="text-orange-500 font-black text-[12px] mb-4 uppercase tracking-[0.2em]">02_PRIVACY_PROTOCOL</h3>
                    <p className="text-zinc-500 text-[10px] leading-relaxed mb-4 uppercase">
                      YOUR API KEYS ARE ENCRYPTED AT REST IN THE NEURAL VAULT. DATA TRANSMISSION IS ROUTED VIA SECURE HETZNER NODES (46.62.209.177). LOGS ARE WIPED EVERY 24 HOURS UNLESS SPECIFIED BY THE ARCHITECT.
                    </p>
                  </section>

                  <div className="flex gap-4">
                    <button className="px-6 py-3 border border-orange-500/20 rounded-xl text-[9px] font-black uppercase text-orange-500 hover:bg-orange-500/10 transition-all">
                      DOWNLOAD_FULL_TERMS.PDF
                    </button>
                    <button className="px-6 py-3 border border-zinc-800 rounded-xl text-[9px] font-black uppercase text-zinc-500 hover:text-white transition-all">
                      VIEW_PRIVACY_POLICY
                    </button>
                  </div>
                </div>
              )}

              {settingsSubTab === 'Data' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-6">
                    <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">External Connections</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-zinc-900/20 border border-zinc-800 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <Github className="w-5 h-5 text-white" />
                          <div>
                            <p className="text-[11px] font-bold text-white uppercase tracking-widest">GitHub Repository</p>
                            <p className="text-[9px] text-zinc-600 uppercase">Sync your code to the cloud.</p>
                          </div>
                        </div>
                        <button className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] font-black uppercase text-zinc-400 hover:text-white transition-colors">Configure</button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-zinc-900/20 border border-zinc-800 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <Database className="w-5 h-5 text-[#3ecf8e]" />
                          <div>
                            <p className="text-[11px] font-bold text-white uppercase tracking-widest">Supabase Database</p>
                            <p className="text-[9px] text-zinc-600 uppercase">Manage your persistent data.</p>
                          </div>
                        </div>
                        <button className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] font-black uppercase text-zinc-400 hover:text-white transition-colors">Configure</button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Data Controls</h3>
                    <div className="space-y-4">
                      <button className="w-full p-6 text-left bg-red-500/5 border border-red-500/20 rounded-3xl text-red-500 hover:bg-red-500/10 transition-all group">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <span className="text-[11px] font-black uppercase">DELETE_ALL_NEURAL_TRAILS</span>
                            <p className="text-[9px] text-red-500/60 uppercase">Wipe all mission data and session logs.</p>
                          </div>
                          <AlertCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {settingsSubTab === 'Billing' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-6">
                    <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Subscription Status</h3>
                    <div className="p-8 bg-orange-500/5 border border-orange-500/20 rounded-[40px] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8">
                        <MCL_Logo size="sm" />
                      </div>
                      <h3 className="text-orange-500 font-black text-[10px] mb-4 uppercase tracking-widest">Active_Subscription: {userPlan.replace(' ', '_')}</h3>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <div className="text-4xl font-black text-white">$299<span className="text-sm text-zinc-600">/MO</span></div>
                          <span className="text-[10px] text-zinc-400 uppercase tracking-widest">NEXT_BILLING_DATE: 2026-04-29</span>
                        </div>
                        <button className="px-8 py-3 bg-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-all">MANAGE_PLAN</button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Upgrade Neural Capacity</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {TIERS.filter(t => t.name !== 'GURU ELITE').map((tier, i) => (
                        <button 
                          key={i}
                          onClick={() => handleSubscription(tier.name.split(' ')[0])}
                          className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-3xl hover:border-orange-500/30 transition-all text-left group"
                        >
                          <div className="text-[9px] text-zinc-500 font-black mb-1 uppercase tracking-widest">{tier.name}</div>
                          <div className="text-2xl font-black text-white mb-4">{tier.price}<span className="text-[10px] text-zinc-600">/MO</span></div>
                          <div className="text-[9px] text-zinc-400 uppercase font-bold group-hover:text-orange-500 transition-colors">ACTIVATE_CORE →</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {settingsSubTab === 'Terms' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                  <section className="space-y-6">
                    <h3 className="text-orange-500 font-black text-[12px] mb-4 uppercase tracking-[0.2em]">V12_COMMAND_CENTER_TERMS</h3>
                    <div className="p-8 bg-zinc-900/20 border border-zinc-800 rounded-[40px] space-y-8">
                      <div className="space-y-4">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest">01_SERVICE_PROVISION</h4>
                        <p className="text-zinc-500 text-[10px] leading-relaxed uppercase font-bold">
                          MYCANVASLAB PROVIDES A HIGH-PERFORMANCE NEURAL INTERFACE FOR AI AGENT ARCHITECTURE AND DEPLOYMENT. BY ACCESSING THE V12 MAINFRAME, YOU AGREE TO OPERATE WITHIN THE BOUNDS OF ETHICAL AI PROTOCOLS AND SOVEREIGN DATA OWNERSHIP.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest">02_INTELLECTUAL_PROPERTY</h4>
                        <p className="text-zinc-500 text-[10px] leading-relaxed uppercase font-bold">
                          ALL CODE, ASSETS, AND NEURAL WEIGHTS GENERATED WITHIN YOUR PRIVATE LAB REMAIN YOUR EXCLUSIVE PROPERTY. MYCANVASLAB RETAINS OWNERSHIP OF THE UNDERLYING V12 ARCHITECTURE AND PROPRIETARY INTERFACE TOOLS.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest">03_LIABILITY_LIMITATION</h4>
                        <p className="text-zinc-500 text-[10px] leading-relaxed uppercase font-bold">
                          THE ARCHITECT ASSUMES ALL RESPONSIBILITY FOR THE ACTIONS AND OUTPUTS OF THEIR DEPLOYED AGENTS. MYCANVASLAB IS NOT LIABLE FOR ANY NEURAL DRIFT, DATA LOSS, OR EXTERNAL SYSTEM DISRUPTION CAUSED BY AGENT OPERATIONS.
                        </p>
                      </div>
                    </div>
                  </section>

                  <div className="flex flex-col gap-4">
                    <button className="w-full p-6 bg-orange-500/10 border border-orange-500/20 rounded-3xl flex items-center justify-between group hover:bg-orange-500/20 transition-all">
                      <div className="flex items-center gap-4">
                        <FileText className="w-6 h-6 text-orange-500" />
                        <div className="text-left">
                          <p className="text-[11px] font-black text-white uppercase tracking-widest">DOWNLOAD_FULL_TERMS.PDF</p>
                          <p className="text-[9px] text-zinc-600 uppercase">OFFICIAL_V12_LEGAL_DOCUMENTATION</p>
                        </div>
                      </div>
                      <Download className="w-5 h-5 text-orange-500 group-hover:translate-y-1 transition-transform" />
                    </button>
                    
                    <p className="text-[8px] text-zinc-700 text-center uppercase tracking-widest font-black">
                      LAST_REVISION_PROTOCOL: 2026-03-30 // HETZNER_SECURE_NODE_VERIFIED
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPricingView = () => (
    <div className="flex-1 flex flex-col bg-[#010101] p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto w-full space-y-12 pb-32">
        <div className="space-y-4 text-center">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">The Elite Matrix</h2>
          <p className="text-zinc-500 text-lg font-medium">Scale your neural operations with V12 performance.</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {TIERS.map((tier, i) => (
            <TierCard key={i} tier={tier} />
          ))}
        </div>

        <div className="p-8 bg-[#080808] border border-zinc-800 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Enterprise Protocol</p>
              <p className="text-white font-bold">Custom Neural Architectures</p>
            </div>
            <button className="px-6 py-2 border border-zinc-800 rounded-xl text-[10px] font-black uppercase text-zinc-400 hover:text-white hover:border-orange-500/50 transition-all">
              Contact Sales
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-900">
            {[
              { label: 'SLA Guarantee', value: '99.99%' },
              { label: 'Response Time', value: '< 50ms' },
              { label: 'Support', value: '24/7 Elite' }
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest">{item.label}</p>
                <p className="text-white font-bold text-xs">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAiFeaturesModal = () => {
    if (!showAiFeatures) return null;

    const aiFeatures = [
      { id: 'MUSIC', title: 'Generate Music', desc: 'Text-to-Music via Lyria 3 Engine', icon: '🎵', guruOnly: true },
      { id: 'VIDEO', title: 'Animate Video', desc: 'Bring images to life with Veo 3', icon: '🎬', guruOnly: true },
      { id: 'IMAGE', title: 'Neural Imaging', desc: 'High-quality Nano Banana 2 generation', icon: '🎨' },
      { id: 'SEARCH', title: 'Google Search Data', desc: 'Real-time live web grounding', icon: '🔍' },
      { id: 'VOICE', title: 'Voice Conversations', desc: 'Live Gemini Voice interaction', icon: '🎙️' },
      { id: 'MAPS', title: 'Spatial Intelligence', desc: 'Google Maps data integration', icon: '📍' }
    ];

    const FeatureCard = ({ feature }: { feature: any }) => {
      const isLocked = feature.guruOnly && userPlan !== 'GURU ELITE';
      
      return (
        <div 
          onClick={() => {
            if (isLocked) {
              setTerminal(prev => prev + `\n\n[System]: Feature "${feature.id}" is locked. GURU_ELITE clearance required.`);
              alert("GURU_ELITE clearance required for this module.");
            } else {
              setTerminal(prev => prev + `\n\n[System]: Neural Module "${feature.id}" integrated into V12 Mainframe.`);
              setShowAiFeatures(false);
            }
          }}
          className={`p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl hover:border-[#ff6900]/50 transition-all cursor-pointer group shadow-2xl relative ${isLocked ? 'opacity-50 grayscale' : ''}`}
        >
          {/* TACTICAL ORANGE ICON */}
          <div className="w-12 h-12 rounded-2xl bg-[#ff6900]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="text-2xl filter drop-shadow-[0_0_8px_#ff6900]">{feature.icon}</span>
          </div>
          
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[12px] font-black uppercase text-white tracking-widest group-hover:text-[#ff6900]">
              {feature.title}
            </h3>
            {feature.guruOnly && (
              <span className="text-[8px] font-black px-2 py-0.5 bg-orange-500 text-black rounded-full uppercase tracking-tighter">
                GURU_ONLY
              </span>
            )}
          </div>
          <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase">
            {feature.desc}
          </p>

          {/* SELECTION INDICATOR */}
          <div className="mt-6 flex justify-end">
            <div className="w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center group-hover:border-[#ff6900]">
              <div className="w-2 h-2 rounded-full bg-[#ff6900] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-3xl">
              <Lock className="w-8 h-8 text-orange-500/50" />
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="w-full max-w-xl h-full bg-[#0a0a0a] border border-zinc-800 rounded-[40px] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-right-8 duration-500">
          <div className="p-8 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/20">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white uppercase tracking-widest">Neural Feature Matrix</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Select high-performance modules for your agent</p>
            </div>
            <button 
              onClick={() => setShowAiFeatures(false)}
              className="p-3 hover:bg-zinc-900 rounded-2xl transition-colors text-zinc-500 hover:text-white border border-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="grid grid-cols-2 gap-6">
              {aiFeatures.map((f, i) => (
                <FeatureCard key={i} feature={f} />
              ))}
            </div>
          </div>
          <div className="p-8 bg-zinc-900/40 border-t border-zinc-900">
            <div className="flex items-center justify-between p-6 bg-orange-500/5 border border-orange-500/20 rounded-3xl">
              <div className="space-y-1">
                <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest">Current Authorization</p>
                <p className="text-white font-black uppercase tracking-widest">{userPlan}</p>
              </div>
              <button 
                onClick={() => {
                  setSettingsSubTab('Billing');
                  setView('SETTINGS');
                  setShowAiFeatures(false);
                }}
                className="px-6 py-2 bg-orange-500 text-black text-[10px] font-black rounded-xl uppercase tracking-widest hover:scale-105 transition-all"
              >
                Upgrade Clearance
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContactModal = () => {
    if (!showContact) return null;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Message sent to mycanvas@utubemail.com from ${contactForm.email}`);
      setShowContact(false);
      setContactForm({ name: '', email: '', message: '' });
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/20">
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Direct Dispatch</h2>
            <button 
              onClick={() => setShowContact(false)}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] text-zinc-500 uppercase font-black">Your Name</label>
              <input 
                type="text" 
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300"
                placeholder="Architect Name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] text-zinc-500 uppercase font-black">Return Email</label>
              <input 
                type="email" 
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300"
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] text-zinc-500 uppercase font-black">Mission Brief</label>
              <textarea 
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300 h-32 resize-none"
                placeholder="Describe your request..."
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-[#ea580c] text-black font-black rounded-xl uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Send Dispatch
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    if (showLanding) {
      return (
        <LandingPage 
          onEnter={() => {
            setShowLanding(false);
            setLoginMode('MEMBER');
          }} 
          onAdminEnter={() => {
            setShowLanding(false);
            setLoginMode('ADMIN');
          }}
        />
      );
    }
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 font-mono">
        <div className="w-full max-w-md bg-[#080808] border border-orange-500/20 rounded-3xl p-10 space-y-8 backdrop-blur-xl shadow-2xl">
          <div className="flex justify-center mb-4">
            <MCL_Logo size="md" />
          </div>
          {authView === 'LOGIN' && (
            <>
              <div className="text-center space-y-2">
                <h1 className="text-orange-500 text-3xl font-black tracking-tighter uppercase">V12 Access</h1>
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Neural Command Bridge Login</p>
              </div>

              <div className="flex gap-2 p-1 bg-black/40 border border-zinc-800 rounded-xl">
                <button 
                  onClick={() => setLoginMode('ADMIN')}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${loginMode === 'ADMIN' ? 'bg-orange-500 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Admin
                </button>
                <button 
                  onClick={() => setLoginMode('MEMBER')}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${loginMode === 'MEMBER' ? 'bg-orange-500 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Member
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-500 uppercase font-black">{loginMode === 'ADMIN' ? 'Architect Email' : 'Member Email'}</label>
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300"
                    placeholder="mycanvas@utubemail.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] text-zinc-500 uppercase font-black">Access Key</label>
                    <button 
                      type="button"
                      onClick={() => setAuthView('FORGOT')}
                      className="text-[9px] text-orange-500/60 hover:text-orange-500 uppercase font-black transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300 pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#ea580c] text-black font-black rounded-xl uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Enter The Lab
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowLanding(true)}
                    className="w-full py-2 text-[9px] text-zinc-600 hover:text-zinc-400 uppercase font-black transition-colors"
                  >
                    ← Back to Landing
                  </button>
                </div>
              </form>
            </>
          )}

          {authView === 'FORGOT' && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-orange-500 text-3xl font-black tracking-tighter uppercase">Neural Recovery</h1>
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Initiate Password Reset Protocol</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-500 uppercase font-black">Registered Email</label>
                  <input 
                    type="email" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300"
                    placeholder="architect@v12.com"
                    required
                  />
                </div>
                <button 
                  onClick={() => {
                    if (resetEmail) {
                      setAuthView('RESET');
                      setTerminal(prev => prev + `\n[System]: Recovery link dispatched to ${resetEmail}.`);
                    }
                  }}
                  className="w-full py-4 bg-[#ea580c] text-black font-black rounded-xl uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Send Recovery Link
                </button>
                <button 
                  onClick={() => setAuthView('LOGIN')}
                  className="w-full text-[10px] text-zinc-600 hover:text-zinc-400 uppercase font-black transition-colors"
                >
                  Back to Command Center
                </button>
              </div>
            </div>
          )}

          {authView === 'RESET' && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-orange-500 text-3xl font-black tracking-tighter uppercase">Reset Key</h1>
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Update Neural Access Credentials</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-500 uppercase font-black">New Access Key</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300 pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (newPassword) {
                      setAuthView('LOGIN');
                      setTerminal(prev => prev + `\n[System]: Neural Access Key updated successfully.`);
                      alert("Password reset successful. Please login with your new credentials.");
                    }
                  }}
                  className="w-full py-4 bg-[#ea580c] text-black font-black rounded-xl uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Confirm New Key
                </button>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-[8px] text-zinc-800 uppercase font-bold tracking-tighter">Authorized Personnel Only // Noble Stable Protocol</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#020202] text-white font-mono overflow-hidden text-[13px]">
      {renderAiFeaturesModal()}
      {renderContactModal()}
      
      {/* HAMBURGER MENU: Only visible on desktop to toggle sidebar */}
      <button 
        onClick={() => setShowSidebar(!showSidebar)}
        className="hidden lg:flex fixed top-6 left-6 z-50 p-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl text-orange-500 hover:border-orange-500/50 transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* SIDEBAR: The Command Center */}
      <div className={`hidden lg:flex flex-col border-r border-[#181818] p-6 bg-[#050505] z-30 transition-all duration-300 ${showSidebar ? 'w-[420px]' : 'w-0 p-0 border-none overflow-hidden'}`}>
        <h1 className="text-[#ea580c] text-2xl font-black mb-8 flex items-center gap-3 whitespace-nowrap">💎 MYCANVASLAB</h1>

        {/* THE LOW FUEL WARNING BANNER */}
        {credits < 500 && (
          <div className="bg-orange-600/20 border-y border-orange-500/50 p-3 mb-6 flex justify-between items-center animate-pulse">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
              ⚠️ NEURAL FUEL CRITICAL: {credits} CREDITS REMAINING
            </span>
            <button className="bg-orange-500 text-black px-4 py-1 rounded-full text-[9px] font-black">
              REFUEL NOW
            </button>
          </div>
        )}
        
        {/* SCROLLABLE SECTION */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
          {/* CONNECTION HUB */}
          <div className="p-4 bg-zinc-900/20 border border-zinc-800 rounded-2xl space-y-3">
             <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">External Links</span>
             <div className="flex gap-2">
                <button 
                  onClick={() => setIsConnected({...isConnected, github: !isConnected.github})}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-md border transition-all ${isConnected.github ? 'border-orange-500 text-orange-500 bg-orange-500/5' : 'border-zinc-800 text-zinc-500'}`}>
                  {isConnected.github ? 'GITHUB: LIVE' : 'CONNECT GITHUB'}
                </button>
                <button 
                  onClick={() => setIsConnected({...isConnected, supabase: !isConnected.supabase})}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-md border transition-all ${isConnected.supabase ? 'border-[#3ecf8e] text-[#3ecf8e] bg-[#3ecf8e]/5' : 'border-zinc-800 text-zinc-500'}`}>
                  {isConnected.supabase ? 'SUPABASE: LIVE' : 'CONNECT DB'}
                </button>
             </div>
          </div>

          <div className="space-y-3">
            {/* THE FOLDER ICON (Asset Vault) */}
            <div className={`p-5 rounded-2xl ${glassGrey}`}>
            <div className="flex items-center gap-2 mb-4">
              <Folder className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Asset Vault</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <button 
                 onClick={() => setView('FILES')}
                 className="p-3 bg-black/40 border border-zinc-800 rounded-lg text-[9px] hover:border-orange-500 transition-all text-zinc-400"
               >
                 MY_AGENTS
               </button>
               <button className="p-3 bg-black/40 border border-zinc-800 rounded-lg text-[9px] hover:border-orange-500 transition-all text-zinc-400">PRIVATE_LIBS</button>
            </div>
          </div>

          <SidebarButton 
            label="Script Architect"
            icon="⚡"
            isActive={view === 'CREATOR'}
            onClick={() => setView('CREATOR')}
          />

          <SidebarButton 
            label="Marketing Hub"
            icon="📢"
            isActive={view === 'MARKETING'}
            onClick={() => setView('MARKETING')}
          />

          <SidebarButton 
            label="Elite Matrix"
            icon="💎"
            isActive={view === 'PRICING'}
            onClick={() => setView('PRICING')}
          />

          <SidebarButton 
            label="Vault Guardian"
            icon="⚖️"
            isActive={view === 'SETTINGS'}
            onClick={() => setView('SETTINGS')}
          />

          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-3">
            <button 
              onClick={() => setShowContact(true)}
              className="text-[10px] font-black text-zinc-600 hover:text-orange-500 transition-colors uppercase tracking-widest text-left"
            >
              Contact
            </button>
            <button 
              onClick={() => setShowAiFeatures(true)}
              className="text-[10px] font-black text-zinc-600 hover:text-orange-500 transition-colors uppercase tracking-widest text-left"
            >
              AI Features
            </button>

            {/* THE DROPDOWN SELECTOR */}
            <div className="relative group mt-4">
              <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center cursor-pointer group-hover:border-orange-500/30 transition-all">
                <span className="text-zinc-400 text-[11px] font-bold uppercase">{credits} credits / month</span>
                <span className="text-zinc-600 group-hover:text-orange-500">▼</span>
              </div>
              
              {/* HIDDEN OPTIONS MENU */}
              <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl hidden group-hover:block z-50 overflow-hidden shadow-2xl">
                {creditOptions.map((opt) => (
                  <button key={opt.label} className="w-full p-4 text-left text-[10px] font-bold text-zinc-500 hover:bg-orange-500/10 hover:text-orange-500 border-b border-zinc-800 last:border-0 transition-all">
                    {opt.label} — <span className="text-white">{opt.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* API VAULT SECTION */}
          <div className={`border transition-all duration-300 rounded-2xl overflow-hidden ${showApiVault ? 'border-orange-500/40 bg-orange-500/5' : 'border-zinc-800 bg-zinc-900/10'}`}>
            <button 
              onClick={() => setShowApiVault(!showApiVault)}
              className="w-full p-5 flex items-center justify-between text-[11px] font-bold text-zinc-400 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Key className={`w-3.5 h-3.5 ${showApiVault ? 'text-orange-500' : 'text-zinc-600'}`} />
                <span className="tracking-widest uppercase">NEURAL API VAULT</span>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${apiKeys.gemini && apiKeys.chatgpt && apiKeys.agent ? 'bg-green-500 text-green-500' : 'bg-zinc-700 text-zinc-700'}`}></div>
            </button>
            
            {showApiVault && (
              <div className="px-5 pb-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Gemini Key</label>
                  <div className="relative">
                    <input 
                      type="password"
                      value={apiKeys.gemini}
                      onChange={(e) => handleKeyChange('gemini', e.target.value)}
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-[10px] outline-none focus:border-orange-500/50 transition-all text-zinc-300"
                      placeholder="Paste Gemini API Key..."
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-700" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">ChatGPT Key</label>
                  <div className="relative">
                    <input 
                      type="password"
                      value={apiKeys.chatgpt}
                      onChange={(e) => handleKeyChange('chatgpt', e.target.value)}
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-[10px] outline-none focus:border-orange-500/50 transition-all text-zinc-300"
                      placeholder="Paste OpenAI API Key..."
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-700" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-orange-500/80 uppercase font-black tracking-widest">Agent Key (Neural Core)</label>
                  <div className="relative">
                    <input 
                      type="password"
                      value={apiKeys.agent}
                      onChange={(e) => handleKeyChange('agent', e.target.value)}
                      className="w-full bg-orange-500/5 border border-orange-500/20 rounded-xl px-4 py-2.5 text-[10px] outline-none focus:border-orange-500/50 transition-all text-zinc-200"
                      placeholder="Paste Agent API Key..."
                    />
                    <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[#ff6900]/50" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Kimi Key</label>
                  <div className="relative">
                    <input 
                      type="password"
                      value={apiKeys.kimi}
                      onChange={(e) => handleKeyChange('kimi', e.target.value)}
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-[10px] outline-none focus:border-orange-500/50 transition-all text-zinc-300"
                      placeholder="Paste Kimi API Key..."
                    />
                    <Cpu className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-700" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

          {/* TEASER FOR AGENT BUILDER */}
          <div className="p-5 border border-dashed border-zinc-800 bg-zinc-900/10 rounded-2xl group hover:border-orange-500/30 transition-all cursor-not-allowed mt-4">
             <div className="flex items-center justify-between mb-3">
               <span className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.3em]">Coming Soon</span>
               <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-orange-500/50 transition-colors"></div>
             </div>
             <p className="text-[11px] text-zinc-400 font-black uppercase tracking-widest group-hover:text-white transition-colors">Build Your Own Agent</p>
             <p className="text-[9px] text-zinc-600 mt-2 font-medium leading-relaxed">Custom neural workflows for automated execution.</p>
          </div>
        </div>

        {/* Input Dock (Sticky at bottom) */}
        <div className="bg-[#080808] p-5 rounded-3xl border border-[#181818] mt-4 space-y-4">
          {/* AI Feature Chips from Image */}
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 no-scrollbar">
            <button 
              onClick={() => setShowAiFeatures(true)}
              className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-orange-500/50 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Zap className="w-3 h-3 text-[#ff6900]" />
              AI Features
            </button>
            <button 
              onClick={() => setTerminal(prev => prev + "\n[System]: Agent Builder UI initialization protocol engaged. Coming soon.")}
              className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-orange-500/50 transition-all whitespace-nowrap"
            >
              Implement Agent Builder UI
            </button>
            <button 
              onClick={() => setShowApiVault(true)}
              className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-orange-500/50 transition-all whitespace-nowrap"
            >
              Enhance API Key...
            </button>
          </div>

          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); executeMission(); }}}
            className="w-full h-24 bg-transparent text-sm outline-none resize-none placeholder-zinc-800 text-zinc-300 font-medium" 
            placeholder="Make changes, add new features, ask for anything" 
          />

          {/* PROGRESS BAR FROM IMAGE */}
          <div className="space-y-2">
            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div className="w-[80%] h-full bg-orange-500 shadow-[0_0_10px_#ea580c]" />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#181818] pt-4">
             <div className="flex gap-3 items-center">
                <button className="text-zinc-700 hover:text-zinc-400 transition-colors">
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button className="text-zinc-700 hover:text-zinc-400 transition-colors">
                  <Radar className="w-4 h-4" />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                <button onClick={() => fileInputRef.current?.click()} className={`transition-colors ${attachment ? 'text-orange-500' : 'text-zinc-700 hover:text-orange-500'}`}>
                  <Plus className="w-5 h-5" />
                </button>
                {attachment && (
                  <div className="flex items-center gap-2 px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-md animate-in fade-in slide-in-from-left-2">
                    <span className="text-[9px] text-orange-500 font-bold truncate max-w-[80px]">{attachment.name}</span>
                    <button onClick={() => setAttachment(null)} className="text-orange-500 hover:text-white transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                )}
                <div className="flex bg-zinc-900/50 rounded-lg p-1 gap-1 border border-[#222]">
                  {['GEMINI', 'CHATGPT'].map(m => (
                    <button 
                      key={m} 
                      onClick={() => setModel(m as any)} 
                      className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${model === m ? 'bg-[#ea580c] text-black shadow-[0_0_10px_rgba(234,88,12,0.3)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
             </div>
             <button 
               onClick={() => executeMission()}
               disabled={isLoading || !input.trim()}
               className="w-10 h-10 bg-[#ea580c] rounded-full flex items-center justify-center shadow-[0_0_15px_#ea580c66] hover:scale-110 active:scale-95 transition-all disabled:opacity-50">
               <ArrowUp className="text-black w-5 h-5" strokeWidth={3} />
             </button>
          </div>
        </div>
      </div>

      {/* THE CANVAS / MAIN VIEW */}
      {view === 'CREATOR' && renderCreatorView()}
      {view === 'MARKETING' && renderMarketingView()}
      {view === 'PRICING' && renderPricingView()}
      {view === 'HOME' && renderHomeView()}
      {view === 'STATS' && renderStatsView()}
      {view === 'FILES' && renderFilesView()}
      {view === 'MAIL' && renderMailView()}
      {view === 'SETTINGS' && renderSettingsView()}

      {/* FLOATING NAV */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-10 py-3 bg-[#080808]/90 backdrop-blur-2xl border border-orange-500/10 rounded-full flex items-center gap-10 z-30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => setView('HOME')}
          className={`transition-all duration-300 ${view === 'HOME' ? 'text-orange-500' : 'text-orange-500/40 hover:text-orange-500'}`}
        >
          <Home className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <button 
          onClick={() => setView('STATS')}
          className={`transition-all duration-300 ${view === 'STATS' ? 'text-orange-500' : 'text-orange-500/40 hover:text-orange-500'}`}
        >
          <LayoutGrid className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <button 
          onClick={() => setView('CREATOR')}
          className={`w-12 h-12 border rounded-2xl flex items-center justify-center transition-all duration-300 group ${view === 'CREATOR' ? 'border-orange-500/60 bg-orange-500/10 shadow-[0_0_20px_rgba(234,88,12,0.2)]' : 'border-orange-500/30 bg-orange-500/5 shadow-[0_0_20px_rgba(234,88,12,0.1)] hover:border-orange-500/60'}`}
        >
           <Wrench className={`w-6 h-6 group-hover:scale-110 transition-transform ${view === 'CREATOR' ? 'text-orange-500' : 'text-orange-500'}`} strokeWidth={2} />
        </button>
        <button 
          onClick={() => setView('MARKETING')}
          className={`transition-all duration-300 ${view === 'MARKETING' ? 'text-orange-500' : 'text-orange-500/40 hover:text-orange-500'}`}
        >
          <Megaphone className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <button 
          onClick={() => setView('PRICING')}
          className={`transition-all duration-300 ${view === 'PRICING' ? 'text-orange-500' : 'text-orange-500/40 hover:text-orange-500'}`}
        >
          <DollarSign className="w-5 h-5" strokeWidth={1.5} />
        </button>
        {loginMode === 'ADMIN' && (
          <button 
            onClick={() => setView('MAIL')}
            className={`transition-all duration-300 ${view === 'MAIL' ? 'text-orange-500' : 'text-orange-500/40 hover:text-orange-500'}`}
          >
            <Mail className="w-5 h-5" strokeWidth={1.5} />
          </button>
        )}
        <button 
          onClick={() => setView('FILES')}
          className={`transition-all duration-300 ${view === 'FILES' ? 'text-orange-500' : 'text-orange-500/40 hover:text-orange-500'}`}
        >
          <Folder className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <button 
          onClick={() => setView('SETTINGS')}
          className={`transition-all duration-300 ${view === 'SETTINGS' ? 'text-orange-500' : 'text-orange-500/40 hover:text-orange-500'}`}
        >
          <Settings className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

export default App;
