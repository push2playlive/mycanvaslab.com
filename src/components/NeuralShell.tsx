import React, { useState, useEffect, useRef } from 'react';

interface NeuralShellProps {
  onCommand?: (cmd: string, args: string) => void;
}

export default function NeuralShell({ onCommand }: NeuralShellProps) {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([
    '[SYSTEM] Mainframe 46.62.209.177 Online.',
    '[SYSTEM] 8 vCPU Detected. 16GB RAM Buffer Ready.',
    '[SYSTEM] Type /help for command list.'
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const fullCmd = input.trim();
      const parts = fullCmd.split(' ');
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1).join(' ');
      
      let response = `[USER]: ${input}`;
      
      // Command Logic
      if (cmd === '/status') {
        response = '[SYSTEM]: CPU: 2.4% | RAM: 9.74% | NODE: HETZNER_AX41 | UPTIME: 99.99%';
      } else if (cmd === '/scan') {
        response = '[SYSTEM]: Scanning Global Nodes... Syncing with Neural Core.';
      } else if (cmd === '/locate') {
        if (args) {
          response = `[SYSTEM]: Initiating Kinetic Lock on node: ${args}...`;
          onCommand?.('locate', args);
        } else {
          response = '[SYSTEM]: Usage: /locate <node_name_or_id>';
        }
      } else if (cmd === '/filter') {
        if (args) {
          response = `[SYSTEM]: Applying neural filter: ${args}`;
          onCommand?.('filter', args);
        } else {
          response = '[SYSTEM]: Usage: /filter <status|type|region>';
        }
      } else if (cmd === '/help') {
        response = '[SYSTEM]: Available commands: /status, /scan, /locate, /filter, /clear, /help';
      } else if (cmd === '/clear') {
        setLogs([]);
        setInput('');
        return;
      } else {
        response = `[SYSTEM]: Command not recognized: ${cmd}`;
      }

      setLogs(prev => [...prev, `> ${input}`, response]);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/90 border-t border-cyan-500/30 p-2 font-mono text-[10px] text-cyan-400/80 z-[60] backdrop-blur-md">
      <div className="h-32 overflow-y-auto mb-2 space-y-1 custom-scrollbar" ref={scrollRef}>
        {logs.map((log, i) => (
          <div key={i} className={log.startsWith('[SYSTEM]') ? "text-cyan-400" : log.startsWith('>') ? "text-white/40" : "text-emerald-400"}>
            {log}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-white/5 pt-2">
        <span className="text-emerald-500 shrink-0">arch@nexus:~$</span>
        <input 
          className="bg-transparent border-none outline-none text-white w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          placeholder="Enter command..."
          autoFocus
        />
      </div>
    </div>
  );
}
