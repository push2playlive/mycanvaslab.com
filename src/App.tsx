import React, { useState } from 'react';

// BARE-METAL STYLES (Zero External Dependencies)
const s: Record<string, React.CSSProperties> = {
  bg: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#020202', color: '#fff', fontFamily: 'monospace', overflow: 'hidden' },
  side: { width: '420px', backgroundColor: '#000', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column' },
  head: { padding: '30px', borderBottom: '1px solid #111' },
  logo: { fontSize: '22px', fontWeight: '900', fontStyle: 'italic', margin: 0 },
  sub: { fontSize: '9px', color: '#444', letterSpacing: '3px', marginTop: '5px' },
  tools: { flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  btn: { padding: '15px', backgroundColor: '#080808', border: '1px solid #222', color: '#ea580c', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' },
  inputBox: { padding: '20px', borderTop: '1px solid #111' },
  text: { width: '100%', backgroundColor: '#050505', border: '1px solid #222', color: '#fff', padding: '10px', borderRadius: '8px', height: '80px', outline: 'none' },
  run: { width: '100%', marginTop: '10px', padding: '15px', backgroundColor: '#ea580c', color: '#000', fontWeight: '900', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  main: { flex: 1, padding: '40px', display: 'flex', flexDirection: 'column' },
  topNav: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#333', marginBottom: '20px' },
  hoist: { flex: 1, backgroundColor: '#050505', border: '1px solid #111', borderRadius: '30px', padding: '40px', overflowY: 'auto' },
  code: { color: '#ea580c', fontSize: '15px', lineHeight: '1.5', margin: 0 }
};

export default function App() {
  const [output, setOutput] = useState("Awaiting V12 Command...");

  const runMission = (title: string) => {
    setOutput(`// MISSION: ${title}\n// STATUS: NOBLE_STABLE\n// IP: 46.62.209.177\n\n[System]: Logic deployed successfully. No errors detected.`);
  };

  return (
    <div style={s.bg}>
      
      {/* SIDEBAR: WIDE-VIEW FOR COMMANDER */}
      <aside style={s.side}>
        <div style={s.head}>
          <h1 style={s.logo}>MYCANVAS<span style={{color:'#ea580c'}}>LAB</span></h1>
          <p style={s.sub}>V12 HETZNER CORE</p>
        </div>

        <div style={s.tools}>
          <button onClick={() => runMission('SCRIPT_ARCHITECT')} style={s.btn}>⚡ SCRIPT ARCHITECT</button>
          <button onClick={() => runMission('VAULT_GUARDIAN')} style={s.btn}>⚖️ VAULT GUARDIAN</button>
        </div>

        <div style={s.inputBox}>
          <textarea style={s.text} placeholder="Inject Command..." />
          <button onClick={() => runMission('MANUAL_EXECUTION')} style={s.run}>EXECUTE MISSION</button>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <main style={s.main}>
        <div style={s.topNav}>
          <span>LAB_WORKSPACE_v2.0</span>
          <span style={{color:'#ea580c'}}>SYNCED: 46.62.209.177</span>
        </div>
        
        <div style={s.hoist}>
          <pre style={s.code}>{output}</pre>
        </div>
      </main>

    </div>
  );
}
