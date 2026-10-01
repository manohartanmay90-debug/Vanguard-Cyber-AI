import { X, Shield, Cpu, Lock, CheckCircle2, Sliders, Database } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg bg-[#12141c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Aegis AI Gateway Configuration</h2>
              <p className="text-xs text-slate-400">Enterprise security parameters and engine status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Active Model */}
          <div className="p-4 rounded-2xl bg-[#0c0d12] border border-white/[0.06] flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-400" />
                <span className="font-semibold text-slate-200">AI Intelligence Core</span>
              </div>
              <p className="text-xs text-slate-400">Powered by Gemini 3.1 Flash with multi-model failover cluster</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>

          {/* Security Features */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Protection Layers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-medium text-xs text-slate-200">PII Auto-Masking</p>
                  <p className="text-[11px] text-slate-500">SSN, emails, keys redacted</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-medium text-xs text-slate-200">Jailbreak Guard</p>
                  <p className="text-[11px] text-slate-500">Prompt injection classifier</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-medium text-xs text-slate-200">Zero Retention</p>
                  <p className="text-[11px] text-slate-500">No prompt memory leakage</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-medium text-xs text-slate-200">SOC2 Audit Logs</p>
                  <p className="text-[11px] text-slate-500">Immutable Supabase storage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Firewall Sensitivity */}
          <div className="p-4 rounded-2xl bg-[#0c0d12] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">Threat Confidence Threshold</span>
              <span className="font-mono text-brand-300 font-semibold">75% (Strict Enterprise)</span>
            </div>
            <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full w-[75%]" />
            </div>
            <p className="text-[11px] text-slate-500">
              Prompts scoring ≥ 75% confidence of malicious intent are immediately quarantined.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-white/[0.02] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs transition-all shadow-lg shadow-brand-900/40"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
