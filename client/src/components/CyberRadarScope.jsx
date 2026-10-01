import { useState, useEffect } from 'react';
import { Shield, Radio, Activity, Target } from 'lucide-react';

export default function CyberRadarScope() {
  const [blips, setBlips] = useState([
    { id: 1, x: 68, y: 35, type: 'clean', label: 'Query Pass', pulse: true },
    { id: 2, x: 32, y: 64, type: 'pii', label: 'PII Scrubbed', pulse: true },
    { id: 3, x: 74, y: 72, type: 'blocked', label: 'Injection Blocked', pulse: true },
  ]);

  // Periodically add subtle blip animations
  useEffect(() => {
    const interval = setInterval(() => {
      setBlips(prev =>
        prev.map(b => ({
          ...b,
          pulse: Math.random() > 0.3,
        }))
      );
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-md relative overflow-hidden group">
      {/* Subtle ambient cyber glow behind radar */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold font-mono tracking-wider uppercase text-slate-200">
            Threat Radar Scope
          </span>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          360° SWEEP
        </span>
      </div>

      {/* Radar Scope Display */}
      <div className="relative w-full aspect-square max-w-[210px] mx-auto my-1 flex items-center justify-center">
        {/* Radar outer bezel */}
        <div className="absolute inset-0 rounded-full border border-slate-700/80 bg-slate-950/70 shadow-inner overflow-hidden">
          {/* Concentric distance rings */}
          <div className="absolute inset-[15%] rounded-full border border-dashed border-slate-700/50" />
          <div className="absolute inset-[32%] rounded-full border border-slate-700/60" />
          <div className="absolute inset-[52%] rounded-full border border-dashed border-slate-700/40" />
          <div className="absolute inset-[70%] rounded-full border border-slate-700/70" />

          {/* Crosshairs */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-slate-700/60 -translate-x-1/2" />
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-slate-700/60 -translate-y-1/2" />

          {/* Diagonal guides */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-[1px] bg-slate-800/40 rotate-45" />
            <div className="w-full h-[1px] bg-slate-800/40 -rotate-45" />
          </div>

          {/* Sweeping Radar Beam (Conical Rotating Gradient) */}
          <div
            className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none origin-center"
            style={{
              background: 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.45) 0deg, rgba(16, 185, 129, 0.05) 55deg, transparent 75deg, transparent 360deg)',
            }}
          />

          {/* Radar Sweep Line */}
          <div
            className="absolute top-1/2 left-1/2 w-1/2 h-[1.5px] bg-gradient-to-r from-emerald-300 to-transparent origin-left animate-radar-sweep pointer-events-none"
            style={{ transformOrigin: '0 0' }}
          />

          {/* Center Sonar Ping Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-emerald-400/50 animate-sonar-ping pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />

          {/* Dynamic Radar Targets / Blips */}
          {blips.map(blip => {
            const colorClass =
              blip.type === 'clean'
                ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_6px_#34d399]'
                : blip.type === 'pii'
                ? 'bg-blue-400 border-blue-300 shadow-[0_0_6px_#60a5fa]'
                : 'bg-rose-500 border-rose-300 shadow-[0_0_8px_#f43f5e]';

            const pingClass =
              blip.type === 'clean'
                ? 'bg-emerald-400'
                : blip.type === 'pii'
                ? 'bg-blue-400'
                : 'bg-rose-500';

            return (
              <div
                key={blip.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer"
                style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
                title={`${blip.label} detected by radar`}
              >
                <div className={`w-2.5 h-2.5 rounded-full border ${colorClass} relative`}>
                  {blip.pulse && (
                    <span
                      className={`absolute -inset-1 rounded-full ${pingClass} opacity-75 animate-ping`}
                      style={{ animationDuration: '2s' }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Radar Readout Legend */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
          <span>Passed</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_4px_#60a5fa]" />
          <span>PII Masked</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_4px_#f43f5e]" />
          <span>Threat</span>
        </div>
      </div>
    </div>
  );
}
