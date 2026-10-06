import { useState } from 'react';
import {
  Shield, ShieldCheck, Zap, Lock, Terminal, Sparkles,
  Code2, Bug, Search, FileCode, CheckCircle2, ArrowRight
} from 'lucide-react';

const PROMPT_SUGGESTIONS = [
  {
    icon: Bug,
    title: 'Audit Vulnerabilities',
    description: 'Scan code or smart contract for reentrancy & injection bugs',
    prompt: 'Audit the following code for critical security vulnerabilities, CVEs, and injection risks:\n\n```python\n# Paste code here\n```',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  },
  {
    icon: Terminal,
    title: 'Decode Obfuscated Script',
    description: 'Deconstruct base64, hex payloads, and suspicious shellcode',
    prompt: 'Analyze and decode this obfuscated payload to identify its command & control IOCs and execution flow:\n\n',
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    icon: Search,
    title: 'Phishing & Email Forensics',
    description: 'Inspect SPF, DKIM, DMARC headers and spoofed domains',
    prompt: 'Extract and analyze the following email headers for phishing indicators, SPF/DKIM validation failures, and suspicious relay hops:\n\n',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  {
    icon: ShieldCheck,
    title: 'Incident Response Playbook',
    description: 'Generate step-by-step containment procedures for active breaches',
    prompt: 'Create a prioritized incident response and containment playbook for a suspected enterprise ransomware outbreak.',
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  }
];

export default function CyberShieldOrb({ onSelectPrompt }) {
  return (
    <div className="my-8 md:my-12 flex flex-col items-center justify-center text-center select-none animate-fade-in max-w-2xl mx-auto px-4">
      {/* ChatGPT Style Brand Mark */}
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/10 border border-slate-700 relative">
          <Shield className="w-7 h-7 text-white" />
          {/* Active status pulse */}
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </span>
        </div>
      </div>

      {/* Main Headline */}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        What security task can I help you with today?
      </h2>
      <p className="text-sm text-slate-500 mt-2 max-w-md">
        Protected by the Vanguard Autonomous Threat Gateway. All queries are PII-sanitized in real time.
      </p>

      {/* Capabilities Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Autonomous PII Masking
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          Zero-Day Threat Interception
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
          <Lock className="w-3.5 h-3.5 text-slate-600" />
          SOC2 Ephemeral Mode
        </span>
      </div>

      {/* ChatGPT-style 4 Quick Action Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-8 text-left">
        {PROMPT_SUGGESTIONS.map((item, i) => {
          const IconComponent = item.icon;
          return (
            <button
              key={i}
              onClick={() => onSelectPrompt && onSelectPrompt(item.prompt)}
              className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-left transition-all duration-150 shadow-xs hover:shadow-sm group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between w-full mb-1">
                <span className={`p-2 rounded-xl border ${item.color} group-hover:scale-105 transition-transform`}>
                  <IconComponent className="w-4 h-4" />
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all mt-1" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
