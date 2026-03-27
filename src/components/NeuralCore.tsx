import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FolderTree, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface Project {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
  status?: string;
}

interface NeuralCoreProps {
  onSelectProject: (project: Project) => void;
}

export default function NeuralCore({ onSelectProject }: NeuralCoreProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (data) {
        setProjects(data);
      }
      setLoading(false);
    }

    fetchProjects();

    // Subscribe to changes
    const channel = supabase
      .channel('projects-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col shrink-0 h-full overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/50">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">Neural Core</span>
        </div>
        <span className="text-[8px] text-white/20 font-mono">v1.2.0</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {loading ? (
          <div className="px-4 py-2 text-[10px] text-white/20 animate-pulse">Synchronizing nodes...</div>
        ) : projects.length === 0 ? (
          <div className="px-4 py-2 text-[10px] text-white/20">No active projects detected.</div>
        ) : (
          projects.map((project) => (
            <div 
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group flex items-center gap-3 py-2.5 px-4 cursor-pointer hover:bg-cyan-500/5 border-l-2 border-transparent hover:border-cyan-500 transition-all"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/30 group-hover:bg-cyan-500 group-hover:shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all" />
              <div className="flex flex-col">
                <span className="text-[11px] text-white/60 group-hover:text-white transition-colors truncate w-40">
                  {project.name}
                </span>
                <span className="text-[8px] text-white/20 font-mono uppercase tracking-tighter">
                  ID: {project.id.slice(0, 8)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/30">
        <div className="flex items-center justify-between text-[8px] uppercase tracking-widest text-white/20">
          <span>Active Nodes</span>
          <span className="text-cyan-500 font-bold">{projects.length}</span>
        </div>
      </div>
    </div>
  );
}
