import { ShieldAlert, ShieldCheck, Shield, Eye, ChevronRight } from 'lucide-react';

const STATUS_CONFIG = {
  blocked: {
    label: 'Blocked',
    cls: 'badge-vanguard-block',
    Icon: ShieldAlert,
    row: 'hover:bg-rose-50/60 border-l-rose-500',
  },
  modified: {
    label: 'Modified',
    cls: 'badge-vanguard-warn',
    Icon: Shield,
    row: 'hover:bg-amber-50/60 border-l-amber-500',
  },
  passed: {
    label: 'Passed',
    cls: 'badge-vanguard-pass',
    Icon: ShieldCheck,
    row: 'hover:bg-emerald-50/60 border-l-emerald-500',
  },
};

function truncate(str, n) {
  return str?.length > n ? str.slice(0, n) + '…' : str ?? '—';
}

export default function LogsTable({ logs, onSelectLog }) {
  if (!logs?.length) {
    return (
      <div className="glass-card p-16 text-center animate-fade-in bg-white">
        <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-700 font-semibold">No logs found</p>
        <p className="text-slate-500 text-sm mt-1">Logs will appear here after users submit prompts</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden animate-fade-in bg-white border border-slate-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" id="logs-table">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Status</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">User</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Prompt Preview</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">PII Found</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Timestamp</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => {
              const cfg = STATUS_CONFIG[log.status] || STATUS_CONFIG.passed;
              return (
                <tr
                  key={log.id}
                  onClick={() => onSelectLog(log)}
                  className={`cursor-pointer border-l-4 ${cfg.row} transition-all duration-150 group`}
                >
                  <td className="px-5 py-4">
                    <span className={cfg.cls}>
                      <cfg.Icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600 text-xs font-medium">
                    {log.profiles?.email || log.user_id?.slice(0, 8) + '…'}
                  </td>
                  <td className="px-5 py-4 text-slate-900 max-w-xs">
                    <span className="font-mono text-xs">{truncate(log.original_prompt, 80)}</span>
                    {log.threat_reason && (
                      <p className="text-xs text-rose-600 mt-0.5 truncate font-medium">{log.threat_reason}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {log.pii_entities_found > 0 ? (
                      <span className="flex items-center gap-1 text-amber-700 font-semibold text-xs">
                        <Eye className="w-3.5 h-3.5" />
                        {log.pii_entities_found}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
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
