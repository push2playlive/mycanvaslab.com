import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Cpu, Send, Plus, Globe, LayoutGrid, Radar, Wrench, 
  Image, Folder, Settings, ArrowUp, Github, Database, 
  Key, Lock, Home, BarChart3, Download, Share2, 
  Shield, Zap, Upload, Code, Eye, MessageSquare, User
} from "lucide-react";

// STYLES: Tactical Glassmorphism
const glassGrey = "bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50";
const glassOrange = "bg-orange-500/5 backdrop-blur-xl border border-orange-500/20";

function App() {
  const [view, setView] = useState<'HOME' | 'STATS' | 'CREATOR' | 'FILES' | 'SETTINGS'>('CREATOR');
  const [activeTab, setActiveTab] = useState('PREVIEW');
  const [creatorSubTab, setCreatorSubTab] = useState<'MISSION' | 'PUBLISH'>('MISSION');
  const [statsSubTab, setStatsSubTab] = useState<'METRICS' | 'WALL'>('METRICS');
  const [filesSubTab, setFilesSubTab] = useState<'FOLDERS' | 'TRANSFER'>('FOLDERS');
  const [settingsSubTab, setSettingsSubTab] = useState<'INTEGRATIONS' | 'CONFIG'>('INTEGRATIONS');
  const [isPublic, setIsPublic] = useState(false); // Default: Private
  const [isConnected, setIsConnected] = useState({ github: false, supabase: false });
  const [model, setModel] = useState<'GEMINI' | 'CHATGPT'>('GEMINI'); 
  const [input, setInput] = useState('');
  const [terminal, setTerminal] = useState('// MISSION: MANUAL_EXECUTION\n// STATUS: NOBLE_STABLE\n// IP: 46.62.209.177\n\n[System]: Logic deployed. Standing by...');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    gemini: localStorage.getItem('MYCANVAS_GEMINI_KEY') || '',
    chatgpt: localStorage.getItem('MYCANVAS_CHATGPT_KEY') || '',
    agent: localStorage.getItem('MYCANVAS_AGENT_KEY') || ''
  });
  const [showApiVault, setShowApiVault] = useState(false);
  const [posts, setPosts] = useState<{id: number, author: string, content: string, image?: string, timestamp: string}[]>([
    { id: 1, author: "Diamond Architect", content: "V12 Engine initialized. The lab is live.", timestamp: "2m ago" },
    { id: 2, author: "Noble Guest", content: "This UI is insane. Looking forward to the Agent Builder.", timestamp: "1h ago" }
  ]);
  const [newPost, setNewPost] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePublish = async () => {
    const mode = isPublic ? 'PUBLIC' : 'PRIVATE';
    setTerminal(prev => prev + `\n\n[System]: Initiating ${mode} BASH...`);
    
    try {
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, commitMessage: 'V12 Sovereign Dispatch' })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTerminal(prev => prev + `\n[System]: ${mode} BASH COMPLETE.\n[System]: Status: NOBLE_STABLE.`);
        if (result.output) {
          setTerminal(prev => prev + `\n[System]: Output: ${result.output.substring(0, 500)}...`);
        }
      } else {
        setTerminal(prev => prev + `\n[System]: Dispatch Error: ${result.error || 'Unknown Error'}`);
      }
      
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      setTerminal(prev => prev + '\n[System]: Dispatch Error. Check Connection Hub.');
    }
  };

  const handleKeyChange = (provider: 'gemini' | 'chatgpt' | 'agent', value: string) => {
    const newKeys = { ...apiKeys, [provider]: value };
    setApiKeys(newKeys);
    localStorage.setItem(`MYCANVAS_${provider.toUpperCase()}_KEY`, value);
  };

  const executeMission = async () => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    setTerminal(prev => prev + `\n\n[System]: Routing via ${model} Core...`);
    
    try {
      if (model === 'GEMINI') {
        const key = apiKeys.gemini || process.env.GEMINI_API_KEY || "";
        if (!key) {
          setTerminal(prev => prev + `\n\n[System]: Error - Gemini Key missing in Vault.`);
          setIsLoading(false);
          return;
        }
        const ai = new GoogleGenAI({ apiKey: key });
        const response = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: input,
          config: {
            systemInstruction: "You are the MyCanvasLab AI Commander. Your mission is to assist the Architect in building high-performance, income-generating web applications. You are technical, noble, and direct. You value the 'V12' power of the Hetzner mainframe. You do not make excuses; you provide solutions. You speak with the confidence of a Diamond."
          }
        });
        
        if (response.text) {
          setTerminal(prev => prev + `\n\n[${model}]: ${response.text}`);
        } else {
          setTerminal(prev => prev + `\n\n[System]: API Response empty. Check billing/quota.`);
        }
      } else {
        const key = apiKeys.chatgpt;
        if (!key) {
          setTerminal(prev => prev + `\n\n[System]: ChatGPT Neural Link requires API Key in Vault.`);
          setIsLoading(false);
          return;
        }
        // ChatGPT Simulation with Key
        setTerminal(prev => prev + `\n\n[System]: ChatGPT Link established via Vault Key.`);
        setTimeout(() => {
          setTerminal(prev => prev + `\n\n[CHATGPT]: Mission parameters received. Neural processing active.`);
          setIsLoading(false);
          scrollToBottom();
        }, 1000);
        return;
      }
      setInput(''); // Clear after send
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      setTerminal(prev => prev + `\n\n[System]: Error - ${model} link severed. Check Hetzner .env.`);
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

  const renderCreatorView = () => (
    <div className="flex-1 flex flex-col relative bg-[#010101]">
      {/* TOP UTILITY STRIP */}
      <div className="h-14 border-b border-[#181818] bg-[#050505]/80 backdrop-blur-md px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-6">
           {/* Sub-Tabs */}
           <div className="flex gap-2">
             {[
               { id: 'MISSION', label: 'Mission Control' },
               { id: 'PUBLISH', label: 'Publish / Bash' }
             ].map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setCreatorSubTab(tab.id as any)}
                 className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${creatorSubTab === tab.id ? 'border-orange-500 text-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(234,88,12,0.2)]' : 'border-zinc-800 text-zinc-600 bg-zinc-900/10 hover:border-orange-500/40 hover:text-orange-400 hover:bg-orange-500/5'}`}
               >
                 {tab.label}
               </button>
             ))}
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
              <button className="hover:text-white transition-colors">Save to Supabase</button>
              <button className="hover:text-white transition-colors">Push to Git</button>
           </div>
           <button className="px-5 py-2 bg-white text-black text-[10px] font-black rounded-lg uppercase hover:bg-zinc-200 transition-all shadow-lg">Publish Live</button>
        </div>
      </div>

      {/* STAGE */}
      <div className="flex-1 overflow-hidden p-8 flex flex-col relative">
        {creatorSubTab === 'MISSION' ? (
          <div className="w-full h-full bg-[#050505] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
             {activeTab === 'PREVIEW' ? (
               <div className="flex-1 p-8 overflow-y-auto custom-scrollbar text-orange-500 whitespace-pre-wrap">
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
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Dispatch Protocol</h2>
              <p className="text-zinc-600 text-sm">Configure visibility and initiate deployment to Hetzner Core.</p>
            </div>
            
            <div className={`p-8 rounded-3xl space-y-6 ${glassOrange}`}>
              <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-widest text-white">Visibility Status</span>
                    <p className="text-[9px] text-zinc-500 uppercase">Current Mode: {isPublic ? 'Public Access' : 'Private Vault'}</p>
                  </div>
                  <button 
                    onClick={() => setIsPublic(!isPublic)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black transition-all border ${isPublic ? 'bg-orange-500 text-black border-orange-400' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
                  >
                    {isPublic ? 'SWITCH TO PRIVATE' : 'SWITCH TO PUBLIC'}
                  </button>
              </div>
              
              <div className="h-px bg-orange-500/10"></div>

              <button 
                onClick={handlePublish}
                className="w-full py-6 bg-[#ea580c] text-black font-black rounded-2xl shadow-[0_0_40px_rgba(234,88,12,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase text-sm tracking-[0.2em] flex items-center justify-center gap-3"
              >
                <Zap className="w-5 h-5 fill-black" />
                Publish & Bash
              </button>
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
              <Zap className="w-6 h-6 text-orange-500" />
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
        {[
          { id: 'METRICS', label: 'System Metrics' },
          { id: 'WALL', label: 'The Wall Info' }
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
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase">The Wall Info</h2>
              <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Community Feed</span>
            </div>

            {/* Post Input */}
            <div className="bg-[#080808] border border-zinc-800 rounded-2xl p-4 space-y-4">
              <textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Leave a post on the wall..."
                className="w-full bg-transparent outline-none resize-none text-sm text-zinc-300 placeholder-zinc-700 h-20"
              />
              <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
                <button className="text-zinc-600 hover:text-orange-500 transition-colors">
                  <Image className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleAddPost}
                  className="px-6 py-2 bg-orange-500 text-black text-[10px] font-black rounded-lg uppercase hover:bg-orange-400 transition-all"
                >
                  Post to Wall
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
              {[
                { name: "Market_Analyzer_v1", status: "PRIVATE", fee: "0.05 / req" },
                { name: "Code_Architect_v4", status: "PUBLIC", fee: "0.12 / req" },
                { name: "Social_Bot_Alpha", status: "PRIVATE", fee: "0.02 / req" }
              ].map((agent, i) => (
                <div key={i} className="bg-[#050505] border border-zinc-900 rounded-2xl p-6 flex items-center justify-between group hover:border-orange-500/20 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <Cpu className={`w-6 h-6 ${agent.status === 'PUBLIC' ? 'text-orange-500' : 'text-zinc-600'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{agent.name}</p>
                      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1">Fee: {agent.fee}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${agent.status === 'PUBLIC' ? 'border-orange-500/50 text-orange-500 bg-orange-500/5' : 'border-zinc-800 text-zinc-600'}`}>
                      {agent.status}
                    </span>
                    {agent.status === 'PRIVATE' && (
                      <button className="px-5 py-2 bg-white text-black text-[10px] font-black rounded-lg uppercase hover:bg-orange-500 hover:text-white transition-all shadow-lg">
                        Mobilize
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

  const renderSettingsView = () => (
    <div className="flex-1 flex flex-col bg-[#010101] overflow-y-auto custom-scrollbar">
      {/* TOP TABS */}
      <div className="h-14 border-b border-[#181818] bg-[#050505]/80 backdrop-blur-md px-8 flex items-center gap-4 sticky top-0 z-20">
        {[
          { id: 'INTEGRATIONS', label: 'Integrations' },
          { id: 'CONFIG', label: 'App Config' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setSettingsSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${settingsSubTab === tab.id ? 'border-orange-500 text-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(234,88,12,0.2)]' : 'border-zinc-800 text-zinc-600 bg-zinc-900/10 hover:border-orange-500/40 hover:text-orange-400 hover:bg-orange-500/5'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-8 max-w-3xl mx-auto w-full space-y-12 pb-32">
        {settingsSubTab === 'INTEGRATIONS' ? (
          <section className="space-y-6">
            <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">External Connections</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-[#050505] border border-zinc-900 rounded-xl">
                <div className="flex items-center gap-4">
                  <Github className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-[11px] font-bold text-white">GitHub Repository</p>
                    <p className="text-[9px] text-zinc-600">Sync your code to the cloud.</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] font-black uppercase text-zinc-400 hover:text-white transition-colors">Configure</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#050505] border border-zinc-900 rounded-xl">
                <div className="flex items-center gap-4">
                  <Database className="w-5 h-5 text-[#3ecf8e]" />
                  <div>
                    <p className="text-[11px] font-bold text-white">Supabase Database</p>
                    <p className="text-[9px] text-zinc-600">Manage your persistent data.</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] font-black uppercase text-zinc-400 hover:text-white transition-colors">Configure</button>
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-6">
            <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">App Management</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-6 bg-[#050505] border border-zinc-900 rounded-xl text-left space-y-2 hover:border-orange-500/20 transition-all">
                <Shield className="w-5 h-5 text-orange-500" />
                <p className="text-[11px] font-bold text-white">Private Mode</p>
                <p className="text-[9px] text-zinc-600">Restrict access to your lab.</p>
              </button>
              <button className="p-6 bg-[#050505] border border-zinc-900 rounded-xl text-left space-y-2 hover:border-orange-500/20 transition-all">
                <Zap className="w-5 h-5 text-orange-500" />
                <p className="text-[11px] font-bold text-white">Post for Sale</p>
                <p className="text-[9px] text-zinc-600">List your app on the marketplace.</p>
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-screen bg-[#020202] text-white font-mono overflow-hidden text-[13px]">
      
      {/* SIDEBAR: The Command Center */}
      <div className="w-[420px] border-r border-[#181818] p-6 flex flex-col bg-[#050505] z-30">
        <h1 className="text-[#ea580c] text-2xl font-black mb-8 flex items-center gap-3">💎 MYCANVASLAB</h1>
        
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
               <button className="p-3 bg-black/40 border border-zinc-800 rounded-lg text-[9px] hover:border-orange-500 transition-all text-zinc-400">MY_AGENTS</button>
               <button className="p-3 bg-black/40 border border-zinc-800 rounded-lg text-[9px] hover:border-orange-500 transition-all text-zinc-400">PRIVATE_LIBS</button>
            </div>
          </div>

          <div className="p-4 border border-orange-500/20 bg-orange-500/5 rounded-xl text-orange-500 text-[11px] font-bold flex items-center justify-between">
            <span>⚡ SCRIPT ARCHITECT</span>
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
          </div>
          <div className="p-4 border border-zinc-800 bg-zinc-900/10 rounded-xl text-zinc-600 text-[11px] font-bold">⚖️ VAULT GUARDIAN</div>
          
          {/* API VAULT SECTION */}
          <div className={`border transition-all duration-300 rounded-xl overflow-hidden ${showApiVault ? 'border-orange-500/40 bg-orange-500/5' : 'border-zinc-800 bg-zinc-900/10'}`}>
            <button 
              onClick={() => setShowApiVault(!showApiVault)}
              className="w-full p-4 flex items-center justify-between text-[11px] font-bold text-zinc-400 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Key className={`w-3.5 h-3.5 ${showApiVault ? 'text-orange-500' : 'text-zinc-600'}`} />
                <span>NEURAL API VAULT</span>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${apiKeys.gemini && apiKeys.chatgpt && apiKeys.agent ? 'bg-green-500' : 'bg-zinc-700'}`}></div>
            </button>
            
            {showApiVault && (
              <div className="px-4 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-600 uppercase font-black">Gemini Key</label>
                  <div className="relative">
                    <input 
                      type="password"
                      value={apiKeys.gemini}
                      onChange={(e) => handleKeyChange('gemini', e.target.value)}
                      className="w-full bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-[10px] outline-none focus:border-orange-500/50 transition-all text-zinc-300"
                      placeholder="Paste Gemini API Key..."
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-700" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-600 uppercase font-black">ChatGPT Key</label>
                  <div className="relative">
                    <input 
                      type="password"
                      value={apiKeys.chatgpt}
                      onChange={(e) => handleKeyChange('chatgpt', e.target.value)}
                      className="w-full bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-[10px] outline-none focus:border-orange-500/50 transition-all text-zinc-300"
                      placeholder="Paste OpenAI API Key..."
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-700" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-600 uppercase font-black">Agent Key</label>
                  <div className="relative">
                    <input 
                      type="password"
                      value={apiKeys.agent}
                      onChange={(e) => handleKeyChange('agent', e.target.value)}
                      className="w-full bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-[10px] outline-none focus:border-orange-500/50 transition-all text-zinc-300"
                      placeholder="Paste Agent API Key..."
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-700" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

          {/* TEASER FOR AGENT BUILDER */}
          <div className="p-4 border border-dashed border-zinc-900 bg-zinc-900/5 rounded-xl group hover:border-zinc-800 transition-colors cursor-not-allowed">
             <div className="flex items-center justify-between mb-2">
               <span className="text-[8px] text-zinc-700 font-black uppercase tracking-[0.2em]">Coming Soon</span>
               <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
             </div>
             <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-tight group-hover:text-zinc-500 transition-colors">Build Your Own Agent</p>
             <p className="text-[9px] text-zinc-800 mt-1 font-medium">Custom neural workflows for automated execution.</p>
          </div>
        </div>

        {/* Input Dock (Sticky at bottom) */}
        <div className="bg-[#080808] p-4 rounded-2xl border border-[#181818] mt-4">
          {/* AI Feature Chips from Image */}
          <div className="flex gap-2 mb-4 overflow-x-auto custom-scrollbar pb-2 no-scrollbar">
            <button className="px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-[9px] font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center gap-1.5 whitespace-nowrap">
              <Zap className="w-2.5 h-2.5 text-orange-500" />
              AI Features
            </button>
            <button className="px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-[9px] font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all whitespace-nowrap">
              Implement Agent Builder UI
            </button>
            <button className="px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-[9px] font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all whitespace-nowrap">
              Enhance API Key...
            </button>
          </div>

          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); executeMission(); }}}
            className="w-full h-24 bg-transparent text-sm outline-none resize-none placeholder-zinc-800 text-zinc-300" 
            placeholder="Make changes, add new features, ask for anything" 
          />
          <div className="flex items-center justify-between border-t border-[#181818] pt-4">
             <div className="flex gap-3 items-center">
                <button className="text-zinc-700 hover:text-zinc-400 transition-colors">
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button className="text-zinc-700 hover:text-zinc-400 transition-colors">
                  <Radar className="w-4 h-4" />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="text-zinc-700 hover:text-orange-500 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
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
               onClick={executeMission}
               disabled={isLoading || !input.trim()}
               className="w-10 h-10 bg-[#ea580c] rounded-full flex items-center justify-center shadow-[0_0_15px_#ea580c66] hover:scale-110 active:scale-95 transition-all disabled:opacity-50">
               <ArrowUp className="text-black w-5 h-5" strokeWidth={3} />
             </button>
          </div>
        </div>
      </div>

      {/* THE CANVAS / MAIN VIEW */}
      {view === 'CREATOR' && renderCreatorView()}
      {view === 'HOME' && renderHomeView()}
      {view === 'STATS' && renderStatsView()}
      {view === 'FILES' && renderFilesView()}
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
