import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserHistory } from '../lib/api';
import {
  Shield, MessageSquare, LayoutDashboard, FileText,
  Settings, LogOut, ChevronLeft, ChevronRight, ChevronDown,
  Building2, Sparkles, Plus, Clock, Search, Trash2,
  Lock, AlertTriangle, ShieldCheck, ShieldAlert
} from 'lucide-react';

const WORKSPACES = [
  { id: 'prod', name: 'Vanguard Prod', tier: 'SOC2 Type II', color: 'from-blue-600 to-indigo-600' },
  { id: 'secops', name: 'SecOps Enclave', tier: 'High Sensitivity', color: 'from-emerald-600 to-teal-600' },
  { id: 'sandbox', name: 'Sandbox Enclave', tier: 'Debug Enclave', color: 'from-slate-600 to-slate-700' },
];

export default function VanguardSidebar({
  isCollapsed,
  onToggleCollapse,
  onOpenSettings,
  onOpenSearch,
  onNewThread,
  onSelectPrompt,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isAdmin, signOut, accessToken } = useAuth();
  const [workspaceMenu, setWorkspaceMenu] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(WORKSPACES[0]);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const displayName = profile?.email?.split('@')[0] || user?.email?.split('@')[0] || 'Analyst';
  const userInitial = displayName[0]?.toUpperCase() || 'V';

  // Fetch recent security logs for sidebar feed
  useEffect(() => {
    if (accessToken) {
      setLoadingLogs(true);
      fetchUserHistory(accessToken)
        .then(data => setLogs(data.slice(0, 8)))
        .catch(err => console.warn('Sidebar logs fetch:', err))
        .finally(() => setLoadingLogs(false));
    }
  }, [accessToken]);

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  // ── COLLAPSED SLIM MODE (68px) ──────────────────────────────────
  if (isCollapsed) {
    return (
      <aside className="w-16 h-full bg-white border-r border-slate-200 flex flex-col items-center py-3.5 justify-between shrink-0 select-none z-30 transition-standard shadow-sm">
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Logo mark */}
          <button
            onClick={onToggleCollapse}
            className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-400 flex items-center justify-center text-blue-600 transition-standard group relative shadow-sm"
            title="Expand Sidebar"
          >
            <Shield className="w-5 h-5 text-blue-600 group-hover:scale-105 transition-transform" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
          </button>

          {/* New Chat Button */}
          <button
            onClick={onNewThread}
            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-standard shadow-sm"
            title="New Chat Session"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="w-8 h-[1px] bg-slate-200 my-1" />

          {/* Nav Icons */}
          <button
            onClick={() => navigate('/chat')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-standard ${
              location.pathname === '/chat'
                ? 'bg-blue-50 text-blue-600 border border-blue-200 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Chat Gateway"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-standard"
            title="Search Security History (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-standard ${
                location.pathname.startsWith('/admin')
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Admin Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom Expand Toggle */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-standard"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-standard"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  // ── FULL EXPANDED MODE (260px) ──────────────────────────────────
  return (
    <aside className="w-64 xl:w-72 h-full bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none z-30 transition-standard shadow-sm">
      {/* Top Header & Brand */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand bar */}
        <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm tracking-tight block leading-none">
                Vanguard Cyber AI
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Enterprise v2.5</span>
            </div>
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-standard"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Switcher */}
        <div className="p-3 border-b border-slate-200/80 relative">
          <button
            onClick={() => setWorkspaceMenu(!workspaceMenu)}
            className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition-standard text-xs"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${currentWorkspace.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                {currentWorkspace.name[0]}
              </div>
              <div className="text-left truncate">
                <span className="font-semibold text-slate-800 block truncate">{currentWorkspace.name}</span>
                <span className="text-[10px] text-slate-500">{currentWorkspace.tier}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Workspace Menu Dropdown */}
          {workspaceMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setWorkspaceMenu(false)} />
              <div className="absolute top-full left-3 right-3 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-40 animate-slide-up">
                {WORKSPACES.map(ws => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setCurrentWorkspace(ws);
                      setWorkspaceMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-standard ${
                      ws.id === currentWorkspace.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className={`w-4 h-4 rounded bg-gradient-to-br ${ws.color} flex items-center justify-center text-[9px] font-bold text-white`}>
                        {ws.name[0]}
                      </div>
                      <span className="truncate">{ws.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Primary Action Button: New Threat Session */}
        <div className="px-3 pt-3">
          <button
            onClick={onNewThread}
            className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-standard shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat Session</span>
          </button>
        </div>

        {/* Scrollable Navigation & Security Logs Feed */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 px-2 block mb-1">
              Modules
            </span>
            <button
              onClick={() => navigate('/chat')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-standard ${
                location.pathname === '/chat'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Chat Gateway</span>
            </button>

            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-standard"
            >
              <span className="flex items-center gap-2.5">
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>Search History</span>
              </span>
              <span className="text-[10px] font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">⌘K</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-standard ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>

          {/* Section: Historical Security Logs Stream */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                Security Logs
              </span>
              <span className="text-[10px] font-mono text-slate-400">{logs.length} logged</span>
            </div>

            {logs.length === 0 ? (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-400">No prompt logs yet</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                {logs.map((item) => {
                  const isBlocked = item.status === 'blocked';
                  const isModified = item.status === 'modified';
                  const time = item.created_at
                    ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--:--';

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectPrompt?.(item.original_prompt)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200 transition-standard text-left group shadow-xs"
                      title={item.original_prompt}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isBlocked
                              ? 'bg-rose-500'
                              : isModified
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`} />
                          {time}
                        </span>
                        <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded font-mono ${
                          isBlocked
                            ? 'bg-rose-100 text-rose-700'
                            : isModified
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-mono truncate leading-tight group-hover:text-slate-900 font-medium">
                        {item.original_prompt || 'Encrypted prompt'}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom User Profile & Sign Out Bar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center text-xs font-bold">
                {userInitial}
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold text-slate-900 block truncate">{displayName}</span>
                <span className="text-[10px] text-emerald-600 font-mono font-medium">SOC2 Authenticated</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onOpenSettings}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-standard"
                title="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-standard"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
