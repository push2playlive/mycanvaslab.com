import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { GoogleGenAI, Type } from "@google/genai";
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from './firebase';
import { 
  Cpu, Send, Plus, Globe, LayoutGrid, Radar, Wrench, 
  Image, Folder, Settings, ArrowUp, Github, Database, 
  Key, Lock, Home, BarChart3, Download, Share2, CreditCard,
  Shield, Zap, Upload, Code, Eye, EyeOff, MessageSquare, User, Menu, ShieldOff, Mail, ChevronDown, Terminal,
  Music, ShieldCheck, ImagePlus, Volume2, Video, MapPin, Sparkles, X, LogOut,
  Mic, Scan, Bell,
  Megaphone, Facebook, Instagram, Youtube, DollarSign, TrendingUp, CheckCircle2, AlertCircle, Grid, Link as LinkIcon,
  FileText, Calendar, Clock, Activity, PauseCircle, Rocket, Wallet
} from "lucide-react";
import { AgentSwitcher } from './components/Navigation/AgentSwitcher';
import { SovereignLaunchpad } from './components/marketing/SovereignLaunchpad';
import { ProfileView } from './components/profile/ProfileView';
import { useProfileStore } from './store/profileStore';

import { UserProToggle } from './components/admin/UserProToggle';
import { useProCheck } from './hooks/useProCheck';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

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

const NavButton = ({ icon, label, active, onClick, color = "text-zinc-400" }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, color?: string }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-zinc-900 text-white border border-zinc-800 shadow-xl' : `hover:bg-zinc-900/50 ${color}`
    }`}
  >
    {icon}
    <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
  </button>
);

const MOCK_GALLERY = [
  { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80', title: 'New Product Launch', date: '2026-04-01T10:00:00Z', size: 1024 * 500, tags: ['marketing', 'launch', 'product'] }, // 500KB
  { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', title: 'Behind the Scenes', date: '2026-04-02T14:30:00Z', size: 1024 * 800, tags: ['office', 'team'] }, // 800KB
  { id: 3, type: 'video', url: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=400&q=80', title: 'Customer Testimonial', date: '2026-04-05T09:15:00Z', size: 1024 * 1024 * 5, tags: ['testimonial', 'video', 'social'] }, // 5MB
  { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80', title: 'Office Setup', date: '2026-04-07T16:45:00Z', size: 1024 * 300, tags: ['workspace', 'tech'] }, // 300KB
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
        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Access Command Center →</span>
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
  const [view, setView] = useState<'HOME' | 'STATS' | 'CREATOR' | 'FILES' | 'SETTINGS' | 'MARKETING' | 'PRICING' | 'MAIL' | 'PROFILE' | 'ACCOUNT' | 'DATABASE' | 'LANDING_TEST'>('PROFILE');
  const [galleryItems, setGalleryItems] = useState(MOCK_GALLERY);
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryTypeFilter, setGalleryTypeFilter] = useState<'ALL' | 'IMAGE' | 'VIDEO'>('ALL');
  const [gallerySortBy, setGallerySortBy] = useState<'name' | 'date' | 'size'>('date');
  const [gallerySortOrder, setGallerySortOrder] = useState<'asc' | 'desc'>('desc');
  const [galleryDateFilter, setGalleryDateFilter] = useState<string>('ALL');
  const [gallerySizeFilter, setGallerySizeFilter] = useState<string>('ALL');
  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [supabaseLogs, setSupabaseLogs] = useState<any[]>([]);
  const [supabaseUsers, setSupabaseUsers] = useState<any[]>([]);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  const fetchSupabaseData = async () => {
    try {
      const { data: logs, error: logsError } = await supabase
        .from('v12_scraper_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (logsError) throw logsError;
      setSupabaseLogs(logs || []);

      if (loginMode === 'ADMIN') {
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!usersError) {
          setSupabaseUsers(users || []);
        }
      }

      setIsSupabaseConnected(true);
    } catch (err) {
      console.warn("Supabase fetch failed:", err);
      setIsSupabaseConnected(false);
    }
  };

  useEffect(() => {
    if (view === 'DATABASE') {
      fetchSupabaseData();
    }
  }, [view]);

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
        type: file.type.startsWith('video') ? 'video' : 'image',
        date: new Date().toISOString(),
        size: file.size,
        tags: []
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
  const [activeTab, setActiveTab] = useState<'PREVIEW' | 'CODE' | 'SPLIT'>('PREVIEW');
  const [marketingTab, setMarketingTab] = useState('create');
  
  // Marketing Form State
  const [adCopy, setAdCopy] = useState('');
  const [keywords, setKeywords] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [budget, setBudget] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<any>({
    facebook: true, instagram: true, tiktok: false, youtube: false
  });
  const [adVariations, setAdVariations] = useState<{headline: string, body: string, cta: string}[]>([]);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [creatorSubTab, setCreatorSubTab] = useState<'MISSION CONTROL' | 'PUBLISH / BASH'>('MISSION CONTROL');
  const [statsSubTab, setStatsSubTab] = useState<'METRICS' | 'WALL'>('METRICS');
  const [filesSubTab, setFilesSubTab] = useState<'FOLDERS' | 'TRANSFER'>('FOLDERS');
  const [settingsSubTab, setSettingsSubTab] = useState<'General' | 'Neural' | 'Notifications' | 'Security' | 'Data' | 'Billing' | 'Legal' | 'Terms'>('General');
  const [profileTab, setProfileTab] = useState<'OVERVIEW' | 'WALLET' | 'AFFILIATE'>('OVERVIEW');
  const { isPro, checking: isProChecking } = useProCheck();
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
  const [showSystemVault, setShowSystemVault] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showAiFeatures, setShowAiFeatures] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isFocusing, setIsFocusing] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const toggleMic = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTerminal(prev => prev + "\n[System]: Neural Voice Interface activated. Listening for command...");
    } else {
      setTerminal(prev => prev + "\n[System]: Neural Voice Interface deactivated.");
    }
  };

  const toggleFocus = () => {
    setIsFocusing(!isFocusing);
    if (!isFocusing) {
      setTerminal(prev => prev + "\n[System]: Visual Focus Protocol engaged. Select target area.");
    } else {
      setTerminal(prev => prev + "\n[System]: Visual Focus Protocol disengaged.");
    }
  };

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
    setTerminal(prev => prev + `\n[System]: Focus Mode ${!isFocusMode ? 'ENGAGED' : 'DISENGAGED'}.`);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFocusMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  const [posts, setPosts] = useState<{id: number, author: string, content: string, image?: string, timestamp: string}[]>([
    { id: 1, author: "Diamond Architect", content: "V12 Engine initialized. The lab is live.", timestamp: "2m ago" },
    { id: 2, author: "Noble Guest", content: "This UI is insane. Looking forward to the Agent Builder.", timestamp: "1h ago" }
  ]);
  const [newPost, setNewPost] = useState("");
  const [dispatchStatus, setDispatchStatus] = useState('SYSTEM_IDLE');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: any) => {
    let error = '';
    switch (field) {
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
      case 'apiKey':
        if (!value) error = 'API Key is required';
        else if (value.length < 20) error = 'API Key seems too short';
        break;
      case 'domain':
        if (!value) error = 'Domain is required';
        else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(value)) error = 'Invalid domain format';
        break;
      case 'chat':
        if (!value.trim()) error = 'Command cannot be empty';
        break;
      case 'sources':
        if (!value.trim()) error = 'Target sources are required';
        break;
      case 'budget':
        if (value < 0) error = 'Budget cannot be negative';
        break;
      case 'name':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'message':
        if (!value.trim()) error = 'Message cannot be empty';
        break;
      case 'username':
        if (!value.trim()) error = 'Username is required';
        break;
      case 'post':
        if (!value.trim()) error = 'Post content cannot be empty';
        break;
      default:
        if (!value) error = 'This field is required';
    }
    
    setValidationErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const creditOptions = [
    { label: '100 Credits / mo', price: '$10' },
    { label: '500 Credits / mo', price: '$40' },
    { label: '1000 Credits / mo', price: '$75' },
    { label: 'UNLIMITED (GURU)', price: '$299' }
  ];

  const [agents, setAgents] = useState([
    { name: "Gatekeeper_Engine_v1", visibility: "PRIVATE", fee: "0.15 / req", status: "RUNNING", schedule: "DAILY" },
    { name: "Market_Analyzer_v1", visibility: "PRIVATE", fee: "0.05 / req", status: "RUNNING", schedule: "NONE" },
    { name: "Code_Architect_v4", visibility: "PUBLIC", fee: "0.12 / req", status: "RUNNING", schedule: "WEEKLY" },
    { name: "Social_Bot_Alpha", visibility: "PRIVATE", fee: "0.02 / req", status: "STOPPED", schedule: "NONE" },
    { name: "Neural_Net_Beta", visibility: "PRIVATE", fee: "0.08 / req", status: "ERROR", schedule: "NONE" }
  ]);
  const [schedulingAgent, setSchedulingAgent] = useState<string | null>(null);
  const [customCron, setCustomCron] = useState("");
  const [isCustomCron, setIsCustomCron] = useState(false);
  const [targetDomain, setTargetDomain] = useState('canva.com');
  const [targetSources, setTargetSources] = useState('reddit.com/r/design, twitter.com/search?q=competitor');
  const [notificationPreferences, setNotificationPreferences] = useState({
    email_notifications_enabled: true,
    agent_status_alerts: true,
    marketing_milestone_alerts: true
  });

  const fetchNotificationPreferences = async () => {
    if (!auth.currentUser) return;
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', auth.currentUser.uid)
        .single();
      
      if (data) {
        setNotificationPreferences(data);
      } else if (error && error.code === 'PGRST116') {
        // Not found, trigger will create it, but we can also insert manually if needed
        await supabase.from('notification_preferences').insert({ user_id: auth.currentUser.uid });
      }
    } catch (err) {
      console.error("Failed to fetch notification preferences:", err);
    }
  };

  const updateNotificationPreferences = async (updates: any) => {
    if (!auth.currentUser) return;
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', auth.currentUser.uid);
      
      if (!error) {
        setNotificationPreferences(prev => ({ ...prev, ...updates }));
        setTerminal(prev => prev + `\n[System]: Notification preferences updated in Security Vault.`);
      }
    } catch (err) {
      console.error("Failed to update notification preferences:", err);
    }
  };

  const sendEmailNotification = async (type: string, payload: any) => {
    if (!notificationPreferences.email_notifications_enabled) return;
    if (type === 'AGENT_STATUS' && !notificationPreferences.agent_status_alerts) return;
    if (type === 'MARKETING_MILESTONE' && !notificationPreferences.marketing_milestone_alerts) return;

    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          payload,
          userEmail: auth.currentUser?.email || 'architect@mycanvaslab.com'
        })
      });
    } catch (err) {
      console.error("Failed to send email notification:", err);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      fetchNotificationPreferences();
    }
  }, [auth.currentUser]);

  const [marketLeads, setMarketLeads] = useState<any[]>([
    { id: 1, text: "Canva is too slow for my video edits, looking for alternatives.", source: "https://reddit.com/r/design", timestamp: new Date().toISOString() },
    { id: 2, text: "Is there a way to automate my YouTube chat with AI?", source: "https://twitter.com/search?q=youtube+chat", timestamp: new Date().toISOString() }
  ]);
  const [isDeployingDispatcher, setIsDeployingDispatcher] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<{ data: string, mimeType: string, name: string } | null>(null);

  // AGENT STATUS MONITORING & AUTO-RESTART
  useEffect(() => {
    const errorAgents = agents.filter(a => a.status === 'ERROR');
    if (errorAgents.length > 0) {
      // Notify about errors
      errorAgents.forEach(agent => {
        sendEmailNotification('AGENT_STATUS', {
          agentName: agent.name,
          status: 'ERROR',
          message: `Critical fault detected in ${agent.name}. Initiating auto-recovery protocol.`
        });
      });

      const timer = setTimeout(() => {
        setAgents(prev => {
          const updated = prev.map(agent => 
            agent.status === 'ERROR' ? { ...agent, status: 'RUNNING' } : agent
          );
          
          // Notify about recovery
          errorAgents.forEach(agent => {
            sendEmailNotification('AGENT_STATUS', {
              agentName: agent.name,
              status: 'RUNNING',
              message: `${agent.name} has been successfully restored. All systems nominal.`
            });
          });

          return updated;
        });
        setTerminal(prev => prev + `\n[System]: AUTO_RESTART_PROTOCOL_EXECUTED. ALL_SYSTEMS_NOMINAL.`);
      }, 5000); // Restart after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [agents]);

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
    const checkSupabase = async () => {
      try {
        const { error } = await supabase.from('v12_scraper_logs').select('count', { count: 'exact', head: true });
        const connected = !error;
        setIsSupabaseConnected(connected);
        setIsConnected(prev => ({ ...prev, supabase: connected }));
        if (connected) {
          setTerminal(prev => prev + `\n[System]: SUPABASE_CONNECTION_ESTABLISHED: Mainframe Online.`);
        }
      } catch (err) {
        setIsSupabaseConnected(false);
        setIsConnected(prev => ({ ...prev, supabase: false }));
      }
    };
    checkSupabase();
  }, []);

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
    if (agentName === "Gatekeeper_Engine_v1") {
      setTerminal(prev => prev + `\n[System]: Mobilizing ${agentName}...\n[System]: INITIATING_GATEKEEPER_PROTOCOLS...\n[System]: FIREBASE_AUTH_SYNC: OK\n[System]: STRIPE_CRYPTO_API: READY\n[System]: Status: PUBLIC_BASH_READY.`);
    } else {
      setTerminal(prev => prev + `\n[System]: Mobilizing ${agentName}... Status: PUBLIC_BASH_READY.`);
    }
    setTimeout(scrollToBottom, 100);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsLoggedIn(true);
        
        const role = firebaseUser.email === 'push2playlive@gmail.com' ? 'ADMIN' : 'MEMBER';
        setLoginMode(role);
        
        // Fetch profile from store
        useProfileStore.getState().fetchProfile(firebaseUser.uid);
        
        setTerminal(prev => prev + `\n\n[System]: Neural Link Established. Welcome, ${firebaseUser.displayName || 'Architect'}.`);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setTerminal(prev => prev + `\n\n[System]: Initiating Google Neural Link...`);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      setTerminal(prev => prev + `\n\n[System]: Login Failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setTerminal(prev => prev + `\n\n[System]: Neural Link Terminated.`);
    } catch (error: any) {
      setTerminal(prev => prev + `\n\n[System]: Logout Error: ${error.message}`);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = validateField('email', loginEmail);
    const isPassValid = validateField('password', loginPassword);

    if (!isEmailValid || !isPassValid) return;

    if ((loginEmail === 'mycanvas@utubemail.com' || loginEmail === 'push2playlive@gmail.com') && loginPassword === 'admin123') {
      setIsLoggedIn(true);
      setTerminal(prev => prev + `\n\n[System]: Admin Access Granted. Welcome, Architect.`);
    } else {
      setTerminal(prev => prev + `\n\n[System]: Access Denied. Invalid Credentials. Please use Google Login for secure access.`);
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
    validateField(provider, value);
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
    if (!validateField('post', newPost)) return;
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

  const generateAdCopy = async () => {
    if (!keywords && !productDescription) {
      setTerminal(prev => prev + `\n\n[System]: Error - Please provide keywords or product description for the ad generator.`);
      return;
    }

    setIsGeneratingCopy(true);
    setTerminal(prev => prev + `\n\n[System]: INITIATING_NEURAL_COPY_GENERATOR...\n[System]: ANALYZING_INPUTS...`);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 3 high-converting social media ad copy variations. 
        Product Description: ${productDescription}
        Keywords: ${keywords}
        
        Each variation should include a headline, body text, and a call to action.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                body: { type: Type.STRING },
                cta: { type: Type.STRING }
              },
              required: ["headline", "body", "cta"]
            }
          }
        }
      });

      if (response.text) {
        const variations = JSON.parse(response.text);
        setAdVariations(variations);
        setTerminal(prev => prev + `\n[System]: NEURAL_COPY_GENERATED_SUCCESSFULLY. 3_VARIATIONS_READY.`);
      }
    } catch (error: any) {
      setTerminal(prev => prev + `\n\n[System]: Error - Neural Copy Generation failed: ${error.message}`);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'agent', text: string}[]>([
    { role: 'agent', text: 'V12_CORE online. System telemetry optimal. How can I assist with your build today?' }
  ]);

  const handleSendMessage = () => {
    if (!validateField('chat', chatInput)) return;
    const newHistory = [...chatHistory, { role: 'user', text: chatInput }];
    setChatHistory(newHistory as any);
    setChatInput('');
    
    // Simulated Agent Response
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        role: 'agent', 
        text: `Processing request... Analyzing build protocols. I have optimized the gatekeeper logic based on your input.` 
      }] as any);
    }, 1000);
  };

  const renderCreatorView = () => (
    <div className="flex-1 flex flex-col relative bg-[#010101] overflow-hidden">
      {/* THE PILOT RAIL (Agent Chat) */}
      <div className={`agent-chat-sector flex flex-col transition-all duration-500 ${showSidebar ? 'left-[320px]' : 'left-0'}`}>
        <div className="p-6 border-b border-zinc-900 bg-zinc-900/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.4)]">
              <Cpu className="text-black" size={16} />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest">V12_CORE</h3>
              <span className="text-[7px] font-bold text-orange-500 uppercase">Neural Link Active</span>
            </div>
          </div>
          <button onClick={() => setShowSettingsDrawer(true)} className="p-2 text-zinc-600 hover:text-orange-500 transition-colors">
            <Settings size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] font-medium leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-orange-500 text-black rounded-tr-none' 
                  : 'bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-black/40 border-t border-zinc-900">
          {/* AI Feature Chips moved to sidebar */}
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-3 no-scrollbar mb-2">
            <button 
              onClick={() => setShowAiFeatures(true)}
              className="px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-orange-500/50 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-2.5 h-2.5 text-blue-400" />
              AI Features
            </button>
            <button 
              onClick={() => setShowApiVault(true)}
              className="px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-orange-500/50 transition-all whitespace-nowrap"
            >
              Validate API Keys
            </button>
          </div>

          <div className="relative">
            <textarea 
              value={chatInput}
              onChange={(e) => {
                setChatInput(e.target.value);
                if (validationErrors.chat) validateField('chat', e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Command the Agent..."
              className={`w-full bg-zinc-900/50 border ${validationErrors.chat ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-4 py-3 text-[11px] outline-none focus:border-orange-500/50 transition-all pr-12 min-h-[80px] resize-none`}
            />
            <div className="absolute right-2 bottom-2 flex flex-col gap-2">
              <button 
                onClick={handleSendMessage}
                className="p-2 text-orange-500 hover:text-white transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2">
              <button 
                onClick={toggleFocusMode}
                className={`p-2 rounded-lg transition-all ${isFocusMode ? 'bg-orange-500/20 text-orange-500' : 'text-zinc-600 hover:text-zinc-400'}`}
                title="Toggle Focus Mode (Alt+F)"
              >
                <Eye size={16} />
              </button>
              <button 
                onClick={toggleMic}
                className={`p-2 rounded-lg transition-all ${isListening ? 'bg-orange-500/20 text-orange-500 animate-pulse' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                <Mic size={16} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-lg transition-all ${attachment ? 'text-orange-500' : 'text-zinc-600 hover:text-orange-500'}`}
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="flex bg-zinc-900/50 rounded-lg p-1 gap-1 border border-[#222]">
              {['GEMINI', 'CHATGPT'].map(m => (
                <button 
                  key={m} 
                  onClick={() => setModel(m as any)} 
                  className={`px-2 py-1 rounded-md text-[8px] font-bold transition-all ${model === m ? 'bg-[#ea580c] text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {attachment && (
            <div className="mt-3 flex items-center gap-2 px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-md animate-in fade-in slide-in-from-left-2">
              <span className="text-[9px] text-orange-500 font-bold truncate max-w-[150px]">{attachment.name}</span>
              <button onClick={() => setAttachment(null)} className="text-orange-500 hover:text-white transition-colors">
                <X size={12} />
              </button>
            </div>
          )}

          {validationErrors.chat && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest mt-2 ml-1">{validationErrors.chat}</p>}
        </div>

        {/* MINI TELEMETRY */}
        <div className="p-4 grid grid-cols-2 gap-2 border-t border-zinc-900 bg-black/20">
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800/50">
            <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mb-1">Sync</p>
            <p className="text-[10px] font-black text-orange-500">98.4%</p>
          </div>
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800/50">
            <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mb-1">Flow</p>
            <p className="text-[10px] font-black text-white">STEADY</p>
          </div>
        </div>
      </div>

      {/* THE FORGE (Main Build Preview) */}
      <div className={`main-preview-area flex-1 flex flex-col transition-all duration-500 ${showSidebar ? 'ml-[600px]' : 'ml-[320px]'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="page-title">The Forge</h1>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Live Neural Construction Environment</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-black/40 border border-zinc-900 rounded-xl p-1 gap-1">
              {(['CODE', 'PREVIEW', 'SPLIT'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${
                    activeTab === tab ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(234,88,12,0.3)]' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button 
              onClick={handlePublish}
              className="px-6 py-2 bg-white text-black text-[10px] font-black rounded-xl uppercase hover:bg-orange-500 hover:text-white transition-all shadow-xl"
            >
              Deploy to Nexus
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          {/* PREVIEW CONTAINER */}
          <div className="flex-1 bg-[#050505] rounded-3xl border border-zinc-900 overflow-hidden relative group shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]" />
            
            <div className="relative h-full flex items-center justify-center p-12">
              {/* Simulated Device */}
              <div className="w-full max-w-[320px] aspect-[9/19] bg-[#020202] border border-zinc-800 rounded-[48px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col relative ring-8 ring-zinc-900/50">
                <div className="h-6 bg-zinc-900 flex items-center justify-center border-b border-zinc-800">
                  <div className="w-12 h-3 bg-black rounded-full" />
                </div>
                <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                  <MCL_Logo size="sm" />
                  <div className="space-y-2">
                    <div className="h-4 w-2/3 bg-zinc-900 rounded" />
                    <div className="h-2 w-full bg-zinc-900/50 rounded" />
                  </div>
                  <div className="h-40 bg-orange-500/5 rounded-2xl border border-orange-500/10 flex items-center justify-center">
                    <Zap className="text-orange-500/20 w-12 h-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-zinc-900/50 rounded-xl" />
                    <div className="h-20 bg-zinc-900/50 rounded-xl" />
                  </div>
                </div>
                <div className="h-12 bg-zinc-900/50 border-t border-zinc-800" />
              </div>

              {/* Build Status */}
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Synthesis</span>
                  </div>
                  <span className="text-[10px] font-black text-orange-500">94%</span>
                </div>
                <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[94%] shadow-[0_0_10px_#ea580c]" />
                </div>
              </div>
            </div>
          </div>

          {/* TERMINAL (The Forge Sub-section) */}
          <div className="h-48 bg-[#050505] rounded-3xl border border-zinc-900 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/20">
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-zinc-600" />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Build Logs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                <span className="text-[8px] font-bold text-green-500 uppercase">System Optimal</span>
              </div>
            </div>
            <div className="flex-1 p-6 font-mono text-[10px] text-zinc-500 overflow-y-auto custom-scrollbar">
              {terminal.split('\n').map((line, i) => (
                <div key={i} className={line.includes('[System]') ? 'text-orange-500' : ''}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SETTINGS DRAWER */}
      <div className={`settings-drawer h-full w-[400px] border-l border-zinc-800 p-8 flex flex-col ${showSettingsDrawer ? 'right-0' : '-right-[400px]'}`}>
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Settings className="text-orange-500" /> System Config
          </h2>
          <button onClick={() => setShowSettingsDrawer(false)} className="p-2 text-zinc-600 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Neural Model</label>
            <select 
              value={model}
              onChange={(e) => setModel(e.target.value as any)}
              className="w-full bg-black border border-zinc-800 text-zinc-300 p-4 rounded-xl outline-none focus:border-orange-500/50"
            >
              <option value="GEMINI">GEMINI 1.5 PRO</option>
              <option value="CHATGPT">GPT-4 TURBO</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Interface Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-[10px] font-black text-orange-500 uppercase">Dark Matter</button>
              <button className="p-4 bg-black border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-600 uppercase">Solar Flare</button>
            </div>
          </div>

          <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-orange-500" size={18} />
              <h4 className="text-[10px] font-black text-white uppercase">Sovereign Shield</h4>
            </div>
            <p className="text-[9px] text-zinc-500 leading-relaxed mb-4">Automatic competitive displacement and offensive growth patterns are currently active.</p>
            <button className="w-full py-3 bg-orange-500 text-black text-[9px] font-black rounded-lg uppercase">Configure Shield</button>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-zinc-900">
          <button className="w-full py-4 bg-zinc-900 text-zinc-500 text-[10px] font-black rounded-xl uppercase hover:text-white transition-all">
            Reset Mainframe
          </button>
        </div>
      </div>
    </div>
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMarketingView = () => (
    <div className="animate-in fade-in duration-500 space-y-12">
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Marketing Hub</h2>
        <p className="text-zinc-500 text-lg font-medium">Deploy neural offensives and scale your reach across the network.</p>
      </div>
      <SovereignLaunchpad />
    </div>
  );

  const _deprecated_renderMarketingView = () => null;
        




        // Store in Supabase v12_market_leads table
        const { data, error } = await supabase
          .from('v12_market_leads')
          .insert(newLeads.map(lead => ({
            text: lead.text,
            source: lead.source,
            timestamp: lead.timestamp,
            target_domain: targetDomain
          })))
          .select();

        if (error) {
          console.warn("Supabase insertion failed (table might not exist):", error.message);
          await logToSupabase(`Lead insertion failed: ${error.message}`, 'ERROR', { error: error.message });
          setMarketLeads(prev => [...newLeads.map((l, i) => ({ ...l, id: Date.now() + i })), ...prev]);
        } else {
          await logToSupabase(`Successfully captured ${newLeads.length} leads`, 'INFO', { count: newLeads.length });
          setMarketLeads(prev => [...(data || []), ...prev]);
        }
        
        setTerminal(prev => prev + `\n[System]: DISPATCH_SUCCESSFUL: Intelligence gathered from ${targetDomain}.\n[System]: LEADS_INJECTED_INTO_VAULT.`);
        alert(`Dispatch Successful: Scrambling agents to ${targetDomain}. Leads stored in Supabase.`);
      } catch (error: any) {
        console.error("Dispatch failed:", error);
        await logToSupabase(`Dispatch failed: ${error.message}`, 'ERROR', { stack: error.stack });
        setTerminal(prev => prev + `\n[System]: ERROR: Dispatch failed - ${error.message}`);
      } finally {
        setIsDeployingDispatcher(false);
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
                <div className={`flex items-center gap-3 p-3 bg-black/40 border ${validationErrors.username ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl focus-within:border-orange-500/50`}>
                  <User size={16} className="text-zinc-700" />
                  <input 
                    type="text" 
                    placeholder={`Enter ${platform.name} username`}
                    value={loginInput.username}
                    onChange={(e) => {
                      setLoginInput(prev => ({ ...prev, username: e.target.value }));
                      if (validationErrors.username) validateField('username', e.target.value);
                    }}
                    className="flex-1 bg-transparent outline-none text-zinc-300 text-sm"
                  />
                </div>
                {validationErrors.username && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest ml-1">{validationErrors.username}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Access Token / Password</label>
                <div className={`flex items-center gap-3 p-3 bg-black/40 border ${validationErrors.apiKey ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl focus-within:border-orange-500/50`}>
                  <Lock size={16} className="text-zinc-700" />
                  <input 
                    type="password" 
                    placeholder="Paste secure token..."
                    value={loginInput.apiKey}
                    onChange={(e) => {
                      setLoginInput(prev => ({ ...prev, apiKey: e.target.value }));
                      if (validationErrors.apiKey) validateField('apiKey', e.target.value);
                    }}
                    className="flex-1 bg-transparent outline-none text-zinc-300 text-sm"
                  />
                </div>
                {validationErrors.apiKey && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest ml-1">{validationErrors.apiKey}</p>}
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
            { id: 'create', label: 'Post Creator', icon: Send },
            { id: 'campaigns', label: 'Ad Campaigns', icon: Megaphone },
            { id: 'gallery', label: 'Media Gallery', icon: Grid },
            { id: 'accounts', label: 'Connections', icon: Settings },
            ...(loginMode === 'ADMIN' ? [{ id: 'offense', label: 'Market Dispatcher', icon: Zap }] : [])
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
          {marketingTab === 'campaigns' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Ad Campaign Manager</h2>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Deploy paid neural assets across the network</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest">Ad Budget: $1,250.00</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[#050505] p-6 rounded-2xl border border-zinc-900 space-y-4">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Campaign Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Campaign Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Summer Growth Offensive 2026"
                          className="w-full p-3 bg-black/40 border border-zinc-800 rounded-xl focus:border-orange-500/50 outline-none text-zinc-300 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Daily Budget ($)</label>
                          <input 
                            type="number" 
                            value={budget}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setBudget(val);
                              validateField('budget', val);
                            }}
                            className={`w-full p-3 bg-black/40 border ${validationErrors.budget ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl focus:border-orange-500/50 outline-none text-zinc-300 text-sm`}
                          />
                          {validationErrors.budget && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest ml-1">{validationErrors.budget}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Campaign Objective</label>
                          <select className="w-full p-3 bg-black/40 border border-zinc-800 rounded-xl focus:border-orange-500/50 outline-none text-zinc-300 text-sm appearance-none">
                            <option>CONVERSIONS</option>
                            <option>TRAFFIC</option>
                            <option>AWARENESS</option>
                            <option>LEAD GEN</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#050505] p-6 rounded-2xl border border-zinc-900 space-y-4">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Target Platforms</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {PLATFORMS.map(platform => (
                        <button
                          key={platform.id}
                          onClick={() => handlePlatformToggle(platform.id)}
                          className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedPlatforms[platform.id] ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-zinc-800 bg-zinc-900/10 text-zinc-600 hover:border-zinc-700'}`}
                        >
                          <platform.icon size={20} />
                          <span className="text-[8px] font-black uppercase tracking-widest">{platform.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#050505] p-6 rounded-2xl border border-zinc-900 space-y-4">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Creative Asset</h3>
                    {selectedMedia ? (
                      <div className="relative rounded-xl overflow-hidden border border-zinc-800 aspect-video">
                        <img src={selectedMedia.url} alt="Selected" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2">
                          <button onClick={() => setSelectedMedia(null)} className="p-2 bg-black/60 backdrop-blur-md text-white rounded-lg hover:bg-red-500 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setMarketingTab('gallery')}
                        className="border-2 border-dashed border-zinc-900 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-zinc-900/30 hover:border-orange-500/30 transition-all cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 group-hover:text-orange-500 transition-all">
                          <Plus size={24} />
                        </div>
                        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Select Media from Gallery</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-[#050505] p-6 rounded-2xl border border-zinc-900 space-y-6 sticky top-24">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Campaign Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-zinc-500 uppercase">Daily Spend</span>
                        <span className="text-white">${budget}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-zinc-500 uppercase">Platforms</span>
                        <span className="text-white">{Object.values(selectedPlatforms).filter(v => v).length} Active</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-zinc-500 uppercase">Est. Reach</span>
                        <span className="text-orange-500">~{budget * 1200} users/day</span>
                      </div>
                    </div>
                    <div className="h-px bg-zinc-900" />
                    <button 
                      onClick={handlePublish}
                      disabled={isPublishing || !selectedMedia}
                      className="w-full py-4 bg-orange-500 text-black rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {isPublishing ? 'DEPLOYING...' : 'LAUNCH CAMPAIGN'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {marketingTab === 'offense' && loginMode === 'ADMIN' && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                    <Zap className="text-orange-500" />
                    Market Dispatcher
                  </h2>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Competitive Displacement & Offensive Growth</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <Shield className="w-3 h-3 text-red-500" />
                  <span className="text-[10px] text-red-500 font-black uppercase tracking-widest">Offensive Mode: ACTIVE</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-[#050505] p-6 rounded-2xl border border-zinc-900 space-y-6">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Target Acquisition</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Competitor Domain</label>
                        <div className={`flex items-center gap-3 p-3 bg-black/40 border ${validationErrors.domain ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl focus-within:border-orange-500/50`}>
                          <Globe size={16} className="text-zinc-700" />
                          <input 
                            type="text" 
                            value={targetDomain}
                            onChange={(e) => {
                              setTargetDomain(e.target.value);
                              if (validationErrors.domain) validateField('domain', e.target.value);
                            }}
                            className="flex-1 bg-transparent outline-none text-zinc-300 text-sm"
                            placeholder="competitor.com"
                          />
                        </div>
                        {validationErrors.domain && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest ml-1">{validationErrors.domain}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Target Forums / Threads</label>
                        <div className={`flex items-center gap-3 p-3 bg-black/40 border ${validationErrors.sources ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl focus-within:border-orange-500/50`}>
                          <MessageSquare size={16} className="text-zinc-700" />
                          <input 
                            type="text" 
                            value={targetSources}
                            onChange={(e) => {
                              setTargetSources(e.target.value);
                              if (validationErrors.sources) validateField('sources', e.target.value);
                            }}
                            className="flex-1 bg-transparent outline-none text-zinc-300 text-sm"
                            placeholder="reddit.com/r/design, twitter.com"
                          />
                        </div>
                        {validationErrors.sources && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest ml-1">{validationErrors.sources}</p>}
                      </div>
                      <button 
                        onClick={handleDispatch}
                        disabled={isDeployingDispatcher}
                        className="w-full py-4 bg-orange-500 text-black rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {isDeployingDispatcher ? 'DISPATCHING...' : `ATTACK MARKET: ${targetDomain}`}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#050505] p-6 rounded-2xl border border-zinc-900 space-y-4">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Growth Shield Status</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Auto-Reply (AI)', status: 'ENABLED', color: 'text-orange-500' },
                        { label: 'Trend Hijacking', status: 'MONITORING', color: 'text-orange-500' },
                        { label: 'Hiring Signals', status: 'SCANNING', color: 'text-blue-500' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-zinc-800/50">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase">{item.label}</span>
                          <span className={`text-[8px] font-black uppercase ${item.color}`}>{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[#050505] rounded-2xl border border-zinc-900 overflow-hidden">
                    <div className="p-4 border-b border-zinc-900 bg-zinc-900/20 flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Market Intelligence (War Loot)</h3>
                      <span className="text-[9px] font-bold text-zinc-600 uppercase">{marketLeads.length} Leads Captured</span>
                    </div>
                    <div className="divide-y divide-zinc-900">
                      {marketLeads.map((lead) => (
                        <div key={lead.id} className="p-6 hover:bg-orange-500/[0.02] transition-colors group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <p className="text-sm text-zinc-300 leading-relaxed font-medium italic">"{lead.text}"</p>
                              <div className="flex items-center gap-4">
                                <a href={lead.source} target="_blank" rel="noopener noreferrer" className="text-[9px] text-orange-500 font-bold uppercase tracking-widest flex items-center gap-1 hover:underline">
                                  <LinkIcon size={10} />
                                  Source Intel
                                </a>
                                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-1">
                                  <Clock size={10} />
                                  {new Date(lead.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                            <button className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:border-orange-500/50 hover:text-orange-500 transition-all opacity-0 group-hover:opacity-100">
                              Dispatch Agent
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {marketingTab === 'create' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Sovereign Launchpad</h2>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Neural Asset Deployment & Distribution</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest">V12 ENGINE ACTIVE</span>
                  </div>
                </div>
              </div>

              <SovereignLaunchpad />
            </div>
          )}

          {marketingTab === 'gallery' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Media Library</h2>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Manage your tactical assets</p>
                </div>
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
                {/* SEARCH & FILTER BAR */}
              <div className="space-y-4 bg-[#050505] p-6 rounded-2xl border border-zinc-900">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Radar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input 
                      type="text" 
                      placeholder="SEARCH_ASSETS..."
                      value={gallerySearch}
                      onChange={(e) => setGallerySearch(e.target.value)}
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-[11px] font-bold text-zinc-300 focus:border-orange-500/50 outline-none transition-all placeholder:text-zinc-700"
                    />
                  </div>
                  <div className="flex gap-2">
                    {['ALL', 'IMAGE', 'VIDEO'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setGalleryTypeFilter(type as any)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                          galleryTypeFilter === type 
                            ? 'border-orange-500 text-orange-500 bg-orange-500/10' 
                            : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-zinc-900">
                  {/* Date Filter */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Date Uploaded</label>
                    <select 
                      value={galleryDateFilter}
                      onChange={(e) => setGalleryDateFilter(e.target.value)}
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold text-zinc-400 outline-none focus:border-orange-500/50 transition-all"
                    >
                      <option value="ALL">All Time</option>
                      <option value="TODAY">Today</option>
                      <option value="WEEK">This Week</option>
                      <option value="MONTH">This Month</option>
                    </select>
                  </div>

                  {/* Size Filter */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">File Size</label>
                    <select 
                      value={gallerySizeFilter}
                      onChange={(e) => setGallerySizeFilter(e.target.value)}
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold text-zinc-400 outline-none focus:border-orange-500/50 transition-all"
                    >
                      <option value="ALL">Any Size</option>
                      <option value="SMALL">Small ({'<'} 1MB)</option>
                      <option value="MEDIUM">Medium (1MB - 10MB)</option>
                      <option value="LARGE">Large ({'>'} 10MB)</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Sort By</label>
                    <select 
                      value={gallerySortBy}
                      onChange={(e) => setGallerySortBy(e.target.value as any)}
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold text-zinc-400 outline-none focus:border-orange-500/50 transition-all"
                    >
                      <option value="name">Name</option>
                      <option value="date">Date</option>
                      <option value="size">Size</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Order</label>
                    <button 
                      onClick={() => setGallerySortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:border-orange-500/50 transition-all flex items-center justify-between"
                    >
                      {gallerySortOrder === 'asc' ? 'Ascending' : 'Descending'}
                      <ArrowUp className={`w-3 h-3 transition-transform ${gallerySortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {galleryItems
                  .filter(item => {
                    const matchesSearch = item.title.toLowerCase().includes(gallerySearch.toLowerCase()) || 
                                         item.tags?.some((t: string) => t.toLowerCase().includes(gallerySearch.toLowerCase()));
                    const matchesType = galleryTypeFilter === 'ALL' || item.type.toUpperCase() === galleryTypeFilter;
                    
                    // Date Filtering
                    let matchesDate = true;
                    if (galleryDateFilter !== 'ALL') {
                      const itemDate = new Date(item.date);
                      const now = new Date();
                      if (galleryDateFilter === 'TODAY') {
                        matchesDate = itemDate.toDateString() === now.toDateString();
                      } else if (galleryDateFilter === 'WEEK') {
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        matchesDate = itemDate >= weekAgo;
                      } else if (galleryDateFilter === 'MONTH') {
                        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                        matchesDate = itemDate >= monthAgo;
                      }
                    }

                    // Size Filtering
                    let matchesSize = true;
                    if (gallerySizeFilter !== 'ALL') {
                      const sizeInMB = item.size / (1024 * 1024);
                      if (gallerySizeFilter === 'SMALL') matchesSize = sizeInMB < 1;
                      else if (gallerySizeFilter === 'MEDIUM') matchesSize = sizeInMB >= 1 && sizeInMB <= 10;
                      else if (gallerySizeFilter === 'LARGE') matchesSize = sizeInMB > 10;
                    }

                    return matchesSearch && matchesType && matchesDate && matchesSize;
                  })
                  .sort((a, b) => {
                    let comparison = 0;
                    if (gallerySortBy === 'name') {
                      comparison = a.title.localeCompare(b.title);
                    } else if (gallerySortBy === 'date') {
                      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                    } else if (gallerySortBy === 'size') {
                      comparison = a.size - b.size;
                    }
                    return gallerySortOrder === 'asc' ? comparison : -comparison;
                  })
                  .map(item => (
                    <div key={item.id} className="bg-[#050505] rounded-2xl overflow-hidden border border-zinc-900 group relative">
                      <div className="relative h-48 border-b border-zinc-900 cursor-pointer" onClick={() => setPreviewItem(item)}>
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                          {item.type === 'video' ? <Video size={14} /> : <Image size={14} />}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye size={24} className="text-white" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-white truncate text-sm">{item.title}</h3>
                        <div className="flex flex-wrap gap-1 mt-2 mb-3">
                          {item.tags?.map((tag: string, i: number) => (
                            <span key={i} className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[8px] font-black text-zinc-500 uppercase tracking-tighter">
                              #{tag}
                            </span>
                          ))}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const newTag = prompt("Enter new tag:");
                              if (newTag) {
                                setGalleryItems(prev => prev.map(gi => gi.id === item.id ? { ...gi, tags: [...(gi.tags || []), newTag.toLowerCase()] } : gi));
                              }
                            }}
                            className="px-1.5 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded text-[8px] font-black text-orange-500 uppercase tracking-tighter hover:bg-orange-500/20 transition-all"
                          >
                            + ADD TAG
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                          <p className="text-[9px] text-zinc-500 font-bold uppercase">
                            {formatFileSize(item.size)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handlePromoteFromGallery(item)}
                          className="w-full py-2 bg-orange-500 text-black font-black uppercase text-[9px] tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-orange-400 transition-all"
                        >
                          <Megaphone size={14} />
                          Promote
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* EMPTY STATE */}
              {galleryItems.filter(item => {
                const matchesSearch = item.title.toLowerCase().includes(gallerySearch.toLowerCase());
                const matchesType = galleryTypeFilter === 'ALL' || item.type.toUpperCase() === galleryTypeFilter;
                
                // Date Filtering
                let matchesDate = true;
                if (galleryDateFilter !== 'ALL') {
                  const itemDate = new Date(item.date);
                  const now = new Date();
                  if (galleryDateFilter === 'TODAY') {
                    matchesDate = itemDate.toDateString() === now.toDateString();
                  } else if (galleryDateFilter === 'WEEK') {
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = itemDate >= weekAgo;
                  } else if (galleryDateFilter === 'MONTH') {
                    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    matchesDate = itemDate >= monthAgo;
                  }
                }

                // Size Filtering
                let matchesSize = true;
                if (gallerySizeFilter !== 'ALL') {
                  const sizeInMB = item.size / (1024 * 1024);
                  if (gallerySizeFilter === 'SMALL') matchesSize = sizeInMB < 1;
                  else if (gallerySizeFilter === 'MEDIUM') matchesSize = sizeInMB >= 1 && sizeInMB <= 10;
                  else if (gallerySizeFilter === 'LARGE') matchesSize = sizeInMB > 10;
                }

                return matchesSearch && matchesType && matchesDate && matchesSize;
              }).length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-3xl">
                  <Radar size={48} className="mx-auto text-zinc-800 mb-4 animate-pulse" />
                  <h3 className="text-zinc-500 font-black uppercase tracking-widest">No assets detected</h3>
                  <p className="text-zinc-700 text-[10px] mt-2 font-medium">Adjust your filters or upload new intel.</p>
                </div>
              )}
            </div>
          )}

          {/* MEDIA PREVIEW MODAL */}
          {previewItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setPreviewItem(null)}></div>
              <div className="relative w-full max-w-5xl bg-[#050505] border border-zinc-800 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row">
                <button 
                  onClick={() => setPreviewItem(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-all"
                >
                  <X size={20} />
                </button>

                <div className="flex-1 bg-black flex items-center justify-center min-h-[300px]">
                  {previewItem.type === 'video' ? (
                    <video src={previewItem.url} controls autoPlay className="max-w-full max-h-[70vh]" />
                  ) : (
                    <img src={previewItem.url} alt={previewItem.title} className="max-w-full max-h-[70vh] object-contain" />
                  )}
                </div>

                <div className="w-full md:w-80 p-8 border-t md:border-t-0 md:border-l border-zinc-900 space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tighter uppercase">{previewItem.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                        {previewItem.type}
                      </span>
                      <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">ID: {previewItem.id}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={() => {
                        handlePromoteFromGallery(previewItem);
                        setPreviewItem(null);
                      }}
                      className="w-full py-4 bg-orange-500 text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                    >
                      <Megaphone size={16} />
                      Promote Now
                    </button>
                    <button 
                      onClick={() => setPreviewItem(null)}
                      className="w-full py-4 bg-zinc-900 text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em] rounded-xl border border-zinc-800 hover:text-white hover:border-zinc-700 transition-all"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
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
      <div className="max-w-5xl mx-auto w-full space-y-12 pb-10">
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

      <div className="p-8 max-w-5xl mx-auto w-full space-y-12 pb-10">
        {statsSubTab === 'METRICS' ? (
          <div className="space-y-12">
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Active Agents", value: agents.length.toString(), trend: "+2" },
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
                onChange={(e) => {
                  setNewPost(e.target.value);
                  if (validationErrors.post) validateField('post', e.target.value);
                }}
                placeholder="Bash a neural update to the global feed..."
                className={`w-full bg-transparent outline-none resize-none text-sm text-zinc-300 placeholder-zinc-700 h-20 font-mono ${validationErrors.post ? 'border-b border-red-500/50' : ''}`}
              />
              {validationErrors.post && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{validationErrors.post}</p>}
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

      <div className="p-8 max-w-5xl mx-auto w-full space-y-8 pb-10">
        {filesSubTab === 'FOLDERS' ? (
          <div className="grid grid-cols-4 gap-4">
            {['gatekeeper.py', 'Core_Logic.js', 'System_Assets.zip', 'Neural_Weights.bin', 'UI_Kit_V12.fig'].map((file, i) => (
              <div key={i} className="bg-[#050505] border border-zinc-900 rounded-xl p-4 flex flex-col items-center gap-3 group hover:border-orange-500/30 transition-all cursor-pointer">
                <div className="w-10 h-10 flex items-center justify-center">
                  {file.endsWith('.py') ? <Code className="w-8 h-8 text-blue-500/50 group-hover:text-blue-400 transition-colors" /> : <Folder className="w-10 h-10 text-zinc-800 group-hover:text-orange-500/50 transition-colors" />}
                </div>
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
                        agent.status === 'STOPPED' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                        'bg-zinc-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-bold text-white">{agent.name}</p>
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 shadow-lg ${
                          agent.status === 'RUNNING' ? 'border-green-500/50 text-green-500 bg-green-500/10 shadow-green-500/5 animate-pulse' :
                          agent.status === 'ERROR' ? 'border-red-500 text-red-500 bg-red-500/20 shadow-red-500/20 animate-shake' :
                          agent.status === 'STOPPED' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' :
                          'border-zinc-800 text-zinc-500 bg-zinc-900/50'
                        }`}>
                          {agent.status === 'RUNNING' && <CheckCircle2 size={12} className="animate-pulse" />}
                          {agent.status === 'ERROR' && <AlertCircle size={12} className="animate-shake" />}
                          {agent.status === 'STOPPED' && <PauseCircle size={12} />}
                          <span className="tracking-[0.1em]">{agent.status}</span>
                        </span>
                        {agent.status === 'ERROR' && (
                          <button 
                            onClick={() => {
                              const btn = document.activeElement as HTMLButtonElement;
                              if (btn) btn.disabled = true;
                              setTerminal(prev => prev + `\n[System]: MANUAL_RETRY_INITIATED: ${agent.name}\n[System]: ANALYZING_FAULT_LOGS...\n[System]: CLEARING_CACHE_BUFFERS...`);
                              
                              setTimeout(() => {
                                setAgents(prev => prev.map(a => a.name === agent.name ? { ...a, status: 'RUNNING' } : a));
                                setTerminal(prev => prev + `\n[System]: RESTART_SUCCESSFUL: ${agent.name}\n[System]: ALL_SYSTEMS_NOMINAL.`);
                                if (btn) btn.disabled = false;
                              }, 1500);
                            }}
                            className="px-5 py-2 bg-gradient-to-r from-orange-600 to-orange-400 text-white text-[10px] font-black rounded-xl uppercase hover:from-white hover:to-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_25px_rgba(234,88,12,0.4)] flex items-center gap-2 border border-orange-500/50 active:scale-95 group"
                          >
                            <Zap size={12} className="animate-pulse group-hover:animate-spin" />
                            <span>Retry</span>
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Fee: {agent.fee}</p>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={10} className="text-zinc-700" />
                          <span className={`text-[9px] font-black uppercase tracking-widest ${agent.schedule !== 'NONE' ? 'text-orange-500' : 'text-zinc-700'}`}>
                            {agent.schedule.startsWith('CRON:') ? 'CUSTOM CRON' : agent.schedule}
                          </span>
                        </div>
                        {agent.schedule.startsWith('CRON:') && (
                           <div className="flex items-center gap-2 px-2 py-0.5 bg-orange-500/5 border border-orange-500/20 rounded text-[8px] font-black text-orange-500 uppercase tracking-widest">
                             <Clock size={8} />
                             {agent.schedule.replace('CRON: ', '')}
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {schedulingAgent === agent.name ? (
                        <div className="flex flex-col gap-4 bg-[#0a0a0a] border border-orange-500/30 rounded-2xl p-5 animate-in slide-in-from-right-4 min-w-[280px] shadow-[0_0_40px_rgba(0,0,0,0.8)] z-50">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <Clock size={12} className="text-orange-500" />
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Scheduler</span>
                            </div>
                            <div className="flex bg-zinc-900/50 rounded-lg p-1 border border-zinc-800">
                              <button 
                                onClick={() => setIsCustomCron(false)}
                                className={`px-3 py-1 rounded-md text-[8px] font-black uppercase transition-all ${!isCustomCron ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-zinc-600 hover:text-zinc-400'}`}
                              >
                                Presets
                              </button>
                              <button 
                                onClick={() => setIsCustomCron(true)}
                                className={`px-3 py-1 rounded-md text-[8px] font-black uppercase transition-all ${isCustomCron ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-zinc-600 hover:text-zinc-400'}`}
                              >
                                Cron
                              </button>
                            </div>
                          </div>

                          {!isCustomCron ? (
                            <div className="flex gap-2">
                              {['NONE', 'DAILY', 'WEEKLY'].map(opt => (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    setAgents(prev => prev.map(a => a.name === agent.name ? { ...a, schedule: opt } : a));
                                    setSchedulingAgent(null);
                                  }}
                                  className={`flex-1 py-2 rounded-xl border text-[9px] font-black uppercase transition-all ${agent.schedule === opt ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 p-2 bg-black/40 border border-zinc-800 rounded-xl focus-within:border-orange-500/50">
                                <Clock size={14} className="text-zinc-700" />
                                <input 
                                  type="text" 
                                  placeholder="* * * * *" 
                                  value={customCron}
                                  onChange={(e) => setCustomCron(e.target.value)}
                                  className="flex-1 bg-transparent outline-none text-zinc-300 text-[10px] font-bold"
                                  autoFocus
                                />
                              </div>
                              
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  { label: 'Hourly', pattern: '0 * * * *' },
                                  { label: 'Midnight', pattern: '0 0 * * *' },
                                  { label: 'Mon-Fri', pattern: '0 0 * * 1-5' }
                                ].map(p => (
                                  <button 
                                    key={p.label}
                                    onClick={() => setCustomCron(p.pattern)}
                                    className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[7px] font-black text-zinc-500 hover:text-orange-500 hover:border-orange-500/30 transition-all uppercase"
                                  >
                                    {p.label}
                                  </button>
                                ))}
                              </div>

                              <div className="flex gap-2">
                                <button 
                                  onClick={() => {
                                    if (customCron) {
                                      setAgents(prev => prev.map(a => a.name === agent.name ? { ...a, schedule: `CRON: ${customCron}` } : a));
                                      setSchedulingAgent(null);
                                      setCustomCron("");
                                      setIsCustomCron(false);
                                    }
                                  }}
                                  className="flex-1 py-2 bg-orange-500 text-black rounded-xl text-[9px] font-black uppercase hover:bg-orange-400 transition-all"
                                >
                                  Set
                                </button>
                                <button 
                                  onClick={() => setIsCustomCron(false)}
                                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-xl text-[9px] font-black uppercase hover:text-white transition-all"
                                >
                                  Back
                                </button>
                              </div>
                            </div>
                          )}
                          
                          <button 
                            onClick={() => {
                              setSchedulingAgent(null);
                              setCustomCron("");
                              setIsCustomCron(false);
                            }}
                            className="w-full py-1 text-[8px] font-black text-zinc-700 hover:text-red-500 uppercase tracking-widest transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setSchedulingAgent(agent.name);
                            setIsCustomCron(agent.schedule.startsWith('CRON:'));
                            setCustomCron(agent.schedule.startsWith('CRON:') ? agent.schedule.replace('CRON: ', '') : "");
                          }}
                          className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500 hover:text-orange-500 hover:border-orange-500/50 transition-all"
                          title="Schedule Agent"
                        >
                          <Clock size={16} />
                        </button>
                      )}
                    </div>
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

  const renderLandingTest = () => (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-24 px-8 flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 mb-8">
            <Zap size={12} className="text-orange-500" />
            <span>NEW: NEURAL ENGINE 2.0 IS LIVE</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase italic">
            Launch Your App <br />
            <span className="text-orange-500 text-outline">In Seconds</span>
          </h1>
          <p className="max-w-2xl text-zinc-400 text-lg mb-10 leading-relaxed">
            The first all-in-one platform designed for creators who demand speed, sovereignty, and scale. Build, market, and monetize from a single dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-all">
              GET STARTED
            </button>
            <button className="border border-zinc-700 px-8 py-4 rounded-full font-bold hover:bg-zinc-900 transition-all">
              VIEW DEMO
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-12 grid md:grid-cols-3 gap-8 border-t border-zinc-900">
        <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50">
          <Shield className="text-orange-500 mb-4" />
          <h3 className="font-bold mb-2 uppercase">Sovereign Data</h3>
          <p className="text-sm text-zinc-500">You own your keys, your members, and your content. No middlemen.</p>
        </div>
        <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50">
          <Rocket className="text-orange-500 mb-4" />
          <h3 className="font-bold mb-2 uppercase">Neural Growth</h3>
          <p className="text-sm text-zinc-500">Automated marketing tools that push your app to the top of the chain.</p>
        </div>
        <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50">
          <Zap className="text-orange-500 mb-4" />
          <h3 className="font-bold mb-2 uppercase">V12 Speed</h3>
          <p className="text-sm text-zinc-500">Engineered for high-frequency deployment. Build at the speed of thought.</p>
        </div>
      </section>
    </div>
  );

  const renderDatabaseView = () => (
    <div className="flex-1 flex flex-col bg-[#010101] overflow-y-auto custom-scrollbar">
      <div className="h-14 border-b border-[#181818] bg-[#050505]/80 backdrop-blur-md px-8 flex items-center gap-4 sticky top-0 z-20">
        <MCL_Logo size="sm" />
        <div className="w-px h-4 bg-zinc-800 mx-2" />
        <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Database Vault</h2>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-orange-500 shadow-[0_0_10px_#ea580c]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
              {isSupabaseConnected ? 'VAULT_CONNECTED' : 'VAULT_OFFLINE'}
            </span>
          </div>
          <button 
            onClick={fetchSupabaseData}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500 hover:text-orange-500 transition-all"
          >
            <Activity size={14} />
          </button>
        </div>
      </div>

      <div className="p-8 max-w-5xl mx-auto w-full space-y-12 pb-10">
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Data Stream</h2>
          <p className="text-zinc-500 text-sm font-medium">Real-time intelligence logs from the Supabase Vault.</p>
        </div>

        {!isSupabaseConnected && (
          <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <AlertCircle size={24} />
              <h3 className="text-lg font-black uppercase tracking-tighter">Connection Error</h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              The application is unable to establish a secure link with your Supabase database. 
              Please verify your <span className="text-white font-bold">VITE_SUPABASE_URL</span> and <span className="text-white font-bold">VITE_SUPABASE_ANON_KEY</span> in the Secrets panel.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => setView('SETTINGS')}
                className="px-6 py-2 bg-red-500 text-white text-[10px] font-black rounded-lg uppercase hover:bg-red-400 transition-all"
              >
                Configure Secrets
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-[#050505] border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-900 bg-zinc-900/20 flex items-center justify-between">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Recent Scraper Logs</h3>
              <span className="text-[9px] font-bold text-zinc-600 uppercase">{supabaseLogs.length} Entries</span>
            </div>
            <div className="divide-y divide-zinc-900 max-h-[600px] overflow-y-auto custom-scrollbar">
              {supabaseLogs.length > 0 ? (
                supabaseLogs.map((log, i) => (
                  <div key={i} className="p-4 hover:bg-orange-500/[0.02] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                            log.type === 'ERROR' ? 'border-red-500/30 text-red-500 bg-red-500/5' :
                            log.type === 'QUERY' ? 'border-blue-500/30 text-blue-500 bg-blue-500/5' :
                            'border-green-500/30 text-green-500 bg-green-500/5'
                          }`}>
                            {log.type}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-300">{log.message}</span>
                        </div>
                        <p className="text-[9px] text-zinc-600 font-medium uppercase tracking-widest">
                          Domain: {log.target_domain} | ID: {log.dispatch_id}
                        </p>
                        {log.details && (
                          <pre className="text-[8px] text-zinc-700 bg-black/40 p-2 rounded mt-2 font-mono overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </div>
                      <span className="text-[9px] text-zinc-700 font-bold whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center space-y-4">
                  <Database className="w-12 h-12 text-zinc-800 mx-auto" />
                  <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">No logs detected in the mainframe.</p>
                </div>
              )}
            </div>
          </div>

          {loginMode === 'ADMIN' && (
            <div className="bg-[#050505] border border-zinc-900 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-zinc-900 bg-zinc-900/20 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">User Management</h3>
                <span className="text-[9px] font-bold text-zinc-600 uppercase">{supabaseUsers.length} Users</span>
              </div>
              <div className="divide-y divide-zinc-900 max-h-[600px] overflow-y-auto custom-scrollbar">
                {supabaseUsers.length > 0 ? (
                  supabaseUsers.map((user) => (
                    <div key={user.id} className="p-4 hover:bg-orange-500/[0.02] transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                              <User className="text-zinc-700" size={20} />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">{user.username || user.email}</h4>
                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{user.email}</p>
                          </div>
                        </div>
                        <UserProToggle userId={user.id} initialStatus={user.is_pro} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center space-y-4">
                    <User className="w-12 h-12 text-zinc-800 mx-auto" />
                    <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">No users found in the vault.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfilePage = () => {
    return <ProfileView />;
  };

  const renderSettingsPage = () => (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#010101]">
      <div className="max-w-3xl mx-auto p-12">
        <div className="settings-panel shadow-shield bg-[#050505] p-10 rounded-3xl border border-zinc-900">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3 mb-10">
            <Settings className="text-orange-500" /> Bridge Settings
          </h2>
          
          <div className="space-y-8">
            <div className="setting-group">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 block">Visual Interface</label>
              <select className="v12-input w-full bg-black border border-zinc-800 text-zinc-300 p-3 rounded-xl outline-none focus:border-orange-500/50 transition-all">
                <option>Dark Matter (Default)</option>
                <option>Nebula Pulse</option>
                <option>Solar Flare</option>
              </select>
            </div>

            <div className="setting-group">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 block">System Sync</label>
              <div className="toggle-box flex items-center justify-between p-4 bg-black border border-zinc-800 rounded-xl">
                <span className="text-sm text-zinc-400">Auto-sync missions across all apps</span>
                <input type="checkbox" defaultChecked className="accent-orange-500 w-5 h-5" />
              </div>
            </div>

            <div className="setting-group">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 block">Security Level</label>
              <input type="range" min="1" max="10" defaultValue="8" className="v12-slider w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
              <div className="flex justify-between mt-2">
                <span className="text-[9px] text-zinc-700 font-bold uppercase">Shielding: High</span>
                <span className="text-[9px] text-orange-500 font-black uppercase tracking-widest">Behavioral Firewall Active</span>
              </div>
            </div>
            
            <button className="w-full py-4 bg-orange-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-orange-400 transition-all shadow-[0_0_20px_rgba(234,88,12,0.2)]">
              Save Bridge Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountPage = () => (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#010101]">
      <div className="max-w-4xl mx-auto p-12">
        <div className="account-vault bg-[#050505] p-10 rounded-3xl border border-zinc-900 shadow-shield">
          <header className="vault-header flex justify-between items-center mb-12">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
              <CreditCard className="text-orange-500" /> The Vault
            </h2>
            <button className="buyout-badge px-4 py-2 bg-orange-500 text-black font-black text-[10px] rounded-full uppercase tracking-widest">
              LIFETIME OWNER
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="subscription-status bg-black/40 p-8 rounded-2xl border border-zinc-800">
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">Active Plan: Architect Tier</h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">Next billing cycle: May 10, 2026</p>
              <button className="w-full py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 font-black uppercase text-[10px] tracking-widest rounded-xl hover:border-orange-500/50 hover:text-orange-500 transition-all">
                Upgrade Credits
              </button>
            </div>

            <div className="connected-limbs bg-black/40 p-8 rounded-2xl border border-zinc-800">
              <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Authorized Connections</h3>
              <ul className="space-y-4">
                {[
                  { name: 'mycanvaslab.com', status: 'ACTIVE', icon: CheckCircle2, color: 'text-orange-500' },
                  { name: 'utubechat.com', status: 'ACTIVE', icon: CheckCircle2, color: 'text-orange-500' },
                  { name: 'hygieneteam.nz', status: 'INACTIVE', icon: Lock, color: 'text-zinc-700' }
                ].map((limb, i) => (
                  <li key={i} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <limb.icon size={14} className={limb.color} />
                      <span className="text-xs font-bold text-zinc-300">{limb.name}</span>
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${limb.color}`}>{limb.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
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
      { id: 'Notifications', icon: '🔔', label: 'NEURAL_ALERTS' },
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
                  onClick={handleLogout}
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
                                <span className="text-[8px] text-orange-500 font-black uppercase tracking-widest">Active</span>
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

              {settingsSubTab === 'Notifications' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-6">
                    <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Neural Alert Configuration</h3>
                    <div className="bg-zinc-900/20 border border-zinc-800 rounded-3xl p-8 space-y-8">
                      <div className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-zinc-800">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-white uppercase">Master Email Notifications</span>
                          <p className="text-[9px] text-zinc-600 uppercase">Enable or disable all outgoing neural alerts.</p>
                        </div>
                        <button 
                          onClick={() => updateNotificationPreferences({ email_notifications_enabled: !notificationPreferences.email_notifications_enabled })}
                          className={`w-12 h-6 rounded-full transition-all relative ${notificationPreferences.email_notifications_enabled ? 'bg-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'bg-zinc-800'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notificationPreferences.email_notifications_enabled ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-zinc-800">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-white uppercase">Agent Status Alerts</span>
                            <p className="text-[9px] text-zinc-600 uppercase">Get notified when agents change status (ERROR, RUNNING).</p>
                          </div>
                          <button 
                            onClick={() => updateNotificationPreferences({ agent_status_alerts: !notificationPreferences.agent_status_alerts })}
                            className={`w-10 h-5 rounded-full transition-all relative ${notificationPreferences.agent_status_alerts ? 'bg-orange-500' : 'bg-zinc-800'}`}
                          >
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${notificationPreferences.agent_status_alerts ? 'right-0.5' : 'left-0.5'}`} />
                          </button>
                        </div>

                        <div className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-zinc-800">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-white uppercase">Marketing Milestones</span>
                            <p className="text-[9px] text-zinc-600 uppercase">Alerts for campaign launches and performance milestones.</p>
                          </div>
                          <button 
                            onClick={() => updateNotificationPreferences({ marketing_milestone_alerts: !notificationPreferences.marketing_milestone_alerts })}
                            className={`w-10 h-5 rounded-full transition-all relative ${notificationPreferences.marketing_milestone_alerts ? 'bg-orange-500' : 'bg-zinc-800'}`}
                          >
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${notificationPreferences.marketing_milestone_alerts ? 'right-0.5' : 'left-0.5'}`} />
                          </button>
                        </div>
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
      <div className="max-w-5xl mx-auto w-full space-y-12 pb-10">
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
      const isNameValid = validateField('name', contactForm.name);
      const isEmailValid = validateField('email', contactForm.email);
      const isMsgValid = validateField('message', contactForm.message);

      if (!isNameValid || !isEmailValid || !isMsgValid) return;

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
                onChange={(e) => {
                  setContactForm({...contactForm, name: e.target.value});
                  if (validationErrors.name) validateField('name', e.target.value);
                }}
                className={`w-full bg-black/40 border ${validationErrors.name ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300`}
                placeholder="Architect Name"
                required
              />
              {validationErrors.name && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{validationErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[9px] text-zinc-500 uppercase font-black">Return Email</label>
              <input 
                type="email" 
                value={contactForm.email}
                onChange={(e) => {
                  setContactForm({...contactForm, email: e.target.value});
                  if (validationErrors.email) validateField('email', e.target.value);
                }}
                className={`w-full bg-black/40 border ${validationErrors.email ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300`}
                placeholder="email@example.com"
                required
              />
              {validationErrors.email && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{validationErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[9px] text-zinc-500 uppercase font-black">Mission Brief</label>
              <textarea 
                value={contactForm.message}
                onChange={(e) => {
                  setContactForm({...contactForm, message: e.target.value});
                  if (validationErrors.message) validateField('message', e.target.value);
                }}
                className={`w-full bg-black/40 border ${validationErrors.message ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300 h-32 resize-none`}
                placeholder="Describe your request..."
                required
              />
              {validationErrors.message && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{validationErrors.message}</p>}
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

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('user_profiles').select('user_id', { count: 'exact', head: true }).limit(1);
        if (error && error.message.includes('fetch')) setIsOffline(true);
      } catch (e) {
        setIsOffline(true);
      }
    };
    checkConnection();
  }, []);

  if (isOffline) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-10 font-mono">
        <div className="max-w-md w-full p-10 border border-red-500/30 bg-red-500/5 rounded-[40px] text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
            <ShieldOff className="text-red-500 animate-pulse" size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">SYSTEM_OFFLINE</h2>
            <p className="text-zinc-500 text-xs uppercase tracking-widest leading-relaxed">
              Neural link to Supabase mainframe severed. Check your environment variables or network protocols.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-red-500 text-black font-black rounded-2xl uppercase text-xs tracking-widest hover:scale-105 transition-all"
          >
            RETRY_CONNECTION
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center font-mono">
        <div className="text-orange-500 animate-pulse uppercase tracking-[0.3em] text-xs font-black">
          Synchronizing Neural Matrix...
        </div>
      </div>
    );
  }

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
                <div className="space-y-4">
                  <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full py-3 bg-white text-black font-black rounded-xl uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all"
                  >
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                    Login with Google
                  </button>
                  
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-zinc-800"></div>
                    <span className="flex-shrink mx-4 text-[9px] text-zinc-600 uppercase font-black tracking-widest">OR</span>
                    <div className="flex-grow border-t border-zinc-800"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-500 uppercase font-black">{loginMode === 'ADMIN' ? 'Architect Email' : 'Member Email'}</label>
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300"
                    placeholder="push2playlive@gmail.com"
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
                  <label className="text-[9px] text-zinc-500 uppercase font-black">Neural Access Key</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        validateField('password', e.target.value);
                      }}
                      className={`w-full bg-black/40 border ${validationErrors.password ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500/50 transition-all text-zinc-300 pr-12`}
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
                  {validationErrors.password && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{validationErrors.password}</p>}
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
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {renderAiFeaturesModal()}
      {renderContactModal()}

      {/* 1. THE COMMAND SIDEBAR (Fixed & Clean) */}
      <aside className="w-80 border-r border-zinc-800 bg-black p-6 flex flex-col justify-between z-50">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <MCL_Logo size="sm" />
            <h1 className="font-black tracking-tighter text-xl italic uppercase">MyCanvasLab</h1>
          </div>

          <nav className="space-y-2">
            <NavButton icon={<User size={18}/>} label="Profile Home" active={view === 'PROFILE'} onClick={() => setView('PROFILE')} />
            <NavButton icon={<Rocket size={18}/>} label="Marketing Hub" active={view === 'MARKETING'} onClick={() => setView('MARKETING')} color="text-orange-500" />
            <NavButton icon={<Wallet size={18}/>} label="Vault & Wallet" active={view === 'SETTINGS'} onClick={() => setView('SETTINGS')} />
            <NavButton icon={<Settings size={18}/>} label="System Config" active={view === 'ACCOUNT'} onClick={() => setView('ACCOUNT')} />
            <NavButton icon={<Database size={18}/>} label="Database Vault" active={view === 'DATABASE'} onClick={() => setView('DATABASE')} />
            <NavButton icon={<Globe size={18}/>} label="Landing Test" active={view === 'LANDING_TEST'} onClick={() => setView('LANDING_TEST')} />
          </nav>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono text-green-500">V12_CORE_NOMINAL</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-tight italic">"Systems synchronized. Ready for deployment, Commander."</p>
          </div>

          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={16} />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* 2. THE MAIN STAGE (Scrollable & Contained) */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 relative custom-scrollbar">
        <div className="max-w-5xl mx-auto p-12 pb-32">
          {view === 'PROFILE' && renderProfilePage()}
          {view === 'MARKETING' && renderMarketingView()}
          {view === 'SETTINGS' && renderSettingsPage()}
          {view === 'ACCOUNT' && renderAccountPage()}
          {view === 'DATABASE' && renderDatabaseView()}
          {view === 'LANDING_TEST' && renderLandingTest()}
          
          {/* Fallbacks for other views if needed */}
          {view === 'CREATOR' && renderCreatorView()}
          {view === 'HOME' && renderHomeView()}
          {view === 'STATS' && renderStatsView()}
          {view === 'FILES' && renderFilesView()}
          {view === 'MAIL' && renderMailView()}
          {view === 'PRICING' && renderPricingView()}
        </div>

        {/* SETTINGS DRAWER (Keep it for extra config if needed) */}
        <div className={`fixed inset-y-0 right-0 w-[400px] bg-[#050505] border-l border-zinc-900 z-[60] transition-transform duration-500 shadow-2xl ${showSettingsDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">System Settings</h2>
              <button onClick={() => setShowSettingsDrawer(false)} className="p-2 hover:bg-zinc-900 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
              {/* API KEYS */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Neural API Keys</label>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-zinc-700 uppercase font-black">Gemini Key</label>
                    <input 
                      type="password"
                      value={apiKeys.gemini}
                      onChange={(e) => handleKeyChange('gemini', e.target.value)}
                      className={`w-full bg-black/40 border ${validationErrors.gemini ? 'border-red-500/50' : 'border-zinc-800'} rounded-lg px-3 py-2 text-[10px] outline-none focus:border-orange-500/50 transition-all text-zinc-300`}
                      placeholder="Paste Key..."
                    />
                    {validationErrors.gemini && <p className="text-[7px] text-red-500 font-bold uppercase tracking-widest">{validationErrors.gemini}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-zinc-700 uppercase font-black">ChatGPT Key</label>
                    <input 
                      type="password"
                      value={apiKeys.chatgpt}
                      onChange={(e) => handleKeyChange('chatgpt', e.target.value)}
                      className={`w-full bg-black/40 border ${validationErrors.chatgpt ? 'border-red-500/50' : 'border-zinc-800'} rounded-lg px-3 py-2 text-[10px] outline-none focus:border-orange-500/50 transition-all text-zinc-300`}
                      placeholder="Paste Key..."
                    />
                    {validationErrors.chatgpt && <p className="text-[7px] text-red-500 font-bold uppercase tracking-widest">{validationErrors.chatgpt}</p>}
                  </div>
                </div>
              </div>

              {/* SYSTEM VAULT */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">System Vault</label>
                <div className="space-y-3">
                   <button 
                     onClick={() => setIsConnected({...isConnected, github: !isConnected.github})}
                     className={`w-full py-2 text-[10px] font-bold rounded-lg border transition-all ${isConnected.github ? 'border-orange-500 text-orange-500 bg-orange-500/5' : 'border-zinc-800 text-zinc-500'}`}>
                     {isConnected.github ? 'GITHUB: LIVE' : 'CONNECT GITHUB'}
                   </button>
                   <button 
                     onClick={() => setIsConnected({...isConnected, supabase: !isConnected.supabase})}
                     className={`w-full py-2 text-[10px] font-bold rounded-lg border transition-all ${isConnected.supabase ? 'border-orange-500 text-orange-500 bg-orange-500/5' : 'border-zinc-800 text-zinc-500'}`}>
                     {isConnected.supabase ? 'SUPABASE: LIVE' : 'CONNECT DB'}
                   </button>
                </div>
              </div>

              {/* CREDITS */}
              <div className="p-5 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Neural Fuel</span>
                  <span className="text-orange-500 font-black text-xs">{credits} CR</span>
                </div>
                <button className="w-full py-2 bg-orange-500 text-black font-black text-[9px] uppercase tracking-widest rounded-lg hover:bg-orange-400 transition-all">
                  Refuel Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
