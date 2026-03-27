import React, { useEffect, useState, useRef } from 'react';

export default function HeartbeatGraph() {
  const [points, setPoints] = useState<number[]>(new Array(50).fill(20));
  const requestRef = useRef<number>(null);
  const lastUpdateRef = useRef<number>(0);

  const updatePoints = (time: number) => {
    if (time - lastUpdateRef.current > 100) { // Update every 100ms
      setPoints(prev => {
        const next = [...prev.slice(1)];
        // Create a "pulse" effect
        const base = 20;
        const pulse = Math.sin(time / 200) * 10;
        const noise = Math.random() * 5;
        next.push(base + pulse + noise);
        return next;
      });
      lastUpdateRef.current = time;
    }
    requestRef.current = requestAnimationFrame(updatePoints);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePoints);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const pathData = points.map((p, i) => `${i * 5},${40 - p}`).join(' L ');

  return (
    <div className="w-full h-12 bg-orange-950/10 border border-orange-500/20 rounded-sm overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent pointer-events-none" />
      <svg className="w-full h-full" viewBox="0 0 250 40" preserveAspectRatio="none">
        <path
          d={`M 0,${40 - points[0]} L ${pathData}`}
          fill="none"
          stroke="#ff9d00"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_3px_rgba(255,157,0,0.8)]"
        />
        {/* Scanning line effect */}
        <rect width="2" height="40" fill="rgba(255,157,0,0.2)" x="248">
           <animate attributeName="x" from="0" to="250" dur="2s" repeatCount="indefinite" />
        </rect>
      </svg>
      <div className="absolute top-1 left-1 text-[7px] text-orange-500/50 uppercase font-bold tracking-widest">
        MAINFRAME_HEARTBEAT
      </div>
      <div className="absolute bottom-1 right-1 text-[7px] text-orange-500 font-mono">
        {Math.round(points[points.length - 1])} vCPU_LOAD
      </div>
    </div>
  );
}
