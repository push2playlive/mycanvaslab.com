import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import HeartbeatGraph from './HeartbeatGraph';
import { RefreshCw, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function SystemDiagnostic() {
  const [profile, setProfile] = useState<any>(null);
  const [latency, setLatency] = useState('0ms');
  const [refreshing, setRefreshing] = useState(false);

  async function getDiagnosticData() {
    const start = Date.now();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role, username, status')
        .eq('id', user.id)
        .maybeSingle();
      
      setProfile(data);
      setLatency(`${Date.now() - start}ms`);
    }
  }

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await getDiagnosticData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  useEffect(() => {
    getDiagnosticData();
    const interval = setInterval(getDiagnosticData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black/40 border border-orange-500/10 p-4 font-mono text-[10px] backdrop-blur-sm rounded-sm">
      <div className="flex justify-between items-center border-b border-orange-500/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-orange-400 font-bold uppercase tracking-widest animate-pulse">System Diagnostic</span>
          <button 
            onClick={handleManualRefresh}
            className={cn("p-1 rounded hover:bg-white/5 transition-all text-white/30 hover:text-orange-500", refreshing && "animate-spin")}
            title="Refresh Session"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
        <span className="text-white/30">v4.2.0</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-white/40 flex items-center gap-1"><UserIcon className="w-2.5 h-2.5" /> USER_ID:</span>
          <span className="text-white uppercase font-bold">{profile?.username || 'GUEST_ARCHITECT'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/40 flex items-center gap-1"><ShieldCheck className="w-2.5 h-2.5" /> ACCESS_LEVEL:</span>
          <span className={cn(
            "font-bold tracking-tighter px-1 rounded",
            profile?.role === 'admin' ? 'text-red-500 bg-red-500/10' : 'text-emerald-400 bg-emerald-400/10'
          )}>
            {profile?.role === 'admin' ? '◆ CORE_ADMIN' : '◇ STANDARD'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">DATABASE_LATENCY:</span>
          <span className="text-orange-400">{latency}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">NEURAL_SYNC:</span>
          <span className="text-emerald-500 underline decoration-double">STABLE</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
        <HeartbeatGraph />
        
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
          <div className="bg-orange-500 h-full w-[85%] animate-pulse shadow-[0_0_5px_rgba(249,115,22,0.5)]"></div>
        </div>
        <p className="text-[8px] text-white/20 mt-1 italic text-right">Encrypted Link via MyCanvasLab</p>
      </div>
    </div>
  );
}
