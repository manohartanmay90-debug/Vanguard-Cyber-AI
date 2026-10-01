import { ShieldAlert, ShieldCheck, Shield, Eye, ChevronRight } from 'lucide-react';

const STATUS_CONFIG = {
  blocked: {
    label: 'Blocked',
    cls: 'badge-blocked',
    Icon: ShieldAlert,
    row: 'hover:bg-danger-500/5 border-l-danger-500',
  },
  modified: {
    label: 'Modified',
    cls: 'badge-modified',
    Icon: Shield,
    row: 'hover:bg-warning-500/5 border-l-warning-500',
  },
  passed: {
    label: 'Passed',
    cls: 'badge-passed',
    Icon: ShieldCheck,
    row: 'hover:bg-success-500/5 border-l-success-500',
  },
};

function truncate(str, n) {
  return str?.length > n ? str.slice(0, n) + '…' : str ?? '—';
}

export default function LogsTable({ logs, onSelectLog }) {
  if (!logs?.length) {
    return (
      <div className="glass-card p-16 text-center animate-fade-in">
        <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 font-medium">No logs found</p>
        <p className="text-slate-600 text-sm mt-1">Logs will appear here after users submit prompts</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" id="logs-table">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Status</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">User</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Prompt Preview</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">PII Found</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Timestamp</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log) => {
              const cfg = STATUS_CONFIG[log.status] || STATUS_CONFIG.passed;
              return (
                <tr
                  key={log.id}
                  onClick={() => onSelectLog(log)}
                  className={`cursor-pointer border-l-2 ${cfg.row} transition-all duration-150 group`}
                >
                  <td className="px-5 py-4">
                    <span className={cfg.cls}>
                      <cfg.Icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-xs">
                    {log.profiles?.email || log.user_id?.slice(0, 8) + '…'}
                  </td>
                  <td className="px-5 py-4 text-slate-300 max-w-xs">
                    <span className="font-mono text-xs">{truncate(log.original_prompt, 80)}</span>
                    {log.threat_reason && (
                      <p className="text-xs text-danger-400/80 mt-0.5 truncate">{log.threat_reason}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {log.pii_entities_found > 0 ? (
                      <span className="flex items-center gap-1 text-warning-400 text-xs">
                        <Eye className="w-3.5 h-3.5" />
                        {log.pii_entities_found}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
