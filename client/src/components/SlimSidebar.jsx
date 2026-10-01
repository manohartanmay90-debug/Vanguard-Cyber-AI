import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield, MessageSquare, LayoutDashboard, FileText,
  Settings, LogOut, Check, ChevronRight, Building2,
  Sparkles, Bell, Radio, Lock, Search
} from 'lucide-react';

const WORKSPACES = [
  { id: 'prod', name: 'Aegis Enterprise (Prod)', tier: 'SOC2 Type II', active: true, color: 'from-brand-500 to-indigo-600' },
  { id: 'secops', name: 'SecOps Threat Hunting', tier: 'High Sensitivity', active: false, color: 'from-emerald-500 to-teal-600' },
  { id: 'sandbox', name: 'Developer Sandbox', tier: 'Debug Enclave', active: false, color: 'from-amber-500 to-orange-600' },
];

export default function SlimSidebar({ onOpenSettings, onOpenSearch, activeView = 'chat' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(WORKSPACES[0]);

  const displayName = profile?.email?.split('@')[0] || user?.email?.split('@')[0] || 'User';
  const userInitial = displayName[0]?.toUpperCase() || 'U';

  const isChat = location.pathname === '/chat';
  const isAdminOverview = location.pathname === '/admin';
  const isAdminLogs = location.pathname === '/admin/logs';

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  return (
    <aside className="w-16 sm:w-20 bg-[#0a0b0e] border-r border-white/[0.07] flex flex-col items-center py-4 justify-between shrink-0 select-none z-30 relative shadow-2xl">
      {/* Top Section: Brand + Workspace Switcher */}
      <div className="flex flex-col items-center gap-5 w-full">
        {/* Aegis Circular Brand Logo */}
        <div className="group relative">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-violet-500 p-[1.5px] shadow-lg shadow-brand-900/40 hover:shadow-brand-500/30 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="w-full h-full bg-[#0d0e14] rounded-2xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-300 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
            </div>
          </div>
          {/* Tooltip */}
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#181a24] text-slate-100 text-xs font-semibold rounded-lg shadow-xl border border-white/10 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Aegis AI Firewall v2.4
          </div>
        </div>

        {/* Workspace Switcher */}
        <div className="relative w-full flex justify-center px-2">
          <button
            onClick={() => setShowWorkspaceMenu(prev => !prev)}
            className="w-10 h-10 rounded-xl bg-surface-800/80 hover:bg-surface-700/80 border border-white/[0.08] hover:border-brand-500/30 flex items-center justify-center transition-all group relative"
            title="Switch Workspace"
          >
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${currentWorkspace.color} flex items-center justify-center text-[11px] font-bold text-white shadow-sm`}>
              {currentWorkspace.name[0]}
            </div>
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0b0e]" />
          </button>

          {/* Workspace Dropdown Popover */}
          {showWorkspaceMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowWorkspaceMenu(false)}
              />
              <div className="absolute left-full ml-3 top-0 w-64 bg-[#12141c] border border-white/10 rounded-2xl shadow-2xl p-2.5 z-50 animate-slide-up">
                <div className="px-2.5 py-1.5 mb-1.5 border-b border-white/[0.06]">
                  <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-500">Active Workspace</p>
                  <p className="text-xs font-medium text-slate-200 truncate">{currentWorkspace.name}</p>
                </div>
                <div className="space-y-1">
                  {WORKSPACES.map(ws => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        setCurrentWorkspace(ws);
                        setShowWorkspaceMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all text-xs ${
                        ws.id === currentWorkspace.id
                          ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${ws.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                          {ws.name[0]}
                        </div>
                        <div className="truncate">
                          <p className="font-medium truncate">{ws.name}</p>
                          <p className="text-[10px] text-slate-500">{ws.tier}</p>
                        </div>
                      </div>
                      {ws.id === currentWorkspace.id && (
                        <Check className="w-3.5 h-3.5 text-brand-400 shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-white/[0.06] px-1">
                  <div className="flex items-center gap-2 text-[11px] text-emerald-400/90 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Gateway: 99.98% uptime</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-8 h-[1px] bg-white/[0.08]" />

        {/* Navigation Icons */}
        <nav className="flex flex-col items-center gap-2.5 w-full">
          {/* Chat / Assistant */}
          <div className="relative group w-full flex justify-center">
            <button
              onClick={() => navigate('/chat')}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 relative ${
                isChat
                  ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-lg shadow-brand-900/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              {isChat && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-400 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              )}
            </button>
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#181a24] text-slate-100 text-xs font-medium rounded-lg shadow-xl border border-white/10 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              Aegis Chat
            </div>
          </div>

          {/* Search History */}
          <div className="relative group w-full flex justify-center">
            <button
              onClick={onOpenSearch}
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]"
              title="Search History (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#181a24] text-slate-100 text-xs font-medium rounded-lg shadow-xl border border-white/10 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center gap-1.5">
              <span>Search History</span>
              <span className="text-[10px] text-brand-300 font-mono bg-white/[0.08] px-1 py-0.2 rounded">Ctrl+K</span>
            </div>
          </div>

          {/* Admin Dashboard */}
          {isAdmin && (
            <div className="relative group w-full flex justify-center">
              <button
                onClick={() => navigate('/admin')}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 relative ${
                  isAdminOverview
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-lg shadow-brand-900/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                {isAdminOverview && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-400 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
              </button>
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#181a24] text-slate-100 text-xs font-medium rounded-lg shadow-xl border border-white/10 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Security Overview
              </div>
            </div>
          )}

          {/* Audit Logs */}
          {isAdmin && (
            <div className="relative group w-full flex justify-center">
              <button
                onClick={() => navigate('/admin/logs')}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 relative ${
                  isAdminLogs
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-lg shadow-brand-900/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]'
                }`}
              >
                <FileText className="w-5 h-5" />
                {isAdminLogs && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-400 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
              </button>
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#181a24] text-slate-100 text-xs font-medium rounded-lg shadow-xl border border-white/10 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Audit Logs
              </div>
            </div>
          )}

          {/* Firewall Shield Status */}
          <div className="relative group w-full flex justify-center">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer">
              <Lock className="w-4 h-4" />
            </div>
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#181a24] text-slate-100 text-xs font-medium rounded-lg shadow-xl border border-white/10 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              Firewall Active · PII Guarded
            </div>
          </div>
        </nav>
      </div>

      {/* Bottom Section: Settings, User Avatar, Logout */}
      <div className="flex flex-col items-center gap-3 w-full">
        {/* Settings Button */}
        <div className="relative group w-full flex justify-center">
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] flex items-center justify-center transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#181a24] text-slate-100 text-xs font-medium rounded-lg shadow-xl border border-white/10 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Firewall Settings
          </div>
        </div>

        {/* User Avatar */}
        <div className="relative group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-surface-700 to-surface-600 border border-white/10 flex items-center justify-center shadow-md relative cursor-pointer">
            <span className="text-xs font-bold text-brand-300">{userInitial}</span>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0b0e]" />
          </div>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#181a24] text-slate-100 text-xs font-medium rounded-lg shadow-xl border border-white/10 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            {displayName} {isAdmin && '• Admin'}
          </div>
        </div>

        {/* Sign Out */}
        <div className="relative group w-full flex justify-center">
          <button
            onClick={handleSignOut}
            className="w-10 h-10 rounded-xl text-slate-500 hover:text-danger-400 hover:bg-danger-500/10 flex items-center justify-center transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#181a24] text-danger-300 text-xs font-medium rounded-lg shadow-xl border border-white/10 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Sign Out
          </div>
        </div>
      </div>
    </aside>
  );
}
