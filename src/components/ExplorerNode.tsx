import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface Project {
  id: string;
  name: string;
  status: string;
  metadata: any;
}

interface ExplorerNodeProps {
  onSelectProject: (project: Project) => void;
}

export default function ExplorerNode({ onSelectProject }: ExplorerNodeProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optimized fetch for the 5,744 record set
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, status, metadata')
          .order('created_at', { ascending: false })
          .limit(100); // Load first 100 for immediate UI response

        if (!error && data) {
          setProjects(data);
        } else if (error) {
          console.error('Supabase fetch error:', error);
          // Fallback to mock data if supabase fails or is not configured
          setProjects([
            { id: '1', name: 'NEURAL_CORE_V1', status: 'ACTIVE', metadata: {} },
            { id: '2', name: 'EXPLORER_NODE_INIT', status: 'SYNCED', metadata: {} },
            { id: '3', name: 'GLOBE_FLY_TO_SHADER', status: 'ACTIVE', metadata: {} },
          ]);
        }
      } catch (err) {
        console.error('ExplorerNode error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="explorer-container h-full overflow-y-auto custom-scrollbar p-2">
      <div className="text-[9px] text-orange-500/50 mb-4 uppercase tracking-[0.3em] font-bold">
        ARCHIVE_SCAN: {projects.length} NODES_READY
      </div>

      {loading ? (
        <div className="animate-pulse text-orange-400/20 text-[10px] italic font-mono uppercase tracking-widest p-4">
          Syncing Neural Database...
        </div>
      ) : (
        <div className="space-y-1">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className="group flex items-center gap-2 p-2 border border-transparent hover:border-orange-500/30 hover:bg-orange-500/5 cursor-pointer transition-all rounded-lg"
            >
              <div className="w-1 h-4 bg-orange-500/20 group-hover:bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)] transition-all"></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/80 uppercase font-bold tracking-tight group-hover:text-white transition-colors">
                  {proj.name || 'UNNAMED_PROJECT'}
                </span>
                <span className="text-[8px] text-white/30 font-mono uppercase">
                  ID: {proj.id.slice(0, 8)} | STAT: {proj.status || 'ACTIVE'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
