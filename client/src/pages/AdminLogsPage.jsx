import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAdminLogs } from '../lib/api';
import LogsTable from '../components/LogsTable';
import ExplainabilityPanel from '../components/ExplainabilityPanel';
import { RefreshCw, Search, Filter, ShieldAlert, FileText } from 'lucide-react';

const STATUS_OPTIONS = ['all', 'passed', 'modified', 'blocked'];
const DATE_OPTIONS = [
  { label: 'All Time', value: 'all' },
  { label: 'Last 24 Hours', value: '24h' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
];

function withinRange(dateStr, range) {
  if (range === 'all') return true;
  const d = new Date(dateStr);
  const now = new Date();
  const ms = { '24h': 86400000, '7d': 604800000, '30d': 2592000000 }[range];
  return now - d <= ms;
}

export default function AdminLogsPage() {
  const { accessToken } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [search, setSearch] = useState('');

  async function loadLogs() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminLogs(accessToken);
      setLogs(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadLogs(); }, [accessToken]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchStatus = statusFilter === 'all' || log.status === statusFilter;
      const matchDate = withinRange(log.created_at, dateFilter);
      const matchSearch = search === '' || 
        log.original_prompt?.toLowerCase().includes(search.toLowerCase()) ||
        log.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
        log.threat_reason?.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchDate && matchSearch;
    });
  }, [logs, statusFilter, dateFilter, search]);

  return (
    <div className="p-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-400" />
            Audit Inspector
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {filteredLogs.length} of {logs.length} total interactions
          </p>
        </div>
        <button
          id="refresh-logs"
          onClick={loadLogs}
          disabled={loading}
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter bar */}
      <div className="glass-card p-4 mb-5 flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-slate-500 shrink-0" />

        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            id="log-search"
            type="text"
            placeholder="Search prompts, users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-sm"
          />
        </div>

        {/* Status filter */}
        <select
          id="filter-status"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="input-field py-2 text-sm w-auto capitalize bg-surface-700/50"
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        {/* Date filter */}
        <select
          id="filter-date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="input-field py-2 text-sm w-auto bg-surface-700/50"
        >
          {DATE_OPTIONS.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        {/* Reset filters */}
        {(statusFilter !== 'all' || dateFilter !== 'all' || search) && (
          <button
            id="reset-filters"
            onClick={() => { setStatusFilter('all'); setDateFilter('all'); setSearch(''); }}
            className="text-xs text-brand-400 hover:text-brand-300 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 glass-card p-4 border border-danger-500/20 bg-danger-500/10 mb-5">
          <ShieldAlert className="w-5 h-5 text-danger-400 shrink-0" />
          <p className="text-danger-300 text-sm">{error}</p>
          <button onClick={loadLogs} className="ml-auto btn-primary text-xs px-3 py-1.5">Retry</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="glass-card overflow-hidden animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-white/5">
              <div className="w-20 h-5 rounded-full bg-surface-600" />
              <div className="w-32 h-4 rounded bg-surface-600" />
              <div className="flex-1 h-4 rounded bg-surface-600" />
              <div className="w-16 h-4 rounded bg-surface-600" />
              <div className="w-24 h-4 rounded bg-surface-600" />
            </div>
          ))}
        </div>
      ) : (
        <LogsTable logs={filteredLogs} onSelectLog={setSelectedLog} />
      )}

      {/* Explainability panel */}
      {selectedLog && (
        <ExplainabilityPanel log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  );
}
