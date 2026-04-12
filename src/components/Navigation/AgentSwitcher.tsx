import React, { useState } from 'react';
import { AGENT_MODES } from '../../nexus/AgentProfiles';
import { CheckCircle2, Circle, AlertTriangle } from 'lucide-react';

export const AgentSwitcher = () => {
  const [activeAgent, setActiveAgent] = useState(AGENT_MODES.CORE);

  const handleSwitch = (agentKey: keyof typeof AGENT_MODES) => {
    const agent = AGENT_MODES[agentKey];
    setActiveAgent(agent);
    
    // THE DEED: Inject the new DNA into the CSS root
    document.documentElement.style.setProperty('--nexus-accent', agent.color);
    
    // Broadcast to the V24
    console.log(`[V24] RE-TASKING: Agent ${agent.name} is now in command.`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RUNNING': return <CheckCircle2 size={10} className="text-green-500" />;
      case 'STOPPED': return <Circle size={10} className="text-zinc-500" />;
      case 'ERROR': return <AlertTriangle size={10} className="text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="agent-selector-box">
      <div className="agent-status-orb" style={{ backgroundColor: activeAgent.color }}></div>
      <div className="agent-info">
        <div className="flex items-center gap-2">
          <label>ACTIVE AGENT</label>
          {getStatusIcon(activeAgent.status)}
        </div>
        <select onChange={(e) => handleSwitch(e.target.value as keyof typeof AGENT_MODES)}>
          {Object.keys(AGENT_MODES).map(key => (
            <option key={key} value={key}>
              {(AGENT_MODES as any)[key].name} ({(AGENT_MODES as any)[key].trait}) - {(AGENT_MODES as any)[key].status}
            </option>
          ))}
        </select>
      </div>
      <style>{`
        .agent-selector-box { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          padding: 15px; 
          background: #0a0a0a; 
          border-radius: 16px; 
          margin-bottom: 20px; 
          border: 1px solid var(--nexus-accent);
          box-shadow: 0 0 15px rgba(0, 255, 204, 0.05);
          transition: all 0.3s ease;
        }
        .agent-status-orb { 
          width: 12px; 
          height: 12px; 
          border-radius: 50%; 
          box-shadow: 0 0 10px currentColor; 
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .agent-info label { 
          font-size: 0.6rem; 
          color: #444; 
          display: block; 
          letter-spacing: 2px; 
          font-weight: 900;
          text-transform: uppercase;
        }
        .agent-info select { 
          background: transparent; 
          color: #fff; 
          border: none; 
          font-weight: 900; 
          cursor: pointer; 
          outline: none; 
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .agent-info select option {
          background: #0a0a0a;
          color: #fff;
        }
      `}</style>
    </div>
  );
};
