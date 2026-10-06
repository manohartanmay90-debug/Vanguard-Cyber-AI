import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import SecurityPage from './pages/SecurityPage';
import EnterprisePage from './pages/EnterprisePage';
import ChatPage from './pages/ChatPage';
import AdminOverviewPage from './pages/AdminOverviewPage';
import AdminLogsPage from './pages/AdminLogsPage';
import AdminLayout from './components/AdminLayout';

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  if (loading) return <AppLoader />;
  if (!session) return <Navigate to="/" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { session, profile, loading } = useAuth();
  if (loading) return <AppLoader />;
  if (!session) return <Navigate to="/" replace />;
  if (profile && profile.role !== 'admin') return <Navigate to="/chat" replace />;
  return children;
}

function AppLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070a13]">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
          <div className="relative w-12 h-12 rounded-full bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-cyan-400" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
        </div>
        <p className="text-slate-400 text-sm font-semibold tracking-wide font-mono">INITIALIZING VANGUARD SENTINEL…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/enterprise" element={<EnterprisePage />} />
          <Route path="/login" element={<LandingPage />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="logs" element={<AdminLogsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
