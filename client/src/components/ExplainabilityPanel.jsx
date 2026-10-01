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
    blocked: 'text-danger-400',
    modified: 'text-warning-400',
    passed: 'text-success-400',
  }[log.status];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] glass-card overflow-hidden flex flex-col animate-slide-up border border-white/10">
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <StatusIcon className={`w-5 h-5 ${statusColor}`} />
            <div>
              <h3 className="font-semibold text-slate-100">Prompt Inspector</h3>
              <p className="text-xs text-slate-500">
                {new Date(log.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            id="close-panel"
            onClick={onClose}
            className="btn-ghost p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Meta row */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-700/50 text-xs text-slate-400 border border-white/5">
              <User className="w-3.5 h-3.5" />
              {log.profiles?.email || log.user_id}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-700/50 text-xs text-slate-400 border border-white/5">
              <Clock className="w-3.5 h-3.5" />
              {new Date(log.created_at).toLocaleTimeString()}
            </div>
            {log.pii_entities_found > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning-500/10 text-xs text-warning-400 border border-warning-500/20">
                <Eye className="w-3.5 h-3.5" />
                {log.pii_entities_found} PII entities masked
              </div>
            )}
          </div>

          {/* Status & Threat reason */}
          <div className={`px-4 py-3 rounded-xl border text-sm ${
            log.status === 'blocked'
              ? 'bg-danger-500/10 border-danger-500/20 text-danger-200'
              : log.status === 'modified'
              ? 'bg-warning-500/10 border-warning-500/20 text-warning-200'
              : 'bg-success-500/10 border-success-500/20 text-success-200'
          }`}>
            <div className="flex items-center gap-2 font-semibold mb-1">
              <StatusIcon className="w-4 h-4" />
              Status: {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
            </div>
            {log.threat_reason && (
              <p className="text-xs opacity-80 mt-1">⚠ {log.threat_reason}</p>
            )}
          </div>

          {/* Diff view */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-danger-500" />
              Original Prompt (Employee Input)
            </h4>
            <div className="bg-surface-700/40 border border-danger-500/20 rounded-xl p-4 text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
              {log.original_prompt}
            </div>
          </div>

          {log.masked_prompt && log.masked_prompt !== log.original_prompt && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning-500" />
                Masked Prompt (Sent to LLM)
              </h4>
              <div className="bg-surface-700/40 border border-warning-500/20 rounded-xl p-4 text-sm text-slate-300 font-mono leading-relaxed">
                <DiffLine original={log.original_prompt} masked={log.masked_prompt} />
              </div>
              <p className="text-xs text-slate-600 italic">↑ Highlighted tokens replaced PII before reaching the AI model</p>
            </div>
          )}

          {log.ai_response && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success-500" />
                AI Response (Unmasked)
              </h4>
              <div className="bg-surface-700/40 border border-success-500/20 rounded-xl p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {log.ai_response}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/5 shrink-0">
          <button onClick={onClose} className="btn-primary w-full">Close Inspector</button>
        </div>
      </div>
    </div>
  );
}
