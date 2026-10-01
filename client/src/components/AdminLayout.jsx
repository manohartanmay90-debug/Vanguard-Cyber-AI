import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LayoutDashboard, FileText, LogOut, MessageSquare, ChevronRight } from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Overview', Icon: LayoutDashboard, end: true },
  { to: '/admin/logs', label: 'Audit Logs', Icon: FileText, end: false },
];

export default function AdminLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  return (
    <div className="h-screen flex bg-surface-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/5 flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-100 leading-none">Aegis AI</p>
              <p className="text-xs text-brand-400 mt-0.5 font-medium">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-3">Navigation</p>
          {navItems.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              id={`nav-${label.toLowerCase().replace(' ', '-')}`}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
              <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-30" />
            </NavLink>
          ))}

          <div className="pt-4 mt-4 border-t border-white/5">
            <NavLink
              to="/chat"
              id="nav-chat"
              className="sidebar-link"
            >
              <MessageSquare className="w-4 h-4" />
              Go to Chat
              <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-30" />
            </NavLink>
          </div>
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-600/30 flex items-center justify-center border border-brand-500/30">
              <span className="text-xs font-bold text-brand-400">
                {profile?.email?.[0]?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-300 font-medium truncate">{profile?.email}</p>
              <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider">Admin</p>
            </div>
          </div>
          <button
            id="admin-signout"
            onClick={handleSignOut}
            className="sidebar-link w-full text-danger-400 hover:text-danger-300 hover:bg-danger-500/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
