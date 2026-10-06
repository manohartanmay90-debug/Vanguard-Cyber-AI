import { useMemo } from 'react';
import { ShieldCheck, Activity, Lock, Cpu, Zap, Terminal } from 'lucide-react';

const TELEMETRY_NODES = [
  { text: '0x7F // PII_MASK_ACTIVE', x: '12%', y: '22%', delay: '0s', duration: '6s', icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
  { text: 'SOC2_ENCLAVE_LOCKED', x: '78%', y: '18%', delay: '1.5s', duration: '7s', icon: Lock, color: 'text-blue-500 bg-blue-50 border-blue-200' },
  { text: '0ms // HEURISTIC_GATE', x: '8%', y: '68%', delay: '2.5s', duration: '8s', icon: Zap, color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { text: 'FIREWALL_INSPECT_PASS', x: '82%', y: '62%', delay: '1s', duration: '6.5s', icon: Activity, color: 'text-cyan-500 bg-cyan-50 border-cyan-200' },
  { text: 'GEMINI_GROQ_FAILOVER', x: '42%', y: '82%', delay: '3s', duration: '9s', icon: Cpu, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
];

export default function CyberLaserGridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* ── 1. AMBIENT RADIAL COLOR AURORAS ──────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl animate-pulse-glow" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/4 -left-24 w-[420px] h-[420px] bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 -right-24 w-[480px] h-[480px] bg-cyan-500/10 rounded-full blur-3xl" />

      {/* ── 2. 3D PERSPECTIVE CYBER GRID FLOOR ─────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[380px] overflow-hidden opacity-60 [perspective:600px]">
        <div 
          className="w-full h-[600px] absolute -bottom-10 origin-bottom [transform:rotateX(65deg)] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] [background-size:36px_36px] [mask-image:linear-gradient(to_top,black_40%,transparent_90%)]"
        />
        {/* Horizon glowing laser line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      </div>

      {/* ── 3. ANIMATED HORIZONTAL & VERTICAL LASER SWEEPS ─────────── */}
      {/* Horizontal Laser Sweep 1 */}
      <div 
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"
        style={{
          top: '35%',
          animation: 'float-subtle 6s ease-in-out infinite alternate'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-48 h-full animate-laser-sweep" />
      </div>

      {/* Horizontal Laser Sweep 2 */}
      <div 
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"
        style={{
          top: '65%',
          animation: 'float-subtle 8s ease-in-out infinite alternate-reverse'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent w-64 h-full animate-laser-sweep" style={{ animationDuration: '3.5s' }} />
      </div>

      {/* Vertical Laser Scanline Axis */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-slate-300/60 to-transparent" />
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />

      {/* ── 4. CONCENTRIC SONAR SCAN RADAR RINGS ──────────────────── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-blue-400/20 animate-ping" style={{ animationDuration: '7s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-indigo-400/15 animate-pulse" style={{ animationDuration: '4.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-slate-300/30" />

      {/* ── 5. FLOATING TELEMETRY DATA STREAM MARKERS ──────────────── */}
      {TELEMETRY_NODES.map((node, i) => {
        const Icon = node.icon;
        return (
          <div
            key={i}
            className="absolute hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/85 backdrop-blur-md border shadow-xs animate-float-subtle"
            style={{
              left: node.x,
              top: node.y,
              animationDelay: node.delay,
              animationDuration: node.duration,
            }}
          >
            <span className={`p-1 rounded-lg border ${node.color}`}>
              <Icon className="w-3.5 h-3.5" />
            </span>
            <span className="font-mono text-[10px] font-semibold text-slate-700 tracking-wide">
              {node.text}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
        );
      })}
    </div>
  );
}
