import React from 'react';
import Globe from 'react-globe.gl';

interface Project {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
  status?: string;
}

interface GlobeComponentProps {
  projects: Project[];
  globeRef: React.MutableRefObject<any>;
  hashString: (str: string | undefined | null) => number;
  onNodeClick: (project: Project) => void;
}

export default function GlobeComponent({ projects, globeRef, hashString, onNodeClick }: GlobeComponentProps) {
  return (
    <div className="w-full h-full relative bg-black">
      <React.Suspense fallback={<div className="text-orange-500 flex items-center justify-center h-full">Loading Globe...</div>}>
        {(() => {
          try {
            return (
              <Globe
                ref={globeRef}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                atmosphereColor="#ff9d00"
                atmosphereAltitude={0.1}
                showAtmosphere={true}
                pointsData={projects.map(p => ({
                  lat: (p.lat !== null && p.lat !== undefined) ? Number(p.lat) : (hashString(p.id) % 180) - 90,
                  lng: (p.lng !== null && p.lng !== undefined) ? Number(p.lng) : (hashString(p.id) % 360) - 180,
                  size: 0.1,
                  color: p.status === 'active' ? '#ff9d00' : '#f97316',
                  label: p.name
                }))}
                pointAltitude={0.05}
                pointRadius={0.05}
                pointColor="color"
                pointLabel="label"
                onPointClick={(point: any) => {
                  const project = projects.find(p => p.name === point.label);
                  if (project) onNodeClick(project);
                }}
              />
            );
          } catch (e) {
            console.error('Globe render error:', e);
            return <div className="text-red-500 flex items-center justify-center h-full">Globe failed to render</div>;
          }
        })()}
      </React.Suspense>
      <div className="absolute top-4 left-4 pointer-events-none z-10">
        <div className="text-[8px] uppercase tracking-[0.3em] text-orange-400 font-bold mb-1">Orbital Viewport</div>
        <div className="text-[7px] text-white/30 font-mono">
          LAT: {globeRef.current?.getPointOfView?.()?.lat?.toFixed?.(4) ?? '0.0000'}
        </div>
        <div className="text-[7px] text-white/30 font-mono">
          LNG: {globeRef.current?.getPointOfView?.()?.lng?.toFixed?.(4) ?? '0.0000'}
        </div>
      </div>
    </div>
  );
}
