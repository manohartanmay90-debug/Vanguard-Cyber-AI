import { useState } from 'react';
import {
  Shield, ShieldCheck, ShieldAlert, Activity, ChevronRight,
  TrendingUp, Lock, RefreshCw, X, Radio, Eye, Cpu
} from 'lucide-react';

export default function ThreatTelemetryPanel({ isOpen, onClose, stats }) {
  if (!isOpen) return null;

  return (
    <aside className="w-80 xl:w-88 h-full bg-[#0b0f19] border-l border-slate-800 flex flex-col shrink-0 select-none animate-slide-in-right z-20">
      {/* Panel Header */}
      <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#0d121f]/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300 font-mono">
            Threat Detection
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-standard"
            title="Close Telemetry Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Telemetry Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Row 1: Executive KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Threat Level */}
          <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800 shadow-executive transition-standard hover:border-slate-700">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Threat Level</span>
              <span className="text-[10px] font-semibold text-emerald-400 uppercase">Secure</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight font-mono">
              9.8<span className="text-xs text-slate-500 font-normal">/10</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Heuristics Normal</p>
          </div>

          {/* Active Anomalies */}
          <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800 shadow-executive transition-standard hover:border-slate-700">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Anomalies</span>
              <Activity className="w-3 h-3 text-slate-500" />
            </div>
            <div className="flex items-baseline gap-3">
              <div>
                <span className="text-lg font-bold text-rose-400 font-mono">0</span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">High</span>
              </div>
              <div>
                <span className="text-lg font-bold text-amber-400 font-mono">1</span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">Med</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Zero unreviewed</p>
          </div>
        </div>

        {/* Vector SVG Sparkline: Detections (Last 24h) */}
        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 shadow-executive">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Detections (Last 24h)</span>
            <span className="text-[11px] text-slate-400 font-mono">14 scans</span>
          </div>

          {/* Clean minimal chart */}
          <div className="h-20 w-full relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 240 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Fill area */}
              <path
                d="M 0,55 L 20,48 L 40,50 L 60,35 L 80,42 L 100,20 L 120,45 L 140,28 L 160,38 L 180,18 L 200,32 L 220,22 L 240,15 L 240,60 L 0,60 Z"
                fill="url(#emeraldGrad)"
              />
              {/* Line */}
              <path
                d="M 0,55 L 20,48 L 40,50 L 60,35 L 80,42 L 100,20 L 120,45 L 140,28 L 160,38 L 180,18 L 200,32 L 220,22 L 240,15"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Pulse highlight on latest point */}
              <circle cx="240" cy="15" r="3" fill="#10b981" />
              <circle cx="240" cy="15" r="6" fill="#10b981" opacity="0.3" className="animate-ping" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-800/80">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>Now</span>
          </div>
        </div>

        {/* Minimalist Donut Chart: Top Attack Vectors */}
        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 shadow-executive">
          <span className="text-xs font-semibold text-slate-300 block mb-3">Top Attack Vectors</span>
          <div className="flex items-center gap-4">
            {/* SVG Donut Ring */}
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="3.8"
                />
                {/* Segment 1: Prompt Injection (45%) */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="45, 100"
                />
                {/* Segment 2: PII Exfiltration (30%) */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeDasharray="30, 100"
                  strokeDashoffset="-45"
                />
                {/* Segment 3: Jailbreak (25%) */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="4"
                  strokeDasharray="25, 100"
                  strokeDashoffset="-75"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-white font-mono">100%</span>
                <span className="text-[8px] text-slate-500 uppercase">Guarded</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  Prompt Injection
                </span>
                <span className="font-mono text-slate-300 text-[11px] font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  PII Exfiltration
                </span>
                <span className="font-mono text-slate-300 text-[11px] font-medium">30%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                  Jailbreak Traps
                </span>
                <span className="font-mono text-slate-300 text-[11px] font-medium">25%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Protection Status */}
        <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800 shadow-executive space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Gateway Compliance
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SOC2 Type II
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Pre-DB Redaction</span>
              <span className="text-emerald-400 font-medium font-mono">Active (100%)</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Threat Classifier</span>
              <span className="text-slate-300 font-medium font-mono">Gemini Sentinel</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Zero-Trust Network</span>
              <span className="text-blue-400 font-medium font-mono">Enforced</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="p-3 rounded-xl bg-[#0d121f] border border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">System Health</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            99.99% Uptime
          </span>
        </div>
      </div>
    </aside>
  );
}
