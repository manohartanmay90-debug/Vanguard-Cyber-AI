import { useState } from 'react';
import { Shield, ShieldCheck, Zap, Lock, Activity, Sparkles, Terminal } from 'lucide-react';

export default function CyberShieldOrb() {
  const [interactiveGlow, setInteractiveGlow] = useState(false);

  return (
    <div 
      className="my-6 p-6 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200/80 shadow-sm relative overflow-hidden group select-none transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setInteractiveGlow(true)}
      onMouseLeave={() => setInteractiveGlow(false)}
    >
      {/* Background cyber grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-70 pointer-events-none" />

      {/* Ambient background glows */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-10 w-48 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
        
        {/* Left: Animated Holographic Orbital Shield */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          {/* Sonar Ping Wave Ring */}
          <div className="absolute inset-2 rounded-full border border-blue-400/40 animate-sonar-ping pointer-events-none" />

          {/* Outer Orbiting Ring (Counter-Clockwise) */}
          <div className="absolute inset-0 rounded-full border border-dashed border-blue-300/60 animate-orbit-ccw pointer-events-none">
            {/* Satellite node */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_#2563eb]" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          </div>

          {/* Inner Orbiting Ring (Clockwise) */}
          <div className="absolute inset-4 rounded-full border border-emerald-300/70 animate-orbit-cw pointer-events-none">
            {/* Satellite node */}
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          </div>

          {/* Center Holographic Core Shield */}
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-[2px] shadow-lg transition-transform duration-500 ${
            interactiveGlow ? 'scale-110 rotate-3' : 'animate-float-subtle'
          }`}>
            <div className="w-full h-full bg-white rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
              {/* Shimmer laser sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-laser-sweep" />
              <Shield className="w-8 h-8 text-blue-600 relative z-10" />
            </div>
          </div>

          {/* Center Pulse Core */}
          <span className="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </span>
        </div>

        {/* Middle: Mission & Feature Highlights */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
            </span>
            <span>Vanguard Sentinel Gateway • Real-Time Protection</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Autonomous Cyber Threat Interception & PII Scrubbing
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
            All prompts are sanitized in sub-millisecond memory before reaching AI models. Malicious overrides, prompt injections, and data exfiltration traps are instantly quarantined.
          </p>

          {/* Interactive Badges with Micro-Hover Animations */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium hover:bg-emerald-100 transition-standard cursor-default">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              PII Masking Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-medium hover:bg-blue-100 transition-standard cursor-default">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              Parallel Low-Latency
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium hover:bg-slate-200/70 transition-standard cursor-default">
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              SOC2 Type II Enforced
            </span>
          </div>
        </div>

        {/* Right: Live Telemetry Metric Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5 shrink-0 w-full md:w-36">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs text-center md:text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Threat Neutralized</span>
            <div className="flex items-center justify-center md:justify-start gap-1 mt-0.5">
              <span className="text-base font-bold text-emerald-600 font-mono">100%</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs text-center md:text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Engine Status</span>
            <div className="flex items-center justify-center md:justify-start gap-1 mt-0.5">
              <span className="text-xs font-bold text-blue-600 font-mono">Sub-Second</span>
              <Activity className="w-3 h-3 text-blue-500 animate-pulse" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
