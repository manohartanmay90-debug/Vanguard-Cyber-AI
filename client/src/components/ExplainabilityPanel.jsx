import { X, ShieldAlert, Shield, ShieldCheck, Eye, Clock, User } from 'lucide-react';

function DiffLine({ original, masked }) {
  // Tokenize and highlight differences
  const tokenRegex = /<[A-Z_]+_\d+>/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(masked)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: masked.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'token', value: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < masked.length) {
    parts.push({ type: 'text', value: masked.slice(lastIndex) });
  }

  return (
    <p className="leading-relaxed">
      {parts.map((p, i) =>
        p.type === 'token' ? (
          <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-warning-500/20 text-warning-300 text-xs font-mono font-semibold border border-warning-500/30 mx-0.5">
            {p.value}
          </span>
        ) : (
          <span key={i}>{p.value}</span>
        )
      )}
    </p>
  );
}

export default function ExplainabilityPanel({ log, onClose }) {
  if (!log) return null;

  const StatusIcon = {
    blocked: ShieldAlert,
    modified: Shield,
    passed: ShieldCheck,
  }[log.status] || ShieldCheck;

  const statusColor = {
    blocked: 'text-rose-600',
    modified: 'text-amber-600',
    passed: 'text-emerald-600',
  }[log.status];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col animate-slide-up shadow-2xl">
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <StatusIcon className={`w-5 h-5 ${statusColor}`} />
            <div>
              <h3 className="font-semibold text-slate-900">Prompt Inspector</h3>
              <p className="text-xs text-slate-500">
                {new Date(log.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            id="close-panel"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5 bg-[#fbfcfd]">
          {/* Meta row */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-xs text-slate-700 border border-slate-200">
              <User className="w-3.5 h-3.5 text-slate-500" />
              {log.profiles?.email || log.user_id}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-xs text-slate-700 border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {new Date(log.created_at).toLocaleTimeString()}
            </div>
            {log.pii_entities_found > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-xs text-amber-700 border border-amber-200">
                <Eye className="w-3.5 h-3.5" />
                {log.pii_entities_found} PII entities masked
              </div>
            )}
          </div>

          {/* Status & Threat reason */}
          <div className={`px-4 py-3 rounded-xl border text-sm ${
            log.status === 'blocked'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : log.status === 'modified'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <div className="flex items-center gap-2 font-semibold mb-1">
              <StatusIcon className="w-4 h-4" />
              Status: {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
            </div>
            {log.threat_reason && (
              <p className="text-xs font-medium mt-1">⚠ {log.threat_reason}</p>
            )}
          </div>

          {/* Diff view */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Original Prompt (User Input)
            </h4>
            <div className="bg-rose-50/40 border border-rose-200/80 rounded-xl p-4 text-sm text-slate-800 font-mono leading-relaxed whitespace-pre-wrap">
              {log.original_prompt}
            </div>
          </div>

          {log.masked_prompt && log.masked_prompt !== log.original_prompt && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Masked Prompt (Sent to LLM)
              </h4>
              <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-4 text-sm text-slate-800 font-mono leading-relaxed">
                <DiffLine original={log.original_prompt} masked={log.masked_prompt} />
              </div>
              <p className="text-xs text-slate-500 italic">↑ Highlighted tokens replaced PII before reaching the AI model</p>
            </div>
          )}

          {log.ai_response && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                AI Response (Unmasked)
              </h4>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {log.ai_response}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 shrink-0">
          <button onClick={onClose} className="btn-primary w-full shadow-sm">Close Inspector</button>
        </div>
      </div>
    </div>
  );
}
