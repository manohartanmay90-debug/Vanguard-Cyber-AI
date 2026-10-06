import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Shield, ShieldCheck, ShieldAlert, Zap, Lock, Cpu,
  Terminal, ArrowRight, CheckCircle2, Sparkles, Activity,
  Database, Eye, EyeOff, Mail, AlertCircle, X, ChevronRight,
  Fingerprint, Radar, Layers, Flame, Code, FileText
} from 'lucide-react';
import CyberLaserGridBackground from '../components/CyberLaserGridBackground';

export default function LandingPage() {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Open Auth Modal
  const openAuth = (mode = 'login') => {
    if (session) {
      navigate('/chat');
      return;
    }
    setAuthMode(mode);
    setError('');
    setSuccess('');
    setShowAuthModal(true);
  };

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/chat', { replace: true });
        }
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess('Account created! Please check your email to confirm, then sign in.');
        setAuthMode('login');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setEmail('demo@vanguardcyber.ai');
    setPassword('VanguardDemo2026!');
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@vanguardcyber.ai',
        password: 'VanguardDemo2026!',
      });
      if (error) throw error;
      navigate('/chat', { replace: true });
    } catch (err) {
      setError(err.message || 'Demo login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#070a13] text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300 flex flex-col relative overflow-x-hidden">
      {/* ── 3D CYBER LASER GRID & SCANLINE BACKGROUND ──────────────── */}
      <CyberLaserGridBackground />

      {/* ── 1. EXECUTIVE CYBER NAVIGATION BAR ───────────────────────────── */}
      <header className="w-full h-16 border-b border-cyan-950/60 bg-[#070a13]/85 backdrop-blur-xl sticky top-0 z-40 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:border-cyan-400 transition-all">
              <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight block leading-tight">
                Vanguard<span className="text-cyan-400 font-mono">-Cyber-AI</span>
              </span>
              <span className="text-[10px] text-cyan-400/60 font-mono hidden sm:block">
                SENTINEL SEC-GATEWAY v2.5
              </span>
            </div>
          </Link>

          {/* Cross-Landing Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 ml-4">
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-xs"
            >
              Overview
            </Link>
            <Link
              to="/security"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-all flex items-center gap-1.5"
            >
              <Radar className="w-3.5 h-3.5 text-cyan-500" />
              <span>Threat Intel & Firewall</span>
            </Link>
            <Link
              to="/enterprise"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-all flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>Enterprise AI Enclaves</span>
            </Link>
          </nav>
        </div>

        {/* Live Telemetry Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span>GATEWAY: ZERO-LEAK ARMORED</span>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-3">
          {session ? (
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 transition-all"
            >
              <span>Go to Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => openAuth('login')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all group"
              >
                <span>Deploy Free</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── 2. HERO SECTION ───────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto px-6 sm:px-12 py-12 sm:py-20 flex flex-col items-center text-center relative z-10">
        {/* Top Cyber Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-6 shadow-lg shadow-cyan-500/10 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>MILITARY-GRADE AI INJECTION & DATA EXFILTRATION DEFENSE</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl leading-[1.15]">
          Autonomous AI Intelligence with <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Zero Data Leakage</span> & Threat Quarantine
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Shield your enterprise from prompt injections, credential exfiltration, and PII exposure in sub-millisecond memory before reaching AI models.
        </p>

        {/* Primary Action Button Group */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
          <button
            onClick={() => openAuth('login')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Start Defense Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#0c1222]/90 hover:bg-[#111930] border border-cyan-500/30 text-cyan-300 font-semibold text-sm shadow-md hover:border-cyan-400 transition-all"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>1-Click Live Demo</span>
          </button>
        </div>

        {/* Navigation Quick Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 w-full max-w-2xl">
          <Link
            to="/security"
            className="p-4 rounded-2xl bg-[#0c1222]/60 border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-cyan-950/20 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Radar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-cyan-300">Live Threat Simulator</p>
                <p className="text-[11px] text-slate-400">Test injection neutralizer & MITRE matrix</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/enterprise"
            className="p-4 rounded-2xl bg-[#0c1222]/60 border border-emerald-500/20 hover:border-emerald-400/60 hover:bg-emerald-950/20 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-emerald-300">Enterprise AI Enclaves</p>
                <p className="text-[11px] text-slate-400">Multi-Model failover & ROI calculator</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Security Compliance Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b1329]/80 border border-cyan-950 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            SOC2 Type II Certified
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b1329]/80 border border-cyan-950 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Autonomous PII Sanitization
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b1329]/80 border border-cyan-950 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            Gemini + Groq Dual Failover
          </span>
        </div>

        {/* ── 3. FEATURE CARDS GRID ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 w-full text-left">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-[#0b1329]/70 border border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all group backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">In-Memory PII Masking</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Autonomous regex & NER detection redacts SSNs, API tokens, passwords, and emails before the prompt ever touches external AI APIs.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-[#0b1329]/70 border border-indigo-500/20 hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">Injection Quarantine Gate</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              High-speed heuristic inspection detects adversarial jailbreak signatures, system prompt overrides, and unauthorized data exfiltration.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-[#0b1329]/70 border border-emerald-500/20 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all group backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">Ephemeral Zero-Retention</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Enable temporary incognito sessions with guaranteed zero database persistence for high-sensitivity forensic queries and audits.
            </p>
          </div>
        </div>
      </main>

      {/* ── 4. FOOTER ─────────────────────────────────────────────── */}
      <footer className="w-full border-t border-cyan-950/60 py-6 px-6 text-center text-xs text-slate-500 bg-[#070a13]">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-3 text-slate-400">
          <Link to="/" className="hover:text-cyan-400 transition-colors">Overview</Link>
          <Link to="/security" className="hover:text-cyan-400 transition-colors">Threat Intelligence & Firewall</Link>
          <Link to="/enterprise" className="hover:text-cyan-400 transition-colors">Enterprise Multi-Model Solutions</Link>
        </div>
        <p>Vanguard-Cyber-AI • Enterprise AI Security Firewall • Built for Zero-Trust AI Deployments</p>
      </footer>

      {/* ── 5. AUTH MODAL (SIGN IN / SIGN UP) ──────────────────────── */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="w-full max-w-md bg-[#0c1222] border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/50 p-6 sm:p-8 animate-slide-up relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white tracking-tight">
                  {authMode === 'login' ? 'Sign In to Vanguard' : 'Create Vanguard Account'}
                </h3>
                <p className="text-xs text-slate-400">Enter credentials to authenticate with Sentinel Gateway</p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(''); setSuccess(''); }}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  authMode === 'login' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setError(''); setSuccess(''); }}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  authMode === 'signup' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="analyst@enterprise.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#070a13] focus:bg-[#090e1a] border border-cyan-900/60 focus:border-cyan-400 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#070a13] focus:bg-[#090e1a] border border-cyan-900/60 focus:border-cyan-400 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Sign In to Console' : 'Complete Registration'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* 1-Click Demo Shortcut */}
            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>1-Click Instant Demo Login</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
