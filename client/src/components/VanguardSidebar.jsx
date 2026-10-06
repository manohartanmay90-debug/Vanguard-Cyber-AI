import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserHistory } from '../lib/api';
import {
  Shield, MessageSquare, LayoutDashboard,
  Settings, LogOut, ChevronLeft, ChevronRight, ChevronDown,
  Sparkles, Plus, Clock, Search, Trash2,
  Lock, AlertTriangle, ShieldCheck, ShieldAlert,
  Sliders, User, Terminal, Check, MoreHorizontal, Pin
} from 'lucide-react';

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
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const displayName = profile?.email?.split('@')[0] || user?.email?.split('@')[0] || 'Security Analyst';
  const userInitial = displayName[0]?.toUpperCase() || 'V';

  // Fetch recent security logs for sidebar feed
  useEffect(() => {
    if (accessToken) {
      setLoadingLogs(true);
      fetchUserHistory(accessToken)
        .then(data => setLogs(data.slice(0, 15)))
        .catch(err => console.warn('Sidebar logs fetch:', err))
        .finally(() => setLoadingLogs(false));
    }
  }, [accessToken]);

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  // ── COLLAPSED SLIM MODE (ChatGPT style 64px) ────────────────────
  if (isCollapsed) {
    return (
      <aside className="w-16 h-full bg-slate-50 border-r border-slate-200 flex flex-col items-center py-3.5 justify-between shrink-0 select-none z-30 transition-all duration-200">
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Logo mark */}
          <button
            onClick={onToggleCollapse}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-slate-300 flex items-center justify-center text-slate-800 transition-standard group relative shadow-xs"
            title="Expand Sidebar"
          >
            <Shield className="w-5 h-5 text-slate-900 group-hover:scale-105 transition-transform" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
          </button>

          {/* New Chat Button */}
          <button
            onClick={onNewThread}
            className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-standard shadow-xs"
            title="New Chat (Ctrl+O)"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="w-8 h-[1px] bg-slate-200 my-1" />

          {/* Nav Icons */}
          <button
            onClick={() => navigate('/chat')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-standard ${
              location.pathname === '/chat'
                ? 'bg-slate-200/80 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
            title="Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 flex items-center justify-center transition-standard"
            title="Search Chats (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-standard ${
                location.pathname.startsWith('/admin')
                  ? 'bg-slate-200/80 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              title="Admin Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom User Avatar */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 flex items-center justify-center transition-standard"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-300 transition-colors"
            title="Expand Sidebar"
          >
            {userInitial}
          </button>
        </div>
      </aside>
    );
  }

  // ── EXPANDED CHATGPT STYLE SIDEBAR (260px) ──────────────────────
  return (
    <aside className="w-64 h-full bg-slate-50 border-r border-slate-200 flex flex-col justify-between shrink-0 select-none z-30 transition-all duration-200 relative">
      <div className="flex flex-col h-full min-h-0">
        {/* Top App Header */}
        <div className="p-3 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 px-1.5 py-1">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-sm text-slate-900 tracking-tight block">Vanguard AI</span>
              <span className="text-[10px] text-slate-500 font-mono">Sentinel 4o</span>
            </div>
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-standard"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons: New Chat & Search */}
        <div className="p-3 space-y-2">
          <button
            onClick={onNewThread}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-medium text-xs shadow-xs transition-standard group"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-slate-700 group-hover:scale-110 transition-transform" />
              <span>New chat</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono border border-slate-200 rounded px-1 py-0.5">Ctrl+O</span>
          </button>

          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 text-xs transition-standard"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search chats</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">⌘K</span>
          </button>
        </div>

        {/* Recent Conversations List (ChatGPT Time Groups) */}
        <div className="flex-1 overflow-y-auto px-2 space-y-4 py-1">
          {/* Today's History */}
          <div>
            <div className="px-2.5 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Recent Activity
            </div>

            {loadingLogs ? (
              <div className="p-3 text-xs text-slate-400 font-mono flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                <span>Loading logs...</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="px-3 py-4 text-xs text-slate-400 text-center font-sans">
                No recent prompts. Start a new session!
              </div>
            ) : (
              <div className="space-y-0.5">
                {logs.map((log, idx) => {
                  const isBlocked = log.status === 'blocked';
                  const title = log.prompt ? log.prompt.slice(0, 32) + (log.prompt.length > 32 ? '…' : '') : 'Security Query';
                  return (
                    <button
                      key={log.id || idx}
                      onClick={() => onSelectPrompt && onSelectPrompt(log.prompt)}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 transition-standard group relative"
                    >
                      <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                        {isBlocked ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        ) : (
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
                        )}
                        <span className="truncate">{title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Admin Link if authorized */}
        {isAdmin && (
          <div className="p-2 border-t border-slate-200/80">
            <button
              onClick={() => navigate('/admin')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-standard ${
                location.pathname.startsWith('/admin')
                  ? 'bg-slate-200/80 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-600" />
              <span>SOC2 Admin Console</span>
            </button>
          </div>
        )}

        {/* ChatGPT Style Bottom User Profile Card */}
        <div className="p-2 border-t border-slate-200/80 relative">
          {userMenuOpen && (
            <div
              className="absolute bottom-16 left-2 right-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 space-y-1 z-40 animate-slide-up"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  onOpenSettings();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Settings & Parameters</span>
              </button>

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Prompt Search</span>
              </button>

              <div className="h-[1px] bg-slate-100 my-1" />

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Log out</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setUserMenuOpen(prev => !prev)}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-200/60 transition-standard group"
          >
            <div className="flex items-center gap-2.5 truncate min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                {userInitial}
              </div>
              <div className="text-left truncate">
                <p className="text-xs font-semibold text-slate-900 truncate leading-tight">{displayName}</p>
                <p className="text-[10px] text-slate-500 font-mono">Enterprise Plan</p>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );
}
