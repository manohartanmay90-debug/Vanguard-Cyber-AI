import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAdminStats } from '../lib/api';
import StatCard from '../components/StatCard';
import {
  ShieldAlert, ShieldCheck, Shield, Eye, Activity, RefreshCw, TrendingUp
} from 'lucide-react';

function ActivityBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="text-slate-300 tabular-nums">{count} <span className="text-slate-600">({pct}%)</span></span>
      </div>
      <div className="h-2 rounded-full bg-surface-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadStats() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminStats(accessToken);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStats(); }, [accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-brand-600/30 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading metrics…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="glass-card p-8 text-center max-w-md">
          <ShieldAlert className="w-12 h-12 text-danger-400 mx-auto mb-4" />
          <p className="text-slate-300 font-semibold mb-2">Failed to load stats</p>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <button onClick={loadStats} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  const safeRate = stats?.total > 0
    ? Math.round((stats.passed / stats.total) * 100)
    : 100;

  return (
    <div className="p-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Security Overview</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time telemetry across all enterprise AI interactions</p>
        </div>
        <button
          id="refresh-stats"
          onClick={loadStats}
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Interactions"
          value={stats?.total ?? 0}
          subtitle="All-time AI calls"
          icon={Activity}
          color="brand"
        />
        <StatCard
          title="Threats Blocked"
          value={stats?.blocked ?? 0}
          subtitle="Jailbreaks & injections stopped"
          icon={ShieldAlert}
          color="danger"
        />
        <StatCard
          title="PII Redactions"
          value={stats?.totalPiiMasked ?? 0}
          subtitle="Data entities protected"
          icon={Eye}
          color="warning"
        />
        <StatCard
          title="Safe Calls"
          value={stats?.passed ?? 0}
          subtitle={`${safeRate}% safety rate`}
          icon={ShieldCheck}
          color="success"
        />
      </div>

      {/* Distribution chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-brand-400" />
            <h3 className="font-semibold text-slate-200">Request Distribution</h3>
          </div>
          <div className="space-y-4">
            <ActivityBar label="Passed (Safe)" count={stats?.passed ?? 0} total={stats?.total ?? 1} color="bg-success-500" />
            <ActivityBar label="Modified (PII Masked)" count={stats?.modified ?? 0} total={stats?.total ?? 1} color="bg-warning-500" />
            <ActivityBar label="Blocked (Threat)" count={stats?.blocked ?? 0} total={stats?.total ?? 1} color="bg-danger-500" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-brand-400" />
            <h3 className="font-semibold text-slate-200">Security Health</h3>
          </div>
          <div className="space-y-5">
            {/* Safety rate ring visualization */}
            <div className="flex items-center justify-center">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke="url(#grad)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50 * safeRate / 100} ${2 * Math.PI * 50}`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gradient">{safeRate}%</span>
                  <span className="text-xs text-slate-500">Safety Rate</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-success-500/10 border border-success-500/20 rounded-xl p-3">
                <p className="text-2xl font-bold text-success-400">{stats?.passed ?? 0}</p>
                <p className="text-xs text-slate-500">Passed</p>
              </div>
              <div className="bg-danger-500/10 border border-danger-500/20 rounded-xl p-3">
                <p className="text-2xl font-bold text-danger-400">{stats?.blocked ?? 0}</p>
                <p className="text-xs text-slate-500">Blocked</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
