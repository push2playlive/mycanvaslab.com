import React from 'react';
import HeartbeatGraph from './HeartbeatGraph';
import { Activity } from 'lucide-react';

export default function HetznerHeartbeat() {
  return (
    <div className="w-full bg-black/40 border border-orange-500/10 p-4 font-mono text-[10px] backdrop-blur-sm rounded-sm">
      <div className="flex justify-between items-center border-b border-orange-500/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-orange-400 animate-pulse" />
          <span className="text-orange-400 font-bold uppercase tracking-widest">Hetzner Heartbeat</span>
        </div>
        <span className="text-white/20">DC_FSN1-DC14</span>
      </div>
      <div className="space-y-4">
        <HeartbeatGraph />
        <div className="flex justify-between text-[8px] text-white/30 uppercase tracking-tighter">
          <span>Load: 0.84</span>
          <span>Temp: 42°C</span>
          <span>Uptime: 14.2d</span>
        </div>
      </div>
    </div>
  );
}
