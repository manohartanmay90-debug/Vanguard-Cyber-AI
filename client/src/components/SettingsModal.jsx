import { X, Shield, Cpu, Lock, CheckCircle2, Sliders, Database } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Vanguard Cyber AI Gateway Configuration</h2>
              <p className="text-xs text-slate-500">Enterprise security parameters and engine status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Active Model */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-600" />
                <span className="font-semibold text-slate-900">AI Intelligence Core</span>
              </div>
              <p className="text-xs text-slate-500">Powered by Gemini 3.1 Flash with multi-model failover cluster</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>

          {/* Security Features */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Protection Layers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-medium text-xs text-slate-800">PII Auto-Masking</p>
                  <p className="text-[11px] text-slate-500">SSN, emails, keys redacted</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-medium text-xs text-slate-800">Jailbreak Guard</p>
                  <p className="text-[11px] text-slate-500">Prompt injection classifier</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-medium text-xs text-slate-800">Zero Retention</p>
                  <p className="text-[11px] text-slate-500">No prompt memory leakage</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-medium text-xs text-slate-800">SOC2 Audit Logs</p>
                  <p className="text-[11px] text-slate-500">Immutable Supabase storage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Firewall Sensitivity */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Threat Confidence Threshold</span>
              <span className="font-mono text-brand-700 font-semibold">75% (Strict Enterprise)</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-brand-500 to-indigo-600 h-full w-[75%]" />
            </div>
            <p className="text-[11px] text-slate-500">
              Prompts scoring ≥ 75% confidence of malicious intent are immediately quarantined.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
