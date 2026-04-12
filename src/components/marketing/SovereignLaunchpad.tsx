import React, { useState } from 'react';
import { Zap, Globe, DollarSign, Rocket, Video, Mic, Sparkles } from 'lucide-react';
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { toast, Toaster } from "sonner";
import { useWalletStore } from '../../store/walletStore';

export const SovereignLaunchpad = () => {
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState([10]);
  const [backlinkSync, setBacklinkSync] = useState(true);
  const [videoState, setVideoState] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  
  const { balance, deductCredits } = useWalletStore();

  // nexus trend sync (Simulated)
  const nexusKeywords = ["SaaS Growth", "AI Art", "No-Code", "Web3"];

  const handleCreateVideo = async () => {
    if (!description) return toast.error("Provide a description first.");
    
    // Fee logic: Video generation costs 20 CR
    if (balance < 20) return toast.error("Insufficient Neural Fuel (20 CR needed).");

    setVideoState('generating');
    toast.info("Initializing neural render... (AI Video + Voiceover)");

    try {
      const response = await fetch('/api/generate-complete-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) throw new Error("Neural render failed.");

      const data = await response.json();
      setGeneratedVideoUrl(data.videoUrl);
      deductCredits(20);
      setVideoState('ready');
      toast.success("Promo Video Processed & Synced.");
    } catch (error) {
      setVideoState('idle');
      toast.error("Neural render failed. Credits preserved.");
    }
  };

  const handleLaunchCampaign = async () => {
    if (!description) return toast.error("Provide a description first.");
    
    toast.info("Launching Sovereign Offensive...");

    try {
      const response = await fetch('/api/marketing/distribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description, 
          backlinkSync,
          videoUrl: generatedVideoUrl
        }),
      });

      if (!response.ok) throw new Error("Distribution failed.");

      toast.success("Campaign Launched. Distribution in progress.");
    } catch (error) {
      toast.error("Launch failed. Neural routing error.");
    }
  };

  return (
    <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl text-white max-w-4xl grid md:grid-cols-2 gap-8 shadow-2xl">
      <Toaster position="top-right" theme="dark" />
      
      {/* Left Column: Creative Input */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Sparkles className="text-orange-500" size={24} />
          </div>
          <h3 className="text-xl font-bold uppercase tracking-tighter">App Creator Studio</h3>
        </div>

        <div className="space-y-2 relative">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Product Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-32 p-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-orange-500 transition-all text-sm outline-none custom-scrollbar"
            placeholder="Describe your app, including target keywords..."
          />
          {/* nexus keyword pop-up */}
          <div className="absolute top-12 right-2 flex gap-1.5 flex-wrap justify-end max-w-[200px]">
            {nexusKeywords.map(keyword => (
              <span 
                key={keyword}
                onClick={() => setDescription(prev => prev + ` #${keyword}`)}
                className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700 cursor-pointer hover:bg-orange-500 hover:text-white hover:border-orange-400 transition-all uppercase font-black"
              >
                +{keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 px-4 py-3 border border-zinc-800 bg-zinc-900 rounded-xl text-[10px] font-black uppercase hover:border-zinc-700 flex items-center justify-center gap-2 transition-all">
            <Mic size={14} className="text-blue-400" />
            TEXT TO VOICE
          </button>
          <button 
            onClick={handleCreateVideo}
            disabled={videoState === 'generating'}
            className="flex-1 px-4 py-3 border border-orange-800 bg-orange-950 text-orange-200 rounded-xl text-[10px] font-black uppercase hover:border-orange-700 flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(234,88,12,0.1)]"
          >
            {videoState === 'generating' ? (
              <div className="w-3 h-3 border-2 border-orange-200 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Video size={14} />
            )}
            CREATE AI VIDEO (20 CR)
          </button>
        </div>

        {videoState === 'ready' && (
          <div className="p-4 bg-green-950/30 border border-green-800/50 rounded-xl text-[10px] text-green-400 font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
            PROMO VIDEO SYNCED: [preview_launch.mp4]
          </div>
        )}
      </div>

      {/* Right Column: Deployment & Wallet */}
      <div className="space-y-6">
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-4">Daily Ad Budget</label>
          <Slider defaultValue={[10]} max={500} step={5} onValueChange={(val) => setBudget(val)} />
          <div className="flex justify-between mt-4">
            <p className="text-[10px] text-zinc-500 italic uppercase font-bold">Est. Reach: ~{budget[0] * 150} Users</p>
            <p className="text-[10px] text-orange-500 font-black">${budget[0]}/DAY</p>
          </div>
        </div>

        <div className="p-5 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Globe className="text-blue-400" size={18} />
              </div>
              <p className="font-black text-[10px] uppercase tracking-widest text-zinc-300">Backlink Network (50+ Sites)</p>
            </div>
            <Switch checked={backlinkSync} onCheckedChange={setBacklinkSync} />
          </div>
        </div>

        {/* Wallet Integration */}
        <div className="p-5 border border-zinc-800 bg-black/40 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[9px] text-zinc-600 uppercase font-mono tracking-[0.2em] mb-1">My Wallet (Neural Fuel)</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-white tracking-tighter">{balance.toLocaleString()}</p>
            <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">CR</span>
          </div>
          <button className="text-[9px] text-orange-500 font-black uppercase tracking-widest hover:text-orange-400 transition-colors mt-2">REFUEL NOW</button>
        </div>

        <button 
          onClick={handleLaunchCampaign}
          className="w-full px-6 py-5 bg-white text-black font-black rounded-2xl hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em] shadow-xl group"
        >
          <Rocket size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          LAUNCH CAMPAIGN
        </button>
      </div>
    </div>
  );
};
