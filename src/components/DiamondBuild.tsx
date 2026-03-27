import React, { useState } from 'react';
import { Terminal, Shield, Cpu, Activity, Play, RefreshCw, Zap, Globe, Server, Database, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DiamondBuild() {
  const [isBuilding, setIsBuilding] = useState(false);
  const [output, setOutput] = useState("// System Standby. Awaiting Mission...");
  const [command, setCommand] = useState("");

  const triggerV12 = () => {
    setIsBuilding(true);
    setOutput("// Initializing V12 Engine...\n// Connecting to Hetzner Mainframe [46.62.209.177]...\n// Authenticating Architect...");
    
    setTimeout(() => {
      setOutput(prev => prev + "\n// Access Granted. Deploying Neural Core...");
    }, 1000);

    setTimeout(() => {
      setOutput(prev => prev + "\n// Optimizing Assets for High-Performance...");
    }, 2000);

    setTimeout(() => {
      setOutput(prev => prev + "\n// Build Successful. MyCanvasLab V12 is LIVE.");
      setIsBuilding(false);
    }, 3500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050505] text-white font-sans overflow-hidden border border-white/5 rounded-2xl shadow-2xl">
      {/* HEADER: HETZNER V12 STATUS */}
      <div className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.4)]">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Hetzner_V12_Live</h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Node_Active: 46.62.209.177</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Uptime</p>
            <p className="text-[10px] font-bold text-white tabular-nums">99.998%</p>
          </div>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
            <RefreshCw size={14} className={isBuilding ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* MAIN WORKSPACE: BENTO GRID STYLE */}
      <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-y-auto custom-scrollbar">
        
        {/* LEFT: MISSION CONTROL */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* TERMINAL OUTPUT */}
          <div className="bg-black rounded-2xl border border-white/5 p-6 font-mono text-[11px] leading-relaxed relative group overflow-hidden min-h-[300px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 opacity-50" />
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
              </div>
              <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">System_Telemetry_v12</span>
            </div>
            <pre className="text-zinc-400 whitespace-pre-wrap">
              {output}
              {isBuilding && <span className="inline-block w-2 h-4 bg-orange-500 ml-1 animate-pulse align-middle" />}
            </pre>
          </div>

          {/* COMMAND INPUT */}
          <div className="bg-zinc-900/30 rounded-2xl border border-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="text" 
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Enter Deployment Directive..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-orange-600 outline-none transition-all"
                />
              </div>
              <button 
                onClick={triggerV12}
                disabled={isBuilding}
                className="px-8 py-4 rounded-xl bg-orange-600 text-white font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-[0_10px_20px_rgba(234,88,12,0.2)] disabled:opacity-50 disabled:translate-y-0 flex items-center gap-3"
              >
                {isBuilding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Execute_Build
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: SYSTEM STATUS */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* DIAMOND CORE CARD */}
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-white/10 p-8 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl group-hover:bg-orange-600/20 transition-all" />
            <Shield className="w-12 h-12 text-orange-600 mb-6" />
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Diamond_Core</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6">
              Neural link secured. All architectural assets are encrypted and synchronized with the Hetzner mainframe.
            </p>
            <div className="space-y-3">
              <StatusRow label="Security" value="Active" color="text-green-500" />
              <StatusRow label="Encryption" value="AES-256" color="text-zinc-400" />
              <StatusRow label="Protocol" value="V12_Stable" color="text-orange-500" />
            </div>
          </div>

          {/* TELEMETRY BENTO */}
          <div className="grid grid-cols-2 gap-4">
            <BentoStat icon={Cpu} label="Compute" value="84%" />
            <BentoStat icon={Activity} label="Latency" value="12ms" />
            <BentoStat icon={Globe} label="Region" value="DE-HET" />
            <BentoStat icon={Database} label="Vault" value="Secure" />
          </div>
        </div>
      </div>

      {/* FOOTER: SYSTEM INFO */}
      <div className="h-12 border-t border-white/5 bg-black/40 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">System_Log: 0x882A</span>
          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">Build_ID: MYCL-V12-99</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-3 h-3 text-zinc-700" />
          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-2">
      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
      <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{value}</span>
    </div>
  );
}

function BentoStat({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-4 hover:border-orange-500/30 transition-all">
      <Icon className="w-4 h-4 text-zinc-600 mb-2" />
      <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{label}</p>
      <p className="text-[12px] font-black text-white uppercase tracking-tighter">{value}</p>
    </div>
  );
}
